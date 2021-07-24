const base = {
    // App config
    config: {
        'assetPath': 'assets/',
        'dataPrefix': '',
    },
    // Encounter data
    data: {
        'map': null,
        'players': [],
        'spawns': [],
        'fog': {
            enabled: true,
            opacity: 70,
            clearSize: 36,
            mask: '',
        },
        'icon': {
            'tilesize': '60',
            'mode': 'default',
        },
        'data:version': 3,
    },
};

/**
 * Override default setting data with provided values
 *
 * @param  {[type]} base      [description]
 * @param  {[type]} overrides [description]
 * @return {[type]}           [description]
 */
function applySettings(base, overrides) {
    for (const [key, value] of Object.entries(overrides)) {
        if (typeof value === 'object' && value !== null) {
            base[key] = applySettings(base[key] ?? {}, value);
        } else {
            base[key] = value;
        }
    }

    return base;
}

/**
 * Get settings for app
 *
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
export default function(options = {}) {
    return applySettings(base, options);
}
