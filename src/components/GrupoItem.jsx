import { useState, useRef, useEffect } from 'react'

const QUADRA_NOMES = {
  society: 'Campo Society', volei1: 'Vôlei 1', volei2: 'Vôlei 2', volei3: 'Vôlei 3', volei4: 'Vôlei 4'
}

export default function GrupoItem({ grupo, onTogglePago, onCobrar, onEditar, onExcluir }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isPago = grupo.pago
  const isPendente = !isPago && grupo.status === 'ativo'
  const isEspera = grupo.status === 'espera'

  const statusColor = isPago ? '#34a853' : isPendente ? '#ea4335' : '#9aa0a6'
  const statusBg = isPago ? '#e6f4ea' : isPendente ? '#fce8e6' : '#f3f4f6'
  const statusText = isPago ? 'Pago' : isPendente ? 'Pendente' : 'Espera'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '14px 16px',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      position: 'relative',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Avatar colorido */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: `${statusColor}18`,
        border: `1.5px solid ${statusColor}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 700, color: statusColor,
      }}>
        {grupo.nome.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {grupo.nome}
          </span>
          {isEspera && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#fef7e0', color: '#b45309', fontWeight: 600, flexShrink: 0 }}>
              Espera
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ opacity: 0.7 }}>📅</span> {grupo.dia} · {grupo.horario}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ opacity: 0.7 }}>🏟</span> {QUADRA_NOMES[grupo.quadra] || grupo.quadra}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ opacity: 0.7 }}>👥</span> {grupo.jogadores} jogadores
          </span>
        </div>
      </div>

      {/* Valor */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
          R$ {grupo.valor?.toLocaleString('pt-BR')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>/mês</div>
      </div>

      {/* Badge pagamento */}
      <span style={{
        fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 600, flexShrink: 0,
        background: statusBg, color: statusColor,
        minWidth: 68, textAlign: 'center',
      }}>
        {statusText}
      </span>

      {/* Menu */}
      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: menuOpen ? '#f0f4ff' : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 3,
          }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: '#9aa0a6' }} />)}
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 36, zIndex: 100, background: '#fff',
            borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
            minWidth: 190, overflow: 'hidden', padding: '4px 0',
          }}>
            {isPendente && (
              <MenuItem icon="✅" label="Marcar como pago" color="#0d7a3e"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }} />
            )}
            {isPago && (
              <MenuItem icon="↩️" label="Marcar como pendente" color="#b45309"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }} />
            )}
            {isPendente && (
              <MenuItem icon="💬" label="Cobrar via WhatsApp" color="#25d366"
                onClick={() => { onCobrar(grupo); setMenuOpen(false) }} />
            )}
            <MenuItem icon="✏️" label="Editar grupo" color="#082996"
              onClick={() => { onEditar(grupo); setMenuOpen(false) }} />
            <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
            <MenuItem icon="🗑" label="Excluir grupo" color="#ea4335"
              onClick={() => { onExcluir(grupo); setMenuOpen(false) }} />
          </div>
        )}
      </div>
    </div>
  )
}

function MenuItem({ icon, label, color, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '9px 16px', background: hover ? '#f8f9fb' : 'transparent',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left'
      }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color }}>{label}</span>
    </button>
  )
}
