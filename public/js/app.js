const API_URL = '/api/content';

document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;

    // 1. Fetch Data
    let data;
    try {
        const res = await fetch(API_URL);
        data = await res.json();
    } catch (e) {
        console.error("Failed to fetch content", e);
        return;
    }

    // 2. Handle Profile Gate (index.html)
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        const profileList = document.getElementById('profile-list');
        const manageToggle = document.getElementById('manage-toggle');
        const addProfileBtn = document.getElementById('add-profile-btn');
        let isManageMode = false;

        function renderProfiles() {
            Array.from(profileList.children).forEach(child => {
                if (child.id !== 'add-profile-btn') child.remove();
            });

            data.profiles.forEach(profile => {
                const div = document.createElement('div');
                div.className = 'group flex flex-col items-center gap-2 cursor-pointer w-24 md:w-32 hover:text-white text-gray-500 transition-colors relative';
                div.onclick = (e) => {
                    if (isManageMode) {
                        if (confirm(`Delete profile "${profile.name}"?`)) {
                            deleteProfile(profile.id);
                        }
                    } else {
                        localStorage.setItem('activeProfile', JSON.stringify(profile));
                        window.location.href = 'browse.html';
                    }
                };

                const overlay = isManageMode ? `<div class="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none icon-overlay"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></div>` : '';

                div.innerHTML = `
                    <div class="w-24 h-24 md:w-32 md:h-32 rounded overflow-hidden border-2 border-transparent group-hover:border-white transition-all bg-[#141414] relative">
                        <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover">
                        ${overlay}
                    </div>
                    <span class="text-sm md:text-lg group-hover:font-medium">${profile.name}</span>
                `;
                profileList.insertBefore(div, addProfileBtn);
            });
        }

        if (manageToggle) {
            manageToggle.onclick = () => {
                isManageMode = !isManageMode;
                manageToggle.innerText = isManageMode ? "Done" : "Manage Profiles";
                manageToggle.classList.toggle('bg-white', isManageMode);
                manageToggle.classList.toggle('text-black', isManageMode);
                addProfileBtn.classList.toggle('hidden', !isManageMode);
                renderProfiles();
            };
        }

        window.addNewProfile = async () => {
            const name = prompt("Enter Name for new profile (e.g., 2026):");
            if (!name) return;
            const avatars = ["images/year_2023.png", "images/year_2024.png", "images/year_2025.png"];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

            data.profiles.push({
                id: Date.now(),
                name: name,
                avatar: randomAvatar
            });
            await updateData(data);
            renderProfiles();
        };

        async function deleteProfile(id) {
            data.profiles = data.profiles.filter(p => p.id !== id);
            await updateData(data);
            renderProfiles();
        }

        async function updateData(newData) {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
        }

        renderProfiles();
    }

    // 3. Handle Browse Page (browse.html)
    if (path.endsWith('browse.html')) {
        const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
        if (!activeProfile) {
            window.location.href = 'index.html';
            return;
        }

        const navAvatar = document.getElementById('nav-avatar');
        if (navAvatar) navAvatar.src = activeProfile.avatar;

        // Navbar Profile Switcher
        const dropdown = document.querySelector('.group .absolute');
        if (dropdown && data.profiles) {
            dropdown.innerHTML = '';

            // Add Manage Profiles Link
            const manageLink = document.createElement('a');
            manageLink.href = "index.html";
            manageLink.className = "block px-2 py-2 mb-2 text-sm text-gray-400 hover:text-white hover:underline";
            manageLink.innerHTML = "Manage Profiles";
            dropdown.appendChild(manageLink);

            data.profiles.forEach(p => {
                if (p.id !== activeProfile.id) {
                    const a = document.createElement('a');
                    a.href = "#";
                    a.className = "flex items-center gap-3 px-2 py-2 hover:underline";
                    a.innerHTML = `<img src="${p.avatar}" class="w-6 h-6 rounded"> ${p.name}`;
                    a.onclick = () => {
                        localStorage.setItem('activeProfile', JSON.stringify(p));
                        location.reload();
                    };
                    dropdown.appendChild(a);
                }
            });
            const signOut = document.createElement('a');
            signOut.href = "index.html";
            signOut.className = "block px-2 py-2 mt-2 border-t border-gray-700 hover:underline";
            signOut.innerText = "Sign out of Manvir Singh";
            signOut.onclick = () => localStorage.removeItem('activeProfile');
            dropdown.appendChild(signOut);
        }

        // Populate Rows & Slideshow Data
        const rowsContainer = document.getElementById('rows-container');
        let possibleHeroItems = [];

        if (rowsContainer && data.rows) {
            const filteredRows = data.rows.filter(row => !row.profileIds || row.profileIds.includes(activeProfile.id));

            filteredRows.forEach(row => {
                possibleHeroItems = [...possibleHeroItems, ...row.items];

                const rowSection = document.createElement('section');
                rowSection.className = 'mb-8 group pl-4 md:pl-12';

                let cardsHtml = '';
                row.items.forEach(item => {
                    const githubLink = item.githubUrl && item.githubUrl !== '#'
                        ? `<a href="${item.githubUrl}" target="_blank" class="absolute bottom-2 right-2 bg-black/80 p-1.5 rounded-full hover:bg-red-600 transition z-20" title="View Code" onclick="event.stopPropagation()"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>`
                        : '';

                    cardsHtml += `
                        <div class="relative min-w-[200px] h-[112px] md:min-w-[280px] md:h-[157px] bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform duration-300 origin-center z-10 hover:z-50 hover:shadow-lg group/card mr-2">
                             <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded group-hover/card:blur-sm transition-all duration-300">
                             <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center rounded p-2 text-center">
                                <h3 class="text-sm font-bold text-white mb-2">${item.title}</h3>
                                <button class="absolute bottom-2 left-2 bg-white/90 hover:bg-white p-2 rounded-full transition z-20" onclick="event.stopPropagation(); window.showProjectDetails(${item.id});">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/>
                                    </svg>
                                </button>
                                ${githubLink}
                             </div>
                        </div>
                    `;
                });

                rowSection.innerHTML = `
                    <h2 class="text-lg md:text-xl font-bold mb-3 md:mb-5 text-gray-200 group-hover:text-white transition">${row.title}</h2>
                    <div class="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-0">
                        ${cardsHtml}
                    </div>
                `;
                rowsContainer.appendChild(rowSection);
            });

            // Slideshow Function
            const startSlideshow = () => {
                if (possibleHeroItems.length === 0) return;
                let currentIndex = 0;
                let currentHeroProjectId = null;

                const updateHero = () => {
                    const item = possibleHeroItems[currentIndex];
                    currentHeroProjectId = item.id;
                    const bg = document.getElementById('hero-image');
                    const title = document.getElementById('hero-title');

                    // Fade out
                    bg.style.opacity = '0.5';

                    setTimeout(() => {
                        bg.src = item.image;
                        title.innerText = item.title;
                        document.getElementById('hero-desc').innerText = `Featured project from your ${activeProfile.name} timeline.`;

                        // Update GitHub button
                        const heroButtons = document.querySelector('#hero-link').parentElement;
                        const existingGithub = document.getElementById('hero-github');
                        if (existingGithub) existingGithub.remove();

                        if (item.githubUrl && item.githubUrl !== '#' && item.githubUrl.trim() !== '') {
                            const btn = document.createElement('a');
                            btn.id = 'hero-github';
                            btn.href = item.githubUrl;
                            btn.target = "_blank";
                            btn.className = "flex items-center gap-2 bg-[#333] text-white px-6 py-2 rounded font-bold hover:bg-[#555] transition";
                            btn.innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub`;
                            heroButtons.appendChild(btn);
                        }

                        // Fade in
                        bg.style.opacity = '1';
                    }, 300);

                    currentIndex = (currentIndex + 1) % possibleHeroItems.length;
                };

                // Initial run
                if (possibleHeroItems.length > 0) updateHero();

                // Interval
                setInterval(updateHero, 5000); // 5 Seconds

                // Add click handler to More Info button
                const moreInfoBtn = document.getElementById('hero-more-info-btn');
                if (moreInfoBtn) {
                    moreInfoBtn.addEventListener('click', () => {
                        if (currentHeroProjectId) {
                            console.log('Hero More Info clicked for project:', currentHeroProjectId);
                            window.showProjectDetails(currentHeroProjectId);
                        }
                    });
                }
            };

            startSlideshow();
        }

        // Navbar Scroll Effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('bg-black');
                    navbar.classList.remove('bg-gradient-to-b');
                } else {
                    navbar.classList.remove('bg-black');
                    navbar.classList.add('bg-gradient-to-b');
                }
            });
        }

        // Footer Socials
        const footer = document.querySelector('footer');
        if (footer && data.about && data.about.socials) {
            let socialHtml = '<div class="flex gap-6 mb-4 justify-center">';

            const icons = {
                "GitHub": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
                "LinkedIn": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
                "Twitter": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`
            };

            data.about.socials.forEach(s => {
                const icon = icons[s.platform] || `<span class="font-bold border border-gray-500 px-4 py-2 rounded-full hover:border-white hover:bg-white hover:text-black transition">${s.platform}</span>`;
                socialHtml += `<a href="${s.url}" class="text-gray-400 hover:text-white transition transform hover:scale-110" title="${s.platform}">${icon}</a>`;
            });
            socialHtml += '</div><p>&copy; 2026 Manvir Singh. All Rights Reserved.</p>';
            footer.innerHTML = `<div class="flex flex-col gap-4 text-center">${socialHtml}</div>`;
        }

        // Simple global function to show project details
        window.showProjectDetails = function (projectId) {
            console.log('showProjectDetails called with ID:', projectId);
            const project = findProjectById(projectId);
            if (!project) {
                console.error('Project not found:', projectId);
                alert('Project not found!');
                return;
            }
            openModal(projectId);
        };

        // Modal Functionality
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const modalContent = document.getElementById('modal-content');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalClose = document.getElementById('modal-close');

        if (!modal) {
            console.error('Modal element #project-modal not found!');
        } else {
            console.log('Modal initialized successfully');
        }

        function openModal(projectId) {
            console.log('openModal called with ID:', projectId);
            const project = findProjectById(projectId);
            if (!project) {
                console.error('Project not found for ID:', projectId);
                return;
            }
            console.log('Found project:', project.title);

            // Render modal content
            const contributorsHtml = project.contributors ? project.contributors.map(c => `
                <a href="${c.githubUrl}" target="_blank" class="flex items-center gap-2 hover:text-white transition">
                    <img src="${c.avatar}" class="w-8 h-8 rounded-full">
                    <span class="text-sm">${c.name}</span>
                </a>
            `).join('') : '';

            const techHtml = project.technologies ? project.technologies.map(t =>
                `<span class="bg-red-600 px-3 py-1 rounded-full text-xs">${t}</span>`
            ).join('') : '';

            const useCasesHtml = project.useCases ? project.useCases.map(uc =>
                `<li class="text-gray-300">${uc}</li>`
            ).join('') : '';

            const recommendationsHtml = project.recommendations ? `
                <div class="border-t border-gray-700 pt-6 mt-6">
                    <h3 class="text-lg md:text-xl font-bold mb-4">More Like This</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        ${project.recommendations.map(recId => {
                const recProject = findProjectById(recId);
                if (!recProject) return '';
                return `
                                <div class="cursor-pointer hover:scale-105 transition" onclick="window.showProjectDetails(${recId})">
                                    <img src="${recProject.image}" class="w-full h-24 md:h-32 object-cover rounded mb-2">
                                    <h4 class="text-xs md:text-sm font-bold">${recProject.title}</h4>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            ` : '';

            modalBody.innerHTML = `
                <img src="${project.image}" class="w-full h-48 md:h-64 lg:h-96 object-cover rounded-t-lg">
                <div class="p-4 md:p-8">
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">${project.title}</h2>
                    
                    <div class="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="bg-white text-black font-bold px-4 md:px-6 py-2 rounded hover:bg-gray-200 transition text-center text-sm md:text-base">Live Demo</a>` : ''}
                        ${project.githubUrl && project.githubUrl !== '#' ? `<a href="${project.githubUrl}" target="_blank" class="bg-[#333] text-white font-bold px-4 md:px-6 py-2 rounded hover:bg-[#444] transition flex items-center justify-center gap-2 text-sm md:text-base">
                            <svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                        </a>` : ''}
                    </div>

                    <p class="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">${project.description || 'No description available.'}</p>

                    <div class="mb-6">
                        <h3 class="text-lg md:text-xl font-bold mb-3">Technologies</h3>
                        <div class="flex flex-wrap gap-2">${techHtml || '<span class="text-gray-400 text-sm">No technologies listed</span>'}</div>
                    </div>

                    ${project.useCases ? `
                        <div class="mb-6">
                            <h3 class="text-lg md:text-xl font-bold mb-3">Use Cases</h3>
                            <ul class="list-disc list-inside space-y-1 text-sm md:text-base">${useCasesHtml}</ul>
                        </div>
                    ` : ''}

                    ${project.futureScope ? `
                        <div class="mb-6">
                            <h3 class="text-lg md:text-xl font-bold mb-3">Future Scope</h3>
                            <p class="text-gray-300 text-sm md:text-base">${project.futureScope}</p>
                        </div>
                    ` : ''}

                    ${project.contributors ? `
                        <div class="mb-6">
                            <h3 class="text-lg md:text-xl font-bold mb-3">Contributors</h3>
                            <div class="flex flex-wrap gap-3 md:gap-4 text-gray-400">${contributorsHtml}</div>
                        </div>
                    ` : ''}

                    ${recommendationsHtml}
                </div>
            `;

            // Show modal with animation
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
        }

        function closeModal() {
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        function findProjectById(id) {
            for (const row of data.rows) {
                const project = row.items.find(item => item.id === id);
                if (project) return project;
            }
            return null;
        }

        // Global function for recommendations
        window.openProjectModal = openModal;

        // Event Listeners
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.open-modal-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                const projectId = parseInt(btn.getAttribute('data-project-id'));
                console.log('Chevron clicked! Opening modal for project:', projectId);
                openModal(projectId);
                return false;
            }
        });

        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal();
            });
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeModal);
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // 4. Handle Skills Page
    if (path.endsWith('skills.html')) {
        const skillsGrid = document.getElementById('skills-grid');
        const navAvatar = document.getElementById('nav-avatar');
        const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
        if (navAvatar && activeProfile) navAvatar.src = activeProfile.avatar;

        if (skillsGrid && data.skills) {
            const categories = {};
            data.skills.forEach(skill => {
                if (!categories[skill.category]) categories[skill.category] = [];
                categories[skill.category].push(skill);
            });

            for (const [category, skills] of Object.entries(categories)) {
                const section = document.createElement('div');
                section.className = "bg-gray-900/50 p-6 rounded-lg border border-gray-800";

                let skillsHtml = '';
                skills.forEach(skill => {
                    skillsHtml += `
                        <div class="mb-6 last:mb-0">
                            <div class="flex justify-between mb-2 text-sm font-medium">
                                <span>${skill.name}</span>
                                <span class="text-gray-400">${skill.level}%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div class="bg-red-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style="width: 0%" data-width="${skill.level}%"></div>
                            </div>
                        </div>
                    `;
                });

                section.innerHTML = `
                    <h2 class="text-2xl font-bold mb-6 text-gray-200">${category}</h2>
                    ${skillsHtml}
                `;
                skillsGrid.appendChild(section);
            }

            setTimeout(() => {
                document.querySelectorAll('[data-width]').forEach(el => {
                    el.style.width = el.getAttribute('data-width');
                });
            }, 100);
        }
    }

    // 5. Handle About Page
    if (path.endsWith('about.html')) {
        const navAvatar = document.getElementById('nav-avatar');
        const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
        if (navAvatar && activeProfile) navAvatar.src = activeProfile.avatar;

        if (data.about) {
            document.getElementById('about-intro').innerText = data.about.intro;

            // Socials
            const socialContainer = document.getElementById('social-links');
            const icons = {
                "GitHub": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
                "LinkedIn": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
                "Twitter": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`
            };

            data.about.socials.forEach(social => {
                const icon = icons[social.platform] || `<span class="font-bold border border-gray-500 px-4 py-2 rounded-full hover:border-white hover:bg-white hover:text-black transition">${social.platform}</span>`;
                const link = document.createElement('a');
                link.href = social.url;
                link.className = "text-gray-400 hover:text-white transition transform hover:scale-110";
                link.innerHTML = icon;
                socialContainer.appendChild(link);
            });

            // Resume Buttons
            const resumeContainer = document.getElementById('resume-container');
            if (resumeContainer && data.resumeUrl) {
                resumeContainer.classList.remove('hidden');
                resumeContainer.innerHTML = `
                    <a href="${data.resumeUrl}" target="_blank" class="bg-white text-black font-bold px-8 py-4 rounded hover:bg-gray-200 transition flex items-center gap-2 shadow-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        View Resume
                    </a>
                    <a href="${data.resumeUrl}" download class="bg-red-600 text-white font-bold px-8 py-4 rounded hover:bg-red-700 transition flex items-center gap-2 shadow-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download Resume
                    </a>
                `;
            }

            // Timeline
            const timelineContainer = document.getElementById('timeline-container');
            data.about.timeline.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = "relative pl-8 md:pl-12 pb-8 last:pb-0";
                div.innerHTML = `
                    <div class="absolute left-[-5px] top-2 w-3 h-3 bg-red-600 rounded-full border-4 border-[#141414]"></div>
                    <div class="mb-1 text-sm text-red-500 font-bold">${item.year}</div>
                    <h3 class="text-xl font-bold text-white mb-2">${item.title}</h3>
                    <p class="text-gray-400 leading-relaxed">${item.desc}</p>
                `;
                timelineContainer.appendChild(div);
            });
        }
    }
});
