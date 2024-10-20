document.addEventListener('DOMContentLoaded', () => {
    // Background stars
    const starsBackground = document.getElementById('stars-background');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        starsBackground.appendChild(star);
    }

    // Don't Panic button
    const dontPanicBtn = document.getElementById('dont-panic');
    dontPanicBtn.addEventListener('click', () => {
        const message = document.createElement('div');
        message.textContent = "DON'T PANIC!";
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.fontSize = '5rem';
        message.style.color = '#FFD700';
        message.style.zIndex = '1000';
        document.body.appendChild(message);
        setTimeout(() => document.body.removeChild(message), 2000);
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });

                // Add animation to the target section
                targetElement.style.transition = 'transform 0.5s ease-out';
                targetElement.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    targetElement.style.transform = 'scale(1)';
                }, 500);
            }
        });
    });

    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            } else {
                entry.target.classList.remove('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Parallax effect for stars
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        starsBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`;
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
            extra: 'Technologies used: HTML, CSS, JavaScript, and a sprinkle of stardust.'
        },
        'finance-calculator': {
            title: 'The Infinite Improbability Finance Calculator',
            description: 'A tool that calculates financial probabilities across multiple universes.',
            extra: 'Status: Coming soon. We\'re still figuring out how to access data from parallel universes.'
        },
        'babel-fish': {
            title: 'Babel Fish Translator',
            description: 'An AI-powered language model inspired by the legendary Babel Fish.',
            extra: 'Features: Real-time translation, telepathic input (pending), and a towel-friendly interface.'
        }
    };

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            const details = projectDetails[project];
            modalTitle.textContent = details.title;
            modalDescription.textContent = details.description;
            modalExtra.textContent = details.extra;
            projectModal.classList.remove('hidden');
            projectModal.classList.add('flex');
        });
    });

    closeModal.addEventListener('click', () => {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
    });

    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.add('hidden');
            projectModal.classList.remove('flex');
        }
    });

    // Chatbot functionality
    const chatbot = document.getElementById('chatbot');
    const toggleChatbot = document.getElementById('toggle-chatbot');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');

    toggleChatbot.addEventListener('click', () => {
        chatbot.classList.toggle('hidden');
        toggleChatbot.textContent = chatbot.classList.contains('hidden') ? '⬆️' : '⬇️';
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
        messageElement.classList.add('mb-2', sender === 'user' ? 'text-right' : 'text-left');
        messageElement.innerHTML = `<span class="inline-block bg-${sender === 'user' ? 'blue' : 'green'}-500 rounded px-2 py-1">${message}</span>`;
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

    // Babel Fish Translation
    window.translateText = function() {
        const text = prompt("Enter text to translate:");
        if (text) {
            const translator = new BabelFishTranslator();
            const translation = translator.translate(text, "English", "Vogon");
            alert(`Translation: ${translation}`);
        }
    };

    // Infinite Improbability Finance Calculator
    window.calculateFinance = function() {
        const principal = prompt("Enter initial investment:");
        const years = prompt("Enter number of years:");
        if (principal && years) {
            const calculator = new InfiniteImprobabilityCalculator();
            const result = calculator.calculateInvestmentReturn(Number(principal), Number(years));
            alert(`Your potential return: ${result.toFixed(2)}`);
        }
    };

    // Easter egg: Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert("Cheat code activated! You've unlocked the secret to the Universe, but it's 42.");
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});
