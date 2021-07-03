let allocated = 0;

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
        return this._set(mapPrefix + key, data);
    };

    // Get all map paths in dataPrefix
    this.getMaps = function() {
        const len = (dataPrefix + mapPrefix).length;
        // Find matching maps, the strip of prefix based on
        // length of len
        return Object.keys(storage).filter((x) => {
            return x.startsWith(dataPrefix + mapPrefix);
        }).map((x) => {
            return x.substr(len);
        });
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
};
