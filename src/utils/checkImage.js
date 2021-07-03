export default async function(imgPath) {
    return await new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = imgPath;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}
