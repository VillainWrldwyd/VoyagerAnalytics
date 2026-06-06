// Page Loader
// Loader hide on page load
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});

 // Remove skeleton after loading
window.addEventListener("load", () => {
    document.querySelectorAll('.skeleton').forEach(el => {
      el.classList.remove('skeleton');
    });
});