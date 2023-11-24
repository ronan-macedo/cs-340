'use strict'
/**
 * Display password function
 */
const showPassword = () => {
    let passwordField = document.getElementById("account_password");

    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

/**
 * Password validator handlers 
 */
const passwordInput = document.getElementById("account_password");
const specialCharChecker = document.getElementById("special");
const capitalCharChecker = document.getElementById("capital");
const numberCharChecker = document.getElementById("number");
const lengthChecker = document.getElementById("length");
const specialCharPattern = /[!@#$%^&*()_+"/]/g;
const capitalCharPattern = /[A-Z]/g;
const numberCharPettern = /\d/g;
const minimumLength = 12;

passwordInput.onfocus = () => {
    document.getElementById("passwordValidator").style.display = "block";
}

passwordInput.onblur = () => {
    document.getElementById("passwordValidator").style.display = "none";
}

passwordInput.onkeyup = () => {
    if (passwordInput.value.match(specialCharPattern)) {
        specialCharChecker.classList.remove("invalid");
        specialCharChecker.classList.add("valid");
    } else {
        specialCharChecker.classList.remove("valid");
        specialCharChecker.classList.add("invalid");
    }

    if (passwordInput.value.match(capitalCharPattern)) {
        capitalCharChecker.classList.remove("invalid");
        capitalCharChecker.classList.add("valid");
    } else {
        capitalCharChecker.classList.remove("valid");
        capitalCharChecker.classList.add("invalid");
    }

    if (passwordInput.value.match(numberCharPettern)) {
        numberCharChecker.classList.remove("invalid");
        numberCharChecker.classList.add("valid");
    } else {
        numberCharChecker.classList.remove("valid");
        numberCharChecker.classList.add("invalid");
    }

    if (passwordInput.value.length >= minimumLength) {
        lengthChecker.classList.remove("invalid");
        lengthChecker.classList.add("valid");
    } else {
        lengthChecker.classList.remove("valid");
        lengthChecker.classList.add("invalid");
    }
}
