$(document).ready(() => {
  $("a[aria-disabled='true']").on("click", () => {
    alert("These Services are no longer available or are being updated");
  });
});
