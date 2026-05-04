// ─── QUADRAS ────────────────────────────────────────────────────────────────
export const QUADRAS = [
  { id: 'society', nome: 'Campo Futebol', tipo: 'society', cor: '#082996' },
  { id: 'volei1',  nome: 'Vôlei 1',       tipo: 'volei',   cor: '#0891b2' },
  { id: 'volei2',  nome: 'Vôlei 2',       tipo: 'volei',   cor: '#0d7a3e' },
  { id: 'volei3',  nome: 'Vôlei 3',       tipo: 'volei',   cor: '#7c3aed' },
  { id: 'volei4',  nome: 'Vôlei 4',       tipo: 'volei',   cor: '#b45309' },
]

export const HORARIOS = Array.from({ length: 20 }, (_, i) => {
  const totalMin = 14 * 60 + i * 30
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const m = String(totalMin % 60).padStart(2, '0')
  return h + 'h' + m
})

export const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export const CONFIG = {
  mensalidadeSociety: 760,
  valorAvulso: 190,
  metaAnual: 96000,
}

export const GRUPOS_INICIAL = [
  { id: 1, nome: 'ChicoFC',        dia: 'Quarta',  horario: '21h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: true,  responsavel: '5548999990001' },
  { id: 2, nome: 'Fut Raiz',       dia: 'Segunda', horario: '20h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: true,  responsavel: '5548999990002' },
  { id: 3, nome: 'Os Crias',       dia: 'Quarta',  horario: '19h00', quadra: 'society', jogadores: 12, tipo: 'mensal', valor: 760, status: 'ativo',  pago: false, responsavel: '5548999990003' },
  { id: 4, nome: 'Pelada do Beto', dia: 'Sexta',   horario: '21h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: false, responsavel: '5548999990004' },
  { id: 5, nome: 'Quinta FC',      dia: 'Quinta',  horario: '20h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: true,  responsavel: '5548999990005' },
  { id: 6, nome: 'Terça Pesada',   dia: 'Terça',   horario: '21h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: true,  responsavel: '5548999990006' },
  { id: 7, nome: 'Boleiros SC',    dia: 'Sábado',  horario: '19h00', quadra: 'society', jogadores: 14, tipo: 'mensal', valor: 760, status: 'ativo',  pago: true,  responsavel: '5548999990007' },
  { id: 8, nome: 'Sábado Bom',     dia: 'Sábado',  horario: '20h00', quadra: 'volei1',  jogadores: 12, tipo: 'mensal', valor: 760, status: 'espera', pago: false, responsavel: '5548999990008' },
]

function buildAgendaInicial() {
  const agenda = {}
  QUADRAS.forEach(q => {
    agenda[q.id] = {}
    DIAS.forEach(d => {
      agenda[q.id][d] = {}
      HORARIOS.forEach(h => { agenda[q.id][d][h] = null })
    })
  })
  const slots = [
    { quadra: 'society', dia: 'Segunda', h: '20h00', nome: 'Fut Raiz',       cor: '#082996', tipo: 'mensal' },
    { quadra: 'society', dia: 'Terça',   h: '21h00', nome: 'Terça Pesada',   cor: '#7c3aed', tipo: 'mensal' },
    { quadra: 'society', dia: 'Quarta',  h: '19h00', nome: 'Os Crias',       cor: '#b45309', tipo: 'mensal' },
    { quadra: 'society', dia: 'Quarta',  h: '21h00', nome: 'ChicoFC',        cor: '#082996', tipo: 'mensal' },
    { quadra: 'society', dia: 'Quinta',  h: '20h00', nome: 'Quinta FC',      cor: '#0891b2', tipo: 'mensal' },
    { quadra: 'society', dia: 'Sexta',   h: '21h00', nome: 'Pelada do Beto', cor: '#ea4335', tipo: 'mensal' },
    { quadra: 'society', dia: 'Sábado',  h: '19h00', nome: 'Boleiros SC',    cor: '#34a853', tipo: 'mensal' },
    { quadra: 'volei1',  dia: 'Sábado',  h: '20h00', nome: 'Sábado Bom',     cor: '#9aa0a6', tipo: 'mensal', espera: true },
  ]
  slots.forEach(s => {
    if (agenda[s.quadra] && agenda[s.quadra][s.dia]) {
      agenda[s.quadra][s.dia][s.h] = { grupo: s.nome, cor: s.cor, tipo: s.tipo, espera: s.espera || false }
    }
  })
  return agenda
}

export const AGENDA_INICIAL = buildAgendaInicial()

export const HISTORICO_MENSAL = [
  { mes: 'Jun/24', mensal: 3040, avulso: 380,  total: 3420 },
  { mes: 'Jul/24', mensal: 3800, avulso: 190,  total: 3990 },
  { mes: 'Ago/24', mensal: 3800, avulso: 570,  total: 4370 },
  { mes: 'Set/24', mensal: 4560, avulso: 380,  total: 4940 },
  { mes: 'Out/24', mensal: 4560, avulso: 760,  total: 5320 },
  { mes: 'Nov/24', mensal: 5320, avulso: 190,  total: 5510 },
  { mes: 'Dez/24', mensal: 5320, avulso: 570,  total: 5890 },
  { mes: 'Jan/25', mensal: 5320, avulso: 380,  total: 5700 },
  { mes: 'Fev/25', mensal: 5320, avulso: 760,  total: 6080 },
  { mes: 'Mar/25', mensal: 5320, avulso: 380,  total: 5700 },
  { mes: 'Abr/25', mensal: 5320, avulso: 570,  total: 5890 },
  { mes: 'Mai/25', mensal: 5320, avulso: 190,  total: 5510 },
]

export const NOTIFICACOES = [
  { id: 1, msg: 'Pelada do Beto ainda não pagou maio', tempo: '2h', urgente: true  },
  { id: 2, msg: 'Sábado Bom quer reservar Sáb 20h00', tempo: '5h', urgente: true  },
  { id: 3, msg: 'Os Crias ainda não pagou maio',       tempo: '1d', urgente: true  },
  { id: 4, msg: 'ChicoFC: todos 14 confirmados para quarta', tempo: '1d', urgente: false },
]

export const CORES = ['#082996', '#0d7a3e', '#b45309', '#7c3aed', '#0891b2', '#ea4335', '#34a853']
