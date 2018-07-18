import requests
import wtforms
from flask import Flask, render_template, request
from markupsafe import Markup
from wtforms import validators

from config import MODEL_URL

app = Flask(__name__)


class MutationalProfileForm(wtforms.Form):
    seq = wtforms.StringField('Target DNA sequence', [validators.DataRequired()])
    cut_site = wtforms.IntegerField('Index of PAM (1-based)', [validators.DataRequired()])


@app.route('/', methods=["GET", "POST"])
def plot():
    form = MutationalProfileForm(request.form)
    if request.method == 'POST' and form.validate():
        seq = form.seq.data
        cut_site = form.cut_site.data
        plot_data = requests.post(MODEL_URL, data={"seq": seq,
                                                   "cut_site": cut_site})
        plot_html = plot_data.json().get("plot")
        return render_template("plot.html", plot=Markup(plot_html), form=form)
    return render_template("plot.html", form=form)


if __name__ == '__main__':
    app.run()
