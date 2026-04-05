const API_URL = '/api/content';

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
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

// Hide loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Show loader
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;

    // 1. Fetch Data
    let data;
    try {
        const res = await fetch(API_URL);
        data = await res.json();
    } catch (e) {
        console.error("Failed to fetch content", e);
        hideLoader();
        return;
    }

    // Hide loader after data is loaded
    setTimeout(hideLoader, 300);

    // 2. Handle Profile Gate (index.html)
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        const profileList = document.getElementById('profile-list');
        const profileGate = document.getElementById('profile-gate');
        
        // Show profile gate with animation
        setTimeout(() => {
            if (profileGate) profileGate.style.opacity = '1';
        }, 100);

        function renderProfiles() {
            if (!profileList) return;
            profileList.innerHTML = '';

            data.profiles.forEach(profile => {
                const div = document.createElement('div');
                div.className = 'profile-card group cursor-pointer flex flex-col items-center gap-3';
                div.onclick = () => {
                    localStorage.setItem('activeProfile', JSON.stringify(profile));
                    window.location.href = 'browse.html';
                };

                div.innerHTML = `
                    <div class="w-[10vw] min-w-[84px] max-w-[160px] aspect-square rounded overflow-hidden
                                ring-2 ring-transparent group-hover:ring-white transition-all duration-200">
                        <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-full object-cover">
                    </div>
                    <span class="text-[#808080] group-hover:text-white text-sm md:text-lg font-medium transition-colors">
                        ${profile.name}
                    </span>
                `;
                profileList.appendChild(div);
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
        const mobileNavAvatar = document.getElementById('mobile-nav-avatar');
        if (navAvatar) navAvatar.src = activeProfile.avatar;
        if (mobileNavAvatar) mobileNavAvatar.src = activeProfile.avatar;

        // Navbar Profile Dropdown
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown && data.profiles) {
            dropdown.innerHTML = '<div class="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>';

            // Manage Profiles link
            const manageLink = document.createElement('a');
            manageLink.href = "index.html";
            manageLink.className = "block px-4 py-2 text-sm text-[#B3B3B3] hover:text-white hover:underline";
            manageLink.innerHTML = "Manage Profiles";
            dropdown.appendChild(manageLink);

            // Other profiles
            data.profiles.forEach(p => {
                if (p.id !== activeProfile.id) {
                    const a = document.createElement('a');
                    a.href = "#";
                    a.className = "flex items-center gap-3 px-4 py-2 hover:bg-[#333]";
                    a.innerHTML = `<img src="${p.avatar}" class="w-7 h-7 rounded"> <span class="text-sm">${p.name}</span>`;
                    a.onclick = () => {
                        localStorage.setItem('activeProfile', JSON.stringify(p));
                        location.reload();
                    };
                    dropdown.appendChild(a);
                }
            });

            // Divider and Sign out
            const signOut = document.createElement('a');
            signOut.href = "index.html";
            signOut.className = "block px-4 py-2 mt-2 border-t border-gray-700 text-sm hover:underline";
            signOut.innerText = "Sign out of MANVIR";
            signOut.onclick = () => localStorage.removeItem('activeProfile');
            dropdown.appendChild(signOut);
        }

        // Populate Rows & Slideshow Data
        const rowsContainer = document.getElementById('rows-container');
        let possibleHeroItems = [];
        let allProjects = [];

        if (rowsContainer && data.rows) {
            const filteredRows = data.rows.filter(row => !row.profileIds || row.profileIds.includes(activeProfile.id));

            filteredRows.forEach((row, rowIndex) => {
                possibleHeroItems = [...possibleHeroItems, ...row.items];
                allProjects = [...allProjects, ...row.items];

                const isTop10 = row.style === 'top10';
                const rowSection = document.createElement('section');
                rowSection.className = 'row-section mb-6 group px-4 md:px-[60px]';

                let cardsHtml = '';
                row.items.forEach((item, index) => {
                    const githubBadge = item.githubUrl && item.githubUrl !== '#'
                        ? `<a href="${item.githubUrl}" target="_blank" class="absolute top-2 right-2 bg-black/80 p-1.5 rounded-full hover:bg-[#E50914] transition z-20 opacity-0 group-hover/card:opacity-100" title="View Code" onclick="event.stopPropagation()">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                           </a>`
                        : '';

                    // Build badges HTML
                    let badgesHtml = '';
                    if (item.status) {
                        const statusClass = item.status.toLowerCase() === 'live' ? 'badge-live' 
                            : item.status.toLowerCase().includes('dev') ? 'badge-indev' : 'badge-archived';
                        badgesHtml += `<span class="badge ${statusClass}">${item.status}</span>`;
                    }
                    if (item.difficulty) {
                        const diffClass = item.difficulty.toLowerCase() === 'beginner' ? 'badge-beginner'
                            : item.difficulty.toLowerCase() === 'intermediate' ? 'badge-intermediate' : 'badge-advanced';
                        badgesHtml += `<span class="badge ${diffClass}">${item.difficulty}</span>`;
                    }
                    if (item.year) {
                        badgesHtml += `<span class="badge badge-year">${item.year}</span>`;
                    }

                    // Tech pills (first 3)
                    let techPillsHtml = '';
                    if (item.technologies && item.technologies.length > 0) {
                        techPillsHtml = item.technologies.slice(0, 3).map(t => 
                            `<span class="text-xs bg-[#333] px-2 py-0.5 rounded">${t}</span>`
                        ).join('');
                    }

                    // Top 10 number
                    const top10Number = isTop10 ? `<span class="top10-number">${index + 1}</span>` : '';

                    cardsHtml += `
                        <div class="project-card group/card relative flex-shrink-0 ${isTop10 ? 'min-w-[320px]' : 'min-w-[200px] md:min-w-[280px]'} cursor-pointer mr-1" 
                             data-id="${item.id}" style="transform-origin: center center;">
                            ${top10Number}
                            <div class="relative ${isTop10 ? 'ml-[60px]' : ''} h-[112px] md:h-[157px] bg-[#181818] rounded overflow-hidden">
                                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-all duration-300">
                                ${githubBadge}
                            </div>
                            <!-- Hover Panel -->
                            <div class="card-hover-panel absolute left-0 right-0 ${isTop10 ? 'ml-[60px]' : ''} bg-[#181818] rounded-b p-3 shadow-xl">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex gap-2">
                                        <button class="card-action-btn primary" onclick="event.stopPropagation(); window.showProjectDetails(${item.id});" title="View">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </button>
                                        <button class="card-action-btn" title="Like">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                                        </button>
                                    </div>
                                    <button class="card-action-btn" onclick="event.stopPropagation(); window.showProjectDetails(${item.id});" title="More Info">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                    </button>
                                </div>
                                ${badgesHtml ? `<div class="flex flex-wrap gap-1 mb-2">${badgesHtml}</div>` : ''}
                                <h3 class="text-sm font-semibold mb-1 truncate">${item.title}</h3>
                                ${item.shortDesc ? `<p class="text-xs text-[#B3B3B3] line-clamp-2 mb-2">${item.shortDesc}</p>` : ''}
                                ${techPillsHtml ? `<div class="flex flex-wrap gap-1">${techPillsHtml}</div>` : ''}
                            </div>
                        </div>
                    `;
                });

                rowSection.innerHTML = `
                    <div class="flex items-baseline gap-4 mb-3">
                        <h2 class="row-title text-[1.05rem] font-semibold text-[#808080]">${row.title}</h2>
                        <span class="text-xs text-[#808080] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-white">Explore All ›</span>
                    </div>
                    <div class="row-track flex gap-1 overflow-x-auto pb-[80px] -mb-[60px] no-scrollbar scroll-smooth">
                        ${cardsHtml}
                    </div>
                `;
                rowsContainer.appendChild(rowSection);
            });

            // Initialize card hover with delay
            initCardHover();

            // Slideshow Function
            startSlideshow(possibleHeroItems, data);
        }

        // Initialize Search
        initSearch(allProjects);

        // Navbar Scroll Effect
        initNavbarScroll();

        // Footer Socials
        renderFooter(data);

        // Modal Setup
        setupModal(data);
    }

    // 4. Handle Skills Page
    if (path.endsWith('skills.html')) {
        const skillsGrid = document.getElementById('skills-grid');
        const topSkillsRow = document.getElementById('top-skills-row');
        const navAvatar = document.getElementById('nav-avatar');
        const mobileNavAvatar = document.getElementById('mobile-nav-avatar');
        const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
        if (navAvatar && activeProfile) navAvatar.src = activeProfile.avatar;
        if (mobileNavAvatar && activeProfile) mobileNavAvatar.src = activeProfile.avatar;

        if (data.skills) {
            // Top 10 Skills
            const sortedSkills = [...data.skills].sort((a, b) => b.level - a.level);
            const topSkills = sortedSkills.slice(0, 10);
            
            if (topSkillsRow) {
                const topSkillsContainer = topSkillsRow.querySelector('div:last-child');
                if (topSkillsContainer) {
                    topSkills.forEach((skill, index) => {
                        const card = document.createElement('div');
                        card.className = 'skill-card relative flex-shrink-0';
                        card.innerHTML = `
                            <span class="top-skill-number">${index + 1}</span>
                            <div class="relative z-10 ml-8">
                                <div class="text-lg font-semibold mb-2">${skill.name}</div>
                                <div class="skill-bar-track mb-1">
                                    <div class="skill-bar-fill" style="width: 0%" data-level="${skill.level}"></div>
                                </div>
                                <div class="text-sm text-[#B3B3B3]">${skill.level}%</div>
                            </div>
                        `;
                        topSkillsContainer.appendChild(card);
                    });
                }
            }

            // Group by category
            const categories = {};
            data.skills.forEach(skill => {
                if (!categories[skill.category]) categories[skill.category] = [];
                categories[skill.category].push(skill);
            });

            if (skillsGrid) {
                for (const [category, skills] of Object.entries(categories)) {
                    const section = document.createElement('div');
                    section.className = 'skill-row';

                    let skillCardsHtml = '';
                    skills.forEach(skill => {
                        skillCardsHtml += `
                            <div class="skill-card flex-shrink-0">
                                <div class="text-lg font-semibold mb-3">${skill.name}</div>
                                <div class="skill-bar-track mb-2">
                                    <div class="skill-bar-fill" style="width: 0%" data-level="${skill.level}"></div>
                                </div>
                                <div class="text-sm text-[#B3B3B3]">${skill.level}%</div>
                            </div>
                        `;
                    });

                    section.innerHTML = `
                        <h2 class="row-title text-[1.05rem] font-semibold text-[#808080] mb-4 uppercase tracking-wide">${category}</h2>
                        <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            ${skillCardsHtml}
                        </div>
                    `;
                    skillsGrid.appendChild(section);
                }
            }

            // Animate skill bars
            setTimeout(() => {
                document.querySelectorAll('[data-level]').forEach(el => {
                    el.style.width = el.getAttribute('data-level') + '%';
                });
            }, 300);
        }
    }

    // 5. Handle About Page
    if (path.endsWith('about.html')) {
        const navAvatar = document.getElementById('nav-avatar');
        const mobileNavAvatar = document.getElementById('mobile-nav-avatar');
        const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
        if (navAvatar && activeProfile) navAvatar.src = activeProfile.avatar;
        if (mobileNavAvatar && activeProfile) mobileNavAvatar.src = activeProfile.avatar;

        if (data.about) {
            document.getElementById('about-intro').innerText = data.about.intro;

            // Profile Picture
            const aboutProfilePic = document.getElementById('about-profile-pic');
            const aboutNoProfile = document.getElementById('about-no-profile');
            if (aboutProfilePic && data.about.profilePicture) {
                aboutProfilePic.src = data.about.profilePicture;
                aboutProfilePic.classList.remove('hidden');
                if (aboutNoProfile) aboutNoProfile.classList.add('hidden');
            }

            // Socials
            const socialContainer = document.getElementById('social-links');
            const icons = {
                "GitHub": `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
                "LinkedIn": `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
                "Twitter": `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
                "Instagram": `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
                "YouTube": `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>`,
                "Email": `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
                "Website": `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`
            };

            if (socialContainer && data.about.socials) {
                data.about.socials.forEach(social => {
                    const icon = icons[social.platform] || `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`;
                    const link = document.createElement('a');
                    link.href = social.url;
                    link.target = "_blank";
                    link.className = "social-btn";
                    link.innerHTML = `${icon}<span>${social.platform}</span>`;
                    socialContainer.appendChild(link);
                });
            }

            // Footer Socials
            const footerSocials = document.getElementById('footer-socials');
            if (footerSocials && data.about.socials) {
                footerSocials.innerHTML = '';
                data.about.socials.forEach(social => {
                    const icon = icons[social.platform] || `<span class="text-sm">${social.platform}</span>`;
                    const link = document.createElement('a');
                    link.href = social.url;
                    link.target = "_blank";
                    link.className = "text-[#808080] hover:text-white transition transform hover:scale-110";
                    link.innerHTML = icon;
                    footerSocials.appendChild(link);
                });
            }

            // Resume Buttons
            const resumeContainer = document.getElementById('resume-container');
            if (resumeContainer && data.resumeUrl) {
                resumeContainer.classList.remove('hidden');
                resumeContainer.innerHTML = `
                    <a href="${data.resumeUrl}" target="_blank" class="resume-btn primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        View Resume
                    </a>
                    <a href="${data.resumeUrl}" download class="resume-btn secondary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download
                    </a>
                `;
            }

            // Timeline (Episode Style)
            const timelineContainer = document.getElementById('timeline-container');
            if (timelineContainer) {
                const timeline = data.about.timeline || [];
                // Sort by year descending
                timeline.sort((a, b) => parseInt(b.year) - parseInt(a.year));
                
                timeline.forEach((item, index) => {
                    const episodeNum = timeline.length - index;
                    const div = document.createElement('div');
                    div.className = 'episode-item';
                    div.innerHTML = `
                        <div class="episode-label">S01E${String(episodeNum).padStart(2, '0')} · ${item.year}</div>
                        <h3 class="episode-title">${item.title}</h3>
                        <p class="episode-desc">${item.desc}</p>
                    `;
                    timelineContainer.appendChild(div);
                });
            }
        }
    }
});

// ===== HELPER FUNCTIONS =====

function initCardHover() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                // Smart edge detection
                const rowTrack = card.closest('.row-track');
                if (rowTrack) {
                    const cardRect = card.getBoundingClientRect();
                    const trackRect = rowTrack.getBoundingClientRect();
                    
                    if (cardRect.left - trackRect.left < 80) {
                        card.style.transformOrigin = 'left center';
                    } else if (trackRect.right - cardRect.right < 80) {
                        card.style.transformOrigin = 'right center';
                    } else {
                        card.style.transformOrigin = 'center center';
                    }
                }
                card.classList.add('hovered');
            }, 280);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            card.classList.remove('hovered');
        });

        // Click to open modal
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const projectId = parseInt(card.getAttribute('data-id'));
                window.showProjectDetails(projectId);
            }
        });
    });
}

function startSlideshow(items, data) {
    if (items.length === 0) return;
    
    let currentIndex = 0;
    let currentHeroProjectId = null;

    const updateHero = () => {
        const item = items[currentIndex];
        currentHeroProjectId = item.id;
        
        const heroImage = document.getElementById('hero-image');
        const heroTitle = document.getElementById('hero-title');
        const heroDesc = document.getElementById('hero-desc');
        const heroLink = document.getElementById('hero-link');
        
        // Badges
        const badgeStatus = document.getElementById('hero-badge-status');
        const badgeDifficulty = document.getElementById('hero-badge-difficulty');
        const badgeYear = document.getElementById('hero-badge-year');

        // Fade out
        if (heroImage) heroImage.style.opacity = '0.3';

        setTimeout(() => {
            if (heroImage) heroImage.src = item.bannerImage || item.image;
            if (heroTitle) heroTitle.innerText = item.title;
            if (heroDesc) heroDesc.innerText = item.shortDesc || item.description?.substring(0, 140) + '...' || `Featured project from your timeline.`;

            // Update link
            if (heroLink && item.liveUrl) {
                heroLink.href = item.liveUrl;
            } else if (heroLink && item.githubUrl) {
                heroLink.href = item.githubUrl;
            }

            // Update badges
            if (badgeStatus) {
                if (item.status) {
                    badgeStatus.textContent = item.status;
                    badgeStatus.className = `badge ${item.status.toLowerCase() === 'live' ? 'badge-live' : item.status.toLowerCase().includes('dev') ? 'badge-indev' : 'badge-archived'}`;
                    badgeStatus.classList.remove('hidden');
                } else {
                    badgeStatus.classList.add('hidden');
                }
            }
            if (badgeDifficulty) {
                if (item.difficulty) {
                    badgeDifficulty.textContent = item.difficulty;
                    badgeDifficulty.className = `badge ${item.difficulty.toLowerCase() === 'beginner' ? 'badge-beginner' : item.difficulty.toLowerCase() === 'intermediate' ? 'badge-intermediate' : 'badge-advanced'}`;
                    badgeDifficulty.classList.remove('hidden');
                } else {
                    badgeDifficulty.classList.add('hidden');
                }
            }
            if (badgeYear) {
                if (item.year) {
                    badgeYear.textContent = item.year;
                    badgeYear.classList.remove('hidden');
                } else {
                    badgeYear.classList.add('hidden');
                }
            }

            // Update GitHub button
            const heroButtons = document.querySelector('#hero-link')?.parentElement;
            const existingGithub = document.getElementById('hero-github');
            if (existingGithub) existingGithub.remove();

            if (heroButtons && item.githubUrl && item.githubUrl !== '#' && item.githubUrl.trim() !== '') {
                const btn = document.createElement('a');
                btn.id = 'hero-github';
                btn.href = item.githubUrl;
                btn.target = "_blank";
                btn.className = "flex items-center gap-2 bg-[rgba(40,40,40,0.9)] text-white px-6 py-2.5 rounded font-semibold hover:bg-[rgba(60,60,60,0.9)] transition text-base";
                btn.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub`;
                heroButtons.appendChild(btn);
            }

            // Fade in
            if (heroImage) heroImage.style.opacity = '1';
        }, 400);

        currentIndex = (currentIndex + 1) % items.length;
    };

    // Initial run
    updateHero();

    // Interval
    setInterval(updateHero, 6000);

    // More Info button
    const moreInfoBtn = document.getElementById('hero-more-info-btn');
    if (moreInfoBtn) {
        moreInfoBtn.addEventListener('click', () => {
            if (currentHeroProjectId) {
                window.showProjectDetails(currentHeroProjectId);
            }
        });
    }
}

