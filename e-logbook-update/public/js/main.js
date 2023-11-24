const loginAdminButton = document.querySelector(".login-admin");
const logSuperButton = document.querySelector(".login-supervisor");
const loginStudent = document.querySelector(".loginstudent-button");
const home = document.querySelector(".home");
const logout = document.querySelector(".logout");
const sendmessage = document.querySelector(".sendmessage");
// fill logbook
const logbook = document.querySelector(".logbook");

logbook?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/fill-logbook";
});

// home
home?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/dashboard";
});

// logout

logout?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/";
});

// send message

sendmessage?.addEventListener("click", (e) => {
  e.preventDefault();

  location.href = "/message";
});

loginAdminButton?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/admin-login";
});

loginStudent?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/";
});

logSuperButton?.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/supervisor-login";
});
