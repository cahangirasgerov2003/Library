$(document).ready(() => {
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
});
