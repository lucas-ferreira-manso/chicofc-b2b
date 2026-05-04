import { useState } from 'react'
import { NOTIFICACOES, HISTORICO_MENSAL, CONFIG } from '../data'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { useGrupos } from '../components/useGrupos'

const PERIODOS = [1, 2, 3, 4, 5, 6, 12]

export default function Dashboard() {
  const { grupos, togglePago, cobrar, salvarGrupo, excluir, totalRecebido, totalPendente, totalEsperado, metaMensal } = useGrupos()
  const [periodo, setPeriodo] = useState(6)
  const [modalGrupo, setModalGrupo] = useState(null) // null=fechado, {}=novo, grupo=editar
  const [metaInput, setMetaInput] = useState(CONFIG.metaAnual)
  const [editandoMeta, setEditandoMeta] = useState(false)

  const gruposAtivos = grupos.filter(g => g.status === 'ativo')
  const metaMensalCalc = Math.round(metaInput / 12)
  const pctMeta = Math.min(Math.round((totalRecebido / metaMensalCalc) * 100), 100)
  const falta = Math.max(metaMensalCalc - totalRecebido, 0)

  // Dados do gráfico filtrados pelo período
  const dadosGrafico = HISTORICO_MENSAL.slice(-periodo)
  const maxVal = Math.max(...dadosGrafico.map(d => d.total))

  const handleExcluir = (grupo) => {
    if (window.confirm(`Excluir o grupo "${grupo.nome}"?${!grupo.pago ? '\n\n⚠️ Há pagamento pendente. O responsável será notificado via WhatsApp.' : ''}`)) {
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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Bom dia, 9E10! 👋</h1>
          <p style={{ fontSize: 14, color: '#5f6368' }}>Maio de 2025 · Semana em andamento</p>
        </div>
        <button onClick={() => setModalGrupo({})}
          style={{ padding: '10px 20px', borderRadius: 8, background: '#082996', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          + Novo grupo
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Recebido — Maio', value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g => g.pago && g.status === 'ativo').length} grupos`, color: '#0d7a3e', bg: '#e6f4ea', icon: '💰' },
          { label: 'Pendente — Maio', value: `R$ ${totalPendente.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g => !g.pago && g.status === 'ativo').length} grupos`, color: '#ea4335', bg: '#fce8e6', icon: '⏳' },
          { label: 'Grupos ativos', value: gruposAtivos.length, sub: `Potencial R$ ${totalEsperado.toLocaleString('pt-BR')}/mês`, color: '#082996', bg: '#e6f8ff', icon: '⚽' },
          { label: 'Ocupação society', value: `${Math.round((gruposAtivos.filter(g=>g.quadra==='society').length/24)*100)}%`, sub: `${gruposAtivos.filter(g=>g.quadra==='society').length} de 24 horários`, color: '#b45309', bg: '#fef7e0', icon: '📊' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: '#5f6368', fontWeight: 500, marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 4 }}>{c.sub}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20 }}>

        {/* Gráfico evolução financeira */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>Evolução financeira</h2>
              <p style={{ fontSize: 12, color: '#5f6368' }}>Total · Mensalista · Avulso</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {PERIODOS.map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: periodo === p ? '#082996' : '#f8f9fb', color: periodo === p ? '#fff' : '#5f6368' }}>
                  {p}m
                </button>
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[['#082996','Total'],['#66d1ff','Mensalista'],['#34a853','Avulso']].map(([cor,label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: cor }} />
                <span style={{ fontSize: 12, color: '#5f6368' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Barras agrupadas */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
            {dadosGrafico.map((d, i) => {
              const isLast = i === dadosGrafico.length - 1
              const hTotal = Math.round((d.total / maxVal) * 140)
              const hMensal = Math.round((d.mensal / maxVal) * 140)
              const hAvulso = Math.round((d.avulso / maxVal) * 140)
              return (
                <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {isLast && <span style={{ fontSize: 10, color: '#082996', fontWeight: 600 }}>R${(d.total/1000).toFixed(1)}k</span>}
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 140 }}>
                    <div style={{ flex: 1, height: hTotal, background: isLast ? '#082996' : '#e6f8ff', borderRadius: '3px 3px 0 0', transition: 'height 0.5s' }} />
                    <div style={{ flex: 1, height: hMensal, background: isLast ? '#66d1ff' : '#dbeafe', borderRadius: '3px 3px 0 0', transition: 'height 0.5s' }} />
                    <div style={{ flex: 1, height: hAvulso, background: isLast ? '#34a853' : '#dcfce7', borderRadius: '3px 3px 0 0', transition: 'height 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 10, color: isLast ? '#082996' : '#9aa0a6', fontWeight: isLast ? 600 : 400 }}>
                    {d.mes.split('/')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Meta + Notificações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Meta anual */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Meta mensal</h2>
              <button onClick={() => setEditandoMeta(e => !e)}
                style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: '#f8f9fb', border: '1px solid #e8eaed', cursor: 'pointer', color: '#5f6368' }}>
                {editandoMeta ? 'OK' : 'Editar'}
              </button>
            </div>
            {editandoMeta ? (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#5f6368', display: 'block', marginBottom: 4 }}>META ANUAL (R$)</label>
                <input type="number" value={metaInput} onChange={e => setMetaInput(+e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #082996', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ fontSize: 11, color: '#9aa0a6', marginTop: 4 }}>Meta mensal: R$ {metaMensalCalc.toLocaleString('pt-BR')}</p>
              </div>
            ) : (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#5f6368' }}>R$ {totalRecebido.toLocaleString('pt-BR')} de R$ {metaMensalCalc.toLocaleString('pt-BR')}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pctMeta >= 100 ? '#0d7a3e' : '#082996' }}>{pctMeta}%</span>
                </div>
                <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pctMeta}%`, background: pctMeta >= 100 ? '#34a853' : '#082996', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            )}
            {falta > 0 ? (
              <p style={{ fontSize: 12, color: '#ea4335' }}>Faltam <strong>R$ {falta.toLocaleString('pt-BR')}</strong> para atingir a meta</p>
            ) : (
              <p style={{ fontSize: 12, color: '#0d7a3e' }}>✅ Meta do mês atingida!</p>
            )}
          </div>

          {/* Notificações */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 14 }}>Notificações</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NOTIFICACOES.map(n => (
                <div key={n.id} style={{ padding: '10px 12px', borderRadius: 8, background: n.urgente ? '#fce8e6' : '#f8f9fb', borderLeft: `3px solid ${n.urgente ? '#ea4335' : '#e8eaed'}` }}>
                  <div style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 3 }}>{n.msg}</div>
                  <div style={{ fontSize: 11, color: '#9aa0a6' }}>há {n.tempo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista grupos */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Grupos mensalistas</h2>
          <button onClick={() => setModalGrupo({})}
            style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8, background: '#e6f8ff', border: 'none', color: '#082996', fontWeight: 600, cursor: 'pointer' }}>
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
  )
}
