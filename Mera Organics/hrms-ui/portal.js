const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const panelTitle = document.getElementById('panel-title');
const welcomeText = document.getElementById('welcome-text');
const createEmployeeButton = document.getElementById('create-employee-btn');
const logoutButton = document.getElementById('logout-btn');
const userNameElement = document.getElementById('current-user-name');
const userRoleElement = document.getElementById('current-user-role');
const profileInitials = document.getElementById('profile-initials');
const employeeSection = document.getElementById('employees');
const settingsSection = document.getElementById('settings');
const adminCreateForm = document.getElementById('admin-create-form');
const adminFormMessage = document.getElementById('admin-form-message');
const attendanceAction = document.getElementById('attendance-action');
const attendanceHistory = document.getElementById('attendance-history');
const leaveAction = document.getElementById('leave-action');
const leaveList = document.getElementById('leave-list');
const issueAction = document.getElementById('issue-action');
const issueList = document.getElementById('issue-list');
const reportGrid = document.getElementById('report-grid');

const panelMap = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  leave: 'Leave Requests',
  issues: 'Issues',
  reports: 'Reports',
  settings: 'Settings',
};

function getCurrentUser() {
  const stored = sessionStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getStoredUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function showPortalMessage(message, type = 'info') {
  if (!adminFormMessage) return;
  adminFormMessage.textContent = message;
  adminFormMessage.className = `admin-form-message ${type}`;
}

function attachActionHandlers() {
  const markAttendanceButton = document.getElementById('mark-attendance-btn');
  if (markAttendanceButton) {
    markAttendanceButton.addEventListener('click', () => {
      alert('Attendance marked for today.');
    });
  }

  const applyLeaveButton = document.getElementById('apply-leave-btn');
  if (applyLeaveButton) {
    applyLeaveButton.addEventListener('click', () => {
      alert('Leave request submitted.');
    });
  }

  const reportIssueButton = document.getElementById('report-issue-btn');
  if (reportIssueButton) {
    reportIssueButton.addEventListener('click', () => {
      alert('Issue reported to your manager.');
    });
  }

  const createIssueButton = document.getElementById('create-issue-btn');
  if (createIssueButton) {
    createIssueButton.addEventListener('click', () => {
      alert('Issue/task action ready.');
    });
  }
}

function selectPanel(panelId) {
  panels.forEach((panel) => {
    panel.classList.toggle('active-panel', panel.id === panelId);
  });
  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.panel === panelId);
  });
  panelTitle.textContent = panelMap[panelId] || 'Dashboard';
}