function initSearch(allProjects) {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchResultsGrid = document.getElementById('search-results-grid');

    if (!searchBtn || !searchInput) return;

    searchBtn.addEventListener('click', () => {
        searchInput.classList.toggle('expanded');
        if (searchInput.classList.contains('expanded')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            if (searchResults) searchResults.classList.remove('active');
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            if (searchResults) searchResults.classList.remove('active');
            return;
        }

        const filtered = allProjects.filter(p => 
            p.title.toLowerCase().includes(query) ||
            (p.technologies && p.technologies.some(t => t.toLowerCase().includes(query))) ||
            (p.description && p.description.toLowerCase().includes(query))
        );

        if (searchResultsGrid) {
            searchResultsGrid.innerHTML = filtered.map(p => `
                <div class="cursor-pointer group" onclick="window.showProjectDetails(${p.id}); document.getElementById('search-results').classList.remove('active'); document.getElementById('search-input').value = ''; document.getElementById('search-input').classList.remove('expanded');">
                    <img src="${p.image}" alt="${p.title}" class="w-full aspect-video object-cover rounded mb-2 group-hover:ring-2 ring-white transition">
                    <h3 class="text-sm font-semibold truncate">${p.title}</h3>
                </div>
            `).join('') || '<p class="col-span-full text-center text-[#808080]">No projects found.</p>';
        }

        if (searchResults) searchResults.classList.add('active');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.classList.remove('expanded');
            if (searchResults) searchResults.classList.remove('active');
        }
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = '#141414';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent 100%)';
        }
    });
}

