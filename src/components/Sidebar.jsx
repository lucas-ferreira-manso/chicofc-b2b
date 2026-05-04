import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',           label: 'Dashboard', icon: '◉' },
  { to: '/agenda',     label: 'Agenda',    icon: '📅' },
  { to: '/grupos',     label: 'Grupos',    icon: '⚽' },
  { to: '/financeiro', label: 'Financeiro',icon: '💰' },
  { to: '/relatorios', label: 'Relatórios',icon: '📊' },
]

export default function Sidebar() {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#082996', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '28px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 34, height: 34, background: '#66d1ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚽</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>ChicoFC</span>
        </div>
        <span style={{ fontSize: 11, color: '#66d1ff', fontWeight: 500 }}>Painel da Quadra</span>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>9E10</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Florianópolis, SC</div>
      </div>
      <nav style={{ flex: 1, padding: '12px' }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', fontSize: 14, fontWeight: 500,
            background: isActive ? 'rgba(102,209,255,0.15)' : 'transparent',
            color: isActive ? '#66d1ff' : 'rgba(255,255,255,0.75)',
          })}>
            <span>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
        ChicoFC B2B · Protótipo
      </div>
    </aside>
  )
}
