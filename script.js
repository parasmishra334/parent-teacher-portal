/**
 * ParentTeacher Connect Portal - Main Application Logic
 * Role-Based Access Control, Real-Time Interactivity, Full LocalStorage CRUD
 */

document.addEventListener('DOMContentLoaded', () => {
  // Determine if on landing page or dashboard
  const isDashboard = !!document.getElementById('dash-content-outlet');
  
  if (isDashboard) {
    initDashboard();
  } else {
    initLandingPage();
  }

  initGlobalTheme();
});

// ==========================================
// Theme Management
// ==========================================
function initGlobalTheme() {
  const currentTheme = getThemePreference();
  applyTheme(currentTheme);

  const themeBtns = [
    document.getElementById('theme-toggle-btn'),
    document.getElementById('dash-theme-btn')
  ];

  themeBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const active = getThemePreference() === 'dark' ? 'light' : 'dark';
        setThemePreference(active);
        applyTheme(active);
        showToast(`Theme switched to ${active} mode`, 'info');
      });
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icons = [
    document.getElementById('theme-icon'),
    document.getElementById('dash-theme-icon')
  ];
  icons.forEach(icon => {
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    }
  });
}

// ==========================================
// Toast Notification System
// ==========================================
function showToast(message, type = 'info', title = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const titles = {
    success: 'Success',
    warning: 'Attention',
    danger: 'Error',
    info: 'Notification'
  };

  const icons = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    danger: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.innerHTML = `
    <div style="color:var(--${type}); font-size:1.2rem;">
      <i class="fa-solid ${icons[type] || 'fa-bell'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title || titles[type]}</div>
      <div class="toast-body">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// Modal Helpers
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    const targetId = closeBtn.getAttribute('data-close-modal');
    closeModal(targetId);
  }
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ==========================================
// Landing Page Logic (index.html)
// ==========================================
function initLandingPage() {
  const data = loadData();

  // Render photo gallery
  const galleryContainer = document.getElementById('landing-gallery-grid');
  if (galleryContainer && data.gallery) {
    galleryContainer.innerHTML = data.gallery.map(item => `
      <div class="gallery-card">
        <img src="${item.url}" alt="${item.title}" class="gallery-img">
        <div class="gallery-body">
          <span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark); margin-bottom:0.4rem;">${item.category}</span>
          <h4 style="font-size:1.05rem; margin-bottom:0.25rem;">${item.title}</h4>
          <p style="font-size:0.82rem; color:var(--text-muted);">${item.caption}</p>
        </div>
      </div>
    `).join('');
  }

  // Demo Login Buttons (Hero & Nav)
  document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = e.currentTarget.getAttribute('data-demo');
      handleDemoLogin(role);
    });
  });

  // Login Modal
  const openLoginBtn = document.getElementById('open-login-btn');
  if (openLoginBtn) openLoginBtn.addEventListener('click', () => openModal('login-modal'));

  // Register Modal
  const openRegBtn = document.getElementById('open-register-btn');
  if (openRegBtn) openRegBtn.addEventListener('click', () => openModal('register-modal'));

  // Registration Tabs
  const tabParent = document.getElementById('tab-reg-parent');
  const tabTeacher = document.getElementById('tab-reg-teacher');
  const formParent = document.getElementById('register-parent-form');
  const formTeacher = document.getElementById('register-teacher-form');

  if (tabParent && tabTeacher) {
    tabParent.addEventListener('click', () => {
      tabParent.classList.add('active');
      tabParent.style.borderBottom = '2px solid var(--primary)';
      tabTeacher.classList.remove('active');
      tabTeacher.style.borderBottom = 'none';
      formParent.style.display = 'block';
      formTeacher.style.display = 'none';
    });

    tabTeacher.addEventListener('click', () => {
      tabTeacher.classList.add('active');
      tabTeacher.style.borderBottom = '2px solid var(--primary)';
      tabParent.classList.remove('active');
      tabParent.style.borderBottom = 'none';
      formTeacher.style.display = 'block';
      formParent.style.display = 'none';
    });
  }

  // Autofill buttons inside login modal
  document.querySelectorAll('.autofill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.currentTarget.getAttribute('data-email');
      const pass = e.currentTarget.getAttribute('data-pass');
      const role = e.currentTarget.getAttribute('data-role');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = pass;
      document.getElementById('login-role').value = role;
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value.trim();
      const role = document.getElementById('login-role').value;
      const errorDiv = document.getElementById('login-error-msg');

      const allUsers = loadData().users;
      const matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass && u.role === role);

      if (matched) {
        setCurrentUser(matched);
        showToast(`Welcome back, ${matched.name}!`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);
      } else {
        errorDiv.textContent = 'Invalid credentials or role mismatch. Please verify email and password.';
        errorDiv.style.display = 'block';
      }
    });
  }

  // Parent Registration
  if (formParent) {
    formParent.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-parent-name').value.trim();
      const email = document.getElementById('reg-parent-email').value.trim();
      const phone = document.getElementById('reg-parent-phone').value.trim();
      const password = document.getElementById('reg-parent-password').value.trim();
      const childName = document.getElementById('reg-child-name').value.trim();
      const childClass = document.getElementById('reg-child-class').value.trim();
      const address = document.getElementById('reg-parent-address').value.trim();

      const store = loadData();
      if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('An account with this email address already exists.');
        return;
      }

      const newParentId = generateId('PRN');
      const newStudentId = generateId('STU');
      const newUserId = generateId('USR');

      const newUser = { id: newUserId, name, email, password, role: 'parent', parent_id: newParentId };
      const newParent = { id: newParentId, name, email, phone, children: [newStudentId], address };
      const newStudent = { id: newStudentId, name: childName, class: childClass, section: 'A', roll_no: '25', parent_id: newParentId, teacher_id: 'TCH-001', dob: '2013-05-10', blood_group: 'B+' };

      store.users.push(newUser);
      store.parents.push(newParent);
      store.students.push(newStudent);
      saveData(store);

      setCurrentUser(newUser);
      showToast(`Registration successful! Welcome, ${name}.`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  }

  // Teacher Registration
  if (formTeacher) {
    formTeacher.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-teacher-name').value.trim();
      const email = document.getElementById('reg-teacher-email').value.trim();
      const phone = document.getElementById('reg-teacher-phone').value.trim();
      const password = document.getElementById('reg-teacher-password').value.trim();
      const subject = document.getElementById('reg-teacher-subject').value.trim();
      const assignedClass = document.getElementById('reg-teacher-class').value.trim();
      const avail = document.getElementById('reg-teacher-avail').value.trim();

      const store = loadData();
      if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('An account with this email address already exists.');
        return;
      }

      const newTeacherId = generateId('TCH');
      const newUserId = generateId('USR');

      const newUser = { id: newUserId, name, email, password, role: 'teacher', teacher_id: newTeacherId };
      const newTeacher = { id: newTeacherId, name, subject, class_assigned: assignedClass, email, phone, availability: avail || 'Mon-Fri 2:30 PM - 3:30 PM' };

      store.users.push(newUser);
      store.teachers.push(newTeacher);
      saveData(store);

      setCurrentUser(newUser);
      showToast(`Teacher profile created! Welcome, ${name}.`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  }

  // Reset Demo Data
  const resetBtn = document.getElementById('landing-reset-data-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Restore default school demo dataset?')) {
        resetDemoData();
        showToast('Demo data restored successfully!', 'success');
        setTimeout(() => location.reload(), 600);
      }
    });
  }
}

function handleDemoLogin(role) {
  const store = loadData();
  let targetUser = null;

  if (role === 'parent') {
    targetUser = store.users.find(u => u.email === 'priya@email.com');
  } else if (role === 'teacher') {
    targetUser = store.users.find(u => u.email === 'suresh@school.edu');
  } else if (role === 'admin') {
    targetUser = store.users.find(u => u.email === 'admin@school.edu');
  }

  if (targetUser) {
    setCurrentUser(targetUser);
    showToast(`Logged in as ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 400);
  }
}

