import Component from 'lumpjs/src/component.js';
import getIconImage from '../../utils/getIconImage.js';

function makeIcon(name, icon) {
    return L.divIcon({
        className: 'character-icon',
        html: `<img src='${getIconImage(icon)}'><span>${name}</span>`,
        iconSize:     [60, 80],
        iconAnchor:   [35, 35],
    });
}
function makeMarker(ref, icon, map) {
    const position = (ref.x) ? L.latLng(ref.x, ref.y) : map.getCenter();
    return L.marker(
        position,
        {
            icon: icon, 
            draggable: true,
        }
    );
}

export default Component.define({
    marker: null,
    icon: null,
    ref: null,
    map: null,
    events: {
        "marker:click":     "characterClick",
        "marker:dblclick":  "characterDblClick",
        "marker:dragend":   "characterDragend"

    },
    initialize: function ({ref, map}) {
        // Store key vals
        this.ref = ref;
        this.map = map;
        this.icon = makeIcon(ref.name, ref.icon);
        this.marker = makeMarker(ref, this.icon, map);

        // Register events
        this.marker.on('click', (e) => this.trigger('marker:click', e));
        this.marker.on('dblclick', (e) => this.trigger('marker:dblclick', e));
        this.marker.on('dragend', (e) => this.trigger('marker:dragend', e));

        this.render();
    },
    panTo: function(){
        this.map.panTo(this.marker.getLatLng());
    },
    characterClick: function(event) {
        event.preventDefault;
        console.log("click me");
    },
    characterDblClick: function(event) {
        event.preventDefault;
        // Going old school for now
        let name = prompt("Rename?", this.ref.name);
        if (name) {
            event.target._icon.querySelector('span').innerText = this.ref.name = name;
        }
    },
    characterDragend: function(event){
        const latLng = event.target.getLatLng();
        // Sync
        this.ref.x = latLng.lat;
        this.ref.y = latLng.lng;
    },
    render: function() {
        // Add to map
        this.marker.addTo(this.map);
    }
});