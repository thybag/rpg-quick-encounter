import Component from 'lumpjs/src/component.js';
import tpl from '../../utils/tpl.js'
import localData from '../../services/localData.js';
import checkImage from '../../utils/checkImage.js'

import getIconImage,
    {  
        getPlayerIcons,
        getMonsterIcons,
        getCustomIcons
    } 
    from '../../utils/getIconImage.js';

const controlTpl = function() {
    return tpl(`
        <main></main>
        <footer><button>Cancel</button></footer>
    `);
}

const iconList = function(){
    let NPCList = '', MonsterList= '', CustomList='';;

    getPlayerIcons().forEach(i => {
       NPCList += `<img src="${getIconImage(i)}" data-id="${i}">`;
    });
    getMonsterIcons().forEach(i => {
       MonsterList += `<img src="${getIconImage(i)}" data-id="${i}">`;
    });
    getCustomIcons().forEach(i => {
       CustomList += `<img src="${getIconImage(i)}" data-id="${i}">`;
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

async function loadFile(iconImg) {
    const imgData = await new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(iconImg)
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
    });

    return checkImage(imgData);    
}


async function imageToIcon(iconImg) {
    let img = await loadFile(iconImg);

    // Local storage is small so we wanna scale it down before we save
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // draw source image into the off-screen canvas:
    canvas.width = 70;
    canvas.height = 70;
    ctx.drawImage(img, 0, 0, 70, 70);

    return canvas.toDataURL('image/webp', .8)
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
        "click button": "close",
        "click span": "addIcon",

        "dragover main": "uploadEnable",
        "drop main": "upload",
        "dragenter main": "uploadFocus",
        "dragleave main": "uploadBlur",
    },
    uploadEnable: function(e){
        // Need this to be able to upload.
        e.preventDefault();
    },
    open: function(parent) {
        this.prop.visible = true;
        this.parent = parent;
        this.render();
    },
    select: function(e, item) {
        this.parent.src = item.src;
        this.parent.dataset.id = (item.dataset.id) ? item.dataset.id : item.src;

        this.close();
    },
    close: function(){
        this.parent = null;
        this.prop.visible = false;
        this.render();
    },
    uploadFocus: function(e){
        e.preventDefault();
        this.el.classList.add("uploadHover");
    },
    uploadBlur: function(e){
        e.preventDefault();
        this.el.classList.remove("uploadHover");
    },
    upload: async function(e) {
        e.preventDefault();

        const files = e.dataTransfer.files;
        
        // Get files that were dragged
        for (let f=0; f<files.length; f++) {
            let file = files[f], path;
            // Only deal with images
            if (!file.type.match('image.*')) continue;

            let newIcon = await imageToIcon(file);
            localData.saveIcon(newIcon);
        }
        this.render();
        this.uploadBlur(e);
    },
    addIcon: async function(){
        const iconPath = prompt("Icon image url");
        if (iconPath) {
            try {
                let img = await checkImage(iconPath);
                localData.saveIcon(iconPath);
                this.render();
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