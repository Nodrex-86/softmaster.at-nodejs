require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { highlights, services, projects } = require('./data');

const app = express();
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
        return res.status(404).render('404'); // Better: render a 404.ejs
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
    const secretKey = '0x4AAAAAACjFe130sQ75gHUit-voMZwy_9Y';
    const token = req.body['cf-turnstile-response'];
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 1. Cloudflare Turnstile Validierung
    try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip })
        });
        const validation = await turnstileRes.json();

        if (!validation.success) {
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
        host: process.env.SMTP_HOST, 
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: '"SoftMaster Webformular" <noreply@softmaster.at>',
        to: "office@softmaster.at",
        replyTo: email,
        subject: `Kontaktformular: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send("success"); // Damit main.js bescheid weiß
    } catch (error) {
        console.error("Mail Error:", error);
        res.send("mail_error");
    }
});