Cypress.Commands.add("loginByAuth0", () => {
  // Mock the Auth0 login process by setting localStorage or cookies
  const auth0Token = "meHTZg10vvWNi1gErB26MmSOJtMf0enf"; // Replace this with a valid token
  window.localStorage.setItem("auth0IdToken", auth0Token);
  window.localStorage.setItem("auth0AccessToken", auth0Token);
});
