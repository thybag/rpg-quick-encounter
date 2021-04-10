let allocated = 0;

function uid() {
  return (new Date().getTime()) + '_' + (allocated++);
}

export default new function() {
  const storage = window.localStorage;
  const mapPrefix = 'map:';

  this.hasMap = function(key) {
    return (storage.getItem(mapPrefix + key));
  };

  this.loadMap = function(key) {
    return JSON.parse(storage.getItem(mapPrefix + key));
  };

  this.saveMap = function(key, data) {
    return storage.setItem(mapPrefix + key, JSON.stringify(data));
  };

  this.getMaps = function() {
    return Object.keys(storage).filter((x) => {
      return x.startsWith('map:');
    });
  };

  this.getIcons = function() {
    const icons = JSON.parse(storage.getItem('icons'));
    return (icons) || {};
  };

  this.getIcon = function(id) {
    const icons = this.getIcons();
    return icons[id];
  };

  this.saveIcon = function(iconPath) {
    const icons = this.getIcons();
    icons['icon:' + uid()] = iconPath;
    storage.setItem('icons', JSON.stringify(icons));
  };

  this.removeIcon = function() {

  };

  this.setPlayers = function(players) {
    storage.setItem('players', JSON.stringify(players));
  };

  this.getPlayers = function() {
    const players = JSON.parse(storage.getItem('players'));
    return players || null;
  };
};
