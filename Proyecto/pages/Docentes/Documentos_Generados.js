document.addEventListener('DOMContentLoaded', () => {
  const filterEl = document.getElementById('filter');
  const btnClear = document.getElementById('btn-clear');
  const docsContainer = document.getElementById('docs-container');
  const profileName = document.getElementById('profile-name');
  const profileRole = document.getElementById('profile-role');

  // mostrar nombre en la barra lateral si existe en localStorage
  const storedProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
  if (storedProfile) {
    if (profileName) profileName.textContent = (storedProfile.nombres || storedProfile.name || 'Docente').split(' ')[0];
    if (profileRole) profileRole.textContent = storedProfile.role || profileRole.textContent;
  }

  btnClear?.addEventListener('click', () => {
    if (filterEl) {
      filterEl.value = '';
      renderList();
      filterEl.focus();
    }
  });

  filterEl?.addEventListener('input', () => {
    renderList();
  });

  function getDocs() {
    return JSON.parse(localStorage.getItem('myDocuments') || '[]');
  }

  function renderList() {
    //const q = (filterEl?.value || '').toLowerCase().trim();
    const docs = getDocs().filter(d => d.title.toLowerCase().includes(q));
    docsContainer.innerHTML = '';

    if (!docs.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-message';
      empty.innerHTML = `
        <p>No hay documentos generados.</p>
        <p class="small">Genera documentos desde "Generar Documentos" para que aparezcan aquí.</p>
      `;
      docsContainer.appendChild(empty);
      return;
    }

    docs.forEach(d => {
      const card = document.createElement('div');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="doc-info">
          <div class="doc-title">${escapeHtml(d.title)}</div>
          <div class="doc-meta small">Generado: ${escapeHtml(d.createdAt || '')}</div>
        </div>
        <div class="doc-actions">
          <button class="btn-view secondary" data-id="${d.id}">Ver</button>
          <button class="btn-download primary" data-id="${d.id}">Descargar</button>
        </div>
      `;
      docsContainer.appendChild(card);

      card.querySelector('.btn-view').addEventListener('click', () => {
        const w = window.open('', '_blank');
        w.document.write(d.content);
        w.document.title = d.title;
      });

      card.querySelector('.btn-download').addEventListener('click', () => {
        const blob = new Blob([d.content], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${d.title.replace(/\s+/g,'_')}-${d.id}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    });
  }

  // pequeño helper para prevenir XSS si el contenido del título viene de fuentes no confiables
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"'`=\/]/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'
    })[s]);
  }

  // inicializar render
  renderList();
});