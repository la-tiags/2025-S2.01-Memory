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
  #onExpire = null;
  #maxSeconds = 180;

  /**
   * @param {Function} onTick - Callback appelé chaque seconde avec (secondsElapsed)
   */
  constructor(onTick, onExpire = null, maxSeconds = 180) {
    this.#onTick    = onTick;
    this.#onExpire  = onExpire;
    this.#maxSeconds = maxSeconds;
  }
  /**
   * Démarre le timer (réinitialise le compteur).
   */
  start() {
    this.reset();
    this.#onTick(this.#maxSeconds);
    this.#intervalId = setInterval(() => {
      this.#secondsElapsed++;
      const remaining = this.#maxSeconds - this.#secondsElapsed;
      this.#onTick(remaining);
      if (remaining <= 0) {
        this.stop();
        this.#onExpire?.();
      }
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
