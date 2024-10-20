document.addEventListener('DOMContentLoaded', () => {
    // Three.js background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('stars-background'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 1;

    function animateStars() {
        requestAnimationFrame(animateStars);
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
    }
    animateStars();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Set the first tab as active by default
    switchTab('home');

    // Don't Panic button
    const dontPanicBtn = document.getElementById('dont-panic');
    dontPanicBtn.addEventListener('click', () => {
        const message = document.createElement('div');
        message.textContent = "DON'T PANIC!";
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        message.style.fontSize = '5rem';
        message.style.color = '#FFD700';
        message.style.zIndex = '1000';
        message.style.transition = 'transform 0.5s ease-in-out';
        document.body.appendChild(message);
        
        let rotation = 0;
        const rotateInterval = setInterval(() => {
            rotation += 15;
            message.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            if (rotation >= 720) {
                clearInterval(rotateInterval);
                setTimeout(() => document.body.removeChild(message), 500);
            }
        }, 50);
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Journey Log
    const journeyEntries = [
        { title: "First Steps into the AI Galaxy", content: "The beginning of our cosmic journey, where human meets AI and the adventure unfolds." },
        { title: "Navigating the Code Nebula", content: "Exploring the mysteries of HTML, CSS, JavaScript, and Three.js with an AI co-pilot." },
        { title: "The Financial Frontier", content: "Venturing into the world of finance and investment, guided by artificial intelligence and infinite improbability." },
        { title: "Babel Fish Breakthrough", content: "Achieving interstellar communication with our AI-powered translation tool." },
        { title: "Hitchhiker's Guide Web Launch", content: "Our cosmic collaboration goes live, ready to guide travelers through the AI universe." }
    ];

    const journeyContainer = document.getElementById('journey-entries');
    journeyEntries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.classList.add('journey-entry');
        entryElement.innerHTML = `
            <h3 class="entry-title">${entry.title}</h3>
            <p class="entry-content">${entry.content}</p>
        `;
        entryElement.style.animationDelay = `${index * 0.2}s`;
        journeyContainer.appendChild(entryElement);
    });

    // Project modal functionality
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalExtra = document.getElementById('modal-extra');
    const closeModal = document.getElementById('close-modal');

    const projectDetails = {
        'cosmic-website': {
            title: 'This Cosmic Website',
            description: 'A journey through space, time, and code, created by human and AI working in harmony.',
            extra: 'Technologies used: HTML, CSS, JavaScript, Three.js, and a sprinkle of stardust.'
        },
        'finance-calculator': {
            title: 'The Infinite Improbability Finance Calculator',
            description: 'A tool that calculates financial probabilities across multiple universes.',
            extra: 'Features: Multi-universe investment returns, stock price predictions, and more!'
        },
        'babel-fish': {
            title: 'Babel Fish Translator',
            description: 'An AI-powered language model inspired by the legendary Babel Fish.',
            extra: 'Features: Real-time translation between English and Chinese, with more languages coming soon!'
        }
    };

    document.querySelectorAll('.project-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const project = btn.closest('.project-card').dataset.project;
            const details = projectDetails[project];
            modalTitle.textContent = details.title;
            modalDescription.textContent = details.description;
            modalExtra.textContent = details.extra;
            projectModal.style.display = 'flex';

            if (project === 'finance-calculator') {
                const calculator = new InfiniteImprobabilityCalculator();
                modalExtra.innerHTML += `<br><br><button id="calculate-investment" class="cta-button">Calculate Investment</button>`;
                document.getElementById('calculate-investment').addEventListener('click', () => {
                    const principal = prompt("Enter initial investment:");
                    const years = prompt("Enter number of years:");
                    if (principal && years) {
                        const result = calculator.calculateInvestmentReturn(Number(principal), Number(years));
                        alert(`Your potential return: ${result.toFixed(2)}`);
                    }
                });
            } else if (project === 'babel-fish') {
                const translator = new BabelFishTranslator();
                modalExtra.innerHTML += `<br><br><button id="translate-text" class="cta-button">Translate Text</button>`;
                document.getElementById('translate-text').addEventListener('click', () => {
                    const text = prompt("Enter text to translate:");
                    if (text) {
                        const translation = translator.translate(text, "English", "Chinese");
                        alert(`Translation: ${translation}`);
                    }
                });
            }
        });
    });

    closeModal.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });

    // Chatbot functionality
    const chatbot = document.getElementById('chatbot');
    const toggleChatbot = document.getElementById('toggle-chatbot');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');

    toggleChatbot.addEventListener('click', () => {
        chatbot.classList.toggle('hidden');
        toggleChatbot.textContent = chatbot.classList.contains('hidden') ? 'O' : 'X';
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage('user', message);
                generateResponse(message);
                userInput.value = '';
            }
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(message) {
        const responses = [
            "Don't Panic! The answer to that is probably 42.",
            "Have you consulted your towel about this?",
            "That's a question for the ages, or at least for the next hyperspace bypass.",
            "The Infinite Improbability Drive might have an answer, but it's infinitely improbable.",
            "Ah, a question worthy of Deep Thought! Give me a mere 7.5 million years to ponder.",
            "The Babel fish translates that to 'Thanks for all the fish!'",
            "Marvin the Paranoid Android would say it's not worth answering, but I disagree.",
            "According to the Guide, the best approach is to stick out your thumb and hope for the best.",
            "That's a hoopy question! You're really a frood who knows where their towel is.",
            "The answer lies somewhere between the Restaurant at the End of the Universe and the beginning of tea time."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setTimeout(() => addMessage('bot', response), 1000);
    }

    // Easter egg: Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert("Cheat code activated! You've unlocked the secret to the Universe, but it's 42.");
                document.body.classList.add('rainbow-activated');
                setTimeout(() => document.body.classList.remove('rainbow-activated'), 5000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});
