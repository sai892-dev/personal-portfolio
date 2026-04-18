const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

// Helper: read projects from JSON file
function readProjects() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: write projects to JSON file
function writeProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

// Helper: generate a simple unique ID
function generateId() {
  return 'proj-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
}

// GET /api/projects — List all projects
router.get('/', (req, res) => {
  try {
    const projects = readProjects();
    const { category, search, featured } = req.query;

    let filtered = [...projects];

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.techStack.some(t => t.toLowerCase().includes(term))
      );
    }

    // Filter featured
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    res.json({ success: true, data: filtered, total: filtered.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id — Get single project
router.get('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// POST /api/projects — Add a new project
router.post('/', (req, res) => {
  try {
    const projects = readProjects();
    const { title, description, longDescription, techStack, liveUrl, githubUrl, image, category, featured } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newProject = {
      id: generateId(),
      title,
      description: description || '',
      longDescription: longDescription || '',
      techStack: techStack || [],
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      image: image || '',
      category: category || 'other',
      featured: featured || false,
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    writeProjects(projects);

    res.status(201).json({ success: true, data: newProject, message: 'Project added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add project' });
  }
});

// PUT /api/projects/:id — Update a project
router.put('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updatedProject = { ...projects[index], ...req.body, id: projects[index].id };
    projects[index] = updatedProject;
    writeProjects(projects);

    res.json({ success: true, data: updatedProject, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id — Delete a project
router.delete('/:id', (req, res) => {
  try {
    let projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    projects.splice(index, 1);
    writeProjects(projects);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

module.exports = router;
