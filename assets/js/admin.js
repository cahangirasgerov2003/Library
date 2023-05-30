$(document).ready(() => {
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
      $(".modalUsername").val("");
      $(".modalPassword").val("");
    }
  });
  function controlLogin(login) {
    database.ref("admin").on("value", (snapshot) => {
      if (
        login.userName !== snapshot.userName ||
        login.password !== snapshot.password
      ) {
        $(".errorInformation").html("Login informations is incorrect!");
        $(".modalUsername").val("");
        $(".modalPassword").val("");
      } else {
      }
    });
  }
});
