import os
from urllib.parse import urljoin

import requests
import wtforms
from flask import Flask, render_template, request
from markupsafe import Markup
from wtforms import validators

app = Flask(__name__, template_folder="templates")
template = "plot.html"

MODEL_URL = urljoin(os.getenv("MODEL_HOST", "http://mprofile-method.default.svc.cluster.local"), "/plot")


class MutationalProfileForm(wtforms.Form):
    seq = wtforms.StringField('Target DNA sequence', [validators.DataRequired()])
    cut_site = wtforms.IntegerField('Index of PAM (0-based)', [validators.DataRequired()])


@app.route('/', methods=["GET", "POST"])
def plot():
    form = MutationalProfileForm(request.form)
    if request.method == 'POST' and form.validate():
        seq = form.seq.data
        cut_site = form.cut_site.data
        plot_data = requests.post(MODEL_URL, data={"seq": seq,
                                                   "pam_idx": cut_site})
        error = plot_data.json().get("error")
        if error:
            if app.debug:
                return render_template(template, plot=error, form=form)
            else:
                return render_template(template, plot="Error occurred", form=form)
        plot_html = plot_data.json().get("plot")
        return render_template(template, plot=Markup(plot_html), form=form)
    return render_template(template, form=form)


if __name__ == '__main__':
    app.run()
