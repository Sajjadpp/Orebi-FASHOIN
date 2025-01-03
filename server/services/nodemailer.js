const nodemailer = require("nodemailer")
const createEmail = async(email, otp, isOtp) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        requireTLS: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.pass_NODEMAILER,
        },
    });
      
      // async..await is not allowed in global scope, must use a wrapper
    
    // send mail with defined transport object
   try{
        const info = await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: email, // list of receivers
            subject: "Hello", // Subject line
            text: "", // plain text body
            html: isOtp ? html(otp) : OrderConfirmation(otp), // html body
        });
        
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        return info.accepted.length > 0
   }
   catch(err){
    console.log(err, "error i send")
   }
   
}

module.exports = createEmail


function html(otp){
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 24px; color: #111827;">OREBI Store</h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Hello,
                      </p>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Please use the verification code below to complete your action. This code will expire in 15 minutes.
                      </p>
                      
                      <!-- OTP Code Box -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 30px 0;">
                            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; display: inline-block;">
                              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">
                                ${otp}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280; text-align: center;">
                        This is an automated message, please do not reply to this email.
                        <br>
                        &copy; ${new Date().getFullYear()} OREBI Store. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
}

function OrderConfirmation(data){
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order is On Its Way!</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
                font-size: 24px;
                font-weight: bold;
                color: #000000;
            }
            .tracking-box {
                background-color: #f8f8f8;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .tracking-number {
                font-size: 20px;
                font-weight: bold;
                color: #000000;
                text-align: center;
                padding: 10px;
                background-color: #ffffff;
                border: 1px dashed #cccccc;
                margin: 10px 0;
            }
            .button {
                display: inline-block;
                background-color: #000000;
                color: #ffffff;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                color: #666666;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="logo">FASHION STORE</div>
            
            <p>Dear ${data.username},</p>
            
            <p>Great news! Your order ${data._id} is on its way to you.</p>
            
            <div class="tracking-box">
                <h2 style="margin: 0; text-align: center;">Your Tracking Number</h2>
                <div class="tracking-number">TN123456789XY</div>
                <p style="text-align: center; margin: 10px 0;">Estimated Delivery: 3-5 Business Days</p>
            </div>
            
            <p>You can track your package using the tracking number above or by clicking the button below:</p>
            
            <center>
                <a href="#" class="button">Track Your Order</a>
            </center>
            
            <div style="margin: 20px 0;">
                <p><strong>Order Summary:</strong></p>
                <p>Order Date: ${data.createdAt}<br>
                Shipping Address: ${data?.address}<br>
                Shipping Method: Standard Delivery</p>
            </div>
            
            <p>If you have any questions about your order, please don't hesitate to contact our customer service team.</p>
            
            <div class="footer">
                <p>Thank you for shopping with us!<br>
                FASHION STORE Team</p>
                <p>This email was sent to ${data.email}<br>
                Please do not reply to this email</p>
            </div>
        </div>
    </body>
    </html>
  `
}
