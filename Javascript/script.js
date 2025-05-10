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

 const data = [
  "2024-2025 o‘quv yili",
  "2023-2024 o‘quv yili",
  "2022-2023 o‘quv yili",
  "2021-2022 o‘quv yili"
];

const cardList = document.getElementById('cardList');
const searchInput = document.getElementById('search');

const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const closeBtn = document.querySelector('.close-btn');

let currentEditingSpan = null; // global saqlanadi

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

  deleteBtn.addEventListener('click', () => card.remove());

  editBtn.addEventListener('click', () => {
    currentEditingSpan = textSpan;
    editInput.value = textSpan.textContent;
    editModal.style.display = 'flex';
  });

  return card;
}

saveEditBtn.addEventListener('click', () => {
  if (currentEditingSpan) {
    currentEditingSpan.textContent = editInput.value;
    editModal.style.display = 'none';
  }
});

closeBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
});

function loadCards(filter = "") {
  cardList.innerHTML = '';
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
