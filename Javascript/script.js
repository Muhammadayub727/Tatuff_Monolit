document.addEventListener("DOMContentLoaded", function () {
    // Elementlarni olish - HAMMASI BU YERDA BO'LISHI KERAK!
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const arrow = document.getElementById("arrow");
    const navItems = document.querySelectorAll("[data-nav]");
    const contentCards = document.querySelectorAll(".content_cards");
    const breadcrumbBox = document.getElementById("breadcrumbBox");
    const breadcrumbSub = document.getElementById("breadcrumbSub");
    const breadcrumbMain = document.getElementById("breadcrumbMain");
    const teachersYears = document.getElementById("teachersYears"); // Assuming this is the main content area for "O'quv yillari"
    const cardList = document.getElementById('cardList');
    const searchInput = document.getElementById('search');
    const addCardButton = document.getElementById('addCardButton');
    const addCardModal = document.getElementById('addCardModal');
    const closeAddModalButton = addCardModal ? addCardModal.querySelector('.close-button') : null;
    const saveCardButton = document.getElementById('saveCard');
    const newContentInput = document.getElementById('newContent');
    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const closeEditBtn = editModal ? editModal.querySelector('.close-btn') : null;
    let currentEditingSpan = null;
    const localStorageKey = 'cardListData';
    let data = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    const kafedralarCard = document.getElementById("kafedralarCard");
    const teachersCard = document.getElementById("teachersCard"); // Assuming this is "O'qituvchilar" card
    const fixedBottomRight = document.getElementById("fixedBottomRight");
    const addKafedraModalFull = document.getElementById("addKafedraModalFull");
    const newKafedraNameInput = document.getElementById("newKafedraName");
    const selectOquvYiliSelect = document.getElementById("selectOquvYili");
    const newKafedraLoginInput = document.getElementById("newKafedraLogin");
    const newKafedraParolInput = document.getElementById("newKafedraParol");
    const saveNewKafedraButton = document.getElementById("saveNewKafedra");
    let kafedralar = JSON.parse(localStorage.getItem('kafedralarData')) || [];
    let nextKafedraId = kafedralar.length > 0 ? Math.max(...kafedralar.map(k => k.id)) + 1 : 1;
    const kafedralarList = document.getElementById('kafedralarList'); // Kafedralar ro'yxati uchun div

    // Chatga oid elementlar - HAMMASI BU YERDA
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const chatWindow = document.getElementById('chatWindow');
    const chatCard = document.getElementById('chatCard');
    const topnavChat = document.querySelector('.chat'); // Navigatsiyadagi chat tugmasi
    const addUserButton = document.querySelector('.add-user-button');
    const addUserModal = document.getElementById('addUserModal');
    const closeButton = addUserModal ? addUserModal.querySelector('.close-button') : null;
    const newUsernameInput = document.getElementById('newUsername');
    const addUserBtn = document.getElementById('addUserBtn');
    const userList = document.querySelector('.user-list');
    const sendButton = document.getElementById('sendButton');

    let messageCount = 0; // Chat xabarlari soni
    const CHAT_STORAGE_KEY = 'chatMessages'; // Chat xabarlari uchun alohida kalit

    // --- Umumiy yordamchi funksiyalar ---

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function saveData(type) {
        if (type === 'kafedra') {
            localStorage.setItem('kafedralarData', JSON.stringify(kafedralar));
        } else if (type === 'cards') {
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        }
    }

    // --- Kartochkalar (O'quv yillari, Kafedralar va boshqalar) bilan ishlash funksiyalari ---

    function createCardElement(item, type = 'cards') {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-left">
                <img src="./images/Bookmark.png" alt="icon" />
                <span class="card-text">${item.name || item}</span>
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
            let list = type === 'kafedra' ? kafedralar : data;
            const valueToDelete = (typeof item === 'object' && item !== null && item.name) ? item.name : item;
            const index = list.indexOf(valueToDelete);

            if (index > -1) {
                list.splice(index, 1);
                saveData(type);
            }
            card.remove();
        });

        editBtn.addEventListener('click', () => {
            currentEditingSpan = textSpan;
            if (editInput) editInput.value = textSpan.textContent;
            if (editModal) editModal.style.display = 'flex';
        });
        return card;
    }

    function loadCards(filter = "", type = 'cards') {
        if (!cardList) return;

        cardList.innerHTML = '';
        let listToLoad = [];

        if (type === 'kafedra') {
            listToLoad = kafedralar.filter(k => k.name.toLowerCase().includes(filter.toLowerCase()));
            listToLoad.forEach(item => cardList.appendChild(createCardElement(item, 'kafedra')));
        } else {
            const filteredData = data.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
            filteredData.forEach(item => cardList.appendChild(createCardElement(item, 'cards')));
        }
    }

    // --- Bo'limlarni ko'rsatish funksiyasi ---
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.content > div');
        sections.forEach(section => {
            if (section) section.style.display = 'none';
        });

        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }

        if (breadcrumbBox) breadcrumbBox.style.display = sectionId !== 'dashboard' && sectionId !== 'profile-section' ? 'flex' : 'none';
        if (fixedBottomRight) fixedBottomRight.style.display = sectionId === 'teachersYears' ? 'flex' : 'none';

        // Chat oynasining holatini alohida boshqarish
        if (chatWindow) {
            if (sectionId === 'chatWindow') {
                chatWindow.style.display = 'flex';
            } else {
                chatWindow.style.display = 'none';
            }
        }
    }

    // --- Chat funksiyalari ---

    function saveChatMessage(message) {
        const messages = getChatMessages();
        messages.push(message);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }

    function getChatMessages() {
        const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        return storedMessages ? JSON.parse(storedMessages) : [];
    }

    function loadChatMessages() {
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';
        const messages = getChatMessages();
        messageCount = 0; // Yuklashdan oldin hisoblagichni nolga tushirish

        messages.forEach(messageText => {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.textContent = messageText;
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

    function openChat() {
        showSection('chatWindow');
        if (breadcrumbMain) breadcrumbMain.innerText = "Chat";
        if (breadcrumbSub) breadcrumbSub.innerText = "/ Chat";
        loadChatMessages();
    }

    // --- Event listeners ---

    if (dropdownToggle) {
        dropdownToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (dropdownMenu) dropdownMenu.classList.toggle("show-menu");
            if (arrow) arrow.classList.toggle("rotate");
        });
    }

    document.addEventListener("click", (e) => {
        if (dropdownToggle && dropdownMenu && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.remove("show-menu");
            if (arrow) arrow.classList.remove("rotate");
        }
        if (e.target === addCardModal) closeModal('addCardModal');
        if (e.target === editModal) closeModal('editModal');
        if (e.target === addUserModal) closeModal('addUserModal');
        if (e.target === addKafedraModalFull) closeModal('addKafedraModalFull');
    });

    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(el => el.classList.remove("active-nav"));
            this.classList.add("active-nav");
            const target = this.getAttribute('data-nav');

            if (breadcrumbMain) breadcrumbMain.innerText = target.charAt(0).toUpperCase() + target.slice(1);
            if (breadcrumbSub) breadcrumbSub.innerText = '';

            if (target === 'ma\'lumotlar') {
                showSection('teachersYears');
                loadCards(searchInput ? searchInput.value : '', 'cards');
            } else if (target === 'kafedralar') {
                showSection('kafedralarSection'); // Assuming you have a div with id="kafedralarSection"
                loadCards(searchInput ? searchInput.value : '', 'kafedra'); // Load kafedralar
            } else if (target === 'chat') {
                openChat();
            } else {
                showSection(target + 'Section');
            }
        });
    });

  // Eski noto'g'ri qism (oldingi javobimda ham shu edi, uzr!)
