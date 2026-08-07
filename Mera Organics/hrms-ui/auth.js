const USERS_STORAGE_KEY = 'hrmsUsers';
const CURRENT_USER_KEY = 'hrmsCurrentUser';

const defaultUsers = [
  {
    email: 'admin@hrms.local',
    password: 'admin123',
    role: 'admin',
    displayName: 'Admin User',
  },
  {
    email: 'teamleader@hrms.local',
    password: 'leader123',
    role: 'team-leader',
    displayName: 'Team Leader User',
  },
  {
    email: 'employee@hrms.local',
    password: 'employee123',
    role: 'employee',
    displayName: 'Employee User',
  },
];

function seedDefaultUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      return [...defaultUsers];
    }
    return parsed;
  } catch {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
}

function getStoredUsers() {
  return seedDefaultUsers();
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const stored = sessionStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
}

function redirectIfAuthenticated(redirectTo = 'portal.html') {
  if (getCurrentUser()) {
    window.location.href = redirectTo;
  }
}

function redirectIfUnauthenticated(redirectTo = 'login.html') {
  if (!getCurrentUser()) {
    window.location.href = redirectTo;
  }
}

function findUserByEmail(email) {
  return getStoredUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase());
}

function createUser({ email, password, displayName, role = 'employee' }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  if (!normalizedEmail || !password || !displayName) {
    return { error: 'All fields are required.' };
  }
  if (findUserByEmail(normalizedEmail)) {
    return { error: 'An account with that email already exists.' };
  }

  const newUser = {
    email: normalizedEmail,
    password,
    role,
    displayName,
  };
  users.push(newUser);
  saveUsers(users);
  return { user: newUser };
}
