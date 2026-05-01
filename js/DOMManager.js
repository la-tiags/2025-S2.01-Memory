export class DOMManager {


  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Card[]} cards - Tableau des cartes avec les images
   * @param {Function} onCardClick - Callback appelé quand une carte est cliquée
   */
  createCards(cards, onCardClick) {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';

    cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.setAttribute('data-index', index);

      const cardInner = document.createElement('div');
      cardInner.className = 'card-inner';

      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      const maskImg = document.createElement('img');
      maskImg.src = './assets/images/mask1.jpg';
      maskImg.alt = 'Carte cachée';
      cardFront.appendChild(maskImg);

      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      const backImg = document.createElement('img');
      backImg.src = card.image.url;
      backImg.alt = card.image.name;
      cardBack.appendChild(backImg);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardElement.appendChild(cardInner);

      // Ajouter l'événement de clic
      cardElement.addEventListener('click', () => onCardClick(index));

      gameBoard.appendChild(cardElement);
    });
  }
}
