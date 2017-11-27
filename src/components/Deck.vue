<<template>
  <div class="container">
    <div class="deck" @click="draw">
      <img v-if="collectionLength > 0" :src="imageHelper.getImage('Benders.jpg')" />
    </div>
  </div>
</template>

<<script>
import ImageHelper from '../helpers/ImageHelper';
import ZoneMixin from './mixins/zoneMixin';

export default {
  mixins: [ZoneMixin],

  created() {
    this.imageHelper = new ImageHelper('CardBack');
  },

  methods: {
    draw() {
      if (!this.collectionLength) {
        return;
      }
      var randomCard = this.cardCollection[Math.floor(Math.random()*this.cardCollection.length)];
      console.log(randomCard, randomCard.name);
      randomCard.zone = 'hand';
    }
  }
}
</script>

<style>
.container {
  flex-grow: 2;
}

.deck {
  width: 150px;
  height: 100px;
  border: 1px solid;
  margin: 20px 0 20px;
}

.deck img {
  width: 150px;
}
</style>