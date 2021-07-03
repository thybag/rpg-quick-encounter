import Component from 'lumpjs/src/component.js';
import Template from '../../utils/template.js';
import ImagePicker from './ImagePicker.js';
import getIconImage, {getRandomMonsterIcon} from '../../utils/getIconImage.js';

const controlTpl = new Template({
    template: () => {
        const defaultIcon = getRandomMonsterIcon();
        return `
      <img src="${getIconImage(defaultIcon)}" data-id="${defaultIcon}">
      <div>
          <label>Name</label>
          <input type="text" value="Unknown">
          <input type='submit' value="Spawn">
      </div>
    `;
    },
});

export default Component.define({
    initialize: function(options) {
        this.el = controlTpl.render();
        this.el.className = 'spawn-controls';
        this.el.style.display = 'none';
        document.body.appendChild(this.el);

        this.picker = null;
    },
    prop: {
        visible: false,
        mode: 'spawn',
        target: null,
    },
    events: {
        'click img': 'openPickList',
        'click input[type=submit]': 'save',
    },
    openPickList: function(e, target) {
        if (!this.picker) this.picker = ImagePicker.make();
        this.picker.open(target);
    },
    save: function(e, target) {
        // default
        if (this.prop.mode == 'spawn') {
            this.trigger('map:spawn', {
                name: this.el.querySelector('input[type=text]').value,
                icon: this.el.querySelector('img').dataset.id,
            });
        }
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

        if (this.prop.mode == 'spawn') {
            this.el.querySelector('[type=submit]').value = 'Spawn';
        } else {
            this.el.querySelector('[type=submit]').value = 'Save';
        }
    },
});
