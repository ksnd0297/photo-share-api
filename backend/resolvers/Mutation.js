const {authorizeWithGithub} = require('../lib');

var _id = 0;

module.exports = {
  async postPhoto(parent, args, {db, currentUser}) {
    // 1. 컨텍스트에 사용자가 존재하지 않는다면 에러를 던집니다.
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo');
    }

    // 2. 현재 사용자의 id와 사진을 저장합니다.
    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date(),
    };

    // 3. 데이터베이스에 새로우 사진을 넣고, 반환되는 id 값을 받습니다.
    await db.collection('photos').insertOne(newPhoto);

    return newPhoto;
  },
  addFakeUsers: async (root, {count}, {db}) => {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;

    const {results} = await fetch(randomUserApi).then((res) => res.json());

    const users = results.map((r) => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1,
    }));

    await db.collection('users').insertMany(users);

    return users;
  },
  fakeUserAuth: async (parent, {githubLogin}, {db}) => {
    const user = await db.collection('users').findOne({githubLogin});

    if (!user) {
      throw new Error(`Cannot fine user with githubLogin "${githubLogin}`);
    }

    return {
      token: user.githubToken,
      user,
    };
  },
  async githubAuth(parent, {code}, {db}) {
    // 1. 깃허브에서 데이터를 받아 옵니다
    let {message, access_token, avatar_url, login, name} = await authorizeWithGithub({
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
      name: name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    // 4. 데이터를 새로 추가하거나 이미 있는 데이터를 업데이트합니다
    await db.collection('users').replaceOne({githubLogin: login}, latestUserInfo, {upsert: true});

    const user = db.collection('users').findOne({githubLogin: login});

    return {user, token: access_token};
  },
};
