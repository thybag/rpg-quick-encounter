import Encounter from './Encounter.js';

// I still don't really get why rollup and similar tools now
// want people to include css files in the js itself, vs just giving styles
// their on entry point, but what u gonna do.
import 'leaflet/dist/leaflet.css'
import './app.css';

// If we are using this direct we take everything from URL.
const url = new URLSearchParams(window.location.search);
const map = url.get('map');
let players = url.get('players');

// No players, Generate some defaults
if (!players) {
	players = [
		{id: 1, name:'Wizard', icon: null},
		{id: 2, name:'Tank', icon: null},
		{id: 3, name:'Caster', icon: null},
		{id: 4, name:'Healer', icon: null},
		{id: 5, name:'Rogue', icon: null}
	];
}
// Setup default images if none provided
players = parsePlayers(players);

// Basic setup for standalone
const options = {
	'container': '#map',
	'playerBar': '#player-bar',
	'controlBar': '#control-bar',
	'map': map,
	'players': players,
	'spawns': [],
	fog: {
		enabled: true,
		opacity: 70,
		clearSize: 36,
		mask: ''
	}
}

export default Encounter.make({options});

function parsePlayers(players) {

	// No point using a smarter algo for 8 elements.
	let iconList = [1,2,3,4,5,6,7,8];
	iconList = iconList.sort(() => Math.random() - 0.5)

	players.map((p, index) => {
		if (!p.icon) {
			p.icon = `assets/players/${iconList[index]}.png`;
		}
		return {id: index, name: p.name, icon: p.icon, spawned: false, x: null, y:null};
	});
	
	return players;
}