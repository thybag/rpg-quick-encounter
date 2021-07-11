import Component from 'lumpjs/src/component.js';
import ImagePicker from './ImagePicker.js';
import getIconImage, {getRandomMonsterIcon} from '../../utils/getIconImage.js';

export default Component.define({
    spawns: null,
    initialize: function(options) {
        // Render base template
        this.el = this.tpl();
        this.el.style.display = 'none';
        // Store spawn accessor
        this.spawns = options.spawns;

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    className: 'spawn-controls',
    template: () => {
        const defaultIcon = getRandomMonsterIcon();
        return `
            <h2>Spawn new mob</h2>
            <img src="${getIconImage(defaultIcon)}" data-id="${defaultIcon}">
            <div>
                <label>Name</label>
                <input type="text" value="">
                <input type='submit' value="Spawn">
            </div>
        `;
    },
    data: {
        visible: false,
    },
    events: {
        'click img': 'openPickList',
        'click input[type=submit]': 'save',
        'keyup input[type=text]': 'detectSubmit',
    },
    // Save via keyboard
    detectSubmit: function(e) {
        if (e.key == 'Enter' || e.keyCode == 13) {
            this.save();
        }
    },
    openPickList: function(e, target) {
        ImagePicker.make({target});
    },
    save: function(e, target) {
        this.spawns.push({
            name: this.el.querySelector('input[type=text]').value,
            icon: this.el.querySelector('img').dataset.id,
            id: this.spawnslength,
            spawned: true,
        });
        this.focus();
    },
    toggle: function() {
        this.data.visible = !this.data.visible;
    },
    render: function() {
        this.el.style.display = (this.data.visible) ? 'block' : 'none';
        this.focus();
    },
    focus: function() {
        if (this.data.visible) this.el.querySelector('input[type=text]').focus();
    },
});
