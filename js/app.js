import { renderSidebar, initSidebar } from './components/sidebar.js';
import { renderLogin, initLogin } from './pages/login.js';
import { isAuthenticated, getCurrentUser, onAuthChange, signOut } from './utils/auth.js';
import db from './db.js';

// Import Renders and Inits
import { renderDashboard, initDashboardCharts } from './pages/dashboard.js';
import { renderStudents, initStudents } from './pages/students.js';
import { renderWorkouts, initWorkouts } from './pages/workouts.js';
import { renderTracker, initTracker } from './pages/live-tracker.js';
import { renderReports, initReports } from './pages/reports.js';
import { renderCalendar, initCalendar } from './pages/calendar.js';
import { renderBiofeedback, initBiofeedback } from './pages/biofeedback.js';
import { renderFinancial, initFinancial } from './pages/financial.js';
import { renderAssessments, initAssessments } from './pages/assessments.js';
import { renderExercisesLibrary, initExercisesLibrary } from './pages/exercises-library.js';
import { renderPeriodization, initPeriodization } from './pages/periodization.js';
import { renderWeeklySummary, initWeeklySummary } from './pages/weekly-summary.js';
import { renderSettings, initSettings } from './pages/settings.js';
import { renderPreForm, initPreForm, renderPostForm, initPostForm } from './pages/student-forms.js';
import { renderAnamnesis, initAnamnesis, renderAnamneseForm, initAnamneseForm } from './pages/anamnesis.js';
import { renderTutorial, initTutorial } from './pages/tutorial.js';

// Central Router
const routes = {
  '/': { render: renderDashboard, init: initDashboardCharts },
  '/alunos': { render: renderStudents, init: initStudents },
  '/tracker': { render: renderTracker, init: initTracker },
  '/agenda': { render: renderCalendar, init: initCalendar },
  '/treinos': { render: renderWorkouts, init: initWorkouts },
  '/periodizacao': { render: renderPeriodization, init: initPeriodization },
  '/avaliacoes': { render: renderAssessments, init: initAssessments },
  '/biofeedback': { render: renderBiofeedback, init: initBiofeedback },
  '/semanal': { render: renderWeeklySummary, init: initWeeklySummary },
  '/financeiro': { render: renderFinancial, init: initFinancial },
  '/exercicios': { render: renderExercisesLibrary, init: initExercisesLibrary },
  '/relatorios': { render: renderReports, init: initReports },
  '/anamnese': { render: renderAnamnesis, init: initAnamnesis },
  '/tutorial': { render: renderTutorial, init: initTutorial },
  '/config': { render: renderSettings, init: initSettings }
};

export async function navigateTo(path) {
  const appContainer = document.getElementById('app');

  // ── PUBLIC FORM ROUTES (no auth required) ──
  if (path.startsWith('/form/pre/')) {
    const studentId = path.split('/form/pre/')[1];
    appContainer.className = '';
    appContainer.innerHTML = await renderPreForm(studentId);
    initPreForm();
    return;
  }
  if (path.startsWith('/form/post/')) {
    const sessionId = path.split('/form/post/')[1];
    appContainer.className = '';
    appContainer.innerHTML = await renderPostForm(sessionId);
    initPostForm();
    return;
  }
  if (path === '/form/anamnese') {
    appContainer.className = '';
    appContainer.innerHTML = await renderAnamneseForm();
    initAnamneseForm();
    return;
  }

  // ── AUTH CHECK ──
  const auth = await isAuthenticated();
  if (!auth) {
    appContainer.className = '';
    appContainer.innerHTML = renderLogin();
    await initLogin(async (user) => {
      // After login: set user in db, seed, navigate
      db.setUser(user);
      await db.seedTemplates().catch(console.error);
      await navigateTo('/');
    });
    return;
  }

  // ── ENSURE SIDEBAR ──
  appContainer.className = 'app-layout';
  if (!document.querySelector('.sidebar')) {
    appContainer.innerHTML = `
      ${renderSidebar(path)}
      <main class="main-content" id="pageContent">
        <div class="page-loading"><div class="spinner"></div></div>
      </main>
    `;
    initSidebar(navigateTo);
    // Bind logout
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await signOut();
      db.setUser(null);
      document.querySelector('.sidebar')?.remove();
      appContainer.className = '';
      await navigateTo('/login');
    });
  }

  // ── UPDATE SIDEBAR TRAINER INFO ──
  const user = await getCurrentUser();
  if (user) {
    db.setUser(user);
    const savedSettings = await db.get('settings', 'trainer').catch(() => null) || {};
    const trainerName = savedSettings.trainerName || user.user_metadata?.trainer_name || user.email;
    const nameEl = document.getElementById('trainerName');
    const avatarEl = document.getElementById('trainerAvatar');
    if (nameEl) nameEl.textContent = trainerName;
    if (avatarEl) {
      const initials = trainerName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      avatarEl.textContent = initials;
    }
    // Restore saved theme — busca do banco primeiro (persiste entre navegadores)
    const theme = savedSettings.theme || localStorage.getItem('pp_theme') || 'dark';
    localStorage.setItem('pp_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;

    // Iniciar polling de notificações
    try {
      const { startNotificationPolling } = await import('./utils/notifications-manager.js');
      startNotificationPolling();
    } catch(e) { console.warn('Notification polling error:', e); }
  }

  // ── HIGHLIGHT ACTIVE MENU ──
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + path) a.classList.add('active');
  });

  // ── LOAD PAGE ──
  const content = document.getElementById('pageContent');
  const route = routes[path] || routes['/'];
  content.innerHTML = '<div class="page-loading"><div class="spinner"></div></div>';

  try {
    content.innerHTML = await route.render();
    if (route.init) await route.init(navigateTo);
  } catch (err) {
    content.innerHTML = `<div class="card"><div class="text-danger">Erro ao carregar página: ${err.message}</div></div>`;
    console.error('Page load error:', err);
  }
}

