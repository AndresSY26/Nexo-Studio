const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

// Helper to convert Image URL to Base64
async function getImageBase64(url) {
    if (!url || url.startsWith('data:')) return url;
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
        const contentType = response.headers['content-type'];
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch (error) {
        console.error(`Error fetching image from ${url}:`, error.message);
        return null;
    }
}

// Helper to calculate luminance
function getLuminance(hex) {
    if (!hex || hex.length < 6) return 0;
    const rgb = hex.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16));
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

// Helper to detect icon
function detectIcon(url) {
    if (!url) return 'fa-solid fa-link';
    const platforms = [
        { patterns: ['instagram'], icon: 'fa-brands fa-instagram' },
        { patterns: ['tiktok'], icon: 'fa-brands fa-tiktok' },
        { patterns: ['youtube', 'youtu.be'], icon: 'fa-brands fa-youtube' },
        { patterns: ['whatsapp', 'wa.me'], icon: 'fa-brands fa-whatsapp' },
        { patterns: ['linkedin'], icon: 'fa-brands fa-linkedin' },
        { patterns: ['twitter', 'x.com'], icon: 'fa-brands fa-x-twitter' },
        { patterns: ['facebook'], icon: 'fa-brands fa-facebook' },
        { patterns: ['github'], icon: 'fa-brands fa-github' },
        { patterns: ['spotify'], icon: 'fa-brands fa-spotify' },
        { patterns: ['twitch'], icon: 'fa-brands fa-twitch' }
    ];
    const lowUrl = url.toLowerCase();
    const found = platforms.find(p => p.patterns.some(pattern => lowUrl.includes(pattern)));
    return found ? found.icon : 'fa-solid fa-link';
}

exports.generateBioLink = async (req, res) => {
    console.log('--- EXPORT DATA RECEIVED ---');
    console.log(req.body);

    try {
        const {
            name, bio, profile_url, mural_url,
            bg_mode, bg_color_1, bg_color_2, bg_media_url,
            button_shape, button_finish, button_animation, button_style,
            typography, accent_color,
            mural_opacity, mural_blur,
            link_titles, link_urls
        } = req.body;

        // Process Images to Base64
        const [profileBase64, muralBase64, bgMediaBase64] = await Promise.all([
            getImageBase64(profile_url || `https://ui-avatars.com/api/?name=${name || 'User'}&background=random`),
            getImageBase64(mural_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop'),
            bg_mode === 'media' ? getImageBase64(bg_media_url) : Promise.resolve(null)
        ]);

        // Process Links
        const links = [];
        if (Array.isArray(link_titles)) {
            link_titles.forEach((title, index) => {
                const url = link_urls[index];
                if (title || url) {
                    links.push({
                        title: title || 'Enlace',
                        url: url || '#',
                        icon: detectIcon(url)
                    });
                }
            });
        }

        // Contrast Intelligence
        const bgLuminance = getLuminance(bg_color_1 || '#05070a');
        const textColor = bgLuminance > 0.5 ? '#000000' : '#ffffff';
        const accentLuminance = getLuminance(accent_color || '#00f3ff');

        // Button Shape to Radius mapping
        let buttonRadius = '12px';
        if (button_shape === 'pill') buttonRadius = '50px';
        else if (button_shape === 'square') buttonRadius = '0px';

        // Background Logic for Inline Style
        let backgroundStyle = '';
        if (bg_mode === 'solid') backgroundStyle = bg_color_1;
        else if (bg_mode === 'linear') backgroundStyle = `linear-gradient(135deg, ${bg_color_1}, ${bg_color_2})`;
        else if (bg_mode === 'radial') backgroundStyle = `radial-gradient(circle, ${bg_color_1}, ${bg_color_2})`;
        else backgroundStyle = bg_color_1;

        const templateData = {
            name: name || 'Tu Nombre',
            bio: bio || '',
            profileBase64,
            muralBase64,
            bgMediaBase64,
            bgMode: bg_mode || 'solid',
            bgColor1: bg_color_1 || '#05070a',
            bgColor2: bg_color_2 || '#0070ff',
            backgroundStyle,
            buttonShape: button_shape || 'pill',
            buttonFinish: button_finish || 'finish-glass',
            buttonAnimation: button_animation || 'none',
            buttonStyle: button_style || 'style-glass',
            typography: typography || 'font-modern',
            accentColor: accent_color || '#00f3ff',
            muralOpacity: mural_opacity || 70,
            muralBlur: mural_blur || 0,
            links,
            textColor,
            accentLuminance,
            buttonRadius: buttonRadius
        };

        const templatePath = path.join(__dirname, '../views/templates/bioLink.ejs');
        const htmlContent = await ejs.renderFile(templatePath, templateData);

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="${(name || 'mi-nexo').toLowerCase().replace(/\s+/g, '-')}-links.html"`);
        res.send(htmlContent);

    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).send('<h1>Error generando el Bio-Link</h1><p>' + error.message + '</p>');
    }
};
