
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const { convert } = require('html-to-text');

/**
 * @class Email
 * @description This class is responsible for sending emails to users
 * @param {object} user - The user
 * @param {string} url - The url to be sent to the user
 */
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user?.name?.split(' ')[0] || user?.handle;
        this.url = url;


    }


    _createTransporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async _send(template, subject) {

        const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, { name: this.name, url: this.url });



        const options = {
            from: 'Post It',
            to: "amobijonathan2@gmail.com",
            subject,
            text: convert(html),
            html,
        }


        // send the actual email
        let info = await this._createTransporter().sendMail(options);

        console.log("Message sent: %s", info.messageId);
    }

    async sendWelcome() {
        await this._send('welcome', 'Welcome to Post It');
    }
    async sendWelcomeBack() {
        this._send('welcomeBack', 'Welcome Back to Post It');
    }
    async sendPasswordReset() {
        await this._send('passwordReset', 'Password Reset');
    }
    async sendPasswordChanged() {
        await this._send('passwordChanged', 'Password Changed');
    }
    async sendAccountDeletion() {
        await this._send('delete', 'Account Deletion');
    }
    async sendUnusualLogin() {
        this._send('unusualLogin', 'Unusual Login');
    }

}



module.exports = Email;

