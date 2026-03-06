// data.js
const highlights = [
    {
        title: 'SMT Zone',
        desc_key: 'project_smt_title',
        image: 'img/projects/smt__thumb.webp',
        link: 'projects?id=smt', 
        hgl_btn_key: 'hgl_btn_proj'
    },
    {
        title: 'Bank Management API',
        desc_key: 'rest_api',
        image: 'img/services/service_branding_nodrex.webp',
        link: 'https://github.com/Nodrex-86/bank-management-api',
        hgl_btn_key: 'hgl_btn_github'
    },
    {
        title: 'QR-Code Generator',
        desc_key: 'project_qr_title_alt',
        image: 'img/projects/qr_screenshot_1.webp',
        link: 'projects?id=qr-generator',
        hgl_btn_key: 'hgl_btn_try'
    }
];

const services = [
    {
        id: 'service_web',
        name_key: 'service_web',
        text_color: 'var(--title-blue)',
        bg_color: '#268dbb',
        img: 'icons/web.svg',
        img_alt: 'Professionelles Webdesign und PHP Entwicklung Wien',
        img_title: 'Webdesign Services',
        desc_key: 'service_web_text',
        intro_key: 'webdesign_intro',
        detail_key: 'service_web_details',
        list_title_key: 'webdesign_list_title',
        list_key: 'webdesign_list',
        outro_key: 'webdesign_outro',
        slogan_key: 'webdesign_slogan',
        slides: ['img/services/service_web_design.webp', 'img/services/service_web_responsive_dark.webp', 'img/services/service_web_responsive_light.webp', 'img/services/service_web_davexpress.webp', 'img/services/service_web_alaverdi.webp', 'img/services/service_web_alaverdi_tab.webp', 'img/services/service_web_alaverdi_mobile.webp']

    },
    {
        id: 'service_seo',
        name_key: 'service_seo',
        text_color: '#a855f7',
        bg_color: '#a855f7',
        img: 'icons/seo_opt.svg',
        img_alt: 'SEO Optimierung und Google Ranking Wien',
        img_title: 'Suchmaschinenoptimierung',
        desc_key: 'service_seo_text',
        intro_key: 'service_seo_intro',
        detail_key: 'service_seo_details',
        list_title_key: 'service_seo_list_title',
        list_key: 'service_seo_list',
        outro_key: 'service_seo_outro',
        slogan_key: 'service_seo_slogan',
        slides: ['img/services/service_seo_main.webp', 'img/services/service_seo_pagespeed_{{lang}}.webp', 'img/services/service_seo_pagespeed_mobil_{{lang}}.webp', 'img/services/service_seo_ranking_{{lang}}.webp', 'img/services/service-google_seo_score_{{lang}}.webp']

    },
    {
        id: 'service_branding',
        name_key: 'service_branding',
        text_color: 'var(--accent)',
        bg_color: '#22c55e',
        img: 'icons/logo.svg',
        img_alt: 'Professionelles Design für Ihre Werbemittel und Geschäftsausstattung',
        img_title: 'Werbemittel & Druck Design',
        desc_key: 'service_branding_text',
        intro_key: 'service_branding_intro',
        detail_key: 'service_branding_details',
        list_title_key: 'service_branding_list_title',
        list_key: 'service_branding_list',
        outro_key: 'service_branding_outro',
        slogan_key: 'service_branding_slogan',
        slides: ['img/services/service_branding_main.webp', 'img/services/service_branding_nodrex.webp', 'img/services/service_branding_davexpress.webp']
    },
    {
        id: 'service_print',
        name_key: 'service_print',
        text_color: '#c55122',
        bg_color: '#d65825',
        img: 'icons/print.svg',
        img_alt: 'Drucksorten Visitenkarten Stempel Warnwesten Wien',
        img_title: 'Werbetechnik',
        desc_key: 'service_print_text',
        intro_key: 'service_print_intro',
        detail_key: 'service_print_details',
        list_title_key: 'service_print_list_title',
        list_key: 'service_print_list',
        outro_key: 'service_print_outro',
        slogan_key: 'service_print_slogan',
        slides: ['img/services/service_print_main.webp']
    }
];

const projects = [
    {
        id: 'smt',
        name: 'SMT Zone',
        text_color: '#d90000',
        url: 'https://www.smt.zone/',
        img: 'img/projects/smt__thumb.webp',
        img_alt: 'project_smtzone_title_alt',
        img_title: 'project_smt_title',
        title_key: 'project_smt_title',
        intro_key: 'project_smtzone_title_alt',
        desc_key: 'project_smt_desc',
        slogan_key: 'project_smtzone_slogan',
        slides: ['img/projects/smt_screenshot_1_{{lang}}.webp', 'img/projects/smt_screenshot_2_{{lang}}.webp', 'img/projects/smt_screenshot_3_{{lang}}.webp', 'img/projects/smt_screenshot_4_{{lang}}.webp', 'img/projects/smt_screenshot_5_{{lang}}.webp']
    },
    {
        id: 'squirrel',
        name: 'Eichhörnchen',
        text_color: '#ca6919',
        url: 'https://www.softmaster.at/squirrel/',
        img: 'img/projects/squirrel_thumb.webp',
        img_alt: 'project_sq_img_alt',
        img_title: 'project_sq_title',
        title_key: 'project_sq_title',
        intro_key: 'project_sq_title_alt',
        desc_key: 'project_sq_desc',
        slogan_key: 'project_sq_slogan',
        slides: ['img/projects/squirrel_screenshot_1.webp', 'img/projects/squirrel_screenshot_2.webp', 'img/projects/squirrel_screenshot_3.webp', 'img/projects/squirrel_screenshot_4.webp', 'img/projects/squirrel_screenshot_5.webp', 'img/projects/squirrel_screenshot_6.webp', 'img/projects/squirrel_screenshot_7.webp']
    },
    {
        id: 'anbani',
        name: 'Anbani',
        text_color: '#13b836',
        url: 'https://www.softmaster.at/davalebebi/',
        img: 'img/projects/dav_thumb.webp',
        img_alt: 'project_dav_title_alt',
        img_title: 'project_dav_title',
        title_key: 'project_dav_title',
        intro_key: 'project_dav_title_alt',
        desc_key: 'project_dav_desc',
        slogan_key: 'project_dav_slogan',
        slides: ['img/projects/dav_screenshot_1.webp', 'img/projects/dav_screenshot_2.webp', 'img/projects/dav_screenshot_3.webp', 'img/projects/dav_screenshot_4.webp', 'img/projects/dav_screenshot_5.webp']
    },
    {
        id: 'qrgen',
        name: 'QR-Code Generator',
        text_color: '#f39200',
        url: 'https://www.softmaster.at/qrcode_generator/',
        img: 'img/projects/qr_thumb.webp',
        img_alt: 'project_qr_title_alt',
        img_title: 'project_qr_title',
        title_key: 'project_qr_title',
        intro_key: 'project_qr_title_alt',
        desc_key: 'project_qr_desc',
        slogan_key: 'project_qr_slogan',
        slides: ['img/projects/qr_screenshot_1.webp', 'img/projects/qr_screenshot_2.webp', 'img/projects/qr_screenshot_3.webp', 'img/projects/qr_screenshot_4.webp']
    }
];

module.exports = { highlights, services, projects };
