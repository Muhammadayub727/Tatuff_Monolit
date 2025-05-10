document.addEventListener("DOMContentLoaded", function () {
  // ==== DROPDOWN FUNCTIONALITY ====
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const arrow = document.getElementById("arrow");

  dropdownToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show-menu");
    arrow.classList.toggle("rotate");
  });

  document.addEventListener("click", function (e) {
    if (!dropdownToggle.contains(e.target)) {
      dropdownMenu.classList.remove("show-menu");
      arrow.classList.remove("rotate");
    }
  });

  // ==== NAVIGATION ACTIVE CLASS ====
  const navItems = document.querySelectorAll("[data-nav]");
  navItems.forEach(item => {
    item.addEventListener("click", function () {
      navItems.forEach(el => el.classList.remove("active-nav"));
      this.classList.add("active-nav");
    });
  });

  // ==== CARD CLICK FUNCTIONALITY ====
  const cards = document.querySelectorAll(".content_cards");
  const breadcrumbBox = document.getElementById("breadcrumbBox");
  const breadcrumbSub = document.getElementById("breadcrumbSub");
  const breadcrumbMain = document.getElementById("breadcrumbMain");
  const teachersYears = document.getElementById("teachersYears");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Barcha cardlarni yashirish
      cards.forEach(c => c.style.display = "none");

      // Breadcrumb va boshqa blocklarni ko‘rsatish
      breadcrumbBox.style.display = "flex";
      teachersYears.style.display = "block";

      // Breadcrumb matnlarini yangilash
      const title = card.querySelector(".content_title").innerText;
      breadcrumbMain.innerText = title;
      breadcrumbSub.innerText = `/ ${title}`;
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const addCardButton = document.getElementById('addCardButton');
  const addCardModal = document.getElementById('addCardModal');
  const closeAddModalButton = addCardModal.querySelector('.close-button');
  const saveCardButton = document.getElementById('saveCard');
  const cardList = document.getElementById('cardList');
  const newContentInput = document.getElementById('newContent');

  const searchInput = document.getElementById('search');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const closeEditBtn = editModal.querySelector('.close-btn');
  let currentEditingSpan = null;
  const localStorageKey = 'cardListData';
  let data = JSON.parse(localStorage.getItem(localStorageKey)) || []; // Load data from localStorage

  // Function to save data to localStorage
  function saveDataToLocalStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  // Function to create a new card element with actions
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
          const index = data.indexOf(textSpan.textContent);
          if (index > -1) {
              data.splice(index, 1);
              saveDataToLocalStorage(); // Save after deletion
          }
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
      cardList.innerHTML = ''; // Clear the list before adding filtered items
      data.forEach(item => {
          if (item.toLowerCase().includes(filter.toLowerCase())) {
              cardList.appendChild(createCard(item));
          }
      });
  }

  searchInput.addEventListener('input', () => {
      loadCards(searchInput.value);
  });

  loadCards(); // Load initial cards from localStorage

  // ==== ADD NEW CARD MODAL FUNCTIONALITY ====
  addCardButton.addEventListener('click', () => {
      addCardModal.style.display = 'flex';
  });

  closeAddModalButton.addEventListener('click', () => {
      addCardModal.style.display = 'none';
      newContentInput.value = '';
  });

  window.addEventListener('click', (e) => {
      if (e.target === addCardModal) {
          addCardModal.style.display = 'none';
          newContentInput.value = '';
      }
      if (e.target === editModal) {
          editModal.style.display = 'none';
      }
  });

  saveCardButton.addEventListener('click', () => {
      const newText = newContentInput.value.trim();
      if (newText !== '') {
          data.push(newText); // Add new text to the data array
          saveDataToLocalStorage(); // Save after adding
          const newCard = createCard(newText); // Create the card element
          cardList.appendChild(newCard); // Append the new card to the end
          newContentInput.value = '';
          addCardModal.style.display = 'none';
      } else {
          alert('Please enter some text for the new item.');
      }
  });

  // Allow "Enter" key to trigger the save button in the add modal
  newContentInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          saveCardButton.click(); // Trigger the save button's click event
      }
  });

  // ==== EDIT CARD MODAL FUNCTIONALITY ====
  saveEditBtn.addEventListener('click', () => {
      if (currentEditingSpan) {
          const index = data.indexOf(currentEditingSpan.textContent);
          if (index > -1) {
              data[index] = editInput.value; // Update data array
              saveDataToLocalStorage(); // Save after editing
          }
          currentEditingSpan.textContent = editInput.value;
          editModal.style.display = 'none';
          loadCards(); // Reload to reflect the edit
          currentEditingSpan = null;
      }
  });

  closeEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
      currentEditingSpan = null;
  });
});