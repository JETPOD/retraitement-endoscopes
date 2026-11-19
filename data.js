/* Contenu pédagogique : scénarios fictifs, à relire par l'EOH avant usage institutionnel. */
window.SOURCES = {
  instr2016: {
    label: "Instruction DGOS/PF2/DGS/VSS1 n° 2016/220 du 4 juillet 2016 et guide technique annexé",
    url: "https://sante.gouv.fr/fichiers/bo/2016/16-08/ste_20160008_0000_0032.pdf"
  },
  guide2016: {
    label: "Guide technique de traitement des endoscopes souples thermosensibles à canaux (2016)",
    url: "https://peps.sante.gouv.fr/themes/endoscopes/16_guide_ministere.pdf"
  },
  instr2018: {
    label: "Instruction DGOS/PF2/DGS/VVS1/PP3 n° 2018/195 du 2 août 2018 (duodénoscopes)",
    url: "https://www.legifrance.gouv.fr/circulaire/id/43880"
  },
  faq1: {
    label: "FAQ du guide technique, ministère chargé de la santé",
    url: "https://sante.gouv.fr/IMG/pdf/faq_instruction_traitement_des_endoscopes.pdf"
  },
  faq2: {
    label: "FAQ n° 2 « Traitement des endoscopes souples thermosensibles à canaux », DGOS, 2019",
    url: "https://sante.gouv.fr/IMG/pdf/dgos_faq_2_traitement_endoscopes_060819-2.pdf"
  },
  hcsp2013: {
    label: "Avis du HCSP sur les enceintes de stockage d'endoscopes thermosensibles (ESET), 2013",
    url: "https://www.hcsp.fr/Explore.cgi/Telecharger?NomFichier=hcspa20130626_enceintestockendoscothermosens.pdf"
  },
  lde2003: {
    label: "Guide pour l'utilisation des laveurs-désinfecteurs d'endoscopes, ministère, 2003",
    url: "https://sante.gouv.fr/IMG/pdf/ide_def241103.pdf"
  },
  cpiasOcc: {
    label: "CPias Occitanie, interprétation des résultats des contrôles microbiologiques des endoscopes",
    url: "https://cpias-occitanie.fr/wp-content/uploads/2023/05/Interpretation-des-res-des-controles-%C2%B5B-des-endoscopes.pdf"
  },
  cpiasGE: {
    label: "CPias Grand Est, guide méthodologique de l'audit endoscopie, 2026",
    url: "https://cpias-grand-est.fr/wp-content/files/2026/11/Guide_methodologique_audit_endoscopie_CPias_GE_2026.pdf"
  }
};

/* Catégories de décision
   sur     : décision sûre
   risque  : risque infectieux pour le patient
   exces   : mesure excessive (immobilisation ou action injustifiée)
   trace   : écart de traçabilité ou d'organisation
*/

