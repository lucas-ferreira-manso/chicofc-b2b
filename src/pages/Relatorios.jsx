import { useState } from 'react'
import { HISTORICO_MENSAL, CONFIG, VENUE } from '../data'
import { useGrupos } from '../components/useGrupos'
import { HandCoins, CalendarBlank, Lightning, TrendUp, TrendDown, Globe, FileText } from '@phosphor-icons/react'

const PERIODOS = [1, 2, 3, 4, 5, 6, 12]

export default function Relatorios() {
  const [periodo, setPeriodo] = useState(6)
  const { grupos } = useGrupos()
  const dados = HISTORICO_MENSAL.slice(-periodo)
  const maxTotal = Math.max(...dados.map(d => d.total))
  const metaMensal = Math.round(CONFIG.metaAnual / 12)
  const chartMax = Math.max(maxTotal, metaMensal)

  const totalPeriodo = dados.reduce((s, d) => s + d.total, 0)
  const totalMensal = dados.reduce((s, d) => s + d.mensal, 0)
  const totalAvulso = dados.reduce((s, d) => s + d.avulso, 0)
  const crescimento = dados.length > 1
    ? Math.round(((dados[dados.length-1].total - dados[0].total) / dados[0].total) * 100)
    : 0

  const exportRelatorio = (formato) => {
    const periodo_str = `Últimos ${periodo} meses`
    if (formato === 'html') {
      const rows = dados.map(d => `
        <tr>
          <td>${d.mes}</td>
          <td>R$ ${d.mensal.toLocaleString('pt-BR')}</td>
          <td>R$ ${d.avulso.toLocaleString('pt-BR')}</td>
          <td style="font-weight:600">R$ ${d.total.toLocaleString('pt-BR')}</td>
          <td style="color:${d.total>=metaMensal?'#0f7a38':'#dc2626'}">${Math.round((d.total/metaMensal)*100)}%</td>
        </tr>`).join('')
      const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório ${VENUE.nome}</title>
      <style>body{font-family:system-ui,sans-serif;max-width:860px;margin:40px auto;padding:0 20px;color:#1a1a1a}
      h1{font-size:26px;margin:0}p{color:#6b7280;margin-top:4px}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}
      .card{background:#f5f6f8;border-radius:10px;padding:16px}.cl{font-size:12px;color:#6b7280}.cv{font-size:22px;font-weight:700;margin-top:4px}
      table{width:100%;border-collapse:collapse;margin-top:24px}
      th{text-align:left;padding:10px 12px;font-size:12px;color:#6b7280;border-bottom:2px solid #e7e8ec;text-transform:uppercase;letter-spacing:.05em}
      td{padding:12px;border-bottom:1px solid #f0f1f4;font-size:14px}
      footer{margin-top:40px;font-size:12px;color:#9aa1ac;text-align:center;padding-top:20px;border-top:1px solid #f0f1f4}
      </style></head><body>
      <h1>Relatório Financeiro — ${VENUE.nome}</h1>
      <p>${periodo_str} · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      <div class="grid">
        <div class="card"><div class="cl">Receita total</div><div class="cv" style="color:#0b2a7a">R$ ${totalPeriodo.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Mensalistas</div><div class="cv" style="color:#0f7a38">R$ ${totalMensal.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Avulsos</div><div class="cv" style="color:#d97706">R$ ${totalAvulso.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Crescimento</div><div class="cv" style="color:${crescimento>=0?'#0f7a38':'#dc2626'}">${crescimento>=0?'+':''}${crescimento}%</div></div>
      </div>
      <table><thead><tr><th>Mês</th><th>Mensalista</th><th>Avulso</th><th>Total</th><th>vs Meta</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <footer>ChicoFC · Sistema de Gestão de Quadras · Meta mensal: R$ ${metaMensal.toLocaleString('pt-BR')}</footer>
      </body></html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `relatorio-${VENUE.nome}-${periodo}m.html`; a.click()
    } else {
      const linhas = dados.map(d =>
        `${d.mes}   Mensal: R$${d.mensal.toLocaleString('pt-BR').padStart(8)}   Avulso: R$${d.avulso.toLocaleString('pt-BR').padStart(6)}   Total: R$${d.total.toLocaleString('pt-BR').padStart(8)}   ${Math.round((d.total/metaMensal)*100)}% da meta`
      ).join('\n')
      const txt = `RELATÓRIO FINANCEIRO — ${VENUE.nome}\n${periodo_str}\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\n${'─'.repeat(70)}\n\nResumo\nReceita total: R$ ${totalPeriodo.toLocaleString('pt-BR')}\nMensalistas:   R$ ${totalMensal.toLocaleString('pt-BR')}\nAvulsos:       R$ ${totalAvulso.toLocaleString('pt-BR')}\nCrescimento:   ${crescimento>=0?'+':''}${crescimento}%\n\n${'─'.repeat(70)}\n\n${linhas}\n\n${'─'.repeat(70)}\nMeta mensal: R$ ${metaMensal.toLocaleString('pt-BR')}\nChicoFC · Sistema de Gestão de Quadras`
      const blob = new Blob([txt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `relatorio-${VENUE.nome}-${periodo}m.txt`; a.click()
    }
  }

  const kpis = [
    { label: 'Receita total', value: `R$ ${totalPeriodo.toLocaleString('pt-BR')}`, color: 'var(--text)', Icon: HandCoins },
    { label: 'Mensalistas', value: `R$ ${totalMensal.toLocaleString('pt-BR')}`, color: 'var(--text)', Icon: CalendarBlank },
    { label: 'Avulsos', value: `R$ ${totalAvulso.toLocaleString('pt-BR')}`, color: 'var(--text)', Icon: Lightning },
    { label: 'Crescimento', value: `${crescimento >= 0 ? '+' : ''}${crescimento}%`, color: crescimento >= 0 ? 'var(--green-dark)' : 'var(--red)', Icon: crescimento >= 0 ? TrendUp : TrendDown },
  ]

  return (
    <div className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Relatórios</h1>
            <p className="page-subtitle">Análise financeira da {VENUE.nome}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)', background: 'var(--surface)', padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontWeight: 500 }}>
              Últimos {periodo} {periodo === 1 ? 'mês' : 'meses'}
            </div>
            <button onClick={() => exportRelatorio('html')} className="btn btn-secondary">
              <Globe size={15} weight="regular" /> HTML
            </button>
            <button onClick={() => exportRelatorio('txt')} className="btn btn-primary">
              <FileText size={15} weight="regular" /> TXT
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {kpis.map(c => (
            <div key={c.label} className="card card-pad">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 7 }}>{c.label}</div>
                  <div style={{ fontSize: 21, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                </div>
                <c.Icon size={20} weight="regular" color="var(--text-3)" />
              </div>
            </div>
          ))}
        </div>

        {/* Seletor de período */}
        <div className="card" style={{
          padding: '16px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span className="eyebrow">Período</span>
          <div className="pill-tabs">
            {PERIODOS.map(p => (
              <button key={p} onClick={() => setPeriodo(p)}
                className={`pill-tab ${periodo === p ? 'active' : ''}`}>
                {p} {p === 1 ? 'mês' : 'meses'}
              </button>
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          {/* Barras */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div>
              <h2 className="section-title">Receita mensal</h2>
              <p className="section-subtitle">Total por mês — linha de meta</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, position: 'relative', marginTop: 'auto', paddingTop: 28 }}>
              <div style={{
                position: 'absolute',
                bottom: Math.round((metaMensal / chartMax) * 160) + 20,
                left: 0, right: 0,
                borderTop: '2px dashed var(--red)',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ fontSize: 10, color: 'var(--red)', background: 'var(--surface)', padding: '0 4px', marginLeft: 4, fontWeight: 600 }}>
                  Meta R${(metaMensal/1000).toFixed(1)}k
                </span>
              </div>
              {dados.map((d, i) => {
                const isLast = i === dados.length - 1
                const hTotal = Math.round((d.total / chartMax) * 160)
                return (
                  <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 10, color: isLast ? 'var(--blue)' : 'var(--text-3)', fontWeight: 700 }}>
                      R${(d.total/1000).toFixed(1)}k
                    </div>
                    <div style={{
                      width: '100%', height: hTotal,
                      background: isLast ? 'var(--blue)' : '#dbe4ff',
                      borderRadius: '5px 5px 0 0',
                      transition: 'height 0.5s ease',
                      border: d.total >= metaMensal ? '2px solid var(--green)' : 'none',
                      boxSizing: 'border-box',
                    }} />
                    <div style={{ fontSize: 10, color: isLast ? 'var(--blue)' : 'var(--text-3)', fontWeight: isLast ? 700 : 500 }}>
                      {d.mes.split('/')[0]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Composição */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="section-title">Composição da receita</h2>
            <p className="section-subtitle" style={{ marginBottom: 20 }}>Mensalista vs Avulso por mês</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dados.map((d, i) => {
                const isLast = i === dados.length - 1
                const pctMensal = Math.round((d.mensal / d.total) * 100)
                const pctAvulso = 100 - pctMensal
                return (
                  <div key={d.mes} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: isLast ? 'var(--blue)' : 'var(--text-3)', width: 42, flexShrink: 0, fontWeight: isLast ? 700 : 500 }}>
                      {d.mes.split('/')[0]}
                    </span>
                    <div style={{ flex: 1, height: 22, borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                      <div style={{
                        width: `${pctMensal}%`,
                        background: isLast ? 'var(--blue)' : '#dbe4ff',
                        transition: 'width 0.5s ease',
                        display: 'flex', alignItems: 'center', paddingLeft: 6,
                      }}>
                        {pctMensal > 20 && <span style={{ fontSize: 10, color: isLast ? '#fff' : 'var(--blue)', fontWeight: 700 }}>{pctMensal}%</span>}
                      </div>
                      <div style={{
                        flex: 1,
                        background: isLast ? 'var(--green)' : '#bbf7d0',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                      }}>
                        {pctAvulso > 10 && <span style={{ fontSize: 10, color: isLast ? '#fff' : 'var(--green-dark)', fontWeight: 700 }}>{pctAvulso}%</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: isLast ? 'var(--blue)' : 'var(--text-3)', fontWeight: isLast ? 700 : 500, width: 48, textAlign: 'right', flexShrink: 0 }}>
                      R${(d.total/1000).toFixed(1)}k
                    </span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              {[['var(--blue)','Mensalista'],['var(--green)','Avulso']].map(([cor,label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: cor }} />
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="section-title">Detalhamento mensal</h2>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Últimos {periodo} {periodo === 1 ? 'mês' : 'meses'}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-alt)' }}>
                  {['Mês', 'Mensalista', 'Avulso', 'Total', 'vs Meta', 'Tendência'].map(h => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                      borderBottom: '1px solid var(--border)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => {
                  const isLast = i === dados.length - 1
                  const pctMeta = Math.round((d.total / metaMensal) * 100)
                  const prev = dados[i - 1]
                  const TendIcon = prev ? (d.total >= prev.total ? TrendUp : TrendDown) : null
                  const tendColor = prev ? (d.total >= prev.total ? 'var(--green-dark)' : 'var(--red)') : 'var(--text-3)'
                  return (
                    <tr key={d.mes} style={{
                      borderBottom: '1px solid var(--border-light)',
                      background: isLast ? 'var(--accent)' : 'transparent',
                    }}>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--blue)' : 'var(--text)' }}>{d.mes}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--text)' }}>R$ {d.mensal.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--text)' }}>R$ {d.avulso.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: isLast ? 'var(--blue)' : 'var(--text)' }}>R$ {d.total.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px' }}>
                        <span className="badge" style={{
                          background: pctMeta >= 100 ? 'var(--green-bg)' : 'var(--red-bg)',
                          color: pctMeta >= 100 ? 'var(--green-dark)' : 'var(--red)',
                        }}>{pctMeta}%</span>
                      </td>
                      <td style={{ padding: '13px 20px', color: tendColor }}>{TendIcon && <TendIcon size={16} weight="bold" />}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
