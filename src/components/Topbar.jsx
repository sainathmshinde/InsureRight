import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user?.avatar || user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const roleName = { broker: 'Broker', agent: 'Agent', customer: 'Customer' }[user?.role] || 'User'

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header style={S.bar}>
      {/* Hamburger — hidden on desktop via CSS */}
      <button
        className="topbar-hamburger"
        style={S.hamburger}
        onClick={onMenuClick}
        title="Menu"
        aria-label="Open menu"
      >
        <HamburgerIcon />
      </button>

      <div style={S.left}>
        <div className="topbar-search" style={S.searchBox}>
          <SearchIcon />
          <input type="text" placeholder="Search customers, policies…" style={S.searchInput} />
        </div>
      </div>

      <div style={S.right}>
        <button style={S.iconBtn} title="Notifications">
          <BellIcon />
          <span style={{ ...S.dot, background: '#ef4444' }} />
        </button>
        <button style={S.iconBtn} title="Messages">
          <MailIcon />
          <span style={{ ...S.dot, background: '#10b981' }} />
        </button>

        <div style={{ position: 'relative' }} ref={ref}>
          <div style={S.userPill} onClick={() => setOpen(v => !v)}>
            <div style={S.avatar}>{initials}</div>
            <div className="topbar-user-text" style={S.userInfo}>
              <span style={S.userName}>{user?.name || 'User'}</span>
              <span style={S.userRole}>{roleName} · {user?.company?.split(' ').slice(0, 3).join(' ')}</span>
            </div>
            <span style={{ ...S.chevron, transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
          </div>

          {open && (
            <div style={S.dropdown}>
              {/* User header */}
              <div style={S.dropHeader}>
                <div style={{ ...S.avatar, width: 38, height: 38, fontSize: 14, borderRadius: 9 }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1628' }}>{user?.name}</div>
                  <div style={{ fontSize: 11.5, color: '#9d94b8', marginTop: 1 }}>{user?.email}</div>
                </div>
              </div>
              <div style={S.dropDivider} />
              <button style={S.dropItem} onClick={() => { navigate('/profile'); setOpen(false) }}>
                <span style={S.dropIcon}>👤</span> My Profile
              </button>
              <button style={S.dropItem} onClick={() => { navigate('/profile/edit'); setOpen(false) }}>
                <span style={S.dropIcon}>✏️</span> Edit Profile
              </button>
              <div style={S.dropDivider} />
              <button style={{ ...S.dropItem, color: '#dc2626' }} onClick={handleLogout}>
                <span style={S.dropIcon}>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c5573" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9d94b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c5573" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c5573" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

const S = {
  bar:        { height: 'var(--topbar-h,58px)', background: '#fff', borderBottom: '1.5px solid #e8e4f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: 10, flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 },
  hamburger:  { display: 'none', width: 36, height: 36, borderRadius: 6, border: '1.5px solid #e8e4f0', background: '#faf9fc', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  left:       { display: 'flex', alignItems: 'center', flex: 1 },
  searchBox:  { display: 'flex', alignItems: 'center', gap: 8, background: '#faf9fc', border: '1.5px solid #e8e4f0', borderRadius: 6, padding: '0 12px', width: 280, height: 36 },
  searchInput:{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, color: '#1a1628', width: '100%', fontFamily: 'inherit' },
  right:      { display: 'flex', alignItems: 'center', gap: 8 },
  iconBtn:    { width: 36, height: 36, borderRadius: 6, border: '1.5px solid #e8e4f0', background: '#faf9fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dot:        { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', border: '1.5px solid #fff' },
  userPill:   { display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 4px 4px', border: '1.5px solid #e8e4f0', borderRadius: 10, background: '#faf9fc', cursor: 'pointer', marginLeft: 4, userSelect: 'none' },
  avatar:     { width: 32, height: 32, borderRadius: 6, background: '#7c3aed', color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userInfo:   { display: 'flex', flexDirection: 'column', lineHeight: 1.2 },
  userName:   { fontSize: 13, fontWeight: 500, color: '#1a1628' },
  userRole:   { fontSize: 11, color: '#9d94b8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron:    { fontSize: 11, color: '#9d94b8', transition: 'transform .15s' },
  dropdown:   { position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 230, background: '#fff', border: '1.5px solid #e8e4f0', borderRadius: 12, boxShadow: '0 8px 28px rgba(100,80,160,.13),0 2px 8px rgba(0,0,0,.06)', zIndex: 100, overflow: 'hidden' },
  dropHeader: { display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px' },
  dropDivider:{ height: 1, background: '#f0edf8', margin: '2px 0' },
  dropItem:   { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#1a1628', fontFamily: 'inherit', textAlign: 'left', transition: 'background .1s' },
  dropIcon:   { fontSize: 15, width: 20, textAlign: 'center' },
}
