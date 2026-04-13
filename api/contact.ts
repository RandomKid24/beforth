import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      res.status(500).json({
        success: false,
        message: 'Email service is not configured. Set GMAIL_USER and GMAIL_PASS.',
      });
      return;
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body && typeof req.body === 'object'
          ? req.body
          : {};

    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const recipients = [
      process.env.GMAIL_USER,
      'support@beforth.in',
      'vivek.zope@beforth.in',
    ].filter(Boolean).join(', ');

    // Setup email data
    const mailOptions = {
      from: `"Beforth Website" <${process.env.GMAIL_USER}>`,
      to: recipients,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0F172A; border-bottom: 2px solid #slate-200; padding-bottom: 10px;">New Form Submission</h2>
          <p>You have received a new message from the Beforth Website contact form.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 120px;">Name</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Subject</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${subject}</td>
            </tr>
          </table>
          
          <h3 style="margin-top: 30px;">Message:</h3>
          <div style="padding: 15px; background: #f8fafc; border-left: 4px solid #0F172A; white-space: pre-wrap;">${message}</div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #64748b;">This email was automatically generated from your Vercel frontend.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('Email error:', error);
    const isJsonParseError =
      error instanceof SyntaxError || /JSON/i.test(String(error?.message || ''));
    const errorMessage = String(error?.message || '').trim();

    res.status(isJsonParseError ? 400 : 500).json({
      success: false,
      message: isJsonParseError
        ? 'Invalid JSON payload.'
        : errorMessage || 'Failed to send message.',
      error: error.message,
    });
  }
}
