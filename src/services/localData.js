export default new function() {
  const storage = window.localStorage;
  const mapPrefix = 'map:';

  this.hasMap = function(key) {
    return (storage.getItem(mapPrefix+key));
  }

  this.loadMap = function(key) {
    return JSON.parse(storage.getItem(mapPrefix+key))
  }

  this.saveMap = function(key, data) {
    return storage.setItem(mapPrefix+key, JSON.stringify(data));
  }

  this.getMaps = function() {
      return Object.keys(storage).filter(x => {return x.startsWith('map:')});
  }

  this.getIcons = function() {
    let icons = JSON.parse(storage.getItem('icons'));
    return (icons) ? icons : [];
  }

  this.saveIcon = function(iconPath) {
    let icons = this.getIcons();
    icons.push(iconPath);
    storage.setItem('icons', JSON.stringify(icons));
  }

  this.removeIcon = function() {

  }
}