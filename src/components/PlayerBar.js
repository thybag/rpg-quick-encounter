import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import getIconImage from '../utils/getIconImage.js';
// Modals
import NewPlayerModal from '../components/Modals/NewPlayerModal.js';
import EditMobModal from '../components/Modals/EditMobModal.js';
import ConfirmModal from '../components/Modals/ConfirmModal.js';

const playerMap = new WeakMap();

export default Component.define({
    initialize: function(config) {
        // Config player bar.
        this.el.id = 'player-bar';
        this.players = config.players;
        this.players.on('create:*', (e) => this.trigger('player:added', e));

        this.render();
    },
    events: {
        'click div': 'onPlayerSelect',
        'dblclick div': 'onEdit',
        'contextmenu div': 'onRemove',
        'click div.newPlayer span': 'onNewPlayer',
        'player:added': 'makePlayerCard',
    },
    template: (name, icon) => {
        return `
            <img src="${getIconImage(icon)}">
            <span>${name}</span>
        `;
    },
    onEdit: function(e, target) {
        const player = playerMap.get(target);
        EditMobModal.make({target: player});
    },
    onRemove: function(e, target) {
        e.preventDefault();

        const player = playerMap.get(target);
        ConfirmModal.make({
            question: 'Remove player from lineup?',
            callback: () => {
                player.removed = true;
            },
        });
    },
    onNewPlayer: function() {
        NewPlayerModal.make({players: this.players});
    },
    onPlayerSelect: function(e, target) {
        const player = playerMap.get(target);

        // Spawn em to map if we want em
        if (!player.spawned) {
            player.spawned = true;
            return;
        }

        player.trigger('focus');
    },
    makePlayerCard: function(player) {
        // Skip removed players
        if (player.removed) return;

        const playerCard = this.tpl(player.name, player.icon);
        playerMap.set(playerCard, player);

        // Set default attrs
        playerCard.setAttribute('title', player.name);
        if (player.spawned) playerCard.classList.add('spawned');

        // Insert before the "add new" if needed
        const addCard = this.el.querySelector('.newPlayer');
        if (addCard) {
            this.el.insertBefore(playerCard, addCard);
        } else {
            this.el.appendChild(playerCard);
        }

        // Makes sortable
        dragSort(playerCard);

        // Listen for changes
        player.on(`update:name`, (newName) => {
            playerCard.querySelector('span').innerText = newName;
            playerCard.setAttribute('title', newName);
        });
        player.on(`update:icon`, (newIcon) => {
            playerCard.querySelector('img').src = getIconImage(newIcon);
        });

        // If card removed, remove it
        player.on(`create:removed`, (newValue) => {
            if (newValue) playerCard.remove();
        });

        // Listen for spawn changes
        player.on(`update:spawned`, (spawned) => {
            if (spawned) {
                playerCard.classList.add('spawned');
            } else {
                playerCard.classList.remove('spawned');
            }
        });
    },
    render: async function() {
        this.players.map((player) => {
            this.makePlayerCard(player);
        });

        const newEl = document.createElement('div');
        newEl.className = 'newPlayer';
        newEl.innerHTML ='<span>+</span><span>Add</span>';
        this.el.appendChild(newEl);
    },
});
