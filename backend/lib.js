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

const requestGithubUserAccount = (credentials) =>
  fetch(`https://api.github.com/user/repos?client_id=${credentials.client_id}&client_secret=${credentials.client_secret}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer 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",
    },
  }).then((res) => {
    return res.json();
  });

async function authorizeWithGithub(credentials) {
  const githubUser = await requestGithubUserAccount(credentials);
  return { ...githubUser[0].owner, access_token: "Bearer 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" };
}

module.exports = { authorizeWithGithub };
