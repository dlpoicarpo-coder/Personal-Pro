// ============================================================
// PERSONAL PRO — Periodization Engine v2 (Scientific)
// Modelos: Linear, Linear Reversa, DUP, Blocos, Conjugada,
//          Concorrente + CARDIO: HIIT, SIT, Polarizado,
//          Base Aeróbica, Low-Volume, Pyramidal, Zone2
// ============================================================

// ── MODELOS DE MUSCULAÇÃO ──────────────────────────────────

export const PERIODIZATION_MODELS = {

  // 1. LINEAR CLÁSSICA
  // Referência: Bompa & Haff (2009), Stone et al. (1981)
  // Volume ↓ | Intensidade ↑ progressivamente
  linear: {
    id: 'linear', label: 'Linear Clássica', color: '#3b82f6',
    type: 'strength',
    desc: 'Volume decresce, intensidade aumenta progressivamente. Ideal para iniciantes e intermediários.',
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:12, repsMax:15, intensityPct:50, restSeconds:60, rpe:'4-5', volDelta:-40 };
      const p = (week - 1) / (totalWeeks - 1);
      const phases = [
        { label:'Adaptação',   sets:3, repsMin:15, repsMax:20, intensityPct:55, restSeconds:60,  rpe:'5-6' },
        { label:'Hipertrofia', sets:4, repsMin:10, repsMax:12, intensityPct:68, restSeconds:90,  rpe:'7-8' },
        { label:'Força',       sets:4, repsMin:6,  repsMax:8,  intensityPct:78, restSeconds:120, rpe:'8-9' },
        { label:'Pico',        sets:5, repsMin:3,  repsMax:5,  intensityPct:87, restSeconds:180, rpe:'9'   },
      ];
      const idx = Math.min(Math.floor(p * phases.length), phases.length - 1);
      return { ...phases[idx], phase: phases[idx].label, volDelta: idx === 0 ? 0 : -5 };
    }
  },

  // 2. LINEAR REVERSA
  // Referência: Prestes et al. (2009) — Reverse Linear Periodization
  // Intensidade ↓ | Volume ↑ — Ideal para RML/emagrecimento
  reverse_linear: {
    id: 'reverse_linear', label: 'Linear Reversa', color: '#8b5cf6',
    type: 'strength',
    desc: 'Inicia com alta intensidade e migra para alto volume. Ideal para resistência muscular e emagrecimento.',
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:12, repsMax:15, intensityPct:55, restSeconds:60, rpe:'4-5', volDelta:-40 };
      const p = (week - 1) / (totalWeeks - 1);
      const phases = [
        { label:'Força Base',      sets:5, repsMin:3,  repsMax:5,  intensityPct:85, restSeconds:180, rpe:'9'   },
        { label:'Hipertrofia',     sets:4, repsMin:8,  repsMax:10, intensityPct:72, restSeconds:120, rpe:'7-8' },
        { label:'Resistência',     sets:3, repsMin:12, repsMax:15, intensityPct:62, restSeconds:75,  rpe:'6-7' },
        { label:'Resist. Máx.',    sets:3, repsMin:18, repsMax:25, intensityPct:50, restSeconds:45,  rpe:'6'   },
      ];
      const idx = Math.min(Math.floor(p * phases.length), phases.length - 1);
      return { ...phases[idx], phase: phases[idx].label, volDelta: idx === 0 ? 0 : +5 };
    }
  },

  // 3. DUP — Daily Undulating Periodization
  // Referência: Rhea et al. (2002), Zourdos et al. (2016)
  // 3 sessões/sem com estímulos diferentes: Força / Hipertrofia / Metabólico
  undulating: {
    id: 'undulating', label: 'Ondulatória (DUP)', color: '#f59e0b',
    type: 'strength',
    desc: 'Daily Undulating Periodization: alterna Força, Hipertrofia e Metabólico na mesma semana.',
    sessions: [
      { type:'A', label:'Força',       sets:5, repsMin:3,  repsMax:5,  intensityPct:85, restSeconds:180, rpe:'9',   icon:'💪' },
      { type:'B', label:'Hipertrofia', sets:4, repsMin:8,  repsMax:12, intensityPct:72, restSeconds:90,  rpe:'7-8', icon:'🏋️' },
      { type:'C', label:'Metabólico',  sets:3, repsMin:15, repsMax:20, intensityPct:60, restSeconds:45,  rpe:'6',   icon:'🔥' },
    ],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:12, repsMax:15, intensityPct:55, restSeconds:60, rpe:'4-5', volDelta:-40 };
      const mult = 1 + ((week - 1) * 0.025);
      return { phase:'Ondulatória', sets:'3-5', repsMin:3, repsMax:20, intensityPct:72, restSeconds:90, rpe:'7-8', loadMultiplier:mult, volDelta:0 };
    }
  },

  // 4. BLOCOS (Block/MST)
  // Referência: Issurin (2008, 2010) — Block Periodization
  // Acumulação → Intensificação → Realização
  block: {
    id: 'block', label: 'Blocos (MST)', color: '#ef4444',
    type: 'strength',
    desc: 'Mesociclos específicos: Acumulação (volume alto), Intensificação (carga alta), Realização (pico).',
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:12, repsMax:15, intensityPct:50, restSeconds:60, rpe:'4-5', volDelta:-40 };
      const third = Math.ceil(totalWeeks / 3);
      if (week <= third)
        return { phase:'Acumulação',    sets:5, repsMin:12, repsMax:15, intensityPct:63, restSeconds:60,  rpe:'6-7', volDelta:+5  };
      else if (week <= third * 2)
        return { phase:'Intensificação', sets:4, repsMin:6,  repsMax:8,  intensityPct:78, restSeconds:120, rpe:'8-9', volDelta:-10 };
      else
        return { phase:'Realização',    sets:5, repsMin:2,  repsMax:4,  intensityPct:92, restSeconds:300, rpe:'9-10',volDelta:-20 };
    }
  },

  // 5. CONJUGADA (Westside Barbell)
  // Referência: Simmons (2007) — Westside Barbell Method
  // ME (max effort 90-100%) + DE (dynamic effort 50-60% veloz)
  conjugate: {
    id: 'conjugate', label: 'Conjugada (Westside)', color: '#ec4899',
    type: 'strength',
    desc: 'Westside: alterna Esforço Máximo (90-100% 1RM) e Esforço Dinâmico (50-60% 1RM com velocidade).',
    sessions: [
      { type:'ME', label:'Esforço Máximo',   sets:5, repsMin:1, repsMax:3, intensityPct:95, restSeconds:300, rpe:'10',  icon:'🏆' },
      { type:'DE', label:'Esforço Dinâmico', sets:8, repsMin:2, repsMax:3, intensityPct:55, restSeconds:60,  rpe:'7',   icon:'💨' },
    ],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:5, repsMax:8, intensityPct:55, restSeconds:120, rpe:'5', volDelta:-40 };
      return { phase:'Conjugada', sets:'5-8', repsMin:1, repsMax:3, intensityPct:75, restSeconds:180, rpe:'8-10', volDelta:0 };
    }
  },

  // 6. CONCORRENTE — Força + Cardio
  // Referência: Wilson et al. (2012) — Concurrent Training
  concurrent: {
    id: 'concurrent', label: 'Concorrente', color: '#10b981',
    type: 'strength',
    desc: 'Alterna força (mantém massa magra) e metabólico (queima gordura via EPOC). Ideal para emagrecimento.',
    sessions: [
      { type:'S', label:'Força',      sets:4, repsMin:8,  repsMax:12, intensityPct:70, restSeconds:90, rpe:'7-8', icon:'💪' },
      { type:'M', label:'Metabólico', sets:3, repsMin:15, repsMax:20, intensityPct:58, restSeconds:30, rpe:'6-7', icon:'🔥' },
    ],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sets:2, repsMin:12, repsMax:15, intensityPct:50, restSeconds:60, rpe:'4-5', volDelta:-40 };
      const isForceWeek = week % 2 !== 0;
      return isForceWeek
        ? { phase:'Semana Força',      sets:4, repsMin:8,  repsMax:12, intensityPct:70, restSeconds:90, rpe:'7-8', volDelta:0  }
        : { phase:'Semana Metabólica', sets:3, repsMin:15, repsMax:20, intensityPct:58, restSeconds:30, rpe:'6-7', volDelta:+5 };
    }
  },
};

