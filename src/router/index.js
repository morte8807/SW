import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Cards from '@/components/Cards';
import GameBoard from '@/components/GameBoard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/cards',
      name: 'cards',
      component: Cards,
    },
    {
      path: '/game',
      name: 'gameBoard',
      component: GameBoard,
    },
  ],
});
