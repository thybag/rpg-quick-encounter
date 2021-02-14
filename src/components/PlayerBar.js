import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js'
import tpl from '../utils/tpl.js'

const playerMap = new WeakMap();

const playerTpl = function(player) {
    const template = tpl(`
        <img src="${player.icon}">
        <span>${player.name}</span>
    `);
    playerMap.set(template, player);
    return template;
}

export default Component.define({
    initialize: function (config) {
        this.el = document.querySelector(config.options.playerBar);
        this.render();
    },
    events: {
        "click div": "playerSelect"
    },
    playerSelect: function(e, target)
    {
        const player = playerMap.get(target);

        // Spawn em to map if we want em
        if (!player.spawned) {
            target.classList.add('spawned');
            this.trigger("map:player:spawn", player);
            player.spawned = true;
            return;
        }

        // If already spawned lets focus them
        this.trigger("map:player:focus", player);
        
    },
    render: async function () 
    {
        this.options.players.map((player, index) => {
            let playerToken = playerTpl(player);
            if (player.spawned) playerToken.classList.add('spawned');

            // Listen for name changes
            this.bus.on(`update:players.${index}.name`, (newName) => {
                playerToken.querySelector('span').innerText = newName;
            });

            this.el.appendChild(playerToken);
        });

        dragSort(this.el.children);       
    }
});