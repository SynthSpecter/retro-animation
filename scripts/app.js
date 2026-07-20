/**
 * FR : Point d'entrée : relie l'interface, la chronologie, le son et le rendu.
 * EN: Entry point connecting the UI, timeline, sound and rendering.
 */
document.addEventListener('DOMContentLoaded', () => {
  const i18n = window.RETRO_I18N
  const elements = {
    app: document.getElementById('app'),
    canvas: document.getElementById('synth-canvas'),
    language: document.getElementById('language-button'),
    languageTarget: document.getElementById('language-target'),
    theme: document.getElementById('theme-button'),
    fullscreen: document.getElementById('fullscreen-button'),
    restart: document.getElementById('restart-button'),
    previous: document.getElementById('previous-button'),
    play: document.getElementById('play-button'),
    playIcon: document.getElementById('play-icon'),
    next: document.getElementById('next-button'),
    sound: document.getElementById('sound-button'),
    soundIcon: document.getElementById('sound-icon'),
    snapshot: document.getElementById('snapshot-button'),
    timeline: document.getElementById('timeline'),
    markers: document.getElementById('chapter-markers'),
    elapsed: document.getElementById('elapsed-time'),
    total: document.getElementById('total-time'),
    nowPlaying: document.getElementById('now-playing'),
    sceneIndex: document.getElementById('scene-index'),
    sceneProject: document.getElementById('scene-project'),
    sceneTitle: document.getElementById('scene-title'),
    sceneCaption: document.getElementById('scene-caption'),
    liveRegion: document.getElementById('live-region'),
  }

  /**
   * FR : Lit une préférence sans supposer que localStorage est disponible.
   * EN: Reads a preference without assuming localStorage is available.
   */
  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback
    } catch {
      return fallback
    }
  }

  let language = readPreference(
    'retro-animation-language',
    navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr',
  )
  let lastSceneIndex = -1
  let lastClockUpdate = 0
  let isScrubbing = false

  const themeController = new ThemeController(elements.theme)
  const renderer = new SynthRenderer(elements.canvas)
  const audio = new SynthAudio()
  const snapshotExporter = new SnapshotExporter(elements.canvas)
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  // FR : La mise à jour de l'interface est injectée dans la chronologie.
  // EN: UI updates are injected into the timeline.
  const timeline = new SynthTimeline(renderer, updateFrame, {
    autoplay: !prefersReducedMotion,
  })

  const translate = (key, variables) =>
    i18n.translate(language, key, variables)

  /**
   * FR : Formate un nombre de secondes en compteur MM:SS.
   * EN: Formats seconds as an MM:SS counter.
   */
  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds))
    const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0')
    const remainder = String(safeSeconds % 60).padStart(2, '0')
    return `${minutes}:${remainder}`
  }

  function setAccessibleLabel(button, key) {
    const label = translate(key)
    button.setAttribute('aria-label', label)
    button.title = label
  }

  /**
   * FR : Synchronise tous les textes après un changement de langue.
   * EN: Synchronizes all text after a language change.
   */
  function applyLanguage(nextLanguage, persist = true) {
    language = nextLanguage === 'en' ? 'en' : 'fr'
    i18n.applyToDocument(language)
    renderer.setLanguage(language)

    const currentCode = elements.language.querySelector('span:first-child')
    currentCode.textContent = language.toUpperCase()
    elements.languageTarget.textContent = language === 'fr' ? 'EN' : 'FR'
    setAccessibleLabel(elements.language, 'switchLanguage')
    refreshControlLabels()

    if (persist) {
      try {
        localStorage.setItem('retro-animation-language', language)
      } catch {
        // FR : L'application reste utilisable sans stockage local.
        // EN: The application remains usable without local storage.
      }
    }

    updateSceneText(timeline.getState(), false)
  }

  /**
   * FR : Met à jour les libellés qui dépendent d'un état courant.
   * EN: Updates labels that depend on current state.
   */
  function refreshControlLabels() {
    setAccessibleLabel(
      elements.theme,
      themeController.theme === 'dark' ? 'lightTheme' : 'darkTheme',
    )
    setAccessibleLabel(
      elements.fullscreen,
      document.fullscreenElement ? 'exitFullscreen' : 'fullscreen',
    )
    setAccessibleLabel(elements.restart, 'restart')
    setAccessibleLabel(elements.previous, 'previous')
    setAccessibleLabel(elements.next, 'next')
    setAccessibleLabel(elements.snapshot, 'snapshot')
    setAccessibleLabel(elements.play, timeline.isPlaying ? 'pause' : 'play')
    setAccessibleLabel(elements.sound, audio.enabled ? 'soundOff' : 'soundOn')
  }

  /**
   * FR : Construit des repères de chapitres cliquables sur la chronologie.
   * EN: Builds clickable chapter markers on the timeline.
   */
  function createChapterMarkers() {
    elements.markers.replaceChildren()

    timeline.scenes.forEach((scene, index) => {
      const marker = document.createElement('button')
      const title = translate(`scene_${scene.id}_title`)
      marker.className = 'chapter-marker'
      marker.type = 'button'
      marker.style.left = `${(scene.start / timeline.duration) * 100}%`
      marker.dataset.sceneIndex = String(index)
      marker.setAttribute('aria-label', title)
      marker.title = `${String(index + 1).padStart(2, '0')} // ${title}`
      marker.addEventListener('click', () => timeline.jumpToScene(index))
      elements.markers.appendChild(marker)
    })
  }

  /**
   * FR : Actualise le HUD et annonce uniquement les vrais changements de chapitre.
   * EN: Updates the HUD and announces only genuine chapter changes.
   */
  function updateSceneText(state, announce = true) {
    const sceneNumber = String(state.sceneIndex + 1).padStart(2, '0')
    const totalScenes = String(timeline.scenes.length).padStart(2, '0')
    const title = translate(`scene_${state.scene.id}_title`)
    const caption = translate(`scene_${state.scene.id}_caption`)

    elements.sceneIndex.textContent = `${sceneNumber} / ${totalScenes}`
    elements.sceneProject.textContent = state.scene.project
    elements.sceneTitle.textContent = title
    elements.sceneCaption.textContent = caption
    elements.nowPlaying.textContent = state.scene.project

    elements.markers
      .querySelectorAll('.chapter-marker')
      .forEach((marker, index) => {
        const markerTitle = translate(
          `scene_${timeline.scenes[index].id}_title`,
        )
        marker.classList.toggle('is-active', index === state.sceneIndex)
        marker.setAttribute('aria-label', markerTitle)
        marker.title = `${String(index + 1).padStart(2, '0')} // ${markerTitle}`
      })

    if (announce) {
      elements.liveRegion.textContent = translate('sceneAnnouncement', {
        current: state.sceneIndex + 1,
        total: timeline.scenes.length,
        title,
      })
    }
  }

  /**
   * FR : La boucle garde le Canvas fluide mais limite les écritures DOM fréquentes.
   * EN: The loop keeps Canvas fluid while limiting frequent DOM writes.
   */
  function updateFrame(state) {
    audio.update(state.globalTime, state.isPlaying, state.sceneIndex)

    if (!isScrubbing) {
      const rangeValue = Math.round(state.progress * 1000)
      elements.timeline.value = String(rangeValue)
      elements.timeline.setAttribute(
        'aria-valuenow',
        String(Math.round(state.progress * 100)),
      )
      elements.timeline.style.setProperty(
        '--timeline-progress',
        `${state.progress * 100}%`,
      )
    }

    const now = performance.now()
    if (now - lastClockUpdate > 100) {
      elements.elapsed.textContent = formatTime(state.globalTime)
      lastClockUpdate = now
    }

    if (state.sceneIndex !== lastSceneIndex) {
      updateSceneText(state, lastSceneIndex !== -1)
      lastSceneIndex = state.sceneIndex
    }

    // FR : Cet état minimal facilite le diagnostic automatisé sans influencer le film.
    // EN: This minimal state enables automated diagnostics without affecting the film.
    window.__retroAnimationState = {
      ready: true,
      playing: state.isPlaying,
      sceneId: state.scene.id,
      sceneIndex: state.sceneIndex,
      time: Number(state.globalTime.toFixed(2)),
      duration: state.totalDuration,
      sound: audio.enabled,
      theme: themeController.theme,
      language,
      canvasWidth: elements.canvas.width,
      canvasHeight: elements.canvas.height,
    }
  }

  function togglePlayback() {
    const isPlaying = timeline.toggle()
    elements.playIcon.textContent = isPlaying ? 'Ⅱ' : '▶'
    refreshControlLabels()
    elements.liveRegion.textContent = translate(
      isPlaying ? 'animationPlaying' : 'animationPaused',
    )
  }

  async function toggleSound() {
    try {
      const enabled = await audio.toggle()
      elements.sound.setAttribute('aria-pressed', String(enabled))
      elements.soundIcon.textContent = enabled ? '♫' : '♪'
      refreshControlLabels()
      elements.liveRegion.textContent = translate(
        enabled ? 'soundEnabled' : 'soundDisabled',
      )
    } catch (error) {
      console.error(error)
      elements.sound.disabled = true
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await elements.app.requestFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error)
    }
  }

  // FR : Les commandes de transport restent volontairement directes.
  // EN: Transport controls intentionally remain direct.
  elements.restart.addEventListener('click', () => {
    timeline.restart()
    elements.playIcon.textContent = 'Ⅱ'
    refreshControlLabels()
  })
  elements.previous.addEventListener('click', () => timeline.previousScene())
  elements.next.addEventListener('click', () => timeline.nextScene())
  elements.play.addEventListener('click', togglePlayback)
  elements.canvas.addEventListener('click', togglePlayback)
  elements.sound.addEventListener('click', toggleSound)
  elements.snapshot.addEventListener('click', () => {
    snapshotExporter.save()
    elements.liveRegion.textContent = translate('snapshotSaved')
  })
  elements.language.addEventListener('click', () => {
    applyLanguage(language === 'fr' ? 'en' : 'fr')
    createChapterMarkers()
  })
  elements.theme.addEventListener('click', () => {
    themeController.toggle()
    renderer.setTheme(themeController.theme)
    refreshControlLabels()
  })
  elements.fullscreen.addEventListener('click', toggleFullscreen)

  elements.timeline.addEventListener('pointerdown', () => {
    isScrubbing = true
  })
  elements.timeline.addEventListener('input', () => {
    timeline.seekNormalized(Number(elements.timeline.value) / 1000)
  })
  elements.timeline.addEventListener('change', () => {
    isScrubbing = false
  })
  elements.timeline.addEventListener('pointerup', () => {
    isScrubbing = false
  })

  document.addEventListener('fullscreenchange', refreshControlLabels)

  /**
   * FR : Les raccourcis sont actifs hors des boutons et champs interactifs.
   * EN: Shortcuts are active outside interactive buttons and fields.
   */
  document.addEventListener('keydown', (event) => {
    if (event.target.closest('button, input, a')) {
      return
    }

    const actions = {
      Space: togglePlayback,
      ArrowLeft: () => timeline.previousScene(),
      ArrowRight: () => timeline.nextScene(),
      KeyR: () => timeline.restart(),
      KeyM: toggleSound,
      KeyF: toggleFullscreen,
    }
    const action = actions[event.code]

    if (action) {
      event.preventDefault()
      action()
    }
  })

  if (!document.fullscreenEnabled) {
    elements.fullscreen.hidden = true
  }

  createChapterMarkers()
  elements.total.textContent = formatTime(timeline.duration)
  applyLanguage(language, false)
  renderer.setTheme(themeController.theme)

  if (!timeline.isPlaying) {
    elements.playIcon.textContent = '▶'
  }

  refreshControlLabels()
  timeline.start()
})
