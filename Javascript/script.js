document.addEventListener("DOMContentLoaded", function () {
    // Elementlarni olish
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const arrow = document.getElementById("arrow");
    const navItems = document.querySelectorAll("[data-nav]");
    const contentCards = document.querySelectorAll(".content_cards");
    const breadcrumbBox = document.getElementById("breadcrumbBox");
    const breadcrumbSub = document.getElementById("breadcrumbSub");
    const breadcrumbMain = document.getElementById("breadcrumbMain");
    const teachersYears = document.getElementById("teachersYears");
    const cardList = document.getElementById('cardList');
    const searchInput = document.getElementById('search');
    const addCardButton = document.getElementById('addCardButton');
    const addCardModal = document.getElementById('addCardModal');
    const closeAddModalButton = addCardModal.querySelector('.close-button');
    const saveCardButton = document.getElementById('saveCard');
    const newContentInput = document.getElementById('newContent');
    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const closeEditBtn = editModal.querySelector('.close-btn');
    let currentEditingSpan = null;
    const localStorageKey = 'cardListData';
    let data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const kafedralarCard = document.getElementById("kafedralarCard");
    const teachersCard = document.getElementById("teachersCard");
    const fixedBottomRight = document.getElementById("fixedBottomRight");

    // Funksiyalar
    function saveDataToLocalStorage() {
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    }

    function createCard(text) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-left">
                <img src="./images/Bookmark.png" alt="icon" />
                <span class="card-text">${text}</span>
            </div>
            <div class="card-right">
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
                <span class="icon-btn edit" title="Edit">&#9998;</span>
                <span class="icon-btn delete" title="Delete">&#128465;</span>
            </div>
        `;
        const deleteBtn = card.querySelector('.delete');
        const editBtn = card.querySelector('.edit');
        const textSpan = card.querySelector('.card-text');
        deleteBtn.addEventListener('click', () => {
            data = data.filter(item => item !== textSpan.textContent);
            saveDataToLocalStorage();
            card.remove();
        });
        editBtn.addEventListener('click', () => {
            currentEditingSpan = textSpan;
            editInput.value = textSpan.textContent;
            editModal.style.display = 'flex';
        });
        return card;
    }

    function loadCards(filter = "") {
        cardList.innerHTML = '';
        const filteredData = data.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
        filteredData.forEach(item => cardList.appendChild(createCard(item)));
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll('.content > div');
        sections.forEach(section => section.style.display = 'none');
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
        breadcrumbBox.style.display = sectionId !== 'dashboard' && sectionId !== 'profile-section' ? 'flex' : 'none';
        fixedBottomRight.style.display = sectionId === 'teachersYears' ? 'flex' : 'none';
    }

    // Event listeners
    if (dropdownToggle) {
        dropdownToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show-menu");
            arrow.classList.toggle("rotate");
        });
    }

    document.addEventListener("click", (e) => {
        if (dropdownToggle && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.remove("show-menu");
            arrow.classList.remove("rotate");
        }
        if (e.target === addCardModal) addCardModal.style.display = 'none';
        if (e.target === editModal) editModal.style.display = 'none';
    });

    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(el => el.classList.remove("active-nav"));
            this.classList.add("active-nav");
            const target = this.getAttribute('data-nav').toLowerCase();
            breadcrumbMain.innerText = target.charAt(0).toUpperCase() + target.slice(1);
            breadcrumbSub.innerText = '';
            showSection(target === 'ma\'lumotlar' ? 'teachersYears' : target + 'Section');
            if (target === 'ma\'lumotlar') {
                loadCards(searchInput.value);
            }
        });
    });

    contentCards.forEach((card) => {
        card.addEventListener("click", () => {
            const title = card.querySelector(".content_title").innerText;
            breadcrumbMain.innerText = "Ma'lumotlar";
            breadcrumbSub.innerText = `/ ${title}`;
            showSection('teachersYears');
            loadCards('');
            fixedBottomRight.style.display = title === "O'quv yillari" ? 'flex' : 'none';
        });
    });

    searchInput.addEventListener('input', () => loadCards(searchInput.value));
    loadCards();

    addCardButton.addEventListener('click', () => addCardModal.style.display = 'flex');
    closeAddModalButton.addEventListener('click', () => addCardModal.style.display = 'none');
    saveCardButton.addEventListener('click', () => {
        const newText = newContentInput.value.trim();
        if (newText) {
            data.push(newText);
            saveDataToLocalStorage();
            cardList.appendChild(createCard(newText));
            newContentInput.value = '';
            addCardModal.style.display = 'none';
        } else {
            alert('Iltimos, yangi o‘quv yilini kiriting!');
        }
    });
    newContentInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') saveCardButton.click();
    });

    saveEditBtn.addEventListener('click', () => {
        if (currentEditingSpan) {
            const index = data.indexOf(currentEditingSpan.textContent);
            if (index > -1) {
                data[index] = editInput.value;
                saveDataToLocalStorage();
                currentEditingSpan.textContent = editInput.value;
                loadCards(searchInput.value);
            }
            editModal.style.display = 'none';
            currentEditingSpan = null;
        }
    });
    closeEditBtn.addEventListener('click', () => editModal.style.display = 'none');

    window.toggleProfile = function () {
        showSection('profile-section');
    };

    // Yangi divni ko'rsatish uchun (agar kerak bo'lsa, qaysi bo'limda ko'rsatilishini aniqlang)
    // Misol uchun, "O'quv yillari" bo'limida ko'rsatish:
    const oquvYillariCard = document.querySelector('.content_cards:nth-child(4)');
    if (oquvYillariCard) {
        oquvYillariCard.addEventListener('click', () => {
            fixedBottomRight.style.display = 'flex';
        });
    } else {
        fixedBottomRight.style.display = 'none'; // Boshqa hollarda yashirish
    }

    // "+" ikonkasiga event listener qo'shishingiz mumkin, masalan:
    fixedBottomRight.addEventListener('click', () => {
        alert('Yangi element qo‘shish funksiyasi');
        // Bu yerga yangi element qo'shish logikasini yozishingiz mumkin
    });
});

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}


const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');
const chatWindow = document.getElementById('chatWindow');
const chatCard = document.getElementById('chatCard');
const topnavChat = document.querySelector('.chat');
const breadcrumbBox = document.getElementById('breadcrumbBox');
const breadcrumbMain = document.getElementById('breadcrumbMain');
const breadcrumbSub = document.getElementById('breadcrumbSub');
const contentCards = document.querySelectorAll('.content_cards');
const teachersYears = document.getElementById('teachersYears');
const addUserButton = document.querySelector('.add-user-button');
const addUserModal = document.getElementById('addUserModal');
const closeButton = addUserModal.querySelector('.close-button');
const newUsernameInput = document.getElementById('newUsername');
const addUserBtn = document.getElementById('addUserBtn');
const userList = document.querySelector('.user-list');

let messageCount = 0;
const STORAGE_KEY = 'chatMessages';

// Xabarlarni localstoragega saqlash funksiyasi
function saveMessage(message) {
    const messages = getMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Localstoragedan xabarlarni olish funksiyasi
function getMessages() {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [];
}

// Sahifa yuklanganda xabarlarni yuklash funksiyasi
function loadMessages() {
    const messages = getMessages();
    messages.forEach(messageText => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.style.fontSize = '18px';

        if (messageCount % 2 === 0) {
            newMessage.classList.add('message-left');
        } else {
            newMessage.classList.add('message-right');
        }

        messagesContainer.prepend(newMessage);
        messageCount++;

        if (messageCount % 10 === 0) {
            const breakLeft1 = document.createElement('div');
            breakLeft1.classList.add('message-left', 'message-break');
            messagesContainer.prepend(breakLeft1);

            const breakLeft2 = document.createElement('div');
            breakLeft2.classList.add('message-left', 'message-break');
            messagesContainer.prepend(breakLeft2);
        }
    });
}

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.textContent = messageText;
        newMessage.style.fontSize = '18px';

        if (messageCount % 2 === 0) {
            newMessage.classList.add('message-left');
        } else {
            newMessage.classList.add('message-right');
        }

        messagesContainer.prepend(newMessage); // Xabarni tepaga qo'shish
        messageInput.value = '';
        saveMessage(messageText); // Saqlash
        messageCount++; // Har bir xabardan keyin hisoblagichni oshirish

        if (messageCount % 10 === 0) {
            const breakLeft1 = document.createElement('div');
            breakLeft1.classList.add('message-left', 'message-break');
            messagesContainer.prepend(breakLeft1);

            const breakLeft2 = document.createElement('div');
            breakLeft2.classList.add('message-left', 'message-break');
            messagesContainer.prepend(breakLeft2);
        }
    }
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

function openChat() {
    contentCards.forEach(card => card.style.display = "none");
    teachersYears.style.display = "none";
    breadcrumbBox.style.display = "flex";
    breadcrumbMain.innerText = "Chat";
    breadcrumbSub.innerText = "/ Chat";
    chatWindow.style.display = 'flex';
}

if (topnavChat) {
    topnavChat.addEventListener('click', openChat);
}

if (chatCard) {
    chatCard.addEventListener('click', openChat);
}

contentCards.forEach(card => {
    if (card.id !== 'chatCard') {
        card.addEventListener('click', () => {
            contentCards.forEach(c => c.style.display = "none");
            teachersYears.style.display = "none";
            breadcrumbBox.style.display = "flex";
            const title = card.querySelector(".content_title").innerText;
            breadcrumbMain.innerText = title;
            breadcrumbSub.innerText = `/ ${title}`;
            chatWindow.style.display = 'none';
            if (title === "O'quv yillari") {
                teachersYears.style.display = "block";
            }
        });
    }
});

// Modal oynani ochish
addUserButton.addEventListener('click', () => {
    addUserModal.style.display = "block";
});

// Modal oynani yopish (x tugmasi)
closeButton.addEventListener('click', () => {
    addUserModal.style.display = "none";
});

// Modal oynani yopish (tashqariga bosilganda)
window.addEventListener('click', (event) => {
    if (event.target == addUserModal) {
        addUserModal.style.display = "none";
    }
});

// Yangi foydalanuvchi qo'shish
addUserBtn.addEventListener('click', () => {
    const newUsername = newUsernameInput.value.trim();
    if (newUsername !== '') {
        const newUserDiv = document.createElement('div');
        newUserDiv.classList.add('user-item');
        newUserDiv.textContent = newUsername;
        userList.appendChild(newUserDiv);
        newUsernameInput.value = '';
        addUserModal.style.display = "none";
    }
});

newUsernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addUserBtn.click();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        addUserModal.style.display = "none";
    }
});

loadMessages();
