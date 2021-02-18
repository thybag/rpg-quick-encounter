import Component from 'lumpjs/src/component.js';
import AddPlayers from './Wizard/AddPlayers.js';
import localData from '../services/localData.js';
// utils
import checkImage from '../utils/checkImage.js';
import tpl from '../utils/tpl.js';

const wizardTpl = function(player) {
  return tpl(`
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
    `);
};

const savesTlp = function(saves) {
  return tpl(`
        <h2>Your existing saves</h2>
        <main>
            ${saves.map((s) => {
    const map = s.substr(4);// Remove prefix
    return `<a href="?map=${map}"><img src="${map}"/></a>`;
  }).join('')}
        </main>
    `);
};

export default Component.define({
  initialize: function(config) {
    this.el = wizardTpl();
    document.body.appendChild(this.el);
    this.render();
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
      const saveZone = savesTlp(saves);
      saveZone.className = 'save-zone';
      this.el.appendChild(saveZone);
    }
  },
});
