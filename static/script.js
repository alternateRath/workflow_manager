document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("postForm");

    postForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const link = document.getElementById("link").value;
        // Obtenha os outros campos de entrada e crie um objeto Post

        const dataHora = document.getElementById("data_hora").value;
        if (dataHora) {
            fetch("/", {
                method: "POST",
                body: new URLSearchParams({ "link": link, "data_hora": dataHora }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(response => {
                if (response.ok) {
                    // Postagem bem-sucedida
                    window.location.href = "/agenda";
                } else {
                    // Trate erros aqui, se necessário
                    console.error("Erro ao agendar a postagem.");
                }
            });
        }
    });
});
