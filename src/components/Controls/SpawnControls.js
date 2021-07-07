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
                <input type="text" value="Unknown">
                <input type='submit' value="Spawn">
            </div>
        `;
    },
    prop: {
        visible: false,
    },
    events: {
        'click img': 'openPickList',
        'click input[type=submit]': 'save',
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
    },
    toggle: function() {
        this.prop.visible ? this.hide() : this.show();
    },
    show: function(mode = 'spawn') {
        this.prop.visible = true;
        this.prop.mode = mode;
        this.render();
    },
    hide: function() {
        this.prop.visible = false;
        this.render();
    },
    render: async function() {
        if (this.prop.visible) {
            this.el.style.display = 'block';
        } else {
            this.el.style.display = 'none';
        }

        this.el.querySelector('[type=submit]').value = 'Spawn';
    },
});
