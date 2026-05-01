import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';


export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id;

  /**
   * @type {DOMManager}
   */
  #domManager = new DOMManager();

  /**
   * @type {number} Nombre de paires restantes à trouver
   */
  #remainingPairs = 0;

  /**
   * @type {Array} Les cartes du jeu
   */
  #cards = [];

  /**
   * @type {number[]} Indices des cartes actuellement visibles
   */
  #flippedCards = [];

  /**
   * @type {number} Le nombre de secondes écoulées
   */
  #secondsElapsed = 0;

  /**
   * @type {number|null} ID du timer
   */
  #timerInterval = null;

  /**
   * @type {boolean} Pour éviter les clics pendant la vérification des paires
   */
  #isChecking = false;

  /**
   * @type {Image[]} Les images sélectionnées pour cette partie
   */
  #selectedImages = [];

  async endGame() {
    // Arrêter le timer
    this.stopTimer();

    try {
      const result = await ApiService.updateGameResult(this.#id, this.#remainingPairs);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    } finally {
      this.resetGameUI();
    }
  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   */
  startGame(id) {
    this.#id = id;

    // Récupérer les valeurs du formulaire
    const difficulty = document.querySelector('#difficulty').value;
    const collectionName = document.querySelector('#collection').value;

    // Obtenir la collection d'images
    const collection = imageCollections[collectionName];

    // Créer les paires d'images en fonction de la difficulté
    this.#selectedImages = this.createPairedImages(collection, parseInt(difficulty));
    this.#remainingPairs = this.#selectedImages.length / 2;

    // Créer le plateau de jeu
    this.createGameBoard();

    // Masquer le formulaire et afficher le conteneur de jeu
    document.querySelector('.setup-form').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    // Lancer le timer
    this.startTimer();
  }

  /**
   * Crée les cartes du jeu et les mélange
   */
  createGameBoard() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';

    // Créer les cartes avec les images doublées
    this.#cards = this.#selectedImages.map((image, index) => ({
      index,
      image,
      isFlipped: false,
      isMatched: false
    }));

    // Mélanger les cartes
    this.shuffleArray(this.#cards);

    // Afficher les cartes via DOMManager
    this.#domManager.createCards(this.#cards, (cardIndex) => this.handleCardClick(cardIndex));

    this.#flippedCards = [];
  }

  /**
   * Crée un tableau d'images appairées en fonction de la difficulté
   * @param {Image[]} collection - La collection d'images
   * @param {number} difficulty - Le niveau de difficulté (1=Facile, 2=Intermédiaire, 3=Expert)
   * @returns {Image[]} Tableau d'images doublées
   */
  createPairedImages(collection, difficulty) {
    // Calcul du nombre de paires selon la difficulté
    const pairCounts = {
      1: 4,   // Facile : 4 paires (8 cartes)
      2: 6,   // Intermédiaire : 6 paires (12 cartes)
      3: 8    // Expert : 8 paires (16 cartes)
    };

    const numPairs = pairCounts[difficulty] || 4;
    const selectedImages = collection.slice(0, numPairs);

    // Créer les paires (chaque image apparaît 2 fois)
    return selectedImages.flatMap(image => [image, image]);
  }

  /**
   * Mélange un tableau de manière aléatoire (Fisher-Yates shuffle)
   * @param {Array} array - Le tableau à mélanger
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Gère le clic sur une carte
   * @param {number} cardIndex - L'indice de la carte cliquée
   */
  handleCardClick(cardIndex) {
    // Éviter les clics pendant la vérification
    if (this.#isChecking) return;

    const card = this.#cards[cardIndex];

    // Éviter de cliquer sur une carte déjà appairée ou déjà visible
    if (card.isMatched || card.isFlipped || this.#flippedCards.includes(cardIndex)) return;

    // Ajouter la carte à la liste des visibles
    this.#flippedCards.push(cardIndex);
    card.isFlipped = true;

    // Retourner la carte visuellement
    this.flipCard(cardIndex);

    // Si deux cartes sont visibles, vérifier si elles correspondent
    if (this.#flippedCards.length === 2) {
      this.#isChecking = true;
      setTimeout(() => this.checkMatch(), 500);
    }
  }

  /**
   * Retourne une carte visuellement
   * @param {number} cardIndex - L'indice de la carte
   */
  flipCard(cardIndex) {
    const cardElement = document.querySelector(`[data-index="${cardIndex}"]`);
    if (cardElement) {
      cardElement.classList.add('flipped');
    }
  }

  /**
   * Remet une carte face cachée
   * @param {number} cardIndex - L'indice de la carte
   */
  unflipCard(cardIndex) {
    const cardElement = document.querySelector(`[data-index="${cardIndex}"]`);
    if (cardElement) {
      cardElement.classList.remove('flipped');
    }
  }

  /**
   * Vérifie si les deux cartes visibles correspondent
   */
  checkMatch() {
    const [index1, index2] = this.#flippedCards;
    const card1 = this.#cards[index1];
    const card2 = this.#cards[index2];

    if (card1.image.id === card2.image.id) {
      // Les cartes correspondent !
      card1.isMatched = true;
      card2.isMatched = true;
      this.#remainingPairs--;

      // Ajouter une classe CSS pour montrer que c'est une paire
      document.querySelector(`[data-index="${index1}"]`).classList.add('matched');
      document.querySelector(`[data-index="${index2}"]`).classList.add('matched');

      console.log('Paire trouvée ! Paires restantes:', this.#remainingPairs);

      // Vérifier si le jeu est gagné
      if (this.isGameWon()) {
        setTimeout(() => this.endGame(), 500);
      }
    } else {
      // Les cartes ne correspondent pas, les recacher
      card1.isFlipped = false;
      card2.isFlipped = false;
      this.unflipCard(index1);
      this.unflipCard(index2);

      console.log('Cartes qui ne correspondent pas. Paires restantes:', this.#remainingPairs);
    }

    // Réinitialiser
    this.#flippedCards = [];
    this.#isChecking = false;
  }

  /**
   * Vérifie si toutes les paires ont été trouvées
   * @returns {boolean}
   */
  isGameWon() {
    return this.#remainingPairs === 0;
  }

  /**
   * Lance le timer
   */
  startTimer() {
    this.#secondsElapsed = 0;
    this.updateTimerDisplay();

    this.#timerInterval = setInterval(() => {
      this.#secondsElapsed++;
      this.updateTimerDisplay();
    }, 1000);
  }

  /**
   * Met à jour l'affichage du timer
   */
  updateTimerDisplay() {
    const minutes = Math.floor(this.#secondsElapsed / 60);
    const seconds = this.#secondsElapsed % 60;
    const timerDisplay = document.querySelector('.timer');
    if (timerDisplay) {
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  /**
   * Arrête le timer
   */
  stopTimer() {
    if (this.#timerInterval !== null) {
      clearInterval(this.#timerInterval);
      this.#timerInterval = null;
    }
  }

  /**
   * Réinitialise l'interface du jeu
   */
  resetGameUI() {
    // Afficher le formulaire et masquer le conteneur de jeu
    document.querySelector('.setup-form').style.display = 'block';
    document.querySelector('.game-container').style.display = 'none';

    // Réinitialiser les propriétés
    this.#cards = [];
    this.#flippedCards = [];
    this.#remainingPairs = 0;
    this.#secondsElapsed = 0;
  }

  /**
   * Abandonne la partie en cours
   */
  abandonGame() {
    if (confirm('Es-tu sûr de vouloir abandonner la partie ?')) {
      this.endGame();
    }
  }
}
