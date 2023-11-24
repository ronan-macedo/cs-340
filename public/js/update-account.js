const profileForm = document.querySelector("#updateProfile");
profileForm.addEventListener("change", () => {
    const updateBtn = document.querySelector("#profileBtn");
    updateBtn.removeAttribute("disabled");
});

const passwordForm = document.querySelector("#changePassword");
passwordForm.addEventListener("change", () => {
    const updateBtn = document.querySelector("#passwordBtn");
    updateBtn.removeAttribute("disabled");
});