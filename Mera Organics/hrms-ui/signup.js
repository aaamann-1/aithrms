function showSignupMessage(message, type = 'error') {
  const element = document.getElementById('signup-message');
  if (!element) return;
  element.textContent = message;
  element.className = `login-message ${type}`;
}

function initSignupPage() {
  redirectIfAuthenticated('portal.html');

  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = signupForm.elements['name'].value.trim();
    const email = signupForm.elements['email'].value.trim().toLowerCase();
    const password = signupForm.elements['password'].value;

    const { user, error } = createUser({
      email,
      password,
      displayName: name,
      role: 'employee',
    });

    if (error) {
      showSignupMessage(error, 'error');
      return;
    }

    setCurrentUser(user);
    window.location.href = 'portal.html';
  });
}

window.addEventListener('DOMContentLoaded', initSignupPage);
