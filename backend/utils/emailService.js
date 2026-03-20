import nodemailer from "nodemailer";

// Ensure required environment variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("EMAIL_USER and EMAIL_PASSWORD must be defined in .env");
}

// Create Gmail transporter (correct pairing: 587 + secure false)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify SMTP connection at startup
transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export const sendVerificationEmail = async (email, token, userName) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `Mouser Clone <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address - Mouser Clone",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Mouser Clone</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Email Verification Required</p>
          </div>

          <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
              Hi <strong>${userName}</strong>,
            </p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to Mouser Clone! Please verify your email address to activate your account and start shopping.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="
                display: inline-block;
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                padding: 12px 40px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
              ">
                Verify Email Address
              </a>
            </div>

            <p style="font-size: 12px; color: #9ca3af; margin: 20px 0;">
              Or copy and paste this link into your browser:
            </p>

            <p style="font-size: 12px; color: #3b82f6; word-break: break-all; margin: 10px 0 20px 0; padding: 10px; background-color: white; border-left: 3px solid #3b82f6;">
              ${verificationUrl}
            </p>

            <p style="font-size: 12px; color: #9ca3af; margin: 20px 0 0 0;">
              This link will expire in 24 hours. If you didn't create this account, please ignore this email.
            </p>
          </div>

          <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              © ${new Date().getFullYear()} Mouser Clone. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: `Mouser Clone <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Mouser Clone!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Mouser Clone!</h1>
          </div>

          <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
              Hi <strong>${userName}</strong>,
            </p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 15px 0;">
              Your email has been verified successfully! Welcome to our community.
            </p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
              You can now:
            </p>

            <ul style="font-size: 14px; color: #6b7280; margin: 0 0 20px 20px;">
              <li>Browse our extensive electronics catalog</li>
              <li>Place orders and track shipments</li>
              <li>Save favorites for quick access</li>
              <li>Apply to become a seller</li>
            </ul>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>

          <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              © ${new Date().getFullYear()} Mouser Clone. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const sendOrderStatusEmail = async (toEmail, subject, messageHtml) => {
  if (!toEmail) return;
  try {
    await sendEmail(toEmail, subject, messageHtml);
  } catch (err) {
    console.error('sendOrderStatusEmail error:', err);
  }
};
