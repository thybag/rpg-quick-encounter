import Component from 'lumpjs/src/component.js';
import AddPlayers from './Wizard/AddPlayers.js';

import applyDefaults from '../utils/applyDefaults';
import localData from '../services/localData';

import Template from '../utils/template.js';
// utils
import checkImage from '../utils/checkImage.js';

const savesTlp = new Template({
    'template': (saves) => {
        return `
      <h2>Your existing saves</h2>
      <main>
          ${saves.map((map) => {
        return `<a href="?map=${map.map}">
                <img src="${map.map}" loading="lazy" />
                <div>
                    Map: <span>${map.map}</span> <br/>
                    Players: ${map.players.length}, Mobs: ${map.spawns.length} <br/>
                    Last played: ${map['data:updated'] ? new Date(map['data:updated']).toLocaleString() :'-'}
                </div>
                <div class='play'>
                    <button>Open</button>
                </div>
            </a>`;
    }).join('')}
      </main>
    `;
    },
    'safe': false,
});

export default Component.define({
    initialize: function(config) {
    // Setup default envs
        const setup = applyDefaults();
        localData.setDataPrefix(setup.config.dataPrefix);

        this.el = this.tpl();
        document.body.appendChild(this.el);
        this.render();
    },
    template: () => {
        return `
          <div class="wizard">
              <h1>Start your new Encounter!</h1>
              <main>
                  <p>
                      <strong>RPG quick encounter</strong> is an online tool to help you get up and running with 
                      your next encounter in moments.
                  </p>
                  <hr>

                  <label>Paste the link to the map you'd like to use</label>
                  <input type='url' name="map" placeholder="https://..." required>
                  
                  <span class='more'>More options</span>
                  <div class="advanced">
                     
                  </div>
              </main>
              <footer>
                  <button class="submit">Start your encounter</button>
              </footer>
          </div>
        `;
    },
    playersComponent: null,
    events: {
        'click .submit': 'startEncounter',
        'keyup input[name=map]': 'detectSubmit',
        'click .more': 'showMore',
    },
    showMore: function() {
        if (!this.playersComponent) {
            this.playersComponent = AddPlayers.make();
            this.el.querySelector('.advanced').appendChild(this.playersComponent.el);
        }
        this.el.querySelector('.advanced').classList.toggle('show');
    },
    detectSubmit: function(e) {
        if (e.key == 'Enter' || e.keyCode == 13) {
            this.startEncounter();
        }
    },
    startEncounter: async function() {
        const mapInput = this.el.querySelector('input[name=map]');

        // Check its a url
        if (!mapInput.checkValidity()) {
            mapInput.reportValidity();
            return;
        }

        // Check its a valid image
        try {
            await checkImage(mapInput.value);
        } catch (e) {
            mapInput.setCustomValidity('URL is not an image or cannot be reached.');
            mapInput.reportValidity();
            return;
        }

        let path = window.location.pathname + '?map=' + mapInput.value;

        if (this.playersComponent && this.el.querySelector('.advanced').classList.contains('show')) {
            path += this.playersComponent.toUrlString();
        }

        // Send em to the app!
        window.location = path;
    },
    render: function() {
        this.el.className = 'wizard-container';

        // Do you have any saved maps?
        const saves = localData.getMaps();


        if (saves.length !== 0) {
            const saveZone = savesTlp.render(saves);
            saveZone.className = 'save-zone';
            this.el.appendChild(saveZone);
        }
    },
});
