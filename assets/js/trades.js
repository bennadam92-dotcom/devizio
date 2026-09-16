/* Devizio — configuration des métiers.
   Chaque métier : nom, emoji, accroche (landing), et prestations pré-remplies. */
window.TRADES = {
  pisciniste: {
    name: "Pisciniste", emoji: "💧",
    tagline: "Devis, factures & entretien pour piscinistes",
    sub: "Chiffrez une construction, facturez l'entretien récurrent de vos clients chaque mois.",
    presets: ["Entretien mensuel piscine", "Nettoyage du bassin", "Traitement de l'eau", "Analyse & équilibrage de l'eau", "Hivernage", "Mise en service / déshivernage", "Remplacement pompe / filtration", "Réparation / pose de liner", "Pose de robot nettoyeur", "Installation pompe à chaleur", "Construction de bassin", "Margelles & plage", "Bâche / volet roulant", "Contrat d'entretien annuel", "Dépannage / SAV", "Détection de fuite"]
  },
  paysagiste: {
    name: "Paysagiste", emoji: "🌿",
    tagline: "Devis & factures pour paysagistes",
    sub: "Vos prestations d'aménagement et d'entretien pré-remplies, du devis à la facture.",
    presets: ["Tonte de pelouse", "Taille de haie", "Débroussaillage", "Plantation d'arbustes", "Création de massif", "Engazonnement", "Évacuation de déchets verts", "Élagage", "Entretien mensuel du jardin", "Pose de clôture", "Arrosage automatique", "Paillage", "Terrassement léger", "Pose de gazon en rouleau", "Bêchage / préparation du sol"]
  },
  plombier: {
    name: "Plombier", emoji: "🔧",
    tagline: "Devis & factures pour plombiers",
    sub: "Du dépannage au chantier de salle de bain, chiffrez et facturez en 2 minutes.",
    presets: ["Recherche de fuite", "Remplacement chauffe-eau", "Installation sanitaire", "Débouchage canalisation", "Pose de robinetterie", "Remplacement WC", "Installation douche / baignoire", "Dépannage plomberie", "Rénovation salle de bain", "Détartrage", "Pose chauffe-eau thermodynamique", "Remplacement flexible / joint", "Déplacement"]
  },
  electricien: {
    name: "Électricien", emoji: "⚡",
    tagline: "Devis & factures pour électriciens",
    sub: "Mises aux normes, installations, dépannages : vos prestations prêtes à l'emploi.",
    presets: ["Mise aux normes tableau électrique", "Installation prise / interrupteur", "Remplacement tableau électrique", "Pose de luminaire", "Dépannage électrique", "Installation VMC", "Câblage réseau / RJ45", "Borne de recharge véhicule", "Diagnostic électrique", "Éclairage extérieur", "Pose de radiateur électrique", "Tirage de câbles"]
  },
  menuisier: {
    name: "Menuisier", emoji: "🪵",
    tagline: "Devis & factures pour menuisiers",
    sub: "Fenêtres, portes, agencement sur mesure : chiffrez au détail, facturez proprement.",
    presets: ["Pose de fenêtres", "Pose de porte", "Fabrication meuble sur mesure", "Pose de parquet", "Pose de placard", "Escalier bois", "Pose de volets", "Aménagement de combles", "Pose de terrasse bois", "Pose de plinthes", "Remplacement double vitrage", "Pose de portail"]
  },
  peintre: {
    name: "Peintre en bâtiment", emoji: "🎨",
    tagline: "Devis & factures pour peintres",
    sub: "Chiffrez au m², de la préparation à la finition, intérieur comme façade.",
    presets: ["Peinture murs et plafonds", "Pose de papier peint", "Ratissage / enduit", "Peinture de façade", "Peinture boiseries et menuiseries", "Pose de toile de verre", "Traitement anti-humidité", "Peinture de volets", "Application sous-couche", "Nettoyage de chantier", "Rebouchage / préparation", "Peinture de sol"]
  },
  carreleur: {
    name: "Carreleur", emoji: "🧱",
    tagline: "Devis & factures pour carreleurs",
    sub: "Sol, mur, terrasse : vos poses pré-remplies, chiffrées au m² en un clin d'œil.",
    presets: ["Pose de carrelage sol", "Pose de faïence murale", "Chape", "Ragréage", "Pose de mosaïque", "Réalisation des joints", "Pose terrasse extérieure", "Dépose ancien carrelage", "Pose de plinthes carrelées", "Étanchéité douche à l'italienne", "Pose de parquet stratifié", "Préparation du support"]
  },
  serrurier: {
    name: "Serrurier / Métallier", emoji: "🔩",
    tagline: "Devis & factures pour serruriers-métalliers",
    sub: "Dépannage urgent ou fabrication métallique : chiffrez et facturez sans Excel.",
    presets: ["Ouverture de porte", "Changement de serrure", "Blindage de porte", "Pose de garde-corps", "Pose de portail", "Fabrication de grille", "Dépannage serrure", "Pose de verrou", "Escalier métallique", "Rideau métallique", "Pose de barreaudage", "Déplacement d'urgence"]
  },
  ramoneur: {
    name: "Ramoneur / Fumiste", emoji: "🔥",
    tagline: "Devis & factures pour ramoneurs",
    sub: "Ramonage, certificats et contrats d'entretien récurrents, gérés en un seul outil.",
    presets: ["Ramonage cheminée", "Ramonage poêle à granulés", "Ramonage poêle à bois", "Débistrage", "Certificat de ramonage", "Tubage de conduit", "Contrôle de conduit", "Contrat d'entretien annuel", "Installation de poêle", "Dépannage", "Remplacement de joints", "Déplacement"]
  },
  macon: {
    name: "Maçon", emoji: "🏗️",
    tagline: "Devis & factures pour maçons",
    sub: "Du gros œuvre aux finitions, chiffrez vos ouvrages et facturez vos chantiers.",
    presets: ["Construction de mur", "Dalle béton", "Fondations", "Enduit de façade", "Ouverture de mur porteur", "Pose de parpaings", "Terrassement", "Chape", "Pose de linteau", "Démolition", "Coffrage / ferraillage", "Pose de bordures"]
  }
};
window.TRADE_ORDER = ["pisciniste", "paysagiste", "plombier", "electricien", "menuisier", "peintre", "carreleur", "serrurier", "ramoneur", "macon"];
