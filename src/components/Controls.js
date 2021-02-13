import Component from 'lumpjs/src/component.js';
import FogControls from './Controls/FogControls.js';
import SpawnControls from './Controls/SpawnControls.js';

export default Component.define({
    initialize: function (config) {
        this.el = document.querySelector(config.options.controlBar);
        this.fogControls = FogControls.make({fogProps: config.options.fog});
        this.spawnControls = SpawnControls.make();
        this.render();

        // Pass it up
        this.spawnControls.on('map:spawn', (v) => { this.trigger('map:spawn', v); })
    },
    events: {
        "click span.fog": "fogToggle",
        "click span.spawn": "spawnToggle"
    },
    fogToggle: function(e, target)
    {
        this.fogControls.toggle();
    },
    spawnToggle: function(e, target)
    {
        this.spawnControls.toggle();
    },
    render: async function () 
    {

    }
});