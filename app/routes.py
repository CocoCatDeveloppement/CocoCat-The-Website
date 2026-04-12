from flask import Blueprint, render_template 

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template("index.html")

@main.route("/jeu")
def jeu():
    return render_template("jeu.html")

@main.route("/star")
def star():
    return render_template("star.html")

@main.route("/shooter")
def shooter():
    return render_template("shooter.html")

@main.route("/surprise")
def surprise():
    return render_template("surprise.html")

@main.app_errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404