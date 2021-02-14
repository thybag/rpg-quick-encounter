import Component from 'lumpjs/src/component.js';
import Model from 'lumpjs/src/model.js';

import EncounterMap from './components/Map.js';
import Players from './components/PlayerBar.js';
import Controls from './components/Controls.js';


export default Component.define({
    initialize: function (config) {

        // Get config or load from local storage
        if (window.localStorage) {
            let restore = window.localStorage.getItem(config.options.map);
            if (restore /*&& confirm("Save found - restore?")*/){
                config.options = JSON.parse(restore);
                console.log(config.options);
            } 
        }

        // Set global state
        const props = new Model(config.options);
        
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
            let spawn = {...v, id: props.data.spawns.length, x: null, y:null};
            props.data.spawns.push(spawn);

            map.trigger('map:spawn', spawn);
        });

        // Memory
        props.on('change', (type, prop, newVal) => {
            console.log(type, prop, newVal);
            //console.log("DEBUG:"+type + ' ' + prop, newVal, oldVal);
        });

        props.on('updated', () => {
            //  console.log(props);
            // console.log(JSON.stringify(props.data));
            console.log("save");
            window.localStorage.setItem(config.options.map, JSON.stringify(props.data));
        });


    },
    events: {

    },
    render: function () 
    {

    }
});