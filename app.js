document.addEventListener("DOMContentLoaded", () => {
    const screen1 = document.getElementById("screen-1");
    const screen2 = document.getElementById("screen-2");
    const screen3 = document.getElementById("screen-3");
    
    const btnContinue = document.getElementById("btn-continue");
    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");
    const bgMusic = document.getElementById("bg-music");

    // Unified Cross-Fade Screen Architecture
    function navigateTo(fromScreen, toScreen) {
        fromScreen.classList.remove("active");
        setTimeout(() => {
            toScreen.classList.add("active");
        }, 300);
    }

    // Step 1 to Step 2 Transition
    btnContinue.addEventListener("click", () => {
        navigateTo(screen1, screen2);
        // Start background music smoothly after explicit user event
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            fadeAudioIn(bgMusic, 0.6, 2500);
        }).catch(err => console.log("Audio play blocked until next interaction"));
    });

    // Step 2 to Step 3 Transition (Acceptance)
    btnYes.addEventListener("click", () => {
        navigateTo(screen2, screen3);
        initHeartsParticleSystem();
    });

    // Runaway "No" Button Proximity Vector Evasion Logic
    const container = document.querySelector(".box-core-question");

    function runAway(event) {
        // Track input location based on mouse or touch positions
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        const btnRect = btnNo.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate center point coordinates of the target button
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        // Vector calculations mapping proximity distance
        const deltaX = clientX - btnCenterX;
        const deltaY = clientY - btnCenterY;
        const distance = Math.hypot(deltaX, deltaY);

        // Proximity detection bubble threshold (Trigger radius = 85px)
        if (distance < 85) {
            // Reset right positioning so it doesn't stretch or disappear
            if (btnNo.style.right !== 'auto') {
                btnNo.style.right = 'auto';
            }

            // Determine escape vectors
            const angle = Math.atan2(deltaY, deltaX);
            const escapeDist = 100; // Multiplier of evasion burst jump

            // Project new coordinates moving away from approach path
            let targetX = btnNo.offsetLeft - Math.cos(angle) * escapeDist;
            let targetY = btnNo.offsetTop - Math.sin(angle) * escapeDist;

            // Restrict movement targets within the boundaries of the Bento Box container
            const padding = 20;
            const minX = padding;
            const maxX = containerRect.width - btnRect.width - padding;
            const minY = padding;
            const maxY = containerRect.height - btnRect.height - padding;

            // Bound checking adjustments: bounce inward to keep it in the parent section
            if (targetX < minX) targetX = minX + Math.random() * 40;
            if (targetX > maxX) targetX = maxX - Math.random() * 40;
            if (targetY < minY) targetY = minY + Math.random() * 40;
            if (targetY > maxY) targetY = maxY - Math.random() * 40;

            // Generate a playful random rotation between -45 and 45 degrees
            const randomRotation = (Math.random() - 0.5) * 90;

            // Apply calculated layout translations and rotation
            btnNo.style.left = `${targetX}px`;
            btnNo.style.top = `${targetY}px`;
            btnNo.style.transform = `rotate(${randomRotation}deg)`;
        }
    }

    // Bind interaction triggers across standard and touch devices
    container.addEventListener("mousemove", runAway);
    container.addEventListener("touchmove", runAway, { passive: true });

    // Smooth Audio Fade Routine
    function fadeAudioIn(audioNode, targetVolume, duration) {
        let currentVol = 0;
        const intervalTime = 50;
        const step = targetVolume / (duration / intervalTime);
        
        const fadeInterval = setInterval(() => {
            currentVol += step;
            if (currentVol >= targetVolume) {
                audioNode.volume = targetVolume;
                clearInterval(fadeInterval);
            } else {
                audioNode.volume = currentVol;
            }
        }, intervalTime);
    }

    // Canvas Engine: Ambient Rising Celebration Particles
    function initHeartsParticleSystem() {
        const canvas = document.getElementById("hearts-canvas");
        const ctx = canvas.getContext("2d");
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();

        const particles = [];
        const heartCount = 65;

        class HeartParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Spread initially
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = Math.random() * 14 + 8;
                this.speedY = -(Math.random() * 2 + 1);
                this.speedX = Math.sin(Math.random() * 4) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.4;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y < -20) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = "#ff6b8b";
                ctx.beginPath();
                // Draw heart shape via bezier vector points
                const topY = this.y - this.size / 2;
                ctx.moveTo(this.x, topY + this.size / 4);
                ctx.bezierCurveTo(this.x, topY, this.x - this.size / 2, topY, this.x - this.size / 2, topY + this.size / 4);
                ctx.bezierCurveTo(this.x - this.size / 2, topY + this.size / 2, this.x, topY + this.size * 0.75, this.x, this.y);
                ctx.bezierCurveTo(this.x, topY + this.size * 0.75, this.x + this.size / 2, topY + this.size / 2, this.x + this.size / 2, topY + this.size / 4);
                ctx.bezierCurveTo(this.x + this.size / 2, topY, this.x, topY, this.x, topY + this.size / 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < heartCount; i++) {
            particles.push(new HeartParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
