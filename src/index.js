import Encounter from './Encounter.js';
import Wizard from './components/Wizard.js';
import getRandomPlayerIcons from './utils/getRandomPlayerIcons.js';

// I still don't really get why rollup and similar tools now
// want people to include css files in the js itself, vs just giving styles
// their on entry point, but what u gonna do.
import 'leaflet/dist/leaflet.css'
import './app.css';

// Define player defaults
const defaultPlayers = [
	{id: 1, name:'Wizard', icon: null},
	{id: 2, name:'Tank', icon: null},
	{id: 3, name:'Caster', icon: null},
	{id: 4, name:'Healer', icon: null},
	{id: 5, name:'Rogue', icon: null}
];

// If we are using this direct we take everything from URL.
const url = new URLSearchParams(window.location.search);
let map = url.get('map');
let players = parsePlayerUrl(url.get('players'));
let fog = url.get('fog');

let component = null;

// Do we have enought?
if (!map) {
	component = Wizard.make();
} else {
	// Basic setup for standalone
	const options = {
		'container': '#map',
		'playerBar': '#player-bar',
		'controlBar': '#control-bar',
		'map': map,
		// Setup default images if none provided
		'players': configurePlayers(players),
		'spawns': [],
		fog: {
			enabled: !(fog && fog == 'false'),
			opacity: 70,
			clearSize: 36,
			mask: ''
		}
	}
	component = Encounter.make({options});
}

export default component;

/**
 * Get players from player url string
 * Comma seperated list of players - semicolon can be used to add icon
 *
 * players=name,name2,name3
 * players=name;icon_url,name2;icon_url,name3;icon_url
 * 
 * @param  string urlString
 * @return object
 */
function parsePlayerUrl(urlString) {
	// Default players
	if (!urlString) return defaultPlayers;

	// Url provided
	return urlString.split(',').map((p) => {
		// Any custom icons?
		if (p.includes(';')) {
			const parts = p.split(';')
			return {'name': parts[0], 'icon': parts[1]};
		}
		return {'name': p};
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

	const iconList = getRandomPlayerIcons();
	// Add icons to anyone missing one
	players = players.map((p, index) => {
		if (!p.icon) {
			p.icon = `assets/players/${iconList[index]}.png`;
		}
		return {id: index, name: p.name, icon: p.icon, spawned: false, x: null, y:null};
	});
	
	return players;
}