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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ padding: 28, maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 22, letterSpacing: '-0.02em' }}>
          {isEdit ? 'Editar grupo' : 'Novo grupo'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Nome */}
          <Field label="Nome do grupo">
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Ex: Fut Raiz" autoFocus
              className="input" />
          </Field>

          {/* Tipo */}
          <Field label="Tipo de locação">
            <div style={{ display: 'flex', gap: 8 }}>
              {TIPOS.map(t => (
                <button key={t.value} onClick={() => setForm(f => ({ ...f, tipo: t.value }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'left',
                    border: `1.5px solid ${form.tipo === t.value ? 'var(--blue)' : 'var(--border)'}`,
                    background: form.tipo === t.value ? 'var(--accent)' : 'var(--surface)', cursor: 'pointer',
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: form.tipo === t.value ? 'var(--blue)' : 'var(--text)' }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>R$ {t.valor.toLocaleString('pt-BR')}{t.value === 'mensal' ? '/mês' : '/hora'}</div>
                </button>
              ))}
            </div>
          </Field>

          {/* Quadra */}
          <Field label="Quadra">
            <select value={form.quadra} onChange={e => setForm(f => ({ ...f, quadra: e.target.value }))} className="input">
              {QUADRAS.map(q => <option key={q.id} value={q.id}>{q.nome}</option>)}
            </select>
          </Field>

          {/* Dia + Horário */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Dia">
              <select value={form.dia} onChange={e => setForm(f => ({ ...f, dia: e.target.value }))} className="input">
                {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Horário">
              <select value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} className="input">
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </Field>
          </div>

          {/* Jogadores */}
          <Field label="Número de jogadores">
            <input type="number" value={form.jogadores} min={1} max={30}
              onChange={e => setForm(f => ({ ...f, jogadores: +e.target.value }))}
              className="input" />
          </Field>

          {/* Valor calculado */}
          <div style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>Valor {form.tipo === 'mensal' ? 'mensal' : 'por hora'}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue)' }}>R$ {valor.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!form.nome.trim()} className="btn btn-primary" style={{ flex: 1 }}>
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
      <label className="field-label">{label}</label>
      {children}
    </div>
  )
}