// ── MODELOS DE CARDIO/ENDURANCE ───────────────────────────────

export const CARDIO_PERIODIZATION_MODELS = {

  // HIIT — High Intensity Interval Training
  // Referência: Tabata et al. (1996), Gibala et al. (2006)
  // Intervalos curtos e intensos (85-100% VO2max) intercalados com recuperação
  hiit: {
    id: 'hiit', label: 'HIIT', color: '#ef4444',
    type: 'cardio',
    desc: 'High Intensity Interval Training: sprints de alta intensidade com recuperação ativa. Melhora VO₂max e EPOC.',
    zonesUsed: ['Z4','Z5'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Zona 2 contínuo', duration:30, intensity:'60-65% FC', ratio:'—', intervals:0, workInterval:0, restInterval:0, vo2pct:65, rpe:'4-5' };
      const p = (week - 1) / (totalWeeks - 1);
      // Progressão: aumentar volume de intervalos gradualmente
      const intervals = Math.round(4 + p * 4);        // 4 → 8 repetições
      const workInt   = Math.round(30 + p * 30);      // 30s → 60s
      const restInt   = Math.round(90 - p * 30);      // 90s → 60s (diminui recuperação)
      const intensity = p < 0.33 ? '85-90% FC' : p < 0.66 ? '90-95% FC' : '95-100% FC';
      return {
        phase: week <= Math.ceil(totalWeeks*0.3) ? 'Base HIIT' : week <= Math.ceil(totalWeeks*0.7) ? 'Desenvolvimento' : 'Pico',
        sessionType: `${intervals}×${workInt}s / ${restInt}s recuperação`,
        duration: Math.round((intervals * (workInt + restInt)) / 60 + 10),
        intensity, intervals, workInterval:workInt, restInterval:restInt,
        vo2pct: Math.round(85 + p * 12), rpe: p < 0.5 ? '7-8' : '8-9',
        progressionNote: `+${Math.round(p*10)}% volume vs sem. 1`
      };
    }
  },

  // SIT — Sprint Interval Training
  // Referência: Burgomaster et al. (2005, 2008), Gibala et al. (2006)
  // Sprints all-out (≥100% VO2max) muito curtos. Máxima intensidade.
  sit: {
    id: 'sit', label: 'SIT (Sprint Intervals)', color: '#f97316',
    type: 'cardio',
    desc: 'Sprint Interval Training: esforços all-out de 20-30s com recuperação longa. Protocolo Wingate-based.',
    zonesUsed: ['Z5'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Zona 1-2 ativo', duration:25, intensity:'55-65% FC', ratio:'—', intervals:0, workInterval:0, restInterval:0, vo2pct:62, rpe:'3-4' };
      const p = (week - 1) / (totalWeeks - 1);
      const intervals = Math.round(4 + p * 2);   // 4 → 6 sprints
      const workInt   = 30;                       // 30s fixo (Wingate protocol)
      const restInt   = Math.round(240 - p * 60); // 4min → 3min (reduz recuperação)
      return {
        phase: week <= Math.ceil(totalWeeks*0.4) ? 'Introdução SIT' : 'SIT Completo',
        sessionType: `${intervals}×30s sprints / ${Math.round(restInt/60)}min recuperação`,
        duration: Math.round((intervals * (workInt + restInt)) / 60 + 8),
        intensity: '≥ 100% VO₂max / All-out', intervals, workInterval:workInt, restInterval:restInt,
        vo2pct: 110, rpe: '9-10',
        progressionNote: `Reduzir recuperação para ${Math.round(restInt/60)}min`
      };
    }
  },

  // POLARIZADO
  // Referência: Seiler & Tønnessen (2009), Stöggl & Sperlich (2014)
  // 80% volume em Zona 2 (baixa intensidade) + 20% em Zona 4-5 (alta)
  // Evita a "zona cinza" (Z3) — comprovadamente superior ao threshold training
  polarized: {
    id: 'polarized', label: 'Polarizado', color: '#8b5cf6',
    type: 'cardio',
    desc: '80% do tempo em Zona 2 + 20% em Zona 4-5. Evita a zona cinza (Z3). Modelo de elite mundial.',
    zonesUsed: ['Z2','Z4','Z5'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Apenas Zona 1-2', duration:30, intensity:'55-65% FC', ratio:'100% Z2', z2sessions:2, hiSessions:0, vo2pct:60, rpe:'4-5' };
      const p = (week - 1) / (totalWeeks - 1);
      const totalVol = Math.round(180 + p * 120); // 180 → 300 min/semana
      const z2min    = Math.round(totalVol * 0.80);
      const hiMin    = Math.round(totalVol * 0.20);
      const hiIntervals = Math.round(4 + p * 4);
      return {
        phase: week <= Math.ceil(totalWeeks*0.3) ? 'Base Aeróbica' : week <= Math.ceil(totalWeeks*0.7) ? 'Desenvolvimento' : 'Pico',
        sessionType: `${Math.round(z2min/60)}h Z2 + ${hiIntervals}×4min Z4-5`,
        duration: totalVol, z2minutes: z2min, hiMinutes: hiMin,
        z2sessions: 3, hiSessions: 2,
        intensity: '65-75% FC (Z2) + 85-95% FC (Z4-5)',
        ratio: '80% Z2 / 20% Z4-5', vo2pct: Math.round(65 + p*15),
        rpe: '4-5 (Z2) / 7-8 (Z4-5)', hiIntervals,
        progressionNote: `+${Math.round(p*10)}% volume total`
      };
    }
  },

  // BASE AERÓBICA — Zona 2 Puro
  // Referência: Maffetone, Inigo San Millán, Phil Maffetone
  // Treino contínuo em Zona 2 para desenvolvimento de mitocôndrias e capacidade aeróbica
  zone2: {
    id: 'zone2', label: 'Base Aeróbica (Zona 2)', color: '#10b981',
    type: 'cardio',
    desc: 'Treino contínuo em Zona 2 para desenvolvimento mitocondrial e capacidade aeróbica. Método Maffetone.',
    zonesUsed: ['Z2'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Zona 1 ativo', duration:20, intensity:'55-60% FC', ratio:'Z1', vo2pct:58, rpe:'3-4' };
      const p = (week - 1) / (totalWeeks - 1);
      const duration = Math.round(30 + p * 60); // 30min → 90min
      const sessionsPerWeek = p < 0.4 ? 3 : p < 0.7 ? 4 : 5;
      return {
        phase: week <= Math.ceil(totalWeeks*0.3) ? 'Base Z2' : week <= Math.ceil(totalWeeks*0.7) ? 'Desenvolvimento Z2' : 'Alto Volume Z2',
        sessionType: `${sessionsPerWeek}×${duration}min Zona 2`,
        duration, sessionsPerWeek, intensity: '65-75% FC / ~65% VO₂max',
        ratio: '100% Z2', vo2pct: 65, rpe: '4-5',
        progressionNote: `${duration}min/sessão · ${sessionsPerWeek} sessões`
      };
    }
  },

  // LOW VOLUME HIIT (LVHIIT)
  // Referência: Gillen et al. (2016), Little et al. (2011)
  // Máxima eficiência em pouco tempo — 3×10min/sem com impacto similar a treino contínuo
  lvhiit: {
    id: 'lvhiit', label: 'HIIT Low-Volume', color: '#06b6d4',
    type: 'cardio',
    desc: 'Low-Volume HIIT: 3×/semana, 10min/sessão. Máxima eficiência para quem tem pouco tempo.',
    zonesUsed: ['Z4','Z5'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Zona 1-2 ativo', duration:15, intensity:'60-65% FC', ratio:'—', intervals:0, vo2pct:62, rpe:'3-4' };
      const p = (week - 1) / (totalWeeks - 1);
      const intervals = Math.round(3 + p * 7);     // 3 → 10 repetições
      const workInt   = 60;                          // 60s fixo
      const restInt   = 75;                          // 75s recuperação
      return {
        phase: week <= Math.ceil(totalWeeks*0.4) ? 'Adaptação LV-HIIT' : 'LV-HIIT Completo',
        sessionType: `${intervals}×60s / 75s recuperação`,
        duration: Math.round((intervals * (workInt + restInt)) / 60 + 5),
        intensity: '85-95% FC', intervals, workInterval:workInt, restInterval:restInt,
        vo2pct: Math.round(85 + p*8), rpe: '7-8',
        progressionNote: `Protocolo Little et al. (2011) — ${intervals} intervalos`
      };
    }
  },

  // PYRAMIDAL
  // Referência: Muñoz et al. (2014), Neal et al. (2013)
  // 75% Z2 + 20% Z3 (threshold) + 5% Z4-5 — entre polarizado e threshold
  pyramidal: {
    id: 'pyramidal', label: 'Pyramidal', color: '#f59e0b',
    type: 'cardio',
    desc: '75% Z2 + 20% Z3 (limiar) + 5% Z4-5. Usado em atletas de resistência intermediários.',
    zonesUsed: ['Z2','Z3','Z4'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Apenas Z1-2', duration:30, intensity:'55-70% FC', ratio:'100% Z1-2', vo2pct:62, rpe:'4-5' };
      const p = (week - 1) / (totalWeeks - 1);
      const totalVol = Math.round(150 + p * 150);
      const z2min    = Math.round(totalVol * 0.75);
      const z3min    = Math.round(totalVol * 0.20);
      const z4min    = Math.round(totalVol * 0.05);
      return {
        phase: week <= Math.ceil(totalWeeks*0.4) ? 'Base Pyramidal' : 'Pyramidal Completo',
        sessionType: `${Math.round(z2min/60)}h Z2 + ${z3min}min Z3 + ${z4min}min Z4-5`,
        duration: totalVol, z2minutes:z2min, z3minutes:z3min, z4minutes:z4min,
        intensity: '65-75% FC (Z2) · 78-88% FC (Z3) · >88% FC (Z4-5)',
        ratio: '75% Z2 / 20% Z3 / 5% Z4-5', vo2pct: Math.round(68 + p*12),
        rpe: '4-6 médio', progressionNote: `+${Math.round(p*10)}% volume`
      };
    }
  },

  // THRESHOLD (Limiar)
  // Referência: Esteve-Lanao et al. (2007), Jeukendrup (1998)
  // Treino contínuo ou intervals ao redor do limiar anaeróbio (Z3-4)
  threshold: {
    id: 'threshold', label: 'Threshold (Limiar)', color: '#eab308',
    type: 'cardio',
    desc: 'Tempo runs e intervalos longos na zona de limiar anaeróbio (Z3-4). Popular em corredores.',
    zonesUsed: ['Z3','Z4'],
    buildWeek: (week, totalWeeks, deloadEvery) => {
      if (deloadEvery > 0 && week % deloadEvery === 0)
        return { phase:'Deload', sessionType:'Zona 1-2 ativo', duration:25, intensity:'60-70% FC', ratio:'—', vo2pct:62, rpe:'4-5' };
      const p = (week - 1) / (totalWeeks - 1);
      const thresholdMin = Math.round(20 + p * 40); // 20 → 60min
      return {
        phase: week <= Math.ceil(totalWeeks*0.3) ? 'Tempo Runs' : week <= Math.ceil(totalWeeks*0.7) ? 'Threshold Intervals' : 'Threshold Pico',
        sessionType: p < 0.5 ? `Tempo Run ${thresholdMin}min contínuo` : `4-6×${Math.round(thresholdMin/5)}min / 2min recuperação`,
        duration: thresholdMin + 20,
        intensity: '78-88% FC / limiar anaeróbio',
        ratio: '70% Z3 / 30% Z4', vo2pct: Math.round(75 + p*10), rpe: '6-7',
        progressionNote: `${thresholdMin}min no limiar`
      };
    }
  },
};

