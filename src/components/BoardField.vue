<template>
    <div class="field" @click="pickCard" 
        :class="[card && card.enemy ? 'enemy': '']">
        <div v-if="card">
            <div class="damageContainer">
                <div v-for="point in card.damage" class="damageCounter">1</div>
            </div>
            <img :src="imageHelper.getImage(`${card.faction}/${card.name}.jpg`)" 
                style="width: 100%; height: 100%;" />
        </div>
    </div>
</template>

<script>
import ImageHelper from '../helpers/ImageHelper';

export default {
    props: {
        position: {
            type: Object,
            default() {
                return {x: 0, y: 0}
            }
        },
        card: {
            default: null
        }
    },

    created() {
        this.imageHelper = new ImageHelper('Units');
    },

    data() {
        return {
            imageHelper: null,
            marked: false,
        }
    },
    methods: {
        pickCard() {
            console.log('coords: ' + this.position.x + ' ' + this.position.y);
            if (this.card) {
                this.$emit('pickCard', this.card);
            }
            if (!this.card) {
                this.$emit('pickEmpty', this.position);
            }
        }
    }

}
</script>

<style>
.field {
    width: 150px;
    height: 100px;
    border: 1px solid;
}

.field.enemy {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
}

.marked {
    border: 1px solid red;
}

.damageContainer {
    display: flex;
    flex-flow: row wrap;
    position: absolute;
}

.damageCounter {
    width: 20px;
    height: 20px;
    background-color: red;
    margin: 5px;
    color: white;
     border-radius: 25px;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
}
</style>