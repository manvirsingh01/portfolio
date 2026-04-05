const API_URL = '/api/content';

let currentData = {};

document.addEventListener('DOMContentLoaded', async () => {
    loadData();

    // Tab Logic
    window.switchTab = (tabName) => {
        // Hide all contents
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        // Show active content
        document.getElementById(`view-${tabName}`).classList.remove('hidden');

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('bg-gray-800', 'text-gray-400');
        });
        const activeBtn = document.getElementById(`tab-${tabName}`);
        activeBtn.classList.remove('bg-gray-800', 'text-gray-400');
        activeBtn.classList.add('bg-red-600', 'text-white');
    };
});

async function loadData() {
    try {
        const res = await fetch(API_URL);
        currentData = await res.json();
        renderProjects();
        renderSkills();
        renderAbout();
    } catch (e) {
        console.error("Error loading data", e);
    }
}

async function saveData() {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData)
        });
        const result = await res.json();
        if (result.success) {
            alert('Saved successfully!');
            loadData(); // Reload to refresh lists
        } else {
            alert('Error saving data.');
        }
    } catch (e) {
        alert('Network error.');
    }
}

/*Projects Section*/
function renderProjects() {
    const catSelect = document.getElementById('p-category');
    catSelect.innerHTML = '';
    if (currentData.rows) {
        currentData.rows.forEach(row => {
            const option = document.createElement('option');
            option.value = row.title;
            option.innerText = row.title;
            catSelect.appendChild(option);
        });
    }

    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    if (currentData.rows) {
        currentData.rows.forEach(row => {
            row.items.forEach(item => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#333] p-4 rounded";
                div.innerHTML = `
                    <div class="flex items-center gap-4 flex-1">
                        <img src="${item.image}" class="w-16 h-9 object-cover rounded">
                        <div>
                            <h4 class="font-bold">${item.title}</h4>
                            <span class="text-xs text-gray-400">${row.title}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editProject(${item.id}, '${row.title}')" class="text-blue-400 hover:text-blue-300 font-bold border border-blue-400 px-3 py-1 rounded hover:bg-blue-500/10 text-sm">Edit</button>
                        <button onclick="deleteItem(${item.id}, '${row.title}')" class="text-red-500 hover:text-red-400 font-bold border border-red-500 px-3 py-1 rounded hover:bg-red-500/10 text-sm">Delete</button>
                    </div>
                `;
                itemsList.appendChild(div);
            });
        });
    }
}

// Edit Project
window.editProject = (itemId, rowTitle) => {
    const row = currentData.rows.find(r => r.title === rowTitle);
    if (!row) return;

    const project = row.items.find(i => i.id === itemId);
    if (!project) return;

    // Show edit form
    document.getElementById('edit-prompt').classList.add('hidden');
    document.getElementById('edit-project-form').classList.remove('hidden');

    // Populate form
    document.getElementById('edit-project-id').value = itemId;
    document.getElementById('edit-description').value = project.description || '';
    document.getElementById('edit-live-url').value = project.liveUrl || '';
    document.getElementById('edit-technologies').value = project.technologies ? project.technologies.join(', ') : '';
    document.getElementById('edit-use-cases').value = project.useCases ? project.useCases.join('\n') : '';
    document.getElementById('edit-future-scope').value = project.futureScope || '';
    document.getElementById('edit-contributors').value = project.contributors ? JSON.stringify(project.contributors, null, 2) : '';
    document.getElementById('edit-recommendations').value = project.recommendations ? project.recommendations.join(', ') : '';

    // Scroll to editor
    document.getElementById('edit-project-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.cancelEditProject = () => {
    document.getElementById('edit-prompt').classList.remove('hidden');
    document.getElementById('edit-project-form').classList.add('hidden');
    document.getElementById('edit-project-form').reset();
};

// Save edited project
document.getElementById('edit-project-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const projectId = parseInt(document.getElementById('edit-project-id').value);

    // Find the project
    let targetProject = null;
    let targetRow = null;

    for (const row of currentData.rows) {
        const project = row.items.find(i => i.id === projectId);
        if (project) {
            targetProject = project;
            targetRow = row;
            break;
        }
    }

    if (!targetProject) {
        alert('Project not found!');
        return;
    }

    // Update project details
    targetProject.description = document.getElementById('edit-description').value;
    targetProject.liveUrl = document.getElementById('edit-live-url').value;

    const techInput = document.getElementById('edit-technologies').value;
    targetProject.technologies = techInput ? techInput.split(',').map(t => t.trim()).filter(t => t) : [];

    const useCasesInput = document.getElementById('edit-use-cases').value;
    targetProject.useCases = useCasesInput ? useCasesInput.split('\n').map(u => u.trim()).filter(u => u) : [];

    targetProject.futureScope = document.getElementById('edit-future-scope').value;

    // Parse contributors JSON
    try {
        const contributorsInput = document.getElementById('edit-contributors').value;
        targetProject.contributors = contributorsInput ? JSON.parse(contributorsInput) : [];
    } catch (err) {
        alert('Invalid JSON format for contributors!');
        return;
    }

    const recsInput = document.getElementById('edit-recommendations').value;
    targetProject.recommendations = recsInput ? recsInput.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r)) : [];

    saveData();
    cancelEditProject();
});

