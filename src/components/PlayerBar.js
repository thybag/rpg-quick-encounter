import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import Template from '../utils/template.js';
import getIconImage from '../utils/getIconImage.js';

const playerMap = new WeakMap();

const playerTpl = new Template({
  template: (name, icon) => {
    return `
        <img src="${getIconImage(icon)}">
        <span>${name}</span>
    `;
  },
});

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
      const playerToken = playerTpl.render(player.name, player.icon);
      playerMap.set(playerToken, player);

      playerToken.setAttribute('title', player.name);

      if (player.spawned) playerToken.classList.add('spawned');

      // Listen for name changes
      this.bus.on(`update:players.${index}.name`, (newName) => {
        playerToken.querySelector('span').innerText = newName;
        playerToken.setAttribute('title', newName);
      });

      this.bus.on(`update:players.${index}.spawned`, (spawned) => {
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
