$(document).ready(() => {
  getPathName();

  // Home page
  function fillCatalogSection() {}

  // Control Pathname
  function getPathName() {
    let pathName = window.location.pathname.split("/");
    let lastPartPathName = pathName[pathName.length - 1];

    $(`.navContainer a[href='./${lastPartPathName}']`).css({
      color: "var(--adminMainbgColor)",
      "text-decoration": "underline",
    });

    if (lastPartPathName === "index.html") {
      fillCatalogSection("");
    } else if (lastPartPathName === "catalog.html") {
    } else if (lastPartPathName === "store.html") {
    } else if (lastPartPathName === "contact.html") {
    } else if (lastPartPathName === "search.html") {
    } else {
      return;
    }
  }

  // Control links
  $("a[aria-disabled='true']").on("click", () => {
    alert("These Services are no longer available or are being updated");
  });
});
