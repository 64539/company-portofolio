
interface EmailTemplateProps {
  content: string;
  recipientName?: string;
  isAdminNotification?: boolean;
}

const EMAIL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  
  body {
    background-color: #050505;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #050505;
    border: 1px solid #1a1a1a;
  }
  
  .header {
    background: linear-gradient(90deg, rgba(0,242,254,0.1) 0%, rgba(112,0,255,0.1) 100%);
    padding: 30px 20px;
    text-align: center;
    border-bottom: 1px solid #1a1a1a;
  }
  
  .logo {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
  }
  
  .logo span {
    color: #00f2fe;
  }
  
  .content {
    padding: 40px 30px;
    line-height: 1.6;
    color: #e0e0e0;
    font-size: 16px;
  }
  
  .greeting {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #ffffff;
  }
  
  .message-box {
    background-color: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-left: 3px solid #00f2fe;
    padding: 20px;
    margin: 20px 0;
    border-radius: 4px;
    color: #cccccc;
  }
  
  .footer {
    background-color: #0a0a0a;
    padding: 30px 20px;
    text-align: center;
    border-top: 1px solid #1a1a1a;
    font-size: 12px;
    color: #666666;
  }
  
  .social-links {
    margin-bottom: 20px;
  }
  
  .social-link {
    color: #00f2fe;
    text-decoration: none;
    margin: 0 10px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
  }
  
  .button {
    display: inline-block;
    padding: 12px 24px;
    background: #00f2fe;
    color: #000000;
    text-decoration: none;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 4px;
    margin-top: 20px;
    font-size: 12px;
  }
  
  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
      border: none;
    }
    .content {
      padding: 30px 20px;
    }
  }
`;

export const generateEmailHtml = ({ content, recipientName, isAdminNotification = false }: EmailTemplateProps) => {
  const year = new Date().getFullYear();
  const greeting = recipientName ? `Halo ${recipientName},` : "Halo,";
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Synthesize Axonova</title>
        <style>
          ${EMAIL_STYLE}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="https://synthesize-axonova.vercel.app" class="logo">
              SYNTHESIZE <span>AXONOVA</span>
            </a>
          </div>
          
          <div class="content">
            <div class="greeting">${isAdminNotification ? "New Submission Alert" : greeting}</div>
            
            ${content}
            
            ${!isAdminNotification ? `
              <div style="margin-top: 40px; border-top: 1px solid #1a1a1a; padding-top: 20px;">
                <p style="margin: 0; font-weight: 600; color: #ffffff;">Admin Axonova</p>
                <p style="margin: 5px 0 0; font-size: 14px; color: #888888;">Digital Transformation Partner</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://instagram.com/synthesize_axonova" class="social-link">Instagram</a>
              <span style="color: #333;">|</span>
              <a href="https://wa.me/message/EF6VKFRL3TNCM1" class="social-link">WhatsApp</a>
              <span style="color: #333;">|</span>
              <a href="mailto:synthesizeaxonova@gmail.com" class="social-link">Email</a>
            </div>
            <p>&copy; ${year} Synthesize Axonova. All rights reserved.</p>
            <p>Elevating digital experiences through the perfect blend of technical excellence and creative vision.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const getAutoReplyContent = (name: string) => {
  return `
    <p>Terima kasih telah menghubungi Synthesize Axonova. Kami telah menerima permintaan inisialisasi proyek Anda.</p>
    
    <p>Tim kami sedang meninjau detail yang Anda kirimkan. Kami berkomitmen untuk memberikan solusi digital terbaik yang menggabungkan keunggulan teknis dan visi kreatif.</p>
    
    <p>Kami akan menghubungi Anda kembali dalam waktu 1x24 jam untuk mendiskusikan langkah selanjutnya.</p>
    
    <a href="https://synthesize-axonova.vercel.app" class="button">Kunjungi Website</a>
  `;
};

export const getAdminNotificationContent = (data: any) => {
  return `
    <p>You have received a new project inquiry via the website contact form.</p>
    
    <div class="message-box">
      <p style="margin: 0 0 10px;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 0 0 10px;"><strong>Email:</strong> ${data.email}</p>
      <p style="margin: 0 0 10px;"><strong>WhatsApp:</strong> ${data.whatsapp || 'Not provided'}</p>
      <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${data.subject}</p>
      <hr style="border: 0; border-top: 1px solid #333; margin: 15px 0;">
      <p style="margin: 0;"><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
    </div>
    
    <p>Please login to the Admin Gate to reply or manage this submission.</p>
  `;
};
