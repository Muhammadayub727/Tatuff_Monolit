document.addEventListener("DOMContentLoaded", function () {
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
});
const cards = document.querySelectorAll(".content_cards");
const breadcrumbBox = document.getElementById("breadcrumbBox");
const breadcrumbSub = document.getElementById("breadcrumbSub");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.style.display = "none");
    breadcrumbBox.style.display = "flex";
    const title = card.querySelector(".content_title").innerText;
    breadcrumbSub.innerText = `/ ${title}`;
  });
});

// document.getElementById("go_back").addEventListener("click", function () {
//     window.history.back();
//   });
document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll("[data-nav]");
  
    navItems.forEach(item => {
      item.addEventListener("click", function () {
        navItems.forEach(el => el.classList.remove("active-nav"));
        this.classList.add("active-nav");
      });
    });
  });
  