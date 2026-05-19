/**
 * Applique des effets rétro au canvas.
 */
class EffectsManager {
  constructor() {
    this.canvas = canvasManager.canvas
    this.ctx = canvasManager.ctx
    this.effects = {
      crt: false,
      scanlines: true,
      glitch: false,
      flicker: false,
    }
  }

  /**
   * Applique un effet CRT au canvas.
   */
  applyCRTEffect() {
    if (!this.effects.crt) return

    // Ajoute un overlay CRT
    const overlay = document.createElement('div')
    overlay.className = 'crt-effect'
    overlay.style.position = 'absolute'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = `${this.canvas.width}px`
    overlay.style.height = `${this.canvas.height}px`
    overlay.style.pointerEvents = 'none'
    overlay.style.borderRadius = '5px'
    overlay.style.zIndex = '10'

    const container = this.canvas.parentElement
    container.appendChild(overlay)
  }

  /**
   * Applique un effet de scanlines.
   */
  applyScanlines() {
    if (!this.effects.scanlines) return

    const overlay = document.querySelector('.canvas-overlay')
    if (overlay) {
      overlay.style.display = 'block'
    }
  }

  /**
   * Applique un effet de glitch.
   */
  applyGlitchEffect() {
    if (!this.effects.glitch) return

    this.canvas.classList.add('glitch-effect')
  }

  /**
   * Applique un effet de flicker.
   */
  applyFlickerEffect() {
    if (!this.effects.flicker) return

    this.canvas.classList.add('flicker-effect')
  }

  /**
   * Active/désactive un effet.
   * @param {string} effect - Nom de l'effet ("crt", "scanlines", "glitch", "flicker").
   * @param {boolean} enable - Vrai pour activer, faux pour désactiver.
   */
  toggleEffect(effect, enable) {
    this.effects[effect] = enable

    switch (effect) {
      case 'crt':
        this.applyCRTEffect()
        break
      case 'scanlines':
        this.applyScanlines()
        break
      case 'glitch':
        this.applyGlitchEffect()
        break
      case 'flicker':
        this.applyFlickerEffect()
        break
    }
  }
}

// Crée une instance globale du gestionnaire d'effets
const effectsManager = new EffectsManager()
