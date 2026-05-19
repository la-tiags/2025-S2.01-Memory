# Memory : SAÉ S2.01
### Développement d'application avec interface homme-machine
> HTML · CSS · JavaScript

---

## L'équipe

| Membre | Rôle |
|---|---|
| **Amira Karmadi** | Formulaire, liaison serveur, design (`index.html`, `app.js`, `ApiService.js`, `style.css`) |
| **Nathan Fivel** | Affichage, chronomètre et optimisation (`DOMManager.js`, `Timer.js`) |
| **Tiago Joaquim** | Logique de jeu, maintenance (`DOMManager.js`, `Game.js`,`style.css`) |

---

## Le projet

Un jeu de Memory développé en JavaScript dans le cadre de la SAÉ S2.01. Le joueur choisit son pseudo, une difficulté et une collection d'images, puis doit retrouver toutes les paires de cartes avant la fin du chronomètre. Les scores sont envoyés à un serveur distant à la fin de chaque partie.

---

## Pourquoi ce thème ?

On a choisi un univers **céleste et vaporeux** ; dégradés pastel, effets de verre, animations douces : parce qu'il entre en résonance avec l'idée même du Memory.

La mémoire, c'est quelque chose d'immatériel et de flottant. Les souvenirs se superposent, s'effacent, réapparaissent. On voulait que l'interface reflète ça : quelque chose entre le rêve et le réel, où chaque carte retournée est comme un fragment de souvenir qu'on cherche à retrouver.

Le ciel, les nuages, la lumière diffuse ; c'est l'espace mental dans lequel on fouille quand on essaie de se rappeler.

---

## Ce qu'on a apprécié

**Amira** a particulièrement aimé donner une vraie identité au projet : écrire l'histoire de la page d'accueil, choisir les couleurs, les polices, les animations, faire en sorte que le jeu raconte quelque chose avant même qu'on appuie sur "Jouer". Transformer un exercice technique en quelque chose qui a un sens et une âme, c'était la partie la plus fun.

**Nathan** a apprécié le travail sur le chronomètre et l'optimisation de `Game.js`; s'assurer que la logique tienne la route. Voir les performances s'améliorer et le comportement du jeu devenir prévisible, c'était satisfaisant.

**Tiago** a adoré ajouter les sons et observer le jeu évoluer coup par coup. Entendre un petit effet sonore au retournement d'une carte ou à la découverte d'une paire, ça change tout à l'immersion. Voir la logique prendre vie en temps réel, c'était clairement le moment le plus satisfaisant du projet.

---

## Nos difficultés

Le plus challengeant pour tout le monde a été **`DOMManager.js`** et **`Game.js`**.

`DOMManager` demandait de bien comprendre comment le JavaScript interagit avec le HTML en temps réel ; gérer les états des cartes, l'affichage conditionnel des vues, les événements au clic, sans jamais mélanger la logique d'affichage avec la logique métier. La frontière est fine et on l'a franchie plus d'une fois.

`Game.js` était le coeur du projet : orchestrer le mélange des cartes, la comparaison des paires, le verrouillage pendant la vérification, le chronomètre et la fin de partie, tout en gardant un code lisible. La gestion des champs privés et des callbacks asynchrones nous a bien donné du fil à retordre.

---

## Fonctionnalités

### Minimum attendu
- Formulaire d'accueil avec pseudo, difficulté et collection d'images
- Plateau de jeu avec cartes face cachée et effet de retournement
- Détection des paires et fin de partie
- Chronomètre compte à rebours et envoi du score au serveur

### Fonctionnalités bonus
- Compteur de coups en temps réel
- Écran de fin avec récapitulatif (temps, coups, bouton rejouer)
- Confettis animés en cas de victoire, avec effet sonnore
- Flash rouge en cas de défaite ou d'abandon, avec effet sonnore
- Sons au retournement de carte et à la découverte d'une paire
- Collections d'images supplémentaires
- Système de combos (enchaînement de paires : multiplicateur x2, x3… avec son progressif)
- Mode "Memory Inversé" : associer des paires liées par une logique (clé/serrure, soleil/lune…) plutôt que des images identiques

---

## Collections d'images disponibles

- Animaux
  <p align="center">
    <img src="assets/images/animals/animal1.png" width="12%">
    <img src="assets/images/animals/animal2.png" width="12%">
    <img src="assets/images/animals/animal3.png" width="12%">
    <img src="assets/images/animals/animal4.png" width="12%">
    <img src="assets/images/animals/animal5.png" width="12%">
    <img src="assets/images/animals/animal6.png" width="12%">
    <img src="assets/images/animals/animal7.png" width="12%">
    <img src="assets/images/animals/animal8.png" width="12%">
  </p>
