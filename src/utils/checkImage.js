/**
 * Confirm we can access provided image.
 *
 * @param  {[type]} imgPath [description]
 * @return {[type]}         [description]
 */
export default async function(imgPath) {
    return await new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = imgPath;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}
