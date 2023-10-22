from flask import Flask, render_template, request, redirect, url_for
import re
from datetime import datetime, timedelta
import json

app = Flask(__name__)

class Post:
    def __init__(self, link, legenda, horario, comentarios=None, plataformas=None):
        self.link = link
        self.legenda = legenda
        self.horario = horario
        self.comentarios = comentarios or ""
        self.plataforma = plataformas if plataformas is not None else []

agenda = {}

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        today = datetime.now().date()
        one_week_from_today = today + timedelta(days=7)

        if request.method == "POST":
            link = request.form.get("link")
            date = request.form.get("date")
            time = request.form.get("time")
            horario = f"{date} {time}"

            legenda = request.form.get("legenda")
            comentarios = request.form.get("comentarios")
            plataformas = request.form.getlist("plataforma")

            if not link or not re.match(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$", horario):
                return "Invalid data!", 400

            postagem = Post(link, legenda, horario, comentarios, plataformas)
            if horario:
                agenda.setdefault(horario, []).append(postagem)

            return redirect(url_for("agenda_page"))

        return render_template("index.html", today=today, one_week_from_today=one_week_from_today, agenda=agenda)
    except Exception as e:
        return str(e), 500

@app.template_filter('datetimeformat')
def datetimeformat(value, format='%I:%M %p, %B %d, %Y'):
    return datetime.strptime(value, "%Y-%m-%d %H:%M").strftime(format)

@app.route("/agenda")
def agenda_page():
    return render_template("agenda.html", agenda=agenda)

if __name__ == "__main__":
    app.run(debug=True)
