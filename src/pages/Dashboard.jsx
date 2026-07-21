import { useState } from 'react'
import { NOTIFICACOES, HISTORICO_MENSAL, CONFIG } from '../data'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { useGrupos } from '../components/useGrupos'
import {
  Plus, TrendUp, TrendDown, HandCoins, HourglassMedium, SoccerBall, ChartPieSlice,
  Bell, WarningCircle, CheckCircle, PencilSimple,
} from '@phosphor-icons/react'

const PERIODOS = [1, 3, 6, 12]

function Sparkline({ data, color = 'var(--blue-light)', height = 44 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 140, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const lastX = w
  const lastY = h - ((data[data.length-1] - min) / range) * (h - 4) - 2
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
    </svg>
  )
}

export default function Dashboard() {
  const { grupos, togglePago, cobrar, salvarGrupo, excluir, totalRecebido, totalPendente, totalEsperado, metaMensal } = useGrupos()
  const [periodo, setPeriodo] = useState(6)
  const [modalGrupo, setModalGrupo] = useState(null)
  const [metaInput, setMetaInput] = useState(CONFIG.metaAnual)
  const [editandoMeta, setEditandoMeta] = useState(false)

  const gruposAtivos = grupos.filter(g => g.status === 'ativo')
  const metaMensalCalc = Math.round(metaInput / 12)
  const pctMeta = Math.min(Math.round((totalRecebido / metaMensalCalc) * 100), 100)
  const falta = Math.max(metaMensalCalc - totalRecebido, 0)

  const dadosGrafico = HISTORICO_MENSAL.slice(-periodo)
  const maxVal = Math.max(...dadosGrafico.map(d => d.total))

  const ultimoMes = HISTORICO_MENSAL[HISTORICO_MENSAL.length - 1]
  const penultimoMes = HISTORICO_MENSAL[HISTORICO_MENSAL.length - 2]
  const crescMes = penultimoMes ? Math.round(((ultimoMes.total - penultimoMes.total) / penultimoMes.total) * 100) : 0

  const sparkData = HISTORICO_MENSAL.slice(-7).map(d => d.total)

  const handleExcluir = (grupo) => {
    if (window.confirm(`Excluir o grupo "${grupo.nome}"?${!grupo.pago ? '\n\n⚠️ Há pagamento pendente. O responsável será notificado via WhatsApp.' : ''}`)) {
      excluir(grupo.id)
    }
  }

  const kpis = [
    {
      label: 'Recebido',
      value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`,
      sub: `${grupos.filter(g => g.pago && g.status === 'ativo').length} grupos pagos`,
      color: 'var(--green-dark)', bg: 'var(--green-bg)', Icon: HandCoins,
      pct: Math.round((totalRecebido / totalEsperado) * 100),
    },
    {
      label: 'Pendente',
      value: `R$ ${totalPendente.toLocaleString('pt-BR')}`,
      sub: `${grupos.filter(g => !g.pago && g.status === 'ativo').length} grupos`,
      color: 'var(--red)', bg: 'var(--red-bg)', Icon: HourglassMedium,
      pct: Math.round((totalPendente / totalEsperado) * 100),
    },
    {
      label: 'Grupos ativos',
      value: gruposAtivos.length,
      sub: `Potencial R$ ${totalEsperado.toLocaleString('pt-BR')}/mês`,
      color: 'var(--blue)', bg: 'var(--accent)', Icon: SoccerBall,
      pct: null,
    },
    {
      label: 'Ocupação',
      value: `${Math.round((gruposAtivos.filter(g=>g.quadra==='society').length / 24) * 100)}%`,
      sub: `${gruposAtivos.filter(g=>g.quadra==='society').length} de 24 horários`,
      color: 'var(--yellow)', bg: 'var(--yellow-bg)', Icon: ChartPieSlice,
      pct: Math.round((gruposAtivos.filter(g=>g.quadra==='society').length / 24) * 100),
    },
  ]

  return (
    <div className="page">
      <div className="page-inner">
        {modalGrupo !== null && (
          <GrupoModal
            grupo={modalGrupo?.id ? modalGrupo : null}
            onSave={(form) => { salvarGrupo(form); setModalGrupo(null) }}
            onClose={() => setModalGrupo(null)}
          />
        )}

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Bom dia, 9E10 👋</h1>
            <p className="page-subtitle">Maio de 2025 · Semana em andamento</p>
          </div>
          <button onClick={() => setModalGrupo({})} className="btn btn-primary">
            <Plus size={16} weight="bold" /> Novo grupo
          </button>
        </div>

        {/* Two-column layout */}
        <div className="dash-layout">

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Hero card */}
            <div style={{
              background: 'linear-gradient(120deg, var(--blue) 0%, var(--blue-mid) 100%)',
              borderRadius: 'var(--radius)',
              padding: '26px 28px',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 9, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Receita — Maio 2025
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    R$ {totalEsperado.toLocaleString('pt-BR')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                      background: crescMes >= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)',
                      color: crescMes >= 0 ? '#6ee7b0' : '#fca5a5',
                    }}>
                      {crescMes >= 0 ? <TrendUp size={13} weight="bold" /> : <TrendDown size={13} weight="bold" />}
                      {Math.abs(crescMes)}% vs mês anterior
                    </span>
                  </div>
                </div>
                <div style={{ opacity: 0.95 }}>
                  <Sparkline data={sparkData} height={48} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button onClick={() => setModalGrupo({})}
                  style={{
                    padding: '9px 18px', borderRadius: 'var(--radius-sm)', border: 'none',
                    background: 'rgba(255,255,255,0.16)', color: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Plus size={15} weight="bold" /> Novo grupo
                </button>
                <button
                  style={{
                    padding: '9px 18px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'transparent', color: 'rgba(255,255,255,0.85)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                  }}>
                  Ver detalhes
                </button>
              </div>
            </div>

            {/* KPI cards */}
            <div className="kpi-grid">
              {kpis.map(c => (
                <div key={c.label} className="card card-pad">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div className="eyebrow" style={{ marginBottom: 7 }}>{c.label}</div>
                      <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{c.value}</div>
                    </div>
                    <c.Icon size={20} weight="regular" color="var(--text-3)" />
                  </div>
                  {c.pct !== null && (
                    <div className="progress-track" style={{ height: 4, marginBottom: 9 }}>
                      <div className="progress-bar" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  )}
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Gráfico */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 className="section-title">Evolução financeira</h2>
                  <p className="section-subtitle">Total · Mensalista · Avulso</p>
                </div>
                <div className="pill-tabs">
                  {PERIODOS.map(p => (
                    <button key={p} onClick={() => setPeriodo(p)}
                      className={`pill-tab ${periodo === p ? 'active' : ''}`}>
                      {p}m
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
                {[['var(--blue)','Total'],['var(--blue-light)','Mensalista'],['var(--green)','Avulso']].map(([cor,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: cor }} />
                    <span style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
                {dadosGrafico.map((d, i) => {
                  const isLast = i === dadosGrafico.length - 1
                  const hTotal = Math.round((d.total / maxVal) * 140)
                  const hMensal = Math.round((d.mensal / maxVal) * 140)
                  const hAvulso = Math.round((d.avulso / maxVal) * 140)
                  return (
                    <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      {isLast && (
                        <span style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 700 }}>
                          R${(d.total/1000).toFixed(1)}k
                        </span>
                      )}
                      <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 140 }}>
                        <div style={{ flex: 1, height: hTotal, background: isLast ? 'var(--blue)' : '#dbe4ff', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                        <div style={{ flex: 1, height: hMensal, background: isLast ? 'var(--blue-light)' : '#bfdbfe', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                        <div style={{ flex: 1, height: hAvulso, background: isLast ? 'var(--green)' : '#bbf7d0', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 10, color: isLast ? 'var(--blue)' : 'var(--text-3)', fontWeight: isLast ? 700 : 500 }}>
                        {d.mes.split('/')[0]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lista de grupos */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h2 className="section-title">Grupos mensalistas</h2>
                  <p className="section-subtitle">{gruposAtivos.length} grupos ativos</p>
                </div>
                <button onClick={() => setModalGrupo({})} className="btn btn-soft btn-sm">
                  <Plus size={14} weight="bold" /> Novo grupo
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gruposAtivos.map(g => (
                  <GrupoItem key={g.id} grupo={g}
                    onTogglePago={togglePago}
                    onCobrar={cobrar}
                    onEditar={(g) => setModalGrupo(g)}
                    onExcluir={handleExcluir}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Meta mensal */}
            <div className="card card-pad">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 className="section-title">Meta mensal</h2>
                <button onClick={() => setEditandoMeta(e => !e)} className="btn btn-ghost btn-sm" style={{ padding: '5px 10px', gap: 5 }}>
                  <PencilSimple size={13} weight="regular" /> {editandoMeta ? 'Salvar' : 'Editar'}
                </button>
              </div>

              {editandoMeta ? (
                <div style={{ marginBottom: 14 }}>
                  <label className="field-label">Meta anual (R$)</label>
                  <input type="number" value={metaInput} onChange={e => setMetaInput(+e.target.value)}
                    className="input" style={{ borderColor: 'var(--blue)' }} />
                  <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Mensal: R$ {metaMensalCalc.toLocaleString('pt-BR')}</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--blue)', letterSpacing: '-0.02em' }}>{pctMeta}%</span>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      R$ {totalRecebido.toLocaleString('pt-BR')} / R$ {metaMensalCalc.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="progress-track" style={{ marginBottom: 12 }}>
                    <div className="progress-bar" style={{
                      width: `${pctMeta}%`,
                      background: pctMeta >= 100 ? 'var(--green)' : 'var(--blue)',
                    }} />
                  </div>
                </>
              )}

              <div style={{
                padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                background: falta > 0 ? 'var(--red-bg)' : 'var(--green-bg)',
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                {falta > 0
                  ? <WarningCircle size={17} weight="regular" color="var(--red)" />
                  : <CheckCircle size={17} weight="regular" color="var(--green-dark)" />}
                <span style={{ fontSize: 12, color: falta > 0 ? 'var(--red)' : 'var(--green-dark)', fontWeight: 500 }}>
                  {falta > 0
                    ? `Faltam R$ ${falta.toLocaleString('pt-BR')} para a meta`
                    : 'Meta do mês atingida!'}
                </span>
              </div>
            </div>

            {/* Notificações */}
            <div className="card card-pad">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Bell size={16} weight="regular" /> Notificações
                </h2>
                <span className="badge" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                  {NOTIFICACOES.filter(n => n.urgente).length} urgentes
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NOTIFICACOES.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    background: n.urgente ? 'var(--red-bg)' : 'var(--surface-alt)',
                  }}>
                    <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45, marginBottom: 4 }}>{n.msg}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 500 }}>há {n.tempo}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status pagamentos */}
            <div className="card card-pad">
              <h2 className="section-title" style={{ marginBottom: 14 }}>Status de pagamentos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {grupos.filter(g => g.status === 'ativo').map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: g.pago ? 'var(--green-bg)' : 'var(--red-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      color: g.pago ? 'var(--green-dark)' : 'var(--red)',
                    }}>
                      {g.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.nome}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{g.dia} · {g.horario}</div>
                    </div>
                    <span className="badge" style={{
                      flexShrink: 0,
                      background: g.pago ? 'var(--green-bg)' : 'var(--red-bg)',
                      color: g.pago ? 'var(--green-dark)' : 'var(--red)',
                    }}>
                      {g.pago ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
