export default function(center, radius) {
    const n = 20;
    const angles = 2 * Math.PI / n;
    const coordinates = [];

    for (let i = 0; i < n; i++) {
        const x = center[0] + radius * Math.cos(i * angles);
        const y = center[1] + radius * Math.sin(i * angles);
        coordinates.push([x, y]);
    }

    // Form valid poly line by adding first to the end
    coordinates.push(coordinates[0]);

    return coordinates;
}
