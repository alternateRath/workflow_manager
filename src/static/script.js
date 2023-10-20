document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("postForm");

    postForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let date = document.getElementById("date").value;
        let time = document.getElementById("time").value;

        if (!document.getElementById("link").value || !date || !time) {
            alert("Please fill out all fields correctly!");
            return;
        }

        const formData = new FormData(postForm);
        formData.append("data_hora", date + " " + time);

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
