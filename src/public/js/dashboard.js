document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del Formulario ---
    const nameInput = document.getElementById('name');
    const bioInput = document.getElementById('bio');
    const profileUrlInput = document.getElementById('profile_url');
    const muralUrlInput = document.getElementById('mural_url');
    const accentColorInput = document.getElementById('accent_color');
    const typographyInput = document.getElementById('typography');
    const bgModeInput = document.getElementById('bg_mode');
    const bgColor1Input = document.getElementById('bg_color_1');
    const bgColor2Input = document.getElementById('bg_color_2');
    const bgMediaUrlInput = document.getElementById('bg_media_url');
    const bgColorGroup = document.getElementById('bg-color-controls');
    const bgMediaGroup = document.getElementById('bg-media-group');
    const bg2Group = document.getElementById('bg-color-2-group');
    const labelColor1 = document.getElementById('label-color-1');
    const buttonShapeInput = document.getElementById('button_shape');
    const buttonStyleInput = document.getElementById('button_style');
    const buttonFinishInput = document.getElementById('button_finish');
    const buttonAnimInput = document.getElementById('button_animation');
    const muralOpacityInput = document.getElementById('mural_opacity');
    const muralBlurInput = document.getElementById('mural_blur');
    const addLinkBtn = document.getElementById('add-link-btn');
    const linksContainer = document.getElementById('links-container');

    // --- Selectores del Preview ---
    const previewScreen = document.getElementById('preview-screen');
    const previewName = document.getElementById('preview-name');
    const previewBio = document.getElementById('preview-bio');
    const previewProfile = document.getElementById('preview-profile');
    const previewMural = document.getElementById('preview-mural');
    const previewOverlay = document.getElementById('preview-overlay');
    const previewLinks = document.getElementById('preview-links');

    // --- Utilidades ---

    // Detección de Luminosidad para Contraste Inteligente
    const getLuminance = (hex) => {
        const rgb = hex.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16));
        return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    };

    const updateContrast = () => {
        const bgColor = bgColor1Input.value;
        const luminance = getLuminance(bgColor);
        const isDark = luminance < 0.5;

        if (isDark) {
            previewScreen.classList.remove('text-dark');
            previewScreen.classList.add('text-light');
            previewBio.classList.remove('text-secondary-dark');
            previewBio.classList.add('text-secondary-light');
        } else {
            previewScreen.classList.remove('text-light');
            previewScreen.classList.add('text-dark');
            previewBio.classList.remove('text-secondary-light');
            previewBio.classList.add('text-secondary-dark');
        }
    };

    const detectIcon = (url) => {
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
    };

    // --- Funciones de Renderizado ---

    const renderLinks = () => {
        previewLinks.innerHTML = '';
        const linkRows = document.querySelectorAll('.link-row');
        
        const shape = buttonShapeInput.value;
        const bStyle = buttonStyleInput.value;
        const finish = buttonFinishInput.value;
        const anim = buttonAnimInput.value;
        const accentColor = accentColorInput.value;

        linkRows.forEach((item, index) => {
            const title = item.querySelector('.link-title').value || 'Enlace ' + (index + 1);
            const url = item.querySelector('.link-url').value || '#';
            const icon = detectIcon(url);

            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.target = '_blank';
            linkElement.className = `bio-btn ${bStyle} ${finish} ${anim !== 'none' ? anim : ''}`;
            
            // Geometría
            if (shape === 'pill') linkElement.style.borderRadius = '50px';
            else if (shape === 'rounded') linkElement.style.borderRadius = '12px';
            else linkElement.style.borderRadius = '0px';
            
            // Acabado y Colores
            if (finish === 'finish-flat') {
                linkElement.style.background = accentColor;
                linkElement.style.color = getLuminance(accentColor) > 0.5 ? '#000' : '#fff';
            } else if (finish === 'finish-glow') {
                linkElement.style.borderColor = accentColor;
                linkElement.style.color = accentColor;
                linkElement.style.boxShadow = `0 0 15px ${accentColor}44`;
            } else if (finish === 'finish-glass') {
                linkElement.style.color = getLuminance(bgColor1Input.value) > 0.5 ? '#000' : '#fff';
            }

            linkElement.innerHTML = `<i class="${icon}"></i> ${title}`;
            previewLinks.appendChild(linkElement);
            
            // Feedback visual en el formulario
            const iconIndicator = item.querySelector('.icon-indicator');
            if (iconIndicator) {
                iconIndicator.className = `icon-indicator ${icon}`;
                iconIndicator.style.color = accentColor;
            }
        });
    };

    const updateBackground = () => {
        const mode = bgModeInput.value;
        const color1 = bgColor1Input.value;
        const color2 = bgColor2Input.value;
        const mediaUrl = bgMediaUrlInput.value;

        // Reset
        previewScreen.style.background = '';
        previewScreen.style.backgroundImage = '';
        previewScreen.classList.remove('bg-mesh');
        
        // Visibility Logic
        bg2Group.style.display = 'none';
        bgMediaGroup.style.display = (mode === 'media') ? 'block' : 'none';
        bgColorGroup.style.display = (mode === 'media') ? 'none' : 'block';
        labelColor1.textContent = 'Color Principal';

        if (mode === 'solid') {
            previewScreen.style.backgroundColor = color1;
        } else if (mode === 'linear') {
            bg2Group.style.display = 'block';
            labelColor1.textContent = 'Color de Inicio';
            previewScreen.style.backgroundImage = `linear-gradient(135deg, ${color1}, ${color2})`;
        } else if (mode === 'radial') {
            bg2Group.style.display = 'block';
            labelColor1.textContent = 'Color Central';
            previewScreen.style.backgroundImage = `radial-gradient(circle, ${color1}, ${color2})`;
        } else if (mode === 'mesh') {
            previewScreen.classList.add('bg-mesh');
            previewScreen.style.backgroundColor = color1;
        } else if (mode === 'media') {
            if (mediaUrl) {
                previewScreen.style.backgroundImage = `url('${mediaUrl}')`;
                previewScreen.style.backgroundSize = 'cover';
                previewScreen.style.backgroundPosition = 'center';
            }
        }
        updateContrast();
        renderLinks(); 
    };

    const updateMuralFilters = () => {
        const opacity = (100 - muralOpacityInput.value) / 100;
        const blur = muralBlurInput.value + 'px';
        previewOverlay.style.background = `rgba(0,0,0, ${opacity})`;
        previewMural.style.filter = `blur(${blur})`;
    };

    // --- Event Listeners ---

    nameInput.addEventListener('input', () => previewName.textContent = nameInput.value || 'Tu Nombre');
    bioInput.addEventListener('input', () => previewBio.textContent = bioInput.value || 'Tu descripción profesional...');
    
    profileUrlInput.addEventListener('input', () => {
        const url = profileUrlInput.value;
        previewProfile.style.backgroundImage = url ? `url('${url}')` : `url('https://ui-avatars.com/api/?name=${nameInput.value}&background=random')`;
    });

    muralUrlInput.addEventListener('input', () => {
        const url = muralUrlInput.value;
        previewMural.style.backgroundImage = url ? `url('${url}')` : "url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop')";
    });

    bgModeInput.addEventListener('change', updateBackground);
    bgColor1Input.addEventListener('input', updateBackground);
    bgColor2Input.addEventListener('input', updateBackground);
    bgMediaUrlInput.addEventListener('input', updateBackground);
    
    typographyInput.addEventListener('change', () => {
        previewScreen.classList.remove('font-modern', 'font-elegant', 'font-tech');
        previewScreen.classList.add(typographyInput.value);
    });

    buttonShapeInput.addEventListener('change', renderLinks);
    buttonStyleInput.addEventListener('change', renderLinks);
    buttonFinishInput.addEventListener('change', renderLinks);
    buttonAnimInput.addEventListener('change', renderLinks);
    accentColorInput.addEventListener('input', () => {
        document.documentElement.style.setProperty('--neon-cyan', accentColorInput.value);
        previewProfile.style.borderColor = accentColorInput.value;
        renderLinks();
    });

    muralOpacityInput.addEventListener('input', updateMuralFilters);
    muralBlurInput.addEventListener('input', updateMuralFilters);

    addLinkBtn.addEventListener('click', () => {
        const linkId = Date.now();
        const linkHtml = `
            <div class="link-row" id="link-${linkId}" style="animation: fadeIn 0.4s ease;">
                <input type="text" class="form-control link-title" name="link_titles[]" placeholder="Nombre del enlace">
                <div class="url-input-container">
                    <input type="url" class="form-control link-url" name="link_urls[]" placeholder="https://...">
                    <i class="icon-indicator fa-solid fa-link"></i>
                </div>
                <button type="button" class="btn-action btn-apply" title="Aplicar Vista Previa">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button type="button" class="btn-action btn-delete-row" title="Eliminar">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        linksContainer.insertAdjacentHTML('beforeend', linkHtml);
        
        // Attach Events to the new row
        const row = document.getElementById(`link-${linkId}`);
        const inputs = row.querySelectorAll('input');
        const applyBtn = row.querySelector('.btn-apply');
        const deleteBtn = row.querySelector('.btn-delete-row');

        inputs.forEach(input => input.addEventListener('input', renderLinks));
        applyBtn.addEventListener('click', renderLinks);
        deleteBtn.addEventListener('click', () => {
            row.remove();
            renderLinks();
        });

        renderLinks();
    });

    // --- Inicialización y Presets ---
    window.renderLinks = renderLinks;
    addLinkBtn.click(); // Añadir uno por defecto

    const urlParams = new URLSearchParams(window.location.search);
    const preset = urlParams.get('preset');

    if (preset) {
        switch (preset) {
            case 'elegant':
                typographyInput.value = 'font-elegant';
                accentColorInput.value = '#d4af37';
                buttonShapeInput.value = 'rounded';
                buttonStyleInput.value = 'style-outline';
                bgModeInput.value = 'solid';
                bgColor1Input.value = '#1a1a1a';
                break;
            case 'gamer':
                typographyInput.value = 'font-tech';
                accentColorInput.value = '#00f3ff';
                buttonShapeInput.value = 'square';
                buttonStyleInput.value = 'style-glass';
                buttonAnimInput.value = 'anim-glow';
                bgModeInput.value = 'mesh';
                bgColor1Input.value = '#05070a';
                bgColor2Input.value = '#001a33';
                break;
            case 'minimal':
                typographyInput.value = 'font-modern';
                accentColorInput.value = '#000000';
                buttonShapeInput.value = 'pill';
                buttonStyleInput.value = 'style-solid';
                bgModeInput.value = 'solid';
                bgColor1Input.value = '#ffffff';
                break;
        }
    }

    updateContrast();
    updateBackground();
    updateMuralFilters();
});
