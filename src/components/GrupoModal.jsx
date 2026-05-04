import { useState, useEffect } from 'react'
import { QUADRAS, DIAS, HORARIOS, CONFIG } from '../data'

const TIPOS = [
  { value: 'mensal', label: 'Mensalista', valor: CONFIG.mensalidadeSociety },
  { value: 'avulso', label: 'Avulso',     valor: CONFIG.valorAvulso },
]

export default function GrupoModal({ grupo, onSave, onClose }) {
  const isEdit = !!grupo?.id
  const [form, setForm] = useState({
    nome: '', dia: DIAS[0], horario: HORARIOS[0], quadra: QUADRAS[0].id, tipo: 'mensal', jogadores: 14, ...grupo
  })

  useEffect(() => { if (grupo) setForm(f => ({ ...f, ...grupo })) }, [grupo])

  const valor = TIPOS.find(t => t.value === form.tipo)?.valor || CONFIG.mensalidadeSociety

  const handleSubmit = () => {
    if (!form.nome.trim()) return
    onSave({ ...form, valor, id: grupo?.id || Date.now(), pago: grupo?.pago ?? false, status: grupo?.status ?? 'ativo', responsavel: grupo?.responsavel ?? '' })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 }}>
          {isEdit ? 'Editar grupo' : 'Novo grupo'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nome */}
          <Field label="Nome do grupo">
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Ex: Fut Raiz" autoFocus
              style={inputStyle} />
          </Field>

          {/* Tipo */}
          <Field label="Tipo de locação">
            <div style={{ display: 'flex', gap: 8 }}>
              {TIPOS.map(t => (
                <button key={t.value} onClick={() => setForm(f => ({ ...f, tipo: t.value }))}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.tipo === t.value ? '#082996' : '#e8eaed'}`, background: form.tipo === t.value ? '#e6f8ff' : '#fff', cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: form.tipo === t.value ? '#082996' : '#1a1a1a' }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: '#9aa0a6' }}>R$ {t.valor.toLocaleString('pt-BR')}{t.value === 'mensal' ? '/mês' : '/hora'}</div>
                </button>
              ))}
            </div>
          </Field>

          {/* Quadra */}
          <Field label="Quadra">
            <select value={form.quadra} onChange={e => setForm(f => ({ ...f, quadra: e.target.value }))} style={inputStyle}>
              {QUADRAS.map(q => <option key={q.id} value={q.id}>{q.nome}</option>)}
            </select>
          </Field>

          {/* Dia + Horário */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Dia">
              <select value={form.dia} onChange={e => setForm(f => ({ ...f, dia: e.target.value }))} style={inputStyle}>
                {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Horário">
              <select value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} style={inputStyle}>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </Field>
          </div>

          {/* Jogadores */}
          <Field label="Número de jogadores">
            <input type="number" value={form.jogadores} min={1} max={30}
              onChange={e => setForm(f => ({ ...f, jogadores: +e.target.value }))}
              style={inputStyle} />
          </Field>

          {/* Valor calculado */}
          <div style={{ background: '#e6f8ff', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#082996' }}>Valor {form.tipo === 'mensal' ? 'mensal' : 'por hora'}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#082996' }}>R$ {valor.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', borderRadius: 8, border: '1.5px solid #e8eaed', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#5f6368' }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!form.nome.trim()}
            style={{ flex: 1, padding: '11px', borderRadius: 8, border: 'none', background: form.nome.trim() ? '#082996' : '#e8eaed', fontSize: 14, fontWeight: 600, cursor: form.nome.trim() ? 'pointer' : 'not-allowed', color: form.nome.trim() ? '#fff' : '#9aa0a6' }}>
            {isEdit ? 'Salvar' : 'Criar grupo'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1.5px solid #e8eaed', fontSize: 14, color: '#1a1a1a',
  outline: 'none', background: '#fff', boxSizing: 'border-box'
}
