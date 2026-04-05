const API_URL = '/api/content';

let currentData = {};

// Toast notification system
function toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
        <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    container.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.3s';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
    loadData();

    // Tab Logic
    window.switchTab = (tabName) => {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(`view-${tabName}`).classList.remove('hidden');

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-[#E50914]', 'text-white');
            btn.classList.add('bg-[#333]', 'text-[#B3B3B3]');
        });
        const activeBtn = document.getElementById(`tab-${tabName}`);
        activeBtn.classList.remove('bg-[#333]', 'text-[#B3B3B3]');
        activeBtn.classList.add('bg-[#E50914]', 'text-white');
    };

    // Image preview for add project form
    setupImagePreview('p-image', 'p-image-preview');
    setupImagePreview('p-banner', 'p-banner-preview');
    setupImagePreview('edit-image', 'edit-image-preview');
    setupImagePreview('edit-banner', 'edit-banner-preview');

    // Skill level slider
    const levelSlider = document.getElementById('s-level');
    const levelValue = document.getElementById('s-level-value');
    if (levelSlider && levelValue) {
        levelSlider.addEventListener('input', () => {
            levelValue.textContent = levelSlider.value + '%';
        });
    }
});

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (input && preview) {
        input.addEventListener('input', () => {
            const url = input.value.trim();
            if (url) {
                preview.src = url;
                preview.classList.remove('hidden');
                preview.onerror = () => preview.classList.add('hidden');
            } else {
                preview.classList.add('hidden');
            }
        });
    }
}

async function loadData() {
    try {
        const res = await fetch(API_URL);
        currentData = await res.json();
        renderProjects();
        renderSkills();
        renderAbout();
        renderExperience();
        renderRows();
    } catch (e) {
        console.error("Error loading data", e);
        toast('Error loading data', 'error');
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
            toast('Saved successfully!', 'success');
            loadData();
        } else {
            toast('Error saving data', 'error');
        }
    } catch (e) {
        toast('Network error', 'error');
    }
}

