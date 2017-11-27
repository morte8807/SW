<template>
  <div class="hello">
    <select v-model="activeFaction">
      <option v-for="(urlArray, factionName) in imageObject" :key="urlArray" :value="factionName">{{ factionName }}</option>
    </select>
    <h1>{{ activeFaction }}</h1>
    <ul id="faction-container">
      <li v-for="(url, $index) in imageObject[activeFaction]" :key="$index" class="card">
        <img :src="require('../assets/images/Units' + url)" />
        <li/>
    </ul>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import Isomer from 'isomer';

export default {
  name: 'units',
  data() {
    return {
      activeFaction: 'Benders',
      imageObject: {},
    };
  },
  created() {
    const context = require.context('../assets/images/Units/', true, /^.*\.*$/);
    this.parseUnits(context.keys());
  },

  mounted() {
    this.initSortable('faction-container');
    var canvas = document.getElementById("art");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBoard(ctx);
  },

  watch: {
    activeFaction() {
      this.initSortable('faction-container');
    }
  },

  methods: {
    drawBoard(ctx) {
      ctx.beginPath();
      for (let row = 0;  row < 6; row++) {
        for (let column = 0;  column < 8; column++) {
          ctx.rect(row * 150, column * 100, 150, 100);
          ctx.stroke();
        }
      }
      ctx.closePath();
    },
    parseUnits(imgArray) {
      for (let i = 0; i < imgArray.length; i += 1) {
        const currentUrl = imgArray[i];
        const urlParts = currentUrl.split('/');
        const faction = urlParts[1];
        const image = `/${urlParts[1]}/${urlParts[2]}`;

        if (this.imageObject[faction] && Array.isArray(this.imageObject[faction])) {
          this.imageObject[faction].push(image);
        } else {
          this.imageObject[faction] = [];
          this.imageObject[faction].push(image);
        }
      }
    },
    initSortable(factionName) {
      const el = document.getElementById(factionName);
      const sortable = new Sortable(document.getElementById(factionName), {
        group: 'same',
        sort: true,  // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        disabled: false, // Disables the sortable if set to true.
        store: null,  // @see Store
        animation: 150,  // ms, animation speed movingtion
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes scaleUp {
  from {
    width: 300px;
    height: 200px;
  }
  to {
    width: 450px;
    height: 300px;
  }
}

@keyframes scaleDown {
  from {
    width: 450px;
    height: 300px;
  }
  to {
    width: 300px;
    height: 200px;
  }
}

#art {
  width: 900px;
  height: 600px;
}

.card img {
  width: 300px;
  height: 200px;
  /* animation-name: scaleDown; */
  animation-duration: 0.5s;
}


/* 
.card:hover img {
  width: 450px;
  height: 300px;
  animation-name: scaleUp;
  animation-duration: 0.5s;
} */

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
