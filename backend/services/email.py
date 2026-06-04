import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader, select_autoescape

load_dotenv()


_TEMPLATES_DIR = Path(__file__).parent.parent / "templates" / "email"

email_service: "EmailService | None" = None


class EmailService:
    def __init__(self):
        self.remitente = os.getenv("EMAIL_ACCOUNT")
        self.app_password = os.getenv("PASSWORD_EMAIL_ACCOUNT")

        if not self.remitente:
            raise ValueError(
                "EMAIL_ACCOUNT no está configurada en las variables de entorno"
            )
        if not self.app_password:
            raise ValueError(
                "PASSWORD_EMAIL_ACCOUNT no está configurada en las variables de entorno"
            )

        self._jinja = Environment(
            loader=FileSystemLoader(str(_TEMPLATES_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    def _send(self, destinatario: str, asunto: str, html_content: str):
        email = EmailMessage()
        email["From"] = self.remitente
        email["To"] = destinatario
        email["Subject"] = asunto
        email.set_content("Este correo requiere un cliente que soporte HTML.")
        email.add_alternative(html_content, subtype="html")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(self.remitente, self.app_password)
            smtp.send_message(email)

    def _render(self, filename: str, **kwargs) -> str:
        return self._jinja.get_template(filename).render(**kwargs)

    def send_challenge_solved(
        self, destinatario: str, user_name: str, challenge_title: str, solver_name: str
    ):
        html = self._render(
            "challenge_solved.html",
            user_name=user_name,
            challenge_title=challenge_title,
            solver_name=solver_name,
        )
        self._send(
            destinatario,
            f"¡Tu challenge '{challenge_title}' recibió una solución!",
            html,
        )

    def send_challenge_rejected(
        self,
        destinatario: str,
        user_name: str,
        challenge_title: str,
        reviewer_name: str,
        rejection_reason: str = "No cumple con los requisitos del challenge.",
    ):
        html = self._render(
            "challenge_rejected.html",
            user_name=user_name,
            challenge_title=challenge_title,
            reviewer_name=reviewer_name,
            rejection_reason=rejection_reason,
        )
        self._send(
            destinatario,
            f"Tu solución al challenge '{challenge_title}' fue rechazada",
            html,
        )

    def send_challenge_approved(
        self,
        destinatario: str,
        user_name: str,
        challenge_title: str,
        reviewer_name: str,
    ):
        html = self._render(
            "challenge_approved.html",
            user_name=user_name,
            challenge_title=challenge_title,
            reviewer_name=reviewer_name,
        )
        self._send(
            destinatario,
            f"¡Tu solución al challenge '{challenge_title}' fue aprobada!",
            html,
        )


def init_email_service():
    global email_service
    email_service = EmailService()