// ===== PROJECTS SECTION =====
function renderProjects() {
    const catSelect = document.getElementById('p-category');
    if (catSelect) {
        catSelect.innerHTML = '';
        if (currentData.rows) {
            currentData.rows.forEach(row => {
                const option = document.createElement('option');
                option.value = row.title;
                option.innerText = row.title;
                catSelect.appendChild(option);
            });
        }
    }

    const itemsList = document.getElementById('items-list');
    if (!itemsList) return;
    
    itemsList.innerHTML = '';
    if (currentData.rows) {
        currentData.rows.forEach(row => {
            row.items.forEach(item => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#222] p-3 rounded hover:bg-[#333] transition";
                
                // Build badges
                let badges = '';
                if (item.status) {
                    const statusClass = item.status.toLowerCase() === 'live' ? 'bg-green-600' 
                        : item.status.toLowerCase().includes('dev') ? 'bg-yellow-600' : 'bg-gray-600';
                    badges += `<span class="text-[10px] ${statusClass} px-1.5 py-0.5 rounded">${item.status}</span>`;
                }
                if (item.year) {
                    badges += `<span class="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded">${item.year}</span>`;
                }

                div.innerHTML = `
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <img src="${item.image}" class="w-14 h-8 object-cover rounded flex-shrink-0">
                        <div class="min-w-0">
                            <h4 class="font-semibold text-sm truncate">${item.title}</h4>
                            <div class="flex items-center gap-1 mt-0.5">
                                <span class="text-[10px] text-[#808080]">${row.title}</span>
                                ${badges}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 flex-shrink-0 ml-2">
                        <button onclick="editProject(${item.id}, '${row.title}')" class="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded border border-blue-400 hover:bg-blue-500/10">Edit</button>
                        <button onclick="deleteItem(${item.id}, '${row.title}')" class="text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 rounded border border-red-500 hover:bg-red-500/10">×</button>
                    </div>
                `;
                itemsList.appendChild(div);
            });
        });
    }
}

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
    document.getElementById('edit-project-row').value = rowTitle;
    
    document.getElementById('edit-title').value = project.title || '';
    document.getElementById('edit-image').value = project.image || '';
    document.getElementById('edit-banner').value = project.bannerImage || '';
    document.getElementById('edit-short-desc').value = project.shortDesc || '';
    document.getElementById('edit-description').value = project.description || '';
    document.getElementById('edit-year').value = project.year || '';
    document.getElementById('edit-difficulty').value = project.difficulty || '';
    document.getElementById('edit-status').value = project.status || '';
    document.getElementById('edit-build-time').value = project.buildTime || '';
    document.getElementById('edit-github').value = project.githubUrl || '';
    document.getElementById('edit-live-url').value = project.liveUrl || '';
    document.getElementById('edit-technologies').value = project.technologies ? project.technologies.join(', ') : '';
    document.getElementById('edit-use-cases').value = project.useCases ? project.useCases.join('\n') : '';
    document.getElementById('edit-future-scope').value = project.futureScope || '';
    document.getElementById('edit-contributors').value = project.contributors ? JSON.stringify(project.contributors, null, 2) : '';
    document.getElementById('edit-recommendations').value = project.recommendations ? project.recommendations.join(', ') : '';

    // Show image previews
    const imagePreview = document.getElementById('edit-image-preview');
    const bannerPreview = document.getElementById('edit-banner-preview');
    if (imagePreview && project.image) {
        imagePreview.src = project.image;
        imagePreview.classList.remove('hidden');
    }
    if (bannerPreview && project.bannerImage) {
        bannerPreview.src = project.bannerImage;
        bannerPreview.classList.remove('hidden');
    }

    // Scroll to editor
    document.getElementById('edit-project-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.cancelEditProject = () => {
    document.getElementById('edit-prompt').classList.remove('hidden');
    document.getElementById('edit-project-form').classList.add('hidden');
    document.getElementById('edit-project-form').reset();
    document.getElementById('edit-image-preview').classList.add('hidden');
    document.getElementById('edit-banner-preview').classList.add('hidden');
};

// Save edited project
document.getElementById('edit-project-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const projectId = parseInt(document.getElementById('edit-project-id').value);
    const rowTitle = document.getElementById('edit-project-row').value;

    const row = currentData.rows.find(r => r.title === rowTitle);
    if (!row) {
        toast('Row not found!', 'error');
        return;
    }

    const project = row.items.find(i => i.id === projectId);
    if (!project) {
        toast('Project not found!', 'error');
        return;
    }

    // Update all fields
    project.title = document.getElementById('edit-title').value;
    project.image = document.getElementById('edit-image').value;
    project.bannerImage = document.getElementById('edit-banner').value || undefined;
    project.shortDesc = document.getElementById('edit-short-desc').value || undefined;
    project.description = document.getElementById('edit-description').value;
    project.year = document.getElementById('edit-year').value ? parseInt(document.getElementById('edit-year').value) : undefined;
    project.difficulty = document.getElementById('edit-difficulty').value || undefined;
    project.status = document.getElementById('edit-status').value || undefined;
    project.buildTime = document.getElementById('edit-build-time').value || undefined;
    project.githubUrl = document.getElementById('edit-github').value;
    project.liveUrl = document.getElementById('edit-live-url').value;

    const techInput = document.getElementById('edit-technologies').value;
    project.technologies = techInput ? techInput.split(',').map(t => t.trim()).filter(t => t) : [];

    const useCasesInput = document.getElementById('edit-use-cases').value;
    project.useCases = useCasesInput ? useCasesInput.split('\n').map(u => u.trim()).filter(u => u) : [];

    project.futureScope = document.getElementById('edit-future-scope').value;

    try {
        const contributorsInput = document.getElementById('edit-contributors').value;
        project.contributors = contributorsInput ? JSON.parse(contributorsInput) : [];
    } catch (err) {
        toast('Invalid JSON format for contributors!', 'error');
        return;
    }

    const recsInput = document.getElementById('edit-recommendations').value;
    project.recommendations = recsInput ? recsInput.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r)) : [];

    saveData();
    cancelEditProject();
});

