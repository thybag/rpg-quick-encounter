import L from 'leaflet';
import Component from 'lumpjs/src/component.js';
import getIconImage from '../../utils/getIconImage.js';
import EditMobModal from '../Modals/EditMobModal.js';
import ConfirmModal from '../Modals/ConfirmModal.js';

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
            icon: L.divIcon(),
            draggable: true,
        },
    );
}

// Used to ensure bring to front always works.
let globalZIndexOffset = 0;

export default Component.define({
    marker: null,
    ref: null,
    map: null,
    // Events
    events: {
        'marker:click': 'bringToFront',
        'marker:dblclick': 'characterDblClick',
        'marker:dragstart': 'bringToFront',
        'marker:dragend': 'characterDragend',
        'marker:contextmenu': 'characterRemove',
        'data:change': 'render',
        'data:focus': 'panTo',
    },
    initialize: function({ref, map}) {
        // Store key vals
        this.ref = ref;
        this.map = map;

        // Set initial position if not already defined.
        if (!this.ref.x || !this.ref.y) {
            this.ref.x = map.getCenter().lng;
            this.ref.y = map.getCenter().lat;
        }

        this.marker = makeMarker(
            L.latLng(this.ref.x, this.ref.y),
        );

        // Register events
        this.marker.on('click', (e) => this.trigger('marker:click', e));
        this.marker.on('dblclick', (e) => this.trigger('marker:dblclick', e));
        this.marker.on('dragstart', (e) => this.trigger('marker:dragstart', e));
        this.marker.on('dragend', (e) => this.trigger('marker:dragend', e));
        this.marker.on('contextmenu', (e) => this.trigger('marker:contextmenu', e));

        this.map.on('zoom', (e) => this.trigger('marker:zoom', e));
        this.map.on('zoomend', (e) => this.trigger('marker:zoomend', e));
        this.map.on('zoomstart', (e) => this.trigger('marker:zoomstart', e));

        this.ref.on('update', (e) => this.trigger('data:change', e));
        this.ref.on('focus', (e) => this.trigger('data:focus', e));

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
    bringToFront: function(event) {
        event.preventDefault;
        // Bring character to the front
        globalZIndexOffset++;
        this.marker.setZIndexOffset(globalZIndexOffset*1000);
    },
    characterDblClick: function(event) {
        event.preventDefault;
        EditMobModal.make({target: this.ref});
    },
    characterDragend: function(event) {
        const latLng = event.target.getLatLng();
        // Sync
        this.ref.x = latLng.lat;
        this.ref.y = latLng.lng;
    },
    characterRemove: function(event) {
        event.preventDefault;

        ConfirmModal.make({
            question: `Remove ${this.ref.name} from map?`,
            callback: () => {
                this.ref.spawned = false;
            },
        });
    },
    render: function() {
        // Sync spawned?
        if (!this.ref.spawned || this.ref.removed) {
            this.marker.remove();
        } else {
            this.marker.addTo(this.map);
        }

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
