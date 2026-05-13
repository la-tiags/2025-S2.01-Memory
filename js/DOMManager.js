/**
 * Gère toutes les interactions avec le DOM pour le jeu de memory.
 * Responsabilité unique : lecture et écriture dans le DOM, aucune logique métier.
 */
import { Timer } from './Timer.js';
export class DOMManager {
  // ─── Sélecteurs centralisés ───────────────────────────────────────────────

  static SELECTORS = {
    DIFFICULTY:      '#difficulty',
    COLLECTION:      '#collection',
    GAME_BOARD:      '.game-board',
    TIMER:           '.timer',
    SETUP_FORM:      '.setup-form',
    GAME_CONTAINER:  '.game-container',
    MODAL:           '#confirm-modal',
    MODAL_MESSAGE:   '#confirm-modal .modal-message',
    MODAL_CONFIRM:   '#confirm-modal .modal-confirm',
    MODAL_CANCEL:    '#confirm-modal .modal-cancel',
    ERROR_BANNER:    '#error-banner',
    MOVES:           '.moves-counter',
    END_SCREEN:      '#end-screen',
    END_EMOJI:       '#end-emoji',
    END_TITLE:       '#end-title',
    END_MESSAGE:     '#end-message',
    REPLAY_BTN:      '#replay-btn',
  };

  // ─── Lecture de formulaire ────────────────────────────────────────────────

  /**
   * @returns {{ difficulty: number, collectionName: string }}
   */
  getFormValues() {
    const difficulty     = parseInt(document.querySelector(DOMManager.SELECTORS.DIFFICULTY)?.value);
    const collectionName = document.querySelector(DOMManager.SELECTORS.COLLECTION)?.value;

    if (isNaN(difficulty) || !collectionName) {
      throw new Error('Impossible de lire les valeurs du formulaire.');
    }

    return { difficulty, collectionName };
  }

  // ─── Affichage / masquage des vues ────────────────────────────────────────

  showGame() {
    document.querySelector(DOMManager.SELECTORS.SETUP_FORM).style.display  = 'none';
    document.querySelector(DOMManager.SELECTORS.GAME_CONTAINER).style.display = 'flex';
  }

  showSetup() {
    document.querySelector(DOMManager.SELECTORS.SETUP_FORM).style.display  = 'block';
    document.querySelector(DOMManager.SELECTORS.GAME_CONTAINER).style.display = 'none';
  }

  // ─── Timer ────────────────────────────────────────────────────────────────

  /**
   * Met à jour l'affichage du timer.
   * @param {string} formattedTime - ex : "02:45"
   */
  updateTimer(formattedTime) {
    const el = document.querySelector(DOMManager.SELECTORS.TIMER);
    if (el) el.textContent = formattedTime;
  }

  // ─── Plateau de jeu ───────────────────────────────────────────────────────

