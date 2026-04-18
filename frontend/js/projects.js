/* =========================================================
   PROJECTS.JS — Fetch & render projects from API
   ========================================================= */

let allProjects = [];
let currentFilter = 'all';

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('project-search');
const modalOverlay = document.getElementById('project-modal');

// --- Fetch Projects from API ---
async function fetchProjects() {
  try {
    const response = await fetch(API_BASE + '/projects');
    const result = await response.json();
    if (result.success) {
      allProjects = result.data;
      renderProjects(allProjects);
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Fallback: show error state
    if (projectsGrid) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
          <p style="color: var(--text-muted); font-size: 1.1rem;">
            Unable to load projects. Make sure the backend server is running.
          </p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">
            Run: <code style="color: var(--accent-cyan);">cd backend && npm install && npm start</code>
          </p>
        </div>
      `;
    }
  }
}

// --- Render Project Cards ---
function renderProjects(projects) {
  if (!projectsGrid) return;

  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
        <p style="color: var(--text-muted); font-size: 1.1rem;">No projects found.</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = projects.map((project, index) => `
    <div class="project-card reveal reveal-delay-${(index % 4) + 1}" onclick="openProjectModal('${project.id}')" data-id="${project.id}">
      <div class="project-image">
        ${project.image
          ? `<img src="${project.image}" alt="${project.title}">`
          : `<span class="project-image-placeholder">${getCategoryIcon(project.category)}</span>`
        }
        <span class="project-category-badge">${project.category}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link project-link-primary" target="_blank" onclick="event.stopPropagation()">🔗 Live Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link project-link-secondary" target="_blank" onclick="event.stopPropagation()">📂 GitHub</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Re-trigger reveal animations for new elements
  const newReveals = projectsGrid.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  newReveals.forEach(el => observer.observe(el));
}

// --- Category Icons ---
function getCategoryIcon(category) {
  const icons = {
    fullstack: '🌐',
    frontend: '🎨',
    backend: '⚙️',
    mobile: '📱',
    other: '💡'
  };
  return icons[category] || '💡';
}

// --- Filter Projects ---
if (filterButtons) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
}

// --- Search Projects ---
if (searchInput) {
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 300);
  });
}

function applyFilters() {
  let filtered = [...allProjects];

  // Category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilter);
  }

  // Search filter
  if (searchInput && searchInput.value.trim()) {
    const term = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.techStack.some(t => t.toLowerCase().includes(term))
    );
  }

  renderProjects(filtered);
}

// --- Project Modal ---
function openProjectModal(projectId) {
  const project = allProjects.find(p => p.id === projectId);
  if (!project || !modalOverlay) return;

  const modal = modalOverlay.querySelector('.modal');
  modal.innerHTML = `
    <button class="modal-close" onclick="closeProjectModal()">✕</button>
    <div class="modal-image">${getCategoryIcon(project.category)}</div>
    <div class="modal-body">
      <h2 class="modal-title">${project.title}</h2>
      <p class="modal-description">${project.longDescription || project.description}</p>
      <div class="modal-tech">
        ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
      </div>
      <div class="modal-links">
        ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn-primary" target="_blank">🔗 Live Demo</a>` : ''}
        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank">📂 GitHub</a>` : ''}
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProjectModal();
  });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

// --- Init ---
document.addEventListener('DOMContentLoaded', fetchProjects);
