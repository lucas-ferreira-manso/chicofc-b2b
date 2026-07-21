import { useState } from 'react'
import { useGrupos } from '../components/useGrupos'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'

const FILTROS = [
  { val: 'todos', label: 'Todos' },
  { val: 'pago', label: 'Pagos' },
  { val: 'pendente', label: 'Pendentes' },
  { val: 'espera', label: 'Espera' },
]

export default function Grupos() {
  const { grupos, togglePago, cobrar, salvarGrupo, excluir } = useGrupos()
  const [search, setSearch] = useState('')
  const [modalGrupo, setModalGrupo] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const filtered = grupos.filter(g => {
    const matchSearch = g.nome.toLowerCase().includes(search.toLowerCase())
    const matchFiltro =
      filtro === 'todos' ||
      (filtro === 'pago' && g.pago) ||
      (filtro === 'pendente' && !g.pago && g.status === 'ativo') ||
      (filtro === 'espera' && g.status === 'espera')
    return matchSearch && matchFiltro
  })

  const counts = {
    todos: grupos.length,
    pago: grupos.filter(g => g.pago).length,
    pendente: grupos.filter(g => !g.pago && g.status === 'ativo').length,
    espera: grupos.filter(g => g.status === 'espera').length,
  }

  const handleExcluir = (grupo) => {
    if (window.confirm(`Excluir "${grupo.nome}"?${!grupo.pago ? '\n\n⚠️ Pagamento pendente. Responsável será notificado.' : ''}`)) {
      excluir(grupo.id)
    }
  }

  const stats = [
    { label: 'Total', value: grupos.length, color: 'var(--blue)', bg: 'var(--accent)' },
    { label: 'Pagos', value: counts.pago, color: 'var(--green-dark)', bg: 'var(--green-bg)' },
    { label: 'Pendentes', value: counts.pendente, color: 'var(--red)', bg: 'var(--red-bg)' },
    { label: 'Em espera', value: counts.espera, color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
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
            <h1 className="page-title">Grupos</h1>
            <p className="page-subtitle">{grupos.length} grupos cadastrados</p>
          </div>
          <button onClick={() => setModalGrupo({})} className="btn btn-primary">
            <Plus size={16} weight="bold" /> Novo grupo
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {stats.map(c => (
            <div key={c.label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="icon-tile" style={{
                width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: c.bg,
                fontSize: 20, fontWeight: 700, color: c.color,
              }}>
                {c.value}
              </div>
              <div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>grupos</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filtros */}
        <div className="card" style={{
          padding: '16px 20px',
          display: 'flex', gap: 12, alignItems: 'center',
          marginBottom: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <MagnifyingGlass size={16} weight="regular" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar grupo pelo nome..."
              className="input"
              style={{ paddingLeft: 38, background: 'var(--surface-alt)' }}
            />
          </div>
          <div className="pill-tabs">
            {FILTROS.map(({ val, label }) => (
              <button key={val} onClick={() => setFiltro(val)}
                className={`pill-tab ${filtro === val ? 'active' : ''}`}>
                {label}
                <span style={{ marginLeft: 5, fontSize: 10, opacity: filtro === val ? 0.8 : 0.55 }}>{counts[val]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{
              textAlign: 'center', padding: '56px 20px',
              color: 'var(--text-3)', fontSize: 14,
            }}>
              <MagnifyingGlass size={30} weight="regular" style={{ marginBottom: 10 }} />
              <div>Nenhum grupo encontrado para esta busca</div>
            </div>
          ) : filtered.map(g => (
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
  )
}
