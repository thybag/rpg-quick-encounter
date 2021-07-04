import BaseMobModal from './BaseMobModal.js';
import {getRandomPlayerIcon} from '../../utils/getIconImage.js';;

export default BaseMobModal.define({
    // Setup
    initialize: function(options) {
        console.log(options);
        this.players = options.players;

        // Render base template
        const defaultIcon = getRandomPlayerIcon();
        this.el = this.tpl(
            "Add Player",
            "",
            defaultIcon
        );

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    // Save data to target
    save: function(e, target) {
        this.players = this.players.refresh();
        this.players.push({
            name: this.el.querySelector('input[type=text]').value,
            icon: this.el.querySelector('img').dataset.id,
            spawned: true
        });

        this.close();
    },
});
