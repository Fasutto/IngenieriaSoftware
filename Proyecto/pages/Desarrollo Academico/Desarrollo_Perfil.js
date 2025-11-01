document.addEventListener('DOMContentLoaded', () => {
  const photo = document.getElementById('dp-photo');
  const emailEl = document.getElementById('dp-email');
  const nombresEl = document.getElementById('dp-nombres');
  const apellidosEl = document.getElementById('dp-apellidos');
  const tutoradosEl = document.getElementById('dp-tutorados');
  const btnGo = document.getElementById('btn-go-asignar');
  const btnBack = document.getElementById('btn-back-da');
  const sidebarName = document.getElementById('profile-name');
  const sidebarRole = document.getElementById('profile-role');

  // Preferir perfil específico del módulo (clave: 'daProfile'), si no usar userProfile como fallback
  const daProfile = JSON.parse(localStorage.getItem('daProfile') || 'null');
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
  const data = daProfile || userProfile || {};

  // Si no existe daProfile y userProfile no corresponde, crear perfil demo de Desarrollo Académico
  if (!daProfile && (!userProfile || (userProfile.role && !/desarrollo/i.test(userProfile.role)))) {
    const demo = {
      nombres: 'Coordinación',
      apellidoP: 'Desarrollo',
      apellidoM: '',
      email: 'desarrollo@institucion.edu',
      role: 'Desarrollo Académico',
      photo: '../../src/components/foto_usuario.png',
      tutoradosCount: 0
    };
    // no sobrescribimos userProfile, pero guardamos demo en daProfile para este módulo
    localStorage.setItem('daProfile', JSON.stringify(demo));
  }

  // recargar data desde la clave correcta
  const profileData = JSON.parse(localStorage.getItem('daProfile') || localStorage.getItem('userProfile') || 'null') || {};

  // Rellenar la UI con los datos de Desarrollo Académico
  photo.src = profileData.photo || '../../src/components/foto_usuario.png';
  emailEl.textContent = profileData.email || '-';
  nombresEl.textContent = profileData.nombres || profileData.name || '-';
  const ap = `${profileData.apellidoP || ''} ${profileData.apellidoM || ''}`.trim();
  apellidosEl.textContent = ap || '-';
  tutoradosEl.textContent = String(Number(profileData.tutoradosCount || 0));

  // Actualizar sidebar si existe
  if (sidebarName) sidebarName.textContent = (profileData.nombres || profileData.name || 'Usuario').split(' ')[0];
  if (sidebarRole) sidebarRole.textContent = profileData.role || 'Desarrollo Académico';

  // "Ir a asignar" abre la interfaz de asignación
  btnGo?.addEventListener('click', () => {
    location.href = 'desarrollo_asignar.html';
  });

  // Volver al inicio del módulo
  btnBack?.addEventListener('click', () => location.href = 'desarrollo_inicio.html');
});