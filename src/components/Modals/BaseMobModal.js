import Component from 'lumpjs/src/component.js';
import ImagePicker from '../controls/ImagePicker.js';
import getIconImage from '../../utils/getIconImage.js';

export default Component.define({
    // Templates
    className: 'modal',
    template: (title, name, icon) => {
        return `
            <div class='spawn-controls'>
                <h2>${title}</h2>
                <img src="${getIconImage(icon)}" data-id="${icon}">
                <div>
                    <label>Name</label>
                    <input type="text" value="${name}" placeholder="Player name...">
                    <input type='submit' value="Save">
                </div>
            </div>
        `;
    },
    // Events
    events: {
        'click .modal': 'close',
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
    // Remove modal
    close: function() {
        this.destroy();
    },
    // Open image picker
    openPickList: function(e, target) {
        ImagePicker.make({target});
    },
});