// ==========================================
// Dashboard Logic (dashboard.html)
// ==========================================
function initDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  if (paramRole) {
    const store = loadData();
    let userForRole = null;
    if (paramRole === 'parent') userForRole = store.users.find(u => u.email === 'priya@email.com');
    else if (paramRole === 'teacher') userForRole = store.users.find(u => u.email === 'suresh@school.edu');
    else if (paramRole === 'admin') userForRole = store.users.find(u => u.email === 'admin@school.edu');
    if (userForRole) setCurrentUser(userForRole);
  }

  let currentUser = getCurrentUser();

  // If no session found, default to Priya Sharma (Parent demo)
  if (!currentUser) {
    const store = loadData();
    currentUser = store.users.find(u => u.email === 'priya@email.com') || store.users[0];
    setCurrentUser(currentUser);
  }

  let selectedChildId = null;
  let activeTab = 'overview';

  // Setup sidebar toggle for mobile
  const sidebarToggle = document.getElementById('dash-sidebar-toggle');
  const sidebarClose = document.getElementById('dash-sidebar-close');
  const sidebar = document.getElementById('dash-sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // Topbar quick role switcher
  const roleSelect = document.getElementById('header-role-select');
  if (roleSelect) {
    roleSelect.value = currentUser.role;
    roleSelect.addEventListener('change', (e) => {
      const chosenRole = e.target.value;
      handleDemoLogin(chosenRole);
    });
  }

  // Logout buttons
  const logoutAction = () => {
    if (confirm('Are you sure you want to log out of the portal?')) {
      clearCurrentUser();
      showToast('You have been safely logged out.', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  };

  document.getElementById('sidebar-logout-btn')?.addEventListener('click', logoutAction);
  document.getElementById('dash-top-logout-btn')?.addEventListener('click', logoutAction);

  // Setup User Profile Display
  const updateProfileUI = () => {
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');

    if (nameEl) nameEl.textContent = currentUser.name;
    if (roleEl) roleEl.textContent = currentUser.role.toUpperCase();
    if (avatarEl) {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      avatarEl.textContent = initials;
    }
  };

  // Setup Parent Child Selector
  const setupChildSelector = () => {
    const box = document.getElementById('parent-child-selector-box');
    const dropdown = document.getElementById('child-select-dropdown');

    if (currentUser.role === 'parent') {
      const store = loadData();
      const parentRecord = store.parents.find(p => p.id === currentUser.parent_id);
      if (parentRecord && parentRecord.children && parentRecord.children.length > 0) {
        box.style.display = 'flex';
        dropdown.innerHTML = parentRecord.children.map(cId => {
          const child = store.students.find(s => s.id === cId);
          return child ? `<option value="${child.id}">${child.name} (Class ${child.class}-${child.section})</option>` : '';
        }).join('');

        selectedChildId = parentRecord.children[0];

        dropdown.addEventListener('change', (e) => {
          selectedChildId = e.target.value;
          renderActiveView();
          showToast(`Switched view to ${dropdown.options[dropdown.selectedIndex].text}`, 'info');
        });
      }
    } else {
      box.style.display = 'none';
    }

    // Teacher class badge
    const teacherBadge = document.getElementById('teacher-class-label');
    const teacherText = document.getElementById('teacher-class-text');
    if (currentUser.role === 'teacher') {
      const store = loadData();
      const teacherRecord = store.teachers.find(t => t.id === currentUser.teacher_id);
      if (teacherRecord && teacherBadge) {
        teacherBadge.style.display = 'block';
        teacherText.textContent = `${teacherRecord.subject} (${teacherRecord.class_assigned})`;
      }
    } else if (teacherBadge) {
      teacherBadge.style.display = 'none';
    }
  };

  // Render Sidebar Links based on role
  const renderSidebarLinks = () => {
    const nav = document.getElementById('dash-sidebar-nav');
    const store = loadData();
    const unreadMsgs = store.messages.filter(m => m.receiver_id === (currentUser.parent_id || currentUser.teacher_id || currentUser.id) && m.status === 'unread').length;

    let links = [];

    if (currentUser.role === 'parent') {
      links = [
        { id: 'overview', icon: 'fa-house-user', label: 'Student Overview' },
        { id: 'academic', icon: 'fa-chart-column', label: 'Grades & Progress' },
        { id: 'attendance', icon: 'fa-calendar-check', label: 'Attendance' },
        { id: 'fees', icon: 'fa-credit-card', label: 'Fee Payments' },
        { id: 'messages', icon: 'fa-comments', label: 'Messages', badge: unreadMsgs },
        { id: 'meetings', icon: 'fa-handshake', label: 'PTM Conferences' },
        { id: 'homework', icon: 'fa-book-open', label: 'Homework' },
        { id: 'behavior', icon: 'fa-award', label: 'Behavior Log' },
        { id: 'events', icon: 'fa-bullhorn', label: 'Events & Notices' }
      ];
    } else if (currentUser.role === 'teacher') {
      links = [
        { id: 'overview', icon: 'fa-chalkboard-user', label: 'Class Overview' },
        { id: 'students', icon: 'fa-user-group', label: 'My Students' },
        { id: 'attendance', icon: 'fa-clipboard-user', label: 'Mark Attendance' },
        { id: 'grades', icon: 'fa-file-signature', label: 'Gradebook' },
        { id: 'messages', icon: 'fa-comments', label: 'Messages', badge: unreadMsgs },
        { id: 'meetings', icon: 'fa-handshake', label: 'PTM Meetings' },
        { id: 'homework', icon: 'fa-book-open', label: 'Post Homework' },
        { id: 'behavior', icon: 'fa-award', label: 'Behavior Notes' },
        { id: 'events', icon: 'fa-bullhorn', label: 'Announcements' }
      ];
    } else {
      // Admin
      links = [
        { id: 'overview', icon: 'fa-chart-pie', label: 'System Overview' },
        { id: 'users', icon: 'fa-users-gear', label: 'User Directory (CRUD)' },
        { id: 'messages', icon: 'fa-envelope-open-text', label: 'All School Messages' },
        { id: 'attendance', icon: 'fa-calendar-days', label: 'Attendance Audit' },
        { id: 'fees', icon: 'fa-receipt', label: 'Fee Collections' },
        { id: 'meetings', icon: 'fa-handshake', label: 'All PTM Schedules' },
        { id: 'events', icon: 'fa-bullhorn', label: 'Manage Events' },
        { id: 'reports', icon: 'fa-file-invoice-dollar', label: 'Reports & CSV Export' },
        { id: 'settings', icon: 'fa-sliders', label: 'System Settings' }
      ];
    }

    nav.innerHTML = `
      <div class="dash-nav-section-title">Navigation Menu</div>
      ${links.map(link => `
        <a href="#${link.id}" class="dash-nav-link ${activeTab === link.id ? 'active' : ''}" data-tab="${link.id}">
          <i class="fa-solid ${link.icon}"></i>
          <span>${link.label}</span>
          ${link.badge ? `<span class="dash-nav-badge">${link.badge}</span>` : ''}
        </a>
      `).join('')}
    `;

    nav.querySelectorAll('.dash-nav-link').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = a.getAttribute('data-tab');
        window.location.hash = tab;
        activeTab = tab;
        renderSidebarLinks();
        renderActiveView();
        if (sidebar) sidebar.classList.remove('open');
      });
    });
  };

  // Route Handling
  const handleRouting = () => {
    const hash = window.location.hash.replace('#', '') || 'overview';
    activeTab = hash;
    renderSidebarLinks();
    renderActiveView();
  };

  window.addEventListener('hashchange', handleRouting);

  // Notifications Drawer
  document.getElementById('dash-notif-btn')?.addEventListener('click', () => {
    openNotificationsDrawer();
  });

  const openNotificationsDrawer = () => {
    const modal = document.getElementById('notif-modal');
    const body = document.getElementById('notif-modal-body');
    const store = loadData();

    const notifs = [
      { icon: 'fa-envelope', title: 'New Message Received', text: 'Suresh Iyer replied regarding Math Olympiad.', time: '10 mins ago' },
      { icon: 'fa-credit-card', title: 'Fee Due Date Approaching', text: 'Term 2 Tuition Fee due on Nov 30.', time: '1 hour ago' },
      { icon: 'fa-calendar-check', title: 'Attendance Marked', text: 'Present in Class 8-A today.', time: 'Today 09:15 AM' },
      { icon: 'fa-handshake', title: 'PTM Confirmed', text: 'Conference confirmed for Nov 18, 3:00 PM.', time: 'Yesterday' }
    ];

    body.innerHTML = notifs.map(n => `
      <div style="padding:1rem 1.25rem; border-bottom:1px solid var(--border-color); display:flex; gap:0.85rem; align-items:flex-start;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-light); color:var(--primary-dark); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div>
          <strong style="font-size:0.9rem; color:var(--text-main);">${n.title}</strong>
          <p style="font-size:0.82rem; color:var(--text-muted); margin:0.15rem 0;">${n.text}</p>
          <span style="font-size:0.75rem; color:var(--text-light);">${n.time}</span>
        </div>
      </div>
    `).join('');

    modal.classList.add('active');
  };

  // Core Render Outlet View Dispatcher
  function renderActiveView() {
    const container = document.getElementById('dash-content-outlet');
    if (!container) return;

    const role = currentUser.role;

    if (role === 'parent') {
      renderParentViews(container, activeTab, selectedChildId);
    } else if (role === 'teacher') {
      renderTeacherViews(container, activeTab);
    } else {
      renderAdminViews(container, activeTab);
    }
  }

  // Initial runs
  updateProfileUI();
  setupChildSelector();
  handleRouting();
}

// =========================================================================
// PARENT ROLE VIEWS
// =========================================================================
function renderParentViews(container, tab, childId) {
  const store = loadData();
  const child = store.students.find(s => s.id === childId) || store.students[0];
  const teacher = store.teachers.find(t => t.id === child.teacher_id) || store.teachers[0];

  switch (tab) {
    case 'overview':
      renderParentOverview(container, child, teacher, store);
      break;
    case 'academic':
      renderParentAcademic(container, child, store);
      break;
    case 'attendance':
      renderParentAttendance(container, child, store);
      break;
    case 'fees':
      renderParentFees(container, child, store);
      break;
    case 'messages':
      renderMessagingView(container, store, 'parent');
      break;
    case 'meetings':
      renderParentMeetings(container, child, store);
      break;
    case 'homework':
      renderParentHomework(container, child, store);
      break;
    case 'behavior':
      renderParentBehavior(container, child, store);
      break;
    case 'events':
      renderEventsView(container, store);
      break;
    default:
      renderParentOverview(container, child, teacher, store);
  }
}

