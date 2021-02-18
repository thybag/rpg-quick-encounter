import Component from 'lumpjs/src/component.js';
import tpl from '../../utils/tpl.js';
import getIconImage, {getRandomPlayerIcon, getRandomPlayerIconList} from '../../utils/getIconImage.js';
import ImagePicker from '../Controls/imagePicker.js';

const wizardPlayersTpl = function(player) {
  return tpl(`
        <h2>Players</h2>
        <div></div>
        <button>Add another player</button>
    `);
};

const playerTpl = function(name, icon) {
  return tpl(`
        <span class="icon"><img src="${getIconImage(icon)}" data-id="${icon}"></span>
        <input type='text' name="name" value="${name}">
        <span class="remove">X</span>
    `, 'player-option');
};

const defaultPlayers = ['Caster', 'Tank', 'Rogue', 'Healer', 'Wizard'];

export default Component.define({
  playerTarget: null,
  initialize: function(config) {
    this.el = wizardPlayersTpl();
    this.picker = null;

    const icons = getRandomPlayerIconList();
    this.playerTarget = this.el.querySelector('div');

    defaultPlayers.forEach((p, idx) => {
      this.createPlayerRow(p, icons[idx]);
    });
  },
  events: {
    'click img': 'openPickList',
    'click button': 'addPlayer',
    'click .remove': 'removePlayer',
  },
  addPlayer: function() {
    this.createPlayerRow();
  },
  removePlayer: function(e, target) {
    target.parentNode.remove();
  },
  createPlayerRow: function(name = '', icon = null) {
    if (!icon) icon = getRandomPlayerIcon();

    const nPlayer = playerTpl(name, icon);
    this.playerTarget.appendChild(nPlayer);
  },
  openPickList: function(e, target) {
    if (!this.picker) this.picker = ImagePicker.make();
    this.picker.open(target);
  },
  toUrlString: function() {
    const parts = [];

    for (const node of this.playerTarget.children) {
      parts.push(`${node.querySelector('input').value}|${node.querySelector('img').dataset.id}`);
    }
    return '&players=' + parts.join(',');
  },
  render: async function() {
    this.el.className = 'wizard';
  },
});
