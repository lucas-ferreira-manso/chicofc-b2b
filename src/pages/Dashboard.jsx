import { useState } from 'react'
import { NOTIFICACOES, HISTORICO_MENSAL, CONFIG } from '../data'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { useGrupos } from '../components/useGrupos'

const PERIODOS = [1, 3, 6, 12]

function Sparkline({ data, color = '#66d1ff', height = 44 }) {
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
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
              Bom dia, 9E10! 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Maio de 2025 · Semana em andamento
            </p>
          </div>
          <button onClick={() => setModalGrupo({})}
            style={{
              padding: '10px 20px', borderRadius: 10,
              background: 'var(--blue)', color: '#fff',
              border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 4px 14px rgba(8,41,150,0.3)',
            }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Novo grupo
          </button>
        </div>

        {/* Two-column layout */}
        <div className="dash-layout">

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Hero card */}
            <div style={{
              background: 'linear-gradient(135deg, #082996 0%, #1a3fbe 60%, #0d47a1 100%)',
              borderRadius: 'var(--radius)',
              padding: '28px 32px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(8,41,150,0.35)',
            }}>
              {/* Background decoration */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ position: 'absolute', bottom: -40, right: 60, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Receita — Maio 2025
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    R$ {totalEsperado.toLocaleString('pt-BR')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                      background: crescMes >= 0 ? 'rgba(52,168,83,0.25)' : 'rgba(234,67,53,0.25)',
                      color: crescMes >= 0 ? '#6ee7a0' : '#fca5a5',
                    }}>
                      {crescMes >= 0 ? '↑' : '↓'} {Math.abs(crescMes)}% vs mês anterior
                    </span>
                  </div>
                </div>
                <div style={{ opacity: 0.9 }}>
                  <Sparkline data={sparkData} color="#66d1ff" height={52} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setModalGrupo({})}
                  style={{
                    padding: '9px 20px', borderRadius: 9, border: 'none',
                    background: 'rgba(255,255,255,0.18)', color: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  + Novo grupo
                </button>
                <button
                  style={{
                    padding: '9px 20px', borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent', color: 'rgba(255,255,255,0.8)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>
                  Ver detalhes
                </button>
              </div>
            </div>

            {/* KPI cards */}
            <div className="kpi-grid">
              {[
                {
                  label: 'Recebido',
                  value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`,
                  sub: `${grupos.filter(g => g.pago && g.status === 'ativo').length} grupos pagos`,
                  color: '#0d7a3e', bg: '#e6f4ea', icon: '💰',
                  pct: Math.round((totalRecebido / totalEsperado) * 100),
                },
                {
                  label: 'Pendente',
                  value: `R$ ${totalPendente.toLocaleString('pt-BR')}`,
                  sub: `${grupos.filter(g => !g.pago && g.status === 'ativo').length} grupos`,
                  color: '#ea4335', bg: '#fce8e6', icon: '⏳',
                  pct: Math.round((totalPendente / totalEsperado) * 100),
                },
                {
                  label: 'Grupos ativos',
                  value: gruposAtivos.length,
                  sub: `Potencial R$ ${totalEsperado.toLocaleString('pt-BR')}/mês`,
                  color: '#082996', bg: '#e8f0ff', icon: '⚽',
                  pct: null,
                },
                {
                  label: 'Ocupação',
                  value: `${Math.round((gruposAtivos.filter(g=>g.quadra==='society').length / 24) * 100)}%`,
                  sub: `${gruposAtivos.filter(g=>g.quadra==='society').length} de 24 horários`,
                  color: '#b45309', bg: '#fef7e0', icon: '📊',
                  pct: Math.round((gruposAtivos.filter(g=>g.quadra==='society').length / 24) * 100),
                },
              ].map(c => (
                <div key={c.label} style={{
                  background: '#fff', borderRadius: 'var(--radius)',
                  padding: '20px', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                    </div>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: c.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>{c.icon}</div>
                  </div>
                  {c.pct !== null && (
                    <div style={{ height: 3, background: '#f0f0f0', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Gráfico */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '24px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Evolução financeira</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Total · Mensalista · Avulso</p>
                </div>
                <div style={{ display: 'flex', gap: 4, background: '#f2f4f8', borderRadius: 8, padding: 4 }}>
                  {PERIODOS.map(p => (
                    <button key={p} onClick={() => setPeriodo(p)}
                      style={{
                        padding: '4px 11px', borderRadius: 6, border: 'none', fontSize: 12,
                        fontWeight: 500, cursor: 'pointer',
                        background: periodo === p ? '#082996' : 'transparent',
                        color: periodo === p ? '#fff' : 'var(--text-2)',
                        transition: 'all 0.15s',
                      }}>
                      {p}m
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {[['#082996','Total'],['#66d1ff','Mensalista'],['#34a853','Avulso']].map(([cor,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: cor }} />
                    <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</span>
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
                    <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      {isLast && (
                        <span style={{ fontSize: 10, color: '#082996', fontWeight: 700 }}>
                          R${(d.total/1000).toFixed(1)}k
                        </span>
                      )}
                      <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 140 }}>
                        <div style={{ flex: 1, height: hTotal, background: isLast ? '#082996' : '#dbe4ff', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                        <div style={{ flex: 1, height: hMensal, background: isLast ? '#66d1ff' : '#bfdbfe', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                        <div style={{ flex: 1, height: hAvulso, background: isLast ? '#34a853' : '#bbf7d0', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 10, color: isLast ? '#082996' : 'var(--text-3)', fontWeight: isLast ? 700 : 400 }}>
                        {d.mes.split('/')[0]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lista de grupos */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 24px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Grupos mensalistas</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{gruposAtivos.length} grupos ativos</p>
                </div>
                <button onClick={() => setModalGrupo({})}
                  style={{
                    fontSize: 12, padding: '6px 14px', borderRadius: 8,
                    background: '#e8f0ff', border: 'none', color: '#082996',
                    fontWeight: 600, cursor: 'pointer',
                  }}>
                  + Novo grupo
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
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Meta mensal</h2>
                <button onClick={() => setEditandoMeta(e => !e)}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6,
                    background: '#f2f4f8', border: '1px solid var(--border)',
                    cursor: 'pointer', color: 'var(--text-2)', fontWeight: 500,
                  }}>
                  {editandoMeta ? 'Salvar' : 'Editar'}
                </button>
              </div>

              {editandoMeta ? (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-2)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meta anual (R$)</label>
                  <input type="number" value={metaInput} onChange={e => setMetaInput(+e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #082996', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)' }} />
                  <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Mensal: R$ {metaMensalCalc.toLocaleString('pt-BR')}</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--blue)' }}>{pctMeta}%</span>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      R$ {totalRecebido.toLocaleString('pt-BR')} / R$ {metaMensalCalc.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ height: 8, background: '#f0f2f5', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{
                      height: '100%', width: `${pctMeta}%`,
                      background: pctMeta >= 100
                        ? 'linear-gradient(90deg, #34a853, #0d7a3e)'
                        : 'linear-gradient(90deg, #082996, #1a3fbe)',
                      borderRadius: 4, transition: 'width 0.6s ease',
                    }} />
                  </div>
                </>
              )}

              <div style={{
                padding: '10px 14px', borderRadius: 9,
                background: falta > 0 ? '#fce8e6' : '#e6f4ea',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{falta > 0 ? '⚠️' : '✅'}</span>
                <span style={{ fontSize: 12, color: falta > 0 ? '#ea4335' : '#0d7a3e', fontWeight: 500 }}>
                  {falta > 0
                    ? `Faltam R$ ${falta.toLocaleString('pt-BR')} para a meta`
                    : 'Meta do mês atingida!'}
                </span>
              </div>
            </div>

            {/* Notificações */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Notificações</h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                  background: '#fce8e6', color: '#ea4335',
                }}>
                  {NOTIFICACOES.filter(n => n.urgente).length} urgentes
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NOTIFICACOES.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: n.urgente ? '#fff8f8' : '#fafafa',
                    border: `1px solid ${n.urgente ? '#fde8e8' : '#f0f0f0'}`,
                    borderLeft: `3px solid ${n.urgente ? '#ea4335' : '#e8eaed'}`,
                  }}>
                    <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45, marginBottom: 4 }}>{n.msg}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>há {n.tempo}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status pagamentos */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Status de pagamentos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {grupos.filter(g => g.status === 'ativo').map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: g.pago ? '#e6f4ea' : '#fce8e6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      color: g.pago ? '#0d7a3e' : '#ea4335',
                    }}>
                      {g.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.nome}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{g.dia} · {g.horario}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, flexShrink: 0,
                      background: g.pago ? '#e6f4ea' : '#fce8e6',
                      color: g.pago ? '#0d7a3e' : '#ea4335',
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
