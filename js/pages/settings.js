// ========================================
// PERSONAL PRO — Settings Page (Cloud Edition)
// ========================================

import db from '../db.js';
import { exportBackup } from '../utils/backup.js';
import { notify } from '../components/toast.js';

export async function renderSettings() {
  const settings = await db.get('settings', 'trainer') || {};

  return `
    <div class="page-header">
      <div>
        <h1>Configurações</h1>
        <p class="subtitle">Personalize a sua plataforma na nuvem</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Perfil do Treinador (Aparece nos PDFs)</span></div>
        <form id="trainerForm">
          <div class="form-group">
            <label class="form-label">Nome Completo</label>
            <input class="form-input" name="trainerName" value="${settings.trainerName || ''}" placeholder="O seu nome" required />
          </div>
          <div class="form-group">
            <label class="form-label">CREF</label>
            <input class="form-input" name="cref" value="${settings.cref || ''}" placeholder="Ex: 012345-G/UF" />
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Profissional</label>
            <input class="form-input" name="trainerPhone" value="${settings.trainerPhone || ''}" placeholder="(00) 00000-0000" />
          </div>
          <div class="form-group">
            <label class="form-label">Email de Contato</label>
            <input class="form-input" type="email" name="trainerEmail" value="${settings.trainerEmail || ''}" placeholder="seu@email.com" />
          </div>
          <button type="submit" class="btn btn-primary mt-md" style="width: 100%">Salvar Perfil na Nuvem</button>
        </form>
      </div>

      <div class="flex flex-col gap-md">
        <div class="card">
          <div class="card-header"><span class="card-title">Aparência Visual</span></div>
          <div class="form-group">
            <label class="form-label">Tema do Sistema</label>
            <select id="themeSelect" class="form-select">
              <option value="dark">Modo Escuro (Padrão e Elegante)</option>
              <option value="light">Modo Claro (Em breve)</option>
            </select>
            <p class="text-xs text-muted mt-sm">O modo claro será ativado na próxima atualização do sistema.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Backup & Segurança</span></div>
          <p class="text-muted text-sm mb-md">Os seus dados agora estão <b>100% seguros na nuvem (Supabase)</b>. Se desejar, pode gerar um ficheiro de backup para o seu computador por precaução.</p>
          <div class="flex flex-col gap-sm">
            <button class="btn btn-secondary" id="exportBackupBtn">⬇️ Descarregar Backup (JSON)</button>
          </div>
        </div>

        <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
          <div class="card-header"><span class="card-title" style="color: var(--danger);">Zona de Perigo</span></div>
          <p class="text-muted text-sm mb-md">Cuidado: apagar os dados da nuvem é uma ação imediata e irreversível.</p>
          <button class="btn btn-danger btn-sm" id="clearAllBtn">Limpar Toda a Base de Dados</button>
        </div>
      </div>
    </div>

    <div class="card mt-lg">
      <div class="card-header"><span class="card-title">Sobre o Personal PRO Cloud</span></div>
      <div class="grid-2">
        <div>
          <p class="text-sm"><strong>Versão:</strong> 2.0.0 (Cloud Edition)</p>
          <p class="text-sm"><strong>Tecnologia:</strong> HTML5 + CSS3 + Vanilla JS</p>
          <p class="text-sm"><strong>Armazenamento:</strong> Supabase (PostgreSQL)</p>
          <p class="text-sm"><strong>Gráficos:</strong> Chart.js</p>
          <p class="text-sm"><strong>PDFs:</strong> jsPDF</p>
        </div>
        <div>
          <p class="text-sm text-muted">O Personal PRO evoluiu. Agora a sua plataforma é 100% online, permitindo aceder aos dados dos seus alunos, prescrever treinos e monitorizar o biofeedback de qualquer dispositivo no mundo de forma totalmente segura.</p>
        </div>
      </div>
    </div>
  `;
}

export function initSettings(navigateFn) {
  // Guardar informações do Treinador na Nuvem
  document.getElementById('trainerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'A guardar...';
    btn.disabled = true;

    try {
      const fd = new FormData(e.target);
      const data = { key: 'trainer', ...Object.fromEntries(fd) };
      await db.put('settings', data);
      
      // Atualizar o nome na barra lateral imediatamente
      const nameEl = document.getElementById('trainerName');
      if (nameEl && data.trainerName) nameEl.textContent = data.trainerName;
      
      notify.success('Perfil atualizado com sucesso na nuvem!');
    } catch (err) {
      notify.error('Erro ao guardar os dados. Verifique a ligação.');
    } finally {
      btn.textContent = 'Salvar Perfil na Nuvem';
      btn.disabled = false;
    }
  });

  // Exportar Backup
  document.getElementById('exportBackupBtn')?.addEventListener('click', exportBackup);

  // Limpar Base de Dados
  document.getElementById('clearAllBtn')?.addEventListener('click', async () => {
    if (window.confirm('ATENÇÃO MÁXIMA: Isto vai apagar TODOS os alunos, treinos e configurações da NUVEM. Deseja mesmo continuar?')) {
      if (window.confirm('ÚLTIMO AVISO: Tem a certeza absoluta? Esta ação NÃO pode ser desfeita.')) {
        try {
          const btn = document.getElementById('clearAllBtn');
          btn.textContent = 'A limpar nuvem...';
          btn.disabled = true;
          
          const stores = ['students', 'workouts', 'exercises', 'assessments', 'biofeedback', 'anamnesis', 'cycles', 'sessions', 'macrocycles', 'financial', 'schedules'];
          for (const s of stores) await db.clear(s);
          
          notify.success('Base de dados limpa com sucesso. A reiniciar...');
          setTimeout(() => {
            localStorage.clear();
            window.location.reload();
          }, 2000);
        } catch (err) {
          notify.error('Erro ao tentar limpar a base de dados.');
        }
      }
    }
  });
}
