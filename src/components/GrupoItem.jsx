import { useState, useRef, useEffect } from 'react'

const QUADRA_NOMES = {
  society: 'Campo Futebol', volei1: 'Vôlei 1', volei2: 'Vôlei 2', volei3: 'Vôlei 3', volei4: 'Vôlei 4'
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

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '14px 16px',
      border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: 12, position: 'relative'
    }}>
      {/* Indicador colorido */}
      <div style={{ width: 4, height: 40, borderRadius: 4, background: isPago ? '#34a853' : isPendente ? '#ea4335' : '#9aa0a6', flexShrink: 0 }} />

      {/* Info principal */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {grupo.nome}
          </span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600, flexShrink: 0,
            background: grupo.status === 'ativo' ? '#e6f4ea' : '#fef7e0',
            color: grupo.status === 'ativo' ? '#0d7a3e' : '#b45309'
          }}>
            {grupo.status === 'ativo' ? 'Ativo' : 'Espera'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#5f6368' }}>📅 {grupo.dia} · {grupo.horario}</span>
          <span style={{ fontSize: 12, color: '#5f6368' }}>🏟 {QUADRA_NOMES[grupo.quadra] || grupo.quadra}</span>
          <span style={{ fontSize: 12, color: '#5f6368' }}>💰 R$ {grupo.valor?.toLocaleString('pt-BR')}/mês</span>
        </div>
      </div>

      {/* Badge pagamento */}
      <span style={{
        fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, flexShrink: 0,
        background: isPago ? '#e6f4ea' : '#fce8e6',
        color: isPago ? '#0d7a3e' : '#ea4335'
      }}>
        {isPago ? 'Pago' : 'Pendente'}
      </span>

      {/* Menu 3 pontos */}
      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ width: 32, height: 32, borderRadius: 8, background: menuOpen ? '#f0f4ff' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3 }}
        >
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#5f6368' }} />)}
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 36, zIndex: 100, background: '#fff',
            borderRadius: 12, border: '1px solid #e8eaed', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: 180, overflow: 'hidden'
          }}>
            {isPendente && (
              <MenuItem
                icon="✅" label="Marcar como pago"
                color="#0d7a3e"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }}
              />
            )}
            {isPago && (
              <MenuItem
                icon="↩️" label="Marcar como pendente"
                color="#b45309"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }}
              />
            )}
            {isPendente && (
              <MenuItem
                icon="💬" label="Cobrar via WhatsApp"
                color="#25d366"
                onClick={() => { onCobrar(grupo); setMenuOpen(false) }}
              />
            )}
            <MenuItem
              icon="✏️" label="Editar grupo"
              color="#082996"
              onClick={() => { onEditar(grupo); setMenuOpen(false) }}
            />
            <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
            <MenuItem
              icon="🗑" label="Excluir grupo"
              color="#ea4335"
              onClick={() => { onExcluir(grupo); setMenuOpen(false) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function MenuItem({ icon, label, color, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '10px 16px', background: hover ? '#f8f9fb' : 'transparent',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left'
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color }}>{label}</span>
    </button>
  )
}
