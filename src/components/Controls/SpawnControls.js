import Component from 'lumpjs/src/component.js';
import tpl from '../../utils/tpl.js'
import ImagePicker from './ImagePicker.js'

const controlTpl = function() {
    return tpl( `
        <img src="assets/monsters/${Math.floor((Math.random() * 30) + 1)}.png">
        
        <div>
            <label>Name</label>
            <input type="text" value="Unknown">
            <input type='submit'>
        </div>
        
    `);
}

export default Component.define({
    initialize: function (options) {
        this.el = controlTpl();
        this.el.className = 'spawn-controls';
        this.el.style.display = 'none';
        document.body.appendChild(this.el);

        this.picker = null;
    },
    prop: {
        visible: false,
    },
    events: {
        "click img": "openPickList",
        "click input[type=submit]": "spawn",
    },
    openPickList: function(e, target){
        if(!this.picker) this.picker = ImagePicker.make();
        this.picker.open(target);
    },
    spawn: function(e, target) {
        // default

        this.trigger('map:spawn', {name: this.el.querySelector('input[type=text]').value, icon: this.el.querySelector('img').src})
    },
    toggle: function() {
        this.prop.visible = !this.prop.visible;
        this.render();
    },
    show: function() {
        this.prop.visible = true;
        this.render();
    },
    hide: function() {
        this.prop.visible = false;
        this.render();
    },
    render: async function () 
    {
        if (this.prop.visible){
            this.el.style.display = 'block';
        } else {
            this.el.style.display = 'none';
        }
    }
});