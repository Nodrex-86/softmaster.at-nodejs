require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { highlights, services, projects } = require('./data');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    const currentLang = req.query.lang === 'en' ? 'en' : 'de';
    const langData = getLangData(currentLang); // Internal helper call
    
    let pathName = req.path.replace(/^\/|\/$/g, '');
    const pageKey = (pathName === "" || pathName === "index") ? "index" : pathName;
    const cleanUrl = `https://www.softmaster.at/${pageKey === 'index' ? '' : pageKey}`;

    // --- The Fix: Name it 'lang' so your templates don't need changes ---
    res.locals.lang = langData; 
    res.locals.currentLang = currentLang;
    res.locals.pageKey = pageKey;
    res.locals.cleanUrl = cleanUrl;

    // Meta-Logic using the same 'langData'
    res.locals.seo_title = langData[`meta_title_${pageKey}`] || langData['meta_title_index'];
    res.locals.seo_desc = langData[`meta_desc_${pageKey}`] || langData['meta_desc_index'];
    
    next();
});



// Hilfsfunktion zum Einlesen von SVGs
const getSvg = (svgPath) => {
    const fullPath = path.join(__dirname, 'public', svgPath);
    if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf8');
    }
    return ''; // Fallback falls Datei fehlt
};

// Hilfsfunktion zum Laden der Sprache
function getLangData(langCode) {
    const code = (langCode === 'en' || langCode === 'de') ? langCode : 'de';
    const filePath = path.join(__dirname, 'lang', `${code}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// 1. Home
app.get('/', (req, res) => {
    res.render('index', { 
        pageKey: 'index',
        highlights, services, projects,
        getSvg
    });
});

// 2. Dynamic Pages
app.get('/:page', (req, res) => {
    const pageKey = req.params.page;
    const viewPath = path.join(__dirname, 'views', `${pageKey}.ejs`);

    if (!fs.existsSync(viewPath)) {
        return res.status(404).send('Page not found');
    }

    res.render(pageKey, { 
        pageKey,
        highlights, services, projects,
        getSvg
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Softmaster läuft auf http://localhost:${PORT}`);
});

// POST Route für das Kontaktformular
app.post('/send-contact', async (req, res) => {
    console.log("1. Form received from:", req.body.email);
    const secretKey = process.env.TURNSTILE_SECRET;
    const token = req.body['cf-turnstile-response'];
    console.log("2. Turnstile Token present:", !!token);
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 1. Cloudflare Turnstile Validierung
    try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip })
        });
        const validation = await turnstileRes.json();
        console.log("3. Turnstile Validation Result:", validation.success);
        if (!validation.success) {
            console.log("4. Turnstile Failed. Error codes:", validation['error-codes']);
            return res.send("captcha_error");
        }
    } catch (err) {
        return res.send("captcha_error");
    }
    
    // 2. Daten bereinigen (Node-Äquivalent zu strip_tags)
    const { name, email, subject, message } = req.body;
    
    if (!name || !message || !email.includes('@')) {
        return res.send("validation_error");
    }
    
    // 3. Nodemailer Konfiguration (E-Mail Versand)
    // Nutze hier deine SMTP-Daten (z.B. von deinem Hosting bei SoftMaster)
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
            user: 'apikey',
            pass: process.env.EMAIL_PASS // Your SG.xxx key
        },
        connectionTimeout: 10000, // Give it 10s for the handshake
    });

    console.log("5. Attempting to send Mail via SendGrid...");

    const mailOptions = {
        from: '"SoftMaster Webformular" <noreply@softmaster.at>',
        to: "office@softmaster.at",
        replyTo: email,
        subject: `Kontaktformular: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`
    };

    try {
        console.log("5. Sending Mail via Port 465...");
        let info = await transporter.sendMail({
            from: '"SoftMaster Web" <office@softmaster.at>', // Use the address you verified in SendGrid
            to: "office@softmaster.at",
            replyTo: email,
            subject: `Kontakt: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        });
        console.log("6. ✅ Mail Sent! ID:", info.messageId);
        return res.status(200).send("success");
    } catch (error) {
        console.error("❌ Mail Error Details:", error.message);
        return res.status(500).send("mail_error");
    }
});