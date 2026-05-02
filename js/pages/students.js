// ========================================
// PERSONAL PRO — Students Page (Cloud Ready)
// ========================================
import db from '../db.js';

export async function renderStudents() {
  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2><i class="fas fa-users"></i> Gestão de Alunos</h2>
      <button id="addStudentBtn" class="btn btn-primary" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
        + Adicionar Aluno
      </button>
    </div>
    
    <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div class="table-responsive">
        <table class="table" id="studentsTable" style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #eee;">
              <th style="padding: 12px 8px;">Nome do Aluno</th>
              <th style="padding: 12px 8px;">Objetivo</th>
              <th style="padding: 12px 8px;">Status</th>
              <th style="padding: 12px 8px;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">A carregar a tua equipa...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initStudents() {
  // 1. Carrega os alunos da Nuvem
  await loadStudents();

  // 2. Ativa o botão de Adicionar Aluno
  const addBtn = document.getElementById('addStudentBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      // Por enquanto, um alerta para testar. Depois ligamos ao teu Modal!
      alert('O formulário de Adicionar Aluno está a ser preparado para a Nuvem! Em breve abrirá aqui.');
    });
  }
}

async function loadStudents() {
  const tbody = document.querySelector('#studentsTable tbody');
  
  try {
    // Pede os alunos à gaveta "students" lá do Supabase
    const studentsList = await db.getAll('students');
    
    if (!studentsList || studentsList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 30px; color: #666;">
            <strong>Ainda não tens alunos registados na Nuvem.</strong><br>
            Clica no botão azul "+ Adicionar Aluno" para começares!
          </td>
        </tr>`;
      return;
    }

    // Desenha os alunos na tabela
    tbody.innerHTML = studentsList.map(student => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 8px;"><strong>${student.data.nome || 'Aluno Sem Nome'}</strong></td>
        <td style="padding: 12px 8px;">${student.data.objetivo || 'Não definido'}</td>
        <td style="padding: 12px 8px;"><span style="background: #dcfce3; color: #16a34a; padding: 4px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: bold;">Ativo</span></td>
        <td style="padding: 12px 8px;">
          <button style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 1.1rem;"><i class="fas fa-eye"></i></button>
        </td>
      </tr>
    `).join('');
    
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Erro ao ligar à base de dados. Verifica o F12.</td></tr>`;
  }
}
