const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = async (options) => {
  // generated html file from pug
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: 'Danny de Vries <hi@dandevri.es>',
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}

// it's not needed outside mail so no export
const generateHTML = (filename, options = {}) => {
  // mixed up file directories
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options)
  const inlined = juice(html);
  return inlined;
}