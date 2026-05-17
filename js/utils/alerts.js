// ========================================
// PERSONAL PRO — Alerts & Biofeedback Analysis
// ========================================

export const PAIN_REGIONS = [
  { id: 'cervical',    label: 'Cervical / Pescoço' },
  { id: 'ombro_d',    label: 'Ombro Direito' },
  { id: 'ombro_e',    label: 'Ombro Esquerdo' },
  { id: 'cotovelo',   label: 'Cotovelo' },
  { id: 'pulso',      label: 'Punho / Mão' },
  { id: 'toracica',   label: 'Coluna Torácica' },
  { id: 'lombar',     label: 'Lombar' },
  { id: 'quadril',    label: 'Quadril / Glúteo' },
  { id: 'joelho_d',   label: 'Joelho Direito' },
  { id: 'joelho_e',   label: 'Joelho Esquerdo' },
  { id: 'tornozelo',  label: 'Tornozelo / Pé' },
  { id: 'abdominal',  label: 'Abdômen' },
  { id: 'peito',      label: 'Peito / Costelas' },
  { id: 'outro',      label: 'Outro local' },
];

// Analisar um registro de biofeedback e retornar alertas
export function analyzeBiofeedback(entry) {
  if (!entry) return [];
  const alerts = [];
  const sleep  = entry.sleep  || 0;
  const stress = entry.stress || 0;
  const pain   = entry.pain   || 0;
  const energy = entry.energy || 0;
  const mood   = entry.mood   || 0;
  const pse    = entry.pse    || 0;

  if (sleep < 5 && sleep > 0) {
    alerts.push({
      type: 'warning', metric: 'Sono', value: sleep,
      message: `Sono baixo (${sleep}/10)`,
      action: 'Orientar higiene do sono. Considerar reduzir intensidade desta sessão.',
      icon: '😴',
    });
  }
  if (stress >= 8) {
    alerts.push({
      type: 'danger', metric: 'Estresse', value: stress,
      message: `Estresse muito alto (${stress}/10)`,
      action: 'Alto estresse compromete recuperação. Considerar sessão leve ou adaptógenos.',
      icon: '⚠️',
    });
  } else if (stress >= 6) {
    alerts.push({
      type: 'warning', metric: 'Estresse', value: stress,
      message: `Estresse elevado (${stress}/10)`,
      action: 'Monitorar. Evitar treinos de alta intensidade se persistir.',
      icon: '⚠️',
    });
  }
  if (pain >= 6) {
    alerts.push({
      type: 'danger', metric: 'Dor', value: pain,
      message: `Dor intensa (${pain}/10)`,
      action: 'Investigar origem. Suspender exercícios que piorem a dor. Considerar avaliação médica.',
      icon: '🚨',
    });
  } else if (pain >= 3) {
    alerts.push({
      type: 'warning', metric: 'Dor', value: pain,
      message: `Dor moderada (${pain}/10)`,
      action: 'Adaptar exercícios. Evitar movimentos que piorem a dor.',
      icon: '⚠️',
    });
  }
  if (energy <= 3 && energy > 0) {
    alerts.push({
      type: 'info', metric: 'Energia', value: energy,
      message: `Energia muito baixa (${energy}/10)`,
      action: 'Verificar alimentação pré-treino e qualidade do sono.',
      icon: '🔋',
    });
  }
  if (pse >= 9) {
    alerts.push({
      type: 'warning', metric: 'PSE', value: pse,
      message: `PSE muito alta (${pse}/10)`,
      action: 'Treino excessivamente intenso. Verificar progressão e recuperação.',
      icon: '💪',
    });
  }

  return alerts;
}

// Status geral do aluno baseado nos últimos dados
export function overallStatus(entry) {
  if (!entry) return { label: 'Sem dados', color: 'info' };
  const sleep  = entry.sleep  || 5;
  const stress = entry.stress || 5;
  const pain   = entry.pain   || 0;
  const energy = entry.energy || 5;

  const score = (sleep / 10) + ((10 - stress) / 10) + ((10 - pain) / 10) + (energy / 10);
  const avg   = score / 4;

  if (avg >= 0.75) return { label: 'Ótimo',    color: 'success' };
  if (avg >= 0.60) return { label: 'Bom',       color: 'primary' };
  if (avg >= 0.45) return { label: 'Regular',   color: 'warning' };
  return               { label: 'Atenção',   color: 'danger' };
}

// Recomendação de treino baseada no biofeedback
export function trainingRecommendation(entry) {
  if (!entry) return { label: 'Sem dados', intensity: null };
  const sleep  = entry.sleep  || 5;
  const stress = entry.stress || 5;
  const pain   = entry.pain   || 0;
  const energy = entry.energy || 5;
  const mood   = entry.mood   || 5;

  // Situações críticas
  if (pain >= 7)   return { label: 'Suspender treino — avaliar dor',           intensity: 0, color: 'danger' };
  if (sleep < 4)   return { label: 'Treino muito leve ou descanso',            intensity: 30, color: 'warning' };
  if (stress >= 9) return { label: 'Treino leve — alto estresse sistêmico',    intensity: 40, color: 'warning' };

  // Score composto
  const readiness = (sleep + energy + mood + (10 - stress) + (10 - pain)) / 5;

  if (readiness >= 8)  return { label: 'Prontidão excelente — treino normal ou mais intenso', intensity: 100, color: 'success' };
  if (readiness >= 7)  return { label: 'Boa prontidão — treino normal',                       intensity: 90,  color: 'success' };
  if (readiness >= 6)  return { label: 'Prontidão razoável — treino moderado',                intensity: 75,  color: 'primary' };
  if (readiness >= 5)  return { label: 'Prontidão baixa — reduzir volume 20-30%',             intensity: 60,  color: 'warning' };
  return                      { label: 'Prontidão muito baixa — treino leve ou descanso',     intensity: 40,  color: 'danger' };
}
