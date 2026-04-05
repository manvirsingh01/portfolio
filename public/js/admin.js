const API_URL = '/api/content';
const IMGBB_API_KEY = '666fb0955cdaa1276ec3e3a61a965011';

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

// ImgBB Upload Function
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error?.message || 'Upload failed');
        }
    } catch (err) {
        console.error('ImgBB upload error:', err);
        throw err;
    }
}

// Setup ImgBB upload handlers
function setupImgBBUploads() {
    document.querySelectorAll('.imgbb-upload').forEach(input => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const targetId = input.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (!targetInput) return;
            
            // Show loading state
            const originalPlaceholder = targetInput.placeholder;
            targetInput.placeholder = 'Uploading...';
            targetInput.disabled = true;
            
            try {
                toast('Uploading image...', 'info');
                const url = await uploadToImgBB(file);
                targetInput.value = url;
                targetInput.placeholder = originalPlaceholder;
                targetInput.disabled = false;
                
                // Trigger input event to update preview
                targetInput.dispatchEvent(new Event('input'));
                
                toast('Image uploaded!', 'success');
            } catch (err) {
                targetInput.placeholder = originalPlaceholder;
                targetInput.disabled = false;
                toast('Upload failed: ' + err.message, 'error');
            }
            
            // Reset file input
            e.target.value = '';
        });
    });
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
    
    // Setup ImgBB image uploads
    setupImgBBUploads();

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
        renderSocials();
        renderExperience();
        renderRows();
        renderProfiles();
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
                        <button class="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded border border-blue-400 hover:bg-blue-500/10 edit-project-btn" data-id="${item.id}" data-row="${row.title}">Edit</button>
                        <button class="text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 rounded border border-red-500 hover:bg-red-500/10 delete-project-btn" data-id="${item.id}" data-row="${row.title}">×</button>
                    </div>
                `;
                itemsList.appendChild(div);
            });
        });
    }
    
    // Event delegation for project buttons
    itemsList.onclick = (e) => {
        const editBtn = e.target.closest('.edit-project-btn');
        const deleteBtn = e.target.closest('.delete-project-btn');
        
        if (editBtn) {
            const id = parseInt(editBtn.dataset.id);
            const rowTitle = editBtn.dataset.row;
            editProject(id, rowTitle);
        } else if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            const rowTitle = deleteBtn.dataset.row;
            deleteItem(id, rowTitle);
        }
    };
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
    const categorySelect = document.getElementById('s-category');
    const editCategorySelect = document.getElementById('edit-s-category');
    const categoriesList = document.getElementById('categories-list');
    
    // Get unique categories
    const categories = [...new Set((currentData.skills || []).map(s => s.category))].filter(c => c);
    
    // Populate category dropdowns
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }
    
    if (editCategorySelect) {
        editCategorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            editCategorySelect.appendChild(option);
        });
    }
    
    // Render categories management list
    if (categoriesList) {
        categoriesList.innerHTML = '';
        categories.forEach(cat => {
            const skillCount = currentData.skills.filter(s => s.category === cat).length;
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-[#222] p-2 rounded hover:bg-[#333] transition";
            div.innerHTML = `
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <span class="text-sm truncate">${cat}</span>
                    <span class="text-xs text-[#808080]">(${skillCount})</span>
                </div>
                <div class="flex gap-1">
                    <button class="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 edit-cat-btn" data-cat="${cat}">Edit</button>
                    <button class="text-red-500 hover:text-red-400 text-xs px-2 py-1 delete-cat-btn" data-cat="${cat}">×</button>
                </div>
            `;
            categoriesList.appendChild(div);
        });
        if (categories.length === 0) {
            categoriesList.innerHTML = '<p class="text-sm text-[#808080]">No categories yet</p>';
        } else {
            // Event delegation for category buttons
            categoriesList.onclick = (e) => {
                const editBtn = e.target.closest('.edit-cat-btn');
                const deleteBtn = e.target.closest('.delete-cat-btn');
                
                if (editBtn) {
                    editCategory(editBtn.dataset.cat);
                } else if (deleteBtn) {
                    deleteCategory(deleteBtn.dataset.cat);
                }
            };
        }
    }

    if (!list) return;
    
    list.innerHTML = '';
    if (currentData.skills) {
        // Group by category
        const categoriesMap = {};
        currentData.skills.forEach(skill => {
            if (!categoriesMap[skill.category]) categoriesMap[skill.category] = [];
            categoriesMap[skill.category].push(skill);
        });

        for (const [category, skills] of Object.entries(categoriesMap)) {
            const catHeader = document.createElement('div');
            catHeader.className = 'text-xs text-[#808080] font-semibold uppercase tracking-wide mt-4 first:mt-0 mb-2';
            catHeader.textContent = category;
            list.appendChild(catHeader);

            skills.forEach(skill => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center bg-[#222] p-3 rounded hover:bg-[#333] transition";
                const skillId = String(skill.id);
                div.innerHTML = `
                    <div class="flex items-center gap-3 flex-1">
                        <span class="font-semibold text-sm">${skill.name}</span>
                        <div class="flex-1 max-w-[100px] h-1.5 bg-[#333] rounded-full overflow-hidden">
                            <div class="h-full bg-[#E50914] rounded-full" style="width: ${skill.level}%"></div>
                        </div>
                        <span class="text-xs text-[#808080]">${skill.level}%</span>
                    </div>
                    <div class="flex gap-1 ml-2">
                        <button class="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 edit-skill-btn" data-id="${skillId}">Edit</button>
                        <button class="text-red-500 hover:text-red-400 text-xs px-2 py-1 delete-skill-btn" data-id="${skillId}">×</button>
                    </div>
                `;
                list.appendChild(div);
            });
        }
    }
    
    // Add event listeners for skill buttons using event delegation
    if (list) {
        list.onclick = (e) => {
            const editBtn = e.target.closest('.edit-skill-btn');
            const deleteBtn = e.target.closest('.delete-skill-btn');
            
            if (editBtn) {
                const id = editBtn.dataset.id;
                editSkill(id);
            } else if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                deleteSkill(id);
            }
        };
    }
}

document.getElementById('add-skill-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.skills) currentData.skills = [];
    
    // Check if new category was entered
    const newCategory = document.getElementById('s-new-category').value.trim();
    const selectedCategory = document.getElementById('s-category').value;
    const category = newCategory || selectedCategory;
    
    if (!category) {
        toast('Please select or enter a category', 'error');
        return;
    }
    
    currentData.skills.push({
        id: Date.now(),
        name: document.getElementById('s-name').value,
        level: parseInt(document.getElementById('s-level').value),
        category: category
    });
    saveData();
    e.target.reset();
    document.getElementById('s-level-value').textContent = '50%';
    document.getElementById('s-new-category').value = '';
});

window.deleteSkill = (id) => {
    if (!confirm('Delete skill?')) return;
    const numId = typeof id === 'string' ? parseInt(id) : id;
    currentData.skills = currentData.skills.filter(s => s.id !== numId);
    saveData();
};

window.editSkill = (id) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const skill = currentData.skills.find(s => s.id === numId);
    if (!skill) return;
    
    document.getElementById('edit-skill-prompt').classList.add('hidden');
    document.getElementById('edit-skill-form').classList.remove('hidden');
    
    document.getElementById('edit-skill-id').value = numId;
    document.getElementById('edit-s-name').value = skill.name;
    document.getElementById('edit-s-level').value = skill.level;
    document.getElementById('edit-s-level-value').textContent = skill.level + '%';
    document.getElementById('edit-s-category').value = skill.category;
};

window.cancelEditSkill = () => {
    document.getElementById('edit-skill-prompt').classList.remove('hidden');
    document.getElementById('edit-skill-form').classList.add('hidden');
    document.getElementById('edit-skill-form').reset();
};

document.getElementById('edit-skill-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('edit-skill-id').value);
    const skill = currentData.skills.find(s => s.id === id);
    if (!skill) return;
    
    skill.name = document.getElementById('edit-s-name').value;
    skill.level = parseInt(document.getElementById('edit-s-level').value);
    skill.category = document.getElementById('edit-s-category').value;
    
    saveData();
    cancelEditSkill();
});

// Edit skill level slider
const editLevelSlider = document.getElementById('edit-s-level');
const editLevelValue = document.getElementById('edit-s-level-value');
if (editLevelSlider && editLevelValue) {
    editLevelSlider.addEventListener('input', () => {
        editLevelValue.textContent = editLevelSlider.value + '%';
    });
}

window.editCategory = (oldName) => {
    const newName = prompt('Enter new category name:', oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;
    
    // Update all skills with this category
    currentData.skills.forEach(skill => {
        if (skill.category === oldName) {
            skill.category = newName.trim();
        }
    });
    saveData();
};

window.deleteCategory = (categoryName) => {
    const skillCount = currentData.skills.filter(s => s.category === categoryName).length;
    if (!confirm(`Delete category "${categoryName}"? This will also delete ${skillCount} skill(s) in this category.`)) return;
    
    currentData.skills = currentData.skills.filter(s => s.category !== categoryName);
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
            if (currentData.about.timeline && currentData.about.timeline.length > 0) {
                const timelineLen = currentData.about.timeline.length;
                currentData.about.timeline.forEach((t, idx) => {
                    const div = document.createElement('div');
                    div.className = "bg-[#222] p-3 rounded flex justify-between items-start hover:bg-[#333] transition";
                    div.innerHTML = `
                        <div class="flex-1">
                            <span class="text-[#E50914] font-bold text-sm">${t.year}</span>
                            <span class="text-white font-semibold text-sm ml-2">${t.title}</span>
                            <p class="text-xs text-[#808080] mt-1">${t.desc}</p>
                        </div>
                        <div class="flex gap-1 ml-2 flex-shrink-0">
                            <button class="text-[#808080] hover:text-white text-xs px-1 move-timeline-up-btn" data-idx="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>↑</button>
                            <button class="text-[#808080] hover:text-white text-xs px-1 move-timeline-down-btn" data-idx="${idx}" ${idx === timelineLen - 1 ? 'disabled style="opacity:0.3"' : ''}>↓</button>
                            <button class="text-red-500 hover:text-red-400 text-xs px-1 delete-timeline-btn" data-idx="${idx}">×</button>
                        </div>
                    `;
                    list.appendChild(div);
                });
            }
            
            // Event delegation for timeline buttons
            list.onclick = (e) => {
                const upBtn = e.target.closest('.move-timeline-up-btn');
                const downBtn = e.target.closest('.move-timeline-down-btn');
                const deleteBtn = e.target.closest('.delete-timeline-btn');
                
                if (upBtn && !upBtn.disabled) {
                    moveTimelineUp(parseInt(upBtn.dataset.idx));
                } else if (downBtn && !downBtn.disabled) {
                    moveTimelineDown(parseInt(downBtn.dataset.idx));
                } else if (deleteBtn) {
                    deleteTimeline(parseInt(deleteBtn.dataset.idx));
                }
            };
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
    // Auto-sort by year (descending - newest first)
    currentData.about.timeline.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });
    saveData();
    e.target.reset();
});

window.deleteTimeline = (idx) => {
    if (!confirm('Delete this timeline event?')) return;
    currentData.about.timeline.splice(idx, 1);
    saveData();
};

window.moveTimelineUp = (idx) => {
    if (idx > 0) {
        const timeline = currentData.about.timeline;
        [timeline[idx - 1], timeline[idx]] = [timeline[idx], timeline[idx - 1]];
        saveData();
    }
};

window.moveTimelineDown = (idx) => {
    const timeline = currentData.about.timeline;
    if (idx < timeline.length - 1) {
        [timeline[idx], timeline[idx + 1]] = [timeline[idx + 1], timeline[idx]];
        saveData();
    }
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

// ===== SOCIAL LINKS SECTION =====
function renderSocials() {
    const list = document.getElementById('socials-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (currentData.about && currentData.about.socials && currentData.about.socials.length > 0) {
        currentData.about.socials.forEach((social, idx) => {
            const div = document.createElement('div');
            div.className = "bg-[#222] p-4 rounded hover:bg-[#333] transition flex justify-between items-center";
            div.innerHTML = `
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0">
                        ${getSocialIcon(social.platform)}
                    </div>
                    <div class="min-w-0">
                        <h4 class="font-semibold text-sm">${social.platform}</h4>
                        <p class="text-xs text-[#808080] truncate max-w-[200px]">${social.url}</p>
                    </div>
                </div>
                <div class="flex gap-2 flex-shrink-0 ml-2">
                    <button class="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded border border-blue-400 hover:bg-blue-500/10 edit-social-btn" data-idx="${idx}">Edit</button>
                    <button class="text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 rounded border border-red-500 hover:bg-red-500/10 delete-social-btn" data-idx="${idx}">×</button>
                </div>
            `;
            list.appendChild(div);
        });
        
        // Event delegation
        list.onclick = (e) => {
            const editBtn = e.target.closest('.edit-social-btn');
            const deleteBtn = e.target.closest('.delete-social-btn');
            
            if (editBtn) {
                editSocial(parseInt(editBtn.dataset.idx));
            } else if (deleteBtn) {
                deleteSocial(parseInt(deleteBtn.dataset.idx));
            }
        };
    } else {
        list.innerHTML = '<p class="text-[#808080] text-center py-4">No social links added yet</p>';
    }
}

function getSocialIcon(platform) {
    const icons = {
        'GitHub': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        'LinkedIn': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
        'Twitter': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>',
        'Instagram': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
        'YouTube': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
        'Email': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        'Website': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>'
    };
    return icons[platform] || '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>';
}

// Show/hide custom platform field
document.getElementById('social-platform')?.addEventListener('change', (e) => {
    const customContainer = document.getElementById('custom-platform-container');
    if (e.target.value === 'Other') {
        customContainer.classList.remove('hidden');
    } else {
        customContainer.classList.add('hidden');
    }
});

// Add social link
document.getElementById('add-social-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.about) currentData.about = {};
    if (!currentData.about.socials) currentData.about.socials = [];
    
    let platform = document.getElementById('social-platform').value;
    if (platform === 'Other') {
        platform = document.getElementById('social-custom-platform').value.trim();
        if (!platform) {
            toast('Please enter a custom platform name', 'error');
            return;
        }
    }
    
    const url = document.getElementById('social-url').value;
    
    currentData.about.socials.push({ platform, url });
    saveData();
    e.target.reset();
    document.getElementById('custom-platform-container').classList.add('hidden');
});

window.editSocial = (idx) => {
    const social = currentData.about.socials[idx];
    if (!social) return;
    
    document.getElementById('edit-social-index').value = idx;
    document.getElementById('edit-social-platform').value = social.platform;
    document.getElementById('edit-social-url').value = social.url;
    
    document.getElementById('edit-social-prompt').classList.add('hidden');
    document.getElementById('edit-social-form').classList.remove('hidden');
};

window.cancelEditSocial = () => {
    document.getElementById('edit-social-prompt').classList.remove('hidden');
    document.getElementById('edit-social-form').classList.add('hidden');
    document.getElementById('edit-social-form').reset();
};

document.getElementById('edit-social-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('edit-social-index').value);
    
    currentData.about.socials[idx] = {
        platform: document.getElementById('edit-social-platform').value,
        url: document.getElementById('edit-social-url').value
    };
    
    saveData();
    cancelEditSocial();
});

window.deleteSocial = (idx) => {
    if (!confirm('Delete this social link?')) return;
    currentData.about.socials.splice(idx, 1);
    saveData();
};

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
                    <button class="text-red-500 hover:text-red-400 text-xs delete-exp-btn" data-id="${exp.id}">×</button>
                </div>
                <p class="text-xs text-[#808080] mb-1">${exp.duration}</p>
                <p class="text-xs text-[#B3B3B3]">${exp.description}</p>
            `;
            list.appendChild(div);
        });
    }
    
    // Event delegation for experience delete
    list.onclick = (e) => {
        const deleteBtn = e.target.closest('.delete-exp-btn');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            deleteExperience(id);
        }
    };
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
                        <button class="text-[#808080] hover:text-white text-xs move-row-up-btn" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
                        <button class="text-[#808080] hover:text-white text-xs move-row-down-btn" data-idx="${idx}" ${idx === currentData.rows.length - 1 ? 'disabled' : ''}>↓</button>
                        <button class="text-red-500 hover:text-red-400 text-xs delete-row-btn" data-idx="${idx}">×</button>
                    </div>
                </div>
                <p class="text-xs text-[#808080]">Profiles: ${profileNames}</p>
            `;
            list.appendChild(div);
        });
    }
    
    // Event delegation for row buttons
    list.onclick = (e) => {
        const upBtn = e.target.closest('.move-row-up-btn');
        const downBtn = e.target.closest('.move-row-down-btn');
        const deleteBtn = e.target.closest('.delete-row-btn');
        
        if (upBtn) {
            moveRowUp(parseInt(upBtn.dataset.idx));
        } else if (downBtn) {
            moveRowDown(parseInt(downBtn.dataset.idx));
        } else if (deleteBtn) {
            deleteRow(parseInt(deleteBtn.dataset.idx));
        }
    };
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

// ===== PROFILES SECTION =====
function renderProfiles() {
    const list = document.getElementById('profiles-list');
    if (!list) return;
    
    list.innerHTML = '';
    if (currentData.profiles) {
        currentData.profiles.forEach(profile => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-[#222] p-4 rounded hover:bg-[#333] transition";
            div.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-[#333] overflow-hidden ring-2 ring-[#E50914]">
                        ${profile.avatar 
                            ? `<img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">` 
                            : `<div class="w-full h-full flex items-center justify-center text-[#E50914] font-bold text-lg">${profile.name.charAt(0)}</div>`
                        }
                    </div>
                    <div>
                        <h4 class="font-bold text-lg">${profile.name}</h4>
                        <p class="text-xs text-[#808080]">ID: ${profile.id}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="text-blue-400 hover:text-blue-300 text-xs px-3 py-2 rounded border border-blue-400 hover:bg-blue-500/10 edit-profile-btn" data-id="${profile.id}">Edit</button>
                    <button class="text-red-500 hover:text-red-400 text-xs px-3 py-2 rounded border border-red-500 hover:bg-red-500/10 delete-profile-btn" data-id="${profile.id}">×</button>
                </div>
            `;
            list.appendChild(div);
        });
    }
    
    if (!currentData.profiles || currentData.profiles.length === 0) {
        list.innerHTML = '<p class="text-center text-[#808080] py-4">No profiles yet</p>';
        return;
    }
    
    // Event delegation for profile buttons
    list.onclick = (e) => {
        const editBtn = e.target.closest('.edit-profile-btn');
        const deleteBtn = e.target.closest('.delete-profile-btn');
        
        if (editBtn) {
            editProfile(parseInt(editBtn.dataset.id));
        } else if (deleteBtn) {
            deleteProfile(parseInt(deleteBtn.dataset.id));
        }
    };
}

document.getElementById('add-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentData.profiles) currentData.profiles = [];
    
    const name = document.getElementById('profile-name').value.trim();
    const avatar = document.getElementById('profile-avatar').value.trim();
    
    // Generate new ID
    const maxId = currentData.profiles.reduce((max, p) => Math.max(max, p.id), 0);
    
    currentData.profiles.push({
        id: maxId + 1,
        name: name,
        avatar: avatar || `images/year_${name}.png`
    });
    
    saveData();
    e.target.reset();
    toast('Profile added!', 'success');
});

window.editProfile = (id) => {
    const profile = currentData.profiles.find(p => p.id === id);
    if (!profile) return;
    
    document.getElementById('edit-profile-prompt').classList.add('hidden');
    document.getElementById('edit-profile-form').classList.remove('hidden');
    
    document.getElementById('edit-profile-id').value = id;
    document.getElementById('edit-profile-name').value = profile.name;
    document.getElementById('edit-profile-avatar').value = profile.avatar || '';
};

window.cancelEditProfile = () => {
    document.getElementById('edit-profile-prompt').classList.remove('hidden');
    document.getElementById('edit-profile-form').classList.add('hidden');
    document.getElementById('edit-profile-form').reset();
};

document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('edit-profile-id').value);
    const profile = currentData.profiles.find(p => p.id === id);
    if (!profile) return;
    
    profile.name = document.getElementById('edit-profile-name').value.trim();
    profile.avatar = document.getElementById('edit-profile-avatar').value.trim();
    
    saveData();
    cancelEditProfile();
    toast('Profile updated!', 'success');
});

window.deleteProfile = (id) => {
    const profile = currentData.profiles.find(p => p.id === id);
    if (!profile) return;
    
    // Check if profile is used in any rows
    const usedInRows = currentData.rows.filter(r => r.profileIds && r.profileIds.includes(id));
    
    let msg = `Delete profile "${profile.name}"?`;
    if (usedInRows.length > 0) {
        msg += `\n\nThis profile is used in ${usedInRows.length} row(s). It will be removed from those rows.`;
    }
    
    if (!confirm(msg)) return;
    
    // Remove profile
    currentData.profiles = currentData.profiles.filter(p => p.id !== id);
    
    // Remove from rows
    currentData.rows.forEach(row => {
        if (row.profileIds) {
            row.profileIds = row.profileIds.filter(pid => pid !== id);
        }
    });
    
    saveData();
    toast('Profile deleted!', 'success');
};
