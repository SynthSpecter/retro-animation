/**
 * FR : Fonctions mathématiques et effets réutilisés par toutes les scènes.
 * EN: Math helpers and effects shared by every scene.
 */
class SynthEffects {
  static clamp(value, minimum = 0, maximum = 1) {
    return Math.min(maximum, Math.max(minimum, value))
  }

  static lerp(start, end, amount) {
    return start + (end - start) * amount
  }

  static smoothstep(value) {
    const clamped = this.clamp(value)
    return clamped * clamped * (3 - 2 * clamped)
  }

  static fract(value) {
    return value - Math.floor(value)
  }

  /**
   * FR : Produit un pseudo-hasard stable, indispensable aux décors reproductibles.
   * EN: Produces stable pseudo-randomness for reproducible scenery.
   */
  static random(seed) {
    return this.fract(Math.sin(seed * 12.9898 + 78.233) * 43758.5453)
  }

  /**
   * FR : Adoucit l'entrée et la sortie d'un chapitre.
   * EN: Softens the entrance and exit of a chapter.
   */
  static sceneEnvelope(localTime, duration) {
    const fadeIn = this.smoothstep(localTime / 0.7)
    const fadeOut = this.smoothstep((duration - localTime) / 0.7)
    return Math.min(fadeIn, fadeOut)
  }

  /**
   * FR : Trace un rectangle aux angles légèrement arrondis sans API récente.
   * EN: Draws a subtly rounded rectangle without relying on a recent API.
   */
  static roundedRect(ctx, x, y, width, height, radius = 6) {
    const safeRadius = Math.min(radius, width / 2, height / 2)

    ctx.beginPath()
    ctx.moveTo(x + safeRadius, y)
    ctx.lineTo(x + width - safeRadius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius)
    ctx.lineTo(x + width, y + height - safeRadius)
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - safeRadius,
      y + height,
    )
    ctx.lineTo(x + safeRadius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius)
    ctx.lineTo(x, y + safeRadius)
    ctx.quadraticCurveTo(x, y, x + safeRadius, y)
    ctx.closePath()
  }

  /**
   * FR : Crée un halo sans modifier durablement l'état du contexte.
   * EN: Creates a glow without permanently changing context state.
   */
  static glow(ctx, color, blur, draw) {
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = blur
    draw()
    ctx.restore()
  }

  /**
   * FR : Dessine un ciel étoilé déterministe avec une légère parallaxe.
   * EN: Draws a deterministic star field with subtle parallax.
   */
  static drawStars(ctx, time, count, width, height, color, speed = 12) {
    ctx.save()
    ctx.fillStyle = color

    for (let index = 0; index < count; index += 1) {
      const depth = 0.35 + this.random(index + 31) * 0.9
      const x = this.fract(this.random(index + 4) + time * speed * depth / width)
      const y = this.random(index + 91)
      const size = 0.8 + depth * 2.2
      ctx.globalAlpha = 0.28 + depth * 0.58
      ctx.fillRect(x * width, y * height, size, size)
    }

    ctx.restore()
  }

  /**
   * FR : Dessine un quadrillage perspectif emblématique du thème synthwave.
   * EN: Draws the perspective grid central to the synthwave theme.
   */
  static drawPerspectiveGrid(ctx, horizon, time, palette, intensity = 1) {
    const vanishingX = 800
    const bottom = 900

    ctx.save()
    ctx.globalAlpha = 0.2 * intensity
    ctx.strokeStyle = palette.cyan
    ctx.lineWidth = 2

    for (let index = -12; index <= 12; index += 1) {
      ctx.beginPath()
      ctx.moveTo(vanishingX, horizon)
      ctx.lineTo(vanishingX + index * 150, bottom)
      ctx.stroke()
    }

    for (let row = 0; row < 18; row += 1) {
      const shifted = this.fract(row / 18 + time * 0.11)
      const depth = shifted * shifted
      const y = this.lerp(horizon, bottom, depth)
      ctx.globalAlpha = (0.08 + shifted * 0.28) * intensity
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(1600, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * FR : Inscrit un petit libellé technique dans le décor.
   * EN: Writes a small technical label into the scenery.
   */
  static drawMicroLabel(ctx, text, x, y, color, align = 'left') {
    ctx.save()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.72
    ctx.font = '700 18px "Courier New", monospace'
    ctx.textAlign = align
    ctx.fillText(text, x, y)
    ctx.restore()
  }
}

window.SynthEffects = SynthEffects
