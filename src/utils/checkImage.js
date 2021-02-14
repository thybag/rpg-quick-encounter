export default async function(imgPath) {
  return await new Promise((resolve, reject) => {
      let img = document.createElement('img');
      img.src = imgPath;
      img.onload = () => resolve(img);
      img.onerror = reject;
  });
};