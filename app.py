import requests
import wtforms
from flask import Flask, render_template, request
from wtforms import validators

from config import MODEL_HOST

app = Flask(__name__)


class MutationalProfileForm(wtforms.Form):
    seq = wtforms.StringField('Sequence', [validators.DataRequired()])
    cut_site = wtforms.IntegerField('Cut at', [validators.Length(min=6, max=35),
                                                  validators.DataRequired()])


@app.route('/', methods=["GET", "POST"])
def plot():
    form = MutationalProfileForm(request.form)
    if request.method == 'POST' and form.validate():
        seq = form.seq.data
        cut_site = form.cut_site.data
        plot_data = requests.post(MODEL_HOST, {"seq": seq,
                                          "cut_site": cut_site})
        plot_html = plot_data.json().get("plot")
        return render_template("plot.html", plot=plot_html)
    return render_template("plot.html", form=form)


if __name__ == '__main__':
    app.run()
