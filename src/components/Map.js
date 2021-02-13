import Component from 'lumpjs/src/component.js';
import createMap from '../utils/leafletMap.js';
import fogOfWar from '../utils/fogOfWar.js'

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
        "map:player:spawn": "spawnPlayer",
        "map:player:focus": "focusPlayer",
        "map:spawn": "spawnNpc",
        "update:fog.enabled": "fogToggled",
        "update:fog.opacity": "fogOpacityChanged",
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
        const icon = L.divIcon({
            className: 'character-icon',
            html: `<img src='${img}'><span>${name}</span>`,
            iconSize:     [55, 70],
            iconAnchor:   [35, 35],
        });

        return L.marker(
            this.map.getCenter(),
            {
                icon: icon, 
                draggable: true,
                ref: ref
            }
        ).addTo(this.map);
    },
    focusPlayer: function(player) {
        console.log("focus", playerToIconMap[player.id]);

        this.map.panTo(playerToIconMap[player.id].getLatLng());
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
        console.log("!!aaa");
        console.log("!!",this.options.map);
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
    }
});