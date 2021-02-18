import localData from '../services/localData.js';

// Player icons
const playerIcons = 9;
const monsterIcons = 33;

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

// Convert icon to image path
export default function(icon) {
  if (icon.startsWith('icon:')) {
    return localData.getIcon(icon);
  }
  if (icon.startsWith('p:')) {
    return `assets/players/${icon.substr(2)}.png`;
  }
  if (icon.startsWith('m:')) {
    return `assets/monsters/${icon.substr(2)}.png`;
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
};
