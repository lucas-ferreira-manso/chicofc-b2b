import { useState } from 'react'
import { GRUPOS_INICIAL, CONFIG } from '../data'

export function useGrupos() {
  const [grupos, setGrupos] = useState(GRUPOS_INICIAL)

  const togglePago = (id) => {
    setGrupos(prev => prev.map(g => g.id === id ? { ...g, pago: !g.pago } : g))
  }

  const cobrar = (grupo) => {
    const msg = encodeURIComponent(
      `Olá! A mensalidade de *${grupo.nome}* referente a *Maio/2025* no valor de *R$ ${grupo.valor?.toLocaleString('pt-BR')}* está em aberto.\n\nChave PIX: 42c4fc79-a983-4a02-88fb-81ec76948c0f\n\nQualquer dúvida estou à disposição! 🙏`
    )
    window.open(`https://wa.me/${grupo.responsavel}?text=${msg}`, '_blank')
  }

  const salvarGrupo = (form) => {
    if (form.id && grupos.find(g => g.id === form.id)) {
      setGrupos(prev => prev.map(g => g.id === form.id ? { ...g, ...form } : g))
    } else {
      setGrupos(prev => [...prev, { ...form, id: Date.now() }])
    }
  }

  const excluir = (id) => {
    const grupo = grupos.find(g => g.id === id)
    if (grupo && !grupo.pago) {
      const msg = encodeURIComponent(
        `Olá! Informamos que o grupo *${grupo.nome}* foi removido do sistema. Porém, há um pagamento pendente de *R$ ${grupo.valor?.toLocaleString('pt-BR')}*.\n\nPor favor, realize o pagamento para regularização.\n\nChave PIX: 42c4fc79-a983-4a02-88fb-81ec76948c0f`
      )
      window.open(`https://wa.me/${grupo.responsavel}?text=${msg}`, '_blank')
    }
    setGrupos(prev => prev.filter(g => g.id !== id))
  }

  const totalRecebido = grupos.filter(g => g.pago && g.status === 'ativo').reduce((s, g) => s + (g.valor || 0), 0)
  const totalPendente = grupos.filter(g => !g.pago && g.status === 'ativo').reduce((s, g) => s + (g.valor || 0), 0)
  const totalEsperado = grupos.filter(g => g.status === 'ativo').reduce((s, g) => s + (g.valor || 0), 0)
  const metaMensal = Math.round(CONFIG.metaAnual / 12)

  return { grupos, togglePago, cobrar, salvarGrupo, excluir, totalRecebido, totalPendente, totalEsperado, metaMensal }
}
