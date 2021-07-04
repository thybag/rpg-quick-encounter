import Component from 'lumpjs/src/component.js';

export default Component.define({
    callback: function() {},
    initialize: function(options) {
        this.callback = options.callback;

        // Render base template
        this.el = this.tpl(
            options.question,
        );

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    // Events
    events: {
        'click button.cancel': 'close',
        'click button.confirm': 'confirm',
    },
    // Templates
    className: 'modal',
    template: (question) => {
        return `
            <div class='remove-modal'>
                <h2>${question}</h2>
                <div>
                    <button class="confirm">Yes</button>
                    <button class="cancel">No</button>
                </div>
            </div>
        `;
    },
    // Save data to target
    confirm: function(e, target) {
        this.callback();
        this.close();
    },

    // Remove modal
    close: function() {
        this.destroy();
    },
});
