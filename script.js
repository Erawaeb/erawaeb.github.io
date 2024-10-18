document.addEventListener('DOMContentLoaded', () => {
    // Three.js background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('stars-background').appendChild(renderer.domElement);

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

    camera.position.z = 5;

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

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // GSAP Animations
    gsap.from('h1', { duration: 1, y: -50, opacity: 0, ease: 'power3.out' });
    gsap.from('.cta-button', { duration: 1, y: 50, opacity: 0, ease: 'power3.out', delay: 0.5 });
    
    gsap.utils.toArray('section').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Don't Panic button functionality
    const dontPanicBtn = document.getElementById('dont-panic');
    dontPanicBtn.addEventListener('click', () => {
        const dontPanicPopup = document.createElement('div');
        dontPanicPopup.textContent = "DON'T PANIC";
        dontPanicPopup.style.position = 'fixed';
        dontPanicPopup.style.top = '50%';
        dontPanicPopup.style.left = '50%';
        dontPanicPopup.style.transform = 'translate(-50%, -50%)';
        dontPanicPopup.style.fontSize = '5rem';
        dontPanicPopup.style.fontWeight = 'bold';
        dontPanicPopup.style.color = '#FFD700';
        dontPanicPopup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        dontPanicPopup.style.padding = '2rem';
        dontPanicPopup.style.borderRadius = '1rem';
        dontPanicPopup.style.zIndex = '9999';
        document.body.appendChild(dontPanicPopup);

        gsap.from(dontPanicPopup, {
            duration: 0.5,
            scale: 0,
            ease: 'back.out(1.7)',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(dontPanicPopup, {
                        duration: 0.5,
                        scale: 0,
                        ease: 'back.in(1.7)',
                        onComplete: () => {
                            document.body.removeChild(dontPanicPopup);
                        }
                    });
                }, 2000);
            }
        });
    });

    // Create floating AIs
    function createFloatingAIs() {
        const numAIs = 5;
        for (let i = 0; i < numAIs; i++) {
            const ai = document.createElement('div');
            ai.classList.add('ai-robot');
            ai.style.left = `${Math.random() * 100}vw`;
            ai.style.top = `${Math.random() * 100}vh`;
            ai.style.animationDelay = `${Math.random() * 10}s`;
            document.body.appendChild(ai);
        }
    }
    createFloatingAIs();

    // Ensure all external links open in a new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

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
