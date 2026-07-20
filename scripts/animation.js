/**
 * FR : Chapitres, durées et ordre narratif du film.
 * EN: Chapters, durations and narrative order of the film.
 */
const SYNTH_SCENES = [
  { id: 'origin', project: 'RETRO ANIMATION', duration: 5 },
  { id: 'bank', project: 'BANK-WAVE', duration: 5 },
  { id: 'run', project: 'SYNTH-RUN', duration: 5 },
  { id: 'shoot', project: 'SYNTH-SHOOT', duration: 5 },
  { id: 'mine', project: 'SYNTH-MINESWEEPER', duration: 5 },
  { id: 'weather', project: 'SYNTH-WEATHER-APP', duration: 5 },
  { id: 'news', project: 'AGRETATOR', duration: 5 },
  { id: 'tanks', project: 'ANGRY-TANKS', duration: 5 },
  { id: 'browser', project: 'BROWSER-CLASSING', duration: 5 },
  { id: 'vital', project: 'DIET', duration: 5 },
  {
    id: 'logic',
    project: 'CALCULATOR // PASSWORD // QR',
    duration: 6,
  },
  { id: 'arcade', project: 'FORCE-FOUR // SYNTH-PENDU', duration: 6 },
  { id: 'finale', project: 'SYNTHSPECTER ARCHIVE', duration: 7 },
]

/**
 * FR : La chronologie pilote le temps, les chapitres et le rendu Canvas.
 * EN: The timeline drives time, chapters and Canvas rendering.
 */
class SynthTimeline {
  constructor(renderer, onUpdate, options = {}) {
    this.renderer = renderer
    this.onUpdate = onUpdate
    this.scenes = SYNTH_SCENES.map((scene) => ({ ...scene }))
    this.duration = this.scenes.reduce((total, scene) => total + scene.duration, 0)
    this.currentTime = 0
    this.isPlaying = options.autoplay !== false
    this.lastTimestamp = 0
    this.frameRequest = 0

    // FR : Le point de départ de chaque chapitre accélère toutes les recherches.
    // EN: Each chapter's start time speeds up every lookup.
    let elapsed = 0
    this.scenes.forEach((scene) => {
      scene.start = elapsed
      elapsed += scene.duration
    })

    this.loop = this.loop.bind(this)
  }

  /**
   * FR : Lance la boucle de rendu une seule fois.
   * EN: Starts the rendering loop exactly once.
   */
  start() {
    if (this.frameRequest) {
      return
    }

    this.lastTimestamp = performance.now()
    this.frameRequest = requestAnimationFrame(this.loop)
  }

  /**
   * FR : Limite le delta pour éviter un grand saut au retour d'un onglet caché.
   * EN: Caps delta time to avoid a large jump after returning to a hidden tab.
   */
  loop(timestamp) {
    const delta = Math.min(
      0.05,
      Math.max(0, (timestamp - this.lastTimestamp) / 1000),
    )
    this.lastTimestamp = timestamp

    if (this.isPlaying) {
      this.currentTime = (this.currentTime + delta) % this.duration
    }

    const state = this.getState()
    this.renderer.render(state)
    this.onUpdate(state)
    this.frameRequest = requestAnimationFrame(this.loop)
  }

  getState() {
    let sceneIndex = this.scenes.length - 1

    for (let index = 0; index < this.scenes.length; index += 1) {
      const scene = this.scenes[index]
      if (this.currentTime < scene.start + scene.duration) {
        sceneIndex = index
        break
      }
    }

    const scene = this.scenes[sceneIndex]

    return {
      globalTime: this.currentTime,
      localTime: this.currentTime - scene.start,
      progress: this.currentTime / this.duration,
      scene,
      sceneIndex,
      sceneStart: scene.start,
      totalDuration: this.duration,
      isPlaying: this.isPlaying,
    }
  }

  toggle() {
    this.isPlaying = !this.isPlaying
    return this.isPlaying
  }

  play() {
    this.isPlaying = true
  }

  pause() {
    this.isPlaying = false
  }

  restart() {
    this.currentTime = 0
    this.play()
  }

  /**
   * FR : Place la tête de lecture dans les limites du film.
   * EN: Places the playhead within the film bounds.
   */
  seek(time) {
    this.currentTime = SynthEffects.clamp(time, 0, this.duration - 0.001)
    this.lastTimestamp = performance.now()
  }

  seekNormalized(progress) {
    this.seek(SynthEffects.clamp(progress) * this.duration)
  }

  jumpToScene(index) {
    const safeIndex = (index + this.scenes.length) % this.scenes.length
    this.seek(this.scenes[safeIndex].start + 0.01)
  }

  nextScene() {
    const { sceneIndex } = this.getState()
    this.jumpToScene(sceneIndex + 1)
  }

  previousScene() {
    const { sceneIndex, localTime } = this.getState()
    const targetIndex = localTime > 1.5 ? sceneIndex : sceneIndex - 1
    this.jumpToScene(targetIndex)
  }
}

window.SYNTH_SCENES = SYNTH_SCENES
window.SynthTimeline = SynthTimeline
