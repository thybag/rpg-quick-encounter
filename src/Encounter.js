import Component from 'lumpjs/src/component.js';
import Model from 'lumpjs/src/model.js';

import EncounterMap from './components/Map.js';
import Players from './components/PlayerBar.js';
import Controls from './components/Controls.js';

import localData from './services/localData.js';

import applyDefaults from './utils/applyDefaults.js';
import {setIconPath} from './utils/getIconImage.js';

export default Component.define({
  initialize: function(config) {
    // Take control of root
    this.el = document.querySelector('body');
    this.el.classList = 'app';

    // Apply defaults and sanity check
    let options = applyDefaults(config.options);

    if (options.assetPath) {
      setIconPath(options.assetPath);
    }

    // Get config or load from local storage
    if (localData.hasMap(options.map) && config.save !== 'false') {
      options = localData.loadMap(options.map);
    }

    // Set global state
    const props = new Model(options);

    const map = EncounterMap.make({options: props.data, bus: props});
    const players = Players.make({options: props.data, bus: props});
    const controls = Controls.make({options: props.data, bus: props});

    // Pass model eventing
    map.listenTo(props);

    players.on('map:player:spawn', function(player) {
      map.trigger('map:player:spawn', player);
    });
    players.on('map:player:focus', function(player) {
      map.trigger('map:player:focus', player);
    });

    controls.on('map:spawn', function(v) {
      const spawn = {
        ...v,
        id: props.data.spawns.length,
        x: 0,
        y: 0,
        spawned: true,
      };
      props.data.spawns.push(spawn);
      map.trigger('map:spawn', props.data.spawns[props.data.spawns.length - 1]);
    });

    // Save local storage
    props.on('updated', () => {
      localData.saveMap(config.options.map, props.data);
    });
  },
});
