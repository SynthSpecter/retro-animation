/**
 * FR : Bibliothèque de formes procédurales, sans images externes à charger.
 * EN: Procedural shape library with no external images to load.
 */
class SynthSprites {
  /**
   * FR : Dessine le véhicule de synth-run.
   * EN: Draws the synth-run vehicle.
   */
  static drawCar(ctx, x, y, scale, palette, lean = 0) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(lean)
    ctx.scale(scale, scale)

    ctx.fillStyle = palette.pink
    ctx.beginPath()
    ctx.moveTo(-58, 22)
    ctx.lineTo(-38, -20)
    ctx.lineTo(0, -38)
    ctx.lineTo(38, -20)
    ctx.lineTo(58, 22)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = palette.ink
    ctx.fillRect(-23, -19, 46, 20)
    ctx.fillStyle = palette.cyan
    ctx.fillRect(-45, 17, 22, 8)
    ctx.fillRect(23, 17, 22, 8)

    this.drawThruster(ctx, -29, 33, 0.9, palette)
    this.drawThruster(ctx, 29, 33, 0.9, palette)
    ctx.restore()
  }

  /**
   * FR : Dessine un réacteur animé sous un véhicule.
   * EN: Draws an animated thruster below a vehicle.
   */
  static drawThruster(ctx, x, y, scale, palette) {
    const flicker = 0.72 + Math.random() * 0.28

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.fillStyle = palette.amber
    ctx.beginPath()
    ctx.moveTo(-8, 0)
    ctx.lineTo(0, 32 * flicker)
    ctx.lineTo(8, 0)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  /**
   * FR : Dessine un chasseur spatial lisible même à petite taille.
   * EN: Draws a space fighter that remains legible at small sizes.
   */
  static drawShip(ctx, x, y, scale, palette, direction = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale * direction, scale)

    ctx.fillStyle = palette.cyan
    ctx.beginPath()
    ctx.moveTo(54, 0)
    ctx.lineTo(-30, -30)
    ctx.lineTo(-12, -7)
    ctx.lineTo(-48, 0)
    ctx.lineTo(-12, 7)
    ctx.lineTo(-30, 30)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = palette.ink
    ctx.beginPath()
    ctx.arc(10, 0, 9, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = palette.pink
    ctx.fillRect(-51, -5, 20, 10)
    ctx.restore()
  }

  /**
   * FR : Dessine un tank à partir de formes géométriques simples.
   * EN: Draws a tank from simple geometric shapes.
   */
  static drawTank(ctx, x, y, scale, palette, direction = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale * direction, scale)

    ctx.fillStyle = palette.surface
    SynthEffects.roundedRect(ctx, -62, -5, 118, 34, 7)
    ctx.fill()

    ctx.fillStyle = palette.green
    SynthEffects.roundedRect(ctx, -32, -34, 58, 34, 5)
    ctx.fill()
    ctx.fillRect(16, -27, 72, 8)

    ctx.strokeStyle = palette.ink
    ctx.lineWidth = 5
    for (let wheel = -42; wheel <= 36; wheel += 26) {
      ctx.beginPath()
      ctx.arc(wheel, 24, 11, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * FR : Dessine un nuage stylisé pour la scène météo.
   * EN: Draws a stylized cloud for the weather scene.
   */
  static drawCloud(ctx, x, y, scale, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(-38, 7, 27, Math.PI, Math.PI * 2)
    ctx.arc(-7, -9, 38, Math.PI, Math.PI * 2)
    ctx.arc(35, 5, 30, Math.PI, Math.PI * 2)
    ctx.lineTo(65, 26)
    ctx.lineTo(-65, 26)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  /**
   * FR : Dessine un dossier, symbole du projet browser-classing.
   * EN: Draws a folder, symbol of the browser-classing project.
   */
  static drawFolder(ctx, x, y, width, height, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, 18)
    ctx.lineTo(width * 0.38, 18)
    ctx.lineTo(width * 0.48, 0)
    ctx.lineTo(width * 0.72, 0)
    ctx.lineTo(width * 0.8, 18)
    ctx.lineTo(width, 18)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  /**
   * FR : Dessine un cadenas fermé pour les outils de sécurité.
   * EN: Draws a closed lock for security tools.
   */
  static drawLock(ctx, x, y, scale, palette) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.strokeStyle = palette.cyan
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.arc(0, -24, 34, Math.PI, 0)
    ctx.stroke()

    ctx.fillStyle = palette.surface
    SynthEffects.roundedRect(ctx, -52, -25, 104, 88, 7)
    ctx.fill()
    ctx.strokeStyle = palette.pink
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = palette.amber
    ctx.beginPath()
    ctx.arc(0, 13, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(-4, 20, 8, 21)
    ctx.restore()
  }

  /**
   * FR : Dessine un cœur géométrique pour la scène de suivi santé.
   * EN: Draws a geometric heart for the wellness scene.
   */
  static drawHeart(ctx, x, y, scale, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, 46)
    ctx.bezierCurveTo(-72, 5, -60, -48, -24, -48)
    ctx.bezierCurveTo(-7, -48, 0, -34, 0, -23)
    ctx.bezierCurveTo(0, -34, 7, -48, 24, -48)
    ctx.bezierCurveTo(60, -48, 72, 5, 0, 46)
    ctx.fill()
    ctx.restore()
  }

  /**
   * FR : Dessine une pièce annulaire pour bank-wave.
   * EN: Draws a ring-shaped coin for bank-wave.
   */
  static drawCoin(ctx, x, y, radius, palette, spin = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(Math.max(0.12, Math.abs(spin)), 1)
    ctx.fillStyle = palette.amber
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = palette.surface
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = palette.amber
    ctx.font = `700 ${Math.round(radius * 0.9)}px "Courier New", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('W', 0, 2)
    ctx.restore()
  }
}

window.SynthSprites = SynthSprites
