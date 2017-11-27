import ImageHelper from '../helpers/ImageHelper';

export default class Unit {
  constructor(faction, name, cost, av, hp, skill, ranged, position, enemy) {
    this.unitImages = new ImageHelper('Units');

    this.faction = faction;
    this.name = name;
    this.cost = cost;
    this.av = av;
    this.hp = hp;
    this.skill = skill;
    this.ranged = ranged || false;
    this.imgPath = '';
    this.position = position;
    this.enemy = enemy;
    this.movement = 2;

    if (faction && name) {
      this.imgPath = `${faction}/${name}.jpg`;
    }
  }

  getUnitImage() {
    return this.unitImages.getImage(this.imgPath);
  }
}
