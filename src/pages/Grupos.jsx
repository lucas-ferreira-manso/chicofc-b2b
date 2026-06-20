import { useState } from 'react'
import { useGrupos } from '../components/useGrupos'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'

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
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Grupos</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{grupos.length} grupos cadastrados</p>
          </div>
          <button onClick={() => setModalGrupo({})}
            style={{
              padding: '10px 20px', borderRadius: 10, background: 'var(--blue)',
              color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,41,150,0.3)',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Novo grupo
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { label: 'Total', value: grupos.length, color: '#082996', bg: '#e8f0ff' },
            { label: 'Pagos', value: counts.pago, color: '#0d7a3e', bg: '#e6f4ea' },
            { label: 'Pendentes', value: counts.pendente, color: '#ea4335', bg: '#fce8e6' },
            { label: 'Em espera', value: counts.espera, color: '#b45309', bg: '#fef7e0' },
          ].map(c => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '18px 20px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: c.color,
              }}>
                {c.value}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>grupos</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-layout">
          {/* Coluna esquerda */}
          <div style={{ minWidth: 0 }}>
            {/* Search + filtros */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '16px 20px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', gap: 12, alignItems: 'center',
              marginBottom: 16, flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--text-3)' }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar grupo pelo nome..."
                  style={{
                    width: '100%', padding: '9px 14px 9px 38px',
                    borderRadius: 9, border: '1.5px solid var(--border)',
                    fontSize: 13, outline: 'none', background: '#fafafa',
                    boxSizing: 'border-box', fontFamily: 'var(--font)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6, background: '#f2f4f8', borderRadius: 9, padding: 4 }}>
                {FILTROS.map(({ val, label }) => (
                  <button key={val} onClick={() => setFiltro(val)}
                    style={{
                      padding: '6px 14px', borderRadius: 7, border: 'none',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      background: filtro === val ? '#082996' : 'transparent',
                      color: filtro === val ? '#fff' : 'var(--text-2)',
                      transition: 'all 0.15s',
                    }}>
                    {label}
                    <span style={{
                      marginLeft: 5, fontSize: 10,
                      opacity: filtro === val ? 0.8 : 0.5,
                    }}>{counts[val]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '56px 20px',
                  color: 'var(--text-3)', fontSize: 14,
                  background: '#fff', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                  Nenhum grupo encontrado para esta busca
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
          </div>{/* fim coluna esquerda */}

          {/* Painel direito */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Ação rápida */}
            <div style={{
              background: 'linear-gradient(135deg, #082996 0%, #1a3fbe 100%)',
              borderRadius: 'var(--radius)', padding: '22px',
              boxShadow: '0 4px 20px rgba(8,41,150,0.25)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Novo grupo</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16, lineHeight: 1.5 }}>
                Cadastre mensalistas ou grupos avulsos na 9E10
              </div>
              <button onClick={() => setModalGrupo({})}
                style={{
                  width: '100%', padding: '10px', borderRadius: 9,
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}>
                + Adicionar grupo
              </button>
            </div>

            {/* Status breakdown */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Distribuição</div>
              {[
                { label: 'Mensalistas', count: grupos.filter(g => g.tipo === 'mensal').length, color: '#082996', bg: '#e8f0ff' },
                { label: 'Avulsos', count: grupos.filter(g => g.tipo === 'avulso').length, color: '#b45309', bg: '#fef7e0' },
                { label: 'Em espera', count: counts.espera, color: '#9aa0a6', bg: '#f3f4f6' },
              ].map(({ label, count, color, bg }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${grupos.length > 0 ? Math.round((count / grupos.length) * 100) : 0}%`,
                      background: color, borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Grupos pendentes */}
            {counts.pendente > 0 && (
              <div style={{
                background: '#fff', borderRadius: 'var(--radius)',
                padding: '20px 22px', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
                  Pagamentos pendentes
                  <span style={{ marginLeft: 8, fontSize: 11, background: '#fce8e6', color: '#ea4335', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{counts.pendente}</span>
                </div>
                {grupos.filter(g => !g.pago && g.status === 'ativo').slice(0, 4).map(g => (
                  <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{g.nome}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ea4335' }}>R$ {g.valor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>{/* fim dash-layout */}
      </div>
    </div>
  )
}
