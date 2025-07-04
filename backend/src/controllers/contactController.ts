import { Request, Response } from "express";
import prisma from "../prisma";
import { sendMail } from "../utils/email/mailer";
import { buildSupportEmailText, buildSupportEmailHtml } from "../utils/email/templates/emailSupport"

export const handleContactForm = async (req: Request, res: Response) => {
  const { email, userId, topic, other, message } = req.body;

  let mailSent = false;
  let saved = null;

  try {
    await sendMail({
      email: email,
      subject: `MessageCraft - ${topic}`,
      text: buildSupportEmailText({email, topic, message}),
      html: buildSupportEmailHtml({email, topic, message}),
    });
    mailSent = true;
  } catch (mailError) {
    console.error("Erreur lors de l'envoi du mail :", mailError);
  }

  try {
    saved = await prisma.contactMessage.create({
      data: { email, userId, topic, other, message },
    });
  } catch (dbError) {
    console.error("Erreur lors de la sauvegarde en base :", dbError);
  }

  if (!mailSent) {
    res.status(500).json({
      success: false,
      critical: true,
      title: "Erreur",
      error: "Une erreur est survenue lors de l'envoi du message.",
    });
    return;
  } else if (saved == null) {
      res.status(500).json({
        success: false,
        critical: false,
        title: "Message envoyé !",
        error: "Le message a bien été envoyé mais n'a pas pu être enregistré.",
      });
      return;
    } else {
      // Si sauvegarde réussie (même si mail échoué)
      res.status(201).json({
        success: true,
        data: saved,
        mailSent,
      });
    }
};