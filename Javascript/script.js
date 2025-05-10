document.addEventListener("DOMContentLoaded", function () {
  // ==== DROPDOWN FUNCTIONALITY ====
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const arrow = document.getElementById("arrow");

  if (dropdownToggle) {
      dropdownToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          dropdownMenu.classList.toggle("show-menu");
          arrow.classList.toggle("rotate");
      });
  }

  document.addEventListener("click", function (e) {
      if (dropdownToggle && !dropdownToggle.contains(e.target)) {
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

  // ==== CONTENT CARDS CLICK FUNCTIONALITY ====
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
          const index = data.indexOf(textSpan.textContent);
          if (index > -1) {
              data.splice(index, 1);
              saveDataToLocalStorage();
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
      cardList.innerHTML = '';
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData) {
          data = JSON.parse(storedData);
      }
      data.forEach(item => {
          if (item.toLowerCase().includes(filter.toLowerCase())) {
              cardList.appendChild(createCard(item));
          }
      });
  }

  searchInput.addEventListener('input', () => {
      loadCards(searchInput.value);
  });

  loadCards();

  contentCards.forEach((card) => {
      card.addEventListener("click", () => {
          // Barcha content cardlarni yashirish
          contentCards.forEach(c => c.style.display = "none");

          // Breadcrumb va boshqa blocklarni ko‘rsatish
          breadcrumbBox.style.display = "flex";

          const title = card.querySelector(".content_title").innerText;
          breadcrumbMain.innerText = title;
          breadcrumbSub.innerText = `/ ${title}`;

          if (title === "O'quv yillari") {
              teachersYears.style.display = "block";
          } else {
              teachersYears.style.display = "none"; // O'quv yillari emas bo'lsa yashirish
              // Bu yerda boshqa contentni ko'rsatish yoki 404 xabarini chiqarish mumkin
              cardList.innerHTML = '<p>Hozircha bu bo‘limda ma’lumot yo‘q.</p>'; // Misol uchun
          }
      });
  });

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
          data.push(newText);
          saveDataToLocalStorage();
          const newCard = createCard(newText);
          cardList.appendChild(newCard);
          newContentInput.value = '';
          addCardModal.style.display = 'none';
      } else {
          alert('Iltimos, yangi o‘quv yilini kiriting!');
      }
  });

  newContentInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          saveCardButton.click();
      }
  });

  // ==== EDIT CARD MODAL FUNCTIONALITY ====
  saveEditBtn.addEventListener('click', () => {
      if (currentEditingSpan) {
          const index = data.indexOf(currentEditingSpan.textContent);
          if (index > -1) {
              data[index] = editInput.value;
              saveDataToLocalStorage();
          }
          currentEditingSpan.textContent = editInput.value;
          editModal.style.display = 'none';
          loadCards(searchInput.value);
          currentEditingSpan = null;
      }
  });

  closeEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
      currentEditingSpan = null;
  });
});