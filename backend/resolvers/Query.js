const { photos, users, tags } = require("../public/data");

module.exports = {
  totalPhotos: () => photos.length,
  allPhotos: () => photos,
};
