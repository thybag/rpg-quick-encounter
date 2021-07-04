import Component from 'lumpjs/src/component.js';
import ImagePicker from './ImagePicker.js';
import getIconImage from '../../utils/getIconImage.js';

export default Component.define({
    // Data
    target: null,
    // Setup
    initialize: function(options) {
        this.target = options.target;

        // Render base template
        this.el = this.tpl(this.target.name, this.target.icon);

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    // Templates
    className: 'spawn-modal',
    template: (name, icon) => {
        return `
            <div class='spawn-controls'>
                <h2>Update</h2>
                <img src="${getIconImage(icon)}" data-id="${icon}">
                <div>
                    <label>Name</label>
                    <input type="text" value="${name}">
                    <input type='submit' value="Save">
                </div>
            </div>
        `;
    },
    // Events
    events: {
        'click .spawn-modal': 'close',
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
    // Save data to target
    save: function(e, target) {
        this.target.name = this.el.querySelector('input[type=text]').value;
        this.target.icon = this.el.querySelector('img').dataset.id;
        this.close();
    },
    // Remove modal
    close: function() {
        this.destroy();
    },
    // Open image picker
    openPickList: function(e, target) {
        if (!this.picker) this.picker = ImagePicker.make();
        this.picker.open(target);
    },
});
