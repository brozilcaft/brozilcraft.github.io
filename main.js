/**
 * TechUrdu - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // ======== LOADER ========
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800); // Fake loading delay
    }

    // ======== THEME TOGGLE ========
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }

    // ======== MOBILE MENU ========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            hamburger.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // ======== PROGRESS BAR ========
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ======== SMOOTH SCROLL ========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ======== SCROLL ANIMATIONS ========
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // ======== NEWSLETTER FORM ========
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Shukriya! Aap newsletter me subscribe ho gaye hain.');
                emailInput.value = '';
            }
        });
    }

    // ======== SHARE BUTTONS ========
    const shareButtons = document.querySelectorAll('.share-btn');
    if (shareButtons.length > 0) {
        const currentUrl = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                let shareUrl = '';
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${title} ${currentUrl}`;
                        break;
                }
                
                if(shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    // ======== INDEX PAGE LOGIC (Search, Filter, Render) ========
    const blogContainer = document.getElementById('blog-grid');
    if (blogContainer && typeof blogPosts !== 'undefined') {
        
        // Render Function
        function renderPosts(postsToRender) {
            blogContainer.innerHTML = '';
            if(postsToRender.length === 0) {
                blogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Koi post nahi mili.</p>';
                return;
            }

            postsToRender.forEach(post => {
                const card = document.createElement('article');
                card.className = 'blog-card animate-on-scroll';
                
                // Assuming URL param logic for post page
                const postUrl = `post.html?id=${post.id}`;
                
                card.innerHTML = `
                    <a href="${postUrl}">
                        <img src="${post.image}" alt="${post.title}" class="card-img">
                    </a>
                    <div class="card-content">
                        <span class="badge">${post.category}</span>
                        <h2 class="card-title"><a href="${postUrl}">${post.title}</a></h2>
                        <p class="card-excerpt">${post.excerpt}</p>
                        <div class="card-meta">
                            <div class="author-info">
                                <img src="${post.authorImage || 'https://via.placeholder.com/30'}" alt="${post.author}" class="author-avatar">
                                <span>${post.author}</span>
                            </div>
                            <div class="date-info">
                                <span>${post.date}</span> • <span>${post.readTime}</span>
                            </div>
                        </div>
                    </div>
                `;
                blogContainer.appendChild(card);
                observer.observe(card); // Re-apply scroll animation
            });
        }

        // Initial Render
        renderPosts(blogPosts);

        // Search Logic
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = blogPosts.filter(post => 
                    post.title.toLowerCase().includes(term) || 
                    post.excerpt.toLowerCase().includes(term)
                );
                renderPosts(filtered);
                
                // Reset category filters
                document.querySelectorAll('.cat-pill').forEach(pill => pill.classList.remove('active'));
                const allPill = document.querySelector('.cat-pill[data-category="All"]');
                if(allPill) allPill.classList.add('active');
            });
        }

        // Category Filter Logic
        const categoryPills = document.querySelectorAll('.cat-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active class
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Clear search
                if(searchInput) searchInput.value = '';

                const category = pill.getAttribute('data-category');
                if (category === 'All') {
                    renderPosts(blogPosts);
                } else {
                    const filtered = blogPosts.filter(post => post.category === category);
                    renderPosts(filtered);
                }
            });
        });
    }

    // ======== POST PAGE LOGIC ========
    const postContainer = document.getElementById('post-content-container');
    if (postContainer && window.location.pathname.includes('post.html') && typeof blogPosts !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        const post = blogPosts.find(p => p.id == postId);
        
        if (post) {
            document.title = `${post.title} | TechUrdu`;
            
            const headerHTML = `
                <div class="badge">${post.category}</div>
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta-large">
                    <div class="author-info">
                        <img src="${post.authorImage || 'https://via.placeholder.com/30'}" alt="${post.author}" class="author-avatar">
                        <span>${post.author}</span>
                    </div>
                    <div class="date-info">
                        <i class="far fa-calendar"></i> ${post.date}
                    </div>
                    <div class="read-info">
                        <i class="far fa-clock"></i> ${post.readTime}
                    </div>
                </div>
            `;
            document.getElementById('post-header-content').innerHTML = headerHTML;
            
            if (post.image) {
                document.getElementById('post-main-image').src = post.image;
                document.getElementById('post-main-image').alt = post.title;
            }
            
            postContainer.innerHTML = post.content || '<p>Post content not available.</p>';
        } else {
            postContainer.innerHTML = '<h2>Post nahi mili. Ya to delete ho gayi hai ya URL galat hai.</h2><a href="index.html" class="btn-primary">Back to Home</a>';
        }
    }
});
