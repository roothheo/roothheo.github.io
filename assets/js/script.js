// Séquence de touches pour activer l'easter egg : "bash"
let keys = [];
const secretCode = 'bash';

document.addEventListener('keydown', (e) => {
    // Pour l'activation de l'easter egg
    keys.push(e.key.toLowerCase());
    keys = keys.slice(-secretCode.length);

    if (keys.join('') === secretCode) {
        toggleMatrixMode();
    }

    // Pour la désactivation avec ESC
    if (e.key === 'Escape') {
        disableMatrixMode();
    }
});

function toggleMatrixMode() {
    document.body.classList.add('matrix-mode');
    document.querySelector('.bash-ascii').style.display = 'block';
    playMatrixSound();
}

function disableMatrixMode() {
    document.body.classList.remove('matrix-mode');
    document.querySelector('.bash-ascii').style.display = 'none';
}

function playMatrixSound() {
    const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeG');
    audio.play();
}

// Configuration du bot Discord
const DISCORD_CONFIG = {
    USER_ID: '1327483363518582784'
};

// Fonction pour appliquer les couleurs au site
function applyColors(colors) {
    const root = document.documentElement;
    
    // Appliquer la couleur principale
    root.style.setProperty('--primary-orange', `rgb(${colors.primary.join(',')})`);
    
    // Appliquer la couleur secondaire
    root.style.setProperty('--secondary-yellow', `rgb(${colors.secondary.join(',')})`);
    
    // Appliquer la couleur claire
    root.style.setProperty('--light-orange', `rgb(${colors.light.join(',')})`);
}

// Fonction pour mettre à jour la photo de profil Discord
async function updateDiscordAvatar() {
    const avatarElement = document.querySelector('.profile-image img');
    
    try {
        const response = await fetch('/api/discord/user');

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du profil Discord');
        }

        const data = await response.json();
        
        // Mettre à jour l'image
        avatarElement.src = data.avatarUrl;
        avatarElement.alt = `${data.user.username}'s Discord Avatar`;
        avatarElement.style.transition = 'all 0.3s ease';
        
        // Appliquer les couleurs
        applyColors(data.colors);
        
    } catch (error) {
        console.error('Erreur:', error);
        avatarElement.src = 'assets/images/poisson.png';
    }
}

// Fonction pour vérifier les changements d'avatar
async function checkAvatarChanges() {
    let lastAvatarHash = null;

    async function check() {
        try {
            const response = await fetch('/api/discord/user');

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du profil Discord');
            }

            const data = await response.json();
            
            // Vérifier si l'avatar a changé
            if (lastAvatarHash !== data.user.avatar) {
                lastAvatarHash = data.user.avatar;
                updateDiscordAvatar();
            }
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            const avatarElement = document.querySelector('.profile-image img');
            avatarElement.src = 'assets/images/poisson.png';
        }
    }

    // Vérifier toutes les 2 secondes
    setInterval(check, 2000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateDiscordAvatar();
    checkAvatarChanges();
});

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour l'effet de typing
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        element.classList.add('typing-effect');
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-effect');
                // Ajouter l'effet glitch après le typing
                setTimeout(() => {
                    element.classList.add('glitch');
                    element.setAttribute('data-text', text);
                }, 1000);
            }
        }
        type();
    }

    // Fonction pour appliquer l'effet glitch aléatoirement
    function applyRandomGlitch() {
        const elements = document.querySelectorAll('h2, h3, p');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (!randomElement.classList.contains('glitch')) {
            randomElement.classList.add('glitch');
            randomElement.setAttribute('data-text', randomElement.textContent);
            
            // Retirer l'effet glitch après un certain temps
            setTimeout(() => {
                randomElement.classList.remove('glitch');
            }, 2000);
        }
    }

    // Appliquer l'effet de typing au titre principal
    const mainTitle = document.querySelector('.glitch-title');
    if (mainTitle) {
        typeWriter(mainTitle, mainTitle.textContent);
    }

    // Appliquer l'effet glitch aléatoirement toutes les 5 secondes
    setInterval(applyRandomGlitch, 5000);

    // Effet de focus sur les catégories de compétences
    setupSkillCategoryFocus();

    // Effet Matrix en arrière-plan avec des $
    startMatrixEffect();
});

// Effet de focus sur les catégories de compétences
function setupSkillCategoryFocus() {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;
    const categories = grid.querySelectorAll('.skill-category, .language-category');

    categories.forEach(cat => {
        cat.addEventListener('mouseenter', () => {
            grid.classList.add('focusing');
            categories.forEach(c => c.classList.remove('focused'));
            cat.classList.add('focused');
        });
        cat.addEventListener('mouseleave', () => {
            grid.classList.remove('focusing');
            categories.forEach(c => c.classList.remove('focused'));
        });
    });
}

// Effet Matrix en arrière-plan avec des $
function startMatrixEffect() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let fontSize = 22;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(1);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + "px 'Courier New', Courier, monospace";
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < drops.length; i++) {
            const text = '$';
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
            if (drops[i] * fontSize > canvas.height) {
                drops[i] = 0;
            }
        }
    }
    setInterval(draw, 50);
    draw(); // Premier dessin immédiat
}
