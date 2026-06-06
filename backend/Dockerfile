
FROM python:3.11-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade --timeout 300 -r /code/requirements.txt

COPY . /code/app/

CMD [ "fastapi", "run", "app/main.py", "--port", "8000" ]