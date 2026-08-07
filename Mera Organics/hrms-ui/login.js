function showLoginMessage(message, type = 'error') {
  const element = document.getElementById('login-message');
  if (!element) return;
  element.textContent = message;
  element.className = `login-message ${type}`;
}

function initLoginPage() {
  redirectIfAuthenticated('portal.html');

  const hint = document.getElementById('credentials-info');
  if (hint) {
    hint.innerHTML = `Default demo users:<br />
      <strong>Admin</strong>: admin@hrms.local / admin123<br />
      <strong>Team Leader</strong>: teamleader@hrms.local / leader123<br />
      <strong>Employee</strong>: employee@hrms.local / employee123`;
  }

  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim().toLowerCase();
    const password = loginForm.querySelector('input[type="password"]').value;

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      showLoginMessage('Invalid email or password. Try the demo credentials or ask an admin to create your account.');
      return;
    }

    setCurrentUser(user);
    window.location.href = 'portal.html';
  });
}

window.addEventListener('DOMContentLoaded', initLoginPage);
