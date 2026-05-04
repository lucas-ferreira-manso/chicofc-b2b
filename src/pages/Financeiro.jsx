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
    <div style={{ padding: '32px 36px', flex: 1, background: '#f8f9fb' }}>
      {modalGrupo !== null && (
        <GrupoModal grupo={modalGrupo?.id ? modalGrupo : null}
          onSave={(form) => { salvarGrupo(form); setModalGrupo(null) }}
          onClose={() => setModalGrupo(null)} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Financeiro</h1>
          <p style={{ fontSize: 14, color: '#5f6368' }}>Maio de 2025 · Clique no status para atualizar</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportHTML} style={{ padding: '10px 16px', borderRadius: 8, background: '#e6f8ff', color: '#082996', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            🌐 HTML
          </button>
          <button onClick={exportTXT} style={{ padding: '10px 16px', borderRadius: 8, background: '#082996', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            📄 TXT
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Recebido', value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>g.pago&&g.status==='ativo').length} grupos`, color: '#0d7a3e', bg: '#e6f4ea', icon: '✅' },
          { label: 'Pendente', value: `R$ ${totalPendente.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>!g.pago&&g.status==='ativo').length} grupos`, color: '#ea4335', bg: '#fce8e6', icon: '⏳' },
          { label: 'Total esperado', value: `R$ ${totalEsperado.toLocaleString('pt-BR')}`, sub: 'Maio/2025', color: '#082996', bg: '#e6f8ff', icon: '📊' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: '#5f6368', fontWeight: 500, marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 4 }}>{c.sub}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra progresso */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8eaed', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Progresso de cobrança — Maio/25</span>
          <span style={{ fontSize: 13, color: '#5f6368' }}>{pct}% arrecadado</span>
        </div>
        <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#082996', borderRadius: 5, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Lista grupos com componente global */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8eaed', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Detalhamento por grupo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {gruposAtivos.map(g => (
            <GrupoItem key={g.id} grupo={g}
              onTogglePago={togglePago}
              onCobrar={cobrar}
              onEditar={(g) => setModalGrupo(g)}
              onExcluir={(g) => { if (window.confirm(`Excluir "${g.nome}"?`)) excluir(g.id) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
