// Icon list
let iconList = [1,2,3,4,5,6,7,8];

const getRandomIconId = function() {
	return Math.floor((Math.random() * iconList.length) + 1)
}

const getRandomIconIdList = function() {
	// No point using a smarter algo for 8 elements.
	return iconList.sort(() => Math.random() - 0.5);
}

const getRandomIconLink = function() {
	return `assets/players/${getRandomIconId()}.png`
}

const getRandomIconLinksList = function() {
	return getRandomIconIdList().map((v) => `assets/players/${v}.png`);
}

export { 
	getRandomIconIdList, 
	getRandomIconId,
	getRandomIconLink,
	getRandomIconLinksList
};

export default getRandomIconIdList;