// ── OBJETIVOS ─────────────────────────────────────────────────

export const TRAINING_GOALS = [
  { id:'hypertrophy',  label:'Hipertrofia Muscular',      suggested:['linear','undulating'],           type:'strength', icon:'💪' },
  { id:'fat_loss',     label:'Emagrecimento',              suggested:['concurrent','undulating'],       type:'strength', icon:'🔥' },
  { id:'strength',     label:'Força Máxima',               suggested:['block','conjugate'],             type:'strength', icon:'🏋️' },
  { id:'power',        label:'Potência/Explosão',          suggested:['conjugate','block'],             type:'strength', icon:'⚡' },
  { id:'rml',          label:'Resistência Muscular',       suggested:['reverse_linear','concurrent'],   type:'strength', icon:'🔄' },
  { id:'health',       label:'Saúde e Qualidade de Vida',  suggested:['linear','undulating'],           type:'strength', icon:'❤️' },
  { id:'body_recomp',  label:'Recomposição Corporal',      suggested:['concurrent','undulating'],       type:'strength', icon:'⚖️' },
  // Cardio
  { id:'vo2max',       label:'Melhorar VO₂max',            suggested:['hiit','sit','polarized'],        type:'cardio',   icon:'🫀' },
  { id:'aerobic_base', label:'Base Aeróbica',              suggested:['zone2','polarized'],             type:'cardio',   icon:'🏃' },
  { id:'performance',  label:'Performance Endurance',      suggested:['polarized','pyramidal','threshold'], type:'cardio', icon:'🏅' },
  { id:'fat_loss_c',   label:'Emagrecimento (Cardio)',     suggested:['hiit','lvhiit','concurrent'],    type:'cardio',   icon:'🔥' },
  { id:'time_eff',     label:'Eficiência de Tempo',        suggested:['lvhiit','sit'],                  type:'cardio',   icon:'⏱️' },
];

