import Component from 'lumpjs/src/component.js';
import Template from '../../utils/template.js';
import localData from '../../services/localData.js';
import getIconImage, {getRandomPlayerIcon, getRandomPlayerIconList} from '../../utils/getIconImage.js';
import ImagePicker from '../Controls/imagePicker.js';

const playerTpl = new Template({
    template: (name, icon) => {
        return `
        <span class="icon"><img src="${getIconImage(icon)}" data-id="${icon}" title="Click to change icon."></span>
        <input type='text' name="name" value="${name}" placeholder="Player name">
        <span class="remove" title="Remove player">X</span>
    `;
    },
    className: 'player-option',
});

const defaultPlayers = [
    {name: 'Caster'},
    {name: 'Tank'},
    {name: 'Rogue'},
    {name: 'Healer'},
    {name: 'Fighter'},
];

export default Component.define({
    playerTarget: null,
    initialize: function(config) {
        this.el = this.tpl();

        const icons = getRandomPlayerIconList();
        this.playerTarget = this.el.querySelector('div');

        const players = localData.getPlayers() || defaultPlayers;

        players.forEach((p, idx) => {
            this.createPlayerRow({name: p.name, icon: p.icon || icons[idx]});
        });
    },
    template: () => {
        return `
        <h2>Players</h2>
        <div></div>
        <button>Add another player</button>
    `;
    },
    events: {
        'click img': 'openPickList',
        'click button': 'addPlayer',
        'click .remove': 'removePlayer',
    },
    addPlayer: function() {
        this.createPlayerRow({});
    },
    removePlayer: function(e, target) {
        target.parentNode.remove();
    },
    createPlayerRow: function({name = '', icon = null}) {
        if (!icon) icon = getRandomPlayerIcon();

        const nPlayer = playerTpl.render(name, icon);
        this.playerTarget.appendChild(nPlayer);
    },
    openPickList: function(e, target) {
        ImagePicker.make({target});
    },
    toUrlString: function() {
        const parts = [];
        const players = [];

        for (const node of this.playerTarget.children) {
            const player = {name: node.querySelector('input').value, icon: node.querySelector('img').dataset.id};

            players.push(player);
            parts.push(`${player.name}|${player.icon}`);
        }

        localData.setPlayers(players);
        return '&players=' + parts.join(',');
    },
    render: async function() {
        this.el.className = 'wizard';
    },
});
