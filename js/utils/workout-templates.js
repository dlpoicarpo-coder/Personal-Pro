// ========================================
// PERSONAL PRO — Workout Templates v2
// Musculação + Cardio/Endurance científicos
// ========================================

export const BUILT_IN_TEMPLATES = [
  // ── HIPERTROFIA ──────────────────────────────────────────
  {
    id:'hyp-ab', name:'AB — Hipertrofia (2×/sem)', goal:'Hipertrofia', daysPerWeek:2, category:'Hipertrofia',
    description:'Divisão A/B alternada. Ideal para iniciantes.',
    workouts:[
      { name:'Treino A — Peito, Ombro, Tríceps', exercises:[
        { name:'Supino Reto com Barra',         sets:4, reps:'8-12', rest:'90', method:'Pirâmide Crescente' },
        { name:'Supino Inclinado com Halteres', sets:3, reps:'10-12',rest:'75' },
        { name:'Desenvolvimento com Halteres',  sets:3, reps:'10-12',rest:'75' },
        { name:'Elevação Lateral',              sets:3, reps:'12-15',rest:'60' },
        { name:'Tríceps Pulley',                sets:3, reps:'12-15',rest:'60' },
        { name:'Tríceps Francês',               sets:3, reps:'10-12',rest:'60' },
      ]},
      { name:'Treino B — Costas, Bíceps, Pernas', exercises:[
        { name:'Puxada Frontal',                sets:4, reps:'8-12', rest:'90' },
        { name:'Remada Curvada com Barra',      sets:4, reps:'8-12', rest:'90' },
        { name:'Rosca Direta com Barra',        sets:3, reps:'10-12',rest:'75' },
        { name:'Agachamento Livre com Barra',   sets:4, reps:'8-12', rest:'120' },
        { name:'Leg Press 45°',                sets:3, reps:'12-15',rest:'90' },
        { name:'Cadeira Extensora',             sets:3, reps:'12-15',rest:'60' },
      ]},
    ]
  },
  {
    id:'hyp-abc', name:'ABC — Hipertrofia (3×/sem)', goal:'Hipertrofia', daysPerWeek:3, category:'Hipertrofia',
    description:'Divisão clássica ABC. Intermediários.',
    workouts:[
      { name:'Treino A — Peito e Tríceps', exercises:[
        { name:'Supino Reto com Barra',         sets:4, reps:'8-10', rest:'90', method:'Pirâmide Crescente' },
        { name:'Supino Inclinado com Halteres', sets:3, reps:'10-12',rest:'75' },
        { name:'Crucifixo Reto',                sets:3, reps:'12-15',rest:'60' },
        { name:'Tríceps Pulley',                sets:4, reps:'12-15',rest:'60', method:'Drop-set' },
        { name:'Tríceps Testa',                 sets:3, reps:'10-12',rest:'60' },
      ]},
      { name:'Treino B — Costas e Bíceps', exercises:[
        { name:'Puxada Frontal',                sets:4, reps:'8-12', rest:'90' },
        { name:'Remada Curvada com Barra',      sets:4, reps:'8-12', rest:'90' },
        { name:'Remada Unilateral com Halter',  sets:3, reps:'10-12',rest:'75' },
        { name:'Rosca Direta com Barra',        sets:3, reps:'10-12',rest:'75' },
        { name:'Rosca Alternada com Halteres',  sets:3, reps:'10-12',rest:'60' },
      ]},
      { name:'Treino C — Pernas e Ombros', exercises:[
        { name:'Agachamento Livre com Barra',   sets:4, reps:'8-12', rest:'120' },
        { name:'Leg Press 45°',                sets:3, reps:'12-15',rest:'90' },
        { name:'Mesa Flexora',                 sets:3, reps:'12-15',rest:'75' },
        { name:'Panturrilha no Smith',          sets:4, reps:'15-20',rest:'60' },
        { name:'Desenvolvimento com Halteres',  sets:3, reps:'10-12',rest:'75' },
        { name:'Elevação Lateral',              sets:3, reps:'12-15',rest:'60' },
      ]},
    ]
  },
  {
    id:'hyp-abcd', name:'ABCD — Hipertrofia (4×/sem)', goal:'Hipertrofia', daysPerWeek:4, category:'Hipertrofia',
    description:'Divisão ABCD avançada. Máximo volume por grupo.',
    workouts:[
      { name:'Treino A — Peito', exercises:[
        { name:'Supino Reto com Barra',          sets:4, reps:'6-10', rest:'90', method:'Pirâmide Crescente' },
        { name:'Supino Inclinado com Halteres',  sets:4, reps:'8-12', rest:'75' },
        { name:'Supino Declinado com Halteres',  sets:3, reps:'10-12',rest:'75' },
        { name:'Crucifixo Reto',                 sets:3, reps:'12-15',rest:'60', method:'Drop-set' },
        { name:'Peck Deck (Voador)',              sets:3, reps:'12-15',rest:'60' },
      ]},
      { name:'Treino B — Costas', exercises:[
        { name:'Barra Fixa (Pull-up)',            sets:4, reps:'6-10', rest:'120' },
        { name:'Remada Curvada com Barra',        sets:4, reps:'8-10', rest:'90' },
        { name:'Puxada Frontal',                  sets:3, reps:'10-12',rest:'75' },
        { name:'Remada Unilateral com Halter',    sets:3, reps:'10-12',rest:'75' },
        { name:'Pullover no Cabo',                sets:3, reps:'12-15',rest:'60' },
      ]},
      { name:'Treino C — Pernas', exercises:[
        { name:'Agachamento Livre com Barra',     sets:5, reps:'6-10', rest:'120' },
        { name:'Leg Press 45°',                  sets:4, reps:'10-15',rest:'90' },
        { name:'Cadeira Extensora',               sets:3, reps:'12-15',rest:'60', method:'Drop-set' },
        { name:'Mesa Flexora',                   sets:3, reps:'10-12',rest:'75' },
        { name:'Stiff com Barra',                sets:3, reps:'10-12',rest:'75' },
        { name:'Panturrilha no Leg Press',       sets:5, reps:'15-20',rest:'45' },
      ]},
      { name:'Treino D — Ombros e Braços', exercises:[
        { name:'Desenvolvimento com Barra',       sets:4, reps:'8-10', rest:'90' },
        { name:'Elevação Lateral',                sets:4, reps:'12-15',rest:'60' },
        { name:'Crucifixo Invertido',             sets:3, reps:'12-15',rest:'60' },
        { name:'Rosca Direta com Barra',          sets:3, reps:'10-12',rest:'75' },
        { name:'Rosca Concentrada',               sets:3, reps:'10-12',rest:'60' },
        { name:'Tríceps Pulley',                  sets:3, reps:'12-15',rest:'60', method:'Drop-set' },
      ]},
    ]
  },
  // ── FORÇA ─────────────────────────────────────────────────
  {
    id:'str-531', name:'5/3/1 — Wendler (4×/sem)', goal:'Força', daysPerWeek:4, category:'Força',
    description:'Wendler 5/3/1. Levantamento principal por dia com progressão de 1RM.',
    workouts:[
      { name:'Dia 1 — Supino', exercises:[
        { name:'Supino Reto com Barra',          sets:3, reps:'5/3/1', rest:'180', method:'Pirâmide Crescente' },
        { name:'Supino com Halteres',            sets:5, reps:'10',    rest:'90' },
        { name:'Tríceps Pulley',                 sets:5, reps:'10',    rest:'60' },
      ]},
      { name:'Dia 2 — Agachamento', exercises:[
        { name:'Agachamento Livre com Barra',    sets:3, reps:'5/3/1', rest:'180', method:'Pirâmide Crescente' },
        { name:'Leg Press 45°',                 sets:5, reps:'10',    rest:'120' },
        { name:'Mesa Flexora',                  sets:5, reps:'10',    rest:'75' },
      ]},
      { name:'Dia 3 — Desenvolvimento', exercises:[
        { name:'Desenvolvimento com Barra',      sets:3, reps:'5/3/1', rest:'180', method:'Pirâmide Crescente' },
        { name:'Desenvolvimento com Halteres',   sets:5, reps:'10',    rest:'90' },
        { name:'Elevação Lateral',               sets:5, reps:'15',    rest:'60' },
      ]},
      { name:'Dia 4 — Terra', exercises:[
        { name:'Levantamento Terra',             sets:3, reps:'5/3/1', rest:'240', method:'Pirâmide Crescente' },
        { name:'Remada Curvada com Barra',       sets:5, reps:'10',    rest:'90' },
        { name:'Puxada Frontal',                 sets:5, reps:'10',    rest:'90' },
      ]},
    ]
  },
  // ── EMAGRECIMENTO ─────────────────────────────────────────
  {
    id:'fat-circ', name:'Circuito Metabólico (3×/sem)', goal:'Emagrecimento', daysPerWeek:3, category:'Emagrecimento',
    description:'Circuito metabólico com compostos e cardio. Alta demanda calórica.',
    workouts:[
      { name:'Circuito A', exercises:[
        { name:'Supino com Halteres',            sets:3, reps:'15',    rest:'45', method:'Série Gigante' },
        { name:'Puxada Frontal',                 sets:3, reps:'15',    rest:'45' },
        { name:'Burpee',                         sets:3, reps:'12',    rest:'60' },
        { name:'Sprint — HIIT',                  sets:6, reps:'30s',   rest:'60s',method:'HIIT 1:2', loadType:'time' },
      ]},
      { name:'Circuito B', exercises:[
        { name:'Agachamento Livre com Barra',    sets:3, reps:'20',    rest:'45', method:'Série Gigante' },
        { name:'Hip Thrust',                     sets:3, reps:'20',    rest:'45' },
        { name:'Agachamento com Salto',          sets:3, reps:'15',    rest:'60' },
        { name:'Pular Corda — Tabata',           sets:8, reps:'20s',   rest:'10s',method:'Tabata', loadType:'time' },
      ]},
    ]
  },
  {
    id:'fun-full', name:'Full Body Funcional (3×/sem)', goal:'Condicionamento', daysPerWeek:3, category:'Funcional',
    description:'Treino funcional completo. Saúde geral e condicionamento.',
    workouts:[
      { name:'Full Body A', exercises:[
        { name:'Agachamento Livre com Barra',    sets:3, reps:'12',    rest:'60' },
        { name:'Supino com Halteres',            sets:3, reps:'12',    rest:'60' },
        { name:'Remada Curvada com Barra',       sets:3, reps:'12',    rest:'60' },
        { name:'Prancha Abdominal',              sets:3, reps:'30s',   rest:'45', loadType:'time' },
        { name:'Pular Corda',                    sets:2, reps:'2min',  rest:'60', loadType:'time' },
      ]},
    ]
  },
  {
    id:'rehab-senior', name:'Funcional Idoso/Reabilitação (3×/sem)', goal:'Saúde', daysPerWeek:3, category:'Reabilitação',
    description:'Baixo impacto. Mobilidade, equilíbrio e funcionalidade para idosos ou reabilitação.',
    workouts:[
      { name:'Sessão Funcional', exercises:[
        { name:'Marcha Estacionária',            sets:2, reps:'60s',   rest:'30', loadType:'time' },
        { name:'Agachamento na Cadeira',         sets:3, reps:'10',    rest:'60' },
        { name:'Remada com Elástico',            sets:3, reps:'12',    rest:'60' },
        { name:'Equilíbrio Unipodal',            sets:3, reps:'30s',   rest:'30', loadType:'time' },
        { name:'Caminhada na Esteira',           sets:1, reps:'15min', rest:'0',  loadType:'time', intensity:'Zona 1' },
      ]},
    ]
  },

  // ══════════════════════════════════════════════════════════
  // ── CARDIO / ENDURANCE — Modelos Científicos ─────────────
  // ══════════════════════════════════════════════════════════

  {
    id:'card-hiit', name:'HIIT Clássico (3×/sem)', goal:'Condicionamento', daysPerWeek:3, category:'Cardio / Endurance',
    perioModel:'hiit',
    description:'HIIT com intervalos progressivos. Tabata et al. (1996). Melhora VO₂max em 8 semanas.',
    workouts:[
      { name:'Sessão HIIT', exercises:[
        { name:'Aquecimento — Zona 1',           sets:1, reps:'8min',  rest:'0',   method:'Zona 1 (Z1)',        loadType:'time', intensity:'55-65% FC' },
        { name:'Bicicleta Ergométrica — Tabata', sets:8, reps:'20s',   rest:'10s', method:'Tabata (20:10)',     loadType:'time', intensity:'≥ 170% VO₂max', sciNote:'Tabata et al. (1996): 8×20s all-out / 10s passivo' },
        { name:'Recuperação Ativa',              sets:1, reps:'3min',  rest:'0',   method:'Zona 1 (Z1)',        loadType:'time' },
        { name:'Sprints — HIIT 1:3',             sets:6, reps:'30s',   rest:'90s', method:'HIIT 1:3',           loadType:'time', intensity:'90-95% FC' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',                               loadType:'time' },
      ]},
    ]
  },
  {
    id:'card-sit', name:'SIT — Sprint Intervals (2×/sem)', goal:'Condicionamento', daysPerWeek:2, category:'Cardio / Endurance',
    perioModel:'sit',
    description:'Sprint Interval Training. Burgomaster et al. (2005). Protocolo Wingate: 4-6×30s all-out / 4min recuperação.',
    workouts:[
      { name:'Sessão SIT', exercises:[
        { name:'Aquecimento — Zona 1',           sets:1, reps:'5min',  rest:'0',   method:'Zona 1 (Z1)',        loadType:'time' },
        { name:'Sprint Máximo — Wingate',        sets:4, reps:'30s',   rest:'4min',method:'SIT 1:8',            loadType:'time', intensity:'All-out ≥ 100% VO₂max', sciNote:'Burgomaster et al. (2005): 4-6×30s all-out / 4min rec. passiva' },
        { name:'Recuperação Final — Zona 1',     sets:1, reps:'3min',  rest:'0',                               loadType:'time' },
      ]},
    ]
  },
  {
    id:'card-polarized', name:'Polarizado — Seiler (4-5×/sem)', goal:'Resistência', daysPerWeek:5, category:'Cardio / Endurance',
    perioModel:'polarized',
    description:'80% Zona 2 + 20% Zona 4-5. Seiler & Tønnessen (2009). Modelo usado por atletas de elite. Evita a "zona cinza" (Z3).',
    workouts:[
      { name:'Sessão Zona 2 (×3/sem)', exercises:[
        { name:'Corrida ou Ciclismo — Zona 2',   sets:1, reps:'45-90min',rest:'0', method:'Zona 2 (Z2)', loadType:'time', intensity:'65-75% FC / ~65% VO₂max', sciNote:'Seiler (2009): manter Z2 (abaixo do limiar aeróbio L1). Fala frases completas.' },
      ]},
      { name:'Sessão Intervalada Z4-5 (×2/sem)', exercises:[
        { name:'Aquecimento — Zona 1-2',         sets:1, reps:'10min', rest:'0',   loadType:'time', intensity:'65-72% FC' },
        { name:'Intervalos Noruegueses — 4×4min', sets:4, reps:'4min', rest:'3min',method:'Zona 4 (Z4)', loadType:'time', intensity:'85-95% FC', sciNote:'Seiler (2013): 4×4min / 3min rec. ativa — protocolo mais validado em estudos nórdicos' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',   loadType:'time' },
      ]},
    ]
  },
  {
    id:'card-zone2', name:'Base Aeróbica — Zona 2 (4×/sem)', goal:'Resistência', daysPerWeek:4, category:'Cardio / Endurance',
    perioModel:'zone2',
    description:'Treino contínuo em Zona 2. Método Maffetone e San Millán. Desenvolvimento mitocondrial sem produção de lactato.',
    workouts:[
      { name:'Sessão Zona 2', exercises:[
        { name:'Corrida ao Ar Livre — Zona 2',   sets:1, reps:'30-60min',rest:'0', method:'Zona 2 (Z2)', loadType:'time', intensity:'65-75% FC / ~65% VO₂max', sciNote:'San Millán & Brooks (2018): zona 2 maximiza biogênese mitocondrial e transporte de lactato.' },
      ]},
      { name:'Sessão Longa (×1/sem)', exercises:[
        { name:'Long Run / Long Ride — Zona 2',  sets:1, reps:'60-90min',rest:'0', method:'Zona 2 (Z2)', loadType:'time', intensity:'62-72% FC', sciNote:'Maffetone: MAF = 180 - idade (bpm). Nunca ultrapassar.' },
      ]},
    ]
  },
  {
    id:'card-pyramidal', name:'Pyramidal (4×/sem)', goal:'Resistência', daysPerWeek:4, category:'Cardio / Endurance',
    perioModel:'pyramidal',
    description:'75% Z2 + 20% Z3 (limiar) + 5% Z4-5. Muñoz et al. (2014). Intermediário entre polarizado e threshold.',
    workouts:[
      { name:'Sessão Base Z2 (×2/sem)', exercises:[
        { name:'Corrida Contínua — Zona 2',      sets:1, reps:'40min', rest:'0',   method:'Zona 2 (Z2)', loadType:'time', intensity:'65-75% FC' },
      ]},
      { name:'Sessão Threshold Z3 (×1/sem)', exercises:[
        { name:'Aquecimento — Zona 1-2',         sets:1, reps:'10min', rest:'0',   loadType:'time' },
        { name:'Tempo Run — Zona 3',             sets:1, reps:'20-40min',rest:'0', method:'Zona 3 (Z3)', loadType:'time', intensity:'78-88% FC', sciNote:'Zona 3 = "steady state tempo". Limiar entre aeróbio e anaeróbio.' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',   loadType:'time' },
      ]},
      { name:'Sessão Intervalada Z4 (×1/sem)', exercises:[
        { name:'Aquecimento — Zona 1-2',         sets:1, reps:'10min', rest:'0',   loadType:'time' },
        { name:'Intervalos Z4',                  sets:3, reps:'5min',  rest:'2min',method:'Zona 4 (Z4)', loadType:'time', intensity:'85-92% FC' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',   loadType:'time' },
      ]},
    ]
  },
  {
    id:'card-lvhiit', name:'HIIT Low-Volume (3×/sem)', goal:'Condicionamento', daysPerWeek:3, category:'Cardio / Endurance',
    perioModel:'lvhiit',
    description:'LV-HIIT (Gillen et al. 2016). Apenas 3×10min/semana. VO₂max similar a 5h de treino contínuo. Ideal para quem tem pouco tempo.',
    workouts:[
      { name:'Sessão LV-HIIT (10min total)', exercises:[
        { name:'Aquecimento — Zona 1',           sets:1, reps:'2min',  rest:'0',   loadType:'time', intensity:'55-60% FC' },
        { name:'Sprint — LV-HIIT',               sets:3, reps:'60s',   rest:'75s', method:'HIIT Low-Volume', loadType:'time', intensity:'85-95% FC', sciNote:'Gillen et al. (2016): 3×60s / 75s rec. = 10min total. Efeito similar a 150min/sem de treino moderado.' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'2min',  rest:'0',   loadType:'time' },
      ]},
    ]
  },
  {
    id:'card-threshold', name:'Threshold Training (4×/sem)', goal:'Resistência', daysPerWeek:4, category:'Cardio / Endurance',
    perioModel:'threshold',
    description:'Treino no limiar anaeróbio (Z3-4). Melhora VLamax e capacidade de sustentar velocidades altas em corrida ou ciclismo.',
    workouts:[
      { name:'Sessão Base Z2 (×2/sem)', exercises:[
        { name:'Corrida Contínua — Zona 2',      sets:1, reps:'30-45min',rest:'0', method:'Zona 2 (Z2)', loadType:'time', intensity:'65-75% FC' },
      ]},
      { name:'Tempo Run (×1/sem)', exercises:[
        { name:'Aquecimento — Zona 1-2',         sets:1, reps:'10min', rest:'0',   loadType:'time' },
        { name:'Tempo Run — Limiar',             sets:1, reps:'20-30min',rest:'0', method:'Zona 3-4 (Threshold)', loadType:'time', intensity:'78-88% FC', sciNote:'Esteve-Lanao et al. (2007): tempo run no limiar melhora VLamax e VO₂max.' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',   loadType:'time' },
      ]},
      { name:'Threshold Intervals (×1/sem)', exercises:[
        { name:'Aquecimento — Zona 1-2',         sets:1, reps:'10min', rest:'0',   loadType:'time' },
        { name:'Threshold Intervals',            sets:4, reps:'5min',  rest:'90s', method:'Zona 4 (Threshold)', loadType:'time', intensity:'85-90% FC' },
        { name:'Esfriamento — Zona 1',           sets:1, reps:'5min',  rest:'0',   loadType:'time' },
      ]},
    ]
  },
];

export function getTemplatesByCategory() {
  const grouped = {};
  BUILT_IN_TEMPLATES.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });
  return grouped;
}