// Hash navigation
window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1) || '/';
  navigateTo(path);
});

// Initialize app
async function initApp() {
  // Theme
  const savedTheme = localStorage.getItem('pp_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Handle Supabase auth redirect (email confirmation)
  const hash = window.location.hash;
  if (hash.includes('access_token') || hash.includes('type=signup')) {
    // Let login page handle the session from URL
    const appContainer = document.getElementById('app');
    appContainer.className = '';
    appContainer.innerHTML = renderLogin();
    await initLogin(async (user) => {
      db.setUser(user);
      await db.seedTemplates().catch(console.error);
      window.location.hash = '/';
      await navigateTo('/');
    });
    return;
  }

  // Listen for Supabase auth state changes (e.g., token refresh)
  onAuthChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      db.setUser(null);
      document.querySelector('.sidebar')?.remove();
      window.location.hash = '/';
      await navigateTo('/');
    } else if (event === 'SIGNED_IN' && session?.user) {
      db.setUser(session.user);
    }
  });

  // Seed on startup if authenticated
  const user = await getCurrentUser();
  if (user) {
    db.setUser(user);
    db.seedTemplates().catch(console.error);
  }

  const path = window.location.hash.slice(1) || '/';
  navigateTo(path);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ── PWA INSTALL PROMPT ─────────────────────────────────────
let _pwaPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _pwaPrompt = e;

  // Não mostrar se já foi dispensado antes
  if (localStorage.getItem('pp_pwa_dismissed')) return;

  // Aguardar 8 segundos para mostrar (não perturbar o carregamento)
  setTimeout(() => {
    if (!_pwaPrompt) return;
    showPWABanner();
  }, 8000);
});

function showPWABanner() {
  if (document.getElementById('pwaBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'pwaBanner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:24px;right:24px;
      background:#1e293b;
      border:1px solid rgba(16,185,129,0.3);
      border-radius:12px;
      padding:16px 20px;
      max-width:320px;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);
      z-index:99999;
      animation:slideUp 0.3s ease;
      color:#f1f5f9;
    ">
      <style>@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}</style>
      <div style="display:flex;align-items:flex-start;gap:12px">
        <div style="width:40px;height:40px;background:#10b981;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 100" fill="white"><rect width="100" height="100" rx="20" fill="none"/><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-weight="900" font-size="55">P</text></svg>
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.92rem;margin-bottom:3px">Instalar Personal PRO</div>
          <div style="font-size:0.78rem;color:#94a3b8;line-height:1.4">Acesse mais rápido como app no seu celular ou computador, sem precisar de navegador.</div>
        </div>
        <button id="pwaDismiss" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:1.1rem;padding:0 0 0 4px;line-height:1" title="Dispensar">✕</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button id="pwaInstall" style="flex:1;padding:9px;background:#10b981;color:white;border:none;border-radius:7px;font-weight:600;font-size:0.85rem;cursor:pointer">Instalar App</button>
        <button id="pwaDismiss2" style="padding:9px 14px;background:rgba(255,255,255,0.08);color:#94a3b8;border:none;border-radius:7px;font-size:0.85rem;cursor:pointer">Agora não</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwaInstall')?.addEventListener('click', async () => {
    if (!_pwaPrompt) return;
    _pwaPrompt.prompt();
    const { outcome } = await _pwaPrompt.userChoice;
    _pwaPrompt = null;
    banner.remove();
    if (outcome === 'accepted') localStorage.setItem('pp_pwa_dismissed', '1');
  });

  const dismiss = () => {
    localStorage.setItem('pp_pwa_dismissed', '1');
    banner.remove();
  };
  document.getElementById('pwaDismiss')?.addEventListener('click', dismiss);
  document.getElementById('pwaDismiss2')?.addEventListener('click', dismiss);
}

// Mostrar botão de instalação nas configurações se disponível
window.addEventListener('appinstalled', () => {
  _pwaPrompt = null;
  localStorage.setItem('pp_pwa_dismissed', '1');
});
