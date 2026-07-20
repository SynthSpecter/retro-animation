/**
 * FR : Moteur de rendu 2D de l'anthologie Synthverse.
 * EN: 2D rendering engine for the Synthverse anthology.
 */
class SynthRenderer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: false })
    this.width = 1600
    this.height = 900
    this.theme = document.documentElement.dataset.theme || 'dark'
    this.language = document.documentElement.lang || 'fr'
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    this.resizePending = true

    // FR : Deux palettes complètes permettent un vrai changement d'ambiance.
    // EN: Two complete palettes provide a genuine change in atmosphere.
    this.palettes = {
      dark: {
        skyTop: '#050711',
        skyBottom: '#261544',
        surface: '#111b33',
        surfaceAlt: '#202d4e',
        ink: '#f5f7ff',
        muted: '#8f9dc2',
        cyan: '#35e7ea',
        pink: '#ff4d9d',
        amber: '#ffd166',
        green: '#74e39a',
        blue: '#5b8cff',
        red: '#ff5d5d',
      },
      light: {
        skyTop: '#dce8ff',
        skyBottom: '#f5dbea',
        surface: '#ffffff',
        surfaceAlt: '#c8d4eb',
        ink: '#14213d',
        muted: '#536079',
        cyan: '#007c91',
        pink: '#b21f64',
        amber: '#9b6500',
        green: '#167044',
        blue: '#2457c5',
        red: '#b42335',
      },
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.resizePending = true
    })
    this.resizeObserver.observe(this.canvas)
  }

  setTheme(theme) {
    this.theme = theme === 'light' ? 'light' : 'dark'
  }

  setLanguage(language) {
    this.language = language === 'en' ? 'en' : 'fr'
  }

  /**
   * FR : Ajuste la résolution physique sans changer le repère logique 1600 x 900.
   * EN: Adjusts physical resolution while preserving the 1600 x 900 logical space.
   */
  resize() {
    const bounds = this.canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const physicalWidth = Math.max(1, Math.round(bounds.width * ratio))
    const physicalHeight = Math.max(1, Math.round(bounds.height * ratio))

    if (
      this.canvas.width !== physicalWidth ||
      this.canvas.height !== physicalHeight
    ) {
      this.canvas.width = physicalWidth
      this.canvas.height = physicalHeight
    }

    this.resizePending = false
  }

  /**
   * FR : Rend la scène courante puis applique une transition douce aux extrémités.
   * EN: Renders the current scene and applies a soft transition at both ends.
   */
  render(state) {
    if (this.resizePending) {
      this.resize()
    }

    const scaleX = this.canvas.width / this.width
    const scaleY = this.canvas.height / this.height
    const palette = this.palettes[this.theme]
    const visualTime = this.reducedMotion
      ? Math.floor(state.globalTime * 4) / 4
      : state.globalTime
    const localTime =
      visualTime - state.sceneStart >= 0
        ? visualTime - state.sceneStart
        : state.localTime

    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)
    this.drawBase(palette, visualTime, state.scene.id)

    this.ctx.save()
    this.ctx.globalAlpha = SynthEffects.sceneEnvelope(
      state.localTime,
      state.scene.duration,
    )
    this.drawScene(state.scene.id, localTime, state.scene.duration, palette)
    this.ctx.restore()

    this.drawTransition(state.localTime, state.scene.duration, palette)
  }

  /**
   * FR : Le fond partagé relie visuellement tous les projets.
   * EN: The shared background visually connects every project.
   */
  drawBase(palette, time, sceneId) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, palette.skyTop)
    gradient.addColorStop(1, palette.skyBottom)
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)

    const starCount = sceneId === 'shoot' || sceneId === 'finale' ? 160 : 80
    SynthEffects.drawStars(
      this.ctx,
      time,
      starCount,
      this.width,
      this.height * 0.76,
      palette.ink,
      sceneId === 'shoot' ? 34 : 9,
    )
  }

  drawScene(sceneId, time, duration, palette) {
    const sceneMethod = {
      origin: this.drawOrigin,
      bank: this.drawBank,
      run: this.drawRun,
      shoot: this.drawShoot,
      mine: this.drawMine,
      weather: this.drawWeather,
      news: this.drawNews,
      tanks: this.drawTanks,
      browser: this.drawBrowser,
      vital: this.drawVital,
      logic: this.drawLogic,
      arcade: this.drawArcade,
      finale: this.drawFinale,
    }[sceneId]

    if (sceneMethod) {
      sceneMethod.call(this, time, duration, palette)
    }
  }

  /**
   * FR : Ouvre le film sur un portail, un soleil et la grille commune.
   * EN: Opens the film with a portal, a sun and the shared grid.
   */
  drawOrigin(time, duration, palette) {
    const pulse = 1 + Math.sin(time * 3) * 0.035

    this.drawStripedSun(800, 430, 178, palette.pink, palette.skyTop)
    this.drawMountains(520, palette)
    SynthEffects.drawPerspectiveGrid(this.ctx, 555, time, palette, 1)

    this.ctx.save()
    this.ctx.translate(800, 420)
    this.ctx.scale(pulse, pulse)

    for (let ring = 0; ring < 4; ring += 1) {
      this.ctx.strokeStyle = ring % 2 === 0 ? palette.cyan : palette.pink
      this.ctx.globalAlpha = 0.2 + ring * 0.13
      this.ctx.lineWidth = 3
      this.ctx.beginPath()
      this.ctx.arc(0, 0, 238 + ring * 31 + Math.sin(time + ring) * 8, 0, Math.PI * 2)
      this.ctx.stroke()
    }

    this.ctx.globalAlpha = 1
    this.ctx.fillStyle = palette.ink
    this.ctx.textAlign = 'center'
    this.ctx.font = '800 88px "Courier New", monospace'
    this.ctx.fillText('SYNTHVERSE', 0, 5)
    this.ctx.fillStyle = palette.cyan
    this.ctx.font = '700 21px "Courier New", monospace'
    this.ctx.fillText('14 SIGNALS // 01 HORIZON', 0, 49)
    this.ctx.restore()

    const sweep = SynthEffects.fract(time / duration)
    this.ctx.fillStyle = palette.cyan
    this.ctx.globalAlpha = 0.35
    this.ctx.fillRect(280 + sweep * 1040, 250, 2, 360)
    this.ctx.globalAlpha = 1
  }

  /**
   * FR : bank-wave devient une ville financière traversée par un graphique vivant.
   * EN: bank-wave becomes a financial city crossed by a living chart.
   */
  drawBank(time, duration, palette) {
    const horizon = 590
    this.drawStripedSun(1270, 250, 122, palette.amber, palette.skyTop)
    this.drawSkyline(horizon, palette, time)

    this.ctx.save()
    this.ctx.strokeStyle = palette.cyan
    this.ctx.lineWidth = 7
    this.ctx.shadowColor = palette.cyan
    this.ctx.shadowBlur = 18
    this.ctx.beginPath()

    for (let point = 0; point <= 11; point += 1) {
      const x = 120 + point * 125
      const trend = 560 - point * 30
      const wave = Math.sin(point * 1.7 + time * 2) * 70
      const y = trend + wave

      if (point === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.stroke()
    this.ctx.restore()

    for (let coin = 0; coin < 6; coin += 1) {
      const travel = SynthEffects.fract(time * 0.16 + coin / 6)
      const x = 150 + travel * 1300
      const y = 690 - Math.sin(travel * Math.PI) * 250 + coin * 8
      SynthSprites.drawCoin(
        this.ctx,
        x,
        y,
        34,
        palette,
        Math.cos(time * 5 + coin),
      )
    }

    SynthEffects.drawMicroLabel(
      this.ctx,
      'BANK-WAVE // FLOW INDEX',
      120,
      770,
      palette.amber,
    )
    this.drawDataBars(118, 795, 12, time, palette)
  }

  /**
   * FR : synth-run prend la forme d'une course en perspective.
   * EN: synth-run takes the form of a perspective road race.
   */
  drawRun(time, duration, palette) {
    const horizon = 390
    this.drawStripedSun(800, 330, 154, palette.pink, palette.skyTop)
    this.drawMountains(horizon + 26, palette)
    SynthEffects.drawPerspectiveGrid(this.ctx, horizon, time * 2.3, palette, 0.8)

    this.ctx.fillStyle = this.theme === 'dark' ? '#090b18' : '#bcc8df'
    this.ctx.beginPath()
    this.ctx.moveTo(670, horizon)
    this.ctx.lineTo(930, horizon)
    this.ctx.lineTo(1250, 900)
    this.ctx.lineTo(350, 900)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.strokeStyle = palette.cyan
    this.ctx.lineWidth = 6
    this.ctx.beginPath()
    this.ctx.moveTo(670, horizon)
    this.ctx.lineTo(350, 900)
    this.ctx.moveTo(930, horizon)
    this.ctx.lineTo(1250, 900)
    this.ctx.stroke()

    for (let stripe = 0; stripe < 10; stripe += 1) {
      const travel = SynthEffects.fract(stripe / 10 + time * 0.82)
      const depth = travel * travel
      const y = SynthEffects.lerp(horizon, 930, depth)
      const halfWidth = SynthEffects.lerp(4, 26, depth)
      this.ctx.fillStyle = palette.amber
      this.ctx.fillRect(800 - halfWidth, y, halfWidth * 2, 8 + depth * 26)
    }

    for (let obstacle = 0; obstacle < 4; obstacle += 1) {
      const travel = SynthEffects.fract(time * 0.27 + obstacle * 0.28)
      const depth = travel * travel
      const lane = obstacle % 2 === 0 ? -1 : 1
      const x = 800 + lane * SynthEffects.lerp(35, 225, depth)
      const y = SynthEffects.lerp(horizon + 15, 820, depth)
      const size = SynthEffects.lerp(8, 45, depth)

      this.ctx.fillStyle = palette.red
      this.ctx.fillRect(x - size / 2, y - size, size, size)
      this.ctx.strokeStyle = palette.amber
      this.ctx.lineWidth = Math.max(2, size / 9)
      this.ctx.strokeRect(x - size / 2, y - size, size, size)
    }

    const lean = Math.sin(time * 2.2) * 0.035
    SynthSprites.drawCar(this.ctx, 800 + Math.sin(time * 1.35) * 130, 735, 1.35, palette, lean)
    SynthEffects.drawMicroLabel(
      this.ctx,
      'SYNTH-RUN // VELOCITY 284',
      122,
      795,
      palette.cyan,
    )
  }

  /**
   * FR : synth-shoot devient une escarmouche spatiale lisible et rythmée.
   * EN: synth-shoot becomes a readable, rhythmic space skirmish.
   */
  drawShoot(time, duration, palette) {
    const orbit = time * 0.22
    const planetGradient = this.ctx.createRadialGradient(1250, 650, 30, 1250, 650, 260)
    planetGradient.addColorStop(0, palette.pink)
    planetGradient.addColorStop(0.58, palette.blue)
    planetGradient.addColorStop(1, palette.skyTop)

    this.ctx.fillStyle = planetGradient
    this.ctx.beginPath()
    this.ctx.arc(1250, 650, 245, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.strokeStyle = palette.cyan
    this.ctx.globalAlpha = 0.5
    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    this.ctx.ellipse(1250, 650, 370, 72, -0.18, 0, Math.PI * 2)
    this.ctx.stroke()
    this.ctx.globalAlpha = 1

    const shipX = 400 + Math.sin(time * 1.8) * 45
    const shipY = 470 + Math.cos(time * 1.35) * 110
    SynthSprites.drawShip(this.ctx, shipX, shipY, 1.5, palette, 1)

    for (let enemy = 0; enemy < 4; enemy += 1) {
      const angle = orbit + enemy * 1.3
      const x = 1040 + Math.cos(angle) * 280
      const y = 370 + Math.sin(angle * 1.4) * 185
      SynthSprites.drawShip(this.ctx, x, y, 0.72, {
        ...palette,
        cyan: palette.red,
        pink: palette.amber,
      }, -1)
    }

    for (let laser = 0; laser < 5; laser += 1) {
      const travel = SynthEffects.fract(time * 1.6 + laser * 0.2)
      const x = shipX + 70 + travel * 710
      const y = shipY + Math.sin(laser * 2.1) * 35 - travel * 45

      this.ctx.strokeStyle = laser % 2 === 0 ? palette.cyan : palette.pink
      this.ctx.lineWidth = 5
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(x + 58, y - 4)
      this.ctx.stroke()
    }

    const explosion = SynthEffects.fract(time * 0.42)
    this.drawExplosion(980, 310, explosion, palette)
    SynthEffects.drawMicroLabel(
      this.ctx,
      'SYNTH-SHOOT // SECTOR 07',
      120,
      790,
      palette.pink,
    )
  }

  /**
   * FR : Le démineur est montré comme une matrice tactique balayée par un radar.
   * EN: Minesweeper appears as a tactical matrix swept by radar.
   */
  drawMine(time, duration, palette) {
    const columns = 10
    const rows = 6
    const cell = 82
    const startX = 390
    const startY = 205
    const reveal = SynthEffects.clamp(time / (duration * 0.72))

    this.ctx.save()
    this.ctx.translate(800, 465)
    this.ctx.rotate(-0.055)
    this.ctx.translate(-800, -465)

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column
        const x = startX + column * cell
        const y = startY + row * cell
        const isRevealed = index / (columns * rows) < reveal
        const isMine = [8, 17, 33, 46, 52].includes(index)

        this.ctx.fillStyle = isRevealed ? palette.surfaceAlt : palette.surface
        this.ctx.strokeStyle = palette.cyan
        this.ctx.globalAlpha = 0.9
        this.ctx.lineWidth = 2
        this.ctx.fillRect(x, y, cell - 8, cell - 8)
        this.ctx.strokeRect(x, y, cell - 8, cell - 8)

        if (isRevealed && isMine) {
          this.drawMineIcon(x + 37, y + 37, palette)
        } else if (isRevealed) {
          const number = ((row + column * 2) % 3) + 1
          this.ctx.fillStyle = [palette.cyan, palette.green, palette.pink][number - 1]
          this.ctx.font = '700 30px "Courier New", monospace'
          this.ctx.textAlign = 'center'
          this.ctx.fillText(String(number), x + 37, y + 47)
        }
      }
    }

    this.ctx.restore()
    this.ctx.globalAlpha = 1

    const radarX = 390 + reveal * columns * cell
    this.ctx.fillStyle = palette.green
    this.ctx.globalAlpha = 0.12
    this.ctx.fillRect(radarX - 100, 180, 120, 520)
    this.ctx.globalAlpha = 0.8
    this.ctx.fillRect(radarX, 180, 3, 520)
    this.ctx.globalAlpha = 1

    SynthEffects.drawMicroLabel(
      this.ctx,
      'SYNTH-MINESWEEPER // SAFE PATH',
      120,
      790,
      palette.green,
    )
  }

  /**
   * FR : La météo traverse soleil, nuages et pluie dans un seul paysage.
   * EN: Weather moves through sun, clouds and rain in one landscape.
   */
  drawWeather(time, duration, palette) {
    const cycle = SynthEffects.fract(time / duration)
    const rainStrength = SynthEffects.smoothstep((cycle - 0.35) * 3)
    const sunX = 320 + cycle * 960
    const sunY = 380 - Math.sin(cycle * Math.PI) * 220

    this.ctx.fillStyle = palette.amber
    this.ctx.beginPath()
    this.ctx.arc(sunX, sunY, 82, 0, Math.PI * 2)
    this.ctx.fill()

    this.drawWeatherCity(610, palette)

    for (let cloud = 0; cloud < 4; cloud += 1) {
      const x = 260 + cloud * 360 - cycle * 180
      const y = 260 + Math.sin(cloud * 2) * 48
      const color = cloud % 2 === 0 ? palette.surfaceAlt : palette.muted
      SynthSprites.drawCloud(this.ctx, x, y, 1.3 + cloud * 0.08, color)
    }

    this.ctx.save()
    this.ctx.globalAlpha = rainStrength * 0.75
    this.ctx.strokeStyle = palette.cyan
    this.ctx.lineWidth = 3

    for (let drop = 0; drop < 70; drop += 1) {
      const x = SynthEffects.random(drop + 9) * this.width
      const y = SynthEffects.fract(SynthEffects.random(drop + 80) + time * 0.65) * 600
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(x - 12, y + 31)
      this.ctx.stroke()
    }
    this.ctx.restore()

    if (cycle > 0.56 && cycle < 0.68) {
      this.ctx.strokeStyle = palette.amber
      this.ctx.lineWidth = 12
      this.ctx.beginPath()
      this.ctx.moveTo(1160, 130)
      this.ctx.lineTo(1080, 330)
      this.ctx.lineTo(1150, 310)
      this.ctx.lineTo(1060, 520)
      this.ctx.stroke()
    }

    SynthEffects.drawMicroLabel(
      this.ctx,
      'SYNTH-WEATHER-APP // 18°C',
      120,
      790,
      palette.amber,
    )
  }

  /**
   * FR : agretator devient un relais de titres et de flux hiérarchisés.
   * EN: agretator becomes a relay of ranked headlines and feeds.
   */
  drawNews(time, duration, palette) {
    const categories = ['WORLD', 'TECH', 'CULTURE', 'GAMES', 'SCIENCE']
    const speed = 150

    for (let row = 0; row < categories.length; row += 1) {
      const y = 205 + row * 112
      const offset = (time * speed * (row % 2 === 0 ? -1 : 1)) % 520

      for (let card = -2; card < 5; card += 1) {
        const x = card * 430 + offset
        this.ctx.fillStyle = row % 2 === 0 ? palette.surface : palette.surfaceAlt
        SynthEffects.roundedRect(this.ctx, x, y, 360, 84, 5)
        this.ctx.fill()
        this.ctx.strokeStyle = row % 2 === 0 ? palette.cyan : palette.pink
        this.ctx.lineWidth = 3
        this.ctx.stroke()

        this.ctx.fillStyle = this.ctx.strokeStyle
        this.ctx.fillRect(x + 18, y + 18, 52, 48)
        this.ctx.fillStyle = palette.ink
        this.ctx.font = '700 19px "Courier New", monospace'
        this.ctx.fillText(categories[row], x + 88, y + 36)
        this.ctx.fillStyle = palette.muted
        this.ctx.fillRect(x + 88, y + 49, 210, 5)
        this.ctx.fillRect(x + 88, y + 61, 145, 5)
      }
    }

    this.ctx.fillStyle = palette.amber
    this.ctx.fillRect(0, 738, this.width, 38)
    this.ctx.fillStyle = this.theme === 'dark' ? '#11131a' : '#ffffff'
    this.ctx.font = '800 19px "Courier New", monospace'
    this.ctx.fillText(
      'AGRETATOR // LIVE FEED // SIGNAL VERIFIED // ',
      90 - (time * 120) % 520,
      764,
    )
  }

  /**
   * FR : angry-tanks met en scène deux chars et une trajectoire balistique.
   * EN: angry-tanks stages two tanks and one ballistic trajectory.
   */
  drawTanks(time, duration, palette) {
    const groundY = 660

    this.ctx.fillStyle = this.theme === 'dark' ? '#17253a' : '#a9bdac'
    this.ctx.beginPath()
    this.ctx.moveTo(0, groundY)
    for (let x = 0; x <= this.width; x += 100) {
      const y = groundY + Math.sin(x * 0.009) * 45 + Math.sin(x * 0.021) * 18
      this.ctx.lineTo(x, y)
    }
    this.ctx.lineTo(this.width, this.height)
    this.ctx.lineTo(0, this.height)
    this.ctx.closePath()
    this.ctx.fill()

    SynthSprites.drawTank(this.ctx, 330, 630, 1.35, palette, 1)
    SynthSprites.drawTank(this.ctx, 1270, 632, 1.35, {
      ...palette,
      green: palette.red,
    }, -1)

    const shot = SynthEffects.fract(time / 2.2)
    const startX = shot < 0.5 ? 430 : 1170
    const direction = shot < 0.5 ? 1 : -1
    const localShot = SynthEffects.fract(shot * 2)
    const projectileX = startX + direction * localShot * 690
    const projectileY = 590 - Math.sin(localShot * Math.PI) * 310

    this.ctx.strokeStyle = palette.amber
    this.ctx.globalAlpha = 0.3
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    for (let point = 0; point <= 24; point += 1) {
      const step = point / 24
      const x = startX + direction * step * 690
      const y = 590 - Math.sin(step * Math.PI) * 310
      point === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y)
    }
    this.ctx.stroke()
    this.ctx.globalAlpha = 1

    this.ctx.fillStyle = palette.amber
    this.ctx.beginPath()
    this.ctx.arc(projectileX, projectileY, 10, 0, Math.PI * 2)
    this.ctx.fill()

    if (localShot > 0.86) {
      this.drawExplosion(
        startX + direction * 690,
        610,
        (localShot - 0.86) / 0.14,
        palette,
      )
    }

    SynthEffects.drawMicroLabel(
      this.ctx,
      'ANGRY-TANKS // TRAJECTORY LOCKED',
      120,
      790,
      palette.amber,
    )
  }

  /**
   * FR : browser-classing devient un tunnel d'archives reliées.
   * EN: browser-classing becomes a tunnel of connected archives.
   */
  drawBrowser(time, duration, palette) {
    const vanishingX = 800
    const vanishingY = 420

    this.ctx.save()
    this.ctx.strokeStyle = palette.blue
    this.ctx.globalAlpha = 0.3
    this.ctx.lineWidth = 2

    for (let line = -8; line <= 8; line += 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(vanishingX, vanishingY)
      this.ctx.lineTo(vanishingX + line * 170, this.height)
      this.ctx.stroke()
    }
    this.ctx.restore()

    for (let folder = 0; folder < 12; folder += 1) {
      const travel = SynthEffects.fract(folder / 12 + time * 0.12)
      const depth = travel * travel
      const side = folder % 2 === 0 ? -1 : 1
      const width = 50 + depth * 170
      const height = width * 0.66
      const x = vanishingX + side * (65 + depth * 520) - width / 2
      const y = vanishingY + depth * 370 - height / 2
      const color = folder % 3 === 0 ? palette.amber : folder % 3 === 1 ? palette.cyan : palette.pink

      this.ctx.globalAlpha = 0.35 + depth * 0.65
      SynthSprites.drawFolder(this.ctx, x, y, width, height, color)
    }
    this.ctx.globalAlpha = 1

    this.ctx.strokeStyle = palette.cyan
    this.ctx.lineWidth = 4
    this.ctx.setLineDash([14, 14])
    this.ctx.beginPath()
    this.ctx.moveTo(800, 180)
    this.ctx.lineTo(800, 760)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    SynthEffects.drawMicroLabel(
      this.ctx,
      'BROWSER-CLASSING // /PROJECTS/ACTIVE',
      120,
      790,
      palette.cyan,
    )
  }

  /**
   * FR : diet est représenté par un cœur, un tracé ECG et des indicateurs d'équilibre.
   * EN: diet is represented by a heart, an ECG trace and balance indicators.
   */
  drawVital(time, duration, palette) {
    const beat = 1 + Math.max(0, Math.sin(time * Math.PI * 2.4)) * 0.12

    SynthEffects.glow(this.ctx, palette.pink, 34, () => {
      SynthSprites.drawHeart(this.ctx, 800, 420, 2.25 * beat, palette.pink)
    })

    this.ctx.strokeStyle = palette.cyan
    this.ctx.lineWidth = 7
    this.ctx.shadowColor = palette.cyan
    this.ctx.shadowBlur = 16
    this.ctx.beginPath()

    for (let x = 120; x <= 1480; x += 8) {
      const phase = SynthEffects.fract(x / 300 - time * 0.8)
      let y = 670

      if (phase > 0.38 && phase < 0.43) y -= (phase - 0.38) * 1600
      if (phase >= 0.43 && phase < 0.48) y += (phase - 0.43) * 2100 - 80
      if (phase >= 0.48 && phase < 0.54) y -= (phase - 0.48) * 1000 - 25

      x === 120 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y)
    }
    this.ctx.stroke()
    this.ctx.shadowBlur = 0

    const indicators = [
      ['H2O', palette.cyan],
      ['FUEL', palette.amber],
      ['REST', palette.green],
    ]

    indicators.forEach(([label, color], index) => {
      const angle = time * 0.35 + index * (Math.PI * 2) / 3
      const x = 800 + Math.cos(angle) * 330
      const y = 420 + Math.sin(angle) * 190
      this.ctx.fillStyle = palette.surface
      this.ctx.beginPath()
      this.ctx.arc(x, y, 58, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 4
      this.ctx.stroke()
      this.ctx.fillStyle = color
      this.ctx.font = '800 18px "Courier New", monospace'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(label, x, y + 6)
    })

    SynthEffects.drawMicroLabel(
      this.ctx,
      'DIET // BALANCE 92%',
      120,
      790,
      palette.green,
    )
  }

  /**
   * FR : Trois outils logiques partagent un même flux de données.
   * EN: Three logic tools share one common data stream.
   */
  drawLogic(time, duration, palette) {
    const panels = [
      { x: 160, color: palette.blue, label: 'CALCULATOR' },
      { x: 620, color: palette.pink, label: 'PASSWORD' },
      { x: 1080, color: palette.green, label: 'QR SIGNAL' },
    ]

    panels.forEach((panel, index) => {
      this.ctx.fillStyle = palette.surface
      SynthEffects.roundedRect(this.ctx, panel.x, 230, 360, 410, 6)
      this.ctx.fill()
      this.ctx.strokeStyle = panel.color
      this.ctx.lineWidth = 4
      this.ctx.stroke()

      this.ctx.fillStyle = panel.color
      this.ctx.font = '800 18px "Courier New", monospace'
      this.ctx.textAlign = 'left'
      this.ctx.fillText(panel.label, panel.x + 28, 280)

      if (index === 0) {
        this.drawCalculator(panel.x + 32, 315, time, palette)
      } else if (index === 1) {
        SynthSprites.drawLock(this.ctx, panel.x + 180, 450, 1.25, palette)
        this.ctx.fillStyle = palette.cyan
        this.ctx.font = '700 16px "Courier New", monospace'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('•••• •••• ••••', panel.x + 180, 585)
      } else {
        this.drawQrMatrix(panel.x + 88, 335, 12, time, palette)
      }
    })

    this.ctx.strokeStyle = palette.amber
    this.ctx.lineWidth = 3
    this.ctx.setLineDash([10, 12])
    this.ctx.beginPath()
    this.ctx.moveTo(520, 435)
    this.ctx.lineTo(620, 435)
    this.ctx.moveTo(980, 435)
    this.ctx.lineTo(1080, 435)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    SynthEffects.drawMicroLabel(
      this.ctx,
      'CALCULATOR-SYNTHWAVE // PW-GENERATOR // QR-GENERATOR',
      120,
      790,
      palette.amber,
    )
  }

  /**
   * FR : Le dernier duel associe Puissance 4 et le pendu sans menu d'édition.
   * EN: The final duel pairs Connect Four and Hangman without editor UI.
   */
  drawArcade(time, duration, palette) {
    this.ctx.fillStyle = palette.surface
    this.ctx.fillRect(130, 185, 620, 520)
    this.ctx.strokeStyle = palette.blue
    this.ctx.lineWidth = 6
    this.ctx.strokeRect(130, 185, 620, 520)

    const cell = 72
    const boardX = 190
    const boardY = 225
    const placed = Math.floor(time * 2.2)

    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 7; column += 1) {
        const index = row * 7 + column
        const x = boardX + column * cell
        const y = boardY + row * cell
        const hasToken = index > 41 - placed
        const tokenColor = (row + column) % 2 === 0 ? palette.pink : palette.amber

        this.ctx.fillStyle = hasToken ? tokenColor : palette.skyTop
        this.ctx.beginPath()
        this.ctx.arc(x, y, 25, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }

    this.ctx.strokeStyle = palette.pink
    this.ctx.lineWidth = 4
    this.ctx.beginPath()
    this.ctx.moveTo(1030, 260)
    this.ctx.lineTo(1030, 610)
    this.ctx.moveTo(1030, 260)
    this.ctx.lineTo(1230, 260)
    this.ctx.moveTo(1230, 260)
    this.ctx.lineTo(1230, 320)
    this.ctx.stroke()

    const revealCount = Math.min(6, Math.floor(time * 1.15))
    const word = 'SYNTHS'
    this.ctx.font = '800 54px "Courier New", monospace'
    this.ctx.textAlign = 'center'

    for (let letter = 0; letter < word.length; letter += 1) {
      const x = 930 + letter * 93
      this.ctx.fillStyle = letter < revealCount ? palette.cyan : palette.muted
      this.ctx.fillText(letter < revealCount ? word[letter] : '_', x, 585)
    }

    const pulse = 1 + Math.sin(time * 4) * 0.08
    this.ctx.fillStyle = palette.amber
    this.ctx.beginPath()
    this.ctx.arc(1230, 370, 35 * pulse, 0, Math.PI * 2)
    this.ctx.fill()

    SynthEffects.drawMicroLabel(
      this.ctx,
      'FORCE-FOUR // LE SYNTH(E)-PENDU',
      120,
      790,
      palette.pink,
    )
  }

  /**
   * FR : Le final rassemble les quatorze projets autour du même signal.
   * EN: The finale gathers all fourteen projects around one signal.
   */
  drawFinale(time, duration, palette) {
    const projects = [
      'BANK',
      'RUN',
      'SHOOT',
      'MINES',
      'WEATHER',
      'NEWS',
      'TANKS',
      'FILES',
      'DIET',
      'CALC',
      'FOUR',
      'PENDU',
      'PASSWORD',
      'QR',
    ]

    this.drawStripedSun(800, 450, 182, palette.pink, palette.skyTop)
    SynthEffects.drawPerspectiveGrid(this.ctx, 610, time, palette, 0.65)

    projects.forEach((project, index) => {
      const angle = time * 0.18 + index * (Math.PI * 2) / projects.length
      const orbitX = 490 + Math.sin(time * 0.35) * 18
      const orbitY = 285
      const x = 800 + Math.cos(angle) * orbitX
      const y = 430 + Math.sin(angle) * orbitY
      const color = [palette.cyan, palette.pink, palette.amber, palette.green][index % 4]

      this.ctx.fillStyle = palette.surface
      this.ctx.beginPath()
      this.ctx.arc(x, y, 38, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = 4
      this.ctx.stroke()

      this.ctx.fillStyle = color
      this.ctx.font = '800 13px "Courier New", monospace'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(project, x, y + 5)
    })

    const titleScale = 1 + Math.sin(time * 2) * 0.02
    this.ctx.save()
    this.ctx.translate(800, 440)
    this.ctx.scale(titleScale, titleScale)
    this.ctx.fillStyle = palette.ink
    this.ctx.textAlign = 'center'
    this.ctx.font = '800 76px "Courier New", monospace'
    this.ctx.fillText('SYNTHVERSE', 0, 0)
    this.ctx.fillStyle = palette.cyan
    this.ctx.font = '700 20px "Courier New", monospace'
    this.ctx.fillText('PROTOTYPES // RECOMPOSED', 0, 43)
    this.ctx.restore()
  }

  /**
   * FR : Soleil découpé en bandes horizontales, construit uniquement en Canvas.
   * EN: Horizontally sliced sun built entirely in Canvas.
   */
  drawStripedSun(x, y, radius, color, cutColor) {
    this.ctx.save()
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.fillStyle = cutColor
    for (let stripe = 0; stripe < 8; stripe += 1) {
      const stripeY = y + 12 + stripe * 20
      const halfWidth = Math.sqrt(
        Math.max(0, radius * radius - (stripeY - y) ** 2),
      )
      this.ctx.fillRect(x - halfWidth, stripeY, halfWidth * 2, 8 + stripe)
    }
    this.ctx.restore()
  }

  /**
   * FR : Relief lointain généré par plusieurs sinusoïdes.
   * EN: Distant terrain generated from several sine waves.
   */
  drawMountains(horizon, palette) {
    this.ctx.fillStyle = this.theme === 'dark' ? '#10172a' : '#aab8d1'
    this.ctx.beginPath()
    this.ctx.moveTo(0, horizon)

    for (let x = 0; x <= this.width; x += 40) {
      const y =
        horizon -
        80 -
        Math.abs(Math.sin(x * 0.007)) * 150 -
        Math.abs(Math.cos(x * 0.015)) * 60
      this.ctx.lineTo(x, y)
    }

    this.ctx.lineTo(this.width, horizon)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.strokeStyle = palette.pink
    this.ctx.globalAlpha = 0.42
    this.ctx.lineWidth = 3
    this.ctx.stroke()
    this.ctx.globalAlpha = 1
  }

  /**
   * FR : Silhouette urbaine animée pour la scène financière.
   * EN: Animated city silhouette for the financial scene.
   */
  drawSkyline(horizon, palette, time) {
    for (let building = 0; building < 24; building += 1) {
      const width = 45 + SynthEffects.random(building + 3) * 65
      const height = 90 + SynthEffects.random(building + 40) * 260
      const x = building * 75 - 30

      this.ctx.fillStyle = building % 2 === 0 ? palette.surface : palette.surfaceAlt
      this.ctx.fillRect(x, horizon - height, width, height)

      for (let floor = 0; floor < Math.floor(height / 34); floor += 1) {
        const lit = SynthEffects.random(building * 20 + floor) > 0.35
        this.ctx.fillStyle = lit
          ? floor % 3 === 0
            ? palette.amber
            : palette.cyan
          : palette.skyTop
        this.ctx.globalAlpha = 0.35 + Math.sin(time * 2 + floor) * 0.12
        this.ctx.fillRect(x + 12, horizon - height + 16 + floor * 31, width - 24, 8)
      }
    }
    this.ctx.globalAlpha = 1
  }

  drawDataBars(x, y, count, time, palette) {
    for (let index = 0; index < count; index += 1) {
      const height = 18 + (Math.sin(time * 2 + index * 0.8) + 1) * 18
      this.ctx.fillStyle = index % 3 === 0 ? palette.pink : palette.cyan
      this.ctx.fillRect(x + index * 25, y - height, 14, height)
    }
  }

  drawExplosion(x, y, progress, palette) {
    const eased = SynthEffects.smoothstep(progress)
    this.ctx.save()
    this.ctx.translate(x, y)

    for (let ray = 0; ray < 18; ray += 1) {
      const angle = (ray / 18) * Math.PI * 2
      const distance = 22 + eased * 115
      const radius = Math.max(2, 14 * (1 - eased))
      this.ctx.fillStyle = ray % 2 === 0 ? palette.amber : palette.pink
      this.ctx.beginPath()
      this.ctx.arc(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        radius,
        0,
        Math.PI * 2,
      )
      this.ctx.fill()
    }

    this.ctx.restore()
  }

  drawMineIcon(x, y, palette) {
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.strokeStyle = palette.red
    this.ctx.fillStyle = palette.red
    this.ctx.lineWidth = 5

    for (let spoke = 0; spoke < 8; spoke += 1) {
      const angle = spoke * Math.PI / 4
      this.ctx.beginPath()
      this.ctx.moveTo(Math.cos(angle) * 12, Math.sin(angle) * 12)
      this.ctx.lineTo(Math.cos(angle) * 28, Math.sin(angle) * 28)
      this.ctx.stroke()
    }

    this.ctx.beginPath()
    this.ctx.arc(0, 0, 17, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  drawWeatherCity(horizon, palette) {
    this.ctx.fillStyle = this.theme === 'dark' ? '#111a2d' : '#73849e'
    for (let building = 0; building < 18; building += 1) {
      const width = 70 + (building % 3) * 24
      const height = 70 + ((building * 53) % 190)
      this.ctx.fillRect(building * 95, horizon - height, width, height)
    }

    this.ctx.fillStyle = this.theme === 'dark' ? '#0a1424' : '#7ba3b8'
    this.ctx.fillRect(0, horizon, this.width, this.height - horizon)

    this.ctx.strokeStyle = palette.cyan
    this.ctx.globalAlpha = 0.25
    for (let line = 0; line < 10; line += 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, horizon + line * 32)
      this.ctx.lineTo(this.width, horizon + line * 32)
      this.ctx.stroke()
    }
    this.ctx.globalAlpha = 1
  }

  drawCalculator(x, y, time, palette) {
    this.ctx.fillStyle = palette.skyTop
    this.ctx.fillRect(x, y, 296, 76)
    this.ctx.fillStyle = palette.cyan
    this.ctx.font = '700 38px "Courier New", monospace'
    this.ctx.textAlign = 'right'
    this.ctx.fillText((Math.sin(time) * 2048).toFixed(2), x + 278, y + 50)

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const keyX = x + column * 74
        const keyY = y + 100 + row * 63
        this.ctx.fillStyle =
          column === 3 ? palette.pink : row === 3 ? palette.amber : palette.surfaceAlt
        this.ctx.fillRect(keyX, keyY, 58, 48)
      }
    }
  }

  drawQrMatrix(x, y, size, time, palette) {
    const cells = 15

    this.ctx.fillStyle = this.theme === 'dark' ? '#f5f7ff' : '#ffffff'
    this.ctx.fillRect(x - 14, y - 14, cells * size + 28, cells * size + 28)

    for (let row = 0; row < cells; row += 1) {
      for (let column = 0; column < cells; column += 1) {
        const finder =
          (row < 5 && column < 5) ||
          (row < 5 && column > 9) ||
          (row > 9 && column < 5)
        const data =
          SynthEffects.random(row * 31 + column * 17) >
          0.48 + Math.sin(time + row) * 0.04

        if (finder || data) {
          this.ctx.fillStyle = finder ? palette.ink : palette.green
          this.ctx.fillRect(x + column * size, y + row * size, size - 1, size - 1)
        }
      }
    }
  }

  /**
   * FR : Un volet sombre très bref masque les changements de chapitre.
   * EN: A brief dark veil masks chapter changes.
   */
  drawTransition(localTime, duration, palette) {
    const envelope = SynthEffects.sceneEnvelope(localTime, duration)
    const opacity = (1 - envelope) * 0.72

    if (opacity <= 0.01) {
      return
    }

    this.ctx.fillStyle = palette.skyTop
    this.ctx.globalAlpha = opacity
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalAlpha = 1
  }
}

window.SynthRenderer = SynthRenderer
