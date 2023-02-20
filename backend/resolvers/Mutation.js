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
};
