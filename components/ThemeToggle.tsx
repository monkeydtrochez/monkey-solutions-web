"use client"

export function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.dataset.theme || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('ms_theme', next) } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, padding: '0.5rem 1rem', cursor: 'pointer' }}
    >
      Toggle theme
    </button>
  )
}
