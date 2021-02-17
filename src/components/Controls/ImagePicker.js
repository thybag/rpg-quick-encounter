import Component from 'lumpjs/src/component.js';

import tpl from '../../utils/tpl.js'

import localData from '../../services/localData.js';
import checkImage from '../../utils/checkImage.js'

const controlTpl = function() {
    return tpl(`
        <main></main>
        <footer><button>Cancel</button></footer>
    `);
}

const iconList = function(){
    let NPCList = '',MonsterList= '',CustomList='';;
    for(let i=1;i<=8;i++){
       NPCList += `<img src="assets/players/${i}.png">`;
    }
    for(let i=1;i<=33;i++){
       MonsterList += `<img src="assets/monsters/${i}.png">`;
    }

    localData.getIcons().forEach(i => {
        console.log(i);
        CustomList += `<img src="${i}">`;
    });

    return tpl(`
        <div>Your images</div>
            <span>+</span>  ${CustomList}
        <div>NPCs/Players</div>
            ${NPCList}
        <div>Monsters</div>
            ${MonsterList}
    `);
};

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
        "click button": "close",
        "click span": "addIcon"
    },
    open: function(parent) {
        this.prop.visible = true;
        this.parent = parent;
        this.render();
    },
    select: function(e, item) {
        this.parent.src = item.src;

        this.close();
    },
    close: function(){
        this.parent = null;
        this.prop.visible = false;
        this.render();
    },
    addIcon: async function(){
        const iconPath = prompt("Icon image url");
        if (iconPath) {
            try {
                let img = await checkImage(iconPath);
                localData.saveIcon(iconPath);
                this.parent.src = iconPath;
                this.close();
            } catch(e){
                alert("failed to load image");
            } 
            
        }
        
    },
    render: async function () 
    {
        this.el.querySelector('main').innerHTML = iconList().innerHTML;

        if (this.prop.visible){
            this.el.style.display = 'block';
        } else {
            this.el.style.display = 'none';
        }
    }
});