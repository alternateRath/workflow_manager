from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

class Post:
    def __init__(self, link, legenda, horario, comentarios=None, plataformas=None):
        self.link = link
        self.legenda = legenda
        self.horario = horario
        self.comentarios = comentarios or []
        self.plataformas = plataformas or []

agenda = {}

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        link = request.form.get("link")
        legenda = request.form.get("legenda")
        horario = request.form.get("horario")
        comentarios = request.form.getlist("comentarios")
        plataformas = request.form.getlist("plataformas")

        postagem = Post(link, legenda, horario, comentarios, plataformas)

        if horario:
            agenda.setdefault(horario, []).append(postagem)

    return render_template("index.html", agenda=agenda)

@app.route("/agenda")
def agenda_page():
    return render_template("agenda.html", agenda=agenda)

if __name__ == "__main__":
    app.run(debug=True)
