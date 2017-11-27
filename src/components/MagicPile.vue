<template>
  <div>
    <div class="magic">
      {{ collectionLength }}
      <!-- <img alt="magic" :src="imageHelper.getImage('Benders.jpg')" /> -->
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


        // checkMovementRange(position) {
        //     let currentX = parseInt(position.x);
        //     let currentY = parseInt(position.y);
        //     let result = {top: [], left: [], right: [], bottom: []};

        //     //ogarnąć lepiej skosy
        //     let normalMods = {
        //         top: [
        //             { x: 0, y: 2 },
        //             { x: 0, y: 1 }
        //         ],
        //         bottom: [
        //             { x: 0, y: -2 },
        //             { x: 0, y: -1 }
        //         ],
        //         left: [
        //             { x: -2, y: 0 },
        //             { x: -1, y: 0 },
        //             { x: -1, y: -1 },
        //             { x: -1, y: 1 }
        //         ],
        //         right: [
        //             { x: 2, y: 0 },
        //             { x: 1, y: 0 },
        //             { x: 1, y: 1 },
        //             { x: 1, y: -1 }
        //         ]
        //     };


        //     for (let name in normalMods) {
        //         for (let coords of normalMods[name]) {
        //             let modX = currentX + coords.x;
        //             let modY = currentY + coords.y;

        //             if (modX >= 0 && modX < this.maxRows &&
        //                 modY >= 0 && modY < this.maxColumns) {
        //                 result[name].push({ x: modX, y: modY });
        //             }
        //         }
        //     }

        //     for (let blockedDirection in this.nearCards) {
        //         for (let avaliableDirection in result) {
        //             if (avaliableDirection === blockedDirection) {
        //                 delete result[avaliableDirection];
        //             }
        //         }
        //     }
        //     return result;
        // }
</script>

<style>


.magic {
  margin: 20px;
  width: 150px;
  height: 100px;
  border: 1px solid;
}

.magic img {
  width: 150px;
}
</style>
