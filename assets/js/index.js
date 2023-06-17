$(document).ready(() => {
  let catalogBooks = null;

  getPathName();
  // Home page and Catalog options books
  function fillCatalogSection(node) {
    database.ref(node).on("value", function (snapshot) {
      localStorage.setItem(
        "Catalogs",
        JSON.stringify(Object.values(snapshot.val()))
      );

      catalogBooks = JSON.parse(localStorage.getItem("Catalogs"));
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

      $(document).on(
        "click",
        ".availableCatalogs div.row div div",
        function () {
          window.location.pathname = "catalog.html";
        }
      );

      // Catalog options books
      $(".listBooks").html(
        catalogBooks.map((item) => {
          return `
      <li>${item.addTypeValue}</li>
      `;
        })
      );

      // Add Slick Section
      $(".bookLibrarySection").after(
        catalogBooks.map(function (item) {
          return `
          <section class="typeOfBooksSection">
          <div class="bestellerTitle d-flex justify-content-center ${item.addTypeValue}">
            <h2>${item.addTypeValue}</h2>
          </div>

          <div class="d-flex justify-content-center">
            <div class="previousArrow">
              <img src="./assets/image/icon/previousArrow.svg" alt="arrow" />
            </div>
            <div id="${item.addTypeValue}" class="d-flex justify-content-between bookLibraryContainer">
            </div>
            <div class="nextArrow">
              <img src="./assets/image/icon/nextArrow.svg" alt="arrow" />
            </div>
          </div>
        </section>
          `;
        })
      );
    });
  }

  // Click Go to Catalog Button
  $(".mainGoCatalog button").on("click", function () {
    window.location.pathname = "catalog.html";
  });

  //  Groups books by catalog
  function groupBooksByCatalog(node) {
    database.ref(node).on("value", function (snapshot) {
      localStorage.setItem(
        "allBooks",
        JSON.stringify(Object.entries(snapshot.val()))
      );

      playSlickShow(
        ".bookLibraryContainerAllBooks",
        JSON.parse(localStorage.getItem("allBooks"))
      );
      for (let i = 0; i < catalogBooks.length; i++) {
        playSlickShow(
          `#${catalogBooks[i].addTypeValue}`,
          JSON.parse(localStorage.getItem("allBooks")).filter((item) => {
            if (item[1].bookTypeValue === catalogBooks[i].addTypeValue) {
              return item;
            }
          })
        );
      }
    });
  }

  // Start Slick Show
  function playSlickShow(section, dataBook) {
    $(section).html(
      dataBook.map((item) => {
        return `
        <div>
        <div class="card libraryCards" style="width:184px !important">
        <div class="d-flex justify-content-center">
                <img
                  src=${item[1].bookImageUrl1Value}
                  class="card-img-top"
                  alt="book"
                  style="width: 134px; height: 190px; object-fit: cover;"
                />
        </div>
                  <div class="card-body libraryCardsBody">
                  <h5 class="card-title">${
                    item[1].bookNameValue.length > 10
                      ? item[1].bookNameValue.slice(0, 11) + "..."
                      : item[1].bookNameValue
                  }</h5>
                  <p class="card-text">${
                    item[1].authorNameValue.length > 10
                      ? item[1].authorNameValue.slice(0, 11) + "..."
                      : item[1].authorNameValue
                  }</p>
                  <button class="readMore" id=${item[0]}>
                    <p>READ MORE</p>
                  </button>
                </div>
        </div>
        </div>
        `;
      })
    );
    if (dataBook.length > 5) {
      $(section).slick({
        infinite: true,
        autoplay: true,
        slidesToShow: 5,
        speed: 700,
        prevArrow: $(".previousArrow"),
        nextArrow: $(".nextArrow"),
      });
      $(section).next().removeClass("d-none");
      $(section).prev().removeClass("d-none");
      $(section).next().addClass("d-flex");
      $(section).prev().addClass("d-flex");
    } else if (dataBook.length <= 5) {
      $(section).next().addClass("d-none");
      $(section).prev().addClass("d-none");
      $(section).removeClass("justify-content-between");
      $(section).addClass("justify-content-center");
      $(section).children("div").css({
        margin: "0 29px",
      });
      if (dataBook.length == 0) {
        $(section).html(`
          <div>
            <div class="card libraryCards">
              <div class="d-flex justify-content-center">
                <img
                  src="./assets/image/Error.png"
                  class="card-img-top"
                  alt="book"
                  style="width: 190px; height: 190px; object-fit: cover;"
                />
              </div>
              <div class="card-body libraryCardsBody">
                <h5 class="card-title">Error</h5>
                <p class="card-text">Error</p>
                <button>
                  <p>READ MORE</p>
                </button>
              </div>
            </div>
          </div>
          `);
      }
    }
  }

  // Click Lists Book
  $(document).on("click", ".listBooks li", function (e) {
    $(".listBooks li").css({
      color: "var(--homeMainTextColor)",
      "text-decoration": "none",
    });
    $(this).css({
      color: "var(--inputColor)",
      "text-decoration": "underline",
    });
    scrolling(this.innerHTML);
  });

  // Scroll Click Book
  function scrolling(link) {
    document.querySelector(`.${link}`).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Control Pathname
  function getPathName() {
    let pathName = window.location.pathname.split("/");
    let lastPartPathName = pathName[pathName.length - 1];

    $(`.navContainer a[href='./${lastPartPathName}']`).css({
      color: "var(--inputColor)",
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

  // Click Read More Button
  $(document).on("click", ".readMore", function () {
    let clickedBookId = $(this).attr("id");
    $(".bookLibrarySection").fadeOut(120);
    $(".typeOfBooksSection").fadeOut(120);
    $(".bookOptionsSection").fadeOut(120);
    $(".infoAndImageBook").fadeIn(120);
    $(".anonimMessage").fadeIn(120);
    renderClickedBookInfo(clickedBookId);
  });

  function renderClickedBookInfo(id) {
    let clicedBookData = JSON.parse(localStorage.getItem("allBooks")).find(
      (item) => {
        if (item[0] === id) {
          return item;
        }
      }
    );
    console.log(clicedBookData);
    $(".infoBook h2").html(clicedBookData[1].bookNameValue);
    $(".infoBook h3").html(clicedBookData[1].authorNameValue);
    $(".infoBook p:last-child").html(clicedBookData[1].descriptionValue);
    $(".imageTargetBook img").attr("src", clicedBookData[1].bookImageUrl1Value);
  }

  // Back Button
  $(document).on("click", ".backButton", function () {
    // $(".infoAndImageBook").fadeOut(120);
    // $(".anonimMessage").fadeOut(120);
    // $(".bookLibrarySection").fadeIn(120);
    // $(".typeOfBooksSection").fadeIn(120);
    // $(".bookOptionsSection").fadeIn(120);
    window.location.reload();
  });

  // Open Close Button
  $("#openCloseHomeImg").on("click", function () {
    $(".clickBgShadow").addClass("d-block");
  });

  // Close Button
  $(".closeButtonHomePage").on("click", function () {
    $(".clickBgShadow").removeClass("d-block");
    $(".clickBgShadow").addClass("d-none");
  });

  // Control links
  $("a[aria-disabled='true']").on("click", () => {
    alert("These Services are no longer available or are being updated");
  });
});