function updatePortalUI() {
  const user = getCurrentUser();
  if (!user) {
    redirectIfUnauthenticated('login.html');
    return;
  }

  if (userNameElement) {
    userNameElement.textContent = user.displayName || user.email;
  }
  if (userRoleElement) {
    userRoleElement.textContent = user.role;
  }
  if (profileInitials) {
    const initials = (user.displayName || user.email)
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');
    profileInitials.textContent = initials || 'HR';
  }
  if (welcomeText) {
    welcomeText.textContent = `Welcome back, ${user.role === 'admin' ? 'Admin' : user.role === 'team-leader' ? 'Team Leader' : 'Employee'}.`;
  }

  const isAdmin = user.role === 'admin';
  const isTeamLeader = user.role === 'team-leader';

  if (createEmployeeButton) {
    createEmployeeButton.style.display = isAdmin ? 'inline-flex' : 'none';
  }
  if (settingsSection) {
    settingsSection.style.display = isAdmin ? '' : 'none';
  }

  document.querySelectorAll('.nav-item').forEach((item) => {
    const panel = item.dataset.panel;
    if (panel === 'settings') {
      item.style.display = isAdmin ? '' : 'none';
    }
    if (panel === 'reports') {
      item.style.display = isAdmin ? '' : 'none';
    }
    if (panel === 'employees') {
      item.style.display = isAdmin || isTeamLeader ? '' : 'none';
    }
    if (panel === 'issues') {
      item.style.display = isAdmin || isTeamLeader ? '' : 'none';
    }
  });

  if (employeeSection && !isAdmin && !isTeamLeader) {
    employeeSection.querySelector('.panel-header h3').textContent = 'My profile';
    const search = employeeSection.querySelector('#employee-search');
    if (search) search.style.display = 'none';
    const rows = employeeSection.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      row.style.display = index === 0 ? '' : 'none';
    });
  }

  if (attendanceAction) {
    if (isAdmin || isTeamLeader) {
      attendanceAction.innerHTML = '<p>Attendance overview is available here. Employees mark attendance on their own portal.</p>';
      attendanceHistory.innerHTML = '<div class="chart-placeholder">Attendance overview for your team and company.</div>';
    } else {
      attendanceAction.innerHTML = '<button id="mark-attendance-btn" class="primary-btn">Mark Attendance</button>';
      attendanceHistory.innerHTML = '<div class="chart-placeholder">Your attendance history will appear here.</div>';
    }
  }

  if (leaveAction) {
    if (isAdmin) {
      leaveAction.innerHTML = '<p>Leave approval and tracking are managed by admin.</p>';
      leaveList.innerHTML = '<article class="request-card"><div><strong>Rohit Singh</strong><p>Annual leave • Jul 30 - Aug 03</p></div><div class="request-actions"><button class="secondary-btn">Approve</button><button class="text-btn">Decline</button></div></article>';
    } else if (isTeamLeader) {
      leaveAction.innerHTML = '<p>Team leaders can view leave requests but cannot approve them.</p>';
      leaveList.innerHTML = '<article class="request-card"><div><strong>Team leave requests</strong><p>View requests from your team in admin.</p></div></article>';
    } else {
      leaveAction.innerHTML = '<button id="apply-leave-btn" class="primary-btn">Apply for leave</button>';
      leaveList.innerHTML = '<div class="chart-placeholder">Your leave history will appear here.</div>';
    }
  }

  if (issueAction) {
    if (isAdmin) {
      issueAction.innerHTML = '<button id="create-issue-btn" class="primary-btn">Create issue/task</button>';
      issueList.innerHTML = '<article class="request-card"><div><strong>Server outage</strong><p>Investigate payroll sync failure.</p></div></article>';
    } else if (isTeamLeader) {
      issueAction.innerHTML = '<button id="create-issue-btn" class="primary-btn">Assign issue/task</button>';
      issueList.innerHTML = '<article class="request-card"><div><strong>Invoice review</strong><p>Assigned to team for completion.</p></div></article>';
    } else {
      issueAction.innerHTML = '<button id="report-issue-btn" class="primary-btn">Report issue</button>';
      issueList.innerHTML = '<div class="chart-placeholder">Your submitted issues will appear here.</div>';
    }
  }

  if (reportGrid) {
    if (isAdmin) {
      reportGrid.innerHTML = '<div class="feature-card"><h4>Export team report</h4><p>Download CSV or PDF exports.</p></div><div class="feature-card"><h4>Attendance report</h4><p>View attendance across the company.</p></div>';
    } else {
      reportGrid.innerHTML = '<div class="feature-card"><h4>Team performance</h4><p>Review assigned member reports.</p></div>';
    }
  }
}

function initPortal() {
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      selectPanel(item.dataset.panel);
    });
  });

  const employeeSearch = document.getElementById('employee-search');
  if (employeeSearch) {
    employeeSearch.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const rows = document.querySelectorAll('#employees tbody tr');
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  if (createEmployeeButton) {
    createEmployeeButton.addEventListener('click', () => {
      selectPanel('settings');
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = 'login.html';
    });
  }

  if (adminCreateForm) {
    adminCreateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = adminCreateForm.elements['employee-email'].value.trim().toLowerCase();
      const password = adminCreateForm.elements['employee-password'].value;
      const displayName = adminCreateForm.elements['employee-name'].value.trim();

      if (!email || !password || !displayName) {
        showPortalMessage('All fields are required.', 'error');
        return;
      }

      const users = getStoredUsers();
      if (users.some((user) => user.email.toLowerCase() === email)) {
        showPortalMessage('An account with that email already exists.', 'error');
        return;
      }

      const role = adminCreateForm.elements['employee-role']?.value || 'employee';
      users.push({
        email,
        password,
        role,
        displayName,
      });
      saveUsers(users);
      showPortalMessage('Login created successfully.', 'success');
      adminCreateForm.reset();
    });
  }

  updatePortalUI();
  attachActionHandlers();
}

window.addEventListener('DOMContentLoaded', initPortal);
