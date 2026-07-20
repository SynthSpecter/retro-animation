/**
 * FR : Dictionnaire central de l'interface et des treize chapitres.
 * EN: Central dictionary for the interface and all thirteen chapters.
 */
window.RETRO_I18N = {
  dictionaries: {
    fr: {
      skipToAnimation: "Aller à l'animation",
      settings: 'Réglages',
      canvasLabel: 'Film animé Synthverse',
      liveSignal: 'SIGNAL ACTIF',
      playback: 'Lecture',
      timelineLabel: "Position dans l'animation",
      switchLanguage: 'Afficher en anglais',
      lightTheme: 'Activer le thème clair',
      darkTheme: 'Activer le thème sombre',
      fullscreen: 'Plein écran',
      exitFullscreen: 'Quitter le plein écran',
      restart: 'Recommencer',
      previous: 'Chapitre précédent',
      next: 'Chapitre suivant',
      play: 'Lire',
      pause: 'Mettre en pause',
      soundOn: 'Activer le son',
      soundOff: 'Couper le son',
      snapshot: "Capturer l'image",
      snapshotSaved: 'Image enregistrée',
      animationPlaying: 'Lecture en cours',
      animationPaused: 'Animation en pause',
      soundEnabled: 'Bande-son activée',
      soundDisabled: 'Bande-son coupée',
      sceneAnnouncement: 'Chapitre {current} sur {total} : {title}',
      scene_origin_title: 'Initialisation',
      scene_origin_caption: 'Quatorze projets. Un même horizon.',
      scene_bank_title: 'Courant capital',
      scene_bank_caption: 'Les données deviennent rythme, la ville devient onde.',
      scene_run_title: 'Vélocité nocturne',
      scene_run_caption: "La route répond à chaque impulsion.",
      scene_shoot_title: 'Défense orbitale',
      scene_shoot_caption: "Au-delà de la grille, le signal tient bon.",
      scene_mine_title: 'Protocole minier',
      scene_mine_caption: 'Chaque case révèle une décision.',
      scene_weather_title: 'Climat synthétique',
      scene_weather_caption: 'Le ciel change, la fréquence demeure.',
      scene_news_title: 'Relais continu',
      scene_news_caption: "Le monde défile, l'essentiel remonte.",
      scene_tanks_title: 'Front de chrome',
      scene_tanks_caption: 'Deux trajectoires, un seul terrain.',
      scene_browser_title: 'Archives vivantes',
      scene_browser_caption: "Chaque dossier ouvre un nouveau passage.",
      scene_vital_title: 'Circuit vital',
      scene_vital_caption: "L'équilibre se mesure, puis se construit.",
      scene_logic_title: 'Machines logiques',
      scene_logic_caption: 'Calculer. Protéger. Transmettre.',
      scene_arcade_title: 'Duel analogique',
      scene_arcade_caption: 'Les jetons tombent, les lettres résistent.',
      scene_finale_title: 'Convergence',
      scene_finale_caption: 'Des prototypes devenus un univers.',
    },
    en: {
      skipToAnimation: 'Skip to the animation',
      settings: 'Settings',
      canvasLabel: 'Synthverse animated film',
      liveSignal: 'SIGNAL ONLINE',
      playback: 'Playback',
      timelineLabel: 'Animation position',
      switchLanguage: 'Afficher en français',
      lightTheme: 'Enable light theme',
      darkTheme: 'Enable dark theme',
      fullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
      restart: 'Restart',
      previous: 'Previous chapter',
      next: 'Next chapter',
      play: 'Play',
      pause: 'Pause',
      soundOn: 'Turn sound on',
      soundOff: 'Mute sound',
      snapshot: 'Capture frame',
      snapshotSaved: 'Frame saved',
      animationPlaying: 'Animation playing',
      animationPaused: 'Animation paused',
      soundEnabled: 'Soundtrack enabled',
      soundDisabled: 'Soundtrack muted',
      sceneAnnouncement: 'Chapter {current} of {total}: {title}',
      scene_origin_title: 'Initialization',
      scene_origin_caption: 'Fourteen projects. One horizon.',
      scene_bank_title: 'Capital current',
      scene_bank_caption: 'Data becomes rhythm, the city becomes a wave.',
      scene_run_title: 'Night velocity',
      scene_run_caption: 'The road answers every impulse.',
      scene_shoot_title: 'Orbital defense',
      scene_shoot_caption: 'Beyond the grid, the signal holds.',
      scene_mine_title: 'Mine protocol',
      scene_mine_caption: 'Every tile reveals a decision.',
      scene_weather_title: 'Synthetic climate',
      scene_weather_caption: 'The sky changes, the frequency remains.',
      scene_news_title: 'Continuous relay',
      scene_news_caption: 'The world scrolls, the signal rises.',
      scene_tanks_title: 'Chrome front',
      scene_tanks_caption: 'Two trajectories, one terrain.',
      scene_browser_title: 'Living archives',
      scene_browser_caption: 'Every folder opens a new passage.',
      scene_vital_title: 'Vital circuit',
      scene_vital_caption: 'Balance is measured, then built.',
      scene_logic_title: 'Logic machines',
      scene_logic_caption: 'Calculate. Protect. Transmit.',
      scene_arcade_title: 'Analog duel',
      scene_arcade_caption: 'Tokens fall, letters endure.',
      scene_finale_title: 'Convergence',
      scene_finale_caption: 'Prototypes transformed into a universe.',
    },
  },

  /**
   * FR : Retourne une traduction et remplace les variables entre accolades.
   * EN: Returns a translation and replaces variables wrapped in braces.
   */
  translate(language, key, variables = {}) {
    const dictionary = this.dictionaries[language] || this.dictionaries.fr
    const fallback = this.dictionaries.fr[key] || key
    const value = dictionary[key] || fallback

    return Object.entries(variables).reduce(
      (result, [name, replacement]) =>
        result.replaceAll(`{${name}}`, String(replacement)),
      value,
    )
  },

  /**
   * FR : Traduit les contenus et libellés déclaratifs présents dans le HTML.
   * EN: Translates declarative content and labels present in the HTML.
   */
  applyToDocument(language) {
    document.documentElement.lang = language

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = this.translate(language, element.dataset.i18n)
    })

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      element.setAttribute(
        'aria-label',
        this.translate(language, element.dataset.i18nAria),
      )
    })
  },
}
