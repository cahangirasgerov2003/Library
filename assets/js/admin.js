$(document).ready(() => {
  let searchTips = $(".searchTips");
  let openCloseImg = $("#openCloseImg");
  let globalTipsArray = null;

  // Open Close Admin Panel For Mobile
  openCloseImg.on("click", function () {
    $("#adminPanelLeftSection").removeClass("adminPanelLeft");
    $(".panelRight").addClass("d-none");
    $(".adminPanel").css({
      backgroundColor: "rgba(36, 20, 0, 0.7)",
    });
  });

  $(".menuContainer ul li:not(:nth-last-child(-n+2)) a").on("click", () => {
    $("#adminPanelLeftSection").addClass("adminPanelLeft");
    $(".panelRight").removeClass("d-none");
    $(".adminPanel").css({
      backgroundColor: "white",
    });
  });

  $(".contactLink").on("click", () => {
    $("#adminPanelLeftSection").addClass("adminPanelLeft");
    $(".panelRight").removeClass("d-none");
    $(".adminPanel").css({
      backgroundColor: "white",
    });
    document.querySelector("#contactForMobile").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // Form Section
  let bookName = $("#bookName");
  let authorName = $("#authorName");
  let bookImageUrl1 = $("#bookImageUrl1");
  let publicationYear = $("#publicationYear");
  let description = $("#description");
  let bookType = $("#bookType");
  let newBook = $("#new");

  // About Store Section
  let titleAboutStore = $("#about");
  let storeImage = $("#storeImage");
  let storeDescription = $("#storeDescription");

  controlLocaleStorage();
  renderBookTypes();
  renderJoinInfo();
  renderContactInfo();
  renderContactInfoForMobile();

  function controlLocaleStorage() {
    if (JSON.parse(window.localStorage.getItem("adminLogin"))) {
      $(".adminPanel").removeClass("d-none");
      $(".adminPanel").addClass("d-flex");
    } else {
      $(".adminLogin").removeClass("d-none");
      $(".adminLogin").addClass("d-block");
    }
  }

  $(".signIn button").on("click", function () {
    let userName = $(".modalUsername").val();
    let password = $(".modalPassword").val();
    if (
      userName.length > 3 &&
      password.length > 8 &&
      controlPassword(password) === 4 &&
      userName[0] === userName[0].toUpperCase()
    ) {
      let login = {
        userName,
        password,
      };
      controlLogin(login);
    } else {
      $(".join-error").slideDown(800);
      $(".errorInformation").html(
        "Enter a secure password that meets world standards!"
      );
      $(".modalUsername").val("");
      $(".modalPassword").val("");
    }
  });

  function controlPassword(password) {
    let termsPaid = 0;
    let regex = /[!@#$%^&*(),.?":{}|<>]/;
    let regex2 = /\d/;
    for (let key in password) {
      if (password[key] === password[key].toUpperCase()) {
        termsPaid++;
        break;
      }
    }
    for (let key in password) {
      if (password[key] === password[key].toLowerCase()) {
        termsPaid++;
        break;
      }
    }

    if (regex.test(password) && regex2.test(password)) {
      termsPaid = termsPaid + 2;
    }
    return termsPaid;
  }

  function controlLogin(login) {
    database.ref("admin").on("value", (snapshot) => {
      if (
        login.userName !== snapshot.val().userName ||
        login.password !== snapshot.val().password
      ) {
        $(".join-error").slideDown(800);
        $(".errorInformation").html("Login informations is incorrect!");
        $(".modalUsername").val("");
        $(".modalPassword").val("");
      } else {
        $(".join-error").slideUp(0, $(".join-success").slideDown(800));
        setTimeout(() => {
          $(".adminLogin").removeClass("d-block");
          $(".adminLogin").addClass("d-none");
          $(".adminPanel").removeClass("d-none");
          $(".adminPanel").addClass("d-flex");
          window.localStorage.setItem("adminLogin", JSON.stringify(login));
        }, 2000);
      }
    });
  }

  $(".logout").on("click", function () {
    window.localStorage.clear("adminLogin");
    window.location.reload();
  });

  // Search Book Section
  $(".searchInput").on("input", function () {
    renderTipsSection();
  });
  function renderTipsSection() {
    let searchResult = $(".searchInput").val();
    if (searchResult.trim().length < 5 && searchResult.trim().length > 0) {
      searchTips.removeClass("d-block");
      searchTips.addClass("d-none");
    } else if (searchResult.trim().length === 0) {
      searchTips.removeClass("d-none");
      searchTips.addClass("d-block");
      searchTips.html(`<div class="d-flex">
      <img src="./assets/image/icon/clock.svg" alt="clock" />
      <p class="d-flex align-items-end">Dan Brown Davinc</p>
    </div>
    <div class="d-flex">
      <img src="./assets/image/icon/clock.svg" alt="clock" />
      <p class="d-flex align-items-end">Dan Brown Angel</p>
    </div>`);
    } else {
      searchBookTips(searchResult);
    }
  }

  // Search Book Tips
  async function searchBookTips(tips) {
    try {
      let response = await $.ajax({
        method: "get",
        url: `https://www.googleapis.com/books/v1/volumes?q=${tips}`,
      });
      renderTips(response.items);
    } catch (err) {
      alert(err);
    }
  }

  // renderTips
  function renderTips(tipsArray) {
    globalTipsArray = tipsArray;
    searchTips.removeClass("d-none");
    searchTips.addClass("d-block");
    $(".searchTips").html(`
        <div class="d-flex align-items-center justify-content-center loadingContainer">
          <img src="./assets/image/loadingTips.gif" alt="loading" width="150"/>
        </div>
    `);
    setTimeout(() => {
      $(".searchTips").html(
        tipsArray
          .map((item) => {
            return `<div class="d-flex">
        <img src="./assets/image/icon/clock.svg" alt="clock" />
        <p class="d-flex flex-wrap align-items-end bookNameTips" data-id=${
          item.id
        }>${
              item?.volumeInfo?.title?.length > 20
                ? item?.volumeInfo?.title.slice(0, 18) + "..."
                : item?.volumeInfo?.title
            }</p>
      </div>`;
          })
          .join("")
      );
    }, 1000);
  }

  // Add form
  $(document).on("click", ".addButton", function (e) {
    e.preventDefault();
    let bookNameValue = bookName.val();
    let authorNameValue = authorName.val();
    let bookImageUrl1Value = bookImageUrl1.val();
    let publicationYearValue = publicationYear.val();
    let descriptionValue = description.val();
    let bookTypeValue = bookType.val();
    let newBookValue = newBook.is(":checked");
    $(".formContainer div input").css({
      "border-color": "green",
    });
    $(".formContainer div textarea").css({
      "border-color": "green",
    });
    $(".formContainer div select").css({
      "border-color": "green",
    });
    $(".formContainer div small").addClass("d-none");
    $(".formContainer div small").removeClass("d-block");

    if (
      bookNameValue.trim() !== "" &&
      authorNameValue.trim() !== "" &&
      bookImageUrl1Value.trim() !== "" &&
      publicationYear.toString().trim() !== "" &&
      descriptionValue.trim() !== "" &&
      bookTypeValue.trim() !== ""
    ) {
      let formData = {
        bookNameValue,
        authorNameValue,
        bookImageUrl1Value,
        publicationYearValue,
        descriptionValue,
        bookTypeValue,
        newBookValue,
      };
      addDatabaseBooks(formData);
      bookName.val("");
      authorName.val("");
      bookImageUrl1.val("");
      publicationYear.val("");
      description.val("");
      bookType.val("");
      setTimeout(function () {
        window.location.reload();
      }, 500);
      return;
    }

    if (bookNameValue.trim() === "") {
      errorFormMessage(bookName, "Please Enter Book name");
    }
    if (authorNameValue.trim() === "") {
      errorFormMessage(authorName, "Please Enter Author name");
    }
    if (bookImageUrl1Value.trim() === "") {
      errorFormMessage(bookImageUrl1, "Please Enter Image Url");
    }
    if (publicationYearValue.trim() === "") {
      errorFormMessage(publicationYear, "Please Enter Publication Year");
    }
    if (descriptionValue.trim() === "") {
      errorFormMessage(description, "Please Enter Description");
    }
    if (bookTypeValue && bookTypeValue.trim() === "") {
      errorFormMessage(bookType, "Please Enter Book Type");
    }
  });

  // About Store
  $(document).on("click", ".aboutStoreButton", function (e) {
    e.preventDefault();
    let titleAboutStoreValue = titleAboutStore.val();
    let storeImageValue = storeImage.val();
    let storeDescriptionValue = storeDescription.val();
    $(".storeContainer div input").css({
      "border-color": "green",
    });
    $(".storeContainer div textarea").css({
      "border-color": "green",
    });

    $(".storeContainer div small").addClass("d-none");
    $(".storeContainer div small").removeClass("d-block");

    if (
      titleAboutStoreValue.trim() !== "" &&
      storeDescriptionValue.trim() !== "" &&
      storeImageValue.trim() !== ""
    ) {
      let storeData = {
        titleAboutStoreValue,
        storeDescriptionValue,
        storeImageValue,
      };
      addDatabaseStoreData(storeData);
      titleAboutStore.val("");
      storeDescription.val("");
      storeImage.val("");
      setTimeout(function () {
        window.location.reload();
      }, 1000);
      return;
    }

    if (titleAboutStoreValue.trim() === "") {
      errorFormMessage(titleAboutStore, "Please Enter Title");
    }
    if (storeImageValue.trim() === "") {
      errorFormMessage(storeImage, "Please Enter Image Url");
    }
    if (storeDescriptionValue.trim() === "") {
      errorFormMessage(storeDescription, "Please Enter Description");
    }
  });

  function errorFormMessage(errorZone, errorMessage) {
    errorZone.css({
      border: "1px solid red",
    });
    errorZone.siblings("small").removeClass("d-none");
    errorZone.siblings("small").html(errorMessage).addClass("d-block");
  }

  // Add Database Books
  function addDatabaseBooks(data) {
    try {
      database.ref("book").push().set(data);
      alert("Book data succesfully added!");
    } catch (err) {
      alert(err);
    }
  }

  // Add Database About Store Information
  function addDatabaseStoreData(data) {
    try {
      database.ref("about").set(data);
      setTimeout(function () {
        alert("Book data successfully added!");
      }, 500);
    } catch (err) {
      alert(err);
    }
  }

  // The number of letters in the textarea
  $("#storeDescription").on("input", function () {
    $(".descriptionLetters").html(`${storeDescription.val().length} / 1000`);
    if (storeDescription.val().length === 1000) {
      $(".descriptionLetters").css({
        color: "var(--adminMainbgColor)",
      });
      return;
    }
    $(".descriptionLetters").css({
      color: "black",
    });
  });

  $("#description").on("input", function () {
    countLetterDescription();
  });

  function countLetterDescription() {
    $(".formDescriptionLetters").html(`${description.val().length} / 1000`);
    if (description.val().length === 1000) {
      $(".formDescriptionLetters").css({
        color: "var(--adminMainbgColor)",
      });
      return;
    }
    $(".formDescriptionLetters").css({
      color: "black",
    });
  }

  // Add Book Types
  $(".addTypeButton").on("click", () => {
    let addTypeValue = $(".addType").val().trim();
    if (addTypeValue.length < 3) {
      $(".addTypeError").html("Book type error!");
      $(".dropdownButton").removeClass("btn-success");
      $(".dropdownButton").addClass("btn-danger");
      $(".addType").val("");
      return;
    }
    $(".addTypeError").html("");
    $(".dropdownButton").removeClass("btn-danger");
    $(".dropdownButton").addClass("btn-success");
    $(".addType").val("");
    let types = {
      addTypeValue,
    };
    addDatabaseBookTypes(types);
  });

  // Add Database Book Types
  function addDatabaseBookTypes(data) {
    try {
      database.ref("typesBook").push().set(data);
      setTimeout(function () {
        alert("New book type successfully added!");
      }, 500);
    } catch (err) {
      alert(err);
    }
    renderBookTypes();
  }

  // Render Book Types
  function renderBookTypes() {
    database.ref("typesBook").on("value", function (snapshot) {
      if (snapshot.exists()) {
        let typesBookArray = Object.values(snapshot.val());
        bookType.html(
          typesBookArray.map((item) => {
            return `
          <option value=${item.addTypeValue}>${item.addTypeValue}</option>
         `;
          })
        );
      }
    });
  }

  // Click Book Name Tips
  $(document).on("click", ".bookNameTips", function (e) {
    let idTargetBook = e.target.getAttribute("data-id");
    let dataForForm = globalTipsArray.find((item) => {
      if (idTargetBook === item.id) {
        return item;
      }
    });
    fillOutForm(dataForForm);
  });

  // Fill Out The Form
  function fillOutForm(fillData) {
    bookName.val(fillData?.volumeInfo?.title ?? "");
    authorName.val(fillData?.volumeInfo?.authors.join(" ") ?? "");
    bookImageUrl1.val(fillData?.volumeInfo?.imageLinks?.thumbnail ?? "");
    publicationYear.val(fillData?.volumeInfo?.publishedDate.slice(0, 4) ?? "");
    description.val(
      fillData?.volumeInfo?.description?.length > 1000
        ? fillData.volumeInfo.description.slice(0, 1000)
        : fillData.volumeInfo.description ?? ""
    );
    $(".searchInput").val("");
    renderTipsSection();
    countLetterDescription();
  }
  // Render Join Info
  function renderJoinInfo() {
    let infoJoinPeople = $(".infoJoinPeople");
    database.ref("joinPeople").on("value", function (snapshot) {
      if (snapshot.exists()) {
        let joinPeopleArray = Object.values(snapshot.val());
        infoJoinPeople.html(
          joinPeopleArray
            .map((item, index) => {
              return `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.fullName}</td>
            <td>${item.email}</td>
        </tr>
        `;
            })
            .join("")
        );
      }
    });
  }

  // Render Contact Info
  function renderContactInfo() {
    let infoContactPeople = $(".infoContactPeople");
    database.ref("contactPeople").on("value", function (snapshot) {
      if (snapshot.exists()) {
        let contactPeopleArray = Object.values(snapshot.val());
        infoContactPeople.html(
          contactPeopleArray
            .map((item, index) => {
              return `
              <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.fullName}</td>
                    <td>${item.adress}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
              </tr> 
          `;
            })
            .join("")
        );
      }
    });
  }

  function renderContactInfoForMobile() {
    let infoContactPeopleHalf = $(".infoContactPeopleHalf");
    let infoContactPeopleOtherHalf = $(".infoContactPeopleOtherHalf");
    database.ref("contactPeople").on("value", function (snapshot) {
      if (snapshot.exists()) {
        let contactPeopleArrayHalf = Object.values(snapshot.val());
        infoContactPeopleHalf.html(
          contactPeopleArrayHalf
            .map((item, index) => {
              return `
              <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.fullName}</td>
                    <td>${item.adress}</td>
              </tr>
          `;
            })
            .join("")
        );
        infoContactPeopleOtherHalf.html(
          contactPeopleArrayHalf
            .map((item, index) => {
              return `
              <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
              </tr>
          `;
            })
            .join("")
        );
      }
    });
  }
});
