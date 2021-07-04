import Component from 'lumpjs/src/component.js';

/**
 * Fog Control Component.
 * Allows user to control clear sizing, fog opacity and other related settings.
 *
 */
export default Component.define({
    initialize: function(options) {
        // Config template
        this.el = this.tpl(this.fogProps.opacity, this.fogProps.clearSize);
        this.el.style.display = 'none';

        // Create self on parent
        document.body.appendChild(this.el);
    },
    // Events
    events: {
        'click input[name=enabled]': 'toggleFog',
        'change input[name=opacity]': 'changeOpacity',
        'change input[name=clearSize]': 'changeClearSize',
    },
    // Template
    className: 'fog-controls',
    template: (opacity, clearSize) => {
        return `
            <label>
                <span>Fog opacity</span>
                <input type="range" min="1" max="100" value="${opacity}" name='opacity'>
            </label>
            <label>
                <span>Fog clear size</span>
                <input type="range" min="1" max="100" value="${clearSize}" name='clearSize'>
            </label>
            <label class="enable">
                <span>Fog enabled</span>
                <span class="toggle">
                    <input type="checkbox" name='enabled' checked>
                    <span></span>
              </span>
            </label>
        `;
    },
    prop: {
        visible: false,
    },
    // Actions
    toggleFog: function(e, target) {
        this.fogProps.refresh().enabled = target.checked;
    },
    changeOpacity: function(e, target) {
        this.fogProps.refresh().opacity = target.value;
    },
    changeClearSize: function(e, target) {
        this.fogProps.refresh().clearSize = target.value;
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
    render: async function() {
        if (this.prop.visible) {
            this.el.style.display = 'flex';
        } else {
            this.el.style.display = 'none';
        }
    },
});
