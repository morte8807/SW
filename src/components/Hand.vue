<<template>
  <div class="container">
    <div class="hand">
      <div v-for="(card, index) in cardCollection" :key="card" @click="playCard(card)">
        <img :src="imageHelper.getImage(`Benders/${card.name}.jpg`)" />
      </div>
    </div>
  </div>
</template>

<script>
import ZoneMixin from './mixins/zoneMixin';
import ImageHelper from '../helpers/ImageHelper';
// import Events from '../models/events';

export default {
  mixins: [ZoneMixin],

  created() {
    this.imageHelper = new ImageHelper('Units');
  },

  methods: {
    playCard(card) {
      // if (card.hasOwnProperty('type') && card.type == 'event') {

      // } else {
        this.$emit('handCardClicked', card);
      // }
      
      //podświetl możliwe miejsca do zagrania
      // wybierz miejsce
      // opłać koszt
      // przenieś na planszę
    }
  }

}
</script>

<style>
.container{
  width: 100%;
}
.hand {
  display: flex;
  flex-flow: row  wrap;
}

.hand img {
  width: 150px;
}
</style>
