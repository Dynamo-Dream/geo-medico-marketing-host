import { useState, useEffect } from 'react'
import styles from './Header.module.css'

export default function Header({ onTabChange, onAdmin, activePage, onNavigate }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoUrl,    setLogoUrl]    = useState(null)

  const handleRegister = () => {
    window.location.href = `https://geomedico.com/register?persona=patient`
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(s => { if (s.logo_url) setLogoUrl(s.logo_url) })
      .catch(() => {})
  }, [])

  function nav(page, hash) {
    return (e) => {
      e.preventDefault()
      setMobileOpen(false)
      if (page) {
        onNavigate(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash) {
        onNavigate('home')
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      }
    }
  }

  const isActive = (page) => activePage === page ? styles.activeLink : ''

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.nav}>

          {/* Logo + brand name */}
          <a href="/" className={styles.logo} onClick={nav('home', null)}>
            {logoUrl ? (
              <img src={logoUrl} alt="GeoMedico" className={styles.logoImg} />
            ) : (
              <img src="/logo.jpg" alt="GeoMedico" className={styles.logoImg}
                onError={e => { e.target.style.display = 'none' }} />
            )}
            <span className={styles.brandName}>GeoMedico</span>
          </a>

          <span className={styles.divider} />

          <ul className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
            <li><a href="/"        className={isActive('home')}    onClick={nav('home', null)}>Home</a></li>
            <li><a href="#services"                                 onClick={nav('home', 'services')}>Services</a></li>
            <li><a href="/about"   className={isActive('about')}   onClick={nav('about', null)}>About</a></li>
            <li><a href="#network"                                  onClick={nav('home', 'network')}>Network</a></li>
            <li><a href="/contact" className={isActive('contact')} onClick={nav('contact', null)}>Contact</a></li>
          </ul>

          <span className={styles.spacer} />
          <span className={styles.divider} />

          <div className={styles.navActions}>
            <button className={styles.btnRegister} onClick={handleRegister}>
              Register Patient
            </button>
            {onAdmin && (
              <button className={styles.btnAdmin} onClick={onAdmin}>
                Admin
              </button>
            )}
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>
    </header>
  )
}
