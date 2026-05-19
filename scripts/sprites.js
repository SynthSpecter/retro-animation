/**
 * Gère les sprites prédéfinis pour l'animation.
 */
class SpriteManager {
  constructor() {
    this.sprites = [
      {
        name: 'Player',
        url: 'assets/sprites/characters/player.png',
        width: 16,
        height: 16,
      },
      {
        name: 'Enemy',
        url: 'assets/sprites/characters/enemy.png',
        width: 16,
        height: 16,
      },
      {
        name: 'Coin',
        url: 'assets/sprites/objects/coin.png',
        width: 8,
        height: 8,
      },
      {
        name: 'Heart',
        url: 'assets/sprites/objects/heart.png',
        width: 8,
        height: 8,
      },
      {
        name: 'Star',
        url: 'assets/sprites/objects/star.png',
        width: 8,
        height: 8,
      },
      {
        name: 'Tree',
        url: 'assets/sprites/objects/tree.png',
        width: 16,
        height: 16,
      },
      {
        name: 'Fire',
        url: 'assets/sprites/effects/fire.png',
        width: 16,
        height: 16,
      },
    ]
    this.selectedSprite = null
    this.spritesPanel = document.getElementById('sprites-panel')
    this.spritesGrid = document.getElementById('sprites-grid')
  }

  /**
   * Charge les sprites dans le panneau.
   */
  loadSprites() {
    this.spritesGrid.innerHTML = ''
    this.sprites.forEach((sprite, index) => {
      const spriteElement = document.createElement('div')
      spriteElement.className = 'sprite'
      spriteElement.title = sprite.name

      const img = document.createElement('img')
      img.src = sprite.url
      img.alt = sprite.name
      img.dataset.index = index

      spriteElement.appendChild(img)
      spriteElement.addEventListener('click', () => this.selectSprite(index))
      this.spritesGrid.appendChild(spriteElement)
    })
  }

  /**
   * Sélectionne un sprite.
   * @param {number} index - Index du sprite.
   */
  selectSprite(index) {
    this.selectedSprite = this.sprites[index]
    showNotification(
      `Sprite sélectionné: ${this.selectedSprite.name} / Selected sprite: ${this.selectedSprite.name}`,
      'info',
    )
  }

  /**
   * Retourne le sprite sélectionné.
   * @returns {Object|null} - Sprite sélectionné ou null.
   */
  getSelectedSprite() {
    return this.selectedSprite
  }

  /**
   * Dessine un sprite sur le canvas.
   * @param {CanvasRenderingContext2D} ctx - Contexte du canvas.
   * @param {number} x - Position X.
   * @param {number} y - Position Y.
   * @param {number} scale - Échelle.
   */
  drawSprite(ctx, x, y, scale = 1) {
    if (!this.selectedSprite) return

    const img = new Image()
    img.src = this.selectedSprite.url
    img.onload = () => {
      ctx.drawImage(
        img,
        x,
        y,
        this.selectedSprite.width * scale,
        this.selectedSprite.height * scale,
      )
    }
  }
}

// Crée une instance globale du gestionnaire de sprites
const spriteManager = new SpriteManager()
