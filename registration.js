// registration
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get user input
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Make AJAX request to check if the user already exists
        fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // User already exists
                alert('User already exists. Please choose a different username.');
            } else {
                // User doesn't exist, proceed with registration
                fetch('https://657c8e02853beeefdb99a1d3.mockapi.io/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Registration successful:', data);
                    
                    // Save the user's ID in localStorage
                    localStorage.setItem('user_id', data.id);

                    // Redirect to the main HTML page
                    window.location.href = 'index.html';  // Update with your main page
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    // Handle errors during registration
                });
            }
        })
        .catch(error => {
            console.error('User existence check error:', error);
            // Handle errors during user existence check
        });
    });
});

// sign in
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get user input
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Make AJAX request to check if the user exists and the password is correct for login
        fetch(`https://657c8e02853beeefdb99a1d3.mockapi.io/users?username=${username}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // User exists, check if the password matches
                const user = data[0];
                if (user.password === password) {
                    // Password is correct, proceed with login
                    console.log('Login successful:', user);

                    // Save the user's ID in localStorage
                    localStorage.setItem('user_id', user.id);

                    // Redirect to the main HTML page
                    window.location.href = 'index.html';  // Update with your main page
                } else {
                    // Password is incorrect
                    alert('Incorrect username or password. Please try again.');
                }
            } else {
                // User doesn't exist
                alert('User does not exist. Please check your username or sign up.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            // Handle errors during login
        });
    });
});