contentCards.forEach(card => {
    if (card.id !== 'chatCard') {
        card.addEventListener('click', () => {
            contentCards.forEach(c => c.style.display = "none"); // BU MUAMMO! Barcha kartochkalarni yashirib yuboradi
            teachersYears.style.display = "none";
            breadcrumbBox.style.display = "flex";
            const title = card.querySelector(".content_title").innerText;
            breadcrumbMain.innerText = title;
            breadcrumbSub.innerText = `/ ${title}`;
            chatWindow.style.display = 'none'; // Chatni yashiradi
            if (title === "O'quv yillari") {
                teachersYears.style.display = "block"; // Keyin yana teachersYearsni ko'rsatadi, lekin boshqa bo'limlar emas
            }
        });
    }
});

    if (searchInput) searchInput.addEventListener('input', () => {
        // Decide which list to filter based on current section
        // For simplicity, we assume searchInput is for teachersYears here.
        // You might need a more complex logic if it's used for multiple sections.
        loadCards(searchInput.value, 'cards');
    });
    loadCards('', 'cards'); // Initial load for 'O'quv yillari'

    if (addCardButton) addCardButton.addEventListener('click', () => {
        if (addCardModal) addCardModal.style.display = 'flex';
    });
    if (closeAddModalButton) closeAddModalButton.addEventListener('click', () => closeModal('addCardModal'));

    if (saveCardButton) saveCardButton.addEventListener('click', () => {
        const newText = newContentInput ? newContentInput.value.trim() : '';
        if (newText) {
            data.push(newText);
            saveData('cards');
            if (cardList) cardList.appendChild(createCardElement(newText, 'cards'));
            if (newContentInput) newContentInput.value = '';
            closeModal('addCardModal');
        } else {
            alert('Iltimos, yangi o‘quv yilini kiriting!');
        }
    });
    if (newContentInput) newContentInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            if (saveCardButton) saveCardButton.click();
        }
    });

    if (saveEditBtn) saveEditBtn.addEventListener('click', () => {
        if (currentEditingSpan && editInput) {
            const originalText = currentEditingSpan.textContent;
            const newText = editInput.value;
            // Check if currentEditingSpan is from 'data' or 'kafedralar'
            let listType = 'cards';
            let index = data.indexOf(originalText);
            if (index === -1) { // Not in 'data', check 'kafedralar'
                listType = 'kafedra';
                index = kafedralar.findIndex(k => k.name === originalText);
                if (index > -1) {
                    kafedralar[index].name = newText;
                }
            } else { // Found in 'data'
                data[index] = newText;
            }

            if (index > -1) {
                saveData(listType);
                currentEditingSpan.textContent = newText;
                loadCards(searchInput ? searchInput.value : '', listType); // Reload the correct list
            }
            closeModal('editModal');
            currentEditingSpan = null;
        }
    });
    if (closeEditBtn) closeEditBtn.addEventListener('click', () => closeModal('editModal'));

    window.toggleProfile = function () {
        showSection('profile-section');
    };

    const oquvYillariCard = document.querySelector('.content_cards[data-title="O\'quv yillari"]'); // Assuming you can add a data-title attribute for better targeting
    if (oquvYillariCard) {
        oquvYillariCard.addEventListener('click', () => {
            if (fixedBottomRight) fixedBottomRight.style.display = 'flex';
        });
    } else {
        if (fixedBottomRight) fixedBottomRight.style.display = 'none';
    }

    if (fixedBottomRight) {
        fixedBottomRight.addEventListener('click', () => {
            // Determine which modal to open based on the currently displayed section
            if (teachersYears && teachersYears.style.display === 'block') {
                if (addCardModal) addCardModal.style.display = 'flex';
            } else if (document.getElementById('kafedralarSection') && document.getElementById('kafedralarSection').style.display === 'block') { // Assuming you have a 'kafedralarSection' div
                if (addKafedraModalFull) addKafedraModalFull.style.display = 'flex';
            } else {
                alert('Yangi element qo‘shish funksiyasi (bo‘limga qarab)');
            }
        });
    }

    if (saveNewKafedraButton) {
        saveNewKafedraButton.addEventListener('click', () => {
            const newKafedraName = newKafedraNameInput ? newKafedraNameInput.value.trim() : '';
            const oquvYili = selectOquvYiliSelect ? selectOquvYiliSelect.value : ''; // Assuming you fill this select
            const login = newKafedraLoginInput ? newKafedraLoginInput.value.trim() : '';
            const parol = newKafedraParolInput ? newKafedraParolInput.value.trim() : '';

            if (newKafedraName) {
                const newKafedra = {
                    id: nextKafedraId++,
                    name: newKafedraName,
                    oquvYili: oquvYili,
                    login: login,
                    parol: parol
                };
                kafedralar.push(newKafedra);
                saveData('kafedra');
                if (kafedralarList) {
                    // You might want to create a dedicated loadKafedralar function
                    // For now, reload general cards with 'kafedra' type
                    loadCards('', 'kafedra');
                }

                if (newKafedraNameInput) newKafedraNameInput.value = '';
                if (newKafedraLoginInput) newKafedraLoginInput.value = '';
                if (newKafedraParolInput) newKafedraParolInput.value = '';
                closeModal('addKafedraModalFull');
            } else {
                alert('Iltimos, kafedra nomini kiriting!');
            }
        });
    }

    if (addUserButton) {
        addUserButton.addEventListener('click', () => {
            if (addUserModal) addUserModal.style.display = "block";
        });
    }
    if (closeButton) { // For addUserModal
        closeButton.addEventListener('click', () => {
            closeModal('addUserModal');
        });
    }

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            const newUsername = newUsernameInput ? newUsernameInput.value.trim() : '';
            if (newUsername !== '') {
                const newUserDiv = document.createElement('div');
                newUserDiv.classList.add('user-item');
                newUserDiv.textContent = newUsername;
                if (userList) userList.appendChild(newUserDiv);
                if (newUsernameInput) newUsernameInput.value = '';
                closeModal('addUserModal');
            }
        });
    }

    if (newUsernameInput) {
        newUsernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (addUserBtn) addUserBtn.click();
            }
        });
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal('addUserModal');
            closeModal('addCardModal');
            closeModal('editModal');
            closeModal('addKafedraModalFull');
        }
    });

    // Chat xabarlarini yuborish
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const messageText = messageInput ? messageInput.value.trim() : '';
            if (messageText !== '') {
                const newMessage = document.createElement('div');
                newMessage.classList.add('message');
                newMessage.textContent = messageText;
                newMessage.style.fontSize = '18px';

                // Bu yerda sizning kodingizdagi chap/o'ng xabar mantig'ini saqlab qoldim
                if (messageCount % 2 === 0) {
                    newMessage.classList.add('message-left');
                } else {
                    newMessage.classList.add('message-right');
                }

                if (messagesContainer) messagesContainer.prepend(newMessage); // Xabarni tepaga qo'shish
                if (messageInput) messageInput.value = '';
                saveChatMessage(messageText);
                messageCount++;

                // Bu "break" logikasini chatda ishlatish uchun ehtiyot bo'lish kerak.
                // Agar sizda "scroll to bottom" (eng pastga skroll qilish) funksiyasi bo'lmasa,
                // eski xabarlardan keyin bunday bo'sh joylar biroz g'alati ko'rinishi mumkin.
                if (messageCount % 10 === 0) {
                    const breakLeft1 = document.createElement('div');
                    breakLeft1.classList.add('message-left', 'message-break');
                    if (messagesContainer) messagesContainer.prepend(breakLeft1);

                    const breakLeft2 = document.createElement('div');
                    breakLeft2.classList.add('message-left', 'message-break');
                    if (messagesContainer) messagesContainer.prepend(breakLeft2);
                }
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (sendButton) sendButton.click();
            }
        });
    }

    // Topnavdagi chat tugmasi
    if (topnavChat) {
        topnavChat.addEventListener('click', openChat);
    }

    // Dashboarddagi chat kartochkasi
    if (chatCard) {
        chatCard.addEventListener('click', openChat);
    }

    // Sahifa yuklanganda chat xabarlarini yuklash
    loadChatMessages();

    // Sahifa yuklanganda boshlang'ich bo'limni ko'rsatish
    // Odatda dashboard ko'rsatiladi, ammo sizning tuzilishingizga qarab o'zgartiring
    // showSection('dashboard'); // Agar "dashboard" div IDsi bo'lsa
});