// Add new project
document.getElementById('add-project-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('p-title').value;
    const image = document.getElementById('p-image').value;
    const banner = document.getElementById('p-banner').value;
    const shortDesc = document.getElementById('p-short-desc').value;
    const github = document.getElementById('p-github').value;
    const liveUrl = document.getElementById('p-live-url').value;
    const category = document.getElementById('p-category').value;
    const year = document.getElementById('p-year').value;
    const difficulty = document.getElementById('p-difficulty').value;
    const status = document.getElementById('p-status').value;
    const buildTime = document.getElementById('p-build-time').value;

    const row = currentData.rows.find(r => r.title === category);
    if (row) {
        row.items.push({
            id: Date.now(),
            title: title,
            image: image,
            bannerImage: banner || undefined,
            shortDesc: shortDesc || undefined,
            githubUrl: github,
            liveUrl: liveUrl,
            year: year ? parseInt(year) : undefined,
            difficulty: difficulty || undefined,
            status: status || undefined,
            buildTime: buildTime || undefined,
            description: '',
            technologies: [],
            useCases: [],
            futureScope: '',
            contributors: [],
            recommendations: []
        });
        saveData();
        e.target.reset();
        document.getElementById('p-image-preview').classList.add('hidden');
        document.getElementById('p-banner-preview').classList.add('hidden');
    } else {
        toast('Please select a category', 'error');
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

// ===== SKILLS SECTION =====
function renderSkills() {
    const list = document.getElementById('skills-list');
    if (!list) return;
    
    list.innerHTML = '';
    if (currentData.skills) {
        // Group by category
        const categories = {};
        currentData.skills.forEach(skill => {
            if (!categories[skill.category]) categories[skill.category] = [];
            categories[skill.category].push(skill);
        });

        for (const [category, skills] of Object.entries(categories)) {
            const catHeader = document.createElement('div');
            catHeader.className = 'text-xs text-[#808080] font-semibold uppercase tracking-wide mt-4 first:mt-0 mb-2';
            catHeader.textContent = category;
            list.appendChild(catHeader);

            skills.forEach(skill => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#222] p-3 rounded hover:bg-[#333] transition";
                div.innerHTML = `
                    <div class="flex items-center gap-3 flex-1">
                        <span class="font-semibold text-sm">${skill.name}</span>
                        <div class="flex-1 max-w-[100px] h-1.5 bg-[#333] rounded-full overflow-hidden">
                            <div class="h-full bg-[#E50914] rounded-full" style="width: ${skill.level}%"></div>
                        </div>
                        <span class="text-xs text-[#808080]">${skill.level}%</span>
                    </div>
                    <button onclick="deleteSkill(${skill.id})" class="text-red-500 hover:text-red-400 text-xs ml-2">×</button>
                `;
                list.appendChild(div);
            });
        }
    }
}

document.getElementById('add-skill-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.skills) currentData.skills = [];
    currentData.skills.push({
        id: Date.now(),
        name: document.getElementById('s-name').value,
        level: parseInt(document.getElementById('s-level').value),
        category: document.getElementById('s-category').value
    });
    saveData();
    e.target.reset();
    document.getElementById('s-level-value').textContent = '50%';
});

window.deleteSkill = (id) => {
    if (!confirm('Delete skill?')) return;
    currentData.skills = currentData.skills.filter(s => s.id !== id);
    saveData();
};

