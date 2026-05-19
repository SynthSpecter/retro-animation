/**
 * Gère l'animation (frames, timeline, lecture).
 */
class AnimationManager {
  constructor() {
    this.frames = []
    this.currentFrameIndex = 0
    this.isPlaying = false
    this.animationInterval = null
    this.fps = 10
    this.timeline = document.getElementById('timeline')
    this.fpsSlider = document.getElementById('fps-slider')
    this.fpsValue = document.getElementById('fps-value')

    this.setupEventListeners()
    this.addFrame() // Ajoute un premier frame vide
  }

  /**
   * Configure les écouteurs d'événements.
   */
  setupEventListeners() {
    // Ajouter un frame
    document
      .getElementById('add-frame-btn')
      .addEventListener('click', () => this.addFrame())

    // Supprimer un frame
    document
      .getElementById('remove-frame-btn')
      .addEventListener('click', () => this.removeFrame())

    // Lecture
    document
      .getElementById('play-btn')
      .addEventListener('click', () => this.play())

    // Arrêt
    document
      .getElementById('stop-btn')
      .addEventListener('click', () => this.stop())

    // Changement de FPS
    this.fpsSlider.addEventListener('input', () => {
      this.fps = parseInt(this.fpsSlider.value)
      this.fpsValue.textContent = `FPS: ${this.fps}`
      if (this.isPlaying) {
        this.stop()
        this.play()
      }
    })
  }

  /**
   * Ajoute un nouveau frame.
   */
  addFrame() {
    // Sauvegarde le frame actuel
    this.frames.push(canvasManager.getFrameData())
    this.currentFrameIndex = this.frames.length - 1
    this.updateTimeline()
  }

  /**
   * Supprime le frame actuel.
   */
  removeFrame() {
    if (this.frames.length <= 1) {
      showNotification(
        'Impossible de supprimer le dernier frame / Cannot remove the last frame',
        'error',
      )
      return
    }

    this.frames.splice(this.currentFrameIndex, 1)
    if (this.currentFrameIndex >= this.frames.length) {
      this.currentFrameIndex = this.frames.length - 1
    }
    this.updateTimeline()
    this.loadFrame(this.currentFrameIndex)
  }

  /**
   * Met à jour la timeline.
   */
  updateTimeline() {
    this.timeline.innerHTML = ''
    this.frames.forEach((frame, index) => {
      const frameElement = document.createElement('div')
      frameElement.className = `frame ${index === this.currentFrameIndex ? 'active' : ''}`
      frameElement.dataset.index = index

      const frameCanvas = document.createElement('canvas')
      frameCanvas.width = 60
      frameCanvas.height = 60
      const frameCtx = frameCanvas.getContext('2d')
      frameCtx.imageSmoothingEnabled = false
      frameCtx.putImageData(frame, 0, 0, 0, 0, 60, 60)

      frameElement.appendChild(frameCanvas)

      const frameNumber = document.createElement('div')
      frameNumber.className = 'frame-number'
      frameNumber.textContent = index + 1

      frameElement.appendChild(frameNumber)

      frameElement.addEventListener('click', () => this.loadFrame(index))
      this.timeline.appendChild(frameElement)
    })
  }

  /**
   * Charge un frame.
   * @param {number} index - Index du frame à charger.
   */
  loadFrame(index) {
    if (index < 0 || index >= this.frames.length) return

    this.currentFrameIndex = index
    canvasManager.drawFrame(this.frames[index])
    this.updateTimeline()
  }

  /**
   * Joue l'animation.
   */
  play() {
    if (this.frames.length <= 1) {
      showNotification(
        "Ajoutez plus de frames pour jouer l'animation / Add more frames to play the animation",
        'error',
      )
      return
    }

    if (this.isPlaying) return

    this.isPlaying = true
    const delay = 1000 / this.fps

    this.animationInterval = setInterval(() => {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length
      canvasManager.drawFrame(this.frames[this.currentFrameIndex])
      this.updateTimeline()
    }, delay)
  }

  /**
   * Arrête l'animation.
   */
  stop() {
    if (!this.isPlaying) return

    clearInterval(this.animationInterval)
    this.isPlaying = false
  }

  /**
   * Retourne les frames de l'animation.
   * @returns {Array<ImageData>} - Tableau des frames.
   */
  getFrames() {
    return this.frames
  }

  /**
   * Définit les frames de l'animation.
   * @param {Array<ImageData>} frames - Tableau des frames.
   */
  setFrames(frames) {
    this.frames = frames
    this.currentFrameIndex = 0
    this.updateTimeline()
    this.loadFrame(0)
  }
}

// Crée une instance globale du gestionnaire d'animation
const animationManager = new AnimationManager()
