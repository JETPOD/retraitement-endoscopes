# Retraitement des endoscopes : une journée en salle de désinfection

Jouer : https://jetpod.github.io/retraitement-endoscopes/

Serious game statique (HTML/CSS/JS, sans dépendance) sur le traitement des endoscopes souples thermosensibles à canaux : pré-traitement, test d'étanchéité, nettoyage manuel, mise en LDE, LDE non fonctionnel, stockage, prélèvements non conformes.

- 7 missions, 34 décisions, débriefing sourcé, aide-mémoire, rapport imprimable.
- Contenu dans `data.js` (modifiable sans toucher au moteur `app.js`).
- Mesure d'audience Plausible agrégée (sans score ni réponse), chargée uniquement sur jetpod.github.io/retraitement-endoscopes/. Liste des objectifs : `GOALS.txt`.

Prototype pédagogique : scénarios fictifs, relecture EOH/CLIN nécessaire avant usage institutionnel. Le protocole local et les notices des fabricants prévalent.

## Attestation de fin de parcours

Le module commun `attestation.js` propose, à la fin d'un module ou d'un parcours complet, une attestation nominative imprimable (A4 paysage, impression ou PDF via le navigateur). Elle n'affiche que le palier atteint, jamais le score :

- **Réussite avec excellence** : au moins 95 % de réponses adaptées, sans erreur critique ;
- **Réussite** : au moins 80 %, sans erreur critique (seuil de réussite) ;
- **Participation** : en dessous du seuil.

Signature : Dr Jean-Etienne Podik, EOH AHNAC. Mention : outil pédagogique à partir de cas fictifs, sans valeur de validation des compétences ni d'action de DPC. Le nom saisi reste sur l'appareil ; seul l'événement de palier est compté par Plausible, commun à tous les jeux du site (filtrer par page pour un jeu donné) :

```
Attestation · Participation
Attestation · Réussite
Attestation · Excellence
```
