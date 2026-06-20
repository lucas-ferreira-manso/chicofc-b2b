import { NavLink } from 'react-router-dom'
import { useState } from 'react'

function IconDash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function IconWallet() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
      <path d="M16 3H8L4 7h16Z"/><circle cx="17" cy="13" r="1" fill="currentColor"/>
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}

const NAV = [
  { to: '/', label: 'Dashboard', Icon: IconDash },
  { to: '/agenda', label: 'Agenda', Icon: IconCalendar },
  { to: '/grupos', label: 'Grupos', Icon: IconUsers },
  { to: '/financeiro', label: 'Financeiro', Icon: IconWallet },
  { to: '/relatorios', label: 'Relatórios', Icon: IconChart },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 232,
      minHeight: '100vh',
      background: '#0a1f6e',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #66d1ff 0%, #3b9ff5 100%)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 12px rgba(102,209,255,0.35)'
          }}>⚽</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>ChicoFC</div>
            <div style={{ fontSize: 10, color: '#66d1ff', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Painel da Quadra</div>
          </div>
        </div>
      </div>

      {/* Venue card */}
      <div style={{ margin: '0 16px 16px', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #082996 0%, #1a3fbe 100%)',
            border: '2px solid rgba(102,209,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#fff', fontWeight: 700, flexShrink: 0
          }}>9</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>9E10</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Florianópolis, SC</div>
          </div>
          <div style={{ marginLeft: 'auto', width: 8, height: 8, background: '#34a853', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 6px rgba(52,168,83,0.6)' }} />
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '4px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 6px' }}>Menu</div>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
              background: isActive ? 'rgba(102,209,255,0.14)' : 'transparent',
              color: isActive ? '#66d1ff' : 'rgba(255,255,255,0.6)',
              borderLeft: isActive ? '3px solid #66d1ff' : '3px solid transparent',
              transition: 'all 0.15s ease',
            })}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.5 }}>
          ChicoFC B2B · v1.0
        </div>
      </div>
    </aside>
  )
}
