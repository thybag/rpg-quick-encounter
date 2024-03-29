import localData from '../services/localData.js';

// Player icons
const playerIcons = 9;
const monsterIcons = 33;
let iconPath = 'assets/';

const iconList = []; const monsterList = [];

for (let i = 1; i <= playerIcons; i++) iconList.push('p:' + i);
for (let i = 1; i <= monsterIcons; i++) monsterList.push('m:' + i);

// Get all player icons
const getPlayerIcons = function() {
    return iconList;
};
// Get all monster icons
const getMonsterIcons = function() {
    return monsterList;
};

// Get all custom icons
const getCustomIcons = function() {
    return Object.keys(localData.getIcons());
};

// Get random player icon
const getRandomPlayerIcon = function() {
    return iconList[Math.floor((Math.random() * iconList.length))];
};

// Get random monster icon
const getRandomMonsterIcon = function() {
    return monsterList[Math.floor((Math.random() * monsterList.length))];
};

// Get player icons as unique list
const getRandomPlayerIconList = function() {
    // No point using a smarter algo for 8 elements.
    return iconList.sort(() => Math.random() - 0.5);
};

// Change icon path if being used via another app
const setIconPath = function(path) {
    iconPath = path;
};

/**
 * Convert icon to a usable image path
 *
 * @param  {[type]} icon [description]
 * @return {[type]}      [description]
 */
export default function(icon) {
    if (!icon) {
        return '';
    }

    if (icon.startsWith('icon:')) {
        return localData.getIcon(icon);
    }
    if (icon.startsWith('p:')) {
        return `${iconPath}players/${icon.substr(2)}.png`;
    }
    if (icon.startsWith('m:')) {
        return `${iconPath}monsters/${icon.substr(2)}.png`;
    }

    return icon;
}

export {
    getRandomPlayerIcon,
    getRandomPlayerIconList,
    getRandomMonsterIcon,
    getPlayerIcons,
    getMonsterIcons,
    getCustomIcons,
    setIconPath,
};
