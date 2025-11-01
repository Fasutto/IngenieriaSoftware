// Script para crear docentes de ejemplo y documentos (ejecutar una vez desde la consola del navegador
// o incluirlo temporalmente en la página para poblar localStorage).
(function seedDemoData(){
  const now = Date.now();

  function load(key){ return JSON.parse(localStorage.getItem(key) || '[]'); }
  function save(key, v){ localStorage.setItem(key, JSON.stringify(v)); }

  const docentes = load('docentes');
  const docs = load('myDocuments').concat(load('documents')).concat(load('documents_v2')).filter(Boolean);

  // helpers
  function newId(prefix){ return `${prefix}_${Date.now()}_${Math.floor(Math.random()*10000)}`; }
  function existsByEmail(arr, email){ return arr.some(x => (x.email||'').toLowerCase() === (email||'').toLowerCase()); }

  // Docente COMPLETO (tiene todos los documentos para ambos paquetes)
  const emailComplete = 'completo.prof@institucion.edu';
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

    // generar 14 documentos tipo 14
    for (let i=1;i<=14;i++){
      docs.push({
        id: newId('d14'),
        docenteId: docComplete.id,
        type: '14',
        title: `Doc14-${i}`,
        createdAt: now
      });
    }
    // generar 16 documentos tipo 16
    for (let i=1;i<=16;i++){
      docs.push({
        id: newId('d16'),
        docenteId: docComplete.id,
        type: '16',
        title: `Doc16-${i}`,
        createdAt: now
      });
    }
    console.log('Docente completo creado:', docComplete.email);
  } else {
    console.log('Docente completo ya existe, no se duplicó:', emailComplete);
  }

  // Docente PARCIAL (tiene algunos documentos)
  const emailPartial = 'parcial.prof@institucion.edu';
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

    // generar 7 documentos tipo 14 (de 14)
    for (let i=1;i<=7;i++){
      docs.push({
        id: newId('d14'),
        docenteId: docPartial.id,
        type: '14',
        title: `Doc14-parcial-${i}`,
        createdAt: now
      });
    }
    // generar 5 documentos tipo 16 (de 16)
    for (let i=1;i<=5;i++){
      docs.push({
        id: newId('d16'),
        docenteId: docPartial.id,
        type: '16',
        title: `Doc16-parcial-${i}`,
        createdAt: now
      });
    }
    console.log('Docente parcial creado:', docPartial.email);
  } else {
    console.log('Docente parcial ya existe, no se duplicó:', emailPartial);
  }

  // Guardar sin borrar otros datos
  save('docentes', docentes);

  // Guardar documentos en 'myDocuments' (o 'documents' si prefieres)
  // Aquí los guardamos en 'myDocuments' para no interferir con otras claves.
  const existingMyDocs = load('myDocuments');
  const merged = existingMyDocs.concat(docs.filter(d => !existingMyDocs.some(ed => ed.id === d.id)));
  save('myDocuments', merged);

  console.log('Seed finalizada. Docentes totales:', docentes.length, 'Documentos totales (myDocuments):', merged.length);
})();