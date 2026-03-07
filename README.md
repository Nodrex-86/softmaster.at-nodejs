# Softmaster.at Node.js Version

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://github.com/Nodrex-86/softmaster.at-nodejs)

[![Website Status](https://img.shields.io/website?url=https://node.softmaster.at)](https://node.softmaster.at)

![License](https://img.shields.io/github/license/Nodrex-86/softmaster.at-nodejs)
![Last Commit](https://img.shields.io/github/last-commit/Nodrex-86/softmaster.at-nodejs)

This is the Node.js/Express implementation of [softmaster.at](https://softmaster.at). 
The project features a dynamic EJS-based templating system with multi-language support.

![Node.js](https://img.shields.io/badge/Node.js-24.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![EJS](https://img.shields.io/badge/EJS-template-orange)
![Render](https://img.shields.io/badge/Deploy-Render-blue)

## 🌐 Live Demo
- **Primary:** [https://node.softmaster.at/](https://node.softmaster.at/)
- **Fallback:** [https://softmaster-at-nodejs.onrender.com/](https://softmaster-at-nodejs.onrender.com/)

## Screenshots

### Live Engine Pulse
The Node.js version features a persistent server monitor. Unlike PHP, which restarts every request, Node.js stays active in memory—demonstrated by the live uptime and heap memory counters.

![Live Pulse Preview](docs/pulse-preview.png) <!-- Once you have a screenshot -->


### Theme Support

The website supports automatic **day/night mode** depending on the system time,
with a manual toggle available in the navigation.

![Theme Preview](docs/theme-preview.png)

### Theme Switch

![Theme Switch](docs/theme-switch.gif)


## 🌟 Features
- **Engine:** Express.js & EJS
- **SEO:** Dynamic meta tags and canonical URLs generated via middleware.
- **Languages:** German (default) and English via JSON localization files.
- **Performance:** Optimized LCP and reduced layout thrashing (Canvas/Slider).
- **Contact:** Secure nodemailer integration using environment variables.
- **Real-time Monitoring:** Custom API endpoint for live server pulse (Uptime & Heap memory usage).
- **Hybrid Architecture:** Seamless cross-platform switching between PHP and Node.js environments.

## Latest Updates
...
- ✅ **Real-time Stats:** Integrated a live-syncing engine monitor (Uptime/RAM) using Fetch API.
- ✅ **UI/UX:** Added interactive tech-stack grid with glowing WebP icons and custom SEO tooltips.
- ✅ **Cross-Linking:** Established bi-directional routing between PHP and Node.js versions.



## Tech Stack

Backend  
- Node.js 24  
- Express.js  

Frontend  
- EJS templating  
- Tailwind CSS  
- Vanilla JavaScript  

Infrastructure  
- Render Cloud Hosting  
- GitHub CI Deployment  

Security  
- Cloudflare Turnstile  
- Environment Variables

## Tech Stack Update
- **Mailing:** SendGrid SDK (@sendgrid/mail) via HTTP API (Bypasses SMTP port blocks)
- **Infrastructure:** Render.com (Linux Environment)

## Architecture

The application is built with Express and uses EJS as a templating engine.
Project data is loaded dynamically from a JavaScript data module and rendered on the server.

The site is deployed on Render with automatic deployment from GitHub.
```text
softmaster.at (PHP version)
        │
        │
node.softmaster.at (Node.js version)
        │
        │
GitHub Repository
        │
        │
Render Cloud Deployment
```

## 📂 Project Structure

```text
softmaster.at-nodejs
│
├── .env.example
├── data.js
├── package.json
├── render.yaml
├── server.js
│
├── views
│   ├── 404.ejs
│   ├── contact.ejs
│   ├── imprint.ejs
│   ├── index.ejs
│   ├── privacy.ejs
│   ├── projects.ejs
│   └── services.ejs
│
├── public
│   ├── css
│   ├── js
│   ├── icons
│   └── images
│
├── docs
│   ├── theme-preview.png
│   └── theme-switch.gif

```

## Setup
1. `npm install`
2. Create a `.env` file (see `.env.example`)
3. `npm start`
