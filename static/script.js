document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("postForm");

    postForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(postForm);

        fetch("/", {
            method: "POST",
            body: formData,
        }).then(response => {
            if (response.ok) {
                window.location.href = "/agenda";
            } else {
                alert("Error scheduling the post. Please try again.");
            }
        }).catch(error => {
            console.error("Fetch error:", error);
            alert("An error occurred. Please try again.");
        });
    });
});
