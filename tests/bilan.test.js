const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const read = name => readFileSync(join(__dirname, "..", name), "utf8");
const app = read("app.js");
const data = read("data.js");

function report(profile, prepareResults = () => ({})) {
  const main = { innerHTML: "", querySelectorAll: () => [] };
  const reportTab = {
    dataset: { view: "report" },
    classList: { toggle() {} },
    addEventListener(_, handler) { this.click = handler; }
  };
  const button = { addEventListener() {} };
  const context = vm.createContext({
    window: { scrollTo() {} },
    location: { hostname: "localhost" },
    document: {
      querySelectorAll: () => [reportTab],
      getElementById(id) {
        if (id === "main") return main;
        if (id === "homeBtn" || main.innerHTML.includes(`id="${id}"`)) return button;
        return null;
      }
    }
  });
  vm.runInContext(data, context);
  context.savedState = { profile, results: prepareResults(context.window.MISSIONS) };
  // Injecter un état de partie sans exposer l'état interne dans le jeu.
  const loader = "function load(){ return null; }";
  assert.ok(app.includes(loader));
  vm.runInContext(app.replace(loader, "function load(){ return savedState; }"), context);
  reportTab.click();
  return main.innerHTML;
}

function finished(missions, numbers, cat = "sur", pts = 10) {
  return Object.fromEntries(missions.filter(m => numbers.includes(m.num)).map(m => [m.id, {
    done: true,
    steps: m.steps.map(s => ({ cat, pts, q: s.q }))
  }]));
}

function assertReport(html, verdict, score, color) {
  assert.match(html, new RegExp(`<h1[^>]*>${verdict}</h1>`));
  assert.match(html, new RegExp(`aria-label="Score ${score} %"`));
  assert.match(html, new RegExp(`stroke="${color}"[^>]+stroke-dasharray=`));
}

test("neuf décisions sûres et une décision à risque donnent 90 % et un bilan rouge", () => {
  const html = report("complet", missions => {
    const results = finished(missions, [1, 2]);
    const [first, , third] = missions;
    results[first.id].steps[1] = { cat: "risque", pts: 0, q: first.steps[1].q, choix: "Choix à revoir" };
    results[third.id] = { done: false, steps: [{ cat: "sur", pts: 10, q: third.steps[0].q }] };
    return results;
  });
  assertReport(html, "Circuit à risque : reprise conseillée", 90, "#b13a2b");
  assert.match(html, /90 points sur 100/);
  assert.match(html, /Décisions sûres<b>9/);
  assert.match(html, /Risque infectieux<b>1/);
  assert.match(html, /Parcours incomplet · 2\/7 missions requises terminées/);
  assert.match(html, /Votre choix : Choix à revoir/);
  assert.doesNotMatch(html, /id="att"/);
});

const profiles = [
  ["terrain", [1, 2, 3, 4, 5, 6]],
  ["eoh", [4, 5, 6, 7]],
  ["complet", [1, 2, 3, 4, 5, 6, 7]]
];

for (const [profile, required] of profiles) {
  test(`${profile} : à 100 %, une mission requise non terminée laisse le bilan incomplet`, () => {
    const html = report(profile, missions => {
      const results = finished(missions, required.slice(1));
      const mission = missions[required[0] - 1];
      results[mission.id] = { ...finished(missions, [mission.num])[mission.id], done: false };
      return results;
    });
    assertReport(html, "Parcours incomplet", 100, "#5d6d6a");
    assert.ok(html.includes(`${required.length - 1}/${required.length} missions requises terminées`));
    assert.doesNotMatch(html, /id="att"/);
  });

  test(`${profile} : toutes les missions requises et des décisions sûres donnent un bilan vert`, () => {
    const html = report(profile, missions => finished(missions, required));
    assertReport(html, "Circuit maîtrisé", 100, "#1d7349");
    assert.ok(html.includes(`Parcours terminé · ${required.length}/${required.length} missions requises terminées`));
    assert.match(html, /id="att"/);
  });
}

test("un parcours terrain terminé reste à risque si une décision hors profil a été enregistrée à risque", () => {
  const html = report("terrain", missions => {
    const results = finished(missions, [1, 2, 3, 4, 5, 6, 7]);
    const extraMission = missions[6];
    results[extraMission.id].steps[0] = { cat: "risque", pts: 0, q: extraMission.steps[0].q };
    return results;
  });
  assertReport(html, "Circuit à risque : reprise conseillée", 97, "#b13a2b");
  assert.match(html, /Parcours terminé · 6\/6 missions requises terminées/);
  assert.match(html, /id="att"/);
});

test("un parcours complet à 70 % sans décision à risque reste à consolider", () => {
  const html = report("complet", missions => finished(missions, [1, 2, 3, 4, 5, 6, 7], "partiel", 7));
  assertReport(html, "Circuit à consolider", 70, "#9a6210");
});

test("sans profil choisi, les sept missions sont requises", () => {
  const html = report(null, missions => finished(missions, [1, 2, 3, 4, 5, 6]));
  assertReport(html, "Parcours incomplet", 100, "#5d6d6a");
  assert.match(html, /6\/7 missions requises terminées/);
});

test("avant toute décision, le rapport indique que le parcours est incomplet", () => {
  const html = report("eoh");
  assert.match(html, /Parcours incomplet · 0\/4 missions requises terminées/);
  assert.doesNotMatch(html, /class="ring"|id="att"/);
});
