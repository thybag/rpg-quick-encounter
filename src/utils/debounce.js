export default (callback, time = 250, interval) => {
    return (...args) => {
        clearTimeout(interval);
        interval = setTimeout(() => callback(...args), time);
    };
};
