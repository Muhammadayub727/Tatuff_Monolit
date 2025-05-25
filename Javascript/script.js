document.addEventListener("DOMContentLoaded", function () {
    closeModal('addYearModal');
    closeModal('addDepartmentModal');
    closeModal('addTeacherModal');
    closeModal('editModal');
    closeModal('addUserModal');
    closeModal('previewModal');
    closeModal('deleteConfirmationModal');

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const arrow = document.getElementById("arrow");
    const topNavItems = document.querySelectorAll(".top-nav > div[data-nav]");
    const topNavDropdownLinks = document.querySelectorAll(".dropdown-menu a[data-nav]");
    const dashboardContentCards = document.querySelectorAll("#dashboard-content .content_cards");

    const contentSections = document.querySelectorAll(".content-section");

    const breadcrumbs = {
        years: {
            main: document.getElementById("breadcrumbMain-years"),
            sub: document.getElementById("breadcrumbSub-years"),
            back: document.getElementById("backFromYears")
        },
        departments: {
            main: document.getElementById("breadcrumbMain-departments"),
            sub: document.getElementById("breadcrumbSub-departments"),
            back: document.getElementById("backFromDepartments")
        },
        teachers: {
            main: document.getElementById("breadcrumbMain-teachers"),
            sub: document.getElementById("breadcrumbSub-teachers"),
            back: document.getElementById("backFromTeachers")
        },
        chat: {
            main: document.getElementById("breadcrumbMain-chat"),
            sub: document.getElementById("breadcrumbSub-chat"),
            back: document.getElementById("backFromChat")
        },
        profile: {
            main: document.getElementById("breadcrumbMain-profile"),
            sub: document.getElementById("breadcrumbSub-profile"),
            back: document.getElementById("backFromProfile")
        }
    };

    const listSections = {
        years: {
            container: document.getElementById("years-content"),
            cardList: document.getElementById("cardList-years"),
            search: document.getElementById("search-years"),
            addButton: document.getElementById("addYearButton"),
            addModal: document.getElementById("addYearModal"),
            saveButton: document.getElementById("saveYear"),
            newInput: document.getElementById("newYearContent"),
            localStorageKey: 'yearsData'
        },
        departments: {
            container: document.getElementById("departments-content"),
            cardList: document.getElementById("cardList-departments"),
            search: document.getElementById("search-departments"),
            addButton: document.getElementById("addDepartmentButton"),
            addModal: document.getElementById("addDepartmentModal"),
            saveButton: document.getElementById("saveDepartment"),
            newInputName: document.getElementById("newDepartmentName"),
            newInputLogin: document.getElementById("newDepartmentLogin"),
            newInputParol: document.getElementById("newDepartmentParol"),
            selectOquvYili: document.getElementById("departmentOquvYili"),
            localStorageKey: 'departmentsData'
        },
        teachers: {
            container: document.getElementById("teachers-content"),
            cardList: document.getElementById("cardList-teachers"),
            search: document.getElementById("search-teachers"),
            addButton: document.getElementById("addTeacherButton"),
            addModal: document.getElementById("addTeacherModal"),
            saveButton: document.getElementById("saveTeacher"),
            newInputName: document.getElementById("newTeacherName"),
            newInputLogin: document.getElementById("newTeacherLogin"),
            newInputParol: document.getElementById("newTeacherParol"),
            selectDepartment: document.getElementById("teacherDepartment"),
            localStorageKey: 'teachersData'
        }
    };

    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    let currentEditingElement = null;
    let currentEditingListType = null;
    let currentEditingItemId = null;

    const previewModal = document.getElementById('previewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');
    const previewDownloadButton = document.getElementById('previewDownloadButton');
    const previewImage = document.getElementById('previewImage');

    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let itemToDelete = null;
    let itemToDeleteListType = null;

    const chatWindow = document.getElementById('chat-content');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const addUserButton = document.querySelector('.chatLeft_window .add-user-button');
    const addUserModal = document.getElementById('addUserModal');
    const newUsernameInput = document.getElementById('newUsername');
    const addUserBtn = document.getElementById('addUserBtn');
    const userListContainer = document.querySelector('.user-list');
    const sendButton = document.getElementById('sendButton');
    let chatMessageCount = 0;
    const CHAT_STORAGE_KEY = 'chatMessages';

    const profileNameInput = document.getElementById('profileName');
    const profileSurnameInput = document.getElementById('profileSurname');
    const profileLoginInput = document.getElementById('profileLogin');
    const profilePasswordInput = document.getElementById('profilePassword');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const PROFILE_STORAGE_KEY = 'userProfileData';

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.onclick = (e) => {
            const modalId = e.target.dataset.modalClose;
            closeModal(modalId);
        };
    });

    function loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error loading data for key "${key}":`, e);
            return [];
        }
    }

    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving data for key "${key}":`, e);
        }
    }

    function getNextId(dataArray) {
        return dataArray.length > 0 ? Math.max(...dataArray.map(item => item.id)) + 1 : 1;
    }

    function createCardElement(item, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;
        card.dataset.type = type;

        const cardText = item.name || item.username || item.comment || item;

        card.innerHTML = `
            <div class="card-left">
                <img src="./images/Bookmark.png" alt="icon" />
                <span class="card-text">${cardText}</span>
            </div>
            <div class="card-right">
                <label class="switch">
                    <input type="checkbox" ${item.active ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span class="icon-btn preview" title="Ko'rish">&#128065;</span>
                <span class="icon-btn edit" title="Tahrirlash">&#9998;</span>
                <span class="icon-btn delete" title="O'chirish">&#128465;</span>
            </div>
        `;

        card.querySelector('.switch input').onchange = (e) => {
            let currentData = loadData(listSections[type].localStorageKey);
            const index = currentData.findIndex(d => d.id === item.id);
            if (index !== -1) {
                currentData[index].active = e.target.checked;
                saveData(listSections[type].localStorageKey, currentData);
            }
        };

        card.querySelector('.preview').onclick = () => openPreviewModal(item, type);
        card.querySelector('.edit').onclick = () => openEditModal(item, type, card.querySelector('.card-text'));
        card.querySelector('.delete').onclick = () => openDeleteConfirmationModal(item, type);

        return card;
    }

    function loadCards(listType, filter = "") {
        const section = listSections[listType];
        if (!section || !section.cardList) return;

        section.cardList.innerHTML = '';
        let dataToLoad = loadData(section.localStorageKey);

        const filteredData = dataToLoad.filter(item => {
            const searchText = (item.name || item.username || item.comment || '').toLowerCase();
            return searchText.includes(filter.toLowerCase());
        });

        filteredData.forEach(item => section.cardList.appendChild(createCardElement(item, listType)));
    }

    function showContentSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.add("hidden-section");
            section.classList.remove("active-section");
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove("hidden-section");
            targetSection.classList.add("active-section");
        }
    }

    function updateBreadcrumb(mainText, subText, currentSection) {
        const breadcrumb = breadcrumbs[currentSection];
        if (breadcrumb) {
            breadcrumb.main.innerText = mainText;
            breadcrumb.sub.innerText = subText;
        }
    }

    function populateSelect(selectElement, dataArray, displayProperty) {
        if (!selectElement) return;
        selectElement.innerHTML = '<option value="">Tanlang...</option>';
        dataArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[displayProperty];
            selectElement.appendChild(option);
        });
    }

    function loadProfile() {
        const profileData = loadData(PROFILE_STORAGE_KEY)[0] || {};
        if (profileNameInput) profileNameInput.value = profileData.name || '';
        if (profileSurnameInput) profileSurnameInput.value = profileData.surname || '';
        if (profileLoginInput) profileLoginInput.value = profileData.login || '';
        if (profilePasswordInput) profilePasswordInput.value = profileData.password || '';
    }

    function saveProfile() {
        const profileData = {
            name: profileNameInput ? profileNameInput.value.trim() : '',
            surname: profileSurnameInput ? profileSurnameInput.value.trim() : '',
            login: profileLoginInput ? profileLoginInput.value.trim() : '',
            password: profilePasswordInput ? profilePasswordInput.value.trim() : ''
        };
        saveData(PROFILE_STORAGE_KEY, [profileData]);
        alert("Profil ma'lumotlari saqlandi!");
    }

    function handleNavClick(navType) {
        topNavItems.forEach(item => {
            item.classList.remove("active-nav");
            if (item.dataset.nav === navType) {
                item.classList.add("active-nav");
            }
        });
        topNavDropdownLinks.forEach(link => link.classList.remove("active-nav"));
        dropdownMenu.classList.remove("show-menu");
        arrow.classList.remove("rotate");

        let breadcrumbMainText = "";
        let breadcrumbSubText = "";
        let sectionToShow = "";
        let currentBreadcrumbSection = navType;

        if (navType === "dashboard") {
            sectionToShow = "dashboard-content";
        } else if (navType === "chat") {
            sectionToShow = "chat-content";
            breadcrumbMainText = "Chat";
            loadChatMessages();
        } else if (navType === "profile") {
            sectionToShow = "profile-content";
            breadcrumbMainText = "Profile";
            loadProfile();
        } else if (['years', 'departments', 'teachers'].includes(navType)) {
            const dropdownNav = document.querySelector('.dropdown-wrapper > .dropdown-toggle');
            if (dropdownNav) dropdownNav.classList.add("active-nav");
            
            breadcrumbMainText = "Ma'lumotlar";
            if (navType === "years") {
                sectionToShow = "years-content";
                breadcrumbSubText = "/ O‘quv yillari";
                loadCards('years');
            } else if (navType === "departments") {
                sectionToShow = "departments-content";
                breadcrumbSubText = "/ Kafedralar";
                loadCards('departments');
                populateSelect(listSections.departments.selectOquvYili, loadData(listSections.years.localStorageKey), 'name');
            } else if (navType === "teachers") {
                sectionToShow = "teachers-content";
                breadcrumbSubText = "/ O‘qituvchilar";
                loadCards('teachers');
                populateSelect(listSections.teachers.selectDepartment, loadData(listSections.departments.localStorageKey), 'name');
            }
        }

        showContentSection(sectionToShow);
        if (breadcrumbs[currentBreadcrumbSection]) {
            updateBreadcrumb(breadcrumbMainText, breadcrumbSubText, currentBreadcrumbSection);
        }
    }

    function handleBackButtonClick(currentSection) {
        if (['years', 'departments', 'teachers', 'chat', 'profile'].includes(currentSection)) {
            handleNavClick('dashboard');
        }
    }
    
    for (const key in breadcrumbs) {
        if (breadcrumbs[key].back) {
            breadcrumbs[key].back.onclick = () => handleBackButtonClick(key);
        }
    }

    topNavItems.forEach(item => {
        item.onclick = () => {
            handleNavClick(item.dataset.nav);
        };
    });

    topNavDropdownLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            handleNavClick(link.dataset.nav);
        };
    });

    dashboardContentCards.forEach(card => {
        card.onclick = () => {
            handleNavClick(card.dataset.nav);
        };
    });

    if (dropdownToggle) {
        dropdownToggle.onclick = (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show-menu");
            arrow.classList.toggle("rotate");
        };
    }

    document.onclick = (e) => {
        if (dropdownToggle && dropdownMenu && !dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show-menu");
            arrow.classList.remove("rotate");
        }
    };

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal('addYearModal');
            closeModal('addDepartmentModal');
            closeModal('addTeacherModal');
            closeModal('editModal');
            closeModal('addUserModal');
            closeModal('previewModal');
            closeModal('deleteConfirmationModal');
        }
    });

    function openEditModal(item, type, textElement) {
        currentEditingElement = textElement;
        currentEditingListType = type;
        currentEditingItemId = item.id;
        editInput.value = textElement.textContent;
        editModal.style.display = 'flex';
    }

    if (saveEditBtn) {
        saveEditBtn.onclick = () => {
            if (!currentEditingElement || !currentEditingListType || currentEditingItemId === null) return;

            const newText = editInput.value.trim();
            if (!newText) {
                alert('Iltimos, yangi matnni kiriting!');
                return;
            }

            let currentData = loadData(listSections[currentEditingListType].localStorageKey);
            const index = currentData.findIndex(item => item.id === currentEditingItemId);

            if (index !== -1) {
                currentData[index].name = newText;
                saveData(listSections[currentEditingListType].localStorageKey, currentData);
                currentEditingElement.textContent = newText;
                loadCards(currentEditingListType, listSections[currentEditingListType].search.value);
                closeModal('editModal');
                currentEditingElement = null;
                currentEditingListType = null;
                currentEditingItemId = null;
            }
        };
    }

    function openDeleteConfirmationModal(item, type) {
        itemToDelete = item;
        itemToDeleteListType = type;
        deleteConfirmationModal.style.display = 'flex';
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => {
            if (itemToDelete && itemToDeleteListType) {
                let currentData = loadData(listSections[itemToDeleteListType].localStorageKey);
                currentData = currentData.filter(d => d.id !== itemToDelete.id);
                saveData(listSections[itemToDeleteListType].localStorageKey, currentData);
                loadCards(itemToDeleteListType, listSections[itemToDeleteListType].search.value);
                closeModal('deleteConfirmationModal');
                itemToDelete = null;
                itemToDeleteListType = null;
            }
        };
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.onclick = () => {
            closeModal('deleteConfirmationModal');
            itemToDelete = null;
            itemToDeleteListType = null;
        };
    }

    for (const key in listSections) {
        const section = listSections[key];
        if (section.addButton) {
            section.addButton.onclick = () => {
                if (key === 'years') {
                    section.newInput.value = '';
                    section.addModal.style.display = 'flex';
                } else if (key === 'departments') {
                    section.newInputName.value = '';
                    section.newInputLogin.value = '';
                    section.newInputParol.value = '';
                    populateSelect(section.selectOquvYili, loadData(listSections.years.localStorageKey), 'name');
                    section.addModal.style.display = 'flex';
                } else if (key === 'teachers') {
                    section.newInputName.value = '';
                    section.newInputLogin.value = '';
                    section.newInputParol.value = '';
                    populateSelect(section.selectDepartment, loadData(listSections.departments.localStorageKey), 'name');
                    section.addModal.style.display = 'flex';
                }
            };
        }
        if (section.saveButton) {
            section.saveButton.onclick = () => {
                let currentData = loadData(section.localStorageKey);
                const nextId = getNextId(currentData);
                let newItem = {};

                if (key === 'years') {
                    const newYear = section.newInput.value.trim();
                    if (!newYear) { alert("Iltimos, o'quv yilini kiriting!"); return; }
                    newItem = { id: nextId, name: newYear, active: true };
                } else if (key === 'departments') {
                    const name = section.newInputName.value.trim();
                    const oquvYiliId = section.selectOquvYili.value;
                    const login = section.newInputLogin.value.trim();
                    const parol = section.newInputParol.value.trim();
                    if (!name || !oquvYiliId || !login || !parol) { alert("Iltimos, barcha maydonlarni to'ldiring!"); return; }
                    const oquvYiliName = loadData(listSections.years.localStorageKey).find(y => y.id == oquvYiliId)?.name || '';
                    newItem = { id: nextId, name: name, oquvYiliId: parseInt(oquvYiliId), oquvYiliName: oquvYiliName, login: login, parol: parol, active: true };
                } else if (key === 'teachers') {
                    const name = section.newInputName.value.trim();
                    const departmentId = section.selectDepartment.value;
                    const login = section.newInputLogin.value.trim();
                    const parol = section.newInputParol.value.trim();
                    if (!name || !departmentId || !login || !parol) { alert("Iltimos, barcha maydonlarni to'ldiring!"); return; }
                    const departmentName = loadData(listSections.departments.localStorageKey).find(d => d.id == departmentId)?.name || '';
                    newItem = { id: nextId, name: name, departmentId: parseInt(departmentId), departmentName: departmentName, login: login, parol: parol, active: true };
                }

                currentData.push(newItem);
                saveData(section.localStorageKey, currentData);
                loadCards(key, section.search.value);
                closeModal(section.addModal.id);
            };
        }
        if (section.search) {
            section.search.oninput = () => loadCards(key, section.search.value);
        }
    }

    if (addUserButton) {
        addUserButton.onclick = () => {
            newUsernameInput.value = '';
            addUserModal.style.display = "flex";
        };
    }

    if (addUserBtn) {
        addUserBtn.onclick = () => {
            const newUsername = newUsernameInput.value.trim();
            if (newUsername !== '') {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
                userItem.textContent = newUsername;
                userListContainer.appendChild(userItem);
                newUsernameInput.value = '';
                closeModal('addUserModal');
            }
        };
    }

    if (sendButton) {
        sendButton.onclick = () => {
            const messageText = messageInput.value.trim();
            if (messageText !== '') {
                const newMessage = document.createElement('div');
                newMessage.classList.add('message');
                newMessage.textContent = messageText;

                if (chatMessageCount % 2 === 0) {
                    newMessage.classList.add('message-left');
                } else {
                    newMessage.classList.add('message-right');
                }

                messagesContainer.appendChild(newMessage);
                messageInput.value = '';
                saveChatMessage(messageText);
                chatMessageCount++;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        };
    }

    if (messageInput) {
        messageInput.onkeypress = (event) => {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        };
    }

    function saveChatMessage(message) {
        const messages = getChatMessages();
        messages.push(message);
        saveData(CHAT_STORAGE_KEY, messages);
    }

    function getChatMessages() {
        return loadData(CHAT_STORAGE_KEY);
    }

    function loadChatMessages() {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        const messages = getChatMessages();
        chatMessageCount = 0;

        messages.forEach(messageText => {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.textContent = messageText;

            if (chatMessageCount % 2 === 0) {
                newMessage.classList.add('message-left');
            } else {
                newMessage.classList.add('message-right');
            }
            messagesContainer.appendChild(newMessage);
            chatMessageCount++;
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function openPreviewModal(item, type) {
        previewTitle.textContent = `${item.name || item.username || 'Tafsilotlar'}`;
        previewContent.innerHTML = '';
        previewDownloadButton.style.display = 'none';
        previewImage.style.display = 'none';
        previewImage.src = '';

        let detailHtml = '';

        if (type === 'years') {
            detailHtml = `
                <p><strong>Nomi:</strong> ${item.name}</p>
                <p><strong>Holati:</strong> ${item.active ? 'Faol' : 'Nofaol'}</p>
            `;
        } else if (type === 'departments') {
            detailHtml = `
                <p><strong>Nomi:</strong> ${item.name}</p>
                <p><strong>O'quv yili:</strong> ${item.oquvYiliName}</p>
                <p><strong>Login:</strong> ${item.login}</p>
                <p><strong>Parol:</strong> ${item.parol}</p>
                <p><strong>Holati:</strong> ${item.active ? 'Faol' : 'Nofaol'}</p>
            `;
        } else if (type === 'teachers') {
            detailHtml = `
                <p><strong>Ism Familiya:</strong> ${item.name}</p>
                <p><strong>Kafedra:</strong> ${item.departmentName}</p>
                <p><strong>Login:</strong> ${item.login}</p>
                <p><strong>Parol:</strong> ${item.parol}</p>
                <p><strong>Holati:</strong> ${item.active ? 'Faol' : 'Nofaol'}</p>
            `;
        }
        
        previewContent.innerHTML = detailHtml;
        previewModal.style.display = 'flex';
    }

    if (saveProfileBtn) {
        saveProfileBtn.onclick = saveProfile;
    }

    handleNavClick('dashboard');
});