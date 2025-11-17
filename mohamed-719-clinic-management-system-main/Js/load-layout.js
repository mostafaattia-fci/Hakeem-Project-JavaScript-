function loadComponent(id, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load " + file);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
      console.error(error);
    });
}

// Load header and footer on all pages
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
});
