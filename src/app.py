from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String(100), nullable=False)
    legenda = db.Column(db.Text, nullable=False)
    comentarios = db.Column(db.Text, default="")
    plataforma = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    order = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"Post('{self.link}', '{self.date}', '{self.time}')"

@app.template_filter('datetimeformat')
def datetimeformat(value, format='%I:%M %p, %B %d, %Y'):
    if isinstance(value, datetime):
        return value.strftime(format)
    return value

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        today = datetime.now().date()
        one_week_from_today = today + timedelta(days=7)

        if request.method == "POST":
            link = request.form.get("link")
            date = datetime.strptime(request.form.get("date"), "%Y-%m-%d").date()
            time = datetime.strptime(request.form.get("time"), "%H:%M").time()
            legenda = request.form.get("legenda")
            comentarios = request.form.get("comentarios")
            plataformas = request.form.getlist("plataforma")

            if not link or not date or not time:
                return "Invalid data!", 400

            new_order = Post.query.count() + 1
            postagem = Post(link=link, legenda=legenda, date=date, time=time, comentarios=comentarios, plataforma=",".join(plataformas), order=new_order)
            db.session.add(postagem)
            db.session.commit()

            return redirect(url_for("agenda_page"))

        posts = Post.query.order_by(Post.order, Post.date, Post.time).all()
        return render_template("index.html", today=today, one_week_from_today=one_week_from_today, posts=posts)
    except Exception as e:
        return str(e), 500

@app.route("/agenda")
def agenda_page():
    posts = Post.query.order_by(Post.order, Post.date, Post.time).all()
    return render_template("agenda.html", posts=posts)

@app.route('/update_order', methods=['POST'])
def update_order():
    new_order = request.json.get('new_order')  # List of post IDs in the new order
    if not new_order:
        return 'Invalid data', 400
    for index, post_id in enumerate(new_order):
        post = Post.query.get(post_id)
        if post:
            post.order = index
            db.session.commit()
    return 'Order updated', 200

if __name__ == "__main__":
    app.run(debug=True)
