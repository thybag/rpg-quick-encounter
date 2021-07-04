import BaseMobModal from './BaseMobModal.js';

export default BaseMobModal.define({
    initialize: function(options) {
        this.target = options.target;

        // Render base template
        this.el = this.tpl(
            "Update Mob",
            this.target.name, 
            this.target.icon
        );

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    // Save data to target
    save: function(e, target) {
        this.target.name = this.el.querySelector('input[type=text]').value;
        this.target.icon = this.el.querySelector('img').dataset.id;
        this.close();
    },
});
