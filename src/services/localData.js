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
  }
  this._get = function(key) {
    return JSON.parse(storage.getItem(dataPrefix + key));
  }
  this._set = function(key, value) {
    return storage.setItem(dataPrefix + key, JSON.stringify(value));
  }
  this._has = function(key) {
    return (storage.getItem(dataPrefix + key));
  }

  this.hasMap = function(key) {
    return (this._has(mapPrefix + key));
  };

  this.loadMap = function(key) {
    return this._get(mapPrefix + key);
  };

  this.saveMap = function(key, data) {
    return this._set(mapPrefix + key, data);
  };

  this.getMaps = function() {
    return Object.keys(storage).filter((x) => {
      return x.startsWith(dataPrefix + mapPrefix);
    });
  };

  this.getIcons = function() {
    const icons = this._get('icons');
    return (icons) || {};
  };

  this.getIcon = function(id) {
    const icons = this.getIcons();
    return icons[id];
  };

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
