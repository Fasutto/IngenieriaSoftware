// Rellena la sección de docentes con conteos y estado por tipo de documento
document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('sd-name');
  const roleEl = document.getElementById('sd-role');
  const listEl = document.getElementById('sd-list');
  const filterEl = document.getElementById('sd-filter');
  const refreshBtn = document.getElementById('sd-refresh');

  // seed automático si no hay docentes o faltan los de ejemplo
  (function seedIfNeeded(){
    const load = key => JSON.parse(localStorage.getItem(key) || '[]');
    const save = (key, v) => localStorage.setItem(key, JSON.stringify(v));
    const docentes = load('docentes');
    const myDocs = load('myDocuments');

    function existsByEmail(arr, email){ return arr.some(x => (x.email||'').toLowerCase() === (email||'').toLowerCase()); }
    const emailComplete = 'completo.prof@institucion.edu';
    const emailPartial = 'parcial.prof@institucion.edu';
    if (existsByEmail(docentes, emailComplete) && existsByEmail(docentes, emailPartial)) return; // ya existen

    const now = Date.now();
    function newId(prefix){ return `${prefix}_${Date.now()}_${Math.floor(Math.random()*10000)}`; }

    // crear docente completo
    if (!existsByEmail(docentes, emailComplete)) {
      const docComplete = {
        id: newId('docente'),
        nombres: 'María Fernanda',
        apellidoP: 'Gómez',
        apellidoM: 'López',
        email: emailComplete,
        tutoradosCount: 18
      };
      docentes.push(docComplete);
      for (let i=1;i<=14;i++){
        myDocs.push({ id: newId('d14'), docenteId: docComplete.id, type: '14', title: `Doc14-${i}`, createdAt: now });
      }
      for (let i=1;i<=16;i++){
        myDocs.push({ id: newId('d16'), docenteId: docComplete.id, type: '16', title: `Doc16-${i}`, createdAt: now });
      }
    }

    // crear docente parcial
    if (!existsByEmail(docentes, emailPartial)) {
      const docPartial = {
        id: newId('docente'),
        nombres: 'Juan Pablo',
        apellidoP: 'Ramos',
        apellidoM: 'Sánchez',
        email: emailPartial,
        tutoradosCount: 10
      };
      docentes.push(docPartial);
      for (let i=1;i<=7;i++){
        myDocs.push({ id: newId('d14'), docenteId: docPartial.id, type: '14', title: `Doc14-parcial-${i}`, createdAt: now });
      }
      for (let i=1;i<=5;i++){
        myDocs.push({ id: newId('d16'), docenteId: docPartial.id, type: '16', title: `Doc16-parcial-${i}`, createdAt: now });
      }
    }

    // guardar sin eliminar otros registros
    save('docentes', docentes);
    // evitar duplicados por id al mezclar: simple merge por id
    const existing = load('myDocuments');
    const merged = existing.concat(myDocs.filter(d => !existing.some(e => e.id === d.id)));
    save('myDocuments', merged);
  })();

  const up = JSON.parse(localStorage.getItem('subProfile') || localStorage.getItem('userProfile') || 'null');
  if (up) {
    nameEl.textContent = (up.nombres || up.name || 'Usuario').split(' ')[0];
    roleEl.textContent = up.role || 'Subdirección';
  }

  function loadDocuments() {
    return JSON.parse(localStorage.getItem('myDocuments') || localStorage.getItem('documents') || '[]');
  }

  function loadDocentes() {
    return JSON.parse(localStorage.getItem('docentes') || '[]');
  }

  // Requisitos exactos
  const REQ_14 = 14;
  const REQ_16 = 16;

  // Detectores de tipo: intenta distintas claves que podrían indicar paquete/tipo
  function isType14(doc) {
    if (!doc) return false;
    const t = String(doc.type || doc.docType || doc.package || doc.template || doc.group || '').toLowerCase();
    if (t === '14' || t.includes('14') || t.includes('paquete14') || t.includes('paquete 14') || t.includes('tipoa') || t.includes('a')) return true;
    if (Number(doc.requiredCount) === REQ_14 || Number(doc.expected) === REQ_14 || Number(doc.totalCount) === REQ_14) return true;
    return false;
  }
  function isType16(doc) {
    if (!doc) return false;
    const t = String(doc.type || doc.docType || doc.package || doc.template || doc.group || '').toLowerCase();
    if (t === '16' || t.includes('16') || t.includes('paquete16') || t.includes('paquete 16') || t.includes('tipob') || t.includes('b')) return true;
    if (Number(doc.requiredCount) === REQ_16 || Number(doc.expected) === REQ_16 || Number(doc.totalCount) === REQ_16) return true;
    return false;
  }

  function statusLabel(count, required) {
    if (count === 0) return 'No iniciado';
    if (count >= required) return 'Terminado';
    return 'En proceso';
  }

  function render() {
    const q = (filterEl.value || '').toLowerCase().trim();
    const docentes = loadDocentes().filter(d => {
      if (!q) return true;
      const text = `${d.nombres || ''} ${d.apellidoP || ''} ${d.apellidoM || ''} ${d.matricula || ''}`.toLowerCase();
      return text.includes(q);
    });
    const allDocs = loadDocuments();

    listEl.innerHTML = '';
    if (!docentes.length) {
      listEl.innerHTML = '<div class="empty"><p>No hay docentes registrados.</p><p class="small">Los registros aparecen aquí cuando se agregan en el módulo correspondiente.</p></div>';
      return;
    }

    const container = document.createElement('div');
    container.className = 'cards';

    docentes.forEach(d => {
      // documentos pertenecientes al docente
      const docsOf = allDocs.filter(doc => {
        const ownerId = String(doc.docenteId || doc.ownerId || doc.userId || doc.authorId || '');
        return ownerId && ownerId === String(d.id);
      });

      const count14 = docsOf.reduce((s, doc) => s + (isType14(doc) ? 1 : 0), 0);
      const count16 = docsOf.reduce((s, doc) => s + (isType16(doc) ? 1 : 0), 0);
      const total = docsOf.length;

      const st14 = statusLabel(count14, REQ_14);
      const st16 = statusLabel(count16, REQ_16);

      const card = document.createElement('div');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="left">
          <div class="title"><strong>${escapeHtml(((d.nombres||'') + ' ' + (d.apellidoP||'') + ' ' + (d.apellidoM||'')).trim())}</strong></div>
          <div class="meta small">${escapeHtml(d.email || '')}</div>
          <div class="meta small" style="margin-top:6px">
            Total documentos: <strong>${total}</strong>
          </div>

          <div class="breakdown" style="margin-top:8px">
            <div class="type-line"><strong>Documentos Inicio:</strong> ${count14}/${REQ_14} — <span class="status ${st14.replace(/\s+/g,'').toLowerCase()}">${st14}</span></div>
            <div class="type-line"><strong>Documentos Factor 1:</strong> ${count16}/${REQ_16} — <span class="status ${st16.replace(/\s+/g,'').toLowerCase()}">${st16}</span></div>
          </div>
        </div>
        <div class="right">
          <div class="small">Tutorados: ${Number(d.tutoradosCount || 0)}</div>
        </div>
      `;
      container.appendChild(card);
    });

    listEl.appendChild(container);
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"'`=\/]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[c])); }

  filterEl.addEventListener('input', render);
  refreshBtn.addEventListener('click', render);
  render();
});