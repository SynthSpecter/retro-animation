/**
 * Gère l'export des animations (GIF, PNG, etc.).
 */
class Exporter {
  constructor() {
    this.exportModal = document.getElementById('export-modal')
    this.confirmExportBtn = document.getElementById('confirm-export-btn')
    this.cancelExportBtn = document.getElementById('cancel-export-btn')
    this.exportNameInput = document.getElementById('export-name')
    this.exportScaleInput = document.getElementById('export-scale')
    this.exportScaleValue = document.getElementById('export-scale-value')

    this.setupEventListeners()
  }

  /**
   * Configure les écouteurs d'événements.
   */
  setupEventListeners() {
    // Mise à jour de l'échelle
    this.exportScaleInput.addEventListener('input', () => {
      this.exportScaleValue.textContent = this.exportScaleInput.value
    })

    // Confirmation de l'export
    this.confirmExportBtn.addEventListener('click', () =>
      this.exportAnimation(),
    )

    // Annulation
    this.cancelExportBtn.addEventListener('click', () => {
      this.exportModal.classList.add('hidden')
    })
  }

  /**
   * Ouvre la modale d'export.
   */
  openExportModal() {
    this.exportModal.classList.remove('hidden')
  }

  /**
   * Exporte l'animation.
   */
  exportAnimation() {
    const name = this.exportNameInput.value || 'retro-animation'
    const scale = parseInt(this.exportScaleInput.value)
    const frames = animationManager.getFrames()
    const fps = animationManager.fps

    if (frames.length === 0) {
      showNotification('Aucun frame à exporter / No frames to export', 'error')
      return
    }

    // Crée un canvas pour l'export
    const exportCanvas = document.createElement('canvas')
    const ctx = exportCanvas.getContext('2d')
    exportCanvas.width = canvasManager.width * canvasManager.gridSize * scale
    exportCanvas.height = canvasManager.height * canvasManager.gridSize * scale

    // Crée un tableau pour stocker les images
    const images = []

    // Dessine chaque frame sur le canvas d'export
    frames.forEach((frame) => {
      ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(
        canvasManager.canvas,
        0,
        0,
        canvasManager.canvas.width,
        canvasManager.canvas.height,
        0,
        0,
        exportCanvas.width,
        exportCanvas.height,
      )
      images.push(exportCanvas)
    })

    // Exporte en GIF
    if (this.confirmExportBtn.id === 'confirm-export-btn') {
      this.exportAsGIF(images, name, fps)
    }

    this.exportModal.classList.add('hidden')
    showNotification(`Export terminé ! / Export complete!`, 'success')

    // Joue un son d'export (optionnel)
    const sound = document.getElementById('export-sound')
    if (sound) {
      sound.currentTime = 0
      sound.play().catch((e) => console.log('Son non chargé :', e))
    }
  }

  /**
   * Exporte l'animation en GIF.
   * @param {Array<HTMLCanvasElement>} images - Tableau des images (frames).
   * @param {string} name - Nom du fichier.
   * @param {number} fps - Frames par seconde.
   */
  exportAsGIF(images, name, fps) {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: images[0].width,
      height: images[0].height,
    })

    images.forEach((img) => {
      gif.addFrame(img, { delay: 1000 / fps, copy: true })
    })

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${name}.gif`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    })

    gif.render()
  }

  /**
   * Exporte l'animation en PNG (frame actuel).
   */
  exportAsPNG() {
    const name = this.exportNameInput.value || 'retro-animation'
    const scale = parseInt(this.exportScaleInput.value)

    const exportCanvas = document.createElement('canvas')
    const ctx = exportCanvas.getContext('2d')
    exportCanvas.width = canvasManager.width * canvasManager.gridSize * scale
    exportCanvas.height = canvasManager.height * canvasManager.gridSize * scale

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      canvasManager.canvas,
      0,
      0,
      canvasManager.canvas.width,
      canvasManager.canvas.height,
      0,
      0,
      exportCanvas.width,
      exportCanvas.height,
    )

    const url = exportCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${name}.png`
    link.href = url
    link.click()
  }
}

// Crée une instance globale de l'exportateur
const exporter = new Exporter()
