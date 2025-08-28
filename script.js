// Global Variables
let currentAudio = null;
let isScrolling = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeIntersectionObserver();
});

// GSAP Animations
function initializeAnimations() {
    // Hero animations
    gsap.timeline()
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3
        })
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1
        }, '-=0.7')
        .to('.cta-button', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1
        }, '-=0.7');

    // Animate cards on scroll
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.news-card').forEach((card, index) => {
        gsap.fromTo(card, {
            opacity: 0,
            y: 50,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate sidebar cards
    gsap.utils.toArray('.sidebar-card').forEach((card, index) => {
        gsap.fromTo(card, {
            opacity: 0,
            x: 50
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.2,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && mobileToggle && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when nav link is clicked
    if (navLinks) {
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    if (mobileToggle && navLinks) {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animate menu items
        if (navLinks.classList.contains('active')) {
            const menuItems = document.querySelectorAll('.nav-links li');
            if (menuItems.length > 0) {
                anime({
                    targets: menuItems,
                    translateY: [30, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(100),
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
        }
    }
}

function closeMobileMenu() {
    if (mobileToggle && navLinks) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Navbar scroll effect
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Parallax effect for hero
                const hero = document.getElementById('hero');
                if (hero && scrollTop < window.innerHeight) {
                    const parallaxSpeed = scrollTop * 0.5;
                    hero.style.transform = `translateY(${parallaxSpeed}px)`;
                }
                
                lastScrollTop = scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for trending items
                if (entry.target.classList.contains('trending-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.trending-item');
                    anime({
                        targets: items,
                        translateX: [-30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        duration: 800,
                        easing: 'easeOutExpo'
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.trending-item, .footer-section').forEach(el => {
        observer.observe(el);
    });
}

// Tab Functions
function showTab(tabId) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn, .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected tab and button
    const selectedTab = document.getElementById(tabId);
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedNavLink = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    
    if (selectedTab) {
        // Animate tab transition
        gsap.fromTo(selectedTab, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            onStart: () => {
                selectedTab.classList.add('active');
            }
        });
        
        // Animate news cards in the new tab
        const newsCards = selectedTab.querySelectorAll('.news-card');
        gsap.fromTo(newsCards, {
            opacity: 0,
            y: 30,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2
        });
    }
    
    if (selectedButton) {
        selectedButton.classList.add('active');
        
        // Animate button selection
        anime({
            targets: selectedButton,
            scale: [0.95, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    }
    
    if (selectedNavLink) {
        selectedNavLink.classList.add('active');
    }
    
    // Close mobile menu
    closeMobileMenu();
}

// Audio Functions
function toggleAudio(audioId) {
    const audio = document.getElementById(audioId);
    const icon = document.getElementById('icon-' + audioId);
    const button = icon.parentElement;

    // Stop current audio if different
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        
        // Reset previous button
        const currentButton = document.querySelector('.play-btn.playing');
        const currentIcon = document.querySelector('.play-btn.playing i');
        
        if (currentButton) {
            currentButton.classList.remove('playing');
            anime({
                targets: currentButton,
                scale: [1.1, 1],
                duration: 300,
                easing: 'easeOutExpo'
            });
        }
        
        if (currentIcon) {
            currentIcon.classList.replace('fa-pause', 'fa-play');
        }
    }

    if (audio.paused) {
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('Audio file not found', 'error');
        });
        
        icon.classList.replace('fa-play', 'fa-pause');
        button.classList.add('playing');
        currentAudio = audio;
        
        // Animate play button
        anime({
            targets: button,
            scale: [1, 1.1],
            duration: 300,
            easing: 'easeOutExpo'
        });
        
    } else {
        audio.pause();
        icon.classList.replace('fa-pause', 'fa-play');
        button.classList.remove('playing');
        currentAudio = null;
        
        // Animate pause button
        anime({
            targets: button,
            scale: [1.1, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    }

    // Handle audio end
    audio.onended = () => {
        icon.classList.replace('fa-pause', 'fa-play');
        button.classList.remove('playing');
        currentAudio = null;
        
        anime({
            targets: button,
            scale: [1.1, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    };
}

// Theme Functions
function initializeTheme() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
    
    // Animate theme toggle
    anime({
        targets: themeToggle,
        rotate: '1turn',
        duration: 600,
        easing: 'easeOutExpo'
    });
    
    // Animate theme transition
    anime({
        targets: 'body',
        duration: 300,
        easing: 'easeOutExpo',
        complete: () => {
            showNotification(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'success');
        }
    });
}

// Utility Functions
function scrollToContent() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (email) {
        // Animate form submission
        const button = event.target.querySelector('button');
        const originalHTML = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i>';
            showNotification('Successfully subscribed to newsletter!', 'success');
            event.target.reset();
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 2000);
        }, 1500);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
    });
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('button, .tab-btn, .play-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    img.loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);