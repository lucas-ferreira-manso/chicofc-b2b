import { useState } from 'react'
import { QUADRAS, HORARIOS, DIAS, CORES, CONFIG, AGENDA_INICIAL } from '../data'
import { Plus, SoccerBall, TrashSimple } from '@phosphor-icons/react'

export default function Agenda() {
  const [quadraId, setQuadraId] = useState('society')
  const [agenda, setAgenda] = useState(AGENDA_INICIAL)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ grupo: '', tipo: 'mensal', cor: CORES[0] })
  const [confirmRemove, setConfirmRemove] = useState(null)

  const quadraAtual = QUADRAS.find(q => q.id === quadraId)
  const agendaQuadra = agenda[quadraId] || {}

  const slotsOcupados = Object.values(agendaQuadra).reduce((t, dia) =>
    t + Object.values(dia).filter(Boolean).length, 0)
  const totalSlots = DIAS.length * HORARIOS.length

  const handleAdd = () => {
    if (!form.grupo.trim()) return
    setAgenda(prev => ({
      ...prev,
      [modal.quadra]: { ...prev[modal.quadra], [modal.dia]: { ...prev[modal.quadra][modal.dia], [modal.horario]: { grupo: form.grupo, cor: form.cor, tipo: form.tipo } } }
    }))
    setModal(null)
  }

  const handleRemove = () => {
    setAgenda(prev => ({
      ...prev,
      [confirmRemove.quadra]: { ...prev[confirmRemove.quadra], [confirmRemove.dia]: { ...prev[confirmRemove.quadra][confirmRemove.dia], [confirmRemove.horario]: null } }
    }))
    setConfirmRemove(null); setModal(null)
  }

  const tipoLabel = { mensal: 'Mensalista', avulso: 'Avulso', espera: 'Espera' }
  const tipoValor = { mensal: `R$ ${CONFIG.mensalidadeSociety.toLocaleString('pt-BR')}/mês`, avulso: `R$ ${CONFIG.valorAvulso.toLocaleString('pt-BR')}/hora`, espera: 'Aguardando' }

  const ocupacaoPorDia = DIAS.map(dia => {
    const slots = HORARIOS.map(h => agendaQuadra[dia]?.[h]).filter(Boolean)
    return { dia, ocupados: slots.length, total: HORARIOS.length }
  })

  return (
    <div className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Agenda</h1>
            <p className="page-subtitle">
              {slotsOcupados} de {totalSlots} horários ocupados · Clique para gerenciar
            </p>
          </div>
          <div className="card" style={{
            padding: '10px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)', lineHeight: 1 }}>{slotsOcupados}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>ocupados</div>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-3)', lineHeight: 1 }}>{totalSlots - slotsOcupados}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>vagos</div>
            </div>
          </div>
        </div>

        <div className="dash-layout">
          {/* Coluna esquerda */}
          <div style={{ minWidth: 0 }}>
            {/* Seletor quadra + legenda */}
            <div className="card" style={{
              padding: '16px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUADRAS.map(q => (
                  <button key={q.id} onClick={() => setQuadraId(q.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                      background: quadraId === q.id ? q.cor : 'var(--surface-alt)',
                      color: quadraId === q.id ? '#fff' : 'var(--text-2)',
                    }}>
                    {q.nome}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['var(--blue)','Mensalista'],['var(--yellow)','Avulso'],['var(--text-3)','Espera'],['var(--border)','Vago']].map(([cor,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: cor }} />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 640, width: '100%' }}>
                  {/* Header dias */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '76px repeat(6, 1fr)',
                    background: quadraAtual?.cor || 'var(--blue)',
                    position: 'sticky', top: 0, zIndex: 10,
                  }}>
                    <div style={{ padding: '14px 12px', fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Horário</div>
                    {DIAS.map(d => (
                      <div key={d} style={{ padding: '14px 8px', fontSize: 12, color: '#fff', fontWeight: 600, textAlign: 'center' }}>{d}</div>
                    ))}
                  </div>

                  {/* Horários */}
                  {HORARIOS.map((h) => (
                    <div key={h} style={{ display: 'grid', gridTemplateColumns: '76px repeat(6, 1fr)', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{
                        padding: '10px 12px', fontSize: 11, fontWeight: 600,
                        color: quadraAtual?.cor || 'var(--blue)',
                        background: 'var(--surface-alt)', borderRight: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center',
                      }}>{h}</div>
                      {DIAS.map((dia, di) => {
                        const slot = agendaQuadra[dia]?.[h]
                        const bg = !slot ? 'var(--surface)' : slot.espera ? 'var(--yellow-bg)' : slot.tipo === 'avulso' ? '#fff8ec' : 'var(--accent)'
                        return (
                          <div key={dia}
                            onClick={() => {
                              if (slot) { setModal({ quadra: quadraId, dia, horario: h, slot }) }
                              else { setForm({ grupo: '', tipo: 'mensal', cor: CORES[0] }); setModal({ quadra: quadraId, dia, horario: h, slot: null }) }
                            }}
                            style={{
                              padding: '6px 4px', cursor: 'pointer',
                              borderLeft: di > 0 ? '1px solid var(--border-light)' : 'none',
                              background: bg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              minHeight: 56,
                            }}>
                            {!slot ? (
                              <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                                <Plus size={12} weight="bold" color="var(--text-3)" />
                              </div>
                            ) : (
                              <div style={{ textAlign: 'center', padding: '2px 3px' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: slot.cor, margin: '0 auto 3px' }} />
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{slot.grupo}</div>
                                <div style={{ fontSize: 9, color: slot.tipo === 'mensal' ? 'var(--blue)' : 'var(--yellow)', marginTop: 1, fontWeight: 500 }}>{tipoLabel[slot.tipo]}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>{/* fim coluna esquerda */}

          {/* Painel direito */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Ocupação geral */}
            <div className="card" style={{ padding: '20px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
                Ocupação — {quadraAtual?.nome}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--blue)', lineHeight: 1, letterSpacing: '-0.02em' }}>{Math.round((slotsOcupados / totalSlots) * 100)}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>ocupado</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-2)' }}>Ocupados</span>
                    <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{slotsOcupados}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-2)' }}>Vagos</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-3)' }}>{totalSlots - slotsOcupados}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-2)' }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{totalSlots}</span>
                  </div>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${Math.round((slotsOcupados / totalSlots) * 100)}%` }} />
              </div>
            </div>

            {/* Por dia da semana */}
            <div className="card" style={{ padding: '20px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Por dia da semana</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ocupacaoPorDia.map(({ dia, ocupados, total }) => (
                  <div key={dia}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{dia}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: ocupados > 0 ? 'var(--blue)' : 'var(--text-3)' }}>{ocupados}/{total}</span>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <div className="progress-bar" style={{
                        height: 5,
                        width: `${Math.round((ocupados / total) * 100)}%`,
                        background: ocupados === total ? 'var(--green)' : ocupados > 0 ? 'var(--blue)' : 'var(--border)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadras */}
            <div className="card" style={{ padding: '20px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Quadras</div>
              {QUADRAS.map(q => {
                const ag = agenda[q.id] || {}
                const ocp = Object.values(ag).reduce((t, d) => t + Object.values(d).filter(Boolean).length, 0)
                const tot = DIAS.length * HORARIOS.length
                return (
                  <div key={q.id} onClick={() => setQuadraId(q.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      background: quadraId === q.id ? 'var(--accent)' : 'transparent',
                      border: `1.5px solid ${quadraId === q.id ? 'var(--blue)' : 'transparent'}`,
                      marginBottom: 6,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: q.cor }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{q.nome}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{ocp}/{tot}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>{/* fim dash-layout */}
      </div>

      {/* Modal adicionar */}
      {modal && !modal.slot && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-panel" style={{ padding: 28, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Adicionar reserva</h3>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 22 }}>
              {quadraAtual?.nome} · {modal.dia} · {modal.horario}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="field-label">Nome do grupo</label>
                <input value={form.grupo} onChange={e => setForm(f => ({ ...f, grupo: e.target.value }))}
                  placeholder="Ex: Fut Raiz" autoFocus className="input" />
              </div>
              <div>
                <label className="field-label">Tipo de locação</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['mensal','Mensalista',`R$ ${CONFIG.mensalidadeSociety}/mês`],['avulso','Avulso',`R$ ${CONFIG.valorAvulso}/hora`]].map(([v,l,s]) => (
                    <div key={v} onClick={() => setForm(f => ({ ...f, tipo: v }))}
                      style={{
                        flex: 1, padding: 12, borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${form.tipo === v ? 'var(--blue)' : 'var(--border)'}`,
                        cursor: 'pointer', background: form.tipo === v ? 'var(--accent)' : 'var(--surface)',
                      }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.tipo === v ? 'var(--blue)' : 'var(--text)' }}>{l}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Cor</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CORES.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, cor: c }))}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                        border: `3px solid ${form.cor === c ? 'var(--text)' : 'transparent'}`,
                        boxShadow: form.cor === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                      }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button onClick={handleAdd} disabled={!form.grupo.trim()} className="btn btn-primary" style={{ flex: 1 }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver/remover */}
      {modal && modal.slot && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-panel" style={{ padding: 28, maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div className="icon-tile" style={{
                width: 46, height: 46, borderRadius: 13,
                background: `color-mix(in srgb, ${modal.slot.cor} 14%, white)`,
              }}>
                <SoccerBall size={22} weight="regular" color={modal.slot.cor} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{modal.slot.grupo}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{quadraAtual?.nome} · {modal.dia} · {modal.horario}</div>
              </div>
            </div>
            {[['Tipo', tipoLabel[modal.slot.tipo]], ['Valor', tipoValor[modal.slot.tipo]]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={() => setModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Fechar
              </button>
              <button onClick={() => { setModal(null); setConfirmRemove({ quadra: quadraId, dia: modal.dia, horario: modal.horario }) }}
                className="btn btn-danger-soft" style={{ flex: 1 }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar remoção */}
      {confirmRemove && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ padding: 28, maxWidth: 340 }}>
            <div className="icon-tile" style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--red-bg)', marginBottom: 16 }}>
              <TrashSimple size={22} weight="regular" color="var(--red)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Remover horário?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>
              {confirmRemove.dia} · {confirmRemove.horario} ficará disponível novamente.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button onClick={handleRemove} className="btn" style={{ flex: 1, background: 'var(--red)', color: '#fff' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
