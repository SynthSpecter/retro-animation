/**
 * Initialise l'application Retro Animation Studio.
 */

// Affiche une notification.
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification')
  if (!notification) return

  notification.textContent = message
  notification.className = `notification ${type}`
  notification.classList.remove('hidden')

  setTimeout(() => {
    notification.classList.add('hidden')
  }, 3000)
}

// Initialise l'application
document.addEventListener('DOMContentLoaded', () => {
  // Charge les sprites
  spriteManager.loadSprites()

  // Configure les outils
  document.getElementById('pencil-tool').addEventListener('click', () => {
    canvasManager.setTool('pencil')
    document
      .querySelectorAll('.tool-button')
      .forEach((btn) => btn.classList.remove('active'))
    document.getElementById('pencil-tool').classList.add('active')
  })

  document.getElementById('eraser-tool').addEventListener('click', () => {
    canvasManager.setTool('eraser')
    document
      .querySelectorAll('.tool-button')
      .forEach((btn) => btn.classList.remove('active'))
    document.getElementById('eraser-tool').classList.add('active')
  })

  document.getElementById('fill-tool').addEventListener('click', () => {
    canvasManager.setTool('fill')
    document
      .querySelectorAll('.tool-button')
      .forEach((btn) => btn.classList.remove('active'))
    document.getElementById('fill-tool').classList.add('active')
  })

  document.getElementById('sprite-tool').addEventListener('click', () => {
    canvasManager.setTool('sprite')
    document
      .querySelectorAll('.tool-button')
      .forEach((btn) => btn.classList.remove('active'))
    document.getElementById('sprite-tool').classList.add('active')
    document.getElementById('sprites-panel').classList.remove('hidden')
  })

  // Fermer le panneau des sprites en cliquant ailleurs
  document.addEventListener('click', (e) => {
    const spritesPanel = document.getElementById('sprites-panel')
    if (!spritesPanel.contains(e.target) && !e.target.closest('#sprite-tool')) {
      spritesPanel.classList.add('hidden')
    }
  })

  // Couleur et taille du pinceau
  document.getElementById('color-picker').addEventListener('input', (e) => {
    canvasManager.setBrushColor(e.target.value)
  })

  document.getElementById('brush-size').addEventListener('input', (e) => {
    const size = parseInt(e.target.value)
    canvasManager.setBrushSize(size)
    document.getElementById('brush-size-value').textContent = size
  })

  // Actions du canvas
  canvasManager.canvas.addEventListener('click', (e) => {
    if (canvasManager.currentTool === 'fill') {
      const pos = canvasManager.getMousePos(e)
      canvasManager.floodFill(pos.x, pos.y)
    } else if (canvasManager.currentTool === 'sprite') {
      const pos = canvasManager.getMousePos(e)
      const sprite = spriteManager.getSelectedSprite()
      if (sprite) {
        spriteManager.drawSprite(
          canvasManager.ctx,
          pos.x * canvasManager.gridSize,
          pos.y * canvasManager.gridSize,
          1,
        )
      }
    }
  })

  // Export
  document.getElementById('export-gif-btn').addEventListener('click', () => {
    exporter.openExportModal()
  })

  document.getElementById('export-png-btn').addEventListener('click', () => {
    exporter.exportAsPNG()
  })

  // Effets
  effectsManager.toggleEffect('scanlines', true)

  showNotification(
    'Bienvenue dans Retro Animation Studio ! / Welcome to Retro Animation Studio!',
    'info',
  )
})
