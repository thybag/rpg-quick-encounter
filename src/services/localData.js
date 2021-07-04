let allocated = 0;

/**
 * UID
 * @return {string} Unique ID for this instance
 */
function uid() {
    return (new Date().getTime()) + '_' + (allocated++);
}

export default new function() {
    const storage = window.localStorage;
    const mapPrefix = 'map:';
    let dataPrefix = '';

    this.setDataPrefix = function(newPrefix) {
        dataPrefix = newPrefix;
    };
    // Get helper to reteave a value from store
    this._get = function(key) {
        return JSON.parse(storage.getItem(dataPrefix + key));
    };
    // Set helper, to save a value to store
    this._set = function(key, value) {
        return storage.setItem(dataPrefix + key, JSON.stringify(value));
    };
    // Exists helper to check if value exists in store.
    this._has = function(key) {
        return (storage.getItem(dataPrefix + key));
    };

    this.hasMap = function(key) {
        return (this._has(mapPrefix + key));
    };

    this.loadMap = function(key) {
        return this._get(mapPrefix + key);
    };

    this.saveMap = function(key, data) {
        const clean = JSON.parse(JSON.stringify(data));
        // Inject last updated.
        clean['data:updated'] = new Date();

        return this._set(mapPrefix + key, clean);
    };

    // Get all map paths in dataPrefix
    this.getMaps = function() {
        // Find matching maps
        const maps = Object.entries(storage).filter(
            // Include only relevent maps
            ([key, data]) => {
                return key.startsWith(dataPrefix + mapPrefix);
            },
        ).map(
            // Parse in to real data
            ([key, data]) => {
                return JSON.parse(data);
            },
        );

        // Most recently used first
        maps.sort(function(b, a) {
            // Legacy issue for now is a lot of older maps won't have the updated date.
            // For these assume it was 2020.
            const d1 = (a['data:updated']) ? new Date(a['data:updated']) : new Date('2020-01-01');
            const d2 = (b['data:updated']) ? new Date(b['data:updated']) : new Date('2020-01-01');
            return d1-d2;
        });

        return maps;
    };

    // Get all icons
    this.getIcons = function() {
        const icons = this._get('icons');
        return (icons) || {};
    };

    // get a single icon
    this.getIcon = function(id) {
        const icons = this.getIcons();
        return icons[id];
    };

    // Save a new icon
    this.saveIcon = function(iconPath) {
        const icons = this.getIcons();
        icons['icon:' + uid()] = iconPath;
        this._set('icons', icons);
    };

    this.removeIcon = function() {

    };

    this.setPlayers = function(players) {
        this._set('players', players);
    };

    this.getPlayers = function() {
        const players = this._get('players');
        return players || null;
    };

    this.listen = function(map, callback) {
        if (!this.hasMap(map)) return;

        const dataKey = dataPrefix + mapPrefix + map;
        window.addEventListener('storage', (change) => {
            if (change.key === dataKey) {
                callback(JSON.parse(change.newValue));
            }
        });
    };
};
