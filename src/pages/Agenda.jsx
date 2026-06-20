import { useState } from 'react'
import { QUADRAS, HORARIOS, DIAS, CORES, CONFIG } from '../data'

const AGENDA_INICIAL = (() => {
  const a = {}
  QUADRAS.forEach(q => { a[q.id] = {}; DIAS.forEach(d => { a[q.id][d] = {}; HORARIOS.forEach(h => { a[q.id][d][h] = null }) }) })
  const slots = [
    { q:'society', d:'Segunda', h:'20h00', nome:'Fut Raiz',       cor:'#082996', tipo:'mensal' },
    { q:'society', d:'Terça',   h:'21h00', nome:'Terça Pesada',   cor:'#7c3aed', tipo:'mensal' },
    { q:'society', d:'Quarta',  h:'19h00', nome:'Os Crias',       cor:'#b45309', tipo:'mensal' },
    { q:'society', d:'Quarta',  h:'21h00', nome:'ChicoFC',        cor:'#082996', tipo:'mensal' },
    { q:'society', d:'Quinta',  h:'20h00', nome:'Quinta FC',      cor:'#0891b2', tipo:'mensal' },
    { q:'society', d:'Sexta',   h:'21h00', nome:'Pelada do Beto', cor:'#ea4335', tipo:'mensal' },
    { q:'society', d:'Sábado',  h:'19h00', nome:'Boleiros SC',    cor:'#34a853', tipo:'mensal' },
    { q:'volei1',  d:'Sábado',  h:'20h00', nome:'Sábado Bom',     cor:'#9aa0a6', tipo:'mensal', espera:true },
  ]
  slots.forEach(s => { if(a[s.q]?.[s.d]) a[s.q][s.d][s.h] = { grupo:s.nome, cor:s.cor, tipo:s.tipo, espera:s.espera||false } })
  return a
})()

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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Agenda</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {slotsOcupados} de {totalSlots} horários ocupados · Clique para gerenciar
            </p>
          </div>
          <div style={{
            padding: '10px 18px', borderRadius: 10,
            background: '#fff', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
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
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '16px 20px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUADRAS.map(q => (
                  <button key={q.id} onClick={() => setQuadraId(q.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      background: quadraId === q.id ? q.cor : '#f2f4f8',
                      color: quadraId === q.id ? '#fff' : 'var(--text-2)',
                      transition: 'all 0.15s',
                      boxShadow: quadraId === q.id ? `0 4px 12px ${q.cor}40` : 'none',
                    }}>
                    {q.nome}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['#082996','Mensalista'],['#b45309','Avulso'],['#9aa0a6','Espera'],['#e8eaed','Vago']].map(([cor,label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: cor, border: cor === '#e8eaed' ? '1px solid #ccc' : 'none' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

        {/* Grade */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 640, width: '100%' }}>
              {/* Header dias */}
              <div style={{
                display: 'grid', gridTemplateColumns: '76px repeat(6, 1fr)',
                background: quadraAtual?.cor || '#082996',
                position: 'sticky', top: 0, zIndex: 10,
              }}>
                <div style={{ padding: '14px 12px', fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Horário</div>
                {DIAS.map(d => (
                  <div key={d} style={{ padding: '14px 8px', fontSize: 12, color: '#fff', fontWeight: 600, textAlign: 'center', letterSpacing: '0.01em' }}>{d}</div>
                ))}
              </div>

              {/* Horários */}
              {HORARIOS.map((h) => (
                <div key={h} style={{ display: 'grid', gridTemplateColumns: '76px repeat(6, 1fr)', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{
                    padding: '10px 12px', fontSize: 11, fontWeight: 600,
                    color: quadraAtual?.cor || '#082996',
                    background: '#fafbfc', borderRight: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center',
                  }}>{h}</div>
                  {DIAS.map((dia, di) => {
                    const slot = agendaQuadra[dia]?.[h]
                    const bg = !slot ? '#fff' : slot.espera ? '#fffbeb' : slot.tipo === 'avulso' ? '#fff8f0' : '#f5f8ff'
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
                          minHeight: 56, transition: 'background 0.1s',
                        }}>
                        {!slot ? (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <span style={{ fontSize: 12, color: '#9aa0a6', lineHeight: 1 }}>+</span>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2px 3px' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: slot.cor, margin: '0 auto 3px', boxShadow: `0 0 4px ${slot.cor}80` }} />
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>{slot.grupo}</div>
                            <div style={{ fontSize: 9, color: slot.tipo === 'mensal' ? '#082996' : '#b45309', marginTop: 1, fontWeight: 500 }}>{tipoLabel[slot.tipo]}</div>
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
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
                Ocupação — {quadraAtual?.nome}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--blue)', lineHeight: 1 }}>{Math.round((slotsOcupados / totalSlots) * 100)}%</div>
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
              <div style={{ height: 8, background: '#f0f2f5', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((slotsOcupados / totalSlots) * 100)}%`, background: 'linear-gradient(90deg, #082996, #1a3fbe)', borderRadius: 4 }} />
              </div>
            </div>

            {/* Por dia da semana */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Por dia da semana</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ocupacaoPorDia.map(({ dia, ocupados, total }) => (
                  <div key={dia}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{dia}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: ocupados > 0 ? 'var(--blue)' : 'var(--text-3)' }}>{ocupados}/{total}</span>
                    </div>
                    <div style={{ height: 5, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.round((ocupados / total) * 100)}%`,
                        background: ocupados === total ? '#34a853' : ocupados > 0 ? '#082996' : '#e8eaed',
                        borderRadius: 3,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadras */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Quadras</div>
              {QUADRAS.map(q => {
                const ag = agenda[q.id] || {}
                const ocp = Object.values(ag).reduce((t, d) => t + Object.values(d).filter(Boolean).length, 0)
                const tot = DIAS.length * HORARIOS.length
                return (
                  <div key={q.id} onClick={() => setQuadraId(q.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      background: quadraId === q.id ? '#f0f4ff' : 'transparent',
                      border: `1.5px solid ${quadraId === q.id ? '#082996' : 'transparent'}`,
                      marginBottom: 6, transition: 'all 0.15s',
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}
          onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Adicionar reserva</h3>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 22 }}>
              {quadraAtual?.nome} · {modal.dia} · {modal.horario}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome do grupo</label>
                <input value={form.grupo} onChange={e => setForm(f => ({ ...f, grupo: e.target.value }))}
                  placeholder="Ex: Fut Raiz" autoFocus
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)', color: 'var(--text)' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo de locação</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['mensal','Mensalista',`R$ ${CONFIG.mensalidadeSociety}/mês`],['avulso','Avulso',`R$ ${CONFIG.valorAvulso}/hora`]].map(([v,l,s]) => (
                    <div key={v} onClick={() => setForm(f => ({ ...f, tipo: v }))}
                      style={{
                        flex: 1, padding: 12, borderRadius: 9,
                        border: `2px solid ${form.tipo === v ? '#082996' : 'var(--border)'}`,
                        cursor: 'pointer', background: form.tipo === v ? '#e8f0ff' : '#fff',
                        transition: 'all 0.15s',
                      }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.tipo === v ? '#082996' : 'var(--text)' }}>{l}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cor</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CORES.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, cor: c }))}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                        border: `3px solid ${form.cor === c ? 'var(--text)' : 'transparent'}`,
                        transition: 'all 0.15s', boxShadow: form.cor === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                      }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: 11, borderRadius: 9, border: '1.5px solid var(--border)', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'var(--font)' }}>
                Cancelar
              </button>
              <button onClick={handleAdd} disabled={!form.grupo.trim()}
                style={{
                  flex: 1, padding: 11, borderRadius: 9, border: 'none',
                  background: form.grupo.trim() ? '#082996' : 'var(--border)',
                  fontSize: 14, fontWeight: 600,
                  cursor: form.grupo.trim() ? 'pointer' : 'not-allowed',
                  color: form.grupo.trim() ? '#fff' : 'var(--text-3)',
                  fontFamily: 'var(--font)',
                }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver/remover */}
      {modal && modal.slot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}
          onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 360, boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${modal.slot.cor}18`, border: `2px solid ${modal.slot.cor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>⚽</div>
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
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: 11, borderRadius: 9, border: '1.5px solid var(--border)', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'var(--font)' }}>
                Fechar
              </button>
              <button onClick={() => { setModal(null); setConfirmRemove({ quadra: quadraId, dia: modal.dia, horario: modal.horario }) }}
                style={{ flex: 1, padding: 11, borderRadius: 9, border: 'none', background: '#fce8e6', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#ea4335', fontFamily: 'var(--font)' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar remoção */}
      {confirmRemove && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 340, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fce8e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>🗑</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Remover horário?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>
              {confirmRemove.dia} · {confirmRemove.horario} ficará disponível novamente.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)}
                style={{ flex: 1, padding: 11, borderRadius: 9, border: '1.5px solid var(--border)', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'var(--font)' }}>
                Cancelar
              </button>
              <button onClick={handleRemove}
                style={{ flex: 1, padding: 11, borderRadius: 9, border: 'none', background: '#ea4335', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'var(--font)' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
