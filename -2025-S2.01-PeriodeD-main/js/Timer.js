/**
 * Gère le chronomètre du jeu de memory.
 * Responsabilité unique : compter les secondes et notifier via callback.
 */
export class Timer {
  /** @type {number} */
  #secondsElapsed = 0;

  /** @type {number|null} */
  #intervalId = null;

  /** @type {Function|null} Appelé à chaque tick avec le nombre de secondes */
  #onTick = null;

  /**
   * @param {Function} onTick - Callback appelé chaque seconde avec (secondsElapsed)
   */
  constructor(onTick) {
    if (typeof onTick !== 'function') {
      throw new Error('Timer requires an onTick callback function');
    }
    this.#onTick = onTick;
  }

  /**
   * Démarre le timer (réinitialise le compteur).
   */
  start() {
    this.reset();
    this.#onTick(this.#secondsElapsed); // affichage immédiat à 00:00

    this.#intervalId = setInterval(() => {
      this.#secondsElapsed++;
      this.#onTick(this.#secondsElapsed);
    }, 1000);
  }

  /**
   * Arrête le timer sans réinitialiser le compteur.
   */
  stop() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  /**
   * Remet le compteur à zéro (sans arrêter s'il tourne).
   */
  reset() {
    this.stop();
    this.#secondsElapsed = 0;
  }

  /**
   * @returns {number} Le nombre de secondes écoulées
   */
  get seconds() {
    return this.#secondsElapsed;
  }

  /**
   * @returns {boolean} Vrai si le timer tourne actuellement
   */
  get isRunning() {
    return this.#intervalId !== null;
  }

  /**
   * Formate les secondes en MM:SS
   * @param {number} totalSeconds
   * @returns {string}
   */
  static format(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
