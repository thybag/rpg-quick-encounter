import Component from 'lumpjs/src/component.js';
import tpl from '../../utils/tpl.js'

const controlTpl = function() {
    let NPCList = '',MonsterList= '';
    for(let i=1;i<=8;i++){
       NPCList += `<img src="assets/players/${i}.png">`;
    }
    for(let i=1;i<=30;i++){
       MonsterList += `<img src="assets/monsters/${i}.png">`;
    }

    return tpl(`
        <div>Monsters</div>
            ${MonsterList}
        <div>NPCs</div>
            ${NPCList}
    `);
}

export default Component.define({
    initialize: function (options) {
        this.el = controlTpl();
        this.el.className = 'image-picker';
        this.el.style.display = 'none';
        document.body.appendChild(this.el);
    },
    parent: null,
    prop: {
        visible: false,
    },
    events: {
        "click img": "select",
    },
    open: function(parent) {
        this.prop.visible = true;
        this.parent = parent;
        this.render();
    },
    select: function(e, item) {
        this.parent.src = item.src;

        this.parent = null;
        this.prop.visible = false;
        this.render();
    },
    render: async function () 
    {
        if (this.prop.visible){
            this.el.style.display = 'block';
        } else {
            this.el.style.display = 'none';
        }
    }
});