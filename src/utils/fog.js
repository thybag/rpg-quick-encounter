import {multiPolygon, polygon} from '@turf/helpers';
import difference from '@turf/difference';
import union from '@turf/union';

/**
 * Convert multi polygon geojson to array of lat/lng pairs
 *
 * @param  {[type]} mpoly [description]
 * @return {[type]}       [description]
 */
function mployToPairs(mpoly) {
    return mpoly.map((poly) => {
        if (poly.lat) return [poly.lat, poly.lng];

        return mployToPairs(poly);
    });
}

/**
 * Keep track of cut out sections
 * @return {[type]} [description]
 */
export default new function() {
    this.cutouts = null;

    this.loadCutOuts = function(multipolys) {
        // Load cutouts from restore.
        //
        // This data is the drawn multipoly of the leaflet mask
        // so we need to strip off the outer mask (as we don't deal with
        // that here) and the convert the poly or multipolys from leaflet
        // latLngs to [lat,lng] pairs.
        multipolys.shift();
        this.cutouts = mployToPairs(multipolys);

        return this.cutouts;
    };

    this.addCutOut = function(poly) {
        if (!this.cutouts) {
            this.cutouts = [poly];
            return this.cutouts;
        }
        const cutoutPoly = multiPolygon(this.cutouts);
        const newPoly = polygon([poly]);
        const u = union(cutoutPoly, newPoly);

        this.cutouts = u.geometry.coordinates;

        return this.cutouts;
    };

    this.removeCutOut = function(poly) {
        const cutoutPoly = multiPolygon(this.cutouts);
        const newPoly = polygon([poly]);

        const u = difference(cutoutPoly, newPoly);

        // Handle null if no difference found (ie. we cleared it all)
        if (!u) {
            return this.cutouts = [];
        }

        return this.cutouts = u.geometry.coordinates;
    };
}();
