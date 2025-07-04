// backend/src/utils/emailTemplates.ts

type SupportTemplateParams = {
  email: string;
  topic: string;
  message: string;
};

export function buildSupportEmailText({ email, topic, message }: SupportTemplateParams): string {
  return `
    Message de contact\n
    Sujet : ${topic}\n
    Email : ${email}\n
    Message :\n${message}
  `;
}

export function buildSupportEmailHtml({ email, topic, message }: SupportTemplateParams): string {
  return `
    <h2>Message de contact</h2>
    <p><strong>Sujet :</strong> ${topic}</p>
    <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Message :</strong><br />${message.replace(/\n/g, "<br />")}</p>
  `;
}
