const nodemailer = require('nodemailer');
const fs = require('fs');
const sendMessage=function(address){
  //process.env.ADMIN_EMAIL
  var maillist = [
    address
  ];
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASSWORD
  }
  });

  let data=`<!doctype html>
  <html lang="en-US">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title> Email Template</title>
      <meta name="description" content=" Email Template.">
      <style type="text/css">
          a:hover {text-decoration: underline !important;}
      </style>
  </head>
  
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <!--100% body table-->
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
          style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                            <a href="https://www.munzi.io" title="logo" target="_blank">
                              <img width="60" src="https://munzi.io/images/ui/munzi-token.png" title="logo" alt="logo">
                            </a>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;"> You have logged in successfully.</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                             You have logged in successfully.
                                          </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.Munzi.io</strong></p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      <!--/100% body table-->
  </body>
  
  </html>.`
   
  

 
/*message2 = {
  from: `Munzi.io<${process.env.MUNZI_EMAIL}>`,
  to: admin,
  subject: "Munzi Purchase Order",
  html: data
}

fs.readFile('./src/Payment/index.html', {encoding: 'utf-8'}, function (err, html) {
  if (err) {
    console.log(err);
  } else{
    console.log(html)*/
  
   


    message = {
      from: `munziuser@gmail.com`,
      to: maillist,
      subject: "Munzi Notification",
      html: data
  }
  

transporter.sendMail(message,function(err, info) {
    if (err) {
      console.log(err)
      return 'error'
    } else {
      console.log(info);
      return 'sent'
    }
})
/*transporter.sendMail(message2,function(err, info) {
  if (err) {
    console.log(err)
    return 'error'
  } else {
    console.log(info);
    return 'sent'
  }
})*/
return 'success'
//}
//})
}


const sendMessage2=function(address,template){
  const admin ='munziuser@gmail.com';
  //process.env.ADMIN_EMAIL
  var maillist = [
    address
  ];
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: 'munziuser@gmail.com',
    pass: "efhilwhqdihgzqnh"
  }
  });

   
  
   


    message = {
      from: `munziuser@gmail.com`,
      to: maillist,
      subject: "Munzi Notification",
      html: template
  }
  

transporter.sendMail(message,function(err, info) {
    if (err) {
      console.log(err)
      return 'error'
    } else {
      console.log(info);
      return 'sent'
    }
})

return 'success'

}


module.exports={
  sendMessage,
  sendMessage2

}