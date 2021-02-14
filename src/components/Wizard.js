import Component from 'lumpjs/src/component.js';
import tpl from '../utils/tpl.js'
import checkImage from '../utils/checkImage.js'

const wizardTpl = function(player) {
    return tpl(`
        <h1>Start your new Encounter!</h1>
        <main>
            <p>
                <strong>RPG quick encounter</strong> is an online tool to help you get up and running with your next encounter in moments.
            </p>
            <hr>
            <label>Paste the link to the map you'd like to use</label>
            <input type='url' name="map" placeholder="https://..." required>
        </main>
        <footer>
            <button class="submit">Start your encounter</button>
        </footer>
    `);
}

export default Component.define({
    initialize: function (config) {
        this.el = wizardTpl();
        document.body.appendChild(this.el); 
        this.render();
    },
    events: {
        "click .submit": "startEncounter",
        "keyup input[name=map]": "detectSubmit"
    },
    detectSubmit: function(e){
        if (e.key =='Enter' || e.keyCode == 13) {
            this.startEncounter();
        }
    },
    startEncounter: async function() {
        let mapInput = this.el.querySelector('input[name=map]');  

        // Check its a url
        if (!mapInput.checkValidity()){
            mapInput.reportValidity()
            return;
        }

        // Check its a valid image
        try {
            let img = await checkImage(mapInput.value);
        } catch(e){
            mapInput.setCustomValidity("URL is not an image or cannot be reached.");
            mapInput.reportValidity();
            return;
        }

        // Send em to the app!
        window.location = window.location.pathname +'?map=' + mapInput.value;
        
    },
    render: async function () 
    {
        this.el.className = 'wizard';  
    }
});