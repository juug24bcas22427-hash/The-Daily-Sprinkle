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
        
        if (isDark) {
            body.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all managers
    window.mobileNav = new MobileNavigation();
    window.tabManager = new TabManager();
    window.themeManager = new ThemeManager();
    
    // Global functions for backward compatibility
    // NOTE: `toggleAudio` and `toggleTheme` are now handled by script.js and the ThemeManager class directly
    // We keep showTab here to ensure the mobile menu closes when a tab is selected from it.
    window.showTab = function(tabId) {
        // This function is defined globally in script.js, but we can override or extend it
        // For now, we'll let the original onclick attributes handle it.
        // We add this to ensure the mobile menu closes properly.
        const mainShowTab = window.showTab; // This will point to the one in script.js if loaded
        if (typeof mainShowTab === 'function') {
           // mainShowTab(tabId); // This call is redundant because of onclick in HTML
        } else {
            // Fallback if script.js hasn't defined it, though it should have
            window.tabManager.showTab(tabId);
        }
        
        // Close mobile menu if open
        if (window.mobileNav && window.mobileNav.isOpen) {
            window.mobileNav.closeMenu();
        }
    };

    // Newsletter form handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            // This is also handled in script.js, we can remove it to avoid redundancy
            // e.preventDefault();
            // const email = this.querySelector('input[type="email"]').value;
            // if (email) {
            //     // You would have a global notification function to call here
            //     console.log('Successfully subscribed!');
            //     this.reset();
            // }
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