window.MISSIONS = [
/* ───────────────────────────── M1 ───────────────────────────── */
{
  id: "pretraitement",
  num: 1,
  titre: "Pré-traitement en salle",
  lieu: "Salle d'examen 2",
  heure: "09 h 40",
  publics: ["terrain"],
  intro: "Fin d'une coloscopie avec polypectomie. Le coloscope « CF-07 » vient d'être retiré. L'opérateur dicte déjà son compte rendu, le patient suivant attend dans le couloir.",
  steps: [
    {
      type: "order",
      q: "Remettez les gestes du pré-traitement dans le bon ordre.",
      items: [
        "Essuyer la gaine avec un support à usage unique",
        "Aspirer-insuffler tous les canaux dans un récipient d'eau pour soins standard",
        "Déconnecter l'endoscope de la colonne",
        "Placer l'endoscope dans un contenant fermé étiqueté « sale »",
        "Transporter immédiatement vers la salle de désinfection"
      ],
      fb: "Le pré-traitement se fait immédiatement après l'acte, en salle d'examen : essuyage externe à usage unique, aspiration-insufflation de tous les canaux (avec le piston d'insufflation forcée ou celui indiqué par le fabricant), puis transport immédiat, à sec, dans un contenant fermé ou un plateau recouvert, étiqueté « sale ».",
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "L'interne propose : « On le laisse sur le chariot, on le traitera après le patient suivant. » Que faites-vous ?",
      options: [
        { t: "J'accepte : le nettoyage manuel rattrapera le délai.", cat: "risque", fb: "Le délai laisse sécher les souillures dans les canaux. Elles adhèrent, favorisent le biofilm et deviennent difficiles à éliminer, même par un nettoyage soigneux." },
        { t: "Je fais le pré-traitement maintenant, en salle, puis j'envoie l'endoscope sans attendre en salle de désinfection.", cat: "sur", fb: "C'est la règle : pré-traitement immédiat dans la salle d'examen, puis premier nettoyage sans délai." },
        { t: "Je le plonge directement dans le bac de détergent de la salle de désinfection, sans pré-traitement.", cat: "risque", fb: "Sauter le pré-traitement laisse les canaux chargés de matières organiques. Et aucun endoscope ne doit être immergé avant le test d'étanchéité." },
        { t: "Je le laisse tremper dans le bocal d'aspiration en attendant.", cat: "risque", fb: "Le bocal n'est pas un bain de traitement. L'immersion avant le test d'étanchéité expose à une infiltration d'eau si l'endoscope fuit." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Vous remarquez que le bocal d'eau d'aspiration n'a pas été changé depuis le début du programme (4 examens). Quelle est la bonne pratique ?",
      options: [
        { t: "Le changer à la fin de la matinée.", cat: "risque", fb: "L'eau d'aspiration se charge des souillures de chaque patient. Elle se renouvelle après chaque endoscopie." },
        { t: "Ajouter du détergent-désinfectant et le garder pour la journée.", cat: "risque", fb: "Ajouter un produit ne remplace pas le renouvellement. L'instruction prévoit de l'eau pour soins standard, renouvelée après chaque endoscopie." },
        { t: "Renouveler l'eau après chaque endoscopie.", cat: "sur", fb: "Exact : un récipient d'eau pour soins standard, renouvelé après chaque endoscopie." },
        { t: "Utiliser de l'eau stérile pour pouvoir garder le même bocal toute la journée.", cat: "exces", fb: "L'eau stérile n'est pas requise pour le pré-traitement, et elle ne permet pas de garder le même bocal. Le renouvellement après chaque examen reste la règle." }
      ],
      ref: "instr2016"
    },
    {
      type: "multi",
      q: "Le transport vers la salle de désinfection. Cochez les pratiques conformes.",
      items: [
        { t: "Coloscope dans un bac fermé, étiqueté « sale »", ok: true },
        { t: "Heure de fin d'examen notée sur la fiche de traçabilité", ok: true },
        { t: "Coloscope porté à la main dans le couloir, enroulé sur l'avant-bras", ok: false, cat: "risque" },
        { t: "Gants de l'examen gardés pour ouvrir les portes", ok: false, cat: "risque" },
        { t: "Bac déposé en salle de désinfection et pris en charge sans attendre", ok: true },
        { t: "Endoscope sale transporté dans la même armoire de transport que les endoscopes propres", ok: false, cat: "risque" }
      ],
      fb: "Le circuit distingue le propre et le sale : contenant fermé et identifié, gants retirés avant de toucher les surfaces, prise en charge immédiate. L'heure de fin d'examen sert à vérifier le délai de prise en charge.",
      ref: "instr2016"
    }
  ],
  retenir: [
    "Pré-traitement immédiat, en salle d'examen : essuyage, aspiration-insufflation de tous les canaux.",
    "Eau d'aspiration renouvelée après chaque endoscopie.",
    "Transport immédiat, à sec, en contenant fermé étiqueté « sale »."
  ]
},

/* ───────────────────────────── M2 ───────────────────────────── */
{
  id: "etancheite",
  num: 2,
  titre: "Test d'étanchéité",
  lieu: "Salle de désinfection, zone sale",
  heure: "09 h 52",
  publics: ["terrain"],
  intro: "Le CF-07 arrive dans son bac fermé. Avant toute immersion, vous branchez le testeur d'étanchéité.",
  steps: [
    {
      type: "order",
      q: "Ordonnez les étapes minimales du test d'étanchéité.",
      items: [
        "Brancher le testeur et gonfler, hors de l'eau",
        "Vérifier l'absence de fuite avant immersion",
        "Immerger dans un bain d'eau sans détergent",
        "Béquiller l'extrémité distale et vérifier l'absence de bulles",
        "Dégonfler et débrancher, hors de l'eau"
      ],
      fb: "C'est la séquence minimale de l'instruction de 2016, à compléter par la notice du fabricant. Le bain se fait sans détergent : la mousse masquerait les bulles. Le branchement et le débranchement se font hors de l'eau pour éviter que l'eau ne pénètre dans l'endoscope.",
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Dès le gonflage, hors de l'eau, l'aiguille du manomètre chute rapidement. Que faites-vous ?",
      card: { kind: "gauge", drop: true },
      options: [
        { t: "J'immerge quand même pour localiser la fuite.", cat: "risque", fb: "Une chute de pression avant immersion signe une perforation importante. Immerger ferait entrer du liquide dans l'endoscope et aggraverait les dégâts." },
        { t: "Je n'immerge pas. J'arrête le traitement, j'identifie l'endoscope « souillé, potentiellement contaminant », je préviens le cadre et je l'oriente vers la maintenance.", cat: "sur", fb: "C'est la conduite attendue. Quand l'état de l'endoscope empêche son nettoyage-désinfection, il est signalé comme souillé et potentiellement contaminant avant tout envoi en maintenance." },
        { t: "Je le passe en LDE : la machine refera un test d'étanchéité.", cat: "risque", fb: "Le test automatique du LDE complète le test manuel, il ne le remplace pas. Un endoscope qui fuit ne doit pas entrer dans le circuit de traitement." },
        { t: "Je fais une désinfection par trempage sans immersion des parties électroniques.", cat: "risque", fb: "Un traitement partiel improvisé ne garantit pas la désinfection et peut aggraver la panne. L'endoscope sort du circuit." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Autre endoscope, autre jour. Le test à sec est bon, mais une fine chaîne de bulles apparaît au béquillage dans le bain. Quel est le bon geste ?",
      options: [
        { t: "Je débranche le testeur dans l'eau pour arrêter les bulles.", cat: "risque", fb: "Débrancher dans l'eau fait chuter la pression interne : l'eau du bain est aspirée dans l'endoscope." },
        { t: "Je laisse le testeur branché, je sors l'endoscope du bain, puis je dégonfle et débranche hors de l'eau. J'arrête le traitement.", cat: "sur", fb: "Garder l'endoscope sous pression pendant la sortie du bain empêche l'eau d'entrer. Le traitement s'arrête et l'endoscope part en maintenance, identifié comme souillé." },
        { t: "Je rince le canal à la seringue : si les bulles disparaissent, c'était de l'air piégé, je poursuis.", cat: "trace", fb: "Rincer peut aider à distinguer une vraie fuite de l'air piégé, mais une chaîne continue au béquillage évoque une fuite. En cas de doute, on ne poursuit pas sans avis du cadre ou du fabricant et on trace l'événement." },
        { t: "Je poursuis le nettoyage : la fuite est minime.", cat: "risque", fb: "Il n'y a pas de fuite acceptable. Le liquide qui pénètre dans l'endoscope ne peut ni être nettoyé ni désinfecté." }
      ],
      ref: "guide2016"
    },
    {
      type: "choice",
      q: "Le médecin appelle : il lui faut un coloscope pour une urgence dans 20 minutes. Le CF-07 est le seul de son modèle disponible.",
      options: [
        { t: "Je le lui donne : la fuite est récente et il a déjà servi ce matin.", cat: "risque", fb: "Un endoscope qui fuit n'est ni désinfectable ni utilisable chez un patient." },
        { t: "Je propose un autre endoscope traité et disponible, ou un endoscope à usage unique s'il existe, et je préviens le cadre.", cat: "sur", fb: "L'instruction cite l'endoscope à usage unique quand un traitement adapté ne peut être assuré. L'organisation du parc relève du cadre et du médecin." },
        { t: "Je fais une désinfection rapide de 5 minutes à l'alcool.", cat: "risque", fb: "Ce n'est pas une procédure de traitement validée, et la fuite rend l'endoscope inutilisable." }
      ],
      ref: "guide2016"
    },
    {
      type: "multi",
      q: "Le CF-07 part en maintenance. Cochez ce qui doit l'accompagner ou être fait.",
      items: [
        { t: "Mention « non désinfecté, potentiellement contaminant » sur l'emballage et le bon d'envoi", ok: true },
        { t: "Emballage étanche et fermé", ok: true },
        { t: "Enregistrement dans le carnet de vie de l'endoscope", ok: true },
        { t: "Fiche de signalement interne selon la procédure de l'établissement", ok: true },
        { t: "Un cycle de LDE « pour la forme » avant l'envoi", ok: false, cat: "risque" },
        { t: "Retrait de l'étiquette pour ne pas inquiéter le transporteur", ok: false, cat: "risque" }
      ],
      fb: "Toute maintenance est enregistrée. Un endoscope que son état empêche de traiter est signalé comme souillé et potentiellement contaminant, pour protéger le personnel de maintenance.",
      ref: "instr2016"
    }
  ],
  retenir: [
    "Aucun contact avec l'eau avant un test d'étanchéité conforme.",
    "Branchement et débranchement hors de l'eau, bain sans détergent.",
    "Fuite = arrêt du traitement, endoscope identifié « souillé, potentiellement contaminant », maintenance tracée."
  ]
},

/* ───────────────────────────── M3 ───────────────────────────── */
{
  id: "nettoyage",
  num: 3,
  titre: "Nettoyage manuel",
  lieu: "Paillasse de nettoyage",
  heure: "10 h 00",
  publics: ["terrain"],
  intro: "Le gastroscope « GIF-03 » a passé son test d'étanchéité. Même si la désinfection se fera en LDE, une étape manuelle est toujours requise avant.",
  steps: [
    {
      type: "choice",
      q: "Quelle est la durée minimale de l'ensemble des opérations du premier nettoyage ?",
      options: [
        { t: "2 minutes, le LDE fera le reste.", cat: "risque", fb: "Le LDE ne compense pas un nettoyage manuel bâclé. Une matière organique résiduelle protège les micro-organismes du désinfectant." },
        { t: "Au moins 10 minutes.", cat: "sur", fb: "L'instruction fixe au moins 10 minutes pour l'ensemble des opérations du premier nettoyage. En traitement entièrement manuel, le second nettoyage dure au moins 5 minutes." },
        { t: "30 minutes au minimum.", cat: "exces", fb: "Ce n'est pas l'exigence. Ce qui compte : au moins 10 minutes et des écouvillonnages répétés jusqu'à ce que la brosse soit visuellement propre." }
      ],
      ref: "instr2016"
    },
    {
      type: "multi",
      q: "Cochez les gestes conformes du premier nettoyage.",
      items: [
        { t: "Immersion complète dans un bain de détergent préparé selon le fabricant, renouvelé pour chaque endoscope", ok: true },
        { t: "Démontage et nettoyage des pistons, valves et éléments amovibles", ok: true },
        { t: "Écouvillonnage de tous les canaux écouvillonnables, endoscope immergé", ok: true },
        { t: "Passages répétés jusqu'à ce que la brosse soit visuellement propre", ok: true },
        { t: "Réutiliser le bain pour un deuxième endoscope s'il paraît propre", ok: false, cat: "risque" },
        { t: "Brosser la cage à pistons avec l'écouvillon des canaux", ok: false, cat: "risque" },
        { t: "Écouvillons réutilisables rangés dans le bac après usage", ok: false, cat: "risque" }
      ],
      fb: "Bain neuf pour chaque endoscope, irrigation de tous les canaux irrigables, écouvillonnage immergé répété jusqu'à brosse propre. Les brosses de l'extrémité et des cages à pistons sont distinctes des écouvillons de canaux, adaptées à l'endoscope et à usage unique.",
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Le prochain endoscope est un duodénoscope. Quel point demande une vigilance particulière ?",
      options: [
        { t: "Aucun : la procédure est la même que pour un gastroscope.", cat: "risque", fb: "Les duodénoscopes ont été impliqués dans des transmissions de bactéries multirésistantes. Leur extrémité distale demande une attention spécifique." },
        { t: "L'extrémité distale et le canal érecteur, en suivant la dernière procédure du fabricant.", cat: "sur", fb: "L'instruction de 2016 cible l'extrémité distale et le canal érecteur. Celle de 2018 rappelle d'appliquer la dernière procédure de traitement du fabricant." },
        { t: "Il suffit de doubler le temps de désinfection dans le LDE.", cat: "risque", fb: "Allonger la désinfection ne compense pas un nettoyage insuffisant de l'élévateur. C'est le nettoyage mécanique qui fait la différence." }
      ],
      ref: "instr2018"
    },
    {
      type: "choice",
      q: "Pour le nettoyage, un collègue propose un ancien produit à base d'aldéhyde « plus puissant ». Votre réponse ?",
      options: [
        { t: "D'accord, c'est plus efficace.", cat: "risque", fb: "Les aldéhydes fixent les protéines sur les surfaces : ils figent les souillures et les agents transmissibles non conventionnels au lieu de les éliminer." },
        { t: "Non : on utilise le détergent référencé, non fixant, compatible avec l'endoscope et le désinfectant.", cat: "sur", fb: "Le détergent doit avoir une efficacité revendiquée et être compatible avec l'endoscope et le désinfectant. Les produits fixants sont à proscrire au stade du nettoyage." },
        { t: "Oui, mais seulement pour les patients à risque.", cat: "risque", fb: "Un produit fixant est inadapté quel que soit le patient." }
      ],
      ref: "guide2016"
    }
  ],
  retenir: [
    "Une étape manuelle précède toujours le LDE.",
    "Premier nettoyage d'au moins 10 minutes, bain renouvelé pour chaque endoscope.",
    "Écouvillonnage immergé répété jusqu'à brosse propre, matériel à usage unique."
  ]
},

/* ───────────────────────────── M4 ───────────────────────────── */
{
  id: "lde",
  num: 4,
  titre: "Mise en LDE",
  lieu: "Laveurs-désinfecteurs d'endoscopes",
  heure: "10 h 12",
  publics: ["terrain", "eoh"],
  intro: "Deux laveurs-désinfecteurs (LDE 1 et LDE 2) tournent depuis 7 h 30. Vous chargez le GIF-03.",
  steps: [
    {
      type: "multi",
      q: "Ce matin, avant le premier cycle. Cochez les vérifications attendues.",
      items: [
        { t: "Cycle d'auto-désinfection des circuits hydrauliques avant le début du programme", ok: true },
        { t: "Connexion des bidons, quantités de produits, absence de fuite dans le compartiment produits", ok: true },
        { t: "Absence d'eau dans le connecteur du testeur d'étanchéité", ok: true },
        { t: "Papier présent dans l'imprimante de traçabilité", ok: true },
        { t: "Prélèvement microbiologique de l'eau de rinçage chaque matin", ok: false, cat: "exces" },
        { t: "Désactiver le test d'étanchéité automatique pour gagner du temps", ok: false, cat: "risque" }
      ],
      fb: "L'instruction liste des vérifications quotidiennes et une auto-désinfection avant le programme. Les prélèvements d'eau du LDE sont trimestriels, pas quotidiens.",
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Un coloscope récemment acquis possède un canal de lavage (water jet) pour lequel le LDE n'a pas de connecteur. Le modèle ne figure pas sur la liste de compatibilité du LDE.",
      options: [
        { t: "Je lance le cycle sans connecter ce canal : il sert peu.", cat: "risque", fb: "Un canal non connecté n'est ni nettoyé ni désinfecté par la machine, alors qu'il a été en contact avec le patient." },
        { t: "Je ne le traite pas dans ce LDE. Traitement manuel selon la procédure validée, jusqu'à la qualification du modèle et la mise à disposition du bon connecteur.", cat: "sur", fb: "Un endoscope hors d'une famille qualifiée pour le LDE est traité manuellement jusqu'à qualification des performances. Chaque canal doit être connecté selon le fabricant." },
        { t: "Je bouche le canal avec un capuchon pour éviter l'entrée de liquide.", cat: "risque", fb: "Boucher un canal empêche tout traitement de ce canal." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Fin de cycle pour le GIF-03. Lisez le ticket. Que faites-vous ?",
      card: { kind: "ticket", lines: [
        ["LDE 2 · SN 48213", ""],
        ["CYCLE", "ENDO STANDARD"],
        ["ENDOSCOPE", "GIF-03 · SN 2711840"],
        ["DÉSINFECTANT", "APA · LOT 26K14"],
        ["TEST ÉTANCHÉITÉ", "OK"],
        ["CANAL ASPIRATION", "OK"],
        ["CANAL AIR/EAU", "OK"],
        ["CANAL AUXILIAIRE", "ALARME 31 · DÉBIT"],
        ["DÉSINFECTION", "35 °C · 05:00"],
        ["FIN DE CYCLE", "NON CONFORME"]
      ]},
      options: [
        { t: "La désinfection a duré le temps prévu : je libère l'endoscope.", cat: "risque", fb: "Une alarme de débit signifie que le liquide n'a pas circulé correctement dans ce canal. Le cycle est non conforme : l'endoscope est considéré comme non désinfecté." },
        { t: "Endoscope non libéré. Je vérifie le connecteur et la perméabilité du canal, je reprends le nettoyage si besoin, puis je relance un cycle complet. Je trace l'incident.", cat: "sur", fb: "En fin de cycle, on vérifie la connexion et la conformité du cycle, y compris la cohérence du ticket. Un défaut de débit peut venir d'un connecteur mal placé ou d'une obstruction : on corrige la cause avant de relancer un cycle complet." },
        { t: "Je relance uniquement la phase de désinfection.", cat: "risque", fb: "Une obstruction gêne aussi le nettoyage. On corrige la cause et on relance un cycle complet." },
        { t: "J'envoie l'endoscope directement en maintenance.", cat: "exces", fb: "C'est prématuré : la cause la plus fréquente est un connecteur. On vérifie, on corrige, on relance. Si l'alarme persiste, l'avis du cadre ou une maintenance se discute." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Cycle suivant : le ticket indique « FIN DE CYCLE CONFORME », mais le numéro de série imprimé (SN 2711852) ne correspond pas à l'étiquette de l'endoscope en cuve (SN 2711840).",
      card: { kind: "ticket", lines: [
        ["LDE 1 · SN 48207", ""],
        ["CYCLE", "ENDO STANDARD"],
        ["ENDOSCOPE", "GIF · SN 2711852"],
        ["TOUS CANAUX", "OK"],
        ["DÉSINFECTION", "35 °C · 05:00"],
        ["FIN DE CYCLE", "CONFORME"]
      ]},
      options: [
        { t: "Cycle conforme : peu importe le numéro, je libère.", cat: "trace", fb: "La traçabilité relie chaque patient à un endoscope et à un cycle. Un ticket incohérent ne permet pas de prouver que cet endoscope a été traité." },
        { t: "Je ne libère pas l'endoscope. Je recherche l'erreur de saisie avec l'équipe. Si je ne peux pas prouver que ce cycle concerne bien cet endoscope, je le retraite et je trace la correction.", cat: "sur", fb: "L'instruction demande de vérifier la cohérence du ticket en fin de cycle. Le doute sur l'identification équivaut à un doute sur le traitement." },
        { t: "Je corrige le numéro au stylo sur le ticket.", cat: "trace", fb: "Modifier une preuve de traitement sans vérification ni traçabilité de la correction n'est pas acceptable." }
      ],
      ref: "instr2016"
    }
  ],
  retenir: [
    "Auto-désinfection du LDE avant le programme et vérifications quotidiennes.",
    "Tous les canaux connectés, modèle qualifié pour le LDE.",
    "Ticket lu à chaque fin de cycle : alarme ou incohérence = endoscope non libéré."
  ]
},

/* ───────────────────────────── M5 ───────────────────────────── */
{
  id: "panne",
  num: 5,
  titre: "LDE non fonctionnel",
  lieu: "Laveurs-désinfecteurs d'endoscopes",
  heure: "10 h 47",
  publics: ["terrain", "eoh"],
  intro: "Le LDE 2 s'arrête en pleine phase de désinfection : « DÉFAUT DOSAGE DÉSINFECTANT ». Un coloscope est dans la cuve, trois endoscopes attendent, le programme compte encore 9 examens.",
  steps: [
    {
      type: "choice",
      q: "Le coloscope présent dans la cuve au moment de l'arrêt :",
      card: { kind: "alarm", text: "LDE 2 · ARRÊT CYCLE · DÉFAUT DOSAGE DÉSINFECTANT · PHASE 4/6" },
      options: [
        { t: "Le cycle était à 80 % : la désinfection est probablement suffisante.", cat: "risque", fb: "Un défaut de dosage signifie que la concentration n'est pas garantie. Un cycle interrompu n'est jamais conforme." },
        { t: "Il est considéré comme non désinfecté. Je le sors, je l'identifie et il refait un cycle complet dans un LDE fonctionnel. Je trace le cycle interrompu.", cat: "sur", fb: "Seul un cycle complet et conforme libère un endoscope. Le cycle interrompu figure dans la traçabilité de l'endoscope." },
        { t: "Je le rince à l'eau bactériologiquement maîtrisée et je le stocke.", cat: "risque", fb: "Rincer n'est pas désinfecter." },
        { t: "Je relance seulement la phase de désinfection sur le LDE 2.", cat: "risque", fb: "On ne réutilise pas un appareil mis en doute tant que son bon fonctionnement n'est pas confirmé." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Et le LDE 2 lui-même ?",
      options: [
        { t: "Je relance un cycle à vide : si l'alarme ne revient pas, je reprends.", cat: "risque", fb: "Une alarme de dosage disparue n'est pas une alarme résolue. La remise en service suppose un diagnostic." },
        { t: "Je le mets hors service avec une affiche visible, j'appelle le biomédical ou le technicien, je préviens le cadre et je trace la panne.", cat: "sur", fb: "Ne pas utiliser l'appareil mis en doute tant que son bon fonctionnement n'a pas été confirmé (fiche 18). La panne et l'intervention sont tracées." },
        { t: "Je change le bidon de désinfectant et je reprends sans prévenir.", cat: "trace", fb: "Le bidon peut être en cause, mais une pompe doseuse ou une sonde aussi. La reprise doit être validée et tracée." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Trois endoscopes attendent leur traitement, le LDE 1 fonctionne. Quelle organisation ?",
      options: [
        { t: "Je les range dans l'ESET en attendant la réparation.", cat: "risque", fb: "Une ESET reçoit exclusivement des endoscopes traités. Y placer des endoscopes sales contamine l'enceinte et les endoscopes propres." },
        { t: "Je les laisse tremper dans le détergent jusqu'à la réparation, si besoin jusqu'au lendemain.", cat: "risque", fb: "Un trempage prolongé hors des durées du fabricant n'est pas une solution d'attente validée et n'assure pas la désinfection." },
        { t: "Je bascule sur le LDE 1 en priorisant, j'alerte le cadre et le médecin pour adapter le programme, et j'active la procédure dégradée écrite (traitement manuel validé) seulement si elle existe et si le personnel est formé.", cat: "sur", fb: "Le délai entre l'examen et le traitement doit rester le plus court possible. Adapter le programme protège mieux les patients qu'une solution improvisée. Le mode dégradé doit être écrit et validé à l'avance." },
        { t: "J'annule tout le programme de la journée.", cat: "exces", fb: "Un LDE fonctionne encore. Annuler en bloc sans évaluation pénalise les patients ; mieux vaut adapter le programme avec le médecin." }
      ],
      ref: "guide2016"
    },
    {
      type: "choice",
      q: "Le technicien a remplacé la pompe doseuse du LDE 2. Comment le remettre en service ?",
      options: [
        { t: "Dès son départ, on reprend : il a réparé.", cat: "risque", fb: "La remise en service se formalise : il faut prouver que le cycle atteint de nouveau ses paramètres." },
        { t: "Remise en service formalisée : rapport d'intervention, vérification des paramètres du cycle et du dosage, auto-désinfection, contrôles complémentaires décidés avec l'EOH et le biomédical selon l'intervention, traçabilité.", cat: "sur", fb: "L'étendue de la requalification dépend de l'intervention. Si le circuit hydraulique ou le traitement d'eau sont concernés, un prélèvement de l'eau de rinçage terminal peut être décidé." },
        { t: "On attend systématiquement 3 semaines de résultats microbiologiques avant toute utilisation.", cat: "exces", fb: "Ce n'est pas systématique pour le remplacement d'une pompe doseuse. La décision se prend au cas par cas avec l'EOH, selon les composants concernés." }
      ],
      ref: "lde2003"
    },
    {
      type: "choice",
      q: "Le lendemain, en relisant les tickets, vous découvrez que 6 cycles de la veille ont tourné avec un désinfectant périmé. Deux de ces endoscopes ont déjà servi chez 4 patients ce matin.",
      options: [
        { t: "Je retraite les endoscopes et je n'en parle pas : ils sont propres maintenant.", cat: "risque", fb: "Des patients ont été examinés avec des endoscopes dont la désinfection n'est pas garantie. L'analyse de risque et la décision d'information ne peuvent pas être sautées." },
        { t: "Je saisis les endoscopes concernés pour retraitement, je préviens le cadre et l'EOH, et je fournis la liste des patients exposés grâce à la traçabilité. La cellule de crise évalue le risque, l'information des patients et le signalement.", cat: "sur", fb: "Une désinfection non conforme est l'une des cinq alertes de la fiche 18. La cellule de crise établit la liste des exposés, évalue le risque, décide de l'information et envisage le signalement externe ou la matériovigilance." },
        { t: "J'appelle moi-même les 4 patients pour les prévenir.", cat: "trace", fb: "L'intention est bonne, mais l'information des patients se décide et se prépare avec l'EOH et la cellule de crise, après analyse du risque." }
      ],
      ref: "instr2016"
    }
  ],
  retenir: [
    "Cycle interrompu ou alarme = endoscope non désinfecté, cycle complet dans un LDE fonctionnel.",
    "LDE en doute = hors service tant que son bon fonctionnement n'est pas confirmé.",
    "Jamais d'endoscope sale en ESET. Mode dégradé écrit et validé à l'avance, ou adaptation du programme."
  ]
},

/* ───────────────────────────── M6 ───────────────────────────── */
{
  id: "stockage",
  num: 6,
  titre: "Stockage et remise à disposition",
  lieu: "Zone propre",
  heure: "07 h 50",
  publics: ["terrain", "eoh"],
  intro: "Nouveau matin. Avant le premier examen, vous vérifiez la date et l'heure du dernier traitement de chaque endoscope, comme le prévoit la traçabilité.",
  steps: [
    {
      type: "choice",
      q: "Gastroscope traité hier à 17 h 00, rangé dans une armoire ventilée (pas une ESET). Premier examen à 8 h 30.",
      card: { kind: "clock", from: "Hier 17:00", to: "Aujourd'hui 08:30", hours: "15 h 30" },
      options: [
        { t: "Utilisable directement : il est propre.", cat: "risque", fb: "Après 12 heures ou plus de stockage hors ESET, une désinfection est requise avant le premier acte, en raison du risque de prolifération dans les canaux." },
        { t: "Désinfection avant utilisation, car le stockage dépasse 12 heures.", cat: "sur", fb: "Pour un endoscope semi-critique stocké 12 heures ou plus, une désinfection de niveau intermédiaire est requise avant le premier acte." },
        { t: "Cycle complet de traitement avec double nettoyage, comme après un examen.", cat: "exces", fb: "Le cycle complet s'impose au-delà d'une semaine de stockage. Ici, une désinfection avant utilisation suffit." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Coloscope traité il y a 4 jours, stocké dans une ESET qualifiée. Le fabricant de l'ESET revendique 7 jours.",
      options: [
        { t: "Désinfection avant utilisation par précaution.", cat: "exces", fb: "À la sortie d'une ESET qualifiée, dans la durée revendiquée (sans dépasser une semaine), un endoscope semi-critique s'utilise immédiatement. Une désinfection en plus use le matériel et immobilise le parc." },
        { t: "Utilisation immédiate à la sortie de l'ESET.", cat: "sur", fb: "La durée de stockage est celle du fabricant, dans la limite d'une semaine. L'endoscope semi-critique s'utilise immédiatement à la sortie." },
        { t: "Cycle complet de traitement.", cat: "exces", fb: "Le cycle complet ne s'impose qu'au-delà d'une semaine de stockage ou en cas de défaut de l'ESET." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "L'ESET a enregistré cette nuit une coupure d'alimentation de 2 heures (alarme « défaut flux d'air »). Six endoscopes y sont stockés.",
      options: [
        { t: "L'alimentation est revenue : rien à faire.", cat: "risque", fb: "Pendant la coupure, le séchage et la ventilation des canaux n'étaient plus assurés." },
        { t: "Traitement complet des six endoscopes concernés, signalement au cadre et au biomédical, traçabilité.", cat: "sur", fb: "Tout défaut de l'ESET, y compris de ses servitudes et de son alimentation, entraîne un traitement complet des endoscopes concernés." },
        { t: "Une simple désinfection des six endoscopes suffit.", cat: "risque", fb: "L'instruction prévoit un traitement complet en cas de défaut de l'ESET, pas une désinfection seule." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Un bronchoscope revient de réparation chez le fabricant, avec un certificat « nettoyé et désinfecté ».",
      options: [
        { t: "Je le range dans l'ESET : il est certifié.", cat: "risque", fb: "Même traité par le fabricant, un endoscope au retour de maintenance est retraité et contrôlé par l'établissement. Il ne va pas en ESET en attendant le résultat." },
        { t: "Je le traite, je fais réaliser un prélèvement microbiologique au moins 6 heures après le traitement, et il n'est pas utilisé avant un résultat conforme.", cat: "sur", fb: "Au retour de maintenance, le contrôle est ponctuel : il faut attendre le résultat avant remise en circulation. Le délai d'au moins 6 heures entre traitement et prélèvement est rappelé par la FAQ n° 2." },
        { t: "Je le traite et je le remets en service : le contrôle annuel suffira.", cat: "risque", fb: "Le retour de maintenance impose un contrôle ponctuel avec attente du résultat, distinct du contrôle annuel programmé." }
      ],
      ref: "faq2"
    }
  ],
  retenir: [
    "Hors ESET : 12 heures ou plus de stockage = désinfection avant utilisation. Plus d'une semaine = cycle complet.",
    "ESET qualifiée, dans la durée du fabricant (une semaine maximum) : utilisation immédiate. Défaut de l'ESET = traitement complet.",
    "Retour de maintenance : traitement, prélèvement après au moins 6 heures, attente du résultat."
  ]
},

/* ───────────────────────────── M7 ───────────────────────────── */
{
  id: "prelevements",
  num: 7,
  titre: "Prélèvements non conformes",
  lieu: "Bureau de l'EOH",
  heure: "14 h 20",
  publics: ["eoh"],
  intro: "Le laboratoire transmet les résultats des contrôles microbiologiques du mois. Endoscopes à désinfection de niveau intermédiaire, rinçage à l'eau bactériologiquement maîtrisée.",
  steps: [
    {
      type: "choice",
      q: "Gastroscope GIF-05, contrôle annuel programmé. Quel niveau ?",
      card: { kind: "lab", rows: [["Endoscope", "GIF-05 · contrôle programmé"], ["Flore totale", "12 UFC / endoscope"], ["Identification", "Staphylocoques à coagulase négative, Bacillus sp."], ["Micro-organismes indicateurs", "Absents"]] },
      options: [
        { t: "Niveau cible", cat: "risque", fb: "Le niveau cible exige une flore totale inférieure à 5 UFC et l'absence d'indicateurs." },
        { t: "Niveau d'alerte", cat: "sur", fb: "Flore totale de 5 à 25 UFC, sans micro-organisme indicateur : niveau d'alerte." },
        { t: "Niveau d'action", cat: "exces", fb: "Le niveau d'action correspond à plus de 25 UFC ou à la présence d'un micro-organisme indicateur. Ce n'est pas le cas ici." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Que décidez-vous pour le GIF-05 ?",
      options: [
        { t: "Retrait immédiat et envoi en maintenance.", cat: "exces", fb: "Au niveau d'alerte, l'endoscope reste utilisable. Les mesures correctives se font sans arrêt d'utilisation." },
        { t: "Maintien en service, vérification de l'asepsie du prélèvement et des conditions de stockage, nouveau prélèvement après traitement habituel et au moins 6 heures de stockage.", cat: "sur", fb: "C'est la conduite proposée par le CPias Occitanie pour le niveau d'alerte, qui ne s'applique qu'aux endoscopes semi-critiques." },
        { t: "Rien : c'est de la flore cutanée banale.", cat: "trace", fb: "Le niveau d'alerte signale une dérive. Il appelle une vérification et un recontrôle, pas une absence de suite." }
      ],
      ref: "cpiasOcc"
    },
    {
      type: "choice",
      q: "Coloscope CF-02. Quel niveau ?",
      card: { kind: "lab", rows: [["Endoscope", "CF-02 · contrôle programmé"], ["Flore totale", "3 UFC / endoscope"], ["Identification", "Pseudomonas aeruginosa (1 UFC)"], ["Micro-organismes indicateurs", "Présents"]] },
      options: [
        { t: "Niveau cible : moins de 5 UFC.", cat: "risque", fb: "La présence d'un seul micro-organisme indicateur suffit à classer en niveau d'action, quel que soit le compte de flore totale." },
        { t: "Niveau d'alerte.", cat: "risque", fb: "Le niveau d'alerte suppose l'absence d'indicateurs. P. aeruginosa en est un." },
        { t: "Niveau d'action.", cat: "sur", fb: "Exact. Les indicateurs comprennent les entérobactéries, entérocoques, P. aeruginosa et autres Pseudomonas, Stenotrophomonas maltophilia, Acinetobacter, S. aureus, Candida et champignons filamenteux." }
      ],
      ref: "cpiasOcc"
    },
    {
      type: "multi",
      q: "Conduite à tenir pour le CF-02. Cochez les mesures adaptées.",
      items: [
        { t: "Suspendre l'utilisation de l'endoscope", ok: true },
        { t: "Procédure renforcée : double nettoyage, désinfection, rinçage, le tout effectué deux fois", ok: true },
        { t: "Prélèvement canal par canal pour localiser la contamination", ok: true },
        { t: "Flore d'origine hydrique : vérifier l'eau de rinçage terminal du LDE, les filtres et le séchage", ok: true },
        { t: "Remise en service après le premier retraitement, sans attendre de recontrôle", ok: false, cat: "risque" },
        { t: "Mise au rebut immédiate de l'endoscope", ok: false, cat: "exces" }
      ],
      fb: "Niveau d'action : arrêt d'utilisation, analyse des causes, actions correctives. La FAQ n° 2 décrit la procédure renforcée et le prélèvement canal par canal. L'enquête s'oriente selon la flore : P. aeruginosa évoque une origine hydrique.",
      ref: "faq2"
    },
    {
      type: "choice",
      q: "Et les patients examinés avec le CF-02 depuis son dernier contrôle conforme ?",
      options: [
        { t: "Rien à faire tant que le recontrôle n'est pas revenu.", cat: "risque", fb: "L'identification des exposés commence sans attendre : c'est la traçabilité patient-endoscope qui la rend possible." },
        { t: "Liste des patients exposés via la traçabilité, recherche au laboratoire d'infections ou de colonisations à P. aeruginosa chez ces patients, puis analyse de risque par l'EOH et la cellule de crise, qui décident de l'information et du signalement.", cat: "sur", fb: "La fiche 18 prévoit d'établir la liste des patients exposés, de déterminer si l'échec augmente leur risque, d'envisager l'information et le signalement aux autorités." },
        { t: "Courrier immédiat à tous les patients de l'année.", cat: "exces", fb: "L'information des patients se décide après analyse de risque, avec des critères d'exposition définis par la cellule de crise." }
      ],
      ref: "instr2016"
    },
    {
      type: "choice",
      q: "Duodénoscope TJF-01, contrôle trimestriel obligatoire. Résultat :",
      card: { kind: "lab", alert: true, rows: [["Endoscope", "TJF-01 · contrôle trimestriel"], ["Flore totale", "8 UFC / endoscope"], ["Identification", "Klebsiella pneumoniae productrice de carbapénémase OXA-48"], ["Micro-organismes indicateurs", "Présents · BHRe"]] },
      options: [
        { t: "Retraitement simple et recontrôle, sans autre mesure.", cat: "risque", fb: "Une BHRe sur un duodénoscope est un événement à haut risque de transmission. Il dépasse la seule gestion de l'endoscope." },
        { t: "Séquestration du duodénoscope, cellule de crise, liste des patients exposés et dépistage BHRe de ces patients, signalement externe e-SIN, procédure renforcée et prélèvements canal par canal, déclaration de matériovigilance si un défaut est suspecté.", cat: "sur", fb: "Pour les duodénoscopes, un résultat positif interdit l'utilisation jusqu'à un nouveau contrôle conforme. Une BHRe impose une gestion de crise : exposés, dépistage, signalement e-SIN à l'ARS et au CPias, en lien avec l'EOH." },
        { t: "Mise au rebut du duodénoscope : le problème est réglé.", cat: "trace", fb: "Jeter l'endoscope supprime une pièce d'enquête et ne protège pas les patients déjà exposés." }
      ],
      ref: "instr2018"
    },
    {
      type: "choice",
      q: "Après deux procédures renforcées, le CF-02 reste à 40 UFC, avec Stenotrophomonas maltophilia dans le canal opérateur.",
      options: [
        { t: "Troisième procédure renforcée, puis remise en service quel que soit le résultat.", cat: "risque", fb: "Une remise en service exige un résultat conforme." },
        { t: "Envoi en maintenance ou en expertise auprès du fabricant, identifié comme contaminé. Retour : traitement, prélèvement, et remise en service uniquement sur résultat conforme.", cat: "sur", fb: "Si la contamination persiste malgré la procédure renforcée, l'endoscope part en réparation ou en expertise. Un biofilm ou une lésion du canal sont possibles." },
        { t: "On l'utilise uniquement pour les patients non immunodéprimés.", cat: "risque", fb: "Un endoscope au niveau d'action n'est utilisé chez aucun patient." }
      ],
      ref: "faq2"
    },
    {
      type: "choice",
      q: "Contrôle trimestriel du LDE 1 : eau de rinçage terminal à 2 UFC/100 mL de P. aeruginosa.",
      card: { kind: "lab", rows: [["Prélèvement", "LDE 1 · eau de rinçage terminal"], ["P. aeruginosa", "2 UFC / 100 mL"], ["Flore aérobie à 22 °C", "6 UFC / 100 mL"], ["Niveau", "?"]] },
      options: [
        { t: "Niveau cible : la flore aérobie est sous 10 UFC.", cat: "risque", fb: "Pour l'eau de rinçage terminal, P. aeruginosa à 1 UFC/100 mL ou plus suffit à atteindre le niveau d'action." },
        { t: "Niveau d'action : LDE 1 arrêté, recherche de la cause (filtres, traitement d'eau, circuit), désinfection du circuit selon le fabricant, recontrôle avant remise en service. Analyse avec l'EOH des endoscopes traités depuis le dernier contrôle conforme.", cat: "sur", fb: "Niveau d'action pour l'eau de rinçage terminal : P. aeruginosa ≥ 1 UFC/100 mL ou flore aérobie à 22 °C ≥ 10 UFC/100 mL. L'eau contaminée peut recontaminer chaque endoscope en fin de cycle." },
        { t: "Je recontrôle dans trois mois.", cat: "risque", fb: "Au niveau d'action, la réponse est immédiate." }
      ],
      ref: "instr2016"
    }
  ],
  retenir: [
    "Cible : < 5 UFC et aucun indicateur. Alerte : 5 à 25 UFC sans indicateur. Action : > 25 UFC ou un indicateur.",
    "Action : arrêt d'utilisation, procédure renforcée, prélèvements canal par canal, enquête orientée par la flore.",
    "Toujours penser aux patients exposés : traçabilité, analyse de risque, information et signalement décidés en cellule de crise."
  ]
}
];
