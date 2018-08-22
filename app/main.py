import os
from urllib.parse import urljoin

import requests
import wtforms
from flask import Flask, render_template, request, redirect, url_for
from markupsafe import Markup
from wtforms import validators, ValidationError

app = Flask(__name__, template_folder="templates")
template = "plot.html"

MODEL_URL = urljoin(os.getenv("MODEL_HOST", "http://mprofile-method.default.svc.cluster.local"), "/plot")


class MutaGenValidators(object):

    @staticmethod
    def pam_idx_validator(form, field):
        if field.data < 0 or field.data >= (len(form.seq.data) - 3):
            raise ValidationError('PAM idx out of range')

    @staticmethod
    def dna_validator(form, field):
        if sum([x in ['A', 'T', 'G', 'C'] for x in field.data]) != len(field.data):
            raise ValidationError('Sequence must be composed of A,T,G,or C only')

    @staticmethod
    def seq_length_validator(form, field):
        try:
            if len(field.data) < 20 or form.pam_idx.data < 13 or form.pam_idx.data > len(field.data) - 7:
                raise ValidationError(
                    'Sequence too short or PAM too close to edge of sequence '
                    '(must have at least 10nt either side of cut site)')
        except TypeError:
            raise ValidationError('Index of PAM is not a number')

    @staticmethod
    def ngg_pam_validator(form, field):
        if form.seq.data[field.data + 1:field.data + 3] != 'GG':
            raise ValidationError('Non NGG PAM (check correct index of PAM)')


class MutationalProfileForm(wtforms.Form):
    seq = wtforms.StringField('Target DNA sequence', [validators.DataRequired(),
                                                      MutaGenValidators.dna_validator,
                                                      MutaGenValidators.seq_length_validator])
    pam_idx = wtforms.IntegerField('Index of PAM (0-based)', [validators.DataRequired(),
                                                              MutaGenValidators.pam_idx_validator,
                                                              MutaGenValidators.ngg_pam_validator])


@app.route('/')
def hello():
    return redirect(url_for('plot'))


@app.route('/FORECasT', methods=["GET", "POST"])
def plot():
    form = MutationalProfileForm(request.form)
    if request.method == 'POST' and form.validate():
        seq = form.seq.data
        pam_idx = form.pam_idx.data
        plot_data = requests.post(MODEL_URL, data={"seq": seq,
                                                   "pam_idx": pam_idx})
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
