require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { highlights, services, projects, tech, foundation_tech } = require('./data');
const sgMail = require('@sendgrid/mail');
const os = require('os');
const startTime = Date.now();
sgMail.setApiKey(process.env.EMAIL_PASS); 

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
    const cleanUrl = `https://node.softmaster.at/${pageKey === 'index' ? '' : pageKey}`;

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
    const serverPulse = {
        uptime: Math.floor((Date.now() - startTime) / 1000),
        memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1),
        platform: os.platform() === 'linux' ? 'Ubuntu Linux' : os.platform(),
        nodeVer: process.version
    };
    res.render('index', { 
        pageKey: 'index',
        highlights, services, projects, tech, foundation_tech,
        serverPulse, 
        getSvg
    });
});

app.get('/api/pulse', (req, res) => {
    res.json({
        uptime: Math.floor((Date.now() - startTime) / 1000),
        memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
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
        highlights, services, projects, tech, foundation_tech,
        getSvg
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    //console.log(`Softmaster läuft auf http://localhost:${PORT}`);
});

// POST Route für das Kontaktformular
app.post('/send-contact', async (req, res) => {
    const secretKey = process.env.TURNSTILE_SECRET;
    const token = req.body['cf-turnstile-response'];
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 1. Turnstile Validation
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip })
        });
        const validation = await turnstileRes.json();
        if (!validation.success) return res.send("captcha_error");

        // 2. Data Validation
        const { name, email, subject, message } = req.body;
        if (!name || !message || !email.includes('@')) return res.send("validation_error");

        // 3. SendGrid API Mail
        const msg = {
            to: 'office@softmaster.at',
            from: 'office@softmaster.at', // MUSS in SendGrid verifiziert sein!
            replyTo: email,
            subject: `Kontakt Form node JS: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        };

        await sgMail.send(msg);
        res.send("success");

    } catch (err) {
        console.error("Contact Form Error:", error.response ? error.response.body : error.message);
        res.send("mail_error");
    }
});