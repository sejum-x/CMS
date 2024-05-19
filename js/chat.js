// Client
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io('http://localhost:8080');
let name = "";
let surname = "";

let chats = [];
let users = [];
let chatHistory = {};

function getNameAndSurnameFromElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        return { name: '', surname: '' };
    }

    const text = element.textContent.trim();
    const [newName, newSurname] = text.split(' ');
    name = newName; // Update the global name variable
    surname = newSurname; // Update the global surname variable
    return { name: newName, surname: newSurname };
}

socket.on('message', (message) => {
    const el = document.createElement('li');
    el.innerHTML = message;
    document.getElementById('allMessages').appendChild(el);
});

socket.on('userJoined', (username) => {
    const el = document.createElement('li');
    el.innerHTML = `${username} joined the chat`;
    document.getElementById('allMessages').appendChild(el);
});

socket.on('lastMessages', ({ chatCode, messages }) => {
    const lastMessagesElement = document.getElementById('lastMessages');
    lastMessagesElement.innerHTML = ''; // Clear the previous messages

    messages.forEach(message => {
        const messageElement = document.createElement('li');
        messageElement.textContent = `${message.user}: ${message.message}`;
        lastMessagesElement.appendChild(messageElement);
    });
});


document.getElementById('sendMessageBtn').onclick = () => {
    const text = document.getElementById('messageInput').value;
    socket.emit('message', { text, name, surname });
}



document.addEventListener('DOMContentLoaded', () => {
    const chatButtons = document.querySelectorAll('.ChatPanelButton');
    chatButtons.forEach(chatButton => {
        chatButton.addEventListener('click', () => {
            const code = chatButton.dataset.code;
            handleChatButtonClick(code);
        });
    });

    const messageBtn = document.getElementById('message-btn');
    if (messageBtn) {
        messageBtn.addEventListener('click', renderChats);
    }
});

function renderChats() {
    getNameAndSurnameFromElement('user-name');
    console.log('Name:', name, 'Surname:', surname);

    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    const userChats = users.find(user => user.name === name && user.surname === surname)?.chats || [];

    chats.filter(chat => userChats.includes(chat.code)).forEach(chat => {
        const chatButton = document.createElement('button');
        chatButton.classList.add('ChatButton');
        chatButton.innerText = chat.name;
        chatButton.dataset.code = chat.code;

        chatButton.addEventListener('click', () => {
            handleChatButtonClick(chat.code);
        });

        chatList.appendChild(chatButton);
    });
}

function handleChatButtonClick(code) {
    socket.emit('joinRoom', code);
    socket.emit('getChatHistory', code);
    socket.on('chatHistory', (receivedChatHistory) => {
        chatHistory[code] = receivedChatHistory;
        renderChatHistory(code);
    });
}

function renderChatHistory(code) {
    const chatHistoryList = document.getElementById('allMessages');
    chatHistoryList.innerHTML = '';

    if (chatHistory[code]) {
        chatHistory[code].forEach(item => {
            const el = document.createElement('li');
            el.innerHTML = `<strong>${item.user}:</strong> ${item.message}`;
            chatHistoryList.appendChild(el);
        });
    }

    const chat = chats.find(chat => chat.code === code);
    if (chat) {
        document.getElementById('chatName').innerText = chat.name;
        document.getElementById('chatCode').innerText = chat.code;
        const participants = users.filter(user => user.chats.includes(code));
        document.getElementById('participants').innerText = participants.map(user => `${user.name} ${user.surname}`).join(', ');
        const messageCount = chatHistory[code] ? chatHistory[code].length : 0;
        document.getElementById('messageCount').innerText = messageCount;
    }
}

document.getElementById('createChat').onclick = () => {
    const chatName = document.getElementById('createChatNameInput').value;
    const chatCode = document.getElementById('createChatCodeInput').value;
    socket.emit('createChat', { chatName, chatCode, name, surname });
    document.getElementById('createChatPanel').style.display = 'none';

    // Підвантаження інформації з серверу про чати та користувачів
    socket.emit('getChats');
    socket.on('chats', (receivedChats) => {
        chats = receivedChats;
        renderChats();
    });

    socket.emit('getUsers');
    socket.on('users', (receivedUsers) => {
        users = receivedUsers;
    });
}

