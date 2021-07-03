export default (callback, time = 250, interval) =>
    (...args) => {
        clearTimeout(interval);
        interval = setTimeout(() => callback(...args), time);
    };
