$(document).ready(() => {
  let catalogBooks = null;
  let clickedBookId = null;
  let path = window.location.pathname;
  let truepath = null;
  if (path.includes("index.html")) {
    truepath = path.slice(0, path.length - 10);
  } else {
    truepath = path;
  }
  let widthPage = window.innerWidth;
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
          window.location.pathname = truepath + "catalog.html";
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
    window.location.pathname = truepath + "catalog.html";
  });

  //  Groups books by catalog
  function groupBooksByCatalog(node) {
    database.ref(node).on("value", function (snapshot) {
      localStorage.setItem(
        "allBooks",
        JSON.stringify(Object.entries(snapshot.val()))
      );

      playSlickShow(
        "#bookLibraryContainerAllBooks",
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
        if (item[1].bookTypeValue === "New") {
          return `
        <div class="position-relative">
           
        <div class="position-absolute newBookTitle" style="z-index: 999">
          <h2>New</h2>
        </div>

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
        } else {
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
        }
      })
    );

    if (widthPage >= 992) {
      if (dataBook.length > 5) {
        $(section).slick({
          infinite: true,
          autoplay: true,
          slidesToShow: 5,
          speed: 700,
          prevArrow: $(".previousArrow"),
          nextArrow: $(".nextArrow"),
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
              },
            },
          ],
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
                <button class='errorReadMore'>
                  <p>READ MORE</p>
                </button>
              </div>
            </div>
          </div>
          `);
        }
      }
    } else {
      $(section).slick({
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        speed: 700,
        prevArrow: $(".previousArrow"),
        nextArrow: $(".nextArrow"),
      });
      // $(section).next().removeClass("d-none");
      // $(section).prev().removeClass("d-none");
      // $(section).next().addClass("d-flex");
      // $(section).prev().addClass("d-flex");
      $(section).removeClass("justify-content-between");
      $(section).addClass("justify-content-center");
      $(".libraryCards").addClass("m-auto");

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
              <button class='errorReadMore'>
                <p>READ MORE</p>
              </button>
            </div>
          </div>
        </div>
        `);
      }
    }

    $("#previousArrowAllbooks").on("click", function () {
      $("#bookLibraryContainerAllBooks").slick("slickPrev");
    });
    $("#nextArrowAllbooks").on("click", function () {
      $("#bookLibraryContainerAllBooks").slick("slickNext");
    });
  }

  // Click error book
  $(document).on("click", ".errorReadMore", () => {
    alert(
      "Unfortunately, this type of book is not available in the library yet, it will be added soon. Stay tuned"
    );
  });

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

  // Click Read More Button
  $(document).on("click", ".readMore", function () {
    clickedBookId = $(this).attr("id");
    $(".bookLibrarySection").fadeOut(120);
    $(".typeOfBooksSection").fadeOut(120);
    $(".bookOptionsSection").fadeOut(120);
    $(".infoAndImageBook").fadeIn(120);
    $(".anonimMessage").fadeIn(120);
    renderClickedBookInfo(clickedBookId);
    renderAnonimMessages("message");
  });

  function renderClickedBookInfo(id) {
    let clicedBookData = JSON.parse(localStorage.getItem("allBooks")).find(
      (item) => {
        if (item[0] === id) {
          return item;
        }
      }
    );

    $(".infoBook h2").html(clicedBookData[1].bookNameValue);
    $(".infoBook h3").html(clicedBookData[1].authorNameValue);
    $(".infoBook p:last-child").html(
      clicedBookData[1].descriptionValue.length > 997
        ? clicedBookData[1].descriptionValue.slice(0, 998) + "..."
        : clicedBookData[1].descriptionValue
    );
    if (clicedBookData[1].newBookValue === true) {
      $(".newBookTitle").removeClass("d-none");
      $(".newBookTitle").addClass("d-block");
    } else {
      $(".newBookTitle").removeClass("d-block");
      $(".newBookTitle").addClass("d-none");
    }
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
  $("#openCloseHomeImg img").on("click", function () {
    $(".clickBgShadow").addClass("d-block");
  });

  // Close Button
  $(".closeButtonHomePage img").on("click", function () {
    $(".clickBgShadow").removeClass("d-block");
    $(".clickBgShadow").addClass("d-none");
  });

  // Anonim Message
  $(".submitAnonimMessage").on("click", () => {
    let yourMessage = $(".yourMessage").val();
    if (yourMessage.length > 20 && yourMessage.length < 300) {
      alert(
        "Thank you for your message. We promise to keep your identity confidential :))"
      );
      writeDatabaseAnonimMessage(yourMessage, sendTime());
    } else {
      alert("Your message size must be between 20 and 300 :((");
    }
    $(".yourMessage").val("");
  });

  // Send Time
  function sendTime() {
    let date = new Date();
    return date.getTime();
  }

  // Write Database Anonim Message
  function writeDatabaseAnonimMessage(message, time) {
    let messages = {
      clickedBookId,
      message,
      time,
    };
    database.ref("message").push(messages);
  }

  // Render Anonim Message
  function renderAnonimMessages(node) {
    database.ref(node).on("value", function (snapshot) {
      if (snapshot.exists()) {
        let messages = Object.values(snapshot.val());

        let arrayClicedBookInfo = messages.filter((item) => {
          if (item.clickedBookId === clickedBookId) {
            return item;
          }
        });

        $(".infoBook p:first-of-type").html(
          `${arrayClicedBookInfo.length} anonim message this book `
        );
        $(".anonimMessageContentContainer").html(
          arrayClicedBookInfo.map((item) => {
            return `
          <div class="anonimMessageContent">
          <div class="d-flex align-items-center mb-4 messageTitle">
            <h2 class="mb-0 mr-4">anonim</h2>
            <p class="mb-0">${adjustTime(item.time)}</p>
          </div>
          <p class="mb-0">
            ${item.message}
          </p>
        </div>
        `;
          })
        );
      }
    });
  }

  // Adjust the Time
  function adjustTime(timestamp) {
    console.log(timestamp);
    let date2 = new Date();
    console.log(date2.getTime());
    let differentTimestamp = date2.getTime() - timestamp;
    console.log(differentTimestamp);
    if (differentTimestamp / (365 * 24 * 3600 * 1000) > 1) {
      return `${Math.ceil(
        differentTimestamp / (365 * 24 * 3600 * 1000)
      )} year ago`;
    } else if (differentTimestamp / (30 * 24 * 3600 * 1000) > 1) {
      return `${Math.ceil(
        differentTimestamp / (30 * 24 * 3600 * 1000)
      )} months ago`;
    } else if (differentTimestamp / (7 * 24 * 3600 * 1000) > 1) {
      return `${Math.ceil(
        differentTimestamp / (7 * 24 * 3600 * 1000)
      )} weeks ago`;
    } else if (differentTimestamp / (24 * 3600 * 1000) > 1) {
      return `${Math.ceil(differentTimestamp / (24 * 3600 * 1000))} day ago`;
    } else {
      return `today`;
    }
  }

  // Render About Store Information
  function renderAboutStore(node) {
    database.ref(node).on("value", function (snapshot) {
      let infoStore = snapshot.val();
      $(".aboutStoreMain").html(`
      <div class="infoStore">
      <h2>${infoStore.titleAboutStoreValue}</h2>
      <p>
        ${infoStore.storeDescriptionValue}
      </p>
    </div>
    <div class="d-flex align-items-center">
      <img
        alt="Book depository"
        src=${infoStore.storeImageValue}
      />
    </div>
    `);
    });
  }

  // Contact Us
  $(".sendButton").on("click", function (e) {
    let fullName = $(".fullName").val();
    let email = $(".email").val();
    let adress = $(".adress").val();
    let phone_number = $(".phone").val();
    if (
      fullName.length > 8 &&
      fullName.length < 21 &&
      fullName[0] === fullName[0].toUpperCase() &&
      controlEmail(email) &&
      adress.length > 2 &&
      phone_number.length === 10
    ) {
      $(".join-error-contact").fadeOut(() => {
        $(".join-success-contact").fadeIn(1000);
        let contactInfo = {
          fullName,
          email,
          adress,
          phone_number,
        };
        renderDatabaseContactInfo(contactInfo);
      });
    } else {
      $(".join-success-contact").fadeOut(() => {
        $(".join-error-contact").fadeIn(1000);
      });
    }

    $(".fullName").val("");
    $(".email").val("");
    $(".adress").val("");
    $(".phone").val("");
  });

  // Render Contact Info in Database
  function renderDatabaseContactInfo(peopleInfo) {
    database.ref("contactPeople").push().set(peopleInfo);
  }

  // Control Email Reqular Expression
  function controlEmail(input) {
    let emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailRegEx.test(input));
    return emailRegEx.test(input);
  }

  // Join US
  $(".clickJoinUs").on("click", () => {
    $(".clickBgShadow").removeClass("d-none");
    $(".clickBgShadow").addClass("d-block");
    $(".openCloseMenu").removeClass("d-flex");
    $(".openCloseMenu").addClass("d-none");
    $(".homePageContainer").fadeIn(300);
  });

  $(".adminAvatar").on("click", () => {
    if (window.innerWidth <= 992) {
      $(".clickBgShadow").removeClass("d-none");
      $(".clickBgShadow").addClass("d-block");
      $(".openCloseMenu").removeClass("d-flex");
      $(".openCloseMenu").addClass("d-none");
      $(".homePageContainer").fadeIn(300);
    }
  });

  // Close modal join us
  $(".closeButtonJoinUs i").on("click", () => {
    $(".homePageContainer").fadeOut(300, () => {
      $(".clickBgShadow").removeClass("d-block");
      $(".clickBgShadow").addClass("d-none");
      $(".openCloseMenu").removeClass("d-none");
      $(".openCloseMenu").addClass("d-flex");
    });
    $(".join-error").fadeOut();
    $(".join-success").fadeOut();
  });

  // Control Input Data Join Us
  $(".signIn").on("click", function (e) {
    e.preventDefault();
    let fullName = $(".modalUsername").val();
    let email = $(".modalEmail").val();
    if (
      fullName.length > 8 &&
      fullName.length < 21 &&
      fullName[0] === fullName[0].toUpperCase() &&
      controlEmail(email)
    ) {
      $(".join-error").fadeOut(() => {
        $(".join-success").fadeIn(1000);
        let joinUsInfo = {
          fullName,
          email,
        };
        renderDatabaseJoinInfo(joinUsInfo);
      });
    } else {
      $(".join-success").fadeOut(() => {
        $(".join-error").fadeIn(1000);
      });
    }

    $(".modalUsername").val("");
    $(".modalEmail").val("");
  });

  // Render Join Info in Database
  function renderDatabaseJoinInfo(peopleInfo) {
    database.ref("joinPeople").push().set(peopleInfo);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // Control Pathname
  function getPathName() {
    let pathName = window.location.pathname.split("/");
    let lastPartPathName = pathName[pathName.length - 1];

    $(`.navContainer a[href='./${lastPartPathName}']`).css({
      color: "var(--inputColor)",
      "text-decoration": "underline",
    });

    if (lastPartPathName === "index.html" || lastPartPathName === "") {
      fillCatalogSection("typesBook");
    } else if (lastPartPathName === "catalog.html") {
      fillCatalogSection("typesBook");
      groupBooksByCatalog("book");
    } else if (lastPartPathName === "store.html") {
      renderAboutStore("about");
    } else {
      return;
    }
  }

  // Search Books in All My Library Books
  $(".searchButton").on("click", function () {
    let searchInputValue = $(".searchInput2").val();
    $(".searchInput2").val("");
    if (searchInputValue.length > 0) {
      let searchResult = JSON.parse(localStorage.getItem("allBooks")).filter(
        (item) => {
          if (item[1].bookNameValue.includes(searchInputValue)) {
            return item;
          }
        }
      );
      renderSearchBooks(searchResult);
    }
  });

  let clickedSearch = 0;
  // Render Search Books
  function renderSearchBooks(result) {
    if (clickedSearch > 0) {
      $(".searchBookAndInfo").slick("unslick");
      $(".searchBookAndInfo").slick("removeSlide", null, null, true);
    }
    if (result.length > 0) {
      $(".searchBookAndInfo").html(
        result.map((item) => {
          return ` <div>
            <div class="d-flex slickSearchContainer">
               <div class="searchBookImage">
                 <img
                      src="${item[1].bookImageUrl1Value}"
                      alt="book"
                      style="width: 220px; height: 306px; object-fit: cover;"
                 />
               </div>

               <div class="searchBookInfo">
                 <h2>${item[1].bookNameValue}</h2>
                 <h3>${item[1].authorNameValue}</h3>
                 <p>
                 ${
                   item[1].descriptionValue.length > 500
                     ? item[1].descriptionValue.slice(0, 447) + "..."
                     : item[1].descriptionValue
                 }
                 </p>
               </div>
             </div>
           </div>
          `;
        })
      );
      $(".searchBookAndInfo").slick({
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        speed: 700,
        pauseOnHover: true,
        prevArrow: $(".previousSearchResult"),
        nextArrow: $(".nextSearchResult"),
      });
      clickedSearch++;
    }
  }

  // Control links
  $("a[aria-disabled='true']").on("click", () => {
    alert("These Services are no longer available or are being updated");
  });
});
