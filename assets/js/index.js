$(document).ready(() => {
  getPathName();

  // Home page and Catalog options books
  function fillCatalogSection(node) {
    database.ref(node).on("value", function (snapshot) {
      localStorage.setItem(
        "Catalogs",
        JSON.stringify(Object.values(snapshot.val()))
      );
    });
    let catalogBooks = JSON.parse(localStorage.getItem("Catalogs"));
    $(".availableCatalogs div.row").html(
      catalogBooks.map((item) => {
        return `
       <div class="col-lg-4 col-md-6 col-12">
          <div>
              <p>${item.addTypeValue}</p>
          </div>
        </div>
       `;
      })
    );

    // Catalog options books
    $(".listBooks").html(
      catalogBooks.map((item) => {
        return `
      <li>${item.addTypeValue}</li>
      `;
      })
    );
  }

  // Click Go to Catalog Button
  $(".mainGoCatalog button").on("click", function () {
    console.log("clicked");
    window.location.pathname = "catalog.html";
  });

  //  Groups books by catalog
  function groupBooksByCatalog(node) {
    database.ref(node).on("value", function (snapshot) {
      console.log(Object.values(snapshot.val()));
    });
  }

  // Control Pathname
  function getPathName() {
    let pathName = window.location.pathname.split("/");
    let lastPartPathName = pathName[pathName.length - 1];

    $(`.navContainer a[href='./${lastPartPathName}']`).css({
      color: "var(--adminMainbgColor)",
      "text-decoration": "underline",
    });

    if (lastPartPathName === "index.html") {
      fillCatalogSection("typesBook");
    } else if (lastPartPathName === "catalog.html") {
      fillCatalogSection("typesBook");
      groupBooksByCatalog("book");
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
