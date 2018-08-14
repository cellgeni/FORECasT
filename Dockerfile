FROM tiangolo/uwsgi-nginx-flask:python3.6

COPY ./app /app

RUN pip install --upgrade pip && pip install -r /app/requirements.txt

ENV LISTEN_PORT 8005
ENV PYTHONPATH=/
ENV FLASK_DEBUG 1

EXPOSE 8005

