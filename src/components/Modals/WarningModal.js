import Component from 'lumpjs/src/component.js';

export default Component.define({
    callback: function() {},
    initialize: function(options) {
        this.callback = options.callback;

        // Render base template
        this.el = this.tpl(
            options.notice,
            options.explanation,
        );

        // Create self on the global level as needed.
        document.body.appendChild(this.el);
    },
    // Events
    events: {
        'click button.confirm': 'confirm',
    },
    // Templates
    className: 'modal',
    template: (notice, explanation) => {
        return `
            <div class='confirm-modal'>
                <h2>${notice}</h2>
                ${explanation ? `<p>${explanation}</p>` : ''}
                <div>
                    <button class="confirm">Okay</button>
                </div>
            </div>
        `;
    },
    // Save data to target
    confirm: function(e, target) {
        this.callback();
        this.close();
    },
});