function renderFooter(data) {
    const footer = document.querySelector('footer');
    if (!footer || !data.about || !data.about.socials) return;

    const icons = {
        "GitHub": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
        "LinkedIn": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
        "Twitter": `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`
    };

    let socialHtml = '<div class="flex gap-6 mb-4 justify-center">';
    data.about.socials.forEach(s => {
        const icon = icons[s.platform] || `<span class="text-sm">${s.platform}</span>`;
        socialHtml += `<a href="${s.url}" target="_blank" class="text-[#808080] hover:text-white transition transform hover:scale-110">${icon}</a>`;
    });
    socialHtml += '</div><p>&copy; 2026 Manvir Singh. All Rights Reserved.</p>';
    footer.innerHTML = `<div class="flex flex-col gap-4 text-center">${socialHtml}</div>`;
}

function setupModal(data) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalContent = document.getElementById('modal-content');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');

    if (!modal) return;

    function findProjectById(id) {
        for (const row of data.rows) {
            const project = row.items.find(item => item.id === id);
            if (project) return project;
        }
        return null;
    }

    function openModal(projectId) {
        const project = findProjectById(projectId);
        if (!project) return;

        // Build badges HTML
        let badgesHtml = '';
        if (project.status) {
            const statusClass = project.status.toLowerCase() === 'live' ? 'badge-live' 
                : project.status.toLowerCase().includes('dev') ? 'badge-indev' : 'badge-archived';
            badgesHtml += `<span class="badge ${statusClass}">${project.status}</span>`;
        }
        if (project.difficulty) {
            const diffClass = project.difficulty.toLowerCase() === 'beginner' ? 'badge-beginner'
                : project.difficulty.toLowerCase() === 'intermediate' ? 'badge-intermediate' : 'badge-advanced';
            badgesHtml += `<span class="badge ${diffClass}">${project.difficulty}</span>`;
        }
        if (project.year) {
            badgesHtml += `<span class="badge badge-year">${project.year}</span>`;
        }

        const techHtml = (project.technologies || [])
            .map(t => `<span class="bg-[#E50914] px-3 py-1 rounded-full text-xs font-medium">${t}</span>`).join('');

        const useCasesHtml = (project.useCases || [])
            .map(u => `<li class="text-[#B3B3B3]">${u}</li>`).join('');

        const contribHtml = (project.contributors || [])
            .map(c => `
                <a href="${c.githubUrl}" target="_blank" class="flex items-center gap-2 hover:text-white transition">
                    <img src="${c.avatar}" class="w-8 h-8 rounded-full">
                    <span class="text-sm">${c.name}</span>
                </a>
            `).join('');

        const recommendationsHtml = (project.recommendations || []).length > 0 ? `
            <div class="border-t border-gray-700 pt-6 mt-6">
                <h3 class="text-lg md:text-xl font-bold mb-4">More Like This</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    ${project.recommendations.map(recId => {
                        const recProject = findProjectById(recId);
                        if (!recProject) return '';
                        return `
                            <div class="cursor-pointer hover:scale-105 transition group" onclick="window.showProjectDetails(${recId})">
                                <img src="${recProject.image}" class="w-full h-24 md:h-32 object-cover rounded mb-2 group-hover:ring-2 ring-white">
                                <h4 class="text-xs md:text-sm font-semibold truncate">${recProject.title}</h4>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : '';

        modalBody.innerHTML = `
            <div class="relative">
                <img src="${project.bannerImage || project.image}" class="w-full h-48 md:h-64 lg:h-96 object-cover rounded-t-lg">
                <div class="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
            </div>
            <div class="p-4 md:p-8 -mt-20 relative">
                <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3" style="font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px;">${project.title}</h2>
                
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="text-[#46d369] font-semibold">98% Match</span>
                    ${badgesHtml}
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="bg-white text-black font-semibold px-5 md:px-6 py-2.5 rounded hover:bg-gray-200 transition text-center text-sm md:text-base flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Live Demo
                    </a>` : ''}
                    ${project.githubUrl && project.githubUrl !== '#' ? `<a href="${project.githubUrl}" target="_blank" class="bg-[rgba(40,40,40,0.9)] text-white font-semibold px-5 md:px-6 py-2.5 rounded hover:bg-[rgba(60,60,60,0.9)] transition flex items-center justify-center gap-2 text-sm md:text-base">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>` : ''}
                </div>

                <p class="text-base md:text-lg text-[#B3B3B3] mb-6 leading-relaxed">${project.description || 'No description available.'}</p>

                ${techHtml ? `
                <div class="mb-6">
                    <h3 class="text-lg md:text-xl font-bold mb-3">Technologies</h3>
                    <div class="flex flex-wrap gap-2">${techHtml}</div>
                </div>
                ` : ''}

                ${project.useCases ? `
                    <div class="mb-6">
                        <h3 class="text-lg md:text-xl font-bold mb-3">Use Cases</h3>
                        <ul class="list-disc list-inside space-y-1 text-sm md:text-base">${useCasesHtml}</ul>
                    </div>
                ` : ''}

                ${project.futureScope ? `
                    <div class="mb-6">
                        <h3 class="text-lg md:text-xl font-bold mb-3">Future Scope</h3>
                        <p class="text-[#B3B3B3] text-sm md:text-base">${project.futureScope}</p>
                    </div>
                ` : ''}

                ${project.contributors && project.contributors.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-lg md:text-xl font-bold mb-3">Contributors</h3>
                        <div class="flex flex-wrap gap-3 md:gap-4 text-[#808080]">${contribHtml}</div>
                    </div>
                ` : ''}

                ${recommendationsHtml}
            </div>
        `;

        // Show modal
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

    // Global function
    window.showProjectDetails = (id) => openModal(id);

    // Event listeners
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    const mobileAvatar = document.getElementById('mobile-nav-avatar');

    if (!menuBtn || !menu) return;

    // Set avatar from localStorage
    const activeProfile = JSON.parse(localStorage.getItem('activeProfile'));
    if (activeProfile && mobileAvatar) {
        mobileAvatar.src = activeProfile.avatar;
    }

    menuBtn.addEventListener('click', () => {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            document.body.style.overflow = '';
        });
    }

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            document.body.style.overflow = '';
        });
    });
}

// Initialize mobile menu on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});
