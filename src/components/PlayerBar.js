import Component from 'lumpjs/src/component.js';
import dragSort from '../utils/dragSort.js';
import getIconImage from '../utils/getIconImage.js';
import NewPlayerModal from '../components/Modals/NewPlayerModal.js';

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
        'click div.newPlayer span': 'newPlayer',
        'player:added': 'makePlayerCard'
    },
    template: (name, icon) => {
        return `
            <img src="${getIconImage(icon)}">
            <span>${name}</span>
        `;
    },
    newPlayer: function() {
        NewPlayerModal.make({players: this.players});
    },
    makePlayerCard: function(player){
        const playerCard = this.tpl(player.name, player.icon);
        playerMap.set(playerCard, player);

        // Set default attrs
        playerCard.setAttribute('title', player.name);
        if (player.spawned) playerCard.classList.add('spawned');

        // Insert before the "add new" if needed
        let addCard = this.el.querySelector('.newPlayer');
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

        // Listen for spawn changes
        player.on(`update:spawned`, (spawned) => {
            if (spawned) {
                playerCard.classList.add('spawned');
            } else {
                playerCard.classList.remove('spawned');
            }
        });
        
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
        this.players.map((player) => {
            this.makePlayerCard(player);
        });
        
        let newEl = document.createElement('div');
        newEl.className = 'newPlayer';
        newEl.innerHTML ='<span>+</span><span>Add</span>';
        this.el.appendChild(newEl);
    },
});
