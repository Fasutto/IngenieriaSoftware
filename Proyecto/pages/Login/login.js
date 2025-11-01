// login.js - Lógica de autenticación y redirección multirrol

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Error al iniciar sesión');

      localStorage.setItem('token', data.token);
      if (data.role && data.role.toLowerCase() === 'admin') {
        window.location.href = 'admin_panel.html';
      } else {
        window.location.href = 'Docentes/principal.html';
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo conectar al servidor');
    }
  });
  
  // Lógica para el efecto visual del label
  form.querySelectorAll('.input-group input').forEach(input => {
    const label = input.nextElementSibling;
    
    // Mover label si el input tiene texto (útil si el navegador autocompleta)
    if (input.value !== "") {
      label.style.top = '10px';
      label.style.fontSize = '12px';
    }

    input.addEventListener('focus', () => {
      label.style.top = '10px';
      label.style.fontSize = '12px';
    });

    input.addEventListener('blur', () => {
      if (input.value === "") {
        label.style.top = '50%';
        label.style.fontSize = '20px';
      }
    });
  });
});