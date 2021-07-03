import Component from 'lumpjs/src/component.js';
import FogControls from './Controls/FogControls.js';
import SpawnControls from './Controls/SpawnControls.js';
import Template from '../utils/template.js';

const controlsTpl = new Template({
    template: () => {
        return `
        <a href="https://github.com/thybag/rpg-quick-encounter" target="_blank">Help</a>
        <span class='fog'>Fog</span>
        <span class="spawn">Spawn</span>
    `;
    },
});

export default Component.define({
    initialize: function(config) {
    // SetID
        this.el.id = 'control-bar';

        // Render controls
        this.el.appendChild(controlsTpl.render());

        this.fogControls = FogControls.make({fogProps: config.state.get('fog')});
        this.spawnControls = SpawnControls.make();
        this.render();

        // Pass it up
        this.spawnControls.on('map:spawn', (v) => {
            this.trigger('map:spawn', v);
        });
    },
    events: {
        'click span.fog': 'fogToggle',
        'click span.spawn': 'spawnToggle',
    },
    fogToggle: function(e, target) {
        this.fogControls.toggle();
    },
    spawnToggle: function(e, target) {
        this.spawnControls.toggle();
    },
    render: async function() {

    },
});
