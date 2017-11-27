export default class ImageHelper {
  constructor(imageDir) {
    this.imagesContext = require.context('../assets/images/', true, /\.jpg$/);
    this.imageDir = imageDir;
  }

  getImage(path) {
    return this.imagesContext(`./${this.imageDir}/${path}`);
  }
}
