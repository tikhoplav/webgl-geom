import App from "./app.js";

window.onload = function () {
    const app = new App();

    // Init drawers and add them to the app

    const draw = function () {
        app.draw()
        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
};

export function getSource(fileName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileName);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(`Failed to load ${fileName} : ${xhr.responseText}`);
            }
        }
        xhr.onerror = function () {
            reject(`Failed to load ${fileName} : ${xhr.responseText}`);
        }
        xhr.send();
    });
};