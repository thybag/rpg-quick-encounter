/**
 * Migrate map data to latest structures
 * 
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export default function(data) {
	// Initial migration to data version 3.
	// No major changes to structure have yet been made, so this is
	// mostly just stripping out legacy data points.
	if (!data['data:version'] || data['data:version'] < 3) {
		data = {
			map: data.map,
			players: data.players,
			spawns: data.spawns,
			fog: data.fog,	
			icon: data.icon,
			'data:version': 3
		};
	}

	// v4 yet to come...

	return data;
}