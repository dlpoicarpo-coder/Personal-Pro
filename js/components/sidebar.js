// ========================================
// PERSONAL PRO — Sidebar Component (Cloud Edition)
// ========================================
import { ICONS } from '../utils/icons.js';

const MENU_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/' },
  { id: 'students', icon: 'students', label: 'Alunos', path: '/alunos' },
  { id: 'tracker', icon: 'tracker', label: 'Treino ao Vivo', path: '/tracker', highlight: true },
  { id: 'calendar', icon: 'calendar', label: 'Agenda', path: '/agenda' },
  { id: 'workouts', icon: 'workouts', label: 'Treinos', path: '/treinos' },
  { id: 'periodization', icon: 'periodization', label: 'Periodização', path: '/periodizacao' },
  { id: 'assessments', icon: 'assessments', label: 'Avaliações', path: '/avaliacoes' },
  { id: 'biofeedback', icon: 'biofeedback', label: 'Biofeedback', path: '/biofeedback' },
  { id: 'weekly', icon: 'weekly', label: 'Resumo Semanal', path: '/semanal' },
  { id: 'financial', icon: 'financial', label: 'Financeiro', path: '/financeiro' },
  { id: 'exercises', icon: 'exercises', label: 'Exercícios', path: '/exercicios' },
  { id: 'reports', icon: 'reports', label: 'Relatórios', path: '/relatorios' },
  { id: 'settings', icon: 'settings', label: 'Configurações', path: '/config' },
];

export function renderSidebar(currentPath) {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-text">
            <span class="logo-title">Personal<strong class="logo-pro">PRO</strong></span>
            <span class="logo-subtitle">Cloud Edition</span>
          </div>
        </div>
        <button class="sidebar-toggle btn-ghost btn-icon" id="sidebarToggle" title="Menu">
          ☰
        </button>
      </div>
      
      <nav class="sidebar-nav">
        ${MENU_ITEMS.map(item => `
          <a href="#${item.path}" 
             class="sidebar-link ${currentPath === item.path ? 'active' : ''} ${item.highlight ? 'sidebar-link-highlight' : ''}" 
             data-page="${item.id}"
             id="nav-${item.id}">
            <span class="sidebar-icon-svg">${ICONS[item.icon] || '•'}</span>
            <span class="sidebar-label">${item.label}</span>
            ${item.highlight ? '<span class="live-dot"></span>' : ''}
          </a>
        `).join('')}
      </nav>
      
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="avatar avatar-sm" id="trainerAvatar">PRO</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name" id="trainerName">Treinador</span>
            <span class="sidebar-user-role">Administrador</span>
          </div>
        </div>
        <button id="logoutBtn" class="btn btn-danger btn-sm" style="width: 100%; margin-top: 10px; font-weight: bold; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger);">
          <i class="fas fa-sign-out-alt"></i> Sair do Sistema
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;
}

export function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const logoutBtn = document.getElementById('logoutBtn');

  // Toggle do Menu Mobile
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('mobile-open');
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  }

  // Lógica do Botão de Sair Segura
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if(window.confirm('Tem a certeza que deseja trancar o ginásio e sair?')) {
        localStorage.removeItem('pp_session'); // Remove a chave de acesso
        window.location.reload(); // Atualiza a página e volta para o Login
      }
    });
  }
}

export { MENU_ITEMS };
