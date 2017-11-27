<template>
  <div>
    <div class="discard">
      {{ collectionLength }}
      <!-- <img alt="discard" :src="imageHelper.getImage('Benders.jpg')" /> -->
    </div>
  </div>
</template>

<script>
import ImageHelper from '../helpers/ImageHelper';
import ZoneMixin from './mixins/zoneMixin';

export default {
  mixins: [ZoneMixin],
  created() {
    this.imageHelper = new ImageHelper('CardBack');
  }
}
</script>

<style>
.discard {
  margin: 20px 0 20px;
  width: 150px;
  height: 100px;
  border: 1px solid;
}

.discard img {
  width: 150px;
}
</style>
