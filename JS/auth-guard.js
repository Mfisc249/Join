/**
 * Auth Guard – Redirects to login if user is not authenticated.
 * Include as FIRST script on all protected pages (summary, board, contacts, add_task).
 */
(function () {
  let contactId = sessionStorage.getItem("contactId");
  let isGuest = sessionStorage.getItem("isGuest");
  if (!contactId && isGuest !== "true") {
    window.location.href = "index.html";
  }
})();
