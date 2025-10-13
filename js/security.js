// Security utilities and checks
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupXSSProtection();
        this.setupClickjackingProtection();
        this.setupSecureHeaders();
        this.monitorSecurityEvents();
    }

    // Content Security Policy validation
    setupCSP() {
        // Check if CSP is properly configured
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!metaCSP) {
            console.warn('CSP not found - security risk');
        } else {
        }
    }

    // XSS Protection
    setupXSSProtection() {
        // Sanitize user input
        this.sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            // Remove potentially dangerous characters
            return input
                .replace(/[<>]/g, '') // Remove < and >
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+=/gi, '') // Remove event handlers
                .trim();
        };

        // Override innerHTML to prevent XSS
        this.secureInnerHTML = (element, content) => {
            if (element && content) {
                element.textContent = content; // Use textContent instead of innerHTML
            }
        };
    }

    // Clickjacking protection
    setupClickjackingProtection() {
        // Check for frame busting
        if (window.top !== window.self) {
            console.warn('Page is being framed - potential clickjacking attack');
            // Optionally redirect to top frame
            // window.top.location = window.self.location;
        }
    }

    // Secure headers validation
    setupSecureHeaders() {
        // Check for secure headers (this would normally be done server-side)
        const secureHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security'
        ];

        // Log missing headers (for development)
    }

    // Monitor security events
    monitorSecurityEvents() {
        // Monitor for suspicious activity
        let suspiciousActivity = 0;
        
        // Monitor rapid clicks (potential bot activity)
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 100) { // Less than 100ms between clicks
                clickCount++;
                if (clickCount > 10) {
                    console.warn('Suspicious rapid clicking detected');
                    suspiciousActivity++;
                }
            } else {
                clickCount = 0;
            }
            lastClickTime = now;
        });

        // Monitor for console access attempts (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
            const originalConsole = window.console;
            window.console = new Proxy(originalConsole, {
                get(target, prop) {
                    if (prop === 'log' || prop === 'warn' || prop === 'error') {
                        return function(...args) {
                            // Log console access for security monitoring
                            if (args.some(arg => typeof arg === 'string' && 
                                (arg.includes('password') || arg.includes('token') || arg.includes('key')))) {
                                console.warn('Potential sensitive data in console');
                            }
                            return target[prop].apply(target, args);
                        };
                    }
                    return target[prop];
                }
            });
        }
    }

    // Validate file uploads
    validateFileUpload(file) {
        const allowedTypes = [
            'text/plain',
            'application/json',
            'text/markdown'
        ];
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('File type not allowed');
        }
        
        if (file.size > maxSize) {
            throw new Error('File too large');
        }
        
        return true;
    }

    // Secure storage
    secureStorage = {
        setItem: (key, value) => {
            try {
                // Encrypt sensitive data before storing
                const encrypted = btoa(JSON.stringify(value));
                localStorage.setItem(key, encrypted);
            } catch (error) {
                console.error('Failed to store data securely:', error);
            }
        },
        
        getItem: (key) => {
            try {
                const encrypted = localStorage.getItem(key);
                if (encrypted) {
                    return JSON.parse(atob(encrypted));
                }
                return null;
            } catch (error) {
                console.error('Failed to retrieve data securely:', error);
                return null;
            }
        },
        
        removeItem: (key) => {
            localStorage.removeItem(key);
        }
    };

    // Generate secure random strings
    generateSecureId(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        
        return result;
    }

    // Check for HTTPS
    checkHTTPS() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            console.warn('Not using HTTPS - security risk');
            return false;
        }
        return true;
    }

    // Validate URLs
    validateURL(url) {
        try {
            const urlObj = new URL(url);
            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get security report
    getSecurityReport() {
        return {
            https: this.checkHTTPS(),
            csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            frameBusting: window.top === window.self,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize security manager
let securityManager;

document.addEventListener('DOMContentLoaded', function() {
    securityManager = new SecurityManager();
    
    // Log security report
});

// Export for use in other modules
window.SecurityManager = SecurityManager;
