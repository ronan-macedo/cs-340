'use strict'

const formModal = document.getElementById("formModal");
const addImage = document.getElementById("addImage");
const close = document.getElementsByClassName("close")[0];
const galleryItems = document.getElementById("galleryItems");
const erros = document.getElementById("erros");
const inv_id = document.getElementById("inv_id");

addImage.onclick = () => {
    formModal.classList.add("visible");
}

close.onclick = () => {
    formModal.classList.remove("visible");
}

window.onclick = (event) => {
    if (event.target == formModal) {
        formModal.classList.remove("visible");
    }
}

const getComments = () => {
    loaderHandler(true);
    let url = `/gallery/images/getImages/${inv_id.value}`;
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error("Network response was not OK");
        })
        .then(data => {
            buildGallery(data);
            loaderHandler(false);
        })
        .catch(error => {
            buildGalleryError(error);
            loaderHandler(false);
        });
}

const buildGallery = data => {
    galleryItems.innerHTML = "";
    let grid;
    if (data.length > 0) {
        grid = '<ul class="image-display">';
        data.forEach(image => {
            grid += `<li class="image-item" id="img-${image.gallery_id}">
                        <span title="Click to delete this image" class="delete" onclick="deleteImage(${image.gallery_id})">
                            &times;
                        </span>
                        <img src="${image.gallery_image}" alt="Vehicle image">                        
                    </li>`;
        });
        grid += '</ul>';
    } else {
        grid = '<p class="notice">Sorry, no image could be found.</p>';
    }
    galleryItems.innerHTML = grid;
}

const buildGalleryError = (errorResponse) => {
    let errorsList = "<ul>";
    if (errorResponse.errors) {
        errorResponse.errors.forEach(error => {
            errorsList += `<li>
                    <p class="notice">
                        <b>${error.msg}</b>
                    </p>
                </li>`;
        });
    } else {
        errorsList += `<li>
                    <p class="notice">
                        <b>${errorResponse.message}</b>
                    </p>
                </li>`;
    }
    errorsList += "</ul>"
    erros.innerHTML = errorsList;
}

const deleteImage = (gallery_id) => {
    loaderHandler(true);
    let url = `/gallery/images/deleteImage/${gallery_id}`;
    fetch(url, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                erros.innerHTML = "";
                return response.json();
            }

            if (response.status === 400) {
                erros.innerHTML = "";
                return response.json();
            }

            throw new Error("Network response was not OK");
        })
        .then(data => {
            console.log(data);
            if (data.errors) {
                loaderHandler(false);
                return buildCommentError(data);
            }

            window.location.href = `/gallery/${inv_id.value}`;
        })
        .catch(error => {
            buildCommentError(error);
            loaderHandler(false);
        });
}

getComments();