function renderParentOverview(container, child, teacher, store) {
  const childGrades = store.academic.filter(a => a.student_id === child.id);
  const childAttendance = store.attendance.filter(a => a.student_id === child.id);
  const childFees = store.fees.filter(f => f.student_id === child.id);

  const totalClasses = childAttendance.length || 1;
  const presentCount = childAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendancePct = Math.round((presentCount / totalClasses) * 100);

  const avgMarks = childGrades.length ? Math.round(childGrades.reduce((sum, g) => sum + g.marks, 0) / childGrades.length) : 0;
  const pendingFees = childFees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Student Portfolio: ${child.name}</h1>
        <p>Class ${child.class}-${child.section} · Roll No: ${child.roll_no} · Homeroom Teacher: ${teacher.name}</p>
      </div>
      <div class="dash-page-actions">
        <a href="#messages" class="btn btn-primary"><i class="fa-solid fa-envelope"></i> Message Teacher</a>
        <a href="#meetings" class="btn btn-secondary"><i class="fa-solid fa-calendar-plus"></i> Request PTM</a>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Overall Attendance</span>
          <span class="kpi-value">${attendancePct}%</span>
          <span class="kpi-subtext" style="color:var(--success);"><i class="fa-solid fa-circle-check"></i> ${presentCount} of ${totalClasses} sessions</span>
        </div>
        <div class="kpi-icon-box"><i class="fa-solid fa-calendar-check"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Academic Average</span>
          <span class="kpi-value">${avgMarks}%</span>
          <span class="kpi-subtext"><i class="fa-solid fa-award"></i> Grade A1 Equivalent</span>
        </div>
        <div class="kpi-icon-box" style="background:#eff6ff; color:#2563eb;"><i class="fa-solid fa-graduation-cap"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Pending School Fees</span>
          <span class="kpi-value" style="color:${totalPendingAmount > 0 ? 'var(--primary)' : 'var(--success)'};">₹${totalPendingAmount.toLocaleString('en-IN')}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-receipt"></i> ${pendingFees.length} Pending Invoice(s)</span>
        </div>
        <div class="kpi-icon-box" style="background:#fffbeb; color:#d97706;"><i class="fa-solid fa-credit-card"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Teacher Availability</span>
          <span class="kpi-value" style="font-size:1.15rem; font-weight:700;">${teacher.name}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-clock"></i> ${teacher.availability}</span>
        </div>
        <div class="kpi-icon-box" style="background:#ecfdf5; color:#059669;"><i class="fa-solid fa-user-tie"></i></div>
      </div>
    </div>

    <!-- Quick Sections Grid -->
    <div class="dash-grid-2">
      <!-- Subject Progress Snapshot -->
      <div class="dash-card">
        <div class="dash-card-header">
          <h2 class="dash-card-title"><i class="fa-solid fa-chart-simple" style="color:var(--primary);"></i> Recent Subject Performance</h2>
          <a href="#academic" class="btn btn-sm btn-secondary">Full Report Card</a>
        </div>
        <div style="display:flex; flex-direction:column; gap:1.1rem;">
          ${childGrades.slice(0, 4).map(g => `
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                <span style="font-weight:700; font-size:0.9rem;">${g.subject}</span>
                <span style="font-weight:700; color:var(--primary); font-size:0.9rem;">${g.marks} / ${g.max_marks || 100} (${g.grade})</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${g.marks}%;"></div>
              </div>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">${g.comments}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Notices & Homeroom Teacher -->
      <div class="dash-card">
        <div class="dash-card-header">
          <h2 class="dash-card-title"><i class="fa-solid fa-bullhorn" style="color:var(--primary);"></i> School Circulars</h2>
          <a href="#events" class="btn btn-sm btn-secondary">All Notices</a>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          ${store.announcements.slice(0, 3).map(ann => `
            <div style="padding:0.75rem; background:var(--bg-app); border-radius:8px; border:1px solid var(--border-color);">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                <span class="status-badge status-${ann.priority === 'High' ? 'overdue' : 'present'}" style="font-size:0.7rem;">${ann.priority}</span>
                <span style="font-size:0.75rem; color:var(--text-light);">${ann.date}</span>
              </div>
              <strong style="font-size:0.88rem; color:var(--text-main); display:block;">${ann.title}</strong>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">${ann.description.substring(0, 95)}...</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderParentAcademic(container, child, store) {
  const grades = store.academic.filter(g => g.student_id === child.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Academic Progress & Term Report Card</h1>
        <p>Comprehensive subject breakdown, letter grades, marks, and faculty comments for ${child.name}.</p>
      </div>
      <div class="dash-page-actions">
        <button class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Report Card</button>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Scored</th>
              <th>Percentage</th>
              <th>Letter Grade</th>
              <th>Teacher Comments & Recommendations</th>
            </tr>
          </thead>
          <tbody>
            ${grades.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No grade records found.</td></tr>' : grades.map(g => {
              const gradeClass = 'grade-' + g.grade.toLowerCase();
              return `
                <tr>
                  <td><strong>${g.subject}</strong></td>
                  <td><strong style="font-size:1.05rem;">${g.marks}</strong> / ${g.max_marks || 100}</td>
                  <td style="min-width:140px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.78rem;">
                      <span>${g.marks}%</span>
                    </div>
                    <div class="progress-bar-container" style="margin:0.2rem 0 0;">
                      <div class="progress-bar-fill" style="width:${g.marks}%;"></div>
                    </div>
                  </td>
                  <td><span class="grade-badge ${gradeClass}">${g.grade}</span></td>
                  <td><span style="font-size:0.85rem; color:var(--text-muted);">${g.comments}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderParentAttendance(container, child, store) {
  const records = store.attendance.filter(a => a.student_id === child.id);
  const total = records.length || 1;
  const present = records.filter(r => r.status === 'Present').length;
  const late = records.filter(r => r.status === 'Late').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const pct = Math.round(((present + late) / total) * 100);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Attendance Log & Analytics: ${child.name}</h1>
        <p>Real-time daily morning homeroom roll call records.</p>
      </div>
    </div>

    <!-- Attendance KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Cumulative Attendance</span>
          <span class="kpi-value">${pct}%</span>
          <span class="kpi-subtext" style="color:var(--success);">Meets CBSE & ICSE Minimum (75%)</span>
        </div>
        <div class="kpi-icon-box"><i class="fa-solid fa-chart-pie"></i></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Present Days</span>
          <span class="kpi-value" style="color:var(--success);">${present}</span>
        </div>
        <div class="kpi-icon-box" style="background:#ecfdf5; color:#059669;"><i class="fa-solid fa-user-check"></i></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Late Arrivals</span>
          <span class="kpi-value" style="color:var(--warning);">${late}</span>
        </div>
        <div class="kpi-icon-box" style="background:#fffbeb; color:#d97706;"><i class="fa-solid fa-clock"></i></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Absent Days</span>
          <span class="kpi-value" style="color:var(--danger);">${absent}</span>
        </div>
        <div class="kpi-icon-box" style="background:#fef2f2; color:#ef4444;"><i class="fa-solid fa-user-xmark"></i></div>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="dash-card-header" style="padding:1.25rem 1.5rem; margin-bottom:0; border-bottom:1px solid var(--border-color);">
        <h2 class="dash-card-title"><i class="fa-solid fa-table-list"></i> Daily Attendance Calendar Log</h2>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Status</th>
              <th>Remarks / Verification</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(r => {
              const d = new Date(r.date);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
              return `
                <tr>
                  <td><strong>${r.date}</strong></td>
                  <td>${dayName}</td>
                  <td><span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span></td>
                  <td><span style="font-size:0.85rem; color:var(--text-muted);">${r.status === 'Present' ? 'Verified by Class Teacher' : (r.status === 'Late' ? 'Arrived after 08:30 AM assembly' : 'Excused medical absence')}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderParentFees(container, child, store) {
  const fees = store.fees.filter(f => f.student_id === child.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Fee Invoices & Online Payments</h1>
        <p>Tuition schedules, transport fees, and payment receipt records for ${child.name}.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fee Description</th>
              <th>Amount (₹)</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Receipt Ref</th>
              <th>Status</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${fees.map(f => `
              <tr>
                <td><strong>${f.fee_type}</strong></td>
                <td><strong style="font-size:1.05rem;">₹${f.amount.toLocaleString('en-IN')}</strong></td>
                <td>${f.due_date}</td>
                <td>${f.paid_date || '-'}</td>
                <td><span style="font-size:0.8rem; font-family:monospace;">${f.receipt_no || '-'}</span></td>
                <td><span class="status-badge status-${f.status.toLowerCase()}">${f.status}</span></td>
                <td style="text-align:right;">
                  ${f.status !== 'Paid' ? `
                    <button class="btn btn-sm btn-primary pay-now-btn" data-fee-id="${f.id}" data-amount="${f.amount}" data-title="${f.fee_type}">
                      <i class="fa-solid fa-credit-card"></i> Pay Now
                    </button>
                  ` : `
                    <button class="btn btn-sm btn-secondary" onclick="alert('Receipt #${f.receipt_no}\\nAmount: ₹${f.amount.toLocaleString('en-IN')}\\nPaid on: ${f.paid_date}\\nStatus: Cleared')">
                      <i class="fa-solid fa-receipt"></i> View Receipt
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Pay button handlers
  container.querySelectorAll('.pay-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fId = e.currentTarget.getAttribute('data-fee-id');
      const amt = e.currentTarget.getAttribute('data-amount');
      const title = e.currentTarget.getAttribute('data-title');
      openPayFeeModal(fId, amt, title);
    });
  });
}

function openPayFeeModal(feeId, amount, title) {
  const modal = document.getElementById('pay-fee-modal');
  document.getElementById('pay-fee-id').value = feeId;
  document.getElementById('pay-fee-title').textContent = title;
  document.getElementById('pay-fee-amount-display').textContent = `₹${Number(amount).toLocaleString('en-IN')}`;

  const form = document.getElementById('pay-fee-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const store = loadData();
    const fee = store.fees.find(f => f.id === feeId);
    if (fee) {
      fee.status = 'Paid';
      fee.paid_date = new Date().toISOString().split('T')[0];
      fee.receipt_no = 'RCP-2026-' + Math.floor(1000 + Math.random() * 9000);
      saveData(store);

      closeModal('pay-fee-modal');
      showToast(`Payment of ₹${Number(amount).toLocaleString('en-IN')} successful! Receipt #${fee.receipt_no} generated.`, 'success');
      showToast('📧 Simulated Email: Payment confirmation sent to parent email address.', 'info');

      // Re-render
      const currentUser = getCurrentUser();
      const parentRecord = store.parents.find(p => p.id === currentUser.parent_id);
      renderParentFees(document.getElementById('dash-content-outlet'), { id: fee.student_id }, store);
    }
  };

  modal.classList.add('active');
}

function renderParentMeetings(container, child, store) {
  const currentUser = getCurrentUser();
  const meetings = store.meetings.filter(m => m.parent_id === currentUser.parent_id);
  const teachers = store.teachers;

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Parent-Teacher Conferences (PTM)</h1>
        <p>Schedule one-on-one appointments with your child’s teachers.</p>
      </div>
      <div class="dash-page-actions">
        <button class="btn btn-primary" id="open-schedule-mtg-btn">
          <i class="fa-solid fa-calendar-plus"></i> Request New Conference
        </button>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Date & Time</th>
              <th>Agenda</th>
              <th>Status</th>
              <th>Conference Link</th>
            </tr>
          </thead>
          <tbody>
            ${meetings.length === 0 ? '<tr><td colspan="6" style="text-align:center;">No scheduled meetings.</td></tr>' : meetings.map(m => {
              const tch = teachers.find(t => t.id === m.teacher_id) || { name: 'Teacher', subject: '-' };
              return `
                <tr>
                  <td><strong>${tch.name}</strong></td>
                  <td>${tch.subject}</td>
                  <td><strong>${m.date}</strong> at ${m.time}</td>
                  <td><span style="font-size:0.85rem; color:var(--text-muted);">${m.agenda}</span></td>
                  <td><span class="status-badge status-${m.status.toLowerCase()}">${m.status}</span></td>
                  <td>
                    ${m.meeting_link ? `<a href="${m.meeting_link}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-video"></i> Join Meet</a>` : '<span style="font-size:0.8rem; color:var(--text-light);">Link generated upon confirmation</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('open-schedule-mtg-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('meeting-modal');
    const select = document.getElementById('meeting-target-select');
    select.innerHTML = teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject} - ${t.class_assigned})</option>`).join('');
    
    // Set min date to tomorrow
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    document.getElementById('meeting-date').value = tmrw.toISOString().split('T')[0];

    const form = document.getElementById('meeting-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const newMtg = {
        id: generateId('MTG'),
        parent_id: currentUser.parent_id,
        teacher_id: select.value,
        date: document.getElementById('meeting-date').value,
        time: document.getElementById('meeting-time').value,
        agenda: document.getElementById('meeting-agenda').value.trim(),
        status: 'Pending',
        meeting_link: null
      };

      const updatedStore = loadData();
      updatedStore.meetings.push(newMtg);
      saveData(updatedStore);

      closeModal('meeting-modal');
      showToast('Conference request submitted to teacher!', 'success');
      showToast('📧 Simulated Email: Notification dispatched to teacher.', 'info');
      renderParentMeetings(container, child, updatedStore);
    };

    modal.classList.add('active');
  });
}

function renderParentHomework(container, child, store) {
  const hwList = store.homework.filter(h => h.class === child.class);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Homework & Assignments</h1>
        <p>Active subject homework assigned for Class ${child.class}-${child.section}.</p>
      </div>
    </div>

    <div class="features-grid">
      ${hwList.length === 0 ? '<div class="empty-state"><i class="fa-solid fa-check-double"></i><h3>No pending homework assignments!</h3></div>' : hwList.map(h => `
        <div class="dash-card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark);">${h.subject}</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--danger);"><i class="fa-regular fa-clock"></i> Due: ${h.due_date}</span>
          </div>
          <h3 style="font-size:1.15rem; margin-bottom:0.4rem;">${h.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">${h.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderParentBehavior(container, child, store) {
  const notes = store.behavior.filter(b => b.student_id === child.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Behavior & Conduct Observations: ${child.name}</h1>
        <p>Appreciation badges, discipline notes, and holistic habit tracking from faculty.</p>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${notes.length === 0 ? '<div class="empty-state"><i class="fa-solid fa-award"></i><h3>No behavioral notes logged.</h3></div>' : notes.map(n => {
        const isPos = n.type === 'positive';
        return `
          <div class="dash-card" style="margin-bottom:0; border-left:4px solid ${isPos ? 'var(--success)' : 'var(--warning)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span class="status-badge" style="background:${isPos ? 'var(--success-bg)' : 'var(--warning-bg)'}; color:${isPos ? 'var(--success)' : 'var(--warning)'};">
                <i class="fa-solid ${isPos ? 'fa-star' : 'fa-triangle-exclamation'}"></i> ${n.badge}
              </span>
              <span style="font-size:0.8rem; color:var(--text-light);">${n.date}</span>
            </div>
            <p style="font-size:0.92rem; color:var(--text-main);">${n.note}</p>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// =========================================================================
// TEACHER ROLE VIEWS
// =========================================================================
function renderTeacherViews(container, tab) {
  const store = loadData();
  const currentUser = getCurrentUser();
  const teacher = store.teachers.find(t => t.id === currentUser.teacher_id) || store.teachers[0];

  switch (tab) {
    case 'overview':
      renderTeacherOverview(container, teacher, store);
      break;
    case 'students':
      renderTeacherStudents(container, teacher, store);
      break;
    case 'attendance':
      renderTeacherAttendanceMarker(container, teacher, store);
      break;
    case 'grades':
      renderTeacherGradebook(container, teacher, store);
      break;
    case 'messages':
      renderMessagingView(container, store, 'teacher');
      break;
    case 'meetings':
      renderTeacherMeetings(container, teacher, store);
      break;
    case 'homework':
      renderTeacherHomework(container, teacher, store);
      break;
    case 'behavior':
      renderTeacherBehavior(container, teacher, store);
      break;
    case 'events':
      renderEventsView(container, store, true);
      break;
    default:
      renderTeacherOverview(container, teacher, store);
  }
}

function renderTeacherOverview(container, teacher, store) {
  const students = store.students.filter(s => s.teacher_id === teacher.id);
  const meetings = store.meetings.filter(m => m.teacher_id === teacher.id && m.status === 'Pending');

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Teacher Command Deck: ${teacher.name}</h1>
        <p>Department: ${teacher.subject} · Assigned Class: <strong>${teacher.class_assigned}</strong> · Office Hours: ${teacher.availability}</p>
      </div>
      <div class="dash-page-actions">
        <a href="#attendance" class="btn btn-primary"><i class="fa-solid fa-clipboard-user"></i> Mark Today’s Roll Call</a>
        <a href="#grades" class="btn btn-secondary"><i class="fa-solid fa-file-signature"></i> Gradebook</a>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Assigned Students</span>
          <span class="kpi-value">${students.length}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-users"></i> ${teacher.class_assigned}</span>
        </div>
        <div class="kpi-icon-box"><i class="fa-solid fa-user-group"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Pending PTM Requests</span>
          <span class="kpi-value" style="color:var(--primary);">${meetings.length}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-handshake"></i> Parent consultations</span>
        </div>
        <div class="kpi-icon-box" style="background:#fffbeb; color:#d97706;"><i class="fa-solid fa-calendar-day"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Subject Syllabus Progress</span>
          <span class="kpi-value" style="color:var(--success);">78%</span>
          <span class="kpi-subtext"><i class="fa-solid fa-chart-line"></i> Term 2 Target on Track</span>
        </div>
        <div class="kpi-icon-box" style="background:#ecfdf5; color:#059669;"><i class="fa-solid fa-book-bookmark"></i></div>
      </div>
    </div>

    <!-- Quick Roster Table -->
    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="dash-card-header" style="padding:1.25rem 1.5rem; margin-bottom:0; border-bottom:1px solid var(--border-color);">
        <h2 class="dash-card-title"><i class="fa-solid fa-users"></i> Homeroom Student Roster (${teacher.class_assigned})</h2>
        <a href="#students" class="btn btn-sm btn-secondary">Detailed Roster</a>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Blood Group</th>
              <th>Parent / Guardian</th>
              <th>Contact Phone</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const prn = store.parents.find(p => p.id === s.parent_id) || { name: 'Parent', phone: '-' };
              return `
                <tr>
                  <td><strong>#${s.roll_no}</strong></td>
                  <td><strong>${s.name}</strong></td>
                  <td><span class="status-badge" style="background:var(--bg-app); border:1px solid var(--border-color);">${s.blood_group || 'O+'}</span></td>
                  <td>${prn.name}</td>
                  <td>${prn.phone}</td>
                  <td style="text-align:right;">
                    <a href="#messages" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-envelope"></i> Message</a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTeacherStudents(container, teacher, store) {
  const students = store.students.filter(s => s.teacher_id === teacher.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Assigned Student Roster: ${teacher.class_assigned}</h1>
        <p>Complete student academic credentials, guardian contacts and profiles.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Parent Name</th>
              <th>Emergency Contact</th>
              <th>Residential Address</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const prn = store.parents.find(p => p.id === s.parent_id) || { name: 'Parent', phone: '-', address: '-' };
              return `
                <tr>
                  <td>
                    <div style="font-weight:700;">${s.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Roll No: ${s.roll_no} · ID: ${s.id}</div>
                  </td>
                  <td>Class ${s.class}-${s.section}</td>
                  <td>${prn.name}</td>
                  <td>${prn.phone}</td>
                  <td><span style="font-size:0.82rem; color:var(--text-muted);">${prn.address}</span></td>
                  <td style="text-align:right;">
                    <a href="#messages" class="btn btn-sm btn-primary"><i class="fa-solid fa-comment-dots"></i> Connect</a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTeacherAttendanceMarker(container, teacher, store) {
  const students = store.students.filter(s => s.teacher_id === teacher.id);
  const todayStr = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Daily Morning Roll Call & Attendance</h1>
        <p>Record present, absent, or tardy status for ${teacher.class_assigned}.</p>
      </div>
      <div class="dash-page-actions">
        <input type="date" id="attendance-record-date" class="form-control" value="${todayStr}" style="width:180px;">
        <button class="btn btn-primary" id="save-attendance-btn"><i class="fa-solid fa-floppy-disk"></i> Save Attendance Sheet</button>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Attendance Status</th>
            </tr>
          </thead>
          <tbody id="attendance-marker-tbody">
            ${students.map(s => {
              // Find existing record for today if any
              const existing = store.attendance.find(a => a.student_id === s.id && a.date === todayStr);
              const currentStatus = existing ? existing.status : 'Present';
              return `
                <tr data-student-id="${s.id}">
                  <td><strong>#${s.roll_no}</strong></td>
                  <td><strong>${s.name}</strong></td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <label class="btn btn-sm ${currentStatus === 'Present' ? 'btn-success' : 'btn-secondary'}" style="cursor:pointer;">
                        <input type="radio" name="att-${s.id}" value="Present" ${currentStatus === 'Present' ? 'checked' : ''} style="display:none;"> Present
                      </label>
                      <label class="btn btn-sm ${currentStatus === 'Late' ? 'btn-warning' : 'btn-secondary'}" style="cursor:pointer; ${currentStatus === 'Late' ? 'background:#f59e0b; color:#fff;' : ''}">
                        <input type="radio" name="att-${s.id}" value="Late" ${currentStatus === 'Late' ? 'checked' : ''} style="display:none;"> Late
                      </label>
                      <label class="btn btn-sm ${currentStatus === 'Absent' ? 'btn-danger' : 'btn-secondary'}" style="cursor:pointer; ${currentStatus === 'Absent' ? 'background:#ef4444; color:#fff;' : ''}">
                        <input type="radio" name="att-${s.id}" value="Absent" ${currentStatus === 'Absent' ? 'checked' : ''} style="display:none;"> Absent
                      </label>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Dynamic Radio Styling
  container.querySelectorAll('#attendance-marker-tbody tr').forEach(row => {
    row.querySelectorAll('label').forEach(lbl => {
      lbl.addEventListener('click', () => {
        row.querySelectorAll('label').forEach(l => {
          l.className = 'btn btn-sm btn-secondary';
          l.style.background = '';
          l.style.color = '';
        });
        const radio = lbl.querySelector('input');
        radio.checked = true;
        if (radio.value === 'Present') {
          lbl.className = 'btn btn-sm btn-success';
        } else if (radio.value === 'Late') {
          lbl.style.background = '#f59e0b';
          lbl.style.color = '#fff';
        } else {
          lbl.style.background = '#ef4444';
          lbl.style.color = '#fff';
        }
      });
    });
  });

  // Save Attendance Action
  document.getElementById('save-attendance-btn')?.addEventListener('click', () => {
    const selectedDate = document.getElementById('attendance-record-date').value;
    const currentStore = loadData();

    container.querySelectorAll('#attendance-marker-tbody tr').forEach(row => {
      const studentId = row.getAttribute('data-student-id');
      const checkedRadio = row.querySelector(`input[name="att-${studentId}"]:checked`);
      const status = checkedRadio ? checkedRadio.value : 'Present';

      // Check if record exists
      const existingIdx = currentStore.attendance.findIndex(a => a.student_id === studentId && a.date === selectedDate);
      if (existingIdx >= 0) {
        currentStore.attendance[existingIdx].status = status;
      } else {
        currentStore.attendance.push({
          id: generateId('ATT'),
          student_id: studentId,
          date: selectedDate,
          status: status
        });
      }
    });

    saveData(currentStore);
    showToast(`Attendance for ${selectedDate} saved successfully!`, 'success');
  });
}

function renderTeacherGradebook(container, teacher, store) {
  const students = store.students.filter(s => s.teacher_id === teacher.id);
  const grades = store.academic.filter(g => students.some(s => s.id === g.student_id));

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Gradebook & Assessment Management</h1>
        <p>Record term examination marks and qualitative student comments.</p>
      </div>
      <div class="dash-page-actions">
        <button class="btn btn-primary" id="open-add-grade-btn">
          <i class="fa-solid fa-plus"></i> Add New Assessment
        </button>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Feedback Comments</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${grades.length === 0 ? '<tr><td colspan="6" style="text-align:center;">No assessments recorded.</td></tr>' : grades.map(g => {
              const stu = students.find(s => s.id === g.student_id) || { name: 'Student' };
              return `
                <tr>
                  <td><strong>${stu.name}</strong></td>
                  <td>${g.subject}</td>
                  <td><strong>${g.marks}</strong> / ${g.max_marks || 100}</td>
                  <td><span class="grade-badge grade-${g.grade.toLowerCase()}">${g.grade}</span></td>
                  <td><span style="font-size:0.85rem; color:var(--text-muted);">${g.comments}</span></td>
                  <td style="text-align:right;">
                    <button class="btn btn-sm btn-danger delete-grade-btn" data-id="${g.id}">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Add Grade Button
  document.getElementById('open-add-grade-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('grade-modal');
    const select = document.getElementById('grade-student-select');
    select.innerHTML = students.map(s => `<option value="${s.id}">${s.name} (Roll #${s.roll_no})</option>`).join('');

    const form = document.getElementById('grade-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const studentId = select.value;
      const subject = document.getElementById('grade-subject').value.trim();
      const marks = Number(document.getElementById('grade-marks').value);
      const comments = document.getElementById('grade-comments').value.trim();

      // Compute grade
      let grade = 'A1';
      if (marks < 60) grade = 'C';
      else if (marks < 75) grade = 'B2';
      else if (marks < 85) grade = 'B1';
      else if (marks < 90) grade = 'A2';

      const newRecord = {
        id: generateId('ACD'),
        student_id: studentId,
        subject,
        marks,
        max_marks: 100,
        grade,
        comments
      };

      const updatedStore = loadData();
      updatedStore.academic.push(newRecord);
      saveData(updatedStore);

      closeModal('grade-modal');
      showToast('Assessment saved and published to student portfolio!', 'success');
      renderTeacherGradebook(container, teacher, updatedStore);
    };

    modal.classList.add('active');
  });

  // Delete Grade
  container.querySelectorAll('.delete-grade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Delete this assessment record?')) {
        const updatedStore = loadData();
        updatedStore.academic = updatedStore.academic.filter(a => a.id !== id);
        saveData(updatedStore);
        showToast('Assessment deleted.', 'info');
        renderTeacherGradebook(container, teacher, updatedStore);
      }
    });
  });
}

function renderTeacherMeetings(container, teacher, store) {
  const meetings = store.meetings.filter(m => m.teacher_id === teacher.id);
  const parents = store.parents;

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Parent-Teacher Conferences (PTM)</h1>
        <p>Manage incoming parent appointment requests for ${teacher.name}.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Proposed Date & Time</th>
              <th>Discussion Agenda</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${meetings.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No conference requests.</td></tr>' : meetings.map(m => {
              const prn = parents.find(p => p.id === m.parent_id) || { name: 'Parent', phone: '-' };
              return `
                <tr>
                  <td>
                    <strong>${prn.name}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${prn.phone}</div>
                  </td>
                  <td><strong>${m.date}</strong> at ${m.time}</td>
                  <td><span style="font-size:0.85rem; color:var(--text-muted);">${m.agenda}</span></td>
                  <td><span class="status-badge status-${m.status.toLowerCase()}">${m.status}</span></td>
                  <td style="text-align:right;">
                    ${m.status === 'Pending' ? `
                      <button class="btn btn-sm btn-success confirm-mtg-btn" data-id="${m.id}"><i class="fa-solid fa-check"></i> Accept</button>
                      <button class="btn btn-sm btn-danger cancel-mtg-btn" data-id="${m.id}"><i class="fa-solid fa-xmark"></i> Decline</button>
                    ` : `
                      <button class="btn btn-sm btn-secondary cancel-mtg-btn" data-id="${m.id}"><i class="fa-solid fa-ban"></i> Cancel</button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Action handlers
  container.querySelectorAll('.confirm-mtg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const updatedStore = loadData();
      const target = updatedStore.meetings.find(m => m.id === id);
      if (target) {
        target.status = 'Confirmed';
        target.meeting_link = 'https://meet.google.com/ptc-' + Math.floor(100 + Math.random() * 900);
        saveData(updatedStore);
        showToast('Meeting confirmed! Google Meet link generated.', 'success');
        showToast('📧 Simulated Email: Notification dispatched to parent.', 'info');
        renderTeacherMeetings(container, teacher, updatedStore);
      }
    });
  });

  container.querySelectorAll('.cancel-mtg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const updatedStore = loadData();
      const target = updatedStore.meetings.find(m => m.id === id);
      if (target) {
        target.status = 'Cancelled';
        saveData(updatedStore);
        showToast('Meeting cancelled.', 'info');
        renderTeacherMeetings(container, teacher, updatedStore);
      }
    });
  });
}

function renderTeacherHomework(container, teacher, store) {
  const myHw = store.homework.filter(h => h.teacher_id === teacher.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Assigned Homework & Projects</h1>
        <p>Post and manage assignments for your assigned class.</p>
      </div>
      <div class="dash-page-actions">
        <button class="btn btn-primary" id="open-add-hw-btn"><i class="fa-solid fa-plus"></i> Post Assignment</button>
      </div>
    </div>

    <div class="features-grid">
      ${myHw.length === 0 ? '<div class="empty-state"><i class="fa-solid fa-book-open"></i><h3>No active homework posted yet.</h3></div>' : myHw.map(h => `
        <div class="dash-card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark);">${h.subject}</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--danger);"><i class="fa-regular fa-clock"></i> Due: ${h.due_date}</span>
          </div>
          <h3 style="font-size:1.15rem; margin-bottom:0.4rem;">${h.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">${h.description}</p>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('open-add-hw-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('homework-modal');
    document.getElementById('hw-subject').value = teacher.subject;
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 3);
    document.getElementById('hw-duedate').value = tmrw.toISOString().split('T')[0];

    const form = document.getElementById('homework-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const newHw = {
        id: generateId('HW'),
        teacher_id: teacher.id,
        class: teacher.class_assigned.replace('Class ', '').split('-')[0] || '8',
        section: teacher.class_assigned.split('-')[1] || 'A',
        subject: document.getElementById('hw-subject').value.trim(),
        title: document.getElementById('hw-title').value.trim(),
        description: document.getElementById('hw-desc').value.trim(),
        due_date: document.getElementById('hw-duedate').value
      };

      const updatedStore = loadData();
      updatedStore.homework.push(newHw);
      saveData(updatedStore);

      closeModal('homework-modal');
      showToast('Homework posted and published to parent portals!', 'success');
      showToast('📧 Simulated Email: Notification dispatched to class parents.', 'info');
      renderTeacherHomework(container, teacher, updatedStore);
    };

    modal.classList.add('active');
  });
}

function renderTeacherBehavior(container, teacher, store) {
  const students = store.students.filter(s => s.teacher_id === teacher.id);
  const notes = store.behavior.filter(b => b.teacher_id === teacher.id);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Student Behavioral Records</h1>
        <p>Log positive commendations or disciplinary concerns visible to parents.</p>
      </div>
      <div class="dash-page-actions">
        <button class="btn btn-primary" id="open-add-behavior-btn"><i class="fa-solid fa-plus"></i> Record Observation</button>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${notes.length === 0 ? '<div class="empty-state"><i class="fa-solid fa-award"></i><h3>No observations logged yet.</h3></div>' : notes.map(n => {
        const stu = students.find(s => s.id === n.student_id) || { name: 'Student' };
        const isPos = n.type === 'positive';
        return `
          <div class="dash-card" style="margin-bottom:0; border-left:4px solid ${isPos ? 'var(--success)' : 'var(--warning)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <div>
                <strong>${stu.name}</strong>
                <span class="status-badge" style="background:${isPos ? 'var(--success-bg)' : 'var(--warning-bg)'}; color:${isPos ? 'var(--success)' : 'var(--warning)'}; margin-left:0.5rem;">
                  ${n.badge}
                </span>
              </div>
              <span style="font-size:0.8rem; color:var(--text-light);">${n.date}</span>
            </div>
            <p style="font-size:0.92rem; color:var(--text-main);">${n.note}</p>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('open-add-behavior-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('behavior-modal');
    const select = document.getElementById('beh-student');
    select.innerHTML = students.map(s => `<option value="${s.id}">${s.name} (Roll #${s.roll_no})</option>`).join('');

    const form = document.getElementById('behavior-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const newNote = {
        id: generateId('BEH'),
        student_id: select.value,
        teacher_id: teacher.id,
        date: new Date().toISOString().split('T')[0],
        type: document.getElementById('beh-type').value,
        badge: document.getElementById('beh-badge').value.trim(),
        note: document.getElementById('beh-note').value.trim()
      };

      const updatedStore = loadData();
      updatedStore.behavior.push(newNote);
      saveData(updatedStore);

      closeModal('behavior-modal');
      showToast('Observation logged and visible to parent!', 'success');
      showToast('📧 Simulated Email: Notification dispatched to parent.', 'info');
      renderTeacherBehavior(container, teacher, updatedStore);
    };

    modal.classList.add('active');
  });
}

// =========================================================================
// ADMIN ROLE VIEWS
// =========================================================================
function renderAdminViews(container, tab) {
  const store = loadData();

  switch (tab) {
    case 'overview':
      renderAdminOverview(container, store);
      break;
    case 'users':
      renderAdminUsers(container, store);
      break;
    case 'messages':
      renderAdminMessages(container, store);
      break;
    case 'attendance':
      renderAdminAttendance(container, store);
      break;
    case 'fees':
      renderAdminFees(container, store);
      break;
    case 'meetings':
      renderAdminMeetings(container, store);
      break;
    case 'events':
      renderEventsView(container, store, true);
      break;
    case 'reports':
      renderAdminReports(container, store);
      break;
    case 'settings':
      renderAdminSettings(container, store);
      break;
    default:
      renderAdminOverview(container, store);
  }
}

function renderAdminOverview(container, store) {
  const totalStudents = store.students.length;
  const totalTeachers = store.teachers.length;
  const totalParents = store.parents.length;
  const totalMessages = store.messages.length;

  const totalCollectedFees = store.fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPendingFees = store.fees.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + f.amount, 0);

  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Administrative Central Command</h1>
        <p>Comprehensive institutional metrics, user rosters, communication telemetry, and finance ledger.</p>
      </div>
      <div class="dash-page-actions">
        <a href="#users" class="btn btn-primary"><i class="fa-solid fa-user-plus"></i> Add New Record</a>
        <a href="#reports" class="btn btn-secondary"><i class="fa-solid fa-file-csv"></i> Export Reports</a>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Enrollment</span>
          <span class="kpi-value">${totalStudents}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-school"></i> Active Students</span>
        </div>
        <div class="kpi-icon-box"><i class="fa-solid fa-graduation-cap"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Faculty Staff</span>
          <span class="kpi-value">${totalTeachers}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-chalkboard-user"></i> Certified Educators</span>
        </div>
        <div class="kpi-icon-box" style="background:#eff6ff; color:#2563eb;"><i class="fa-solid fa-user-tie"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Fees Collected</span>
          <span class="kpi-value" style="color:var(--success);">₹${totalCollectedFees.toLocaleString('en-IN')}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-arrow-up"></i> Disbursed</span>
        </div>
        <div class="kpi-icon-box" style="background:#ecfdf5; color:#059669;"><i class="fa-solid fa-hand-holding-dollar"></i></div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Outstanding Fees</span>
          <span class="kpi-value" style="color:var(--primary);">₹${totalPendingFees.toLocaleString('en-IN')}</span>
          <span class="kpi-subtext"><i class="fa-solid fa-clock"></i> Pending Clearance</span>
        </div>
        <div class="kpi-icon-box" style="background:#fffbeb; color:#d97706;"><i class="fa-solid fa-receipt"></i></div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="dash-grid-equal">
      <div class="dash-card">
        <div class="dash-card-header">
          <h2 class="dash-card-title"><i class="fa-solid fa-comments"></i> Communication Volume</h2>
          <span class="status-badge status-present">${totalMessages} Total Messages</span>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">
          High engagement detected between parents and STEM teachers. Average response turnaround time is <strong>3.2 hours</strong>.
        </p>
        <div class="progress-bar-container" style="height:12px;">
          <div class="progress-bar-fill" style="width: 84%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-light); margin-top:0.35rem;">
          <span>84% Messages Addressed within 24 Hours</span>
          <span>Target: 80%</span>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <h2 class="dash-card-title"><i class="fa-solid fa-calendar-check"></i> Overall Campus Attendance</h2>
          <span class="status-badge status-present">94.8% Average</span>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">
          Class 8-A leads daily punctuality with a 98% on-time record this quarter.
        </p>
        <div class="progress-bar-container" style="height:12px;">
          <div class="progress-bar-fill" style="width: 94.8%; background:#10b981;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-light); margin-top:0.35rem;">
          <span>Complies with State Education Standards</span>
        </div>
      </div>
    </div>
  `;
}

function renderAdminUsers(container, store) {
  let activeUserType = 'student';

  const renderTable = () => {
    let rowsHtml = '';
    let headersHtml = '';

    if (activeUserType === 'student') {
      headersHtml = `<th>Roll No</th><th>Student Name</th><th>Class & Section</th><th>Guardian Name</th><th>Assigned Faculty</th><th style="text-align:right;">Actions</th>`;
      rowsHtml = store.students.map(s => {
        const prn = store.parents.find(p => p.id === s.parent_id) || { name: 'Parent' };
        const tch = store.teachers.find(t => t.id === s.teacher_id) || { name: 'Teacher' };
        return `
          <tr>
            <td><strong>#${s.roll_no}</strong></td>
            <td><strong>${s.name}</strong></td>
            <td>Class ${s.class}-${s.section}</td>
            <td>${prn.name}</td>
            <td>${tch.name}</td>
            <td style="text-align:right;">
              <button class="btn btn-sm btn-danger delete-user-btn" data-type="student" data-id="${s.id}"><i class="fa-solid fa-trash-can"></i></button>
            </td>
          </tr>
        `;
      }).join('');
    } else if (activeUserType === 'parent') {
      headersHtml = `<th>Parent Name</th><th>Email</th><th>Phone Number</th><th>Children Enrolled</th><th>Address</th><th style="text-align:right;">Actions</th>`;
      rowsHtml = store.parents.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.email}</td>
          <td>${p.phone}</td>
          <td><span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark);">${p.children.length} Student(s)</span></td>
          <td><span style="font-size:0.8rem; color:var(--text-muted);">${p.address}</span></td>
          <td style="text-align:right;">
            <button class="btn btn-sm btn-danger delete-user-btn" data-type="parent" data-id="${p.id}"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    } else {
      headersHtml = `<th>Teacher Name</th><th>Subject</th><th>Homeroom Assigned</th><th>Email</th><th>Phone</th><th style="text-align:right;">Actions</th>`;
      rowsHtml = store.teachers.map(t => `
        <tr>
          <td><strong>${t.name}</strong></td>
          <td>${t.subject}</td>
          <td>${t.class_assigned}</td>
          <td>${t.email}</td>
          <td>${t.phone}</td>
          <td style="text-align:right;">
            <button class="btn btn-sm btn-danger delete-user-btn" data-type="teacher" data-id="${t.id}"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    }

    return `
      <div class="dash-page-header">
        <div class="dash-page-title">
          <h1>User Directory & Roster Management (CRUD)</h1>
          <p>Maintain registered students, parents, and academic faculty profiles.</p>
        </div>
        <div class="dash-page-actions">
          <button class="btn btn-primary" id="open-add-user-modal-btn"><i class="fa-solid fa-plus"></i> Add New Record</button>
        </div>
      </div>

      <div style="display:flex; gap:0.5rem; margin-bottom:1.25rem;">
        <button class="btn ${activeUserType === 'student' ? 'btn-primary' : 'btn-secondary'} user-type-tab" data-type="student">Students (${store.students.length})</button>
        <button class="btn ${activeUserType === 'parent' ? 'btn-primary' : 'btn-secondary'} user-type-tab" data-type="parent">Parents (${store.parents.length})</button>
        <button class="btn ${activeUserType === 'teacher' ? 'btn-primary' : 'btn-secondary'} user-type-tab" data-type="teacher">Teachers (${store.teachers.length})</button>
      </div>

      <div class="dash-card" style="padding:0; overflow:hidden;">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>${headersHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  container.innerHTML = renderTable();

  const bindEvents = () => {
    container.querySelectorAll('.user-type-tab').forEach(b => {
      b.addEventListener('click', (e) => {
        activeUserType = e.currentTarget.getAttribute('data-type');
        container.innerHTML = renderTable();
        bindEvents();
      });
    });

    container.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-type');
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete this ${type} record?`)) {
          const current = loadData();
          if (type === 'student') current.students = current.students.filter(s => s.id !== id);
          else if (type === 'parent') current.parents = current.parents.filter(p => p.id !== id);
          else current.teachers = current.teachers.filter(t => t.id !== id);
          saveData(current);
          showToast(`${type.toUpperCase()} record removed.`, 'success');
          renderAdminUsers(container, current);
        }
      });
    });

    document.getElementById('open-add-user-modal-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('user-modal');
      const form = document.getElementById('user-form');
      form.onsubmit = (e) => {
        e.preventDefault();
        const role = document.getElementById('user-form-role').value;
        const name = document.getElementById('user-form-name').value.trim();
        const email = document.getElementById('user-form-email').value.trim();
        const className = document.getElementById('user-form-class').value.trim();
        const roll = document.getElementById('user-form-roll').value.trim();

        const currentStore = loadData();

        if (role === 'student') {
          currentStore.students.push({
            id: generateId('STU'),
            name,
            class: className.replace('Class ', '').split('-')[0] || '8',
            section: className.split('-')[1] || 'A',
            roll_no: roll || '30',
            parent_id: 'PRN-001',
            teacher_id: 'TCH-001'
          });
        } else if (role === 'parent') {
          currentStore.parents.push({
            id: generateId('PRN'),
            name,
            email,
            phone: '+91 98000 00000',
            children: ['STU-001'],
            address: 'City Center'
          });
        } else {
          currentStore.teachers.push({
            id: generateId('TCH'),
            name,
            email,
            subject: 'General Studies',
            class_assigned: 'Class 8-C',
            phone: '+91 98000 11111',
            availability: 'Mon-Fri 2:30 PM'
          });
        }

        saveData(currentStore);
        closeModal('user-modal');
        showToast(`New ${role} record added!`, 'success');
        renderAdminUsers(container, currentStore);
      };
      modal.classList.add('active');
    });
  };

  bindEvents();
}

