# Softmaster Node.js Version

This is the Node.js/Express implementation of [softmaster.at](https://softmaster.at). 
The project features a dynamic EJS-based templating system with multi-language support.

## Features
- **Engine:** Express.js & EJS
- **SEO:** Dynamic meta tags and canonical URLs generated via middleware.
- **Languages:** German (default) and English via JSON localization files.
- **Performance:** Optimized LCP and reduced layout thrashing (Canvas/Slider).
- **Contact:** Secure nodemailer integration using environment variables.

## Setup
1. `npm install`
2. Create a `.env` file (see `.env.example`)
3. `npm start`
