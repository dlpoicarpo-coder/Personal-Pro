// ========================================
// PERSONAL PRO — Login Page (v3 - Nuvem)
// Autenticação Segura com Senha
// ========================================
import db from '../db.js';
import { notify } from '../components/toast.js';

const SESSION_KEY = 'pp_session';

export async function isAuthenticated() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;
  
  try {
    const trainer = await db.get('settings', 'trainer_auth');
    return trainer && trainer.isSetup;
  } catch (e) {
    return false;
  }
}

export async function hasAccount() {
  try {
    const trainer = await db.get('settings', 'trainer_auth');
    return trainer && trainer.isSetup;
  } catch (e) {
    return false;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.reload();
}

export function renderLogin() {
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Personal<strong class="logo-pro">PRO</strong></h1>
          <p class="login-subtitle">Sistema de Treinamento em Nuvem</p>
        </div>
        <div class="login-body" id="loginBody">
          <div class="spinner" style="margin: 0 auto;"></div>
          <p class="text-center text-muted mt-md">Conectando à base de dados...</p>
        </div>
        <div class="login-footer">
          <p class="text-muted text-xs">© 2026 Personal PRO. Dados seguros na nuvem.</p>
        </div>
      </div>
    </div>
  `;
}

export async function initLogin(onSuccess) {
  const area = document.getElementById('loginBody');
  if (!area) return;

  try {
    const hasAcc = await hasAccount();

    if (hasAcc) {
      // -----------------------------------------
      // FORMULÁRIO DE LOGIN (Já tem conta)
      // -----------------------------------------
      area.innerHTML = `
        <h3 style="text-align:center;margin-bottom:20px">Acesso Seguro</h3>
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">E-mail ou CREF</label>
            <input class="form-input" name="credential" autocomplete="email" required placeholder="coach@email.com ou 012345-G" />
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input class="form-input" type="password" name="password" required placeholder="Tua senha secreta" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:14px;margin-top:12px">Entrar no Sistema</button>
          <p id="loginError" class="text-danger text-sm text-center mt-md" style="display:none"></p>
        </form>
      `;

      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Verificando...';

        try {
          const fd = new FormData(e.target);
          const { credential, password } = Object.fromEntries(fd);
          const trainer = await db.get('settings', 'trainer_auth');

          const credLower = credential.toLowerCase().trim();
          const emailMatch = trainer.email && trainer.email.toLowerCase().trim() === credLower;
          const crefMatch = trainer.cref && trainer.cref.toLowerCase().trim() === credLower;

          // Verifica se o email/cref bate E a senha está correta
          if ((emailMatch || crefMatch) && trainer.password === password) {
            localStorage.setItem(SESSION_KEY, JSON.stringify({ user: trainer.trainerName, ts: Date.now() }));
            notify.success(`Bem-vindo de volta, ${trainer.trainerName}!`);
            onSuccess();
          } else {
            const errEl = document.getElementById('loginError');
            errEl.style.display = 'block';
            errEl.textContent = 'E-mail, CREF ou Senha incorretos.';
          }
        } catch (err) {
          notify.error('Erro ao conectar com a nuvem.');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Entrar no Sistema';
        }
      });

    } else {
      // -----------------------------------------
      // FORMULÁRIO DE SETUP (Primeiro Acesso)
      // -----------------------------------------
      area.innerHTML = `
        <h3 style="text-align:center;margin-bottom:8px">Configuração de Administrador</h3>
        <p class="text-muted text-sm text-center mb-lg">Regista os teus dados e cria uma senha</p>
        <form id="setupForm">
          <div class="form-group"><label class="form-label">Teu nome completo</label><input class="form-input" name="trainerName" required placeholder="Ex: João da Silva" /></div>
          <div class="form-group"><label class="form-label">E-mail</label><input class="form-input" name="email" type="email" required placeholder="coach@email.com" /></div>
          <div class="form-group"><label class="form-label">CREF</label><input class="form-input" name="cref" required placeholder="Ex: 012345-G" /></div>
          <div class="form-group"><label class="form-label">Cria uma Senha</label><input class="form-input" type="password" name="password" required minlength="6" placeholder="Mínimo de 6 caracteres" /></div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:14px;margin-top:12px">Criar Conta na Nuvem</button>
        </form>
      `;

      document.getElementById('setupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'A gravar na nuvem...';

        try {
          const fd = new FormData(e.target);
          const d = Object.fromEntries(fd);

          await db.put('settings', {
            key: 'trainer_auth',
            trainerName: d.trainerName,
            email: d.email,
            cref: d.cref,
            password: d.password, // Guarda a senha
            isSetup: true,
            createdAt: new Date().toISOString(),
          });

          await db.put('settings', { key: 'trainer', trainerName: d.trainerName, cref: d.cref, email: d.email });

          localStorage.setItem(SESSION_KEY, JSON.stringify({ user: d.trainerName, ts: Date.now() }));
          notify.success('Nuvem configurada! Bem-vindo ao Personal PRO!');
          onSuccess();
        } catch (err) {
          notify.error('Erro ao guardar na nuvem. Verifica a ligação.');
          btn.disabled = false;
          btn.textContent = 'Criar Conta na Nuvem';
        }
      });
    }
  } catch (error) {
    area.innerHTML = '<div class="empty-state"><h3>Erro de Conexão</h3><p>Não foi possível ligar ao Supabase.</p></div>';
  }
}