- Fruits
  <p align="center">
    <img src="assets/images/fruits/fruit1.png" width="12%">
    <img src="assets/images/fruits/fruit2.png" width="12%">
    <img src="assets/images/fruits/fruit3.png" width="12%">
    <img src="assets/images/fruits/fruit4.png" width="12%">
    <img src="assets/images/fruits/fruit5.png" width="12%">
    <img src="assets/images/fruits/fruit6.png" width="12%">
    <img src="assets/images/fruits/fruit7.png" width="12%">
    <img src="assets/images/fruits/fruit8.png" width="12%">
  </p>
- Voitures
  <p align="center">
    <img src="assets/images/cars/car1.png" width="12%">
    <img src="assets/images/cars/car2.png" width="12%">
    <img src="assets/images/cars/car3.png" width="12%">
    <img src="assets/images/cars/car4.png" width="12%">
    <img src="assets/images/cars/car5.png" width="12%">
    <img src="assets/images/cars/car6.png" width="12%">
    <img src="assets/images/cars/car7.png" width="12%">
    <img src="assets/images/cars/car8.png" width="12%">
  </p>
- Mario Party
  <p align="center">
    <img src="assets/images/animals/animal1.png" width="12%">
    <img src="assets/images/animals/animal2.png" width="12%">
    <img src="assets/images/animals/animal3.png" width="12%">
    <img src="assets/images/animals/animal4.png" width="12%">
    <img src="assets/images/animals/animal5.png" width="12%">
    <img src="assets/images/animals/animal6.png" width="12%">
    <img src="assets/images/animals/animal7.png" width="12%">
    <img src="assets/images/animals/animal8.png" width="12%">
  </p>
- Studio Ghibli
  <p align="center">
    <img src="assets/images/ghibli/ghibli1.png" width="12%">
    <img src="assets/images/ghibli/ghibli2.png" width="12%">
    <img src="assets/images/ghibli/ghibli3.png" width="12%">
    <img src="assets/images/ghibli/ghibli4.png" width="12%">
    <img src="assets/images/ghibli/ghibli5.png" width="12%">
    <img src="assets/images/ghibli/ghibli6.png" width="12%">
    <img src="assets/images/ghibli/ghibli7.png" width="12%">
    <img src="assets/images/ghibli/ghibli8.png" width="12%">
  </p>
- Walt Disney
  <p align="center">
    <img src="assets/images/disney/disney1.png" width="12%">
    <img src="assets/images/disney/disney2.png" width="12%">
    <img src="assets/images/disney/disney3.png" width="12%">
    <img src="assets/images/disney/disney4.png" width="12%">
    <img src="assets/images/disney/disney5.png" width="12%">
    <img src="assets/images/disney/disney6.png" width="12%">
    <img src="assets/images/disney/disney7.png" width="12%">
    <img src="assets/images/disney/disney8.png" width="12%">
  </p>
- BDE 24-25
  <p align="center">
    <img src="assets/images/bde/bde1.png" width="12%">
    <img src="assets/images/bde/bde2.png" width="12%">
    <img src="assets/images/bde/bde3.png" width="12%">
    <img src="assets/images/bde/bde4.png" width="12%">
    <img src="assets/images/bde/bde5.png" width="12%">
    <img src="assets/images/bde/bde6.png" width="12%">
    <img src="assets/images/bde/bde7.png" width="12%">
    <img src="assets/images/bde/bde8.png" width="12%">
  </p>
- Pokémon
  <p align="center">
    <img src="assets/images/pokemon/pokemon1.png" width="12%">
    <img src="assets/images/pokemon/pokemon2.png" width="12%">
    <img src="assets/images/pokemon/pokemon3.png" width="12%">
    <img src="assets/images/pokemon/pokemon4.png" width="12%">
    <img src="assets/images/pokemon/pokemon5.png" width="12%">
    <img src="assets/images/pokemon/pokemon6.png" width="12%">
    <img src="assets/images/pokemon/pokemon7.png" width="12%">
    <img src="assets/images/pokemon/pokemon8.png" width="12%">
  </p>
- Youtubeurs Français
  <p align="center">
    <img src="assets/images/youtube/youtube1.png" width="12%">
    <img src="assets/images/youtube/youtube2.png" width="12%">
    <img src="assets/images/youtube/youtube3.png" width="12%">
    <img src="assets/images/youtube/youtube4.png" width="12%">
    <img src="assets/images/youtube/youtube5.png" width="12%">
    <img src="assets/images/youtube/youtube6.png" width="12%">
    <img src="assets/images/youtube/youtube7.png" width="12%">
    <img src="assets/images/youtube/youtube8.png" width="12%">
  </p>
