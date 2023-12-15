let todos = [];
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(e.target);
        const formType = e.target.dataset.formType;
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        if (formType === 'registration') {
            sendDataToMockAPI({ username, password })
                .then(responseData => {
                    console.log('Response from MockAPI:', responseData);
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Error during MockAPI request:', error);
                });
        }
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'registration.html';
        });
    });
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(e.target);
    });

    function handleFormSubmission(form) {
        const formType = form.dataset.formType;
        const username = form.elements.username.value;
        const password = form.elements.password.value;

        if (formType === 'registration') {
            // Регистрация пользователя
            const user = { username, password };
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Перенаправление на главную страницу после регистрации
            window.location.href = 'index.html';
        } else if (formType === 'login') {
            // Вход пользователя
            const storedUser = JSON.parse(localStorage.getItem('currentUser'));

            if (storedUser && storedUser.username === username && storedUser.password === password) {
                // Если пользователь существует и пароль совпадает, перенаправить на главную страницу
                window.location.href = 'index.html';
            } else {
                // Иначе, вывод ошибки или обработка неудачного входа
                alert('Invalid username or password');
            }
        }
    }
});

async function sendDataToMockAPI(data) {
    try {
        const mockApiUrl = 'https://6577300d197926adf62d9a45.mockapi.io/users'
        const response = await fetch(mockApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}