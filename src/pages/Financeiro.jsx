import { useGrupos } from '../components/useGrupos'
import GrupoItem from '../components/GrupoItem'
import GrupoModal from '../components/GrupoModal'
import { useState } from 'react'
import { CheckCircle, HourglassMedium, ChartBar, Globe, FileText } from '@phosphor-icons/react'
import { VENUE } from '../data'

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
    const conteudo = `RELATÓRIO FINANCEIRO — ${VENUE.nome}\nMaio de 2025\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\n${'─'.repeat(60)}\n\nRESUMO\nRecebido:  R$ ${totalRecebido.toLocaleString('pt-BR')}\nPendente:  R$ ${totalPendente.toLocaleString('pt-BR')}\nTotal:     R$ ${totalEsperado.toLocaleString('pt-BR')}\nTaxa:      ${pct}%\n\n${'─'.repeat(60)}\n\n${linhas}\n\n${'─'.repeat(60)}\nPivô · Sistema de Gestão de Quadras`
    const blob = new Blob([conteudo], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `relatorio-${VENUE.nome}-maio-2025.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportHTML = () => {
    const rows = gruposAtivos.map(g => `
      <tr>
        <td>${g.nome}</td>
        <td>${g.tipo === 'mensal' ? 'Mensalista' : 'Avulso'}</td>
        <td>${g.dia} · ${g.horario}</td>
        <td>R$ ${g.valor.toLocaleString('pt-BR')}</td>
        <td style="color:${g.pago ? '#0f7a38' : '#dc2626'};font-weight:600">${g.pago ? 'Pago' : 'Pendente'}</td>
      </tr>`).join('')
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório ${VENUE.nome} - Maio 2025</title>
    <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a}
    h1{font-size:24px;margin-bottom:4px}p{color:#6b7280;margin-bottom:24px}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
    .stat{background:#f5f6f8;border-radius:10px;padding:16px}.stat-label{font-size:12px;color:#6b7280;margin-bottom:4px}
    .stat-value{font-size:22px;font-weight:700}table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:10px 12px;font-size:12px;color:#6b7280;border-bottom:2px solid #e7e8ec;text-transform:uppercase}
    td{padding:12px;border-bottom:1px solid #f0f1f4;font-size:14px}
    .progress{height:8px;background:#f0f1f4;border-radius:4px;margin-top:8px}
    .bar{height:100%;background:#0b2a7a;border-radius:4px;width:${pct}%}
    footer{margin-top:40px;font-size:12px;color:#9aa1ac;text-align:center}</style></head>
    <body><h1>Relatório Financeiro — ${VENUE.nome}</h1><p>Maio de 2025 · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
    <div class="stats">
      <div class="stat"><div class="stat-label">Recebido</div><div class="stat-value" style="color:#0f7a38">R$ ${totalRecebido.toLocaleString('pt-BR')}</div></div>
      <div class="stat"><div class="stat-label">Pendente</div><div class="stat-value" style="color:#dc2626">R$ ${totalPendente.toLocaleString('pt-BR')}</div></div>
      <div class="stat"><div class="stat-label">Arrecadado</div><div class="stat-value" style="color:#0b2a7a">${pct}%</div><div class="progress"><div class="bar"></div></div></div>
    </div>
    <table><thead><tr><th>Grupo</th><th>Tipo</th><th>Horário</th><th>Valor</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <footer>Pivô · Sistema de Gestão de Quadras</footer></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `relatorio-${VENUE.nome}-maio-2025.html`; a.click()
    URL.revokeObjectURL(url)
  }

  const kpis = [
    { label: 'Recebido', value: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>g.pago&&g.status==='ativo').length} grupos`, color: 'var(--green-dark)', Icon: CheckCircle },
    { label: 'Pendente', value: `R$ ${totalPendente.toLocaleString('pt-BR')}`, sub: `${grupos.filter(g=>!g.pago&&g.status==='ativo').length} grupos`, color: 'var(--red)', Icon: HourglassMedium },
    { label: 'Total esperado', value: `R$ ${totalEsperado.toLocaleString('pt-BR')}`, sub: 'Maio/2025', color: 'var(--text)', Icon: ChartBar },
  ]

  return (
    <div className="page">
      <div className="page-inner">
        {modalGrupo !== null && (
          <GrupoModal grupo={modalGrupo?.id ? modalGrupo : null}
            onSave={(form) => { salvarGrupo(form); setModalGrupo(null) }}
            onClose={() => setModalGrupo(null)} />
        )}

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Financeiro</h1>
            <p className="page-subtitle">Maio de 2025 · Clique no status para atualizar</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={exportHTML} className="btn btn-secondary">
              <Globe size={15} weight="regular" /> Exportar HTML
            </button>
            <button onClick={exportTXT} className="btn btn-primary">
              <FileText size={15} weight="regular" /> Exportar TXT
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid-3" style={{ marginBottom: 20 }}>
          {kpis.map(c => (
            <div key={c.label} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 7 }}>{c.label}</div>
                  <div style={{ fontSize: 25, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                </div>
                <c.Icon size={20} weight="regular" color="var(--text-3)" />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Barra progresso */}
        <div className="card" style={{ padding: '22px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Progresso de cobrança — Maio/25</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                R$ {totalRecebido.toLocaleString('pt-BR')} de R$ {totalEsperado.toLocaleString('pt-BR')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: pct >= 80 ? 'var(--green-dark)' : 'var(--blue)', lineHeight: 1, letterSpacing: '-0.02em' }}>{pct}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>arrecadado</div>
            </div>
          </div>
          <div className="progress-track" style={{ height: 10 }}>
            <div className="progress-bar" style={{
              width: `${pct}%`,
              background: pct >= 100 ? 'var(--green)' : 'var(--blue)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>0%</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>100%</span>
          </div>
        </div>

        {/* Lista grupos */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Detalhamento por grupo</h2>
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
    </div>
  )
}
