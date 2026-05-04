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

  return (
    <div style={{ padding: '32px 36px', flex: 1, background: '#f8f9fb' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Agenda</h1>
        <p style={{ fontSize: 14, color: '#5f6368' }}>{slotsOcupados} horários ocupados · Clique para gerenciar</p>
      </div>

      {/* Seletor de quadra */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {QUADRAS.map(q => (
          <button key={q.id} onClick={() => setQuadraId(q.id)}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: quadraId === q.id ? q.cor : '#fff', color: quadraId === q.id ? '#fff' : '#5f6368', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: quadraId === q.id ? 'none' : '1px solid #e8eaed', transition: 'all 0.15s' }}>
            {q.nome}
          </button>
        ))}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['#082996','Mensalista'],['#b45309','Avulso'],['#9aa0a6','Espera'],['#f0f0f0','Vago']].map(([cor,label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: cor, border: cor === '#f0f0f0' ? '1px solid #e8eaed' : 'none' }} />
            <span style={{ fontSize: 12, color: '#5f6368' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Grade */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8eaed', overflow: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ minWidth: 600 }}>
          {/* Header dias */}
          <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(6, 1fr)', background: quadraAtual?.cor || '#082996', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ padding: '12px 10px', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>HORÁRIO</div>
            {DIAS.map(d => (
              <div key={d} style={{ padding: '12px 6px', fontSize: 12, color: '#fff', fontWeight: 600, textAlign: 'center' }}>{d}</div>
            ))}
          </div>

          {/* Linhas de horário */}
          {HORARIOS.map((h, hi) => (
            <div key={h} style={{ display: 'grid', gridTemplateColumns: '72px repeat(6, 1fr)', borderTop: '1px solid #e8eaed' }}>
              <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: quadraAtual?.cor || '#082996', background: '#f8f9fb', borderRight: '1px solid #e8eaed', display: 'flex', alignItems: 'center' }}>{h}</div>
              {DIAS.map((dia, di) => {
                const slot = agendaQuadra[dia]?.[h]
                const bg = !slot ? '#fff' : slot.espera ? '#fffbeb' : slot.tipo === 'avulso' ? '#fff8f0' : '#f0f7ff'
                return (
                  <div key={dia}
                    onClick={() => {
                      if (slot) { setModal({ quadra: quadraId, dia, horario: h, slot }) }
                      else { setForm({ grupo: '', tipo: 'mensal', cor: CORES[0] }); setModal({ quadra: quadraId, dia, horario: h, slot: null }) }
                    }}
                    style={{ padding: '6px 4px', cursor: 'pointer', borderLeft: di > 0 ? '1px solid #e8eaed' : 'none', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, transition: 'background 0.1s' }}>
                    {!slot ? (
                      <div style={{ textAlign: 'center', opacity: 0.4 }}>
                        <div style={{ fontSize: 14, color: '#9aa0a6', lineHeight: 1 }}>+</div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: slot.cor, margin: '0 auto 3px' }} />
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>{slot.grupo}</div>
                        <div style={{ fontSize: 9, color: slot.tipo === 'mensal' ? '#082996' : '#b45309', marginTop: 1 }}>{tipoLabel[slot.tipo]}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal adicionar */}
      {modal && !modal.slot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Adicionar reserva</h3>
            <p style={{ fontSize: 13, color: '#5f6368', marginBottom: 20 }}>{quadraAtual?.nome} · {modal.dia} · {modal.horario}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Nome do grupo</label>
                <input value={form.grupo} onChange={e => setForm(f => ({ ...f, grupo: e.target.value }))} placeholder="Ex: Fut Raiz" autoFocus
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e8eaed', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tipo de locação</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['mensal','Mensalista',`R$ ${CONFIG.mensalidadeSociety}/mês`],['avulso','Avulso',`R$ ${CONFIG.valorAvulso}/hora`]].map(([v,l,s]) => (
                    <div key={v} onClick={() => setForm(f => ({ ...f, tipo: v }))}
                      style={{ flex: 1, padding: 12, borderRadius: 8, border: `2px solid ${form.tipo === v ? '#082996' : '#e8eaed'}`, cursor: 'pointer', background: form.tipo === v ? '#e6f8ff' : '#fff' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: form.tipo === v ? '#082996' : '#1a1a1a' }}>{l}</div>
                      <div style={{ fontSize: 12, color: '#9aa0a6' }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Cor</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CORES.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, cor: c }))}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${form.cor === c ? '#1a1a1a' : 'transparent'}` }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 11, borderRadius: 8, border: '1.5px solid #e8eaed', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#5f6368' }}>Cancelar</button>
              <button onClick={handleAdd} disabled={!form.grupo.trim()}
                style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', background: form.grupo.trim() ? '#082996' : '#e8eaed', fontSize: 14, fontWeight: 600, cursor: form.grupo.trim() ? 'pointer' : 'not-allowed', color: form.grupo.trim() ? '#fff' : '#9aa0a6' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver/remover */}
      {modal && modal.slot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: modal.slot.cor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚽</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>{modal.slot.grupo}</div>
                <div style={{ fontSize: 13, color: '#5f6368' }}>{quadraAtual?.nome} · {modal.dia} · {modal.horario}</div>
              </div>
            </div>
            {[['Tipo', tipoLabel[modal.slot.tipo]], ['Valor', tipoValor[modal.slot.tipo]]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 13, color: '#5f6368' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 11, borderRadius: 8, border: '1.5px solid #e8eaed', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#5f6368' }}>Fechar</button>
              <button onClick={() => { setModal(null); setConfirmRemove({ quadra: quadraId, dia: modal.dia, horario: modal.horario }) }}
                style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', background: '#fce8e6', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#ea4335' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar remoção */}
      {confirmRemove && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Remover horário?</h3>
            <p style={{ fontSize: 14, color: '#5f6368', marginBottom: 24 }}>{confirmRemove.dia} · {confirmRemove.horario} ficará vago.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)} style={{ flex: 1, padding: 11, borderRadius: 8, border: '1.5px solid #e8eaed', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#5f6368' }}>Cancelar</button>
              <button onClick={handleRemove} style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', background: '#ea4335', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
