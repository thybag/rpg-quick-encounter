import Component from 'lumpjs/src/component.js';
import Model from 'lumpjs/src/model.js';

import EncounterMap from './components/Map.js';
import Players from './components/PlayerBar.js';
import Controls from './components/Controls.js';

import localData from './services/localData.js';
import migrateMapData from './services/mapMigrate.js';
import {setMapState, setAppState} from './utils/state.js';

import applyDefaults from './utils/applyDefaults.js';
import debounce from './utils/debounce.js';
import {setIconPath} from './utils/getIconImage.js';

export default Component.define({
    initialize: function(config) {
    // Take control of root
        this.el.classList = 'app';

        // Apply defaults and sanity check
        const setup = applyDefaults(config.options);
        setAppState(setup.config);

        // Configure app
        localData.setDataPrefix(setup.config.dataPrefix);
        setIconPath(setup.config.assetPath);

        // Reload saved map state
        if (localData.hasMap(setup.data.map) && config.save !== 'false') {
            // migrateMapData will ensure map data version is updated to
            // the latest format
            setup.data = migrateMapData(localData.loadMap(setup.data.map));
        }

        // Setup map as reactive model
        const mapState = new Model(setup.data);
        setMapState(mapState);

        // Setup DOM structure for Encounter maps
        const wrapperEl = document.createElement('div');
        const mapEl = document.createElement('div');
        const playerEl = document.createElement('div');
        const controlEl = document.createElement('div');

        wrapperEl.appendChild(mapEl);
        wrapperEl.appendChild(playerEl);

        // Add to self
        this.el.appendChild(wrapperEl);
        this.el.appendChild(controlEl);

        // Boot Core Components
        const map = EncounterMap.make({el: mapEl, state: mapState});
        const players = Players.make({el: playerEl, players: mapState.get('players')});
        const controls = Controls.make({el: controlEl, state: mapState});

        /* to refactor */
        players.on('map:player:spawn', function(player) {
            map.trigger('map:player:spawn', player);
        });
        players.on('map:player:focus', function(player) {
            map.trigger('map:player:focus', player);
        });

        controls.on('map:spawn', function(v) {
            mapState.data.spawns.push({
                ...v,
                id: mapState.data.spawns.length,
                spawned: true,
            });
        });

        // Test code to see if we can sync data between maps
        window.addEventListener('storage', (change) => {
            if (change.key == 'map:'+setup.data.map) {
                const newData = JSON.parse(change.newValue);
                mapState.set('spawns', newData.spawns);
                mapState.set('fog', newData.fog);
                mapState.set('players', newData.players);

                console.log('Sync changes');
            }
        });

        // Debugging
        mapState.on('change', function(a, b, c, d) {
            if (a != 'NONE') console.log('CHANGE', a, b, c, d);
        });

        // Save local storage
        mapState.on('updated', debounce(
            () => {
                // Avoid unneeded saves
                localData.saveMap(mapState.get('map'), mapState.data);
                console.log(JSON.parse(JSON.stringify(mapState.data)));
            }, 50),
        );
    },
});
