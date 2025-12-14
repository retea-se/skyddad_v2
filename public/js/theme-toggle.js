/**
 * Theme Toggle Handler
 * Manages light/dark theme switching with localStorage persistence
 */

(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'theme';
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');

  if (!themeToggle) return;

  const moonIcon = themeToggle.querySelector('.moon-icon');
  const sunIcon = themeToggle.querySelector('.sun-icon');

  /**
   * Get saved theme or default to light
   */
  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    // Default to light theme (can be changed to 'dark' if preferred)
    return saved || 'light';
  }

  /**
   * Apply theme
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    // Update icons
    if (theme === 'dark') {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
      themeToggle.setAttribute('aria-pressed', 'false');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0F1419' : '#1E6BA5');
    }
  }

  /**
   * Toggle theme
   */
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }

  /**
   * Initialize theme on page load
   */
  function init() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Add click handler
    themeToggle.addEventListener('click', toggleTheme);

    // Keyboard support
    themeToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

