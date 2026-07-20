/**
 * FR : Contrôleur du thème clair/sombre avec persistance locale.
 * EN: Light/dark theme controller with local persistence.
 */
class ThemeController {
  constructor(button) {
    this.button = button
    this.root = document.documentElement
    this.metaTheme = document.querySelector('meta[name="theme-color"]')
    this.theme = this.root.dataset.theme === 'light' ? 'light' : 'dark'
    this.apply(this.theme, false)
  }

  /**
   * FR : Applique le thème et avertit le moteur Canvas.
   * EN: Applies the theme and notifies the Canvas engine.
   */
  apply(theme, persist = true) {
    this.theme = theme === 'light' ? 'light' : 'dark'
    this.root.dataset.theme = this.theme

    if (this.metaTheme) {
      this.metaTheme.content = this.theme === 'light' ? '#e9edf5' : '#060810'
    }

    if (persist) {
      try {
        localStorage.setItem('retro-animation-theme', this.theme)
      } catch {
        // FR : Le stockage peut être indisponible en navigation privée.
        // EN: Storage may be unavailable in private browsing.
      }
    }

    window.dispatchEvent(
      new CustomEvent('retrothemechange', { detail: { theme: this.theme } }),
    )
  }

  /**
   * FR : Bascule entre les deux étalonnages colorimétriques.
   * EN: Toggles between both color grades.
   */
  toggle() {
    this.apply(this.theme === 'dark' ? 'light' : 'dark')
    return this.theme
  }
}

window.ThemeController = ThemeController