export const ALL_MODELS = { ...PERIODIZATION_MODELS, ...CARDIO_PERIODIZATION_MODELS };

// ── GERADOR CIENTÍFICO DE PROGRESSÃO ─────────────────────────

export function generateProgression(config) {
  const { model, totalWeeks, deloadEvery, exercises = [] } = config;
  const isCardio  = !!CARDIO_PERIODIZATION_MODELS[model];
  const modelDef  = ALL_MODELS[model] || PERIODIZATION_MODELS.linear;

  const weekSchedule = [];
  for (let w = 1; w <= totalWeeks; w++) {
    const wk = modelDef.buildWeek(w, totalWeeks, deloadEvery || 0);
    weekSchedule.push({ week: w, ...wk });
  }

  if (isCardio) {
    // Para modelos de cardio, não gera progressão por exercício
    return { weekSchedule, exerciseProgression: [], modelDef, isCardio: true };
  }

  // Progressão por exercício para modelos de força
  const exerciseProgression = exercises.map(ex => {
    const baseLoad      = parseFloat(ex.initialLoadKg) || 20;
    const estimated1RM  = baseLoad / 0.70;
    const weeks = weekSchedule.map(wk => {
      const isDeload = wk.phase === 'Deload';
      const loadKg   = isDeload
        ? Math.round(baseLoad * 0.6 * 2) / 2
        : Math.round((estimated1RM * (wk.intensityPct / 100)) * 2) / 2;
      const repsDisplay = (typeof wk.repsMin === 'number' && wk.repsMin === wk.repsMax)
        ? String(wk.repsMin) : `${wk.repsMin}-${wk.repsMax}`;
      return {
        week: wk.week, phase: wk.phase, sets: wk.sets, reps: repsDisplay,
        loadKg: Math.max(loadKg, 5), intensityPct: wk.intensityPct,
        restSeconds: wk.restSeconds, rpe: wk.rpe, isDeload,
      };
    });
    return { exerciseId: ex.id, name: ex.name, initialLoadKg: baseLoad, weeks };
  });

  return { weekSchedule, exerciseProgression, modelDef, isCardio: false };
}

