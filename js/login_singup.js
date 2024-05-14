    const apiUrl = 'https://localhost:7214/api/Admin/';


    document.getElementById('login').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email_li').value;
        const password = document.getElementById('password_li').value;

        try {
            const admin = await loginAdmin(0, email, password, '', '');


            document.getElementById('login').classList.remove('show-login');
            console.log('Logged in admin:', admin);
            console.log(`Вітаємо, ${admin.name} ${admin.surname}!`);
            localStorage.setItem('admin', JSON.stringify(admin));

            document.querySelector('#messageModal .modal-body #message').textContent = `Вітаємо, ${admin.name} ${admin.surname}!`;

            document.getElementById('user-name').textContent = admin.name + ' ' + admin.surname;
            document.getElementById('user-name').style.display = 'block';

            $('#messageModal').show();
        } catch (error) {
            console.log('Error:', error.message);
            $('#errorMessage').text(error.message);
            $('#errorModal').show();

        }
    });

    document.getElementById('signup').addEventListener('submit', async function(event) {
        event.preventDefault();

        const admin = {
            Email: document.getElementById('email_su').value,
            Password: document.getElementById('password_su').value,
            Name: document.getElementById('name_su').value,
            Surname: document.getElementById('surname_su').value
        };

        try {
            const registeredAdmin = await registerAdmin(admin);
            document.getElementById('signup').classList.remove('show-login');
            console.log('Registered admin:', registeredAdmin);
            console.log(`Вітаємо, ${registeredAdmin.name} ${registeredAdmin.surname}!`); // вивести повідомлення вітання

            document.querySelector('#messageModal .modal-body #message').textContent = `Вітаємо з реєстрацією, далі повторіть вхід, ${admin.name} ${admin.surname}!`;

            $('#messageModal').show();
        } catch (error) {
            console.error('Error:', error.message);
            $('#errorMessage').text(error.message);
            $('#errorModal').show();
        }
    });

    async function loginAdmin(id, email, password, name, surname) {
        const data = JSON.stringify({ id, email, password, name, surname });
        console.log('Sending JSON:', data);

        const response = await fetch(apiUrl + 'login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        });
        if (!response.ok) {
            const errorData = await response.json(); // Отримуємо JSON відповідь з сервера
            console.error('Server error:', errorData); // Виводимо помилку сервера в консоль
            throw new Error(`${errorData.message}`); // Виводимо статус, статус текст та повідомлення про помилку
        }
        const jsonData = await response.json();
        console.log('Server response:', jsonData); // Виводимо відповідь сервера в консоль
        return jsonData;
    }

    async function registerAdmin(admin) {
        const data = JSON.stringify(admin);
        console.log('Sending JSON:', data);

        const response = await fetch(apiUrl + 'register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData); // Виводимо помилку сервера в консоль
            throw new Error(`${errorData.message}`); // Виводимо статус, статус текст та повідомлення про помилку
        }
        const jsonData = await response.json();
        console.log('Server response:', jsonData); // Виводимо відповідь сервера в консоль
        return jsonData;
    }

    function closeMessageModal() {
        $('#messageModal').hide();
    }