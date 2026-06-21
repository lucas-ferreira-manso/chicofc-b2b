import { useGrupos } from '../components/useGrupos'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { useState } from 'react'

export default function Financeiro() {
  const { grupos, togglePago, cobrar, salvarGrupo, excluir, totalRecebido, totalPendente, totalEsperado } = useGrupos()
  const [modalGrupo, setModalGrupo] = useState(null)

  const gruposAtivos = grupos.filter(g => g.status === 'ativo')
  const pct = Math.round((totalRecebido / totalEsperado) * 100)

  const handleExcluir = (grupo) => {
    if (window.confirm(`Excluir "${grupo.nome}"?${!grupo.pago ? '\n\n⚠️ Pagamento pendente. Responsável será notificado.' : ''}`)) {
      excluir(grupo.id)
    }
  }

  const exportTXT = () => {
    const linhas = gruposAtivos.map(g =>
      `${g.nome.padEnd(20)} ${g.tipo === 'mensal' ? 'Mensalista' : 'Avulso    '} R$ ${String(g.valor).padStart(6)} ${g.pago ? 'PAGO    ' : 'PENDENTE'}`
    ).join('\n')
    const conteudo = `RELATÓRIO FINANCEIRO — 9E10\nMaio de 2025\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\n${'─'.repeat(60)}\n\nRESUMO\nRecebido:  R$ ${totalRecebido.toLocaleString('pt-BR')}\nPendente:  R$ ${totalPendente.toLocaleString('pt-BR')}\nTotal:     R$ ${totalEsperado.toLocaleString('pt-BR')}\nTaxa:      ${pct}%\n\n${'─'.repeat(60)}\n\n${linhas}\n\n${'─'.repeat(60)}\nChicoFC · Sistema de Gestão de Quadras`
    const blob = new Blob([conteudo], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'relatorio-9E10-maio-2025.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  const exportHTML = () => {
    const rows = gruposAtivos.map(g => `
      <tr>
        <td>${g.nome}</td>
        <td>${g.tipo === 'mensal' ? 'Mensalista' : 'Avulso'}</td>
        <td>${g.dia} · ${g.horario}</td>
        <td>R$ ${g.valor.toLocaleString('pt-BR')}</td>
        <td style="color:${g.pago ? '#0d7a3e' : '#ea4335'};font-weight:600">${g.pago ? 'Pago' : 'Pendente'}</td>
      </tr>`).join('')
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório 9E10 - Maio 2025</title>
    <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a}
    h1{font-size:24px;margin-bottom:4px}p{color:#5f6368;margin-bottom:24px}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
    .stat{background:#f8f9fb;border-radius:10px;padding:16px}.stat-label{font-size:12px;color:#5f6368;margin-bottom:4px}
    .stat-value{font-size:22px;font-weight:700}table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:10px 12px;font-size:12px;color:#5f6368;border-bottom:2px solid #e8eaed;text-transform:uppercase}
    td{padding:12px;border-bottom:1px solid #f0f0f0;font-size:14px}
    .progress{height:8px;background:#f0f0f0;border-radius:4px;margin-top:8px}
    .bar{height:100%;background:#082996;border-radius:4px;width:${pct}%}
    footer{margin-top:40px;font-size:12px;color:#9aa0a6;text-align:center}</style></head>
    <body><h1>Relatório Financeiro — 9E10</h1><p>Maio de 2025 · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
    <div class="stats">
      <div class="stat"><div class="stat-label">Recebido</div><div class="stat-value" style="color:#0d7a3e">R$ ${totalRecebido.toLocaleString('pt-BR')}</div></div>
      <div class="stat"><div class="stat-label">Pendente</div><div class="stat-value" style="color:#ea4335">R$ ${totalPendente.toLocaleString('pt-BR')}</div></div>
      <div class="stat"><div class="stat-label">Arrecadado</div><div class="stat-value" style="color:#082996">${pct}%</div><div class="progress"><div class="bar"></div></div></div>
    </div>
    <table><thead><tr><th>Grupo</th><th>Tipo</th><th>Horário</th><th>Valor</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <footer>ChicoFC · Sistema de Gestão de Quadras</footer></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'relatorio-9E10-maio-2025.html'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div className="page-inner">
        {modalGrupo !== null && (
          <GrupoModal grupo={modalGrupo?.id ? modalGrupo : null}
            onSave={(form) => { salvarGrupo(form); setModalGrupo(null) }}
            onClose={() => setModalGrupo(null)} />
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Financeiro</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Maio de 2025 · Clique no status para atualizar</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={exportHTML}
              style={{ padding: '9px 16px', borderRadius: 9, background: '#fff', color: '#082996', border: '1.5px solid var(--border)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🌐 Exportar HTML
            </button>
            <button onClick={exportTXT}
              style={{ padding: '9px 16px', borderRadius: 9, background: 'var(--blue)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,41,150,0.3)' }}>
              📄 Exportar TXT
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid-3" style={{ marginBottom: 20 }}>
          {[
            { label: 'Recebido', value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>g.pago&&g.status==='ativo').length} grupos`, color: '#0d7a3e', bg: '#e6f4ea', icon: '✅' },
            { label: 'Pendente', value: `R$ ${totalPendente.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>!g.pago&&g.status==='ativo').length} grupos`, color: '#ea4335', bg: '#fce8e6', icon: '⏳' },
            { label: 'Total esperado', value: `R$ ${totalEsperado.toLocaleString('pt-BR')}`, sub: 'Maio/2025', color: '#082996', bg: '#e8f0ff', icon: '📊' },
          ].map(c => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 24px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.icon}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Barra progresso */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          padding: '22px 24px', border: '1px solid var(--border)',
          marginBottom: 20, boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Progresso de cobrança — Maio/25</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                R$ {totalRecebido.toLocaleString('pt-BR')} de R$ {totalEsperado.toLocaleString('pt-BR')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: pct >= 80 ? '#0d7a3e' : 'var(--blue)', lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>arrecadado</div>
            </div>
          </div>
          <div style={{ height: 10, background: '#f0f2f5', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: pct >= 100 ? 'linear-gradient(90deg, #34a853, #0d7a3e)' : 'linear-gradient(90deg, #082996, #1a3fbe)',
              borderRadius: 5, transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>0%</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>100%</span>
          </div>
        </div>

        <div className="dash-layout">
          {/* Coluna esquerda */}
          <div style={{ minWidth: 0 }}>
            {/* Lista grupos */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 24px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Detalhamento por grupo</h2>
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
          </div>{/* fim coluna esquerda */}

          {/* Painel direito */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Resumo cobranças */}
            <div style={{
              background: 'linear-gradient(135deg, #082996 0%, #1a3fbe 100%)',
              borderRadius: 'var(--radius)', padding: '22px',
              boxShadow: '0 4px 20px rgba(8,41,150,0.25)',
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Total esperado</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                R$ {totalEsperado.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>Maio de 2025</div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#66d1ff', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Recebido: R$ {totalRecebido.toLocaleString('pt-BR')}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{pct}%</span>
              </div>
            </div>

            {/* Pendentes */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
                A receber
                <span style={{ marginLeft: 8, fontSize: 11, background: '#fce8e6', color: '#ea4335', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                  {grupos.filter(g => !g.pago && g.status === 'ativo').length}
                </span>
              </div>
              {grupos.filter(g => !g.pago && g.status === 'ativo').map(g => (
                <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{g.nome}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{g.dia} · {g.horario}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ea4335' }}>R$ {g.valor}</div>
                    <button onClick={() => cobrar(g.id)}
                      style={{ fontSize: 10, background: '#fce8e6', color: '#ea4335', border: 'none', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontWeight: 600, marginTop: 2 }}>
                      Cobrar
                    </button>
                  </div>
                </div>
              ))}
              {grupos.filter(g => !g.pago && g.status === 'ativo').length === 0 && (
                <div style={{ fontSize: 13, color: '#0d7a3e', fontWeight: 600, textAlign: 'center', padding: '16px 0' }}>
                  Todos pagos! ✅
                </div>
              )}
            </div>

          </div>
        </div>{/* fim dash-layout */}
      </div>
    </div>
  )
}
