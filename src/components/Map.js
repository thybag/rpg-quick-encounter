import Character from './Map/Character.js';
import fogOfWar from '../utils/fogOfWar.js';
import createMap from '../utils/leafletMap.js';
import Component from 'lumpjs/src/component.js';
import WarningModal from './Modals/WarningModal.js';

const playerToIconMap = {};
const npcToIconMap = {};

/**
 * Map Component
 *
 * @param  {[type]}
 * @return {Component}
 */
export default Component.define({
    map: null,
    fog: null,
    // Setup
    initialize: async function(config) {
        // SetID
        this.el.id = 'map';
        this.options = config.state;

        // Setup map itself
        try {
            this.map = await createMap('map', this.options.get('map'));
        } catch (e) {
            // Fatal error, map cannot be loaded. Abort and show error.
            return WarningModal.make({
                notice: 'Unable to load map image',
                explanation: `The map URL you have provided can not be loaded.
                              Please check that the URL is correct and refers directly to the map image you would like to use.`,
                callback: (e) => {
                    window.location.href = window.location.pathname;
                },
            });
        }
        this.fog = fogOfWar(this.map);

        // Register leaflet Listeners
        this.map.on('click', (e) => this.trigger('map:click', e));
        this.map.on('contextmenu', (e) => this.trigger('map:contextmenu', e));

        // Listen to model
        this.subscribeTo(config.state);

        // Pass model eventing
        this.render();
    },
    // Events
    events: {
        // Local events
        'map:click': 'fogClear',
        'map:contextmenu': 'fogAdd',
        // mob data listeners
        'create:players.*': 'spawnPlayer',
        'create:spawns.*': 'spawnNpc',
        // fog data listeners
        'update:fog.mask': 'fogMaskUpdated',
        'update:fog.enabled': 'fogToggled',
        'update:fog.opacity': 'fogOpacityChanged',
    },
    fogMaskUpdated: function(mask) {
        // Import new mask
        this.fog.initFog(JSON.parse(mask));
        // Redraw fog only when change has been detected.
        this.fog.redraw();
    },
    // Map actions
    spawnPlayer: function(player) {
        const marker = this.generateMarker(player.name, player.icon, player);
        playerToIconMap[player.id] = marker;
    },
    spawnNpc: function(npc) {
        const marker = this.generateMarker(npc.name, npc.icon, npc);
        npcToIconMap[npc.id] = marker;
    },
    generateMarker: function(name, img, ref) {
        return Character.make({ref: ref, map: this.map});
    },
    fogToggled: function(newValue) {
        if (newValue) {
            this.fog.setLatLngs(JSON.parse(this.options.get('fog.mask')));
        } else {
            this.options.data.fog.mask = JSON.stringify(this.fog.getLatLngs());
            this.fog.setLatLngs(false);
        }
    },
    fogOpacityChanged: function(newValue) {
        this.fog.setOpacity(newValue / 100);
    },
    fogClear: function(e) {
        if (!this.options.get('fog.enabled')) return;

        this.fog.clearFog(e.latlng, this.options.get('fog.clearSize'));
        this.options.data.fog.mask = JSON.stringify(this.fog.getLatLngs());
    },
    fogAdd: function(e) {
        if (!this.options.get('fog.enabled')) return;

        this.fog.addFog(e.latlng, this.options.get('fog.clearSize'));
        this.options.data.fog.mask = JSON.stringify(this.fog.getLatLngs());
    },
    fogRefresh: function() {
        this.fog.initFog(JSON.parse(this.options.get('fog.mask')));
    },
    // Render changes
    render: function() {
        // Reload save data
        // Load config from settings
        if (!this.options.get('fog.mask')) {
            this.options.data.fog.mask = JSON.stringify(this.fog.getLatLngs());
        } else {
            this.fogRefresh();
        }

        this.fogOpacityChanged(this.options.get('fog.opacity'));
        this.fogToggled(this.options.get('fog.enabled'));

        // Boot players
        for (const player of Object.values(this.options.get('players'))) {
            this.spawnPlayer(player);
        }
        // Boot spawns
        for (const spawn of Object.values(this.options.get('spawns'))) {
            this.spawnNpc(spawn);
        }
    },
});
