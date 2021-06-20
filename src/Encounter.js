import Component from 'lumpjs/src/component.js';
import Model from 'lumpjs/src/model.js';

import EncounterMap from './components/Map.js';
import Players from './components/PlayerBar.js';
import Controls from './components/Controls.js';

import localData from './services/localData.js';
import {setMapState, setAppState, getAppState, getMapState} from './utils/state.js';

import applyDefaults from './utils/applyDefaults.js';
import {setIconPath} from './utils/getIconImage.js';

export default Component.define({
  initialize: function(config) {
    // Take control of root
    this.el.classList = 'app';

    // Apply defaults and sanity check
    let setup = applyDefaults(config.options);
    setAppState(setup.config);

    // Set storage key
    localData.setDataPrefix(setup.config.dataPrefix);

    // Reload saved map state
    if (localData.hasMap(setup.data.map) && config.save !== 'false') {
      setup.data = localData.loadMap(setup.data.map);
    } 

    // Setup map as reactive model
    let mapState = new Model(setup.data);
    setMapState(mapState);

    // Setup DOM structure for Encounter
    let wrapperEl = document.createElement('div')
    let mapEl = document.createElement('div');
    let playerEl = document.createElement('div');
    let controlEl = document.createElement('div');

    wrapperEl.appendChild(mapEl);
    wrapperEl.appendChild(playerEl);

    // Add to self
    this.el.appendChild(wrapperEl);
    this.el.appendChild(controlEl);

    // Boot Core Components
    const map = EncounterMap.make({el: mapEl, state: mapState});
    const players = Players.make({el: playerEl, state: mapState});
    const controls = Controls.make({el: controlEl, state: mapState});


    /* to refactor */
    players.on('map:player:spawn', function(player) {
      map.trigger('map:player:spawn', player);
    });
    players.on('map:player:focus', function(player) {
      map.trigger('map:player:focus', player);
    });

    map.on('aaa')

    controls.on('map:spawn', function(v) {
      const spawn = {
        ...v,
        id: mapState.data.spawns.length,
        x: 0,
        y: 0,
        spawned: true,
      };
      mapState.data.spawns.push(spawn);
      map.trigger('map:spawn', mapState.data.spawns[mapState.data.spawns.length - 1]);
    });

    // Save local storage
    mapState.on('updated', () => {
      localData.saveMap(mapState.get('map'), mapState.data);
    });
  },
});
