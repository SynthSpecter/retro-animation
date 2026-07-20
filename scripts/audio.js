/**
 * FR : Bande-son procédurale créée avec Web Audio après une action volontaire.
 * EN: Procedural soundtrack created with Web Audio after an intentional action.
 */
class SynthAudio {
  constructor() {
    this.context = null
    this.master = null
    this.enabled = false
    this.lastStep = -1
  }

  /**
   * FR : Crée le graphe audio uniquement lorsque l'utilisateur active le son.
   * EN: Creates the audio graph only when the user turns sound on.
   */
  async initialize() {
    if (this.context) {
      if (this.context.state === 'suspended') {
        await this.context.resume()
      }
      return
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext

    if (!AudioContextClass) {
      throw new Error('Web Audio is not supported by this browser.')
    }

    this.context = new AudioContextClass()
    this.master = this.context.createGain()
    this.master.gain.value = 0.11
    this.master.connect(this.context.destination)
  }

  async toggle() {
    if (!this.enabled) {
      await this.initialize()
      this.enabled = true
      this.lastStep = -1
    } else {
      this.enabled = false
    }

    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(
        this.enabled ? 0.11 : 0.0001,
        this.context.currentTime,
        0.03,
      )
    }

    return this.enabled
  }

  /**
   * FR : Déclenche une courte note harmonique et libère automatiquement les nœuds.
   * EN: Triggers a short harmonic note and automatically releases its nodes.
   */
  triggerTone(frequency, duration, volume, type = 'triangle', delay = 0) {
    if (!this.enabled || !this.context || !this.master) {
      return
    }

    const start = this.context.currentTime + delay
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.03)
  }

  /**
   * FR : Une percussion grave marque le début de chaque groupe de quatre temps.
   * EN: A low percussion hit marks the start of each four-step group.
   */
  triggerKick() {
    if (!this.enabled || !this.context || !this.master) {
      return
    }

    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(130, now)
    oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.18)
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(now)
    oscillator.stop(now + 0.24)
  }

  /**
   * FR : Le séquenceur suit la tête de lecture et varie sa tonique selon la scène.
   * EN: The sequencer follows the playhead and varies its root by scene.
   */
  update(globalTime, isPlaying, sceneIndex) {
    if (!this.enabled || !this.context || !isPlaying) {
      return
    }

    const step = Math.floor(globalTime * 4)
    if (step === this.lastStep) {
      return
    }

    this.lastStep = step
    const roots = [55, 65.41, 73.42, 82.41, 49, 61.74, 69.3]
    const root = roots[sceneIndex % roots.length]
    const pattern = [1, 1.5, 2, 1.5, 2.25, 2, 1.5, 1.25]
    const note = root * pattern[step % pattern.length]

    this.triggerTone(note, 0.2, 0.16, 'triangle')
    this.triggerTone(note * 2, 0.09, 0.04, 'square', 0.02)

    if (step % 4 === 0) {
      this.triggerKick()
    }
  }
}

window.SynthAudio = SynthAudio

