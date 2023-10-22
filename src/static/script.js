document.addEventListener("DOMContentLoaded", function () {
  const postForm = document.getElementById("postForm");
  const errorMessageContainer = document.getElementById("error-message");

  const validateFormData = () => {
    const link = document.getElementById("link").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!link || !date || !time) {
      return "All fields are required";
    }

    // Add more validation as needed, for example, validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(link)) {
      return "Please enter a valid URL";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateFormData();
    if (validationError) {
      errorMessageContainer.textContent = validationError;
      errorMessageContainer.style.display = "block";
      return;
    }

    // Hide error message container if validation passes
    errorMessageContainer.style.display = "none";

    const formData = new FormData(postForm);
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    formData.append("data_hora", `${date} ${time}`);

    try {
      const response = await fetch("/", { // Adjust the URL if needed
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      window.location.href = "/agenda";
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessageContainer.textContent = "An error occurred. Please try again.";
      errorMessageContainer.style.display = "block";
    }
  };

  if (postForm) {
    postForm.addEventListener("submit", handleSubmit);
  }

  // Initializing the sortable feature for posts
  const postsList = document.getElementById("postsList");
  if (postsList) {
    Sortable.create(postsList, {
      group: 'posts',
      animation: 150,
      onEnd: function (evt) {
        const order = this.toArray();
        // Send the new order to the server, adjust the URL and request format as needed
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
          })
          .catch((error) => {
            console.error('Error updating order:', error);
          });
      },
    });
  }
});
