from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

class Post:
    def __init__(self, link, legenda, horario, comentarios, plataformas):
        self.link = link
        self.legenda = legenda
        self.horario = horario
        self.comentarios = comentarios
        self.plataformas = plataformas

agenda = {}

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        link = request.form.get("link")
        # Obtenha os outros campos de entrada e crie um objeto Post
        postagem = Post(link, /* outras informações aqui */)

        data_hora = request.form.get("data_hora")
        if data_hora:
            if data_hora not in agenda:
                agenda[data_hora] = []
            agenda[data_hora].append(postagem)

    return render_template("index.html", agenda=agenda)

@app.route("/agenda")
def agenda_page():
    return render_template("agenda.html", agenda=agenda)

if __name__ == "__main__":
    app.run(debug=True)
