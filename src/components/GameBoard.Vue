<template>
<div style="width: 910px;">
    <div class="board">
        <div v-for="(column, columnIndex) in boardDefinition" :key="columnIndex" class="column">
            <div v-for="(coords, rowIndex) in column" :key="findCard(coords, 'board', cardsOnBoard)" class="row">
                <BoardField :class="[markActiveCard(coords.x, coords.y) ? 'marked' : '',
                                      markLegalMovement(coords.x, coords.y) ? 'legal' : '']" 
                            :position="coords" 
                            :card="findCard(coords)"
                            @pickCard="pickCard" 
                            @pickEmpty="pickEmpty"
                >
                </BoardField>
            </div>
        </div>
    </div>
    <div class="playerZones">
        <Deck :cardCollection="deckCollection"></Deck>
        <MagicPile :cardCollection="magicCollection"></MagicPile>
        <Discard :cardCollection="discardCollection"></Discard>
    </div>
    <div class="playerHand">
        <Hand :cardCollection="handCollection"
            @handCardClicked="handleCardHandClicked"></Hand>
    </div>
    <div class="statusBar">
        <div :class="[drawPhase ? 'active' : '']" >1. Faza dobierania</div>
        <div :class="[summonPhase ? 'active' : '']">2. Faza przywoływania</div>
        <div :class="[eventPhase ? 'active' : '']">3. Faza wydarzeń</div>
        <div :class="[movementPhase ? 'active' : '']">4. Faza ruchu</div>
        <div :class="[attackPhase ? 'active' : '']">5. Faza walki</div>
        <div :class="[buildMagicPhase ? 'active' : '']">6. Faza budowania magii</div>
    </div>
    <div class="turnCounters">
      <div>Dostępne ruchy {{ movesPerTurn }}</div>
      <div>Dostępne ataki {{ attacksPerTurn }}</div>
    </div>
    <button @click="nextPhase">Następna faza</button>
</div>
</template>

<script>
import BoardField from './BoardField';
import TaculluConfig from '../factions/benders/setup.json';
import ElienConfig from '../factions/phoenix/setup.json';
import BoardDefinition from './board.json';
import Deck from './Deck';
import Hand from './Hand';
import MagicPile from './MagicPile';
import Discard from './Discard';
import Vue from 'vue';

