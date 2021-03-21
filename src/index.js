import Encounter from './Encounter.js';
import Wizard from './components/Wizard.js';
import {getRandomPlayerIconList} from './utils/getIconImage.js';

// I still don't really get why rollup and similar tools now
// want people to include css files in the js itself, vs just giving styles
// their on entry point, but what u gonna do.
import 'leaflet/dist/leaflet.css';
import './app.css';

// Define player defaults
const defaultPlayers = [
  {id: 1, name: 'Wizard', icon: null},
  {id: 2, name: 'Tank', icon: null},
  {id: 3, name: 'Caster', icon: null},
  {id: 4, name: 'Healer', icon: null},
  {id: 5, name: 'Rogue', icon: null},
];

// If we are using this direct we take everything from URL.
const url = new URLSearchParams(window.location.search);
const map = url.get('map');
const players = parsePlayerUrl(url.get('players'));
const fog = url.get('fog');

// Disable reload from local storage
const saving = url.has('saving') ? url.get('saving') : 'true';
let component = null;

// Do we have enought?
if (!map) {
  component = Wizard.make();
} else {
  // Basic setup for standalone
  const options = {
    'map': map,
    // Setup default images if none provided
    'players': configurePlayers(players),
    'fog': {
      enabled: !(fog && fog == 'false'),
    },
  };
  component = Encounter.make({options, save: saving});
}

export default component;

/**
 * Get players from player url string
 * Comma seperated list of players - semicolon can be used to add icon
 *
 * players=name,name2,name3
 * players=name;icon_url,name2;icon_url,name3;icon_url
 *
 * @param  {string} urlString
 * @return {object}
 */
function parsePlayerUrl(urlString) {
  // Default players
  if (!urlString) return defaultPlayers;

  // Url provided
  return urlString.split(',').map((p) => {
    // Any custom icons?
    if (p.includes('|')) {
      const parts = p.split('|');
      return {name: parts[0], icon: parts[1]};
    }
    return {name: p};
  });
}

/**
 * Configure player objects
 * Add missing images & sets standard values
 *
 * @param  {object} players
 * @return {object}
 */
function configurePlayers(players) {
  const iconList = getRandomPlayerIconList();
  // Add icons to anyone missing one
  players = players.map((p, index) => {
    if (!p.icon) {
      p.icon = iconList[index];
    }
    return {id: index, name: p.name, icon: p.icon, spawned: false, x: 0, y: 0};
  });

  return players;
}
