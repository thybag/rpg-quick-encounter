import Component from 'lumpjs/src/component.js';

const controlTpl = function(fogProps) {
    const tpl = `
        <label>
            <span>Fog opacity</span>
            <input type="range" min="1" max="100" value="${fogProps.opacity}" name='opacity'>
        </label>
        <label>
            <span>Fog clear size</span>
            <input type="range" min="1" max="100" value="${fogProps.clearSize}" name='clearSize'>
        </label>
        <label class="enable">
            <span>Fog enabled</span>
            <span class="toggle">
                <input type="checkbox" name='enabled' checked>
                <span></span>
          </span>
        </label>
    `;
    const template = document.createElement('div');
    template.innerHTML = tpl;
    return template;
}

export default Component.define({
    initialize: function (options) {
        this.el = controlTpl(this.fogProps);
        this.el.className = 'fog-controls';
        this.el.style.display = 'none';
        document.body.appendChild(this.el);
    },
    prop: {
        visible: false,
    },
    events: {
        "click input[name=enabled]": "toggleFog",
        "change input[name=opacity]": "changeOpacity",
        "change input[name=clearSize]": "changeClearSize",
    },
    toggleFog: function(e, target) { 
        this.fogProps.enabled = target.checked;
    },
    changeOpacity: function(e, target) {
        this.fogProps.opacity = target.value;
    },
    changeClearSize: function(e, target) { 
        this.fogProps.clearSize = target.value;
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
            this.el.style.display = 'flex';
        } else {
            this.el.style.display = 'none';
        }

        console.log(this.el);
   
    }
});