const getRequestAnimationFrame = () => {
  if (typeof requestAnimationFrame !== 'undefined') {
    return window.requestAnimationFrame.bind(window);
  } else {
    const dummyRequestAnimationFrame = function() {
        let lastTime = 0;

        return function (callback: Callback) {
            const currentTime = new Date().getTime();
            const timeout = Math.max(0, 16 - (currentTime - lastTime));
            const id = window.setTimeout(function() {
                callback(currentTime + timeout);
            }, timeout);

            lastTime = currentTime + timeout;
            return id;
        };
    };
    return dummyRequestAnimationFrame();
  }
};

export const raf = getRequestAnimationFrame();

type Callback = (timestamp: number) => void;