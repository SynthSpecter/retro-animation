/**
 * Gère le thème (sombre/clair) et les effets visuels.
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Met à jour le texte du bouton de thème.
   */
  function updateThemeButton() {
    const themeBtn = document.getElementById('theme-btn')
    if (!themeBtn) return

    const isDarkMode = document.body.classList.contains('dark-mode')
    themeBtn.textContent = isDarkMode ? '☀️ Thème / Theme' : '🌙 Thème / Theme'
  }

  /**
   * Toggle le thème entre sombre et clair.
   */
  function toggleTheme() {
    const body = document.body
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode')
      body.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    } else {
      body.classList.remove('light-mode')
      body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    }
    updateThemeButton()
  }

  /**
   * Charge le thème sauvegardé.
   */
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    const body = document.body
    if (savedTheme === 'light') {
      body.classList.add('light-mode')
    } else {
      body.classList.add('dark-mode')
    }
    updateThemeButton()
  }

  // Initialise le thème
  loadTheme()

  // Ajoute l'écouteur pour le bouton de thème
  const themeBtn = document.getElementById('theme-btn')
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme)
  }
})
