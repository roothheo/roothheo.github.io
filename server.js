const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const ColorThief = require('colorthief');

const app = express();

// Configuration CORS
app.use(cors());
app.use(express.json());

// Configuration Discord
const DISCORD_CONFIG = {
    USER_ID: '1327483363518582784'
};

// Fonction pour convertir RGB en HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Fonction pour convertir HSL en RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Route pour récupérer les informations de l'utilisateur Discord et les couleurs
app.get('/api/discord/user', async (req, res) => {
    try {
        // Utiliser l'API publique de Discord
        const response = await fetch(`https://discord.com/api/v10/users/${DISCORD_CONFIG.USER_ID}`);

        if (!response.ok) {
            // Si l'API Discord échoue, utiliser l'avatar par défaut
            const defaultColors = {
                primary: [255, 140, 0],    // Orange
                secondary: [221, 206, 1],  // Jaune
                light: [255, 179, 71]      // Orange clair
            };

            res.json({
                user: {
                    username: 'Default User',
                    avatar: 'default'
                },
                avatarUrl: 'assets/images/poisson.png',
                colors: defaultColors
            });
            return;
        }

        const userData = await response.json();
        const timestamp = new Date().getTime();
        const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_CONFIG.USER_ID}/${userData.avatar}.png?t=${timestamp}`;

        // Récupérer l'image de l'avatar
        const avatarResponse = await fetch(avatarUrl);
        const avatarBuffer = await avatarResponse.buffer();

        // Extraire les couleurs dominantes
        const dominantColor = await ColorThief.getColor(avatarBuffer);
        const palette = await ColorThief.getPalette(avatarBuffer, 5);

        // Convertir la couleur dominante en HSL
        const [h, s, l] = rgbToHsl(...dominantColor);

        // Créer une version plus claire de la couleur dominante
        const lighterHsl = [h, s, Math.min(l + 20, 100)];
        const lighterRgb = hslToRgb(...lighterHsl);

        // Préparer les données de couleurs
        const colors = {
            primary: dominantColor,
            secondary: palette[1] || dominantColor,
            light: lighterRgb
        };

        res.json({
            user: userData,
            avatarUrl,
            colors
        });
    } catch (error) {
        console.error('Erreur:', error);
        // En cas d'erreur, renvoyer les couleurs par défaut
        res.json({
            user: {
                username: 'Default User',
                avatar: 'default'
            },
            avatarUrl: 'assets/images/poisson.png',
            colors: {
                primary: [255, 140, 0],    // Orange
                secondary: [221, 206, 1],  // Jaune
                light: [255, 179, 71]      // Orange clair
            }
        });
    }
});

// Servir les fichiers statiques
app.use(express.static('.'));
app.use('/autoécole', express.static('autoécole'));

// Route pour la page d'accueil de l'autoécole
app.get('/autoécole', (req, res) => {
    res.sendFile(__dirname + '/autoécole/accueil.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 