import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import getIconImage from '../utils/getIconImage.js';

const playerMap = new WeakMap();

export default Component.define({
    initialize: function(config) {
        // Config player bar.
        this.el.id = 'player-bar';

        this.players = config.players;
        this.render();
    },
    events: {
        'click div': 'onPlayerSelect',
    },
    template: (name, icon) => {
        return `
            <img src="${getIconImage(icon)}">
            <span>${name}</span>
        `;
    },
    onPlayerSelect: function(e, target) {
        const player = playerMap.get(target).refresh();

        // Spawn em to map if we want em
        if (!player.spawned) {
            player.spawned = true;
            return;
        }

        // If already spawned lets focus them
        this.trigger('map:player:focus', player);
    },
    render: async function() {
        this.players.map((player, index) => {

            const playerCard = this.tpl(player.name, player.icon);
            playerMap.set(playerCard, player);

            // Set default attrs
            playerCard.setAttribute('title', player.name);
            if (player.spawned) playerCard.classList.add('spawned');
            this.el.appendChild(playerCard);

            // Listen for changes
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