document.getElementById('joinChat').onclick = () => {
    const chatCode = document.getElementById('JoinChatCodeInput').value;
    socket.emit('addChat', { chatCode, name, surname });
    document.getElementById('joinChatPanel').style.display = 'none';

    // Підвантаження інформації з серверу про чати та користувачів
    socket.on('getChats', () => {
        socket.emit('getChats');
    });

    socket.on('chats', (receivedChats) => {
        chats = receivedChats;
        renderChats();
    });

    socket.on('users', (receivedUsers) => {
        users = receivedUsers;
        console.log(users);
        renderChats();
    });
}


document.getElementById('cancelCreateChat').onclick = () => {
    document.getElementById('createChatPanel').style.display = 'none';
}

document.getElementById('joinChatBtn').onclick = () => {
    document.getElementById('joinChatPanel').style.display = 'block';
}

document.getElementById('createChatBtn').onclick = () => {
    document.getElementById('createChatPanel').style.display = 'block';
}

socket.emit('getChats');
socket.on('chats', (receivedChats) => {
    chats = receivedChats;
    renderChats();
});

socket.emit('getUsers');
socket.on('users', (receivedUsers) => {
    users = receivedUsers;
});


// Функція, що відкриває панель з чатами при кліці
let tooltipVisible = false;
let tooltipTimer;

// Функція для показу tooltip
function showTooltip() {
    clearTimeout(tooltipTimer);
    tooltipVisible = true;
    document.getElementById('messageTooltip').style.display = 'block';
}

// Функція для приховування tooltip з затримкою
function hideTooltip() {
    tooltipTimer = setTimeout(() => {
        tooltipVisible = false;
        document.getElementById('messageTooltip').style.display = 'none';
    }, 500); // Затримка в мілісекундах перед прихованням tooltip
}

// Показуємо tooltip при наведенні на кнопку
document.getElementById('message-btn').addEventListener('mouseover', function() {
    showTooltip();
});

// Приховуємо tooltip при знятті наведення з кнопки
document.getElementById('message-btn').addEventListener('mouseleave', function() {
    hideTooltip();
});

// Показуємо tooltip при наведенні на tooltip
document.getElementById('messageTooltip').addEventListener('mouseover', function() {
    showTooltip();
});

// Приховуємо tooltip при знятті наведення з tooltip
document.getElementById('messageTooltip').addEventListener('mouseleave', function() {
    hideTooltip();
});


// Підвантаження останніх трьох повідомлень при наведенні на кнопку
document.getElementById('message-btn').addEventListener('mouseover', function() {
    getNameAndSurnameFromElement('user-name');
    fetch(`http://localhost:3000/get-last-three-messages?name=${name}&surname=${surname}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data); // Log the received data for inspection

            // Clear the existing messages
            const lastMessagesElement = document.getElementById('lastMessages');
            lastMessagesElement.innerHTML = '';

            // Check if the data is in the expected format
            if (Array.isArray(data) && data.length > 0) {
                // Iterate over the messages array and append them to the list
                data.forEach(item => {
                    const messageElement = document.createElement('li');
                    messageElement.textContent = `${item.message.user}: ${item.message.message}`;

                    // Add event listener to open chat panel on click
                    messageElement.addEventListener('click', function() {
                        openChatPanel(item.chatCode); // Assuming chatCode is unique identifier for chat
                    });

                    lastMessagesElement.appendChild(messageElement);
                });
            } else {
                // Handle case where data is not in the expected format
                console.error('Received unexpected data format:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


// Функція, що відкриває панель з чатами
function openChatPanel(chatCode) {
    var studentsTable = document.getElementById('tableContainer');
    var chatInterface = document.getElementById('chatContainer');
    var taskInterface = document.getElementById('taskContainer');

    // Додайте код, який відкриває панель з чатами з кодом чату chatCode
    studentsTable.style.display = 'none';
    taskInterface.style.display = 'none';
    chatInterface.style.display = 'block';
    // Наприклад, ви можете викликати функцію, яка відкриває панель з чатами із кодом чату chatCode
    renderChats();
    handleChatButtonClick(chatCode);
    // openChat(chatCode);
}
