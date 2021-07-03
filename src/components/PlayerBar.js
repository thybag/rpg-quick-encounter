import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import Template from '../utils/template.js';
import getIconImage from '../utils/getIconImage.js';

const playerMap = new WeakMap();

const playerCardTpl = new Template({
    template: (name, icon) => {
        return `
        <img src="${getIconImage(icon)}">
        <span>${name}</span>
    `;
    },
});

export default Component.define({
    initialize: function(config) {
        this.el.id = 'player-bar';
        this.state = config.state;
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
        this.state.get('players').map((player, index) => {
            const playerCard = playerCardTpl.render(player.name, player.icon);
            playerMap.set(playerCard, player);

            playerCard.setAttribute('title', player.name);

            if (player.spawned) playerCard.classList.add('spawned');

            this.el.appendChild(playerCard);

            // Listen for name changes
            player.on(`update:name`, (newName) => {
                playerCard.querySelector('span').innerText = newName;
                playerCard.setAttribute('title', newName);
            });
            player.on(`update:icon`, (newIcon) => {
                playerCard.querySelector('img').src = getIconImage(newIcon);
            });

            // Listen for spawn changes
            player.on(`update:spawned`, (spawned) => {
                if (spawned) {
                    playerCard.classList.add('spawned');
                } else {
                    playerCard.classList.remove('spawned');
                }
            });
        });

        // Make list sortable
        dragSort(this.el.children);
    },
});
