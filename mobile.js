// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navLinks = document.getElementById('navLinks');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (this.mobileToggle && this.navLinks) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });

            // Close menu when clicking nav links
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    this.closeMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && 
                    !this.navLinks.contains(e.target) && 
                    !this.mobileToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.closeMenu();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.mobileToggle.classList.add('active');
        this.navLinks.classList.add('active');
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = this.navLinks.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    closeMenu() {
        this.mobileToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset menu items
        const menuItems = this.navLinks.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }
}

// Tab Management
class TabManager {
    constructor() {
        this.activeTab = 'home';
        this.init();
    }

    init() {
        // Set initial active states
        this.updateActiveStates('home');
    }

    showTab(tabId) {
        if (tabId === this.activeTab) return;

        // Hide current tab
        const currentTab = document.getElementById(this.activeTab);
        if (currentTab) {
            currentTab.style.opacity = '0';
            setTimeout(() => {
                currentTab.classList.remove('active');
                this.showNewTab(tabId);
            }, 200);
        } else {
            this.showNewTab(tabId);
        }
    }

    showNewTab(tabId) {
        const newTab = document.getElementById(tabId);
        if (newTab) {
            newTab.classList.add('active');
            newTab.style.opacity = '0';
            
            setTimeout(() => {
                newTab.style.transition = 'opacity 0.3s ease';
                newTab.style.opacity = '1';
            }, 50);
            
            this.activeTab = tabId;
            this.updateActiveStates(tabId);
        }
    }

    updateActiveStates(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId || 
                btn.getAttribute('onclick')?.includes(tabId)) {
                btn.classList.add('active');
            }
        });

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(tabId)) {
                link.classList.add('active');
            }
        });
    }
}

// Audio Player
class AudioManager {
    constructor() {
        this.currentAudio = null;
        this.init();
    }

    init() {
        // Add click listeners to all play buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const audioId = btn.getAttribute('onclick')?.match(/toggleAudio\('(.+?)'\)/)?.[1];
                if (audioId) {
                    this.toggleAudio(audioId);
                }
            });
        });
    }

    toggleAudio(audioId) {
        const audio = document.getElementById(audioId);
        const icon = document.getElementById('icon-' + audioId);
        const button = icon?.parentElement;

        if (!audio || !icon || !button) return;

        // Stop current audio if different
        if (this.currentAudio && this.currentAudio !== audio) {
            this.stopCurrentAudio();
        }

        if (audio.paused) {
            this.playAudio(audio, icon, button);
        } else {
            this.pauseAudio(audio, icon, button);
        }
    }

    playAudio(audio, icon, button) {
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            this.showNotification('Audio file not found', 'error');
        });
        
        icon.classList.replace('fa-play', 'fa-pause');
        button.classList.add('playing');
        this.currentAudio = audio;
        
        audio.onended = () => {
            this.pauseAudio(audio, icon, button);
        };
    }

    pauseAudio(audio, icon, button) {
        audio.pause();
        icon.classList.replace('fa-pause', 'fa-play');
        button.classList.remove('playing');
        this.currentAudio = null;
    }

    stopCurrentAudio() {
        if (this.currentAudio) {
            const currentButton = document.querySelector('.play-btn.playing');
            const currentIcon = document.querySelector('.play-btn.playing i');
            
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            
            if (currentButton) currentButton.classList.remove('playing');
            if (currentIcon) currentIcon.classList.replace('fa-pause', 'fa-play');
            
            this.currentAudio = null;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }

        // Add theme toggle listener
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        const isDark = body.getAttribute('data-theme') === 'dark';
        
        console.log('Toggling theme. Current:', isDark ? 'dark' : 'light');
        
        if (isDark) {
            body.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
        
        console.log('Theme changed to:', isDark ? 'light' : 'dark');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all managers
    window.mobileNav = new MobileNavigation();
    window.tabManager = new TabManager();
    window.audioManager = new AudioManager();
    window.themeManager = new ThemeManager();
    
    // Global functions for backward compatibility
    window.showTab = function(tabId) {
        window.tabManager.showTab(tabId);
        // Close mobile menu if open
        if (window.mobileNav && window.mobileNav.isOpen) {
            window.mobileNav.closeMenu();
        }
    };
    
    window.toggleAudio = function(audioId) {
        window.audioManager.toggleAudio(audioId);
    };
    
    window.toggleTheme = function() {
        console.log('Global toggleTheme called');
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        } else {
            console.error('ThemeManager not initialized');
        }
    };
    
    // Ensure theme toggle works
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Theme button clicked');
            window.toggleTheme();
        });
    }
    
    // Newsletter form handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                window.audioManager.showNotification('Successfully subscribed!', 'success');
                this.reset();
            }
        });
    }
    
    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
