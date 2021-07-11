let appState; let mapState;

const getAppState = function() {
    return appState;
};

const setAppState = function(newState) {
    appState = newState;
};

const getMapState = function() {
    return mapState;
};

const setMapState = function(newState) {
    mapState = newState;
};

export {
    getAppState,
    setAppState,
    getMapState,
    setMapState,
};
