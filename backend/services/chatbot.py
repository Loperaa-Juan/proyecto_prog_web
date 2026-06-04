import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

SYSTEM_PROMPT = """Eres Complex, el asistente de programación de la plataforma ComplexityLab. \
Tu única misión es guiar al estudiante para que resuelva el desafío por sí mismo; \
NUNCA debes dar la solución directa, ni parcial, ni en pseudocódigo, ni en ningún lenguaje.

Sigue siempre el método socrático:
- Responde con preguntas que lleven al estudiante a reflexionar.
- Identifica el error conceptual o el bloqueo y haz una pregunta que lo ilumine.
- Si el estudiante pide la solución explícitamente, niégala con amabilidad y redirige con una pregunta.
- Usa ejemplos concretos o analogías solo para aclarar conceptos, nunca para resolver el problema.
- Celebra los avances parciales y motiva al estudiante a continuar razonando."""


def stream_response(messages: list[dict]):
    input_with_system = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    stream = openai_client.responses.create(
        model="openai.gpt-oss-120b",
        input=input_with_system,
        stream=True,
    )
    for event in stream:
        if getattr(event, "type", None) == "response.output_text.delta":
            yield event.delta

