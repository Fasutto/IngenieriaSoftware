document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('docente-select');
  const btnAdd = document.getElementById('btn-add-docente');
  const inputCount = document.getElementById('t-count');
  const btnSave = document.getElementById('btn-save-count');
  const btnView = document.getElementById('btn-view-profile');
  const msgEl = document.getElementById('t-count-msg');
  const infoEl = document.getElementById('current-info');
  const profileNameEl = document.getElementById('profile-name');
  const profileRoleEl = document.getElementById('profile-role');

  function loadDocentes() { return JSON.parse(localStorage.getItem('docentes') || '[]'); }
  function saveDocentes(arr) { localStorage.setItem('docentes', JSON.stringify(arr)); }

  // Si no hay docentes, crear uno por defecto desde userProfile
  function ensureDefault() {
    const docs = loadDocentes();
    if (docs.length) return docs;
    const up = JSON.parse(localStorage.getItem('userProfile') || 'null');
    const def = up ? {
      id: Date.now(),
      nombres: up.nombres || up.name || 'Docente',
      apellidoP: up.apellidoP || '',
      apellidoM: up.apellidoM || '',
      email: up.email || '',
      tutoradosCount: Number(up.tutoradosCount || 0)
    } : { id: Date.now(), nombres: 'Docente Ejemplo', apellidoP: '', apellidoM: '', email: '', tutoradosCount: 0 };
    saveDocentes([def]);
    return [def];
  }

  function renderOptions() {
    const docs = ensureDefault();
    selectEl.innerHTML = '';
    docs.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.nombres} ${d.apellidoP} ${d.apellidoM}`.trim();
      selectEl.appendChild(opt);
    });
    renderCurrentInfo();
  }

  function renderCurrentInfo() {
    const docs = loadDocentes();
    const sel = selectEl.value;
    const doc = docs.find(x => String(x.id) === String(sel));
    if (!doc) {
      infoEl.innerHTML = '<p class="small">No hay docente seleccionado.</p>';
      inputCount.value = 0;
      return;
    }
    infoEl.innerHTML = `
      <div class="small"><strong>Nombre:</strong> ${escapeHtml(formatName(doc))}</div>
      <div class="small"><strong>Correo:</strong> ${escapeHtml(doc.email || '-')}</div>
      <div class="small"><strong>Tutorados registrados:</strong> ${Number(doc.tutoradosCount || 0)}</div>
    `;
    inputCount.value = Number(doc.tutoradosCount || 0);
  }

  function formatName(d) { return `${d.nombres||''} ${d.apellidoP||''} ${d.apellidoM||''}`.replace(/\s+/g,' ').trim(); }
  function escapeHtml(str){ return String(str||'').replace(/[&<>"'`=\/]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s])); }

  btnAdd?.addEventListener('click', () => {
    const nombres = prompt('Nombres del docente (ej. Juan Carlos):')?.trim();
    if (!nombres) return;
    const apellidoP = prompt('Apellido paterno:')?.trim() || '';
    const apellidoM = prompt('Apellido materno:')?.trim() || '';
    const email = prompt('Correo (opcional):')?.trim() || '';
    const docs = loadDocentes();
    const newDoc = { id: Date.now(), nombres, apellidoP, apellidoM, email, tutoradosCount: 0 };
    docs.unshift(newDoc);
    saveDocentes(docs);
    renderOptions();
    selectEl.value = newDoc.id;
    renderCurrentInfo();
    show('Docente agregado', false);
  });

  btnSave?.addEventListener('click', () => {
    const v = Number(inputCount?.value || 0);
    if (!Number.isFinite(v) || v < 0) return show('Ingrese un número válido', true);
    const docs = loadDocentes();
    const sel = selectEl.value;
    const idx = docs.findIndex(x => String(x.id) === String(sel));
    if (idx === -1) return show('Docente no encontrado', true);
    docs[idx].tutoradosCount = Math.trunc(v);
    saveDocentes(docs);

    // sincronizar con userProfile si coincide el nombre completo
    const up = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (up) {
      const fullName = `${up.nombres||up.name||''} ${up.apellidoP||''} ${up.apellidoM||''}`.trim();
      if (fullName && fullName === formatName(docs[idx])) {
        up.tutoradosCount = docs[idx].tutoradosCount;
        localStorage.setItem('userProfile', JSON.stringify(up));
      }
    }

    renderCurrentInfo();
    show('Conteo guardado', false);
  });

  btnView?.addEventListener('click', () => {
    const docs = loadDocentes();
    const sel = selectEl.value;
    const doc = docs.find(x => String(x.id) === String(sel));
    if (!doc) return show('Seleccione un docente', true);
    localStorage.setItem('selectedDocente', JSON.stringify(doc));
    location.href = 'perfil.html';
  });

  selectEl?.addEventListener('change', () => renderCurrentInfo());

  function show(txt, isError){
    if (!msgEl) return;
    msgEl.textContent = txt;
    msgEl.style.color = isError ? '#FF6347' : '#8BC34A';
    setTimeout(()=>{ if (msgEl) msgEl.textContent=''; }, 2500);
  }

  // actualizar sidebar si existe userProfile
  (function updateSidebar(){
    const up = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (up) {
      if (profileNameEl) profileNameEl.textContent = (up.nombres || up.name || '').split(' ')[0] || 'Docente';
      if (profileRoleEl) profileRoleEl.textContent = up.role || '';
    }
  })();

  renderOptions();
});