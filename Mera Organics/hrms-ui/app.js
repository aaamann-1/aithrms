const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const panelTitle = document.getElementById('panel-title');
const panelMap = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  leave: 'Leave Requests',
  settings: 'Settings',
};

function selectPanel(panelId) {
  panels.forEach((panel) => {
    panel.classList.toggle('active-panel', panel.id === panelId);
  });
  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.panel === panelId);
  });
  panelTitle.textContent = panelMap[panelId] || 'Dashboard';
}

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