- Albums Intergenerationel
  <p align="center">
    <img src="assets/images/icon/icon1.png" width="12%">
    <img src="assets/images/icon/icon2.png" width="12%">
    <img src="assets/images/icon/icon3.png" width="12%">
    <img src="assets/images/icon/icon4.png" width="12%">
    <img src="assets/images/icon/icon5.png" width="12%">
    <img src="assets/images/icon/icon6.png" width="12%">
    <img src="assets/images/icon/icon7.png" width="12%">
    <img src="assets/images/icon/icon8.png" width="12%">
  </p>
- Albums en vogue actuellement
  <p align="center">
    <img src="assets/images/top/top1.png" width="12%">
    <img src="assets/images/top/top2.png" width="12%">
    <img src="assets/images/top/top3.png" width="12%">
    <img src="assets/images/top/top4.png" width="12%">
    <img src="assets/images/top/top5.png" width="12%">
    <img src="assets/images/top/top6.png" width="12%">
    <img src="assets/images/top/top7.png" width="12%">
    <img src="assets/images/top/top8.png" width="12%">
  </p>
- Marques connues
  <p align="center">
    <img src="assets/images/brands/brand1.png" width="12%">
    <img src="assets/images/brands/brand2.png" width="12%">
    <img src="assets/images/brands/brand3.png" width="12%">
    <img src="assets/images/brands/brand4.png" width="12%">
    <img src="assets/images/brands/brand5.png" width="12%">
    <img src="assets/images/brands/brand6.png" width="12%">
    <img src="assets/images/brands/brand7.png" width="12%">
    <img src="assets/images/brands/brand8.png" width="12%">
  </p>
- Genshin Impact
  <p align="center">
    <img src="assets/images/genshin/genshin1.png" width="12%">
    <img src="assets/images/genshin/genshin2.png" width="12%">
    <img src="assets/images/genshin/genshin3.png" width="12%">
    <img src="assets/images/genshin/genshin4.png" width="12%">
    <img src="assets/images/genshin/genshin5.png" width="12%">
    <img src="assets/images/genshin/genshin6.png" width="12%">
    <img src="assets/images/genshin/genshin7.png" width="12%">
    <img src="assets/images/genshin/genshin8.png" width="12%">
  </p>
- Personnes marquantes
  <p align="center">
    <img src="assets/images/knowns/known1.png" width="12%">
    <img src="assets/images/knowns/known2.png" width="12%">
    <img src="assets/images/knowns/known3.png" width="12%">
    <img src="assets/images/knowns/known4.png" width="12%">
    <img src="assets/images/knowns/known5.png" width="12%">
    <img src="assets/images/knowns/known6.png" width="12%">
    <img src="assets/images/knowns/known7.png" width="12%">
    <img src="assets/images/knowns/known8.png" width="12%">
  </p>
- Mode Memory Inversé
  <p align="center">
    <img src="assets/images/inverse/compare1.png" width="12%">
    <img src="assets/images/inverse/compare2.png" width="12%">
    <img src="assets/images/inverse/compare3.png" width="12%">
    <img src="assets/images/inverse/compare4.png" width="12%">
    <img src="assets/images/inverse/compare5.png" width="12%">
    <img src="assets/images/inverse/compare6.png" width="12%">
    <img src="assets/images/inverse/compare7.png" width="12%">
    <img src="assets/images/inverse/compare8.png" width="12%">
  </p>
  <p align="center">
    <img src="assets/images/inverse/comparant1.png" width="12%">
    <img src="assets/images/inverse/comparant2.png" width="12%">
    <img src="assets/images/inverse/comparant3.png" width="12%">
    <img src="assets/images/inverse/comparant4.png" width="12%">
    <img src="assets/images/inverse/comparant5.png" width="12%">
    <img src="assets/images/inverse/comparant6.png" width="12%">
    <img src="assets/images/inverse/comparant7.png" width="12%">
    <img src="assets/images/inverse/comparant8.png" width="12%">
  </p>

---

## Suivi d'avancement

| Tâche | Statut   |
|---|----------|
| Formulaire d'accueil | Terminé  |
| Affichage des cartes | Terminé  |
| Logique de jeu | Terminé  |
| Chronomètre | Terminé  |
| Liaison serveur | Terminé  |
| Compteur de coups | Terminé  |
| Écran de fin | Terminé  |
| Animations victoire / défaite | Terminé  |
| Sons | Terminé  |
| Collections d'images supplémentaires | En cours |
| Système de combos | Terminé  |
| Mode Memory Inversé | En cours |
