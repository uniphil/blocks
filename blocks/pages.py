from flask import render_template
from blocks import app


@app.route('/')
def main():
    return render_template('main.html')