export default {
    data() {
        return {
            maxRows: 6,
            maxColumns: 8,

            currentPhase: 0,
            attacksPerTurn: 3,
            movesPerTurn: 3,

            boardDefinition: BoardDefinition,
            playerDeck: TaculluConfig,
            enemyDeck: ElienConfig,

            avaliableMovements: [],
            nearCards: {},

            cardToPlay: null,
            activeUnit: null,

        }
    },

    components: {
        BoardField,
        Deck,
        Discard,
        Hand,
        MagicPile
    },

    computed: {
        drawPhase() { return this.currentPhase == 0 },
        summonPhase() { return this.currentPhase == 1 },
        eventPhase() { return this.currentPhase == 2 },
        movementPhase() { return this.currentPhase == 3 },
        attackPhase() { return this.currentPhase == 4 },
        buildMagicPhase() { return this.currentPhase == 5 },
        endTurnPhase() { return this.currentPhase == 6 },

        cardsOnBoard() {
            const enemyBoard = this.enemyDeck.map((card) => {
                if (card.zone == 'board' && !card.enemy) {
                  const currentX = card.position.x;
                  const currentY = card.position.y;
                  card.position = {
                      x: this.maxRows - 1 - currentX,
                      y: this.maxColumns - 1 - currentY
                  };
                }
                card.enemy = true;

                return card;
            });
            return this.playerDeck.concat(enemyBoard);

        },
        deckCollection() {
            return this.getCardsCollectionFromZone('deck');
        },
        magicCollection() {
            return this.getCardsCollectionFromZone('magic', this.cardsOnBoard);
        },
        discardCollection() {
            return this.getCardsCollectionFromZone('discard');
        },
        handCollection() {
            return this.getCardsCollectionFromZone('hand');
        },
        currentX() {
            return this.activeUnit ? this.activeUnit.position.x : false;
        },
        currentY() {
            return this.activeUnit ? this.activeUnit.position.y : false;
        }
    },

    methods: {
        nextPhase() {
            if (this.drawPhase && this.deckCollection.length > 0 && this.handCollection.length < 5) {
              console.log('Dobierz do pięciu kart!');
              return;
            }
            this.currentPhase += 1;
            if (this.currentPhase > 6) {
                this.currentPhase = 0;
            }
        },

        handleCardHandClicked(card) {
            // pokaż miejsca w które można przywołać
            // jeżeli ściana to tylko na swojej połowie
            // let walls = this.getCardsCollectionFromZoneByName('board', 'wall');
            if (this.buildMagicPhase) {
              card.zone = 'magic';
            }
            if (this.eventPhase || this.summonPhase) {
              this.cardToPlay = card;
            }
        },

        findCoordsInArrayHavingDirections(position, arrayToScan) {
            for (let direction in arrayToScan) {
                for (let coords of arrayToScan[direction]) {
                    if (coords.x === position.x && coords.y === position.y) {
                        return true;
                    }
                }
            }
            return false;
        },

        findCoordsInArray(position, arrayToScan) {
          for (let coords of arrayToScan) {
            if (coords.x == position.x && coords.y == position.y) {
              return true;
            }
          }
        },

        getCardsCollectionFromZone(zone, array) {
            let collection = array ||  this.playerDeck;
            return collection.filter((card) => {
                return card.zone == zone;
            });
        },

        getCardsCollectionFromZoneByName(zone, name, array) {
             let collection = array ||  this.playerDeck;
            return collection.filter((card) => {
                return card.zone == zone && card.name == name;
            });
        },

        findCard(position, zone, array) {
            let zoneToSearch = zone || 'board';
            let collection = array ||  this.cardsOnBoard;

            for (let card of collection) {

                if (!card.position || card.zone != zoneToSearch) {
                    continue;
                }
                if (card.position.x === position.x && card.position.y === position.y) {
                    return card;
                }
            }
            return false;
        },

        rollDie() {
            return 1 + Math.floor(Math.random() * 6);
        },

        countHits(attackValue) {
            var hits = 0;
            while (attackValue-- > 0) {
              let battleRoll = this.rollDie();
              console.log(`Rzut na atak - ${battleRoll}`);
                if (battleRoll > 2) {
                    hits++;
                }
            }
            return hits;
        },

        checkAttackRange(attacker, defender) {
          let positionsInRange = [];
          const attackerX = attacker.position.x;
          const attackerY = attacker.position.y;
          const defenderX = defender.position.x;
          const defenderY = defender.position.y;
          let range = 1;

          if (attacker.ranged) {
            range = 3;
          }
          while (range) {
            positionsInRange.push({x: attackerX - range, y: attackerY});
            positionsInRange.push({x: attackerX + range, y: attackerY});
            positionsInRange.push({x: attackerX, y: attackerY - range});
            positionsInRange.push({x: attackerX, y: attackerY + range});
            range--;
          }
          return this.findCoordsInArray({x: defenderX, y: defenderY}, positionsInRange);
        },

        makeAttack(attacker, defender) {
          if (this.attacksPerTurn == 0 || !this.checkAttackRange(attacker, defender)) {
            console.log('Cel poza zasięgiem!');
            return;
          }
          const hits = this.countHits(attacker.av);
          console.log(`Lepa na ryj za ${hits}`);

          if (hits + defender.damage >= defender.hp) {
            defender.zone = 'magic';
          } else {
            defender.damage += hits;
          }

          this.attacksPerTurn--;
          attacker.hasAttacked = true;
          this.activeUnit = null;
        },

        pickCard(unit) {
            if (this.activeUnit === unit) {
              this.activeUnit = null;
              return;
            }

            if (this.attackPhase && this.activeUnit && !this.activeUnit.hasAttacked) {
              this.makeAttack(this.activeUnit, unit);
                return;
            }
            if (!this.activeUnit && unit.enemy) {
              console.log('Nie tykamy wrogich jednostek');
              return;
            } else if (!this.activeUnit && this.attackPhase) {
              this.activeUnit = unit;
              return;
            }

            console.log(unit);
            if (
              unit.name !== 'wall' &&
              !unit.hasOwnProperty('hasMoved') &&
              this.movementPhase && this.movesPerTurn > 0
            ) {
              this.activeUnit = unit;
              this.nearCards = this.detectNearCard(unit.position)
              this.avaliableMovements = this.checkMovementRange(unit.position);
            }
        },

        pickEmpty(position) {
            let x = position.x;
            let y = position.y;

            //zagrywam ścianę z ręki
            if (this.cardToPlay && this.eventPhase && this.cardToPlay.name == 'wall') {
                this.cardToPlay.position = {x: x, y: y};
                this.cardToPlay.zone = 'board';
                this.cardToPlay = null;
                return;
            }

            if (this.cardToPlay && this.eventPhase && this.cardToPlay.hasOwnProperty('event')) {
                console.log('ZAGRYWAM EVENTA');
                this.cardToPlay = null;
                return;
            }

            //zagrywam jednostkę z ręki
            if (
                this.summonPhase &&
                this.cardToPlay &&
                this.cardToPlay.name != 'wall' &&
                this.cardToPlay.cost <= this.magicCollection.length
            ) {
                let cost = this.cardToPlay.cost;
                this.cardToPlay.position = {x: x, y: y};
                this.cardToPlay.zone = 'board';
                while (cost) {
                  this.magicCollection[0].zone = 'discard';
                  cost--;
                }
                this.cardToPlay = null;
                return;
            }

            //poruszam wybraną jednostkę
            if (
                this.movesPerTurn > 0 &&
                this.movementPhase &&
                this.activeUnit &&
                Object.keys(this.activeUnit).length &&
                this.findCoordsInArrayHavingDirections(position, this.avaliableMovements)
            ) {
                this.activeUnit.position.x = x;
                this.activeUnit.position.y = y;
                this.activeUnit.hasMoved = true;
                this.activeUnit = null;
                this.movesPerTurn--;
            } else {
                console.log('Niedozwolony ruch albo brak ruchów');
            }
        },

        detectNearCard(position) {
            let x = position.x;
            let y = position.y;
            let result = {};

            if (this.findCard({ x: x - 1, y: y })) {
                result['left'] = true;
            }
            if (this.findCard({ x: x + 1, y: y })) {
                result['right'] = true;
            }
            if (this.findCard({ x: x, y: y - 1 })) {
                result['bottom'] = true;
            }
            if (this.findCard({ x: x, y: y + 1 })) {
                result['top'] = true;
            }

            if (!Object.keys(result).length) {
                return false;
            }
            return result;
        },

        markActiveCard(x, y) {
            return this.currentX && this.currentY && this.currentX == x && this.currentY == y;
        },

        markLegalMovement(x, y) {
            if (this.activeUnit && this.movementPhase) {
                for (let direction in this.avaliableMovements) {
                    for (let pos of this.avaliableMovements[direction]) {
                        if (pos.x == x && pos.y == y) {
                            return true;
                        }
                    }

                }
            }
            return false;
        },

        coordsInBoard(coords) {
          if (coords.x < 0 || coords.x > this.maxRows - 1 ||
              coords.y < 0 || coords.y > this.maxColumns - 1 ||
              (coords.x == 0 && coords.y == 0 )) {
              return false;
          }
          return true;
        },

        calculateNeihgbours(x, y, result) {
          let topCoords = {x: x, y: y + 1};
          let bottomCoords = {x: x, y: y - 1};
          let leftCoords = {x: x  - 1, y: y};
          let rightCoords = {x: x + 1, y: y};

          if (!this.findCoordsInArray(topCoords, result.top) &&
          this.coordsInBoard(topCoords)) {
            result.top.push(topCoords);
          }
          if (!this.findCoordsInArray(bottomCoords, result.bottom) &&
          this.coordsInBoard(bottomCoords)) {
            result.bottom.push(bottomCoords);
          }
          if (!this.findCoordsInArray(leftCoords, result.left) &&
          this.coordsInBoard(leftCoords)) {
            result.left.push(leftCoords);
          }
          if (!this.findCoordsInArray(rightCoords, result.right) &&
          this.coordsInBoard(rightCoords)) {
            result.right.push(rightCoords);
          }
          return result;
        },

        checkMovementRange(position) {
            let currentX = parseInt(position.x);
            let currentY = parseInt(position.y);
            let range = 2;
            let currentRange = 0;
            let result = {top: [], left: [], right: [], bottom: []};

            while (currentRange < range) {
              this.calculateNeihgbours(currentX, currentY + currentRange, result);
              this.calculateNeihgbours(currentX, currentY - currentRange, result);
              this.calculateNeihgbours(currentX - currentRange, currentY, result);
              this.calculateNeihgbours(currentX + currentRange,currentY, result);
              currentRange++;
            }

            for (let blockedDirection in this.nearCards) {
                for (let avaliableDirection in result) {
                    if (avaliableDirection === blockedDirection) {
                        delete result[avaliableDirection];
                    }
                }
            }
            return result;
        }
    },

    watch: {
      currentPhase() {
        if (this.endTurnPhase) {
          this.attacksPerTurn = 3;
          this.movesPerTurn = 3;
          this.cardsOnBoard.map((card) => {
            if (card.hasOwnProperty('hasMoved')) {
              delete card.hasMoved;
            }
            if (card.hasOwnProperty('hasAttacked')) {
              delete card.hasAttacked;
            }
          });
        }
      }
    }
};
</script>

<style>
.turnCounters {
  font-size: 35px;
  margin: 20px;
}

.playerZones {
  display: flex;
}

.playerHand {
  display: flex;
}

.board {
  display: flex;
}

.legal {
  background-color: lightblue;
}

.statusBar {
    display: flex;
}

.statusBar div {
    margin: 0 20px 0 20px;
}

.statusBar div.active {
    font-weight: bold;
    border: solid 2px red;
}
</style>