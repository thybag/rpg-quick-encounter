let state;

const getState = function() {
	return state;
}

const setState = function(newState) {
	state = newState;
}

export {
  getState,
  setState
};
