# Mission ASYT-WEBSITE-CONTENT-01 — notes de livraison

Dossier interne : le préfixe `_` empêche GitHub Pages de le publier.

## Ce qui a changé
- Positionnement : ASYT est présenté comme un **logiciel d'IA locale** (plus comme un cabinet de conseil).
- Accueil en **7 chapitres** : introduction, constat, révélation, noyau local (5 modules), démonstration (3 scénarios illustratifs), cas d'usage (4 cartes), contact.
- `services.html` / `services-en.html` : présentation du logiciel (menu : **Fonctionnalités**). Noms de fichiers inchangés.
- `a-propos.html` / `about.html`, FAQ (12 questions), Contact : réécrits, FR et EN en parallèle.
- Supprimé : statistiques « 100 % / ∞ / 0 », prix et délais, maintenance annuelle, « souverain », « open-source uniquement », secteurs réglementés (santé, défense, HDS), bureaux, délais de réponse, citation de marque, méthode en 5 étapes.
- SEO : titres, méta-descriptions, un seul H1 par page, `hreflang`, `canonical`, Open Graph, `lang`.
- Accessibilité : lien d'évitement, focus clavier, menu mobile, accordéons, `prefers-reduced-motion`, rendu lisible sans JavaScript.

## Conservé tel quel
Préchargeur « décollage », particules de fond (désormais figées en mouvement réduit), logo animé, cadre produit, bandeaux, cartes, accordéons, palette crème/blanc/beige, typographies. Action Formspree `mykolpgj` inchangée (sujet du mail Formspree inchangé aussi). Calendly et LinkedIn vérifiés (pages en ligne).

## Éléments visuels restant à créer ou à confirmer
1. **Le bouclier ASYT n'existe pas dans le dépôt.** `asyt-logo.png` est un logotype typographique « ASYT ASSOCIATES » (c'est un JPEG nommé `.png`). Rien n'a été dessiné à sa place. À fournir, puis :
   - chapitre 1 : remplacer l'image dans `.hero-mark` (révélation progressive déjà en place) ;
   - chapitre 2 : le périmètre « environnement local » du schéma est un cercle portant le texte ASYT ;
   - chapitre 4 : le noyau central porte le texte ASYT.
2. **Animation du symbole au défilement** (chapitre 1 vers 2) : non réalisée, faute de symbole. Le logo conserve son flottement existant.
3. **Capture de l'interface** (`interface-asyt.png`) : conservée mais légendée comme « capture d'une version ». Elle montre l'écran « Arena Model » avec des suggestions en anglais ; rien ne prouve qu'elle représente l'interface actuelle. À remplacer par une capture à jour (repère : commentaire HTML dans le chapitre 3 de `index.html` / `index-en.html`).
4. **Aucune scène 3D** n'a été livrée : ni dans le dépôt, ni créée.

## À confirmer par le propriétaire
- Nom légal dans le pied de page (« ASYT Associates ») et lien LinkedIn « ASYT Associates ».
- Suppression de « Paris », des bureaux et des délais de réponse (48 h / 7 jours), non validables côté produit.
- URL de référence SEO : `https://fabienlufbery-hue.github.io/mon-site/` (GitHub Pages). À remplacer dans les balises `canonical`, `hreflang`, `og:url`, `og:image` si un domaine propre est utilisé.
- Test réel du formulaire : l'identifiant Formspree répond (405 en GET, 404 pour un faux identifiant) ; aucun envoi de test n'a été fait. Envoyer un message depuis la page FR et la page EN après publication.
- Propos « sans connexion après installation des composants nécessaires », « HERMES », « module de sources Web » : repris du cahier des charges, non vérifiés dans le logiciel.
