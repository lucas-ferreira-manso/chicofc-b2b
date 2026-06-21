import { useState } from 'react'
import { HISTORICO_MENSAL, CONFIG } from '../data'
import { useGrupos } from '../components/useGrupos'

const PERIODOS = [1, 2, 3, 4, 5, 6, 12]

export default function Relatorios() {
  const [periodo, setPeriodo] = useState(6)
  const { grupos } = useGrupos()
  const dados = HISTORICO_MENSAL.slice(-periodo)
  const maxTotal = Math.max(...dados.map(d => d.total))
  const metaMensal = Math.round(CONFIG.metaAnual / 12)

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
          <td style="color:${d.total>=metaMensal?'#0d7a3e':'#ea4335'}">${Math.round((d.total/metaMensal)*100)}%</td>
        </tr>`).join('')
      const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório 9E10</title>
      <style>body{font-family:system-ui,sans-serif;max-width:860px;margin:40px auto;padding:0 20px;color:#1a1a1a}
      h1{font-size:26px;margin:0}p{color:#5f6368;margin-top:4px}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}
      .card{background:#f8f9fb;border-radius:10px;padding:16px}.cl{font-size:12px;color:#5f6368}.cv{font-size:22px;font-weight:700;margin-top:4px}
      table{width:100%;border-collapse:collapse;margin-top:24px}
      th{text-align:left;padding:10px 12px;font-size:12px;color:#5f6368;border-bottom:2px solid #e8eaed;text-transform:uppercase;letter-spacing:.05em}
      td{padding:12px;border-bottom:1px solid #f0f0f0;font-size:14px}
      footer{margin-top:40px;font-size:12px;color:#9aa0a6;text-align:center;padding-top:20px;border-top:1px solid #f0f0f0}
      </style></head><body>
      <h1>Relatório Financeiro — 9E10</h1>
      <p>${periodo_str} · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      <div class="grid">
        <div class="card"><div class="cl">Receita total</div><div class="cv" style="color:#082996">R$ ${totalPeriodo.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Mensalistas</div><div class="cv" style="color:#0d7a3e">R$ ${totalMensal.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Avulsos</div><div class="cv" style="color:#b45309">R$ ${totalAvulso.toLocaleString('pt-BR')}</div></div>
        <div class="card"><div class="cl">Crescimento</div><div class="cv" style="color:${crescimento>=0?'#0d7a3e':'#ea4335'}">${crescimento>=0?'+':''}${crescimento}%</div></div>
      </div>
      <table><thead><tr><th>Mês</th><th>Mensalista</th><th>Avulso</th><th>Total</th><th>vs Meta</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <footer>ChicoFC · Sistema de Gestão de Quadras · Meta mensal: R$ ${metaMensal.toLocaleString('pt-BR')}</footer>
      </body></html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `relatorio-9E10-${periodo}m.html`; a.click()
    } else {
      const linhas = dados.map(d =>
        `${d.mes}   Mensal: R$${d.mensal.toLocaleString('pt-BR').padStart(8)}   Avulso: R$${d.avulso.toLocaleString('pt-BR').padStart(6)}   Total: R$${d.total.toLocaleString('pt-BR').padStart(8)}   ${Math.round((d.total/metaMensal)*100)}% da meta`
      ).join('\n')
      const txt = `RELATÓRIO FINANCEIRO — 9E10\n${periodo_str}\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\n${'─'.repeat(70)}\n\nResumo\nReceita total: R$ ${totalPeriodo.toLocaleString('pt-BR')}\nMensalistas:   R$ ${totalMensal.toLocaleString('pt-BR')}\nAvulsos:       R$ ${totalAvulso.toLocaleString('pt-BR')}\nCrescimento:   ${crescimento>=0?'+':''}${crescimento}%\n\n${'─'.repeat(70)}\n\n${linhas}\n\n${'─'.repeat(70)}\nMeta mensal: R$ ${metaMensal.toLocaleString('pt-BR')}\nChicoFC · Sistema de Gestão de Quadras`
      const blob = new Blob([txt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `relatorio-9E10-${periodo}m.txt`; a.click()
    }
  }

  return (
    <div className="page">
      <div className="page-inner">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Relatórios</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Análise financeira da 9E10</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', background: '#fff', padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
              Últimos {periodo} {periodo === 1 ? 'mês' : 'meses'}
            </div>
            <button onClick={() => exportRelatorio('html')}
              style={{ padding: '9px 16px', borderRadius: 9, background: '#fff', color: '#082996', border: '1.5px solid var(--border)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🌐 HTML
            </button>
            <button onClick={() => exportRelatorio('txt')}
              style={{ padding: '9px 16px', borderRadius: 9, background: 'var(--blue)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,41,150,0.3)' }}>
              📄 TXT
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { label: 'Receita total', value: `R$ ${totalPeriodo.toLocaleString('pt-BR')}`, color: '#082996', bg: '#e8f0ff', icon: '💰' },
            { label: 'Mensalistas', value: `R$ ${totalMensal.toLocaleString('pt-BR')}`, color: '#0d7a3e', bg: '#e6f4ea', icon: '📅' },
            { label: 'Avulsos', value: `R$ ${totalAvulso.toLocaleString('pt-BR')}`, color: '#b45309', bg: '#fef7e0', icon: '⚡' },
            { label: 'Crescimento', value: `${crescimento >= 0 ? '+' : ''}${crescimento}%`, color: crescimento >= 0 ? '#0d7a3e' : '#ea4335', bg: crescimento >= 0 ? '#e6f4ea' : '#fce8e6', icon: crescimento >= 0 ? '📈' : '📉' },
          ].map(c => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 'var(--radius)',
              padding: '20px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.value}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Seletor de período */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          padding: '16px 20px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Período</span>
          <div style={{ display: 'flex', gap: 6, background: '#f2f4f8', borderRadius: 9, padding: 4 }}>
            {PERIODOS.map(p => (
              <button key={p} onClick={() => setPeriodo(p)}
                style={{
                  padding: '6px 14px', borderRadius: 7, border: 'none',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: periodo === p ? '#082996' : 'transparent',
                  color: periodo === p ? '#fff' : 'var(--text-2)',
                  transition: 'all 0.15s',
                }}>
                {p} {p === 1 ? 'mês' : 'meses'}
              </button>
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          {/* Barras */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius)',
            padding: '24px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Receita mensal</h2>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 20 }}>Total por mês — linha de meta</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, position: 'relative' }}>
              <div style={{
                position: 'absolute',
                bottom: Math.round((metaMensal / maxTotal) * 160) + 20,
                left: 0, right: 0,
                borderTop: '2px dashed #ea4335',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ fontSize: 10, color: '#ea4335', background: '#fff', padding: '0 4px', marginLeft: 4, fontWeight: 600 }}>
                  Meta R${(metaMensal/1000).toFixed(1)}k
                </span>
              </div>
              {dados.map((d, i) => {
                const isLast = i === dados.length - 1
                const hTotal = Math.round((d.total / maxTotal) * 160)
                return (
                  <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 10, color: isLast ? '#082996' : 'var(--text-3)', fontWeight: 700 }}>
                      R${(d.total/1000).toFixed(1)}k
                    </div>
                    <div style={{
                      width: '100%', height: hTotal,
                      background: isLast ? 'linear-gradient(to top, #082996, #1a3fbe)' : '#dbe4ff',
                      borderRadius: '5px 5px 0 0',
                      transition: 'height 0.5s ease',
                      border: d.total >= metaMensal ? '2px solid #34a853' : 'none',
                      boxSizing: 'border-box',
                    }} />
                    <div style={{ fontSize: 10, color: isLast ? '#082996' : 'var(--text-3)', fontWeight: isLast ? 700 : 400 }}>
                      {d.mes.split('/')[0]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Composição */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius)',
            padding: '24px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Composição da receita</h2>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 20 }}>Mensalista vs Avulso por mês</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dados.map((d, i) => {
                const isLast = i === dados.length - 1
                const pctMensal = Math.round((d.mensal / d.total) * 100)
                const pctAvulso = 100 - pctMensal
                return (
                  <div key={d.mes} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: isLast ? '#082996' : 'var(--text-3)', width: 42, flexShrink: 0, fontWeight: isLast ? 700 : 400 }}>
                      {d.mes.split('/')[0]}
                    </span>
                    <div style={{ flex: 1, height: 22, borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                      <div style={{
                        width: `${pctMensal}%`,
                        background: isLast ? '#082996' : '#dbe4ff',
                        transition: 'width 0.5s ease',
                        display: 'flex', alignItems: 'center', paddingLeft: 6,
                      }}>
                        {pctMensal > 20 && <span style={{ fontSize: 10, color: isLast ? '#fff' : '#082996', fontWeight: 700 }}>{pctMensal}%</span>}
                      </div>
                      <div style={{
                        flex: 1,
                        background: isLast ? '#34a853' : '#bbf7d0',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                      }}>
                        {pctAvulso > 10 && <span style={{ fontSize: 10, color: isLast ? '#fff' : '#0d7a3e', fontWeight: 700 }}>{pctAvulso}%</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: isLast ? '#082996' : 'var(--text-3)', fontWeight: isLast ? 700 : 400, width: 48, textAlign: 'right', flexShrink: 0 }}>
                      R${(d.total/1000).toFixed(1)}k
                    </span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              {[['#082996','Mensalista'],['#34a853','Avulso']].map(([cor,label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: cor }} />
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Detalhamento mensal</h2>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Últimos {periodo} {periodo === 1 ? 'mês' : 'meses'}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfc' }}>
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
                  const tend = prev ? (d.total >= prev.total ? '↑' : '↓') : '—'
                  const tendColor = prev ? (d.total >= prev.total ? '#0d7a3e' : '#ea4335') : 'var(--text-3)'
                  return (
                    <tr key={d.mes} style={{
                      borderBottom: '1px solid var(--border-light)',
                      background: isLast ? '#f0f4ff' : 'transparent',
                    }}>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: isLast ? 700 : 500, color: isLast ? '#082996' : 'var(--text)' }}>{d.mes}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--text)' }}>R$ {d.mensal.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--text)' }}>R$ {d.avulso.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: isLast ? '#082996' : 'var(--text)' }}>R$ {d.total.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '13px 20px' }}>
                        <span style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                          background: pctMeta >= 100 ? '#e6f4ea' : '#fce8e6',
                          color: pctMeta >= 100 ? '#0d7a3e' : '#ea4335',
                        }}>{pctMeta}%</span>
                      </td>
                      <td style={{ padding: '13px 20px', fontSize: 18, fontWeight: 600, color: tendColor }}>{tend}</td>
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
