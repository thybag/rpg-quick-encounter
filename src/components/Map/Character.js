import L from 'leaflet';
import Template from '../../utils/template.js';
import Component from 'lumpjs/src/component.js';
import getIconImage from '../../utils/getIconImage.js';

const iconTpl = new Template({
  template: (name, icon) => {
    return `
        <img src="${getIconImage(icon)}">
        <span>${name}</span>
    `;
  },
});

function makeIcon(name, icon) {
  return L.divIcon({
    className: 'character-icon',
    html: iconTpl.render(name, icon),
    iconSize: [60, 80],
    iconAnchor: [1, 1],
  });
}

function makeMarker(ref, icon, map) {
  const position = (ref.x) ? L.latLng(ref.x, ref.y) : map.getCenter();
  return L.marker(
      position,
      {
        icon: icon,
        draggable: true,
      },
  );
}

export default Component.define({
  marker: null,
  icon: null,
  ref: null,
  map: null,
  events: {
    'marker:click': 'characterClick',
    'marker:dblclick': 'characterDblClick',
    'marker:dragend': 'characterDragend',
    'marker:contextmenu': 'characterRemove',
    'marker:zoom': 'zoom',
    'marker:zoomend': 'zoomend',
    'marker:zoomstart': 'zoomstart'
  },
  initialize: function({ref, map}) {
    // Store key vals
    this.ref = ref;
    this.map = map;
    this.icon = makeIcon(ref.name, ref.icon);
    this.marker = makeMarker(ref, this.icon, map);

    // Register events
    this.marker.on('click', (e) => this.trigger('marker:click', e));
    this.marker.on('dblclick', (e) => this.trigger('marker:dblclick', e));
    this.marker.on('dragend', (e) => this.trigger('marker:dragend', e));
    this.marker.on('contextmenu', (e) => this.trigger('marker:contextmenu', e));

    this.map.on('zoom', (e) => this.trigger('marker:zoom', e));
    this.map.on('zoomend', (e) => this.trigger('marker:zoomend', e));
    this.map.on('zoomstart', (e) => this.trigger('marker:zoomstart', e));

    this.render();
  },
  panTo: function() {
    this.map.panTo(this.marker.getLatLng());
  },
  characterClick: function(event) {
    event.preventDefault;
    console.log('click me');
  },
  zoomend: function(event)
  {
    return;
    console.log(event);
    const mapImg = event.target._container.querySelector('.leaflet-image-layer');
    const ratio = mapImg.width/mapImg.naturalWidth;

    console.log(mapImg.width, mapImg.naturalWidth, ratio);
    this.marker._icon.style.opacity = '1';
    this.marker._icon.style.width = 75*ratio+'px';

    const offset = (75*ratio-80)/2;
     this.marker._icon.querySelector('span').style.marginLeft = offset+'px';
     this.marker._icon.querySelector('span').style.width = '80px';

   // this.map.
  },
  zoomstart: function() {
    return;
     this.marker._icon.style.opacity = '0';

  },
  zoom: function() {
    
    return;
    // Size options
    // 
    // fixed - always same size
    // 
    // scaled - sized to fit map tiles
     console.log(this.map.getSize(),"wd",this.map.getZoom(), this.map.getZoom()*(60/10));
     let ptToPx = Math.abs(this.map.latLngToLayerPoint([1,1]).x - this.map.latLngToLayerPoint([1,10]).x);
     ptToPx = ptToPx/100;
     const nIconSize = (75*ptToPx);
     console.log("px:",nIconSize+'px');
     this.marker._icon.style.width = nIconSize+'px';

     // Name box is 80px min. So work out new size
     

  },
  characterDblClick: function(event) {
    event.preventDefault;
    // Going old school for now
    const name = prompt('Rename?', this.ref.name);
    if (name) {
      event.target._icon.querySelector('span').innerText = this.ref.name = name;
    }
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
    // Add to map
    this.marker.addTo(this.map);
  },
});
