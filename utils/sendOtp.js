const nodemailer = require("nodemailer");
const twilio = require("twilio");
const envSecrets = require("../config/index");
const axios=require("axios");

/**
 * Send OTP via email (used for forgot password etc.)
 * Commented out for signup - signup uses SMS via Twilio.
 */
const sendOtpToEmail = async (email, otp) => {
  try {
    if (!envSecrets.EMAIL_USER || !envSecrets.EMAIL_PASSWORD) {
      throw new Error(
        "Email credentials not configured in environment variables",
      );
    }

    const transporter = nodemailer.createTransport({
      service: envSecrets.EMAIL_SERVICE || "gmail",
      auth: {
        user: envSecrets.EMAIL_USER,
        pass: envSecrets.EMAIL_PASSWORD,
      },
      secure: true,
      pool: {
        maxConnections: 1,
        maxMessages: 100,
      },
    });

    const mailOptions = {
      from: envSecrets.EMAIL_FROM || envSecrets.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - Jwellery",
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Your OTP Code</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #d4af37; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p><strong>This OTP will expire in ${envSecrets.OTP_EXPIRY_MINUTES} minutes.</strong></p>
                    <p style="color: #666;">Please do not share this code with anyone.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">If you didn't request this OTP, please ignore this email.</p>
                </div>
            `,
      text: `Your OTP is ${otp}. It will expire in ${envSecrets.OTP_EXPIRY_MINUTES} minutes. Please do not share this code.`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(
      "Internal Server Error during sending OTP. Please try again later.",
    );
  }
};

/**
 * Send OTP via SMS using Twilio (used for signup - OTP on mobile number).
 * toNumber: E.164 format e.g. "+919876543210" (countryCode + phone, no spaces).
 */

// const client = twilio(
//   envSecrets.TWILIO_ACCOUNT_SID,
//   envSecrets.TWILIO_AUTH_TOKEN
// );

// const sendOtpToSms = async (toNumber, otp) => {
//   try {
//     console.log("sendOtpToWhatsapp", toNumber, otp);

//     const message = await client.messages.create({
//       from: "whatsapp:+14155238886", // Twilio sandbox number
//       to: `whatsapp:${toNumber}`,    // e.g. whatsapp:+91XXXXXXXXXX
//       body: `Your OTP is ${otp}. Do not share it.`,
//     });
//     console.log("message",message)

//     return {
//       success: true,
//       message: "OTP sent on WhatsApp",
//       sid: message.sid,
//     };
//   } catch (error) {
//     console.error("❌ WhatsApp OTP Error:", error.message);

//     throw new Error("Failed to send WhatsApp OTP");
//   }
// };


//module.exports.sendOtpToSms = sendOtpToSms;
module.exports = {
  sendOtpToEmail,
  // sendOtpToSms,
};