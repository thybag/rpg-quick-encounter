const base = {
  'container': '#map',
  'playerBar': '#player-bar',
  'controlBar': '#control-bar',
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
    'mode': 'default'
  },
  'data:version': 2,
};

function applySettings(base, overrides) {
  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === 'object' && value !== null) {
      base[key] = applySettings(base[key] ?? {}, value)
    } else {
      base[key] = value;
    }
  }
  return base;
}

export default function(options) {
  return applySettings(base, options);
}
