import L from 'leaflet';
import circleToPolygon from './circleToPolygon.js';
import fog from './fog.js';

L.Fog = L.Rectangle.extend({
    options: {
        stroke: false,
        color: '#111',
        fillOpacity: 0.7,
        clickable: false,
    },
    initialize: function(bounds, options) {
        // Offset bounds so fog boundry isn't in view
        bounds._northEast.lat +=300;
        bounds._northEast.lng +=300;
        bounds._southWest.lat -=300;
        bounds._southWest.lng -=300;
        L.Polygon.prototype.initialize.call(this, [this._boundsToLatLngs(bounds)], options);
    },
    initFog: function(mask) {
    // Load mask back to fog format & apply it from reload
        const newFog = fog.loadCutOuts(mask);
        this.applyFog(newFog);
    },
    clearFog: function(latLng, size = 36) {
    // Get area Poly
        const areaPoly = circleToPolygon([latLng.lat, latLng.lng], size);
        const cutouts = fog.addCutOut(areaPoly);

        return this.applyFog(cutouts);
    },
    addFog: function(latLng, size = 36) {
        const areaPoly = circleToPolygon([latLng.lat, latLng.lng], size);
        const cutouts = fog.removeCutOut(areaPoly);

        return this.applyFog(cutouts);
    },
    setOpacity: function(opacity) {
        this.setStyle({fillOpacity: opacity});
    },
    applyFog: function(cutouts) {
        this._latlngs = [this._latlngs[0]];
        cutouts.map((value, index) => {
            this._latlngs[index + 1] = this._convertLatLngs(value);
        });
        return this.redraw();
    },
});

L.fog = function(bounds, options) {
    return new L.Fog(bounds, options);
};

/**
 * Create fog layer
 *
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
export default function(map) {
    // Create fog of war mask
    return L.fog(map.getBounds()).addTo(map);
}
