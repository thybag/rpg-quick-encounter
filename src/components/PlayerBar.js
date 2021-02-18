import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import tpl from '../utils/tpl.js';
import getIconImage from '../utils/getIconImage.js';

const playerMap = new WeakMap();

const playerTpl = function(player) {
  const template = tpl(`
        <img src="${getIconImage(player.icon)}">
        <span>${player.name}</span>
    `);
  playerMap.set(template, player);
  return template;
};

export default Component.define({
  initialize: function(config) {
    this.el = document.querySelector(config.options.playerBar);
    this.render();
  },
  events: {
    'click div': 'playerSelect',
  },
  playerSelect: function(e, target) {
    const player = playerMap.get(target);

    // Spawn em to map if we want em
    if (!player.spawned) {
      this.trigger('map:player:spawn', player);
      return;
    }

    // If already spawned lets focus them
    this.trigger('map:player:focus', player);
  },
  render: async function() {
    this.options.players.map((player, index) => {
      const playerToken = playerTpl(player);
      playerToken.setAttribute('title', player.name);

      if (player.spawned) playerToken.classList.add('spawned');

      // Listen for name changes
      this.bus.on(`update:players.${index}.name`, (newName) => {
        playerToken.querySelector('span').innerText = newName;
        playerToken.setAttribute('title', newName);
      });

      this.bus.on(`update:players.${index}.spawned`, (spawned) => {
        console.log('update', spawned, playerToken);
        if (spawned) {
          playerToken.classList.add('spawned');
        } else {
          playerToken.classList.remove('spawned');
        }
      });

      this.el.appendChild(playerToken);
    });

    dragSort(this.el.children);
  },
});