// ── UTILITÁRIOS ───────────────────────────────────────────────

export function formatRest(seconds) {
  if (seconds >= 60) return `${Math.floor(seconds/60)}min${seconds%60?` ${seconds%60}s`:''}`;
  return `${seconds}s`;
}

export function getModelById(id) { return ALL_MODELS[id] || null; }
export function getGoalById(id)  { return TRAINING_GOALS.find(g => g.id === id) || null; }

export function intensityColor(pct, isDeload) {
  if (isDeload)  return '#3b82f6';
  if (pct >= 90) return '#ef4444';
  if (pct >= 80) return '#f97316';
  if (pct >= 70) return '#eab308';
  return '#22c55e';
}

// Validação científica de um macrociclo gerado
export function validateMacrocycle(weekSchedule, model) {
  const warnings = [];
  const isCardio = !!CARDIO_PERIODIZATION_MODELS[model];

  if (!isCardio) {
    // Verificar progressão de intensidade no linear
    if (model === 'linear') {
      const intensities = weekSchedule.filter(w=>!w.isDeload&&w.phase!=='Deload').map(w=>w.intensityPct);
      const isProgressive = intensities.every((v,i) => i===0 || v >= intensities[i-1] - 5);
      if (!isProgressive) warnings.push('⚠️ Modelo linear deve ter intensidade progressiva. Verifique o deload.');
    }
    // Verificar se há deload adequado
    const hasDeload = weekSchedule.some(w => w.phase === 'Deload');
    if (weekSchedule.length >= 8 && !hasDeload)
      warnings.push('⚠️ Macrociclos ≥ 8 semanas devem incluir semanas de deload (a cada 4 semanas).');
    // Intensidade máxima
    const maxIntensity = Math.max(...weekSchedule.map(w => w.intensityPct || 0));
    if (maxIntensity > 100)
      warnings.push('⚠️ Intensidade acima de 100% não é sustentável. Reduza a progressão.');
  }

  return { valid: warnings.length === 0, warnings };
}
