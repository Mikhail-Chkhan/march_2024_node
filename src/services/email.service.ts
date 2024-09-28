import path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import hbs from "nodemailer-express-handlebars";

import { configs } from "../config/configs";
import { emailConstants } from "../constants/email.constants";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api.error";

class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configs.EMAIL_USER,
        pass: configs.EMAIL_PASS,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts",
        ),
        partialsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials",
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));

    // Тестируем соединение
    this.transporter.verify(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }

  public async sendMail(
    email: string,
    emailAction: EmailTypeEnum,
    locals?: Record<string, string>,
  ) {
    try {
      const { subject, template } = emailConstants[emailAction];
      // context["frontUrl"] = configs.APP_FRONT_URL;
      const mailOptions = {
        to: email,
        subject: subject,
        template: template,
        context: locals,
      };
      return await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new ApiError(e.message, e.status || 500);
    }
  }
}

export const emailService = new EmailService();
