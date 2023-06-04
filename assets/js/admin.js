$(document).ready(() => {
  let searchTips = $(".searchTips");

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
  });

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
    $(".searchTips").html(
      tipsArray
        .map((item) => {
          return `<div class="d-flex">
        <img src="./assets/image/icon/clock.svg" alt="clock" />
        <p class="d-flex flex-wrap align-items-end">${
          item.volumeInfo.title.length > 20
            ? item.volumeInfo.title.slice(0, 18) + "..."
            : item.volumeInfo.title
        }</p>
      </div>`;
        })
        .join("")
    );
    searchTips.removeClass("d-none");
    searchTips.addClass("d-block");
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
    if (bookTypeValue.trim() === "") {
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
        alert("Book data succesfully added!");
      }, 500);
    } catch (err) {
      alert(err);
    }
  }
});
