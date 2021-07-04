import L from 'leaflet';
import Component from 'lumpjs/src/component.js';
import getIconImage from '../../utils/getIconImage.js';

import SpawnModal from '../Controls/SpawnModal.js';

/**
 * Make Leaflet Marker
 *
 * @param  {[type]} position  [description]
 * @return {[type]}      [description]
 */
function makeMarker(position) {
    return L.marker(
        position,
        {
            draggable: true,
        },
    );
}

export default Component.define({
    marker: null,
    ref: null,
    map: null,
    // Events
    events: {
        'marker:click': 'characterClick',
        'marker:dblclick': 'characterDblClick',
        'marker:dragend': 'characterDragend',
        'marker:contextmenu': 'characterRemove',
        'data:change': 'render',
    },
    initialize: function({ref, map}) {
        // Store key vals
        this.ref = ref;
        this.map = map;

        this.marker = makeMarker(
            (ref.x) ? L.latLng(ref.x, ref.y) : map.getCenter(),
        );
        // Add to map
        this.marker.addTo(this.map);

        // Register events
        this.marker.on('click', (e) => this.trigger('marker:click', e));
        this.marker.on('dblclick', (e) => this.trigger('marker:dblclick', e));
        this.marker.on('dragend', (e) => this.trigger('marker:dragend', e));
        this.marker.on('contextmenu', (e) => this.trigger('marker:contextmenu', e));

        this.ref.on('update', (e) => this.trigger('data:change', e));

        // Make icon
        this.render();
    },
    template: (name, icon) => {
        return `
            <img src="${getIconImage(icon)}">
            <span>${name}</span>
        `;
    },
    panTo: function() {
        this.map.panTo(this.marker.getLatLng());
    },
    characterClick: function(event) {
        event.preventDefault;
    },
    characterDblClick: function(event) {
        event.preventDefault;
        // Going old school for now
        SpawnModal.make({target: this.ref});
    },
    characterDragend: function(event) {
        const latLng = event.target.getLatLng();
        // Sync
        this.ref.x = latLng.lat;
        this.ref.y = latLng.lng;
    },
    characterRemove: function(event) {
        event.preventDefault;
        if (confirm('Are you sure you want to remove this character?')) {
            this.ref.spawned = false;
            this.marker.remove();
        }
    },
    render: function() {
        this.ref = this.ref.refresh();
        // Sync spawned?
        // remove / add to map?

        // Sync position
        this.marker.setLatLng([this.ref.x, this.ref.y]);
        // Sync icon
        this.marker.setIcon(
            L.divIcon({
                className: 'character-icon',
                html: this.tpl(this.ref.name, this.ref.icon),
                iconSize: [60, 80],
                iconAnchor: [35, 35],
            }),
        );
    },
});