function renderAdminMessages(container, store) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Institutional Communication Log & Audit</h1>
        <p>Complete transcript of all parent-teacher messages across the school.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Sender</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Message Body</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${store.messages.map(m => {
              const sender = store.parents.find(p => p.id === m.sender_id)?.name || store.teachers.find(t => t.id === m.sender_id)?.name || 'Admin';
              const receiver = store.parents.find(p => p.id === m.receiver_id)?.name || store.teachers.find(t => t.id === m.receiver_id)?.name || 'Admin';
              return `
                <tr>
                  <td><span style="font-size:0.8rem; color:var(--text-light);">${m.timestamp}</span></td>
                  <td><strong>${sender}</strong></td>
                  <td><strong>${receiver}</strong></td>
                  <td><strong>${m.subject}</strong></td>
                  <td><span style="font-size:0.82rem; color:var(--text-muted);">${m.body}</span></td>
                  <td><span class="status-badge status-${m.status === 'read' ? 'present' : 'late'}">${m.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminAttendance(container, store) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Campus Attendance Audit Log</h1>
        <p>Complete register of daily roll calls across all enrolled sections.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${store.attendance.map(a => {
              const s = store.students.find(stu => stu.id === a.student_id) || { name: 'Student', class: '8', section: 'A' };
              return `
                <tr>
                  <td><strong>${a.date}</strong></td>
                  <td>${s.name}</td>
                  <td>Class ${s.class}-${s.section}</td>
                  <td><span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminFees(container, store) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Institutional Fee Collections & Defaulters</h1>
        <p>Real-time audit of school fees, receipts, and pending invoices.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Student</th>
              <th>Fee Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt No</th>
            </tr>
          </thead>
          <tbody>
            ${store.fees.map(f => {
              const s = store.students.find(stu => stu.id === f.student_id) || { name: 'Student' };
              return `
                <tr>
                  <td><strong>${f.id}</strong></td>
                  <td>${s.name}</td>
                  <td>${f.fee_type}</td>
                  <td><strong>₹${f.amount.toLocaleString('en-IN')}</strong></td>
                  <td><span class="status-badge status-${f.status.toLowerCase()}">${f.status}</span></td>
                  <td><span style="font-family:monospace; font-size:0.8rem;">${f.receipt_no || '-'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminMeetings(container, store) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>All Parent-Teacher Conference Bookings</h1>
        <p>Monitor scheduled and pending meeting consultations.</p>
      </div>
    </div>

    <div class="dash-card" style="padding:0; overflow:hidden;">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Teacher</th>
              <th>Date & Time</th>
              <th>Agenda</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${store.meetings.map(m => {
              const p = store.parents.find(pr => pr.id === m.parent_id)?.name || 'Parent';
              const t = store.teachers.find(tr => tr.id === m.teacher_id)?.name || 'Teacher';
              return `
                <tr>
                  <td><strong>${p}</strong></td>
                  <td><strong>${t}</strong></td>
                  <td>${m.date} at ${m.time}</td>
                  <td>${m.agenda}</td>
                  <td><span class="status-badge status-${m.status.toLowerCase()}">${m.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminReports(container, store) {
  let activeReport = 'fees';

  const renderContent = () => {
    return `
      <div class="dash-page-header">
        <div class="dash-page-title">
          <h1>Financial & Academic Reports Generator</h1>
          <p>Export official school compliance records to CSV format.</p>
        </div>
        <div class="dash-page-actions">
          <button class="btn btn-primary" id="export-csv-btn"><i class="fa-solid fa-file-csv"></i> Download CSV Export</button>
        </div>
      </div>

      <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
        <button class="btn ${activeReport === 'fees' ? 'btn-primary' : 'btn-secondary'} report-tab" data-rep="fees">Fee Collections Report</button>
        <button class="btn ${activeReport === 'attendance' ? 'btn-primary' : 'btn-secondary'} report-tab" data-rep="attendance">Attendance Audit Report</button>
        <button class="btn ${activeReport === 'academic' ? 'btn-primary' : 'btn-secondary'} report-tab" data-rep="academic">Academic Report Cards</button>
      </div>

      <div class="dash-card" style="padding:0; overflow:hidden;">
        <div class="table-responsive" id="report-table-wrapper">
          <!-- Rendered table preview -->
        </div>
      </div>
    `;
  };

  container.innerHTML = renderContent();

  const updateTable = () => {
    const wrapper = document.getElementById('report-table-wrapper');
    if (!wrapper) return;

    if (activeReport === 'fees') {
      wrapper.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Fee ID</th><th>Student</th><th>Description</th><th>Amount</th><th>Status</th><th>Paid Date</th></tr></thead>
          <tbody>
            ${store.fees.map(f => `
              <tr>
                <td>${f.id}</td>
                <td>${store.students.find(s => s.id === f.student_id)?.name || '-'}</td>
                <td>${f.fee_type}</td>
                <td>₹${f.amount.toLocaleString('en-IN')}</td>
                <td>${f.status}</td>
                <td>${f.paid_date || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeReport === 'attendance') {
      wrapper.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Date</th><th>Student Name</th><th>Class</th><th>Status</th></tr></thead>
          <tbody>
            ${store.attendance.map(a => `
              <tr>
                <td>${a.date}</td>
                <td>${store.students.find(s => s.id === a.student_id)?.name || '-'}</td>
                <td>${store.students.find(s => s.id === a.student_id)?.class || '8'}</td>
                <td>${a.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      wrapper.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Record ID</th><th>Student Name</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Comments</th></tr></thead>
          <tbody>
            ${store.academic.map(g => `
              <tr>
                <td>${g.id}</td>
                <td>${store.students.find(s => s.id === g.student_id)?.name || '-'}</td>
                <td>${g.subject}</td>
                <td>${g.marks} / 100</td>
                <td>${g.grade}</td>
                <td>${g.comments}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  };

  updateTable();

  container.querySelectorAll('.report-tab').forEach(b => {
    b.addEventListener('click', (e) => {
      activeReport = e.currentTarget.getAttribute('data-rep');
      container.querySelectorAll('.report-tab').forEach(x => x.className = 'btn btn-secondary report-tab');
      e.currentTarget.className = 'btn btn-primary report-tab';
      updateTable();
    });
  });

  document.getElementById('export-csv-btn')?.addEventListener('click', () => {
    exportToCsv(activeReport, store);
  });
}

function exportToCsv(reportType, store) {
  let headers = [];
  let rows = [];

  if (reportType === 'fees') {
    headers = ['Fee ID', 'Student Name', 'Fee Type', 'Amount (INR)', 'Status', 'Paid Date', 'Receipt Ref'];
    rows = store.fees.map(f => [
      f.id,
      `"${store.students.find(s => s.id === f.student_id)?.name || ''}"`,
      `"${f.fee_type}"`,
      f.amount,
      f.status,
      f.paid_date || '',
      f.receipt_no || ''
    ]);
  } else if (reportType === 'attendance') {
    headers = ['Record ID', 'Date', 'Student Name', 'Class', 'Status'];
    rows = store.attendance.map(a => {
      const s = store.students.find(stu => stu.id === a.student_id);
      return [
        a.id,
        a.date,
        `"${s ? s.name : ''}"`,
        s ? `Class ${s.class}-${s.section}` : '',
        a.status
      ];
    });
  } else {
    headers = ['Assessment ID', 'Student Name', 'Subject', 'Marks', 'Max Marks', 'Grade', 'Teacher Comments'];
    rows = store.academic.map(g => [
      g.id,
      `"${store.students.find(s => s.id === g.student_id)?.name || ''}"`,
      `"${g.subject}"`,
      g.marks,
      g.max_marks || 100,
      g.grade,
      `"${g.comments}"`
    ]);
  }

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PTC-${reportType.toUpperCase()}-REPORT-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`${reportType.toUpperCase()} report exported to CSV!`, 'success');
}

function renderAdminSettings(container, store) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>System Settings & Storage Management</h1>
        <p>Reset mock data and inspect local database parameters.</p>
      </div>
    </div>

    <div class="dash-grid-equal">
      <div class="dash-card">
        <h3 style="font-size:1.15rem; margin-bottom:0.75rem;"><i class="fa-solid fa-arrows-rotate" style="color:var(--primary);"></i> Reset Demo Data</h3>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
          Restore the complete Indian school seed dataset (5 parents, 4 teachers, 8 students, grades, fees, meetings, announcements).
        </p>
        <button class="btn btn-primary" id="admin-reset-demo-btn">
          <i class="fa-solid fa-arrow-rotate-left"></i> Restore Initial Seed Data
        </button>
      </div>

      <div class="dash-card">
        <h3 style="font-size:1.15rem; margin-bottom:0.75rem;"><i class="fa-solid fa-database" style="color:var(--primary);"></i> Storage Inspection</h3>
        <div style="font-size:0.88rem; line-height:1.8;">
          <div><strong>LocalStorage Key:</strong> <code>parent_teacher_connect_data</code></div>
          <div><strong>Total Users:</strong> ${store.users.length} accounts</div>
          <div><strong>Total Messages:</strong> ${store.messages.length} messages</div>
          <div><strong>Total Attendance Logs:</strong> ${store.attendance.length} logs</div>
          <div><strong>Platform Version:</strong> 1.0 (Production Frontend)</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('admin-reset-demo-btn')?.addEventListener('click', () => {
    if (confirm('Reset all portal data to initial demo seed values?')) {
      resetDemoData();
      showToast('All demo data restored!', 'success');
      setTimeout(() => location.reload(), 600);
    }
  });
}

// =========================================================================
// SHARED MESSAGING SYSTEM (Inbox / Outbox / Compose / Read)
// =========================================================================
function renderMessagingView(container, store, currentRole) {
  const currentUser = getCurrentUser();
  const myEntityId = currentUser.parent_id || currentUser.teacher_id || currentUser.id;

  let activeBox = 'inbox'; // 'inbox' | 'outbox'

  const renderContent = () => {
    const inboxMsgs = store.messages.filter(m => m.receiver_id === myEntityId);
    const outboxMsgs = store.messages.filter(m => m.sender_id === myEntityId);
    const displayedMsgs = activeBox === 'inbox' ? inboxMsgs : outboxMsgs;

    return `
      <div class="dash-page-header">
        <div class="dash-page-title">
          <h1>Direct Messaging Hub</h1>
          <p>Two-way private and official communication channel.</p>
        </div>
        <div class="dash-page-actions">
          <button class="btn btn-primary" id="open-compose-modal-btn">
            <i class="fa-solid fa-pen"></i> Compose Message
          </button>
        </div>
      </div>

      <div class="messaging-container">
        <!-- Sidebar Navigation -->
        <div class="messaging-sidebar">
          <button class="btn msg-tab-btn ${activeBox === 'inbox' ? 'active' : ''}" data-box="inbox">
            <i class="fa-solid fa-inbox"></i> Inbox (${inboxMsgs.length})
          </button>
          <button class="btn msg-tab-btn ${activeBox === 'outbox' ? 'active' : ''}" data-box="outbox">
            <i class="fa-solid fa-paper-plane"></i> Outbox (${outboxMsgs.length})
          </button>
        </div>

        <!-- Messages List Outlet -->
        <div class="messaging-content">
          ${displayedMsgs.length === 0 ? `
            <div class="empty-state">
              <i class="fa-solid fa-envelope-open"></i>
              <h3>No messages in ${activeBox}</h3>
              <p>Click Compose to start a new discussion.</p>
            </div>
          ` : displayedMsgs.map(m => {
            const partnerId = activeBox === 'inbox' ? m.sender_id : m.receiver_id;
            const partnerName = store.parents.find(p => p.id === partnerId)?.name || store.teachers.find(t => t.id === partnerId)?.name || 'School Staff';
            const initials = partnerName.substring(0, 2).toUpperCase();

            return `
              <div class="msg-item ${m.status === 'unread' && activeBox === 'inbox' ? 'unread' : ''}" data-msg-id="${m.id}">
                <div class="msg-avatar">${initials}</div>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:0.2rem;">
                    <strong style="font-size:0.92rem;">${partnerName}</strong>
                    <span style="font-size:0.75rem; color:var(--text-light);">${m.timestamp}</span>
                  </div>
                  <div style="font-weight:700; font-size:0.88rem; color:var(--text-main); margin-bottom:0.15rem;">${m.subject}</div>
                  <p style="font-size:0.82rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.body}</p>
                </div>
                <div>
                  <button class="btn btn-sm delete-msg-btn" data-id="${m.id}" title="Delete Message" style="color:var(--text-light);"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  container.innerHTML = renderContent();

  const bindMsgEvents = () => {
    // Switch between Inbox & Outbox
    container.querySelectorAll('.msg-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeBox = e.currentTarget.getAttribute('data-box');
        container.innerHTML = renderContent();
        bindMsgEvents();
      });
    });

    // Click message to read
    container.querySelectorAll('.msg-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.delete-msg-btn')) return;
        const msgId = item.getAttribute('data-msg-id');
        openMessageReader(msgId, store, myEntityId);
      });
    });

    // Delete message
    container.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this message?')) {
          const updatedStore = loadData();
          updatedStore.messages = updatedStore.messages.filter(m => m.id !== id);
          saveData(updatedStore);
          showToast('Message deleted.', 'info');
          renderMessagingView(container, updatedStore, currentRole);
        }
      });
    });

    // Open Compose Modal
    document.getElementById('open-compose-modal-btn')?.addEventListener('click', () => {
      openComposeModal(store, myEntityId, currentRole, () => {
        renderMessagingView(container, loadData(), currentRole);
      });
    });
  };

  bindMsgEvents();
}

function openMessageReader(msgId, store, myEntityId) {
  const msg = store.messages.find(m => m.id === msgId);
  if (!msg) return;

  // Mark as read
  if (msg.receiver_id === myEntityId && msg.status === 'unread') {
    msg.status = 'read';
    saveData(store);
  }

  const senderName = store.parents.find(p => p.id === msg.sender_id)?.name || store.teachers.find(t => t.id === msg.sender_id)?.name || 'Admin';
  const receiverName = store.parents.find(p => p.id === msg.receiver_id)?.name || store.teachers.find(t => t.id === msg.receiver_id)?.name || 'Admin';

  const modal = document.getElementById('read-msg-modal');
  const body = document.getElementById('read-msg-body');

  body.innerHTML = `
    <div style="background:var(--bg-app); border:1px solid var(--border-color); border-radius:10px; padding:1.25rem; margin-bottom:1.25rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.85rem;">
        <div><strong>From:</strong> ${senderName}</div>
        <div style="color:var(--text-light);">${msg.timestamp}</div>
      </div>
      <div style="font-size:0.85rem; margin-bottom:0.75rem;">
        <strong>To:</strong> ${receiverName}
      </div>
      <h3 style="font-size:1.15rem; font-weight:700; color:var(--primary); padding-top:0.5rem; border-top:1px solid var(--border-color);">
        ${msg.subject}
      </h3>
    </div>
    <div style="font-size:0.95rem; line-height:1.6; color:var(--text-main); white-space:pre-wrap;">
      ${msg.body}
    </div>
  `;

  document.getElementById('reply-msg-btn').onclick = () => {
    closeModal('read-msg-modal');
    openComposeModal(store, myEntityId, null, null, {
      replyToId: msg.sender_id,
      replySubject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`
    });
  };

  modal.classList.add('active');
}

function openComposeModal(store, myEntityId, currentRole, onSentCallback, prefill = null) {
  const modal = document.getElementById('compose-modal');
  const select = document.getElementById('compose-receiver');
  const subjectInput = document.getElementById('compose-subject');
  const bodyInput = document.getElementById('compose-body');

  // Populate recipients list (if parent, show teachers; if teacher, show parents)
  let recipients = [];
  if (currentRole === 'parent') {
    recipients = store.teachers.map(t => ({ id: t.id, name: `${t.name} (${t.subject} - ${t.class_assigned})` }));
  } else if (currentRole === 'teacher') {
    recipients = store.parents.map(p => ({ id: p.id, name: `${p.name} (Parent)` }));
  } else {
    recipients = [
      ...store.teachers.map(t => ({ id: t.id, name: `[Teacher] ${t.name}` })),
      ...store.parents.map(p => ({ id: p.id, name: `[Parent] ${p.name}` }))
    ];
  }

  select.innerHTML = recipients.map(r => `<option value="${r.id}" ${prefill && prefill.replyToId === r.id ? 'selected' : ''}>${r.name}</option>`).join('');

  if (prefill) {
    subjectInput.value = prefill.replySubject || '';
    bodyInput.value = '';
  } else {
    subjectInput.value = '';
    bodyInput.value = '';
  }

  const form = document.getElementById('compose-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const newMsg = {
      id: generateId('MSG'),
      sender_id: myEntityId,
      receiver_id: select.value,
      subject: subjectInput.value.trim(),
      body: bodyInput.value.trim(),
      timestamp: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'unread'
    };

    const currentStore = loadData();
    currentStore.messages.unshift(newMsg);
    saveData(currentStore);

    closeModal('compose-modal');
    showToast('Message sent successfully!', 'success');
    showToast(`📧 Simulated Email: Notification delivered to recipient inbox.`, 'info');

    if (onSentCallback) onSentCallback();
  };

  modal.classList.add('active');
}

// =========================================================================
// EVENTS & ANNOUNCEMENTS VIEW (Shared)
// =========================================================================
function renderEventsView(container, store, allowPost = false) {
  container.innerHTML = `
    <div class="dash-page-header">
      <div class="dash-page-title">
        <h1>Campus Events & Official Bulletins</h1>
        <p>Live announcements, academic circulars, and sports event schedules.</p>
      </div>
      ${allowPost ? `
        <div class="dash-page-actions">
          <button class="btn btn-primary" id="open-post-ann-btn"><i class="fa-solid fa-plus"></i> Post Announcement</button>
        </div>
      ` : ''}
    </div>

    <div class="dash-grid-equal">
      <!-- Announcements Column -->
      <div>
        <h2 style="font-size:1.25rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="fa-solid fa-bullhorn" style="color:var(--primary);"></i> Campus Circulars
        </h2>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${store.announcements.map(ann => `
            <div class="dash-card" style="margin-bottom:0;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <span class="status-badge status-${ann.priority === 'High' ? 'overdue' : 'present'}">${ann.priority}</span>
                <span style="font-size:0.75rem; color:var(--text-light);">${ann.date}</span>
              </div>
              <h3 style="font-size:1.1rem; margin-bottom:0.35rem;">${ann.title}</h3>
              <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">${ann.description}</p>
              <div style="font-size:0.75rem; color:var(--primary-deep); font-weight:700; margin-top:0.6rem;">
                Issued by: ${ann.posted_by}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Events Calendar Column -->
      <div>
        <h2 style="font-size:1.25rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="fa-solid fa-calendar-star" style="color:var(--primary);"></i> Upcoming Events
        </h2>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${store.events.map(ev => `
            <div class="dash-card" style="margin-bottom:0; border-left:4px solid var(--primary);">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <span style="font-size:0.85rem; font-weight:800; color:var(--primary);"><i class="fa-solid fa-calendar-day"></i> ${ev.date}</span>
                <span style="font-size:0.75rem; color:var(--text-light);">${ev.time}</span>
              </div>
              <h3 style="font-size:1.1rem; margin-bottom:0.35rem;">${ev.title}</h3>
              <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">${ev.description}</p>
              <div style="font-size:0.75rem; color:var(--text-light); margin-top:0.6rem;">
                <i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> ${ev.location}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  if (allowPost) {
    document.getElementById('open-post-ann-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('announcement-modal');
      document.getElementById('ann-date').value = new Date().toISOString().split('T')[0];

      const form = document.getElementById('announcement-form');
      form.onsubmit = (e) => {
        e.preventDefault();
        const newAnn = {
          id: generateId('ANN'),
          title: document.getElementById('ann-title').value.trim(),
          date: document.getElementById('ann-date').value,
          priority: document.getElementById('ann-priority').value,
          description: document.getElementById('ann-desc').value.trim(),
          posted_by: getCurrentUser().name
        };

        const updatedStore = loadData();
        updatedStore.announcements.unshift(newAnn);
        saveData(updatedStore);

        closeModal('announcement-modal');
        showToast('Announcement broadcasted to entire portal!', 'success');
        showToast('📧 Simulated Email: Campus announcement notification sent.', 'info');
        renderEventsView(container, updatedStore, true);
      };

      modal.classList.add('active');
    });
  }
}

