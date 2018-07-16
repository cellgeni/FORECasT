from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def plot():
    return render_template("plot.html")


if __name__ == '__main__':
    app.run()