// ===== ABOUT SECTION =====
function renderAbout() {
    if (currentData.about) {
        const introField = document.getElementById('a-intro');
        if (introField) introField.value = currentData.about.intro || '';

        const list = document.getElementById('timeline-list');
        if (list) {
            list.innerHTML = '';
            if (currentData.about.timeline) {
                currentData.about.timeline.forEach((t, idx) => {
                    const div = document.createElement('div');
                    div.className = "bg-[#222] p-3 rounded flex justify-between items-start hover:bg-[#333] transition";
                    div.innerHTML = `
                        <div>
                            <span class="text-[#E50914] font-bold text-sm">${t.year}</span>
                            <span class="text-white font-semibold text-sm ml-2">${t.title}</span>
                            <p class="text-xs text-[#808080] mt-1">${t.desc}</p>
                        </div>
                        <button onclick="deleteTimeline(${idx})" class="text-red-500 hover:text-red-400 text-xs ml-2 flex-shrink-0">×</button>
                    `;
                    list.appendChild(div);
                });
            }
        }
    }

    // Display current resume status
    const resumeInfo = document.getElementById('resume-info');
    if (resumeInfo && currentData.resumeUrl) {
        resumeInfo.innerHTML = `
            <span class="text-green-500 text-sm">✓ Resume uploaded</span>
            <a href="${currentData.resumeUrl}" target="_blank" class="bg-[#E50914] hover:bg-[#F40612] text-white text-xs px-3 py-1.5 rounded transition">
                View
            </a>
        `;
    } else if (resumeInfo) {
        resumeInfo.innerHTML = '<span class="text-[#808080] text-sm">No resume uploaded</span>';
    }

    // Display current profile picture
    const profilePicImg = document.getElementById('current-profile-pic');
    const noProfilePic = document.getElementById('no-profile-pic');
    const profilePicInput = document.getElementById('profile-pic-url');

    if (currentData.about && currentData.about.profilePicture) {
        if (profilePicImg) {
            profilePicImg.src = currentData.about.profilePicture;
            profilePicImg.classList.remove('hidden');
        }
        if (noProfilePic) noProfilePic.classList.add('hidden');
        if (profilePicInput) profilePicInput.value = currentData.about.profilePicture;
    } else {
        if (profilePicImg) profilePicImg.classList.add('hidden');
        if (noProfilePic) noProfilePic.classList.remove('hidden');
        if (profilePicInput) profilePicInput.value = '';
    }
}

document.getElementById('about-intro-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};
    currentData.about.intro = document.getElementById('a-intro').value;
    saveData();
});

document.getElementById('add-timeline-form')?.addEventListener('submit', (e) => {
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
    if (!confirm('Delete this timeline event?')) return;
    currentData.about.timeline.splice(idx, 1);
    saveData();
};

// Profile Picture
document.getElementById('profile-pic-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};
    currentData.about.profilePicture = document.getElementById('profile-pic-url').value;
    saveData();
});

window.removeProfilePic = () => {
    if (!confirm('Remove profile picture?')) return;
    if (currentData.about) {
        currentData.about.profilePicture = '';
        saveData();
    }
};

// Resume Upload
document.getElementById('upload-resume-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file');
    if (!fileInput || !fileInput.files[0]) {
        toast('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            toast('Resume uploaded successfully!', 'success');
            loadData();
        } else {
            toast('Upload failed', 'error');
        }
    } catch (err) {
        toast('Upload error', 'error');
    }
});

