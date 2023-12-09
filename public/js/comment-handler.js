'use strict'

const comments = document.getElementById("comments");
const addComment = document.getElementById("addComment");
const erros = document.getElementById("erros");
const comment_text = document.getElementById("comment_text");
const inv_id = document.getElementById("inv_id");
const account_id = document.getElementById("account_id");
const account_type = document.getElementById("account_type");

if (addComment) {
    addComment.addEventListener("click", () => {
        loaderHandler(true);
        let url = "/comment/addComment";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                comment_text: comment_text.value,
                inv_id: parseInt(inv_id.value),
                account_id: parseInt(account_id.value),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.ok) {
                    comment_text.value = "";
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

                getComments();
                loaderHandler(false);
            })
            .catch(error => {
                buildCommentError(error);
                loaderHandler(false);
            });
    });
}

const getComments = () => {
    loaderHandler(true);
    let url = `/comment/getComments/${inv_id.value}`;
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error("Network response was not OK");
        })
        .then(data => {
            buildComments(data);
            loaderHandler(false);
        })
        .catch(error => {
            buildCommentError(error);
            loaderHandler(false);
        });
}

const editComment = (comment_id) => {
    loaderHandler(true);
    const new_comment_text = document.getElementById(`comment-${comment_id}`);
    let url = '/comment/updateComment';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            comment_id: comment_id,
            comment_text: new_comment_text.value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => {
            if (response.ok) {
                comment_text.value = "";
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

            getComments();
            loaderHandler(false);
        })
        .catch(error => {
            buildCommentError(error);
            loaderHandler(false);
        });
}

const deleteComment = (comment_id) => {
    loaderHandler(true);    
    let url = '/comment/deleteComment';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            comment_id: comment_id,            
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => {
            if (response.ok) {
                comment_text.value = "";
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

            getComments();
            loaderHandler(false);
        })
        .catch(error => {
            buildCommentError(error);
            loaderHandler(false);
        });
}

const buildComments = (data) => {
    comments.innerHTML = "";
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    let commentList = "<ul>";
    if (data.length > 0) {
        data.forEach(comment => {
            let createDate = new Date(comment.comment_createdate);
            let updateDate = comment.comment_updatedate ? new Date(comment.comment_updatedate) : null;
            let editCondition = account_id ? comment.account_id === parseInt(account_id.value) : false;
            let deleteCondition = account_id ? (comment.account_id === parseInt(account_id.value) ||
                (account_type.value == "Employee" || account_type.value == "Admin")) : false;
            commentList += `<li>
                    <div class="user-comment">
                        <div class="user-comment-header">
                        <label for="comment-${comment.comment_id}">
                            <p><b>${comment.account_firstname} ${comment.account_lastname}</b></p>
                        </label>`;
            commentList += editCondition ?
                `<img src="/images/site/edit.png" alt="edit-pencil" title="Enable edit comment" onclick="enableComment(${comment.comment_id})">` :
                "";
            commentList += `</div>                    
                    <textarea name="comment-${comment.comment_id}" id="comment-${comment.comment_id}" readonly>${comment.comment_text}</textarea>
                    <div class="user-comment-footer">`;
            if (deleteCondition || editCondition) {
                commentList += '<div class=user-comment-buttons>';
                commentList += editCondition ?
                    `<button id="comment-edit-${comment.comment_id}" onclick="editComment(${comment.comment_id})" disabled>Update</button>` : 
                    "";
                commentList += deleteCondition ?
                    `<button id="comment-delete-${comment.comment_id}" onclick="deleteComment(${comment.comment_id})">Delete</button>` : 
                    "";
                commentList += '</div>';
            }
            commentList += `<div class="comment-dates">
                <p>Created at: ${createDate.toLocaleString("en-US", options)}</p>`;
            commentList += comment.comment_updatedate ?
                `<p>Updated at: ${updateDate.toLocaleString("en-US", options)}</p>` :
                "";
            commentList += `</div>
                        </div>
                    </div>
                </li>`;
        });
    } else {
        commentList += `<li>
                <p class="no-comment">
                    <b>Sorry, no comments yet. Be the first to comment!</b>
                </p>
            </li>`;
    }

    commentList += "</ul>";
    comments.innerHTML = commentList;
}

const enableComment = (comment_id) => {
    const commentTextarea = document.getElementById(`comment-${comment_id}`);

    if (commentTextarea) {
        commentTextarea.removeAttribute("readonly");
    }

    const commentEditButton = document.getElementById(`comment-edit-${comment_id}`);

    if (commentEditButton) {
        commentEditButton.removeAttribute("disabled");
    }
}

const buildCommentError = (errorResponse) => {
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

getComments();
