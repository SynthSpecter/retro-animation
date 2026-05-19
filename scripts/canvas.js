/**
 * Gère le canvas et le dessin pixel par pixel.
 */
class CanvasManager {
  constructor() {
    this.canvas = document.getElementById('animation-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.gridSize = 20 // Taille de chaque pixel (en pixels)
    this.width = 32 // Largeur de la grille (en cases)
    this.height = 24 // Hauteur de la grille (en cases)
    this.currentTool = 'pencil'
    this.brushColor = '#ff2ced'
    this.brushSize = 1
    this.isDrawing = false
    this.lastX = 0
    this.lastY = 0

    this.setupCanvas()
    this.setupEventListeners()
  }

  /**
   * Configure le canvas.
   */
  setupCanvas() {
    this.canvas.width = this.width * this.gridSize
    this.canvas.height = this.height * this.gridSize
    this.ctx.imageSmoothingEnabled = false
    this.clearCanvas()
  }

  /**
   * Efface le canvas.
   */
  clearCanvas() {
    this.ctx.fillStyle = '#0a0a0a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGrid()
  }

  /**
   * Dessine la grille.
   */
  drawGrid() {
    this.ctx.strokeStyle = 'rgba(5, 217, 232, 0.2)'
    this.ctx.lineWidth = 1

    for (let x = 0; x <= this.width; x++) {
      this.ctx.beginPath()
      this.ctx.moveTo(x * this.gridSize, 0)
      this.ctx.lineTo(x * this.gridSize, this.canvas.height)
      this.ctx.stroke()
    }

    for (let y = 0; y <= this.height; y++) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y * this.gridSize)
      this.ctx.lineTo(this.canvas.width, y * this.gridSize)
      this.ctx.stroke()
    }
  }

  /**
   * Configure les écouteurs d'événements.
   */
  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e))
    this.canvas.addEventListener('mousemove', (e) => this.draw(e))
    this.canvas.addEventListener('mouseup', () => this.stopDrawing())
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing())

    // Pour les écrans tactiles
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e))
    this.canvas.addEventListener('touchmove', (e) => this.draw(e))
    this.canvas.addEventListener('touchend', () => this.stopDrawing())
  }

  /**
   * Début du dessin.
   * @param {Event} e - Événement de souris/tactile.
   */
  startDrawing(e) {
    this.isDrawing = true
    const pos = this.getMousePos(e)
    this.lastX = pos.x
    this.lastY = pos.y

    // Dessine un point si c'est un clic simple
    this.drawPixel(pos.x, pos.y)
  }

  /**
   * Dessin en cours.
   * @param {Event} e - Événement de souris/tactile.
   */
  draw(e) {
    if (!this.isDrawing) return

    const pos = this.getMousePos(e)
    const x = pos.x
    const y = pos.y

    // Dessine une ligne entre le dernier point et le nouveau
    this.drawLine(this.lastX, this.lastY, x, y)
    this.lastX = x
    this.lastY = y
  }

  /**
   * Arrête le dessin.
   */
  stopDrawing() {
    this.isDrawing = false
  }

  /**
   * Récupère la position de la souris/tactile.
   * @param {Event} e - Événement de souris/tactile.
   * @returns {Object} - Position {x, y} en coordonnées de grille.
   */
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect()
    let clientX, clientY

    if (e.type === 'touchstart' || e.type === 'touchmove') {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = Math.floor((clientX - rect.left) / this.gridSize)
    const y = Math.floor((clientY - rect.top) / this.gridSize)

    return { x, y }
  }

  /**
   * Dessine un pixel.
   * @param {number} x - Coordonnée X (en cases).
   * @param {number} y - Coordonnée Y (en cases).
   */
  drawPixel(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return

    this.ctx.fillStyle = this.brushColor
    this.ctx.fillRect(
      x * this.gridSize,
      y * this.gridSize,
      this.gridSize * this.brushSize,
      this.gridSize * this.brushSize,
    )

    // Joue un son de dessin (optionnel)
    const sound = document.getElementById('draw-sound')
    if (sound) {
      sound.currentTime = 0
      sound.play().catch((e) => console.log('Son non chargé :', e))
    }
  }

  /**
   * Dessine une ligne entre deux points.
   * @param {number} x1 - Coordonnée X de départ.
   * @param {number} y1 - Coordonnée Y de départ.
   * @param {number} x2 - Coordonnée X de fin.
   * @param {number} y2 - Coordonnée Y de fin.
   */
  drawLine(x1, y1, x2, y2) {
    // Algorithme de Bresenham pour dessiner une ligne pixel par pixel
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = x1 < x2 ? 1 : -1
    const sy = y1 < y2 ? 1 : -1
    let err = dx - dy

    while (true) {
      this.drawPixel(x1, y1)

      if (x1 === x2 && y1 === y2) break
      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        x1 += sx
      }
      if (e2 < dx) {
        err += dx
        y1 += sy
      }
    }
  }

  /**
   * Remplit une zone avec la couleur actuelle.
   * @param {number} x - Coordonnée X de départ.
   * @param {number} y - Coordonnée Y de départ.
   */
  floodFill(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return

    const targetColor = this.getPixelColor(x, y)
    if (targetColor === this.brushColor) return

    const stack = [[x, y]]
    while (stack.length) {
      const [currentX, currentY] = stack.pop()
      this.drawPixel(currentX, currentY)

      // Vérifie les 4 voisins (haut, bas, gauche, droite)
      const neighbors = [
        [currentX, currentY - 1],
        [currentX, currentY + 1],
        [currentX - 1, currentY],
        [currentX + 1, currentY],
      ]

      neighbors.forEach(([nx, ny]) => {
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (this.getPixelColor(nx, ny) === targetColor) {
            stack.push([nx, ny])
          }
        }
      })
    }
  }

  /**
   * Récupère la couleur d'un pixel.
   * @param {number} x - Coordonnée X.
   * @param {number} y - Coordonnée Y.
   * @returns {string} - Couleur du pixel (format hex).
   */
  getPixelColor(x, y) {
    const imageData = this.ctx.getImageData(
      x * this.gridSize,
      y * this.gridSize,
      this.gridSize,
      this.gridSize,
    ).data
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`
  }

  /**
   * Dessine un frame sur le canvas.
   * @param {ImageData} frameData - Données du frame à dessiner.
   */
  drawFrame(frameData) {
    this.ctx.putImageData(frameData, 0, 0)
  }

  /**
   * Récupère les données du canvas actuel.
   * @returns {ImageData} - Données du canvas.
   */
  getFrameData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * Définit la couleur du pinceau.
   * @param {string} color - Couleur (format hex).
   */
  setBrushColor(color) {
    this.brushColor = color
  }

  /**
   * Définit la taille du pinceau.
   * @param {number} size - Taille (1 à 20).
   */
  setBrushSize(size) {
    this.brushSize = size
  }

  /**
   * Définit l'outil actuel.
   * @param {string} tool - Outil ("pencil", "eraser", "fill", "sprite").
   */
  setTool(tool) {
    this.currentTool = tool
  }

  /**
   * Efface un pixel.
   * @param {number} x - Coordonnée X.
   * @param {number} y - Coordonnée Y.
   */
  erasePixel(x, y) {
    this.ctx.fillStyle = '#0a0a0a'
    this.ctx.fillRect(
      x * this.gridSize,
      y * this.gridSize,
      this.gridSize * this.brushSize,
      this.gridSize * this.brushSize,
    )
  }
}

// Crée une instance globale du gestionnaire de canvas
const canvasManager = new CanvasManager()
