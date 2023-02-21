const fetch = require("node-fetch");
const fs = require("fs");

// credentials -> { client_id, client_secret, code }
const requestGithubToken = (credentials) =>
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((res) => res.json());

const requestGithubUserAccount = (access_token) =>
  fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());

async function authorizeWithGithub(credentials) {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);

  return { ...githubUser, access_token };
}

module.exports = { authorizeWithGithub };
