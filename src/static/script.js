document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("editModal");
    const postForm = document.getElementById("postForm");
    const errorMessageContainer = document.getElementById("error-message");
    const scheduledPosts = document.getElementById("scheduledPosts");
    const closeButton = document.querySelector('.close-button');

    function getElementSiblingText(element, text) {
        const matchingElement = Array.from(element.getElementsByTagName('strong')).find(el => el.textContent.includes(text));
        return matchingElement && matchingElement.nextElementSibling ? matchingElement.nextElementSibling.textContent : null;
    }

    function openEditModal(post) {
        const link = post.querySelector("a").href;
        const [date, time] = post.querySelector("h3").textContent.split(" ");
        const legenda = getElementSiblingText(post, 'Legenda');
        const comentarios = getElementSiblingText(post, 'Comentários');
        const plataforma = getElementSiblingText(post, 'Plataforma');
        const postId = post.dataset.id;

        modal.querySelector("#link").value = link;
        modal.querySelector("#date").value = date;
        modal.querySelector("#time").value = time;
        modal.querySelector("#legenda").textContent = legenda;
        modal.querySelector("#comentarios").textContent = comentarios;
        modal.querySelector("#plataforma").value = plataforma;
        modal.querySelector("form").action = `/edit_post/${postId}`;
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function togglePlatformSelection(iconElement) {
        iconElement.classList.toggle('selected');
        const selectedPlatforms = Array.from(document.querySelectorAll('.platform-icon.selected')).map(icon => icon.getAttribute('data-platform'));
        document.getElementById('plataforma').value = selectedPlatforms.join(',');
    }

    function handlePostEditClick(event) {
        const postId = event.currentTarget.dataset.id;
        const postCard = document.querySelector(`.post-card[data-id="${postId}"]`);
        openEditModal(postCard);
    }

    function handlePostDeleteClick(event) {
        const postId = event.currentTarget.dataset.id;
        deletePost(postId);
    }

    async function deletePost(postId) {
        try {
            const response = await fetch(`/delete_post/${postId}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Server responded with an error");
            }
            document.querySelector(`.post-card[data-id="${postId}"]`).remove();
            showNotification("Post deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting post:", error);
            showNotification("Error deleting post", "error");
        }
    }

    function validateFormData() {
        const link = document.getElementById("link").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        if (!link || !date || !time) {
            return "All fields are required";
        }

        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(link)) {
            return "Please enter a valid URL";
        }

        return null;
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const validationError = validateFormData();
        if (validationError) {
            showNotification(validationError, "error");
            return;
        }

        const formData = new FormData(postForm);
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        try {
            const response = await fetch(event.currentTarget.action, { method: "POST", body: formData });
            if (!response.ok) {
                throw new Error("Server responded with an error");
            }
            window.location.href = "/agenda";
        } catch (error) {
            console.error("Fetch error:", error);
            showNotification("An error occurred. Please try again.", "error");
        }
    }

    function showNotification(message, type) {
        // Implementation depends on how you want to show notifications.
        // This is just a placeholder function.
        alert(`${type.toUpperCase()}: ${message}`);
    }

    if (scheduledPosts) {
        Sortable.create(scheduledPosts, {
            group: 'posts',
            animation: 150,
            onEnd: function (evt) {
                const order = this.toArray();
                fetch('/update_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ new_order: order }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Order updated:', data);
                    showNotification("Order updated successfully", "success");
                })
                .catch((error) => {
                    console.error('Error updating order:', error);
                    showNotification("Error updating order", "error");
                });
            },
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    if (postForm) {
        postForm.addEventListener("submit", handleFormSubmit);
    }

    document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handlePostEditClick));
    document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handlePostDeleteClick));
    document.querySelectorAll(".platform-icon").forEach(icon => icon.addEventListener("click", () => togglePlatformSelection(icon)));

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
