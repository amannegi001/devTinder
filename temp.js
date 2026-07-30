const validator = require("validator");

const gmail = "Haland.Here.21@gmail.com";

console.log(
    validator.normalizeEmail(gmail, {
        gmail_remove_dots: true,
    })
);

console.log(
    validator.isEmail("Halandhere21.@gmail.com")
);