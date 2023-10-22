document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("postForm");

    const validateFormData = () => {
        const link = document.getElementById("link").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

<<<<<<< Updated upstream:static/script.js
        const formData = new FormData(postForm);
=======
        // Check if link, date, and time values are not empty
        return link && date && time;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateFormData()) {
            alert("Please fill out all fields correctly!");
            return;
        }

        const formData = new FormData(postForm);
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        formData.append("data_hora", `${date} ${time}`);
>>>>>>> Stashed changes:src/static/script.js

        fetch("/", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server responded with an error.");
            }
            window.location.href = "/agenda";
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("An error occurred. Please try again.");
        });
    };

    postForm.addEventListener("submit", handleSubmit);
});