// ===== EXPERIENCE SECTION =====
function renderExperience() {
    const list = document.getElementById('experience-list');
    if (!list) return;
    
    list.innerHTML = '';
    if (currentData.experience) {
        currentData.experience.forEach(exp => {
            const div = document.createElement('div');
            div.className = "bg-[#222] p-4 rounded hover:bg-[#333] transition";
            div.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold text-sm">${exp.role}</h4>
                        <p class="text-[#E50914] text-sm">${exp.company}</p>
                    </div>
                    <button onclick="deleteExperience(${exp.id})" class="text-red-500 hover:text-red-400 text-xs">×</button>
                </div>
                <p class="text-xs text-[#808080] mb-1">${exp.duration}</p>
                <p class="text-xs text-[#B3B3B3]">${exp.description}</p>
            `;
            list.appendChild(div);
        });
    }
}

document.getElementById('add-experience-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.experience) currentData.experience = [];
    currentData.experience.push({
        id: Date.now(),
        company: document.getElementById('e-company').value,
        role: document.getElementById('e-role').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    });
    saveData();
    e.target.reset();
});

window.deleteExperience = (id) => {
    if (!confirm('Delete this experience?')) return;
    currentData.experience = currentData.experience.filter(e => e.id !== id);
    saveData();
};

// ===== ROWS SECTION =====
function renderRows() {
    const list = document.getElementById('rows-list');
    const profilesContainer = document.getElementById('r-profiles');
    
    // Populate profile checkboxes
    if (profilesContainer && currentData.profiles) {
        profilesContainer.innerHTML = '';
        currentData.profiles.forEach(p => {
            const label = document.createElement('label');
            label.className = 'flex items-center gap-2 text-sm cursor-pointer';
            label.innerHTML = `
                <input type="checkbox" value="${p.id}" class="accent-[#E50914]" checked>
                <span>${p.name}</span>
            `;
            profilesContainer.appendChild(label);
        });
    }

    if (!list) return;
    
    list.innerHTML = '';
    if (currentData.rows) {
        currentData.rows.forEach((row, idx) => {
            const profileNames = row.profileIds 
                ? row.profileIds.map(pid => currentData.profiles.find(p => p.id === pid)?.name || pid).join(', ')
                : 'All';
            
            const div = document.createElement('div');
            div.className = "bg-[#222] p-4 rounded hover:bg-[#333] transition";
            div.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold text-sm">${row.title}</h4>
                        <p class="text-xs text-[#808080]">${row.items.length} projects · ${row.style || 'standard'}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="moveRowUp(${idx})" class="text-[#808080] hover:text-white text-xs" ${idx === 0 ? 'disabled' : ''}>↑</button>
                        <button onclick="moveRowDown(${idx})" class="text-[#808080] hover:text-white text-xs" ${idx === currentData.rows.length - 1 ? 'disabled' : ''}>↓</button>
                        <button onclick="deleteRow(${idx})" class="text-red-500 hover:text-red-400 text-xs">×</button>
                    </div>
                </div>
                <p class="text-xs text-[#808080]">Profiles: ${profileNames}</p>
            `;
            list.appendChild(div);
        });
    }
}

document.getElementById('add-row-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.rows) currentData.rows = [];
    
    const title = document.getElementById('r-title').value;
    const style = document.getElementById('r-style').value;
    const profileCheckboxes = document.querySelectorAll('#r-profiles input:checked');
    const profileIds = Array.from(profileCheckboxes).map(cb => parseInt(cb.value));

    currentData.rows.push({
        title: title,
        style: style,
        profileIds: profileIds,
        items: []
    });
    saveData();
    e.target.reset();
});

window.deleteRow = (idx) => {
    const row = currentData.rows[idx];
    if (row.items.length > 0) {
        if (!confirm(`This row has ${row.items.length} projects. Delete anyway?`)) return;
    } else {
        if (!confirm('Delete this row?')) return;
    }
    currentData.rows.splice(idx, 1);
    saveData();
};

window.moveRowUp = (idx) => {
    if (idx > 0) {
        [currentData.rows[idx - 1], currentData.rows[idx]] = [currentData.rows[idx], currentData.rows[idx - 1]];
        saveData();
    }
};

window.moveRowDown = (idx) => {
    if (idx < currentData.rows.length - 1) {
        [currentData.rows[idx], currentData.rows[idx + 1]] = [currentData.rows[idx + 1], currentData.rows[idx]];
        saveData();
    }
};
