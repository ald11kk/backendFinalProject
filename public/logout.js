window.addEventListener('DOMContentLoaded', (event) => {
    fetch('/auth/status')
        .then(response => response.json())
        .then(data => {
            const topNav = document.getElementById('topnav');
            
            // Clear previous navbar
            topNav.innerHTML = '';

            // Home link is permanent
            const homeLink = document.createElement('a');
            homeLink.classList.add('nav-link');
            homeLink.href = '/';
            homeLink.textContent = 'Home';
            topNav.appendChild(homeLink);

            // Register/login for guest users
            if (!data.isLoggedIn) {
                const registerLink = document.createElement('a');
                registerLink.classList.add('nav-link');
                registerLink.href = '/register.html';
                registerLink.textContent = 'Register';
                topNav.appendChild(registerLink);

                const loginLink = document.createElement('a');
                loginLink.classList.add('nav-link');
                loginLink.href = '/login.html';
                loginLink.textContent = 'Login';
                topNav.appendChild(loginLink);
            }

            // Logout link for logged in users
            if (data.isLoggedIn) {
                const logoutLink = document.createElement('a');
                logoutLink.classList.add('nav-link');
                logoutLink.href = '/logout';
                logoutLink.textContent = 'Log out';
                topNav.appendChild(logoutLink);
            }

            // Admin Panel link for admin users
            if (data.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.classList.add('nav-link');
                adminLink.href = '/admin';
                adminLink.textContent = 'Admin Panel';
                topNav.appendChild(adminLink);
            }
        });
});
