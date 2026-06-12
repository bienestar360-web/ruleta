document.addEventListener('DOMContentLoaded', () => {
    const whatsappInput = document.getElementById('whatsapp-input');
    const startBtn = document.getElementById('start-btn');
    const errorMessage = document.getElementById('error-message');
    const rouletteContainer = document.getElementById('roulette-container');
    const roulette = document.getElementById('roulette');
    const prizeModal = document.getElementById('prize-modal');
    const prizeText = document.getElementById('prize-text');
    const whatsappShareBtn = document.getElementById('whatsapp-share-btn');

    // Premios correspondientes a los 7 sectores, en orden inverso a las manecillas del reloj 
    // porque la ruleta gira hacia adelante. 
    // Orden visual de 0 a 6: 10%, 15%, 20%, 25%, 30%, 35%, 40%
    const prizes = ["10%", "15%", "20%", "25%", "30%", "35%", "40%"];
    const SECTORS = 7;
    const DEG_PER_SECTOR = 360 / SECTORS;

    let currentRotation = 0;
    let selectedPrize = "";
    let userWhatsApp = "";

    // Comprobar si ya jugó
    if (localStorage.getItem('ruleta_jugada')) {
        whatsappInput.disabled = true;
        startBtn.disabled = true;
        errorMessage.textContent = "Ya has girado la ruleta anteriormente.";
        errorMessage.classList.remove('hidden');
    }

    // Validación del formato de WhatsApp
    function validateWhatsApp(number) {
        // Regex: (10 dígitos exactos) o (+52 y 10 dígitos)
        const regex10 = /^\d{10}$/;
        const regex13 = /^\+52\d{10}$/;
        return regex10.test(number) || regex13.test(number);
    }

    whatsappInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val.length === 0) {
            errorMessage.classList.add('hidden');
            startBtn.disabled = true;
            return;
        }

        if (validateWhatsApp(val)) {
            errorMessage.classList.add('hidden');
            if (!localStorage.getItem('ruleta_jugada')) {
                startBtn.disabled = false;
            }
        } else {
            errorMessage.classList.remove('hidden');
            startBtn.disabled = true;
        }
    });

    startBtn.addEventListener('click', () => {
        userWhatsApp = whatsappInput.value.trim();

        // Bloquear UI
        startBtn.disabled = true;
        whatsappInput.disabled = true;

        // Mostrar ruleta si estaba oculta
        rouletteContainer.classList.remove('hidden');

        spinRoulette();
    });

    function getRandomPrizeIndex() {
        // Probabilidades equilibradas (total 100)
        // Premios: 10%, 15%, 20%, 25%, 30%, 35%, 40%
        // Pesos:   40, 25, 15, 8, 5, 5, 2
        const weights = [40, 25, 15, 8, 5, 5, 2];
        const random = Math.floor(Math.random() * 100);

        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) {
                return i;
            }
        }
        return 0; // Fallback
    }

    function spinRoulette() {
        const winningIndex = getRandomPrizeIndex();
        selectedPrize = prizes[winningIndex];

        // Calcular rotación
        const extraSpins = Math.floor(Math.random() * 3) + 4;
        const sectorCenter = (winningIndex * DEG_PER_SECTOR) + (DEG_PER_SECTOR / 2);
        const rotationTarget = 360 - sectorCenter;

        const totalRotation = currentRotation + (360 * extraSpins) + rotationTarget - (currentRotation % 360);
        currentRotation = totalRotation;

        // Animar
        const spinDuration = Math.random() * 2000 + 3000;
        roulette.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.15, 1)`;
        roulette.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            handleWin();
        }, spinDuration + 500);
    }

    function handleWin() {
        // Guardar en LocalStorage
        localStorage.setItem('ruleta_jugada', 'true');
        localStorage.setItem('ruleta_premio', selectedPrize);

        // Simulamos el guardado de datos en backend. 
        // Llama a Supabase o Google Sheets aquí si configuraste el POST:
        saveData(userWhatsApp, selectedPrize);

        // Mostrar premio
        prizeText.textContent = selectedPrize;
        prizeModal.classList.remove('hidden');
    }

    whatsappShareBtn.addEventListener('click', () => {
        const message = `¡Gané un ${selectedPrize} de descuento en tu ruleta! ¿Cómo lo reclamo?`;

        // Número de contacto del negocio actualizado
        const businessNumber = "529618783463";

        const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    // Función para guardar datos localmente y actualizar la tabla
    function saveData(whatsapp, prize) {
        const newLead = {
            whatsapp,
            prize,
            date: new Date().toLocaleString('es-MX', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            })
        };

        // Obtener historial actual
        let leads = JSON.parse(localStorage.getItem('ruleta_leads') || '[]');
        leads.push(newLead);
        localStorage.setItem('ruleta_leads', JSON.stringify(leads));

        renderLeads();
    }

    function maskWhatsApp(number) {
        if (!number) return "";
        const visibleDigits = number.slice(-4);
        const maskedPart = "*".repeat(Math.max(0, number.length - 4));
        return maskedPart + visibleDigits;
    }

    function renderLeads() {
        const leadsBody = document.getElementById('leads-body');
        const leads = JSON.parse(localStorage.getItem('ruleta_leads') || '[]');

        leadsBody.innerHTML = leads.map(lead => `
            <tr>
                <td>${lead.date}</td>
                <td class="toggle-phone" data-full="${lead.whatsapp}" data-masked="${maskWhatsApp(lead.whatsapp)}">
                    ${maskWhatsApp(lead.whatsapp)}
                </td>
                <td>${lead.prize}</td>
            </tr>
        `).join('');
    }

    // Event listener para revelar números al hacer clic
    document.getElementById('leads-body').addEventListener('click', (e) => {
        const target = e.target.closest('.toggle-phone');
        if (target) {
            const isMasked = target.textContent.trim().includes('*');
            target.textContent = isMasked ? target.dataset.full : target.dataset.masked;
            target.classList.toggle('revealed', !isMasked);
        }
    });

    // Botón para limpiar historial
    document.getElementById('clear-leads-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial de premios?')) {
            localStorage.removeItem('ruleta_leads');
            renderLeads();
        }
    });

    // Cargar historial al iniciar
    renderLeads();
});
