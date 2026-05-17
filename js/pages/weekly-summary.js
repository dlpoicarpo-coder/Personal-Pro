// ========================================
// PERSONAL PRO — Weekly Summary Page (v2)
// Resumo por aluno + visão geral + WhatsApp + gráficos
// ========================================
import db from '../db.js';
import { Calc } from '../utils/calculations.js';
import { notify } from '../components/toast.js';
import { sendWhatsApp } from '../utils/whatsapp.js';

const ICON_WA = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function getWeekBounds(offsetWeeks = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + (offsetWeeks * 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

function buildStudentWeekData(s, sessions, biofeedback, weekStart, weekEnd, prevStart) {
  const inWeek   = x => new Date(x.date) >= weekStart && new Date(x.date) < weekEnd;
  const inPrev   = x => new Date(x.date) >= prevStart && new Date(x.date) < weekStart;
  const isStudent= x => x.studentId === s.id;

  const wkSess   = sessions.filter(x => isStudent(x) && x.status === 'completed' && inWeek(x));
  const prevSess = sessions.filter(x => isStudent(x) && x.status === 'completed' && inPrev(x));
  const wkBf     = biofeedback.filter(x => isStudent(x) && inWeek(x));

  const totalVolume   = wkSess.reduce((t, x) => t + (x.totalVolume || 0), 0);
  const totalDuration = wkSess.reduce((t, x) => t + (x.totalDuration || 0), 0);
  const totalSets     = wkSess.reduce((t, x) => t + (x.totalSets || 0), 0);
  const avgPse        = wkBf.length ? wkBf.reduce((t, b) => t + (b.pse || 0), 0) / wkBf.length : null;
  const avgSleep      = wkBf.length ? wkBf.reduce((t, b) => t + (b.sleep || 0), 0) / wkBf.length : null;
  const avgStress     = wkBf.length ? wkBf.reduce((t, b) => t + (b.stress || 0), 0) / wkBf.length : null;
  const avgEnergy     = wkBf.length ? wkBf.reduce((t, b) => t + (b.energy || 0), 0) / wkBf.length : null;
  const weekLoad      = wkBf.reduce((t, b) => t + (b.trainingLoad || 0), 0);

  // ACWR — 4 semanas anteriores
  const chronic4 = [];
  for (let i = 1; i <= 4; i++) {
    const ws = new Date(weekStart); ws.setDate(ws.getDate() - 7 * i);
    const we = new Date(ws); we.setDate(we.getDate() + 7);
    chronic4.push(biofeedback.filter(b => b.studentId === s.id && new Date(b.date) >= ws && new Date(b.date) < we).reduce((t, b) => t + (b.trainingLoad || 0), 0));
  }
  const chronicAvg = chronic4.reduce((t, l) => t + l, 0) / 4;
  const acwr       = Calc.acwr(weekLoad, chronicAvg);
  const acwrC      = Calc.acwrClassificacao(acwr);
  const diff       = wkSess.length - prevSess.length;

  // Melhor sessão (maior volume)
  const bestSession = wkSess.sort((a, b) => (b.totalVolume || 0) - (a.totalVolume || 0))[0];

  return { wkSess, prevSess, wkBf, totalVolume, totalDuration, totalSets, avgPse, avgSleep, avgStress, avgEnergy, weekLoad, acwr, acwrC, diff, bestSession };
}

function buildWhatsAppMessage(s, data, weekLabel) {
  const fmt = v => v !== null && v !== undefined ? Number(v).toFixed(1) : '—';
  const lines = [
    `📊 *Resumo Semanal — Personal PRO*`,
    `Aluno: ${s.name}`,
    `Semana: ${weekLabel}`,
    ``,
    `🏋 *Treinos*`,
    `• Sessões realizadas: ${data.wkSess.length}`,
    `• Volume total: ${data.totalVolume}kg`,
    `• Duração total: ${Math.round(data.totalDuration / 60)}min`,
    `• Total de séries: ${data.totalSets}`,
    ``,
    `💤 *Bem-estar*`,
    `• Sono médio: ${fmt(data.avgSleep)}/10`,
    `• Energia média: ${fmt(data.avgEnergy)}/10`,
    `• Estresse médio: ${fmt(data.avgStress)}/10`,
    `• PSE médio: ${fmt(data.avgPse)}/10`,
    ``,
    `📈 *Carga de Treino*`,
    `• Carga semanal: ${data.weekLoad}`,
    `• ACWR: ${data.acwr.toFixed(2)} (${data.acwrC.label})`,
    ``,
    `Continue assim! 💪`,
  ];
  return lines.join('\n');
}

export async function renderWeeklySummary() {
  const students    = (await db.getAll('students')).filter(s => s.status === 'Ativo');
  const sessions    = await db.getAll('sessions');
  const biofeedback = await db.getAll('biofeedback');
  const schedules   = await db.getAll('schedules');

  const { start: weekStart, end: weekEnd } = getWeekBounds(0);
  const prevStart = new Date(weekStart); prevStart.setDate(prevStart.getDate() - 7);

  const weekLabel = `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} – ${new Date(weekEnd.getTime() - 1).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

  // Dados agregados de todos os alunos
  let totalSessAll = 0, totalVolAll = 0, totalDurAll = 0;
  const studentsData = students.map(s => {
    const d = buildStudentWeekData(s, sessions, biofeedback, weekStart, weekEnd, prevStart);
    totalSessAll += d.wkSess.length;
    totalVolAll  += d.totalVolume;
    totalDurAll  += d.totalDuration;
    return { s, d };
  });

  const withActivity = studentsData.filter(({ d }) => d.wkSess.length > 0 || d.wkBf.length > 0);
  const withoutActivity = studentsData.filter(({ d }) => d.wkSess.length === 0 && d.wkBf.length === 0);

  // Agendados esta semana
  const scheduledThisWeek = schedules.filter(e => {
    const d = new Date(e.date + 'T12:00:00');
    return d >= weekStart && d < weekEnd;
  });
  const adherenceRate = scheduledThisWeek.length > 0
    ? Math.round((scheduledThisWeek.filter(e => e.status === 'completed').length / scheduledThisWeek.length) * 100)
    : null;

  return `
    <div class="page-header">
      <div>
        <h1>Resumo Semanal</h1>
        <p class="subtitle">${weekLabel}</p>
      </div>
      <div class="flex gap-sm">
        <button class="btn btn-secondary btn-sm" id="prevWeekBtn">← Semana anterior</button>
        <button class="btn btn-ghost btn-sm" id="currentWeekBtn">Semana atual</button>
        <button class="btn btn-primary btn-sm" id="sendAllBtn">${ICON_WA} Enviar para todos</button>
      </div>
    </div>

    <!-- Stats gerais -->
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px">
      <div class="stat-card" style="text-align:center;padding:12px">
        <div class="stat-label">ALUNOS ATIVOS</div>
        <div class="stat-value text-gradient">${withActivity.length}</div>
        <div class="stat-change">de ${students.length} cadastrados</div>
      </div>
      <div class="stat-card" style="text-align:center;padding:12px">
        <div class="stat-label">SESSÕES</div>
        <div class="stat-value" style="color:var(--primary)">${totalSessAll}</div>
        <div class="stat-change">esta semana</div>
      </div>
      <div class="stat-card" style="text-align:center;padding:12px">
        <div class="stat-label">VOLUME TOTAL</div>
        <div class="stat-value" style="color:var(--accent)">${totalVolAll}kg</div>
        <div class="stat-change">todos os alunos</div>
      </div>
      <div class="stat-card" style="text-align:center;padding:12px">
        <div class="stat-label">DURAÇÃO TOTAL</div>
        <div class="stat-value" style="color:var(--warning)">${Math.round(totalDurAll / 60)}min</div>
        <div class="stat-change">treino acumulado</div>
      </div>
      <div class="stat-card" style="text-align:center;padding:12px">
        <div class="stat-label">ADESÃO</div>
        <div class="stat-value" style="color:${adherenceRate===null?'var(--text-muted)':adherenceRate>=70?'var(--success)':'var(--danger)'}">
          ${adherenceRate !== null ? adherenceRate + '%' : '—'}
        </div>
        <div class="stat-change">${scheduledThisWeek.length} agendados</div>
      </div>
    </div>

    <!-- Cards por aluno com atividade -->
    <div id="weeklySummaryContent" class="stagger-children">
      ${withActivity.length ? withActivity.map(({ s, d }) => renderStudentCard(s, d, weekLabel)).join('') : ''}

      ${withoutActivity.length ? `
      <div class="card mt-md" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.03)">
        <div class="card-header">
          <span class="card-title" style="color:var(--danger)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:6px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Sem atividade esta semana (${withoutActivity.length})
          </span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${withoutActivity.map(({ s }) => `
            <div class="flex items-center gap-sm" style="padding:8px 12px;background:var(--bg-page);border-radius:8px">
              <div class="avatar avatar-sm">${s.name.split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
              <span style="font-size:0.85rem;font-weight:500">${s.name}</span>
              ${s.phone ? `<button class="btn btn-ghost btn-sm wa-nudge" data-name="${s.name.split(' ')[0]}" data-phone="${s.phone}" style="padding:3px 6px;color:#25d366">${ICON_WA}</button>` : ''}
            </div>`).join('')}
        </div>
      </div>` : ''}

      ${!withActivity.length && !withoutActivity.length ? `
      <div class="empty-state">
        <div class="empty-icon">—</div>
        <h3>Nenhuma atividade esta semana</h3>
        <p>Os dados aparecerão conforme as sessões forem registradas</p>
      </div>` : ''}
    </div>
  `;
}

function renderStudentCard(s, d, weekLabel) {
  const fmt  = v => v !== null ? Number(v).toFixed(1) : '—';
  const diff = d.diff;
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const sessionsByDay = [0,1,2,3,4,5,6].map(day => d.wkSess.filter(x => new Date(x.date).getDay() === day).length);

  const intensityColor = (d.avgPse || 0) > 8 ? 'var(--danger)' : (d.avgPse || 0) > 6 ? 'var(--warning)' : 'var(--success)';
  const sleepColor     = (d.avgSleep || 10) < 5 ? 'var(--danger)' : (d.avgSleep || 10) < 7 ? 'var(--warning)' : 'var(--success)';
  const acwrColor      = `var(--${d.acwrC.color})`;

  return `
    <div class="card mb-md student-week-card" data-student="${s.id}">
      <div class="flex items-center gap-md mb-md">
        <div class="avatar avatar-lg">${s.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
        <div style="flex:1">
          <h3 style="margin:0">${s.name}</h3>
          <div class="text-muted text-xs">${s.goal || 'Sem objetivo'} · ${s.weeklyFrequency || '-'}</div>
        </div>
        <div class="flex gap-xs">
          ${s.phone ? `<button class="btn btn-ghost btn-sm wa-summary" data-student="${s.id}" title="Enviar resumo via WhatsApp" style="color:#25d366;display:flex;align-items:center;gap:4px">${ICON_WA} Enviar</button>` : ''}
        </div>
      </div>

      <!-- Stats da semana -->
      <div class="stats-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:12px">
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">SESSÕES</div>
          <div style="font-size:1.5rem;font-weight:800;color:var(--primary)">${d.wkSess.length}</div>
          <div style="font-size:0.68rem;color:${diff>=0?'var(--success)':'var(--danger)'}">
            ${diff===0?'igual':diff>0?'+'+diff:diff} sem. ant.
          </div>
        </div>
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">VOLUME</div>
          <div style="font-size:1.3rem;font-weight:800;color:var(--accent)">${d.totalVolume}kg</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">DURAÇÃO</div>
          <div style="font-size:1.3rem;font-weight:800;color:var(--text-primary)">${Math.round(d.totalDuration/60)}min</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">PSE MÉDIO</div>
          <div style="font-size:1.3rem;font-weight:800;color:${intensityColor}">${fmt(d.avgPse)}</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">SONO MÉD.</div>
          <div style="font-size:1.3rem;font-weight:800;color:${sleepColor}">${fmt(d.avgSleep)}</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:10px">
          <div class="stat-label" style="font-size:0.58rem">ACWR</div>
          <div style="font-size:1.3rem;font-weight:800;color:${acwrColor}">${d.acwr > 0 ? d.acwr.toFixed(2) : '—'}</div>
          <div style="font-size:0.62rem;color:${acwrColor}">${d.acwr > 0 ? d.acwrC.label : ''}</div>
        </div>
      </div>

      <!-- Mini barra semanal por dia -->
      <div style="margin-bottom:12px">
        <div class="text-xs text-muted mb-xs" style="font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Distribuição semanal</div>
        <div style="display:flex;gap:4px;align-items:flex-end;height:36px">
          ${sessionsByDay.map((count, i) => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="width:100%;height:${count > 0 ? 24 : 4}px;background:${count > 0 ? 'var(--primary)' : 'var(--border-color)'};border-radius:3px;transition:height 0.3s"></div>
              <span style="font-size:0.55rem;color:var(--text-muted)">${days[i]}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Sessões detalhadas -->
      ${d.wkSess.length ? `
      <details style="border-top:1px solid var(--border-color);padding-top:10px">
        <summary style="cursor:pointer;font-size:0.78rem;font-weight:600;color:var(--text-muted);list-style:none;display:flex;align-items:center;gap:6px;user-select:none">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          Ver ${d.wkSess.length} sessão(ões) da semana
        </summary>
        <div style="margin-top:8px">
          <table class="data-table" style="font-size:0.78rem">
            <thead><tr><th>Data</th><th>Treino</th><th>Duração</th><th>Volume</th><th>Séries</th><th>PSE</th></tr></thead>
            <tbody>${[...d.wkSess].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(x => `<tr>
              <td>${Calc.formatDate(x.date)}</td>
              <td>${x.workoutName || '-'}</td>
              <td>${Math.round((x.totalDuration||0)/60)}min</td>
              <td style="color:var(--accent);font-weight:600">${Math.round(x.totalVolume || 0)} kg</td>
              <td>${x.totalSets||'-'}</td>
              <td style="color:${(x.postBiofeedback?.pse||0)>8?'var(--danger)':(x.postBiofeedback?.pse||0)>6?'var(--warning)':'var(--success)'}">
                ${x.postBiofeedback?.pse||'-'}
              </td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </details>` : `
      <div style="border-top:1px solid var(--border-color);padding-top:10px">
        <p class="text-xs text-muted">Nenhuma sessão registrada esta semana</p>
      </div>`}
    </div>`;
}

export function initWeeklySummary(navigateFn) {
  let currentOffset = 0;

  const reload = async (offset) => {
    currentOffset = offset;
    const students    = (await db.getAll('students')).filter(s => s.status === 'Ativo');
    const sessions    = await db.getAll('sessions');
    const biofeedback = await db.getAll('biofeedback');
    const schedules   = await db.getAll('schedules');
    const { start: weekStart, end: weekEnd } = getWeekBounds(offset);
    const prevStart = new Date(weekStart); prevStart.setDate(prevStart.getDate() - 7);
    const weekLabel = `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} – ${new Date(weekEnd.getTime() - 1).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

    // Atualizar subtitle
    const subtitle = document.querySelector('.page-header .subtitle');
    if (subtitle) subtitle.textContent = weekLabel;

    const studentsData = students.map(s => ({
      s,
      d: buildStudentWeekData(s, sessions, biofeedback, weekStart, weekEnd, prevStart)
    }));
    const withActivity    = studentsData.filter(({ d }) => d.wkSess.length > 0 || d.wkBf.length > 0);
    const withoutActivity = studentsData.filter(({ d }) => d.wkSess.length === 0 && d.wkBf.length === 0);

    const content = document.getElementById('weeklySummaryContent');
    if (!content) return;

    content.innerHTML = [
      ...withActivity.map(({ s, d }) => renderStudentCard(s, d, weekLabel)),
      withoutActivity.length ? `
        <div class="card mt-md" style="border-color:rgba(239,68,68,0.2)">
          <div class="card-header"><span class="card-title" style="color:var(--danger)">Sem atividade (${withoutActivity.length})</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${withoutActivity.map(({ s }) => `
              <div class="flex items-center gap-sm" style="padding:8px 12px;background:var(--bg-page);border-radius:8px">
                <div class="avatar avatar-sm">${s.name.split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
                <span style="font-size:0.85rem">${s.name}</span>
                ${s.phone ? `<button class="btn btn-ghost btn-sm wa-nudge" data-name="${s.name.split(' ')[0]}" data-phone="${s.phone}" style="padding:3px 6px;color:#25d366">${ICON_WA}</button>` : ''}
              </div>`).join('')}
          </div>
        </div>` : '',
    ].join('');

    bindWeeklyActions(studentsData, weekLabel);
  };

  // Navegação entre semanas
  document.getElementById('prevWeekBtn')?.addEventListener('click', () => reload(currentOffset - 1));
  document.getElementById('currentWeekBtn')?.addEventListener('click', () => reload(0));

  // Enviar resumo para todos
  document.getElementById('sendAllBtn')?.addEventListener('click', async () => {
    const students    = (await db.getAll('students')).filter(s => s.status === 'Ativo' && s.phone);
    const sessions    = await db.getAll('sessions');
    const biofeedback = await db.getAll('biofeedback');
    const { start: weekStart, end: weekEnd } = getWeekBounds(currentOffset);
    const prevStart = new Date(weekStart); prevStart.setDate(prevStart.getDate() - 7);
    const weekLabel = `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} – ${new Date(weekEnd.getTime() - 1).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    if (!students.length) { notify.warning('Nenhum aluno ativo com telefone cadastrado'); return; }
    let count = 0;
    for (const s of students) {
      const d = buildStudentWeekData(s, sessions, biofeedback, weekStart, weekEnd, prevStart);
      if (d.wkSess.length === 0 && d.wkBf.length === 0) continue;
      const msg = buildWhatsAppMessage(s, d, weekLabel);
      sendWhatsApp(s.phone, msg);
      count++;
      await new Promise(r => setTimeout(r, 500));
    }
    notify.success(`Resumo enviado para ${count} aluno(s)!`);
  });

  bindWeeklyActions([], '');
}

function bindWeeklyActions(studentsData, weekLabel) {
  // Enviar resumo individual
  document.querySelectorAll('.wa-summary').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sid      = btn.dataset.student;
      const students = await db.getAll('students');
      const s        = students.find(x => x.id === sid);
      if (!s?.phone) { notify.warning('Aluno sem telefone'); return; }
      const found = studentsData.find(x => x.s.id === sid);
      if (!found) return;
      const msg = buildWhatsAppMessage(s, found.d, weekLabel);
      sendWhatsApp(s.phone, msg);
    });
  });

  // Nudge para aluno sem atividade
  document.querySelectorAll('.wa-nudge').forEach(btn => {
    btn.addEventListener('click', () => {
      const name  = btn.dataset.name;
      const phone = btn.dataset.phone?.replace(/\D/g, '');
      if (!phone) return;
      const msg = `Oi ${name}! 👋 Vi que você ficou sem treinar esta semana. Lembre-se de manter a consistência — é ela que gera resultado. Bora marcar uma sessão? 💪`;
      sendWhatsApp(phone, msg);
    });
  });
}
