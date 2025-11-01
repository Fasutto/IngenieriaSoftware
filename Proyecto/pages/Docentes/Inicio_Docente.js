const DOC_COUNT = 30;

// Genera lista de documentos con título y descripción básica
const documents = Array.from({ length: DOC_COUNT }, (_, i) => ({
  id: i + 1,
  title: `Documento ${String(i + 1).padStart(2, '0')}`,
  description: `Plantilla e información para el Documento ${i + 1}.`
}));

document.addEventListener('DOMContentLoaded', () => {
  const navGenerate = document.getElementById('nav-generate');
  const navMyDocs = document.getElementById('nav-mydocs');
  const navProfile = document.getElementById('nav-profile');
  const submenuList = document.getElementById('submenu-doc-list');
  const area = document.getElementById('document-generator-area');

  // Rellenar submenu (hover) con 30 opciones (si existe)
  if (submenuList) {
    submenuList.innerHTML = '';
    documents.forEach(doc => {
      const btn = document.createElement('button');
      btn.className = 'doc-btn';
      btn.textContent = doc.title;
      btn.title = doc.description;
      btn.addEventListener('click', () => openDocumentView(doc.id));
      submenuList.appendChild(btn);
    });
  }

  // Navegación
  navGenerate?.addEventListener('click', () => openGenerateOverview());
  navMyDocs?.addEventListener('click', () => renderMyDocuments());
  navProfile?.addEventListener('click', () => renderProfileView());

  // Dividir documentos en secciones: 14 inicio, 16 factor1
  const inicioDocs = documents.slice(0, 14);
  const factor1Docs = documents.slice(14, 30);

  // Mostrar listas verticales por defecto en el área de generación
  openGenerateOverview();

  function openGenerateOverview() {
    const listInicio = document.getElementById('list-inicio');
    const listFactor1 = document.getElementById('list-factor1');
    const detailCont = document.getElementById('doc-detail-container');

    if (listInicio) {
      listInicio.innerHTML = '';
      inicioDocs.forEach(doc => listInicio.appendChild(createListItem(doc)));
    }
    if (listFactor1) {
      listFactor1.innerHTML = '';
      factor1Docs.forEach(doc => listFactor1.appendChild(createListItem(doc)));
    }
    if (detailCont) detailCont.innerHTML = `<div class="small">Seleccione un documento de la lista.</div>`;
  }

  function createListItem(doc) {
    const item = document.createElement('div');
    item.className = 'doc-list-item';
    item.style.cssText = 'padding:10px;border-radius:6px;margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.01)';
    item.innerHTML = `
      <div style="display:flex;flex-direction:column;">
        <strong style="font-size:14px">${doc.title}</strong>
        <span class="small" style="margin-top:4px;color:#bdbdbd">${doc.description}</span>
      </div>
      <div style="margin-left:10px"><button class="doc-btn" style="padding:6px 8px;">Abrir</button></div>
    `;
    item.addEventListener('click', (e) => {
      // si clic en botón interno, igualmente abrir
      openDocumentView(doc.id);
    });
    return item;
  }

  function openDocumentView(id) {
    const doc = documents.find(d => d.id === id);
    const detailCont = document.getElementById('doc-detail-container');
    if (!doc || !detailCont) return;

    detailCont.innerHTML = `
      <h2 style="margin:0 0 8px 0">${doc.title}</h2>
      <div class="doc-preview">
        <p class="small">${doc.description}</p>
        <div style="margin-top:10px;">
          <label class="small">Campos de ejemplo:</label>
          <div style="display:flex;gap:8px;margin-top:6px;">
            <input id="field-nombre" placeholder="Nombre" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06)">
            <input id="field-matricula" placeholder="Matrícula" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06)">
          </div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;">
          <button id="btn-generate" class="action-btn">Generar Documento</button>
          <button id="btn-preview" class="secondary-btn">Vista Previa</button>
          <button id="btn-back" class="secondary-btn">Volver a la lista</button>
        </div>
        <div id="doc-output" style="margin-top:12px;"></div>
      </div>
    `;

    document.getElementById('btn-preview').addEventListener('click', () => {
      const nombre = document.getElementById('field-nombre').value || 'Nombre del Docente';
      const matricula = document.getElementById('field-matricula').value || '000000';
      document.getElementById('doc-output').innerHTML = `<strong>${doc.title}</strong><br><div class="small">Docente: ${nombre} — Matrícula: ${matricula}</div>`;
    });

    document.getElementById('btn-generate').addEventListener('click', () => {
      const nombre = document.getElementById('field-nombre').value || 'Nombre del Docente';
      const matricula = document.getElementById('field-matricula').value || '000000';
      generateAndSaveDocument(doc, { nombre, matricula });
    });

    document.getElementById('btn-back').addEventListener('click', () => {
      openGenerateOverview();
      const first = document.querySelector('.doc-list-item');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Genera documento simulado, guarda en localStorage y descarga html
  function generateAndSaveDocument(doc, data) {
    const fecha = new Date().toLocaleString();
    const content = `
      <html><head><meta charset="utf-8"><title>${doc.title}</title></head><body>
      <h2>${doc.title}</h2>
      <p>Docente: ${data.nombre}</p>
      <p>Matrícula: ${data.matricula}</p>
      <p>Generado: ${fecha}</p>
      </body></html>
    `;
    const storage = JSON.parse(localStorage.getItem('myDocuments') || '[]');
    const item = { id: Date.now(), docId: doc.id, title: doc.title, content, createdAt: fecha };
    storage.unshift(item);
    localStorage.setItem('myDocuments', JSON.stringify(storage));

    const blob = new Blob([content], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${doc.title.replace(/\s+/g,'_')}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    const out = document.getElementById('doc-output');
    if (out) out.innerHTML = `<div class="small">Documento generado y guardado en "Mis Documentos".</div>`;
  }

  // Mis Documentos
  function renderMyDocuments() {
    const storage = JSON.parse(localStorage.getItem('myDocuments') || '[]');
    area.innerHTML = `<h2>Mis Documentos</h2><div id="mydocs-list"></div>`;
    const list = document.getElementById('mydocs-list');
    if (!storage.length) {
      list.innerHTML = `<p>No hay documentos generados.</p>`;
      return;
    }
    storage.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'mydoc-card';
      card.innerHTML = `<div>
          <strong>${doc.title}</strong>
          <div class="small">Generado: ${doc.createdAt}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="secondary-btn small" data-id="${doc.id}" data-action="view">Ver</button>
          <button class="action-btn small" data-id="${doc.id}" data-action="download">Descargar</button>
        </div>`;
      list.appendChild(card);

      card.querySelector('[data-action="view"]').addEventListener('click', () => {
        const w = window.open('', '_blank');
        w.document.write(doc.content);
        w.document.title = doc.title;
      });
      card.querySelector('[data-action="download"]').addEventListener('click', () => {
        const blob = new Blob([doc.content], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${doc.title.replace(/\s+/g,'_')}-${doc.id}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    });
  }

  // Perfil (ver datos y cambiar contraseña - simulado)
  function renderProfileView() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || JSON.stringify({
      name: 'Fausto Gabriel Espinoza Félix',
      role: 'Docente Precalificado',
      email: 'fausto@ejemplo.com',
      password: 'password123'
    }));

    area.innerHTML = `
      <h2>Mi Perfil</h2>
      <div class="profile-box">
        <p><strong>Nombre:</strong> <span id="pf-name">${profile.name}</span></p>
        <p><strong>Rol:</strong> <span id="pf-role">${profile.role}</span></p>
        <p><strong>Email:</strong> <span id="pf-email">${profile.email}</span></p>
      </div>

      <h3 style="margin-top:12px">Cambiar Contraseña</h3>
      <div style="max-width:420px">
        <div style="display:flex;flex-direction:column;gap:8px">
          <input id="current-pass" type="password" placeholder="Contraseña actual" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06)">
          <input id="new-pass" type="password" placeholder="Nueva contraseña" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06)">
          <input id="confirm-pass" type="password" placeholder="Confirmar nueva contraseña" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06)">
          <div style="display:flex;gap:8px">
            <button id="btn-change-pass" class="action-btn">Actualizar</button>
            <button id="btn-cancel-pass" class="secondary-btn">Cancelar</button>
          </div>
          <div id="pass-msg" class="small"></div>
        </div>
      </div>
    `;

    document.getElementById('btn-change-pass').addEventListener('click', () => {
      const cur = document.getElementById('current-pass').value;
      const nw = document.getElementById('new-pass').value;
      const cf = document.getElementById('confirm-pass').value;
      if (!cur || !nw || !cf) return showPassMsg('Complete todos los campos', true);
      if (cur !== profile.password) return showPassMsg('Contraseña actual incorrecta', true);
      if (nw.length < 6) return showPassMsg('La contraseña debe tener al menos 6 caracteres', true);
      if (nw !== cf) return showPassMsg('Las contraseñas no coinciden', true);

      profile.password = nw;
      localStorage.setItem('userProfile', JSON.stringify(profile));
      showPassMsg('Contraseña actualizada', false);
      document.getElementById('current-pass').value = '';
      document.getElementById('new-pass').value = '';
      document.getElementById('confirm-pass').value = '';
    });

    document.getElementById('btn-cancel-pass').addEventListener('click', () => {
      renderProfileView();
    });

    function showPassMsg(msg, isError) {
      const el = document.getElementById('pass-msg');
      el.textContent = msg;
      el.style.color = isError ? '#FF6347' : '#8BC34A';
    }
  }
});