import L from 'leaflet';
import checkImage from './checkImage.js';


export default async function(target, mapPath) {
  const img = await checkImage(mapPath);

  // Create map
  const map = L.map(target, {
    crs: L.CRS.Simple,
    zoomSnap: 0.20,
  });

  // Config map size
  const width = Math.round(img.width / 10);
  const height = Math.round(img.height / 10);
  const bounds = [[0, 0], [height, width]];
 
  L.imageOverlay(mapPath, bounds).addTo(map);
  map.fitBounds(bounds);

  // Config defualt map zoom.
  const zoom = map.getZoom();
  map.setZoom(zoom + 0.5);
  map.setMaxZoom(zoom + 4);
  map.setMinZoom(zoom - 0.5);

  return map;
}
