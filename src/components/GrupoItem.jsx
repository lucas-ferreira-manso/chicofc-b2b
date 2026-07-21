import { useState, useRef, useEffect } from 'react'
import {
  CalendarBlank, MapPin, UsersThree, DotsThreeVertical,
  CheckCircle, ArrowUUpLeft, WhatsappLogo, PencilSimple, TrashSimple,
} from '@phosphor-icons/react'

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

  const statusColor = isPago ? 'var(--green)' : isPendente ? 'var(--red)' : 'var(--text-3)'
  const statusBg = isPago ? 'var(--green-bg)' : isPendente ? 'var(--red-bg)' : 'var(--surface-alt)'
  const statusText = isPago ? 'Pago' : isPendente ? 'Pendente' : 'Espera'

  return (
    <div className="card" style={{
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      position: 'relative',
    }}>
      {/* Avatar colorido */}
      <div style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: statusBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, color: statusColor,
      }}>
        {grupo.nome.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {grupo.nome}
          </span>
          {isEspera && (
            <span className="badge" style={{ background: 'var(--yellow-bg)', color: 'var(--yellow)', flexShrink: 0 }}>
              Espera
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <CalendarBlank size={14} weight="regular" /> {grupo.dia} · {grupo.horario}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={14} weight="regular" /> {QUADRA_NOMES[grupo.quadra] || grupo.quadra}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <UsersThree size={14} weight="regular" /> {grupo.jogadores} jogadores
          </span>
        </div>
      </div>

      {/* Valor */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
          R$ {grupo.valor?.toLocaleString('pt-BR')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>/mês</div>
      </div>

      {/* Badge pagamento */}
      <span className="badge" style={{
        background: statusBg, color: statusColor, flexShrink: 0,
        minWidth: 68, justifyContent: 'center',
      }}>
        {statusText}
      </span>

      {/* Menu */}
      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: menuOpen ? 'var(--surface-alt)' : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-3)',
          }}>
          <DotsThreeVertical size={18} weight="regular" />
        </button>

        {menuOpen && (
          <div className="card" style={{
            position: 'absolute', right: 0, top: 38, zIndex: 100,
            borderRadius: 12, boxShadow: 'var(--shadow-lg)',
            minWidth: 200, overflow: 'hidden', padding: '4px 0',
          }}>
            {isPendente && (
              <MenuItem Icon={CheckCircle} label="Marcar como pago" color="var(--green-dark)"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }} />
            )}
            {isPago && (
              <MenuItem Icon={ArrowUUpLeft} label="Marcar como pendente" color="var(--yellow)"
                onClick={() => { onTogglePago(grupo.id); setMenuOpen(false) }} />
            )}
            {isPendente && (
              <MenuItem Icon={WhatsappLogo} label="Cobrar via WhatsApp" color="#25d366"
                onClick={() => { onCobrar(grupo); setMenuOpen(false) }} />
            )}
            <MenuItem Icon={PencilSimple} label="Editar grupo" color="var(--blue)"
              onClick={() => { onEditar(grupo); setMenuOpen(false) }} />
            <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
            <MenuItem Icon={TrashSimple} label="Excluir grupo" color="var(--red)"
              onClick={() => { onExcluir(grupo); setMenuOpen(false) }} />
          </div>
        )}
      </div>
    </div>
  )
}

function MenuItem({ Icon, label, color, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '10px 16px', background: hover ? 'var(--surface-alt)' : 'transparent',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left'
      }}>
      <Icon size={16} weight="regular" color={color} />
      <span style={{ fontSize: 13, fontWeight: 500, color }}>{label}</span>
    </button>
  )
}