document.getElementById('add-project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('p-title').value;
    const image = document.getElementById('p-image').value;
    const github = document.getElementById('p-github').value;
    const category = document.getElementById('p-category').value;

    const row = currentData.rows.find(r => r.title === category);
    if (row) {
        row.items.push({
            id: Date.now(),
            title: title,
            image: image,
            githubUrl: github,
            description: '',
            liveUrl: '',
            technologies: [],
            useCases: [],
            futureScope: '',
            contributors: [],
            recommendations: []
        });
        saveData();
        e.target.reset();
    }
});

window.deleteItem = (itemId, rowTitle) => {
    if (!confirm('Delete this project?')) return;
    const row = currentData.rows.find(r => r.title === rowTitle);
    if (row) {
        row.items = row.items.filter(i => i.id !== itemId);
        saveData();
    }
};

/*Skills Section*/
function renderSkills() {
    const list = document.getElementById('skills-list');
    list.innerHTML = '';
    if (currentData.skills) {
        currentData.skills.forEach(skill => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-[#333] p-4 rounded";
            div.innerHTML = `
                 <div><span class="font-bold">${skill.name}</span> <span class="text-gray-400">(${skill.level}%)</span> <span class="text-xs bg-gray-700 px-2 py-1 rounded">${skill.category}</span></div>
                 <button onclick="deleteSkill(${skill.id})" class="text-red-500">Delete</button>
             `;
            list.appendChild(div);
        });
    }
}

document.getElementById('add-skill-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.skills) currentData.skills = [];
    currentData.skills.push({
        id: Date.now(),
        name: document.getElementById('s-name').value,
        level: document.getElementById('s-level').value,
        category: document.getElementById('s-category').value
    });
    saveData();
    e.target.reset();
});

window.deleteSkill = (id) => {
    if (!confirm('Delete skill?')) return;
    currentData.skills = currentData.skills.filter(s => s.id !== id);
    saveData();
};

/*About Section*/
function renderAbout() {
    if (currentData.about) {
        document.getElementById('a-intro').value = currentData.about.intro || '';

        const list = document.getElementById('timeline-list');
        list.innerHTML = '';
        if (currentData.about.timeline) {
            currentData.about.timeline.forEach((t, idx) => {
                const div = document.createElement('div');
                div.className = "bg-[#333] p-4 rounded flex justify-between";
                div.innerHTML = `
                    <div><span class="text-red-500 font-bold">${t.year}</span>: ${t.title}</div>
                    <button onclick="deleteTimeline(${idx})" class="text-red-500">Delete</button>
                `;
                list.appendChild(div);
            });
        }
    }

    // Display current resume status
    const resumeInfo = document.getElementById('resume-info');
    if (resumeInfo && currentData.resumeUrl) {
        resumeInfo.innerHTML = `
            <span class="text-green-500 text-sm">✓ Resume uploaded</span>
            <a href="${currentData.resumeUrl}" target="_blank" class="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded transition">
                View Resume
            </a>
        `;
    } else if (resumeInfo) {
        resumeInfo.innerHTML = '<span class="text-gray-400 text-sm">No resume uploaded</span>';
    }

    // Display current profile picture
    const profilePicImg = document.getElementById('current-profile-pic');
    const noProfilePic = document.getElementById('no-profile-pic');
    const profilePicInput = document.getElementById('profile-pic-url');

    if (currentData.about && currentData.about.profilePicture) {
        profilePicImg.src = currentData.about.profilePicture;
        profilePicImg.classList.remove('hidden');
        noProfilePic.classList.add('hidden');
        if (profilePicInput) profilePicInput.value = currentData.about.profilePicture;
    } else {
        profilePicImg.classList.add('hidden');
        noProfilePic.classList.remove('hidden');
        if (profilePicInput) profilePicInput.value = '';
    }
}

// Profile Picture Form Handler
document.getElementById('profile-pic-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};

    const profilePicUrl = document.getElementById('profile-pic-url').value;
    currentData.about.profilePicture = profilePicUrl;
    saveData();
});

// Remove Profile Picture
window.removeProfilePic = () => {
    if (!confirm('Remove profile picture?')) return;
    if (currentData.about) {
        currentData.about.profilePicture = '';
        saveData();
    }
};

document.getElementById('about-intro-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};
    currentData.about.intro = document.getElementById('a-intro').value;
    saveData();
});

document.getElementById('add-timeline-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};
    if (!currentData.about.timeline) currentData.about.timeline = [];

    currentData.about.timeline.push({
        year: document.getElementById('t-year').value,
        title: document.getElementById('t-title').value,
        desc: document.getElementById('t-desc').value
    });
    saveData();
    e.target.reset();
});

window.deleteTimeline = (idx) => {
    if (!confirm('Delete event?')) return;
    currentData.about.timeline.splice(idx, 1);
    saveData();
}

/*Resume Section*/
document.getElementById('upload-resume-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file');
    if (!fileInput.files[0]) return alert('Please select a file');

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            document.getElementById('resume-status').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('resume-status').classList.add('hidden');
            }, 3000);
            currentData.resumeUrl = result.filePath;
            // No need to save data separately as upload updates the file? 
            // Actually server updates standard file, so we should reload data to sync
            loadData();
        } else {
            alert('Upload failed');
        }
    } catch (err) {
        console.error(err);
        alert('Upload Error');
    }
});
