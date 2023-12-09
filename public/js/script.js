'use strict'
/**
 * Handle loader when submit or click a form
 */
document.addEventListener('submit', () => {
    loaderHandler(true);
});

let links = document.getElementsByTagName("a");

for (const element of links) {
    element.addEventListener('click', () => {
        loaderHandler(true);
    });
}

document.addEventListener('onload', () => {
    loaderHandler(false);
});

const loaderHandler = (isLoad) => {
    if (isLoad) {
        document.getElementById("loader").style.display = "block";
    } else {
        document.getElementById("loader").style.display = "none";
    }
}
