document.addEventListener("DOMContentLoaded", function () {
    // Ensure all modals are closed on page load to prevent unintended visibility.
    closeModal('addYearModal');
    closeModal('addDepartmentModal');
    closeModal('addTeacherModal');
    closeModal('editModal');
    closeModal('addUserModal');
    closeModal('previewModal');
    closeModal('deleteConfirmationModal');

    // DOM Element References: Top Navigation
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const arrow = document.getElementById("arrow");
    const topNavItems = document.querySelectorAll(".top-nav > div[data-nav]");
    const topNavDropdownLinks = document.querySelectorAll(".dropdown-menu a[data-nav]");
    const contentCards = document.querySelectorAll("#dashboard-content .content_cards");

    // DOM Element References: Content Sections
    const contentSections = document.querySelectorAll(".content-section");

    // DOM Element References: Breadcrumbs
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

    // DOM Element References: List Sections (Years, Departments, Teachers) and their associated modals
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

    // DOM Element References: Global Modals
    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    let currentEditingElement = null; // Stores the DOM element being edited
    let currentEditingListType = null; // Stores the type of list ('years', 'departments', 'teachers')
    let currentEditingItemId = null; // Stores the ID of the item being edited

    const chatWindow = document.getElementById('chat-content');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const addUserButton = document.querySelector('.chatLeft_window .add-user-button');
    const addUserModal = document.getElementById('addUserModal');
    const newUsernameInput = document.getElementById('newUsername');
    const addUserBtn = document.getElementById('addUserBtn');
    const userListContainer = document.querySelector('.user-list');
    const sendButton = document.getElementById('sendButton');

    const previewModal = document.getElementById('previewModal');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');
    const previewDownloadButton = document.getElementById('previewDownloadButton');
    const previewImage = document.getElementById('previewImage');

    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let itemToDelete = null; // Stores the item object to be deleted
    let itemToDeleteListType = null; // Stores the list type of the item to be deleted

    let chatMessageCount = 0; // Counter for alternating message styles
    const CHAT_STORAGE_KEY = 'chatMessages'; // LocalStorage key for chat messages

    // --- Helper Functions ---

    // Closes a specified modal by setting its display to 'none'.
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Attaches click event listeners to all close buttons for modals.
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.onclick = (e) => {
            const modalId = e.target.dataset.modalClose;
            closeModal(modalId);
        };
    });

    // Loads data from LocalStorage.
    function loadData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    // Saves data to LocalStorage.
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Generates the next available ID for a new item in a data array.
    function getNextId(dataArray) {
        return dataArray.length > 0 ? Math.max(...dataArray.map(item => item.id)) + 1 : 1;
    }

    // Creates a card element for display in the lists.
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

        // Event listener for the active/inactive switch.
        card.querySelector('.switch input').onchange = (e) => {
            let currentData = loadData(listSections[type].localStorageKey);
            const index = currentData.findIndex(d => d.id === item.id);
            if (index !== -1) {
                currentData[index].active = e.target.checked;
                saveData(listSections[type].localStorageKey, currentData);
            }
        };

        // Event listeners for preview, edit, and delete icons.
        card.querySelector('.preview').onclick = () => openPreviewModal(item, type);
        card.querySelector('.edit').onclick = () => openEditModal(item, type, card.querySelector('.card-text'));
        card.querySelector('.delete').onclick = () => openDeleteConfirmationModal(item, type);

        return card;
    }

    // Loads and renders cards for a specific list type, with optional filtering.
    function loadCards(listType, filter = "") {
        const section = listSections[listType];
        if (!section || !section.cardList) return;

        section.cardList.innerHTML = ''; // Clear existing cards
        let dataToLoad = loadData(section.localStorageKey);

        const filteredData = dataToLoad.filter(item => {
            const searchText = (item.name || item.username || item.comment || '').toLowerCase();
            return searchText.includes(filter.toLowerCase());
        });

        filteredData.forEach(item => section.cardList.appendChild(createCardElement(item, listType)));
    }

    // Shows a specific content section and hides others.
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

    // Updates the breadcrumb text for the current section.
    function updateBreadcrumb(mainText, subText, currentSection) {
        const breadcrumb = breadcrumbs[currentSection];
        if (breadcrumb) {
            breadcrumb.main.innerText = mainText;
            breadcrumb.sub.innerText = subText;
        }
    }

    // Handles navigation clicks from top-nav and content cards.
    function handleNavClick(navType, navCategory = null) {
        // Deactivate all top navigation items
        topNavItems.forEach(item => item.classList.remove("active-nav"));
        topNavDropdownLinks.forEach(item => item.classList.remove("active-nav"));
        dropdownMenu.classList.remove("show-menu");
        arrow.classList.remove("rotate");

        let breadcrumbMainText = "";
        let breadcrumbSubText = "";
        let sectionToShow = "";

        // Determine which section to show and update active nav item/breadcrumb.
        if (navType === "dashboard") {
            sectionToShow = "dashboard-content";
            topNavItems[0].classList.add("active-nav");
        } else if (navType === "chat") {
            sectionToShow = "chat-content";
            topNavItems[2].classList.add("active-nav");
            loadChatMessages(); // Load messages when chat is opened
        } else if (navType === "profile") {
            sectionToShow = "profile-content";
            topNavItems[3].classList.add("active-nav");
        } else if (navCategory === "informations") { // For dropdown links
            topNavItems[1].classList.add("active-nav"); // Mark "Ma'lumotlar" as active
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
        } else { // For content cards on dashboard
            // Map content card data-nav to the corresponding section and breadcrumb
            if (navType === "years") {
                sectionToShow = "years-content";
                breadcrumbMainText = "Ma'lumotlar";
                breadcrumbSubText = "/ O‘quv yillari";
                loadCards('years');
            } else if (navType === "departments") {
                sectionToShow = "departments-content";
                breadcrumbMainText = "Ma'lumotlar";
                breadcrumbSubText = "/ Kafedralar";
                loadCards('departments');
                populateSelect(listSections.departments.selectOquvYili, loadData(listSections.years.localStorageKey), 'name');
            } else if (navType === "teachers") {
                sectionToShow = "teachers-content";
                breadcrumbMainText = "Ma'lumotlar";
                breadcrumbSubText = "/ O‘qituvchilar";
                loadCards('teachers');
                populateSelect(listSections.teachers.selectDepartment, loadData(listSections.departments.localStorageKey), 'name');
            } else if (navType === "chat") {
                sectionToShow = "chat-content";
                breadcrumbMainText = "Chat";
                breadcrumbSubText = "";
                loadChatMessages();
            }
        }
        showContentSection(sectionToShow);
        if (breadcrumbs[navType]) { // Update breadcrumb only if a matching entry exists
            updateBreadcrumb(breadcrumbMainText, breadcrumbSubText, navType);
        }
    }

    // Populates a select (dropdown) element with data from LocalStorage.
    function populateSelect(selectElement, dataArray, displayProperty) {
        if (!selectElement) return;
        selectElement.innerHTML = '<option value="">Tanlang...</option>'; // Default option
        dataArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[displayProperty];
            selectElement.appendChild(option);
        });
    }

    // Handles the back button click in breadcrumbs.
    function handleBackButtonClick(currentSection) {
        // If current section is one of the list views or chat/profile, go back to dashboard
        if (['years', 'departments', 'teachers', 'chat', 'profile'].includes(currentSection)) {
            handleNavClick('dashboard');
        }
    }
    
    // Attach click listeners to breadcrumb back arrows.
    for (const key in breadcrumbs) {
        if (breadcrumbs[key].back) {
            breadcrumbs[key].back.onclick = () => handleBackButtonClick(key);
        }
    }

    // Attach click listeners to top navigation items.
    topNavItems.forEach(item => {
        item.onclick = () => {
            handleNavClick(item.dataset.nav);
        };
    });

    // Attach click listeners to dropdown menu links.
    topNavDropdownLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault(); // Prevent default link behavior
            handleNavClick(link.dataset.nav, 'informations');
        };
    });

    // Attach click listeners to content cards on the dashboard.
    contentCards.forEach(card => {
        card.onclick = () => {
            handleNavClick(card.dataset.nav); // Use data-nav directly to trigger navigation
        };
    });

    // Toggle dropdown menu visibility.
    if (dropdownToggle) {
        dropdownToggle.onclick = (e) => {
            e.stopPropagation(); // Prevent document click from closing it immediately
            dropdownMenu.classList.toggle("show-menu");
            arrow.classList.toggle("rotate");
        };
    }

    // Close dropdown menu if clicked outside.
    document.onclick = (e) => {
        if (dropdownToggle && dropdownMenu && !dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show-menu");
            arrow.classList.remove("rotate");
        }
    };

    // --- Modal Specific Functions ---

    // Opens the edit modal and pre-fills the input.
    function openEditModal(item, type, textElement) {
        currentEditingElement = textElement;
        currentEditingListType = type;
        currentEditingItemId = item.id;
        editInput.value = textElement.textContent;
        editModal.style.display = 'flex';
    }

    // Saves the edited item back to LocalStorage.
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
            // Update the 'name' property for all list types
            currentData[index].name = newText;
            saveData(listSections[currentEditingListType].localStorageKey, currentData);
            currentEditingElement.textContent = newText; // Update the displayed text
            loadCards(currentEditingListType, listSections[currentEditingListType].search.value); // Re-render to ensure consistency
            closeModal('editModal');
            // Reset state
            currentEditingElement = null;
            currentEditingListType = null;
    currentEditingItemId = null;
        }
    };

    // Opens the delete confirmation modal.
    function openDeleteConfirmationModal(item, type) {
        itemToDelete = item;
        itemToDeleteListType = type;
        deleteConfirmationModal.style.display = 'flex';
    }

    // Confirms deletion and removes the item from LocalStorage.
    confirmDeleteBtn.onclick = () => {
        if (itemToDelete && itemToDeleteListType) {
            let currentData = loadData(listSections[itemToDeleteListType].localStorageKey);
            currentData = currentData.filter(d => d.id !== itemToDelete.id); // Filter out the deleted item
            saveData(listSections[itemToDeleteListType].localStorageKey, currentData);
            loadCards(itemToDeleteListType, listSections[itemToDeleteListType].search.value); // Re-render the list
            closeModal('deleteConfirmationModal');
            // Reset state
            itemToDelete = null;
            itemToDeleteListType = null;
        }
    };

    // Cancels deletion and closes the modal.
    cancelDeleteBtn.onclick = () => {
        closeModal('deleteConfirmationModal');
        // Reset state
        itemToDelete = null;
        itemToDeleteListType = null;
    };

    // Loop through each list section to attach specific event listeners for add, save, and search.
    for (const key in listSections) {
        const section = listSections[key];
        if (section.addButton) {
            // On '+' button click, show the respective add modal and clear inputs.
            section.addButton.onclick = () => {
                if (key === 'years') {
                    section.newInput.value = '';
                    section.addModal.style.display = 'flex';
                } else if (key === 'departments') {
                    section.newInputName.value = '';
                    section.newInputLogin.value = '';
                    section.newInputParol.value = '';
                    // Populate years for department's "O'quv yili" select
                    populateSelect(section.selectOquvYili, loadData(listSections.years.localStorageKey), 'name');
                    section.addModal.style.display = 'flex';
                } else if (key === 'teachers') {
                    section.newInputName.value = '';
                    section.newInputLogin.value = '';
                    section.newInputParol.value = '';
                    // Populate departments for teacher's "Kafedra" select
                    populateSelect(section.selectDepartment, loadData(listSections.departments.localStorageKey), 'name');
                    section.addModal.style.display = 'flex';
                }
            };
        }
        if (section.saveButton) {
            // On save button click, add new item to LocalStorage.
            section.saveButton.onclick = () => {
                let currentData = loadData(section.localStorageKey);
                const nextId = getNextId(currentData);
                let newItem = {};

                // Construct new item based on the section type.
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
                saveData(section.localStorageKey, currentData); // Save updated data
                loadCards(key, section.search.value); // Re-render cards
                closeModal(section.addModal.id); // Close the add modal
            };
        }
        if (section.search) {
            // On search input, filter and re-render cards.
            section.search.oninput = () => loadCards(key, section.search.value);
        }
    }

    // --- Chat Specific Functions ---

    // Handles adding a new user to the chat list.
    if (addUserButton) {
        addUserButton.onclick = () => {
            newUsernameInput.value = ''; // Clear input
            addUserModal.style.display = "flex"; // Show modal
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

    // Handles sending a new message.
    if (sendButton) {
        sendButton.onclick = () => {
            const messageText = messageInput.value.trim();
            if (messageText !== '') {
                const newMessage = document.createElement('div');
                newMessage.classList.add('message');
                newMessage.textContent = messageText;

                // Alternate message styles (left/right).
                if (chatMessageCount % 2 === 0) {
                    newMessage.classList.add('message-left');
                } else {
                    newMessage.classList.add('message-right');
                }

                messagesContainer.prepend(newMessage); // Add new message to the top for reverse display
                messageInput.value = '';
                saveChatMessage(messageText); // Save message to LocalStorage
                chatMessageCount++;
            }
        };
    }

    // Allows sending messages by pressing Enter key.
    if (messageInput) {
        messageInput.onkeypress = (event) => {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        };
    }

    // Saves a single chat message to LocalStorage.
    function saveChatMessage(message) {
        const messages = getChatMessages();
        messages.push(message); // Add new message
        saveData(CHAT_STORAGE_KEY, messages);
    }

    // Retrieves all chat messages from LocalStorage.
    function getChatMessages() {
        return loadData(CHAT_STORAGE_KEY);
    }

    // Loads and displays all chat messages.
    function loadChatMessages() {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = ''; // Clear existing messages
        const messages = getChatMessages();
        chatMessageCount = 0; // Reset counter for display

        // Display messages in reverse chronological order (newest at bottom visually)
        messages.slice().reverse().forEach(messageText => {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.textContent = messageText;

            // Apply alternating styles
            if (chatMessageCount % 2 === 0) {
                newMessage.classList.add('message-left');
            } else {
                newMessage.classList.add('message-right');
            }
            messagesContainer.appendChild(newMessage); // Append to display bottom-up
            chatMessageCount++;
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
    }

    // --- Preview Modal Functions ---

    // Opens the preview modal and displays item details.
    function openPreviewModal(item, type) {
        previewTitle.textContent = `${item.name || item.username || 'Tafsilotlar'}`; // Set modal title
        previewContent.innerHTML = ''; // Clear previous content
        previewDownloadButton.style.display = 'none'; // Hide download button by default
        previewImage.style.display = 'none'; // Hide image by default
        previewImage.src = ''; // Clear image source

        let detailHtml = ''; // HTML to display item details

        // Populate details based on the item type.
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

        // Handle image/file preview (if applicable, assuming properties like imageUrl, base64Data).
        // This part assumes you might add image/file handling to your data later.
        // For now, it just shows text details. If you integrate file uploads,
        // you'll need to define how base64Data and mimeType are stored.
        if (item.imageUrl) { 
            previewImage.src = item.imageUrl;
            previewImage.style.display = 'block';
        } else if (item.base64Data && item.isImage) { 
            previewImage.src = item.base64Data;
            previewImage.style.display = 'block';
        } else if (item.base64Data && item.fileName) { 
            // Create a Blob from base64 data to enable download
            const base64toBlob = (base64, mimeType) => {
                const byteCharacters = atob(base64.split(',')[1] || base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], { type: mimeType });
            };
            const getMimeType = (fileName) => {
                const ext = fileName.split('.').pop().toLowerCase();
                switch (ext) {
                    case 'pdf': return 'application/pdf';
                    case 'doc': return 'application/msword';
                    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    case 'xls': return 'application/vnd.ms-excel';
                    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    case 'txt': return 'text/plain';
                    case 'jpg': case 'jpeg': return 'image/jpeg';
                    case 'png': return 'image/png';
                    default: return 'application/octet-stream';
                }
            };
            previewDownloadButton.href = URL.createObjectURL(base64toBlob(item.base64Data, getMimeType(item.fileName)));
            previewDownloadButton.download = item.fileName;
            previewDownloadButton.style.display = 'block';
            detailHtml += `<p><strong>Fayl nomi:</strong> ${item.fileName}</p>`;
        }

        previewContent.innerHTML = detailHtml; // Insert detailed text
        previewModal.style.display = 'flex'; // Show the modal
    }

    // --- Initial Page Load ---
    // Sets the default active section to dashboard on page load.
    handleNavClick('dashboard');
});