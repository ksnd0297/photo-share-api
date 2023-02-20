const { authorizeWithGithub } = require("../lib");

var _id = 0;

module.exports = {
  postPhoto(parent, args) {
    // 2. 새로운 사진을 만들고 id를 부여합니다.
    var newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date(),
    };
    photos.push(newPhoto);

    // 3. 새로 만든 사진을 반환합니다.
    return newPhoto;
  },

  async githubAuth(parent, { code }, { db }) {
    // 1. 깃허브에서 데이터를 받아 옵니다
    let { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    // 2. 메시지가 있다면 무언가 잘못된 것입니다
    if (message) {
      throw new Error(message);
    }

    // 3. 결과 값을 하나의 객체 안에 담습니다
    let latestUserInfo = {
      name: login,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    // 4. 데이터를 새로 추가하거나 이미 있는 데이터를 업데이트합니다
    const user = await db.collection("users").replaceOne({ githubLogin: "b2bcodestatesOrg" }, latestUserInfo, { upsert: true });

    const users = await db.collection("users");

    const query = { githubLogin: "b2bcodestatesOrg" };

    const movie = await users.findOne(query);

    return { user: movie, token: access_token };
  },
};
