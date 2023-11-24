const form = document.querySelector("#updateInventory");
form.addEventListener("change", () => {
    const updateBtn = document.querySelector("input[type=submit]");
    updateBtn.removeAttribute("disabled");
});