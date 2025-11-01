document.addEventListener('DOMContentLoaded', () => {
  const back = document.getElementById('back');
  const box = document.getElementById('profile-box');
  const btnSave = document.getElementById('btn-save');
  const btnCancel = document.getElementById('btn-cancel');
  const msg = document.getElementById('msg');

  // datos por defecto (solo demo)
  const defaultProfile = {
    nombres: 'Fausto Gabriel',
    apellidoP: 'Espinoza',
    apellidoM: 'Félix',
    email: 'fausto@ejemplo.com',
    role: 'Docente Precalificado',
    password: 'password123',
    photo: '../src/components/foto_usuario.png'
  };

  // cargar perfil desde localStorage o usar default
  let profile = JSON.parse(localStorage.getItem('userProfile') || 'null');
  if (!profile) {
    profile = defaultProfile;
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } else {
    // si perfil tiene solo "name", dividir en partes
    if (!profile.nombres && profile.name) {
      const parts = String(profile.name).trim().split(/\s+/);
      if (parts.length >= 3) {
        profile.apellidoM = parts.pop();
        profile.apellidoP = parts.pop();
        profile.nombres = parts.join(' ');
      } else if (parts.length === 2) {
        profile.nombres = parts[0];
        profile.apellidoP = parts[1];
        profile.apellidoM = '';
      } else {
        profile.nombres = parts[0] || '';
        profile.apellidoP = '';
        profile.apellidoM = '';
      }
    }
    // asegurar campos mínimos
    profile.nombres = profile.nombres || '';
    profile.apellidoP = profile.apellidoP || '';
    profile.apellidoM = profile.apellidoM || '';
    profile.email = profile.email || defaultProfile.email;
    profile.role = profile.role || defaultProfile.role;
    profile.photo = profile.photo || defaultProfile.photo;
    profile.password = profile.password || defaultProfile.password;
  }

  renderProfile();

  function renderProfile() {
    // actualizar sidebar mini info si existe
    const sbName = document.getElementById('profile-name');
    const sbRole = document.getElementById('profile-role');
    if (sbName) sbName.textContent = profile.nombres.split(' ')[0] || profile.nombres || 'Docente';
    if (sbRole) sbRole.textContent = profile.role || '';

    // detalle perfil en la sección central
    const pfPhoto = document.getElementById('pf-photo');
    const pfEmail = document.getElementById('pf-email');
    const pfNombres = document.getElementById('pf-nombres');
    const pfApP = document.getElementById('pf-apellido-p');
    const pfApM = document.getElementById('pf-apellido-m');

    if (pfPhoto) pfPhoto.src = profile.photo;
    if (pfEmail) pfEmail.textContent = profile.email;
    if (pfNombres) pfNombres.textContent = profile.nombres;
    if (pfApP) pfApP.textContent = profile.apellidoP;
    if (pfApM) pfApM.textContent = profile.apellidoM;
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const current = document.getElementById('current').value || '';
      const nw = document.getElementById('newpass').value || '';
      const cf = document.getElementById('confirm').value || '';
      if (!current || !nw || !cf) return show('Complete todos los campos', true);
      if (current !== profile.password) return show('Contraseña actual incorrecta', true);
      if (nw.length < 6) return show('La contraseña debe tener al menos 6 caracteres', true);
      if (nw !== cf) return show('Las contraseñas no coinciden', true);

      profile.password = nw;
      localStorage.setItem('userProfile', JSON.stringify(profile));
      show('Contraseña actualizada', false);
      document.getElementById('current').value = '';
      document.getElementById('newpass').value = '';
      document.getElementById('confirm').value = '';
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      document.getElementById('current').value = '';
      document.getElementById('newpass').value = '';
      document.getElementById('confirm').value = '';
      msg.textContent = '';
    });
  }

  function show(txt, isError) {
    if (!msg) return;
    msg.textContent = txt;
    msg.style.color = isError ? '#FF6347' : '#8BC34A';
  }
});