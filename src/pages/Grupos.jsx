import { useState } from 'react'
import { useGrupos } from '../components/useGrupos'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'

export default function Grupos() {
  const { grupos, togglePago, cobrar, salvarGrupo, excluir } = useGrupos()
  const [search, setSearch] = useState('')
  const [modalGrupo, setModalGrupo] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const filtered = grupos.filter(g => {
    const matchSearch = g.nome.toLowerCase().includes(search.toLowerCase())
    const matchFiltro = filtro === 'todos' || (filtro === 'pago' && g.pago) || (filtro === 'pendente' && !g.pago && g.status === 'ativo') || (filtro === 'espera' && g.status === 'espera')
    return matchSearch && matchFiltro
  })

  const handleExcluir = (grupo) => {
    if (window.confirm(`Excluir "${grupo.nome}"?${!grupo.pago ? '\n\n⚠️ Pagamento pendente. Responsável será notificado.' : ''}`)) {
      excluir(grupo.id)
    }
  }

  return (
    <div style={{ padding: '32px 36px', flex: 1, background: '#f8f9fb' }}>
      {modalGrupo !== null && (
        <GrupoModal
          grupo={modalGrupo?.id ? modalGrupo : null}
          onSave={(form) => { salvarGrupo(form); setModalGrupo(null) }}
          onClose={() => setModalGrupo(null)}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Grupos</h1>
          <p style={{ fontSize: 14, color: '#5f6368' }}>{grupos.length} grupos cadastrados</p>
        </div>
        <button onClick={() => setModalGrupo({})}
          style={{ padding: '10px 20px', borderRadius: 8, background: '#082996', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + Novo grupo
        </button>
      </div>

      {/* Search + filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9aa0a6' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar grupo..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1.5px solid #e8eaed', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['todos','Todos'],['pago','Pagos'],['pendente','Pendentes'],['espera','Espera']].map(([val, label]) => (
            <button key={val} onClick={() => setFiltro(val)}
              style={{ padding: '8px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filtro === val ? '#082996' : '#fff', color: filtro === val ? '#fff' : '#5f6368', border: filtro === val ? 'none' : '1px solid #e8eaed' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9aa0a6', fontSize: 14 }}>
            Nenhum grupo encontrado
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
  )
}
