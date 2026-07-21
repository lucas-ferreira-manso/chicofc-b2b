import { NavLink } from 'react-router-dom'
import {
  House, CalendarBlank, UsersThree, Wallet, ChartBar, Question, Gear,
} from '@phosphor-icons/react'
import { VENUE } from '../data'

const NAV = [
  { to: '/', label: 'Dashboard', Icon: House },
  { to: '/agenda', label: 'Agenda', Icon: CalendarBlank },
  { to: '/grupos', label: 'Grupos', Icon: UsersThree },
  { to: '/financeiro', label: 'Financeiro', Icon: Wallet },
  { to: '/relatorios', label: 'Relatórios', Icon: ChartBar },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#0a1c56',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Identidade da quadra (workspace do cliente) */}
      <div style={{ padding: '22px 22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42,
            background: 'var(--blue-light)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: 17, fontWeight: 700, color: '#0a1c56',
          }}>
            {VENUE.nome.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {VENUE.nome}
              </div>
              <div title="Online" style={{ width: 7, height: 7, background: '#34d399', borderRadius: '50%', flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {VENUE.cidade}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px 8px' }}>Menu</div>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
            })}>
            <Icon size={19} weight="regular" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 12px 16px' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', marginBottom: 2 }}>
          <Question size={19} weight="regular" /> Ajuda
        </a>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
          <Gear size={19} weight="regular" /> Configurações
        </a>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.22)', textAlign: 'center', lineHeight: 1.5, marginTop: 14 }}>
          Powered by ChicoFC
        </div>
      </div>
    </aside>
  )
}
