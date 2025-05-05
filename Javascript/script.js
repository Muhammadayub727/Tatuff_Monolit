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