  /**
   * Vide et reconstruit le plateau avec les cartes fournies.
   * @param {Array<{ index: number, image: object }>} cards
   * @param {Function} onCardClick - callback(cardIndex)
   */
  createCards(cards, onCardClick) {
    const board = document.querySelector(DOMManager.SELECTORS.GAME_BOARD);
    board.innerHTML = '';

    cards.forEach(card => {
      const el = document.createElement('div');
      el.classList.add('card');
      el.dataset.index = card.index;
      el.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">
            <img src="${card.image.url}" alt="${card.image.name}">
          </div>
        </div>`;
      el.addEventListener('click', () => onCardClick(card.index));
      board.appendChild(el);
    });
  }

  /**
   * Retourne une carte (face visible).
   * @param {number} cardIndex
   */
  flipCard(cardIndex) {
    this.#getCardElement(cardIndex)?.classList.add('flipped');
  }

  /**
   * Cache une carte (face cachée).
   * @param {number} cardIndex
   */
  unflipCard(cardIndex) {
    this.#getCardElement(cardIndex)?.classList.remove('flipped');
  }

  /**
   * Marque une carte comme appairée.
   * @param {number} cardIndex
   */
  markMatched(cardIndex) {
    this.#getCardElement(cardIndex)?.classList.add('matched');
  }

  // ─── Modale de confirmation ───────────────────────────────────────────────

  /**
   * Affiche une modale de confirmation non-bloquante.
   * @param {string} message
   * @param {Function} onConfirm
   * @param {Function} [onCancel]
   */
  showConfirmModal(message, onConfirm, onCancel) {
    const modal   = document.querySelector(DOMManager.SELECTORS.MODAL);
    const msgEl   = document.querySelector(DOMManager.SELECTORS.MODAL_MESSAGE);
    const confirmBtn = document.querySelector(DOMManager.SELECTORS.MODAL_CONFIRM);
    const cancelBtn  = document.querySelector(DOMManager.SELECTORS.MODAL_CANCEL);

    if (!modal) {
      // Fallback si la modale n'existe pas encore dans le HTML
      if (window.confirm(message)) onConfirm();
      else onCancel?.();
      return;
    }

    msgEl.textContent = message;
    modal.classList.add('visible');

    const cleanup = () => modal.classList.remove('visible');

    confirmBtn.onclick = () => { cleanup(); onConfirm(); };
    cancelBtn.onclick  = () => { cleanup(); onCancel?.(); };
  }

  // ─── Bannière d'erreur ────────────────────────────────────────────────────

  /**
   * Affiche un message d'erreur non-bloquant dans le DOM.
   * @param {string} message
   * @param {number} [durationMs=4000]
   */
  showError(message, durationMs = 4000) {
    let banner = document.querySelector(DOMManager.SELECTORS.ERROR_BANNER);

    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'error-banner';
      banner.setAttribute('role', 'alert');
      document.body.appendChild(banner);
    }

    banner.textContent = message;
    banner.classList.add('visible');

    setTimeout(() => banner.classList.remove('visible'), durationMs);
  }

  /**
   * Affiche un message combo en grand sur l'écran à une position aléatoire.
   * @param {number} comboCount
   */
  showComboBurst(comboCount) {
    const burst = document.createElement('div');
    burst.className = 'combo-burst';
    burst.textContent = `x${comboCount}`;

    const edgeRatio = 0.12;
    const left = Math.random() * (1 - edgeRatio * 2) + edgeRatio;
    const top = Math.random() * (1 - edgeRatio * 2) + edgeRatio;

    burst.style.left = `${left * 100}%`;
    burst.style.top = `${top * 100}%`;

    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  }

  // ─── Utilitaire privé ─────────────────────────────────────────────────────

  /**
   * @param {number} cardIndex
   * @returns {HTMLElement|null}
   */
  #getCardElement(cardIndex) {
    return document.querySelector(`[data-index="${cardIndex}"]`);
  }
    updateMoves(count)
    {
      const el = document.querySelector(DOMManager.SELECTORS.MOVES);
      if (el) el.textContent = `${count} coup${count > 1 ? 's' : ''}`;
    }
//feature: endgame screen
    showEndScreen(won, moves, seconds, onReplay)
    {
      const screen = document.querySelector(DOMManager.SELECTORS.END_SCREEN);
      const emoji = document.querySelector(DOMManager.SELECTORS.END_EMOJI);
      const title = document.querySelector(DOMManager.SELECTORS.END_TITLE);
      const message = document.querySelector(DOMManager.SELECTORS.END_MESSAGE);
      const btn = document.querySelector(DOMManager.SELECTORS.REPLAY_BTN);

      if (won) {
        emoji.textContent = '🎉';
        title.textContent = 'Bravo !';
        message.textContent = `Tu as trouvé toutes les paires en ${moves} coup${moves > 1 ? 's' : ''} et ${Timer.format(seconds)} !`;
        this.#launchConfetti();
        ////feature: endgame screen (lose:flash)
      } else {
        emoji.textContent = '😔';
        title.textContent = 'Partie terminée';
        message.textContent = `Tu avais encore ${moves} paire${moves > 1 ? 's' : ''} à trouver. Retente ta chance !`;
        document.body.classList.add('lose-flash');
        setTimeout(() => document.body.classList.remove('lose-flash'), 1500);
      }

      screen.classList.add('visible');
      btn.onclick = () => {
        screen.classList.remove('visible');
        onReplay();
      };
    }
  
//feature: endgame screen (win:conffetis)
  #launchConfetti() {
    const colors = ['#a2d2ff', '#ffafcc', '#bde0fe', '#ffc2d1', '#cdb4db'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left              = Math.random() * 100 + 'vw';
      piece.style.background        = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
      piece.style.animationDelay    = (Math.random() * 1) + 's';
      document.body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  }
}
