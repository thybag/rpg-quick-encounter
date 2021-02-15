import Component from 'lumpjs/src/component.js';
import createMap from '../utils/leafletMap.js';
import fogOfWar from '../utils/fogOfWar.js'
import Character from './Map/Character.js'

const playerToIconMap = {};
const npcToIconMap = {};

export default Component.define({
    map: null,
    fog: null,
    initialize: function (config) {
        this.el = document.querySelector(config.options.container);
        this.render();
    },
    events: {
        "map:player:spawn":     "spawnPlayer",
        "map:player:focus":     "focusPlayer",
        "map:spawn":            "spawnNpc",
        "update:fog.enabled":   "fogToggled",
        "update:fog.opacity":   "fogOpacityChanged",
    },
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
    focusPlayer: function(player) {
        playerToIconMap[player.id].panTo();
    },
    fogToggled: function(newValue) {
        if (newValue) {
            this.fog.setLatLngs(JSON.parse(this.options.fog.mask));
        } else {
            this.options.fog.mask = JSON.stringify(this.fog.getLatLngs());
            this.fog.setLatLngs(false);
        }
    },
    fogOpacityChanged: function(newValue) {
        this.fog.setOpacity(newValue/100);
    },
    render: async function () 
    {
        // Grab image from URL
        this.map = await createMap('map', this.options.map);
        this.fog = fogOfWar(this.map);

        this.map.on('click', e => { 
            if (!this.options.fog.enabled) return;

            this.fog.clearFog(e.latlng, this.options.fog.clearSize); 
            this.options.fog.mask = JSON.stringify(this.fog.getLatLngs());
        });
        this.map.on('contextmenu', e=> { 
            if (!this.options.fog.enabled) return;

            this.fog.addFog(e.latlng, this.options.fog.clearSize); 
            this.options.fog.mask = JSON.stringify(this.fog.getLatLngs());
        });

        this.reloadData();
    },
    reloadData: function() {
        // Reload save data
        // Load config from settings
        if (!this.options.fog.mask){
            this.options.fog.mask = JSON.stringify(this.fog.getLatLngs());
        } else {
            this.fog.initFog(JSON.parse(this.options.fog.mask));
        }

        this.fogOpacityChanged(this.options.fog.opacity);
        this.fogToggled(this.options.fog.enabled);

        // Boot players
        for (const player of Object.values(this.options.players)) {
            if (player.spawned) {
                this.trigger('map:player:spawn', player);
            }
        }
        // Boot spawns
        for (const spawn of Object.values(this.options.spawns)) {
            this.trigger('map:spawn', spawn);
        }
    }
});