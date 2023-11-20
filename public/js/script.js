/**
 * Handle loader when submit or click a form
 */
document.addEventListener('submit', () => {
    document.getElementById("loader").style.display = "block";
});

let links = document.getElementsByTagName("a");

for (var i = 0; i < links.length ; i++) {
    links[i].addEventListener('click', () => {
        document.getElementById("loader").style.display = "block";
    });
}

document.addEventListener('onload', () => {
    document.getElementById("loader").style.display = "none";
});
