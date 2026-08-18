document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       1. PASSWORD GATE
       ========================================================= */

    const passwordGate = document.getElementById("password-gate");
    const passwordInput = document.getElementById("universe-password");
    const unlockBtn = document.getElementById("unlock-btn");
    const passwordMessage = document.getElementById("password-message");

    // 🔐 CHANGE PASSWORD HERE
    const SECRET_PASSWORD = "jhumri";

    let passwordUnlocked = false;


    function unlockUniverse() {

        if (!passwordInput || !unlockBtn) return;

        const enteredPassword = passwordInput.value.trim();

        /* ---------- CORRECT PASSWORD ---------- */

        if (enteredPassword === SECRET_PASSWORD) {

            passwordUnlocked = true;

            if (passwordMessage) {
                passwordMessage.textContent =
                    "Access granted. Welcome to the universe. ✨";

                passwordMessage.className = "success";
            }

            passwordInput.disabled = true;
            unlockBtn.disabled = true;

            // Hide password gate
            setTimeout(() => {

                if (passwordGate) {
                    passwordGate.classList.add("unlocked");
                }

                // Start the actual website
                setTimeout(() => {
                    initApp();
                }, 800);

            }, 500);

        }

        /* ---------- WRONG PASSWORD ---------- */

        else {

            if (passwordMessage) {
                passwordMessage.textContent =
                    "Hmm... that's not the key to this universe. 🔐";

                passwordMessage.className = "error";
            }

            passwordInput.value = "";
            passwordInput.focus();

            // Shake animation
            passwordInput.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(-8px)" },
                    { transform: "translateX(8px)" },
                    { transform: "translateX(-6px)" },
                    { transform: "translateX(6px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "ease-out"
                }
            );
        }
    }


    if (unlockBtn) {
        unlockBtn.addEventListener("click", unlockUniverse);
    }


    if (passwordInput) {
        passwordInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                unlockUniverse();
            }

        });
    }



    /* =========================================================
       2. DOM CACHE
       ========================================================= */

    const DOM = {

        body: document.body,

        preloader:
            document.getElementById("preloader"),

        smoothWrapper:
            document.getElementById("smooth-wrapper"),

        introScene:
            document.getElementById("scene-intro"),

        beginBtn:
            document.getElementById("begin-journey-btn"),

        audio:
            document.getElementById("cinematic-score"),

        soundToggle:
            document.getElementById("sound-toggle"),

        progressBar:
            document.getElementById("scroll-progress"),

        globalUi:
            document.querySelector(".global-ui"),

        cursor:
            document.getElementById("custom-cursor"),

        cursorRing:
            document.querySelector(".cursor-ring"),

        cursorDot:
            document.querySelector(".cursor-dot"),

        canvas:
            document.getElementById("webgl-canvas"),

        typewriter:
            document.getElementById("main-letter-text"),

        parallaxLayers:
            document.querySelectorAll(".parallax-layer"),

        scenes:
            document.querySelectorAll(".cinematic-scene"),

        glassLetter:
            document.querySelector(".glass-letter")
    };



    /* =========================================================
       3. GLOBAL STATE
       ========================================================= */

    const STATE = {

        isAppInitialized: false,

        isCanvasInitialized: false,

        isMobile:
            window.innerWidth <= 768,

        isTouch:
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0,

        audioContext: null,

        isPlaying: false,

        scrollY: 0,

        targetScrollY: 0,

        scrollDelta: 0,

        mouse: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        },

        cursorLerp: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        },

        isTyping: false,

        rafId: null,

        viewportHeight:
            window.innerHeight
    };



    /* =========================================================
       4. INITIALIZE WEBSITE
       ========================================================= */

    function initApp() {

        // Don't start without password
        if (!passwordUnlocked) return;

        // Prevent duplicate initialization
        if (STATE.isAppInitialized) return;

        STATE.isAppInitialized = true;


        /* ---------- BODY ---------- */

        if (DOM.body) {
            DOM.body.classList.add("loading");
        }


        /* ---------- PRELOADER ---------- */

        if (DOM.preloader) {

            setTimeout(() => {

                DOM.preloader.classList.remove("active");

                setTimeout(() => {

                    DOM.preloader.remove();

                    if (DOM.smoothWrapper) {
                        DOM.smoothWrapper.classList.remove("hidden");
                    }

                    if (DOM.body) {
                        DOM.body.classList.remove("loading");
                    }

                }, 1200);

            }, 2500);
        }

    }



    /* =========================================================
       5. AUDIO ENGINE
       ========================================================= */

    async function initAudio() {

        if (!DOM.audio) return;

        try {

            if (!STATE.audioContext) {

                const AudioContext =
                    window.AudioContext ||
                    window.webkitAudioContext;

                if (AudioContext) {
                    STATE.audioContext =
                        new AudioContext();
                }
            }


            if (
                STATE.audioContext &&
                STATE.audioContext.state === "suspended"
            ) {
                await STATE.audioContext.resume();
            }


            DOM.audio.volume = 0.5;

            const playPromise = DOM.audio.play();


            if (playPromise !== undefined) {

                playPromise
                    .then(() => {

                        STATE.isPlaying = true;

                        if (DOM.soundToggle) {
                            DOM.soundToggle.classList.add("playing");
                        }

                    })
                    .catch((error) => {

                        console.warn(
                            "Audio playback blocked:",
                            error
                        );

                    });

            }

        } catch (error) {

            console.warn(
                "Audio initialization failed:",
                error
            );

        }

    }



    function toggleAudio() {

        if (!DOM.audio) return;


        if (STATE.isPlaying) {

            DOM.audio.pause();

            STATE.isPlaying = false;

            if (DOM.soundToggle) {
                DOM.soundToggle.classList.remove("playing");
            }

        }

        else {

            const playPromise =
                DOM.audio.play();

            if (playPromise !== undefined) {

                playPromise
                    .then(() => {

                        STATE.isPlaying = true;

                        if (DOM.soundToggle) {
                            DOM.soundToggle.classList.add("playing");
                        }

                    })
                    .catch((error) => {

                        console.warn(
                            "Audio blocked:",
                            error
                        );

                    });

            }

        }

    }


    if (DOM.soundToggle) {

        DOM.soundToggle.addEventListener(
            "click",
            toggleAudio
        );

    }



    /* =========================================================
       6. ENTER JOURNEY
       ========================================================= */

    if (
        DOM.beginBtn &&
        DOM.introScene
    ) {

        DOM.beginBtn.addEventListener(
            "click",
            () => {

                initAudio();


                DOM.introScene.style.opacity = "0";

                DOM.introScene.style.pointerEvents =
                    "none";


                setTimeout(() => {

                    DOM.introScene.classList.remove(
                        "lock-scroll"
                    );

                    DOM.introScene.style.display =
                        "none";


                    if (DOM.globalUi) {

                        DOM.globalUi.classList.remove(
                            "hidden"
                        );

                    }


                    startRenderLoop();

                }, 1200);

            }
        );

    }



    /* =========================================================
       7. CUSTOM CURSOR
       ========================================================= */

    if (
        !STATE.isTouch &&
        DOM.cursor
    ) {

        window.addEventListener(
            "mousemove",
            (event) => {

                STATE.mouse.x =
                    event.clientX;

                STATE.mouse.y =
                    event.clientY;


                if (DOM.cursorDot) {

                    DOM.cursorDot.style.transform =
                        `translate3d(
                            ${event.clientX}px,
                            ${event.clientY}px,
                            0
                        )
                        translate(-50%, -50%)`;

                }

            },
            { passive: true }
        );


        const interactiveElements =
            document.querySelectorAll(
                "button, a, .sound-toggle, .glass-panel, .polaroid-frame"
            );


        interactiveElements.forEach(
            (element) => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        DOM.cursor.classList.add(
                            "hovering"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        DOM.cursor.classList.remove(
                            "hovering"
                        );

                    }
                );

            }
        );


        /* ---------- MAGNETIC BEGIN BUTTON ---------- */

        if (DOM.beginBtn) {

            DOM.beginBtn.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        DOM.beginBtn
                            .getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    DOM.beginBtn.style.transform =
                        `translate3d(
                            ${x * 0.2}px,
                            ${y * 0.2}px,
                            0
                        )`;

                },
                { passive: true }
            );


            DOM.beginBtn.addEventListener(
                "mouseleave",
                () => {

                    DOM.beginBtn.style.transform =
                        "translate3d(0,0,0)";

                }
            );

        }

    }



    /* =========================================================
       8. SCENE OBSERVER
       ========================================================= */

    if (DOM.scenes.length > 0) {

        const sceneObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "scene-active"
                                );

                                entry.target.setAttribute(
                                    "data-visible",
                                    "true"
                                );

                            }

                            else {

                                entry.target.setAttribute(
                                    "data-visible",
                                    "false"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        DOM.scenes.forEach(
            (scene) => {

                sceneObserver.observe(scene);

            }
        );

    }



    /* =========================================================
       9. LETTER OBSERVER
       ========================================================= */

    if (DOM.glassLetter) {

        const letterObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                DOM.glassLetter.classList.add(
                                    "in-view"
                                );


                                if (!STATE.isTyping) {

                                    STATE.isTyping =
                                        true;

                                    startTypewriter();

                                }

                            }

                        }
                    );

                },
                {
                    threshold: 0.4
                }
            );


        letterObserver.observe(
            DOM.glassLetter
        );

    }



    /* =========================================================
       10. TYPEWRITER
       ========================================================= */

    /*
       ✏️ CHANGE YOUR MESSAGE HERE
    */

    const letterText =
`Before you scroll any further,

I want you to know something.

You are genuinely special, and this little universe was created just for you.

Take your time, listen to the music, and enjoy every little moment. ❤️`;


    function startTypewriter() {

        if (!DOM.typewriter) return;

        let charIndex = 0;


        function type() {

            if (
                charIndex <
                letterText.length
            ) {

                const char =
                    letterText.charAt(
                        charIndex
                    );


                DOM.typewriter.innerHTML +=
                    char === "\n"
                        ? "<br>"
                        : char;


                charIndex++;


                const speed =
                    Math.random() * 50 + 30;


                setTimeout(
                    type,
                    speed
                );

            }

            else {

                const cursor =
                    document.querySelector(
                        ".typing-cursor"
                    );


                if (cursor) {

                    cursor.style.animation =
                        "blink 2s step-end infinite";

                }

            }

        }


        setTimeout(
            type,
            1000
        );

    }



    /* =========================================================
       11. SCROLL TRACKING
       ========================================================= */

    window.addEventListener(
        "scroll",
        () => {

            STATE.targetScrollY =
                window.scrollY;

        },
        { passive: true }
    );



    /* =========================================================
       12. PARALLAX
       ========================================================= */

    function updateParallax() {

        STATE.scrollDelta =
            STATE.targetScrollY -
            STATE.scrollY;


        STATE.scrollY +=
            STATE.scrollDelta * 0.1;


        /* ---------- PROGRESS BAR ---------- */

        if (DOM.progressBar) {

            const maxScroll =
                Math.max(
                    1,
                    document.documentElement
                        .scrollHeight -
                    window.innerHeight
                );


            const progress =
                (STATE.scrollY /
                    maxScroll) *
                100;


            DOM.progressBar.style.height =
                `${Math.min(
                    100,
                    Math.max(
                        0,
                        progress
                    )
                )}%`;

        }


        /* ---------- PARALLAX LAYERS ---------- */

        if (
            DOM.parallaxLayers &&
            DOM.parallaxLayers.length > 0
        ) {

            DOM.parallaxLayers.forEach(
                (layer) => {

                    const parentScene =
                        layer.closest(
                            ".cinematic-scene"
                        );


                    if (
                        parentScene &&
                        parentScene.getAttribute(
                            "data-visible"
                        ) === "true"
                    ) {

                        const speed =
                            parseFloat(
                                layer.getAttribute(
                                    "data-speed"
                                )
                            ) || 1;


                        const rect =
                            layer.getBoundingClientRect();


                        const centerOffset =
                            (
                                rect.top +
                                rect.height / 2
                            ) -
                            (
                                STATE.viewportHeight /
                                2
                            );


                        const yOffset =
                            centerOffset *
                            (1 - speed);


                        layer.style.transform =
                            `translate3d(
                                0,
                                ${yOffset}px,
                                0
                            )`;

                    }

                }
            );

        }

    }



    /* =========================================================
       13. CANVAS PARTICLES
       ========================================================= */

    let ctx = null;
    let canvasWidth = 0;
    let canvasHeight = 0;

    let particles = [];


    function resizeCanvas() {

        if (!DOM.canvas) return;


        canvasWidth =
            DOM.canvas.width =
            window.innerWidth;


        canvasHeight =
            DOM.canvas.height =
            window.innerHeight;

    }



    class Particle {

        constructor() {

            this.x =
                Math.random() *
                canvasWidth;

            this.y =
                Math.random() *
                canvasHeight;

            this.z =
                Math.random() * 2 +
                0.1;


            this.size =
                (
                    Math.random() *
                    1.5 +
                    0.5
                ) /
                this.z;


            this.alpha =
                Math.random();


            this.targetAlpha =
                Math.random();


            this.vx =
                (
                    Math.random() -
                    0.5
                ) * 0.2;


            this.vy =
                (
                    Math.random() -
                    0.5
                ) * 0.2;

        }


        update() {

            this.x += this.vx;
            this.y += this.vy;


            this.y -=
                (
                    STATE.scrollDelta *
                    0.05
                ) /
                this.z;


            /* ---------- MOUSE EFFECT ---------- */

            if (!STATE.isTouch) {

                const dx =
                    STATE.mouse.x -
                    this.x;

                const dy =
                    STATE.mouse.y -
                    this.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance < 150 &&
                    distance > 0
                ) {

                    this.x -=
                        (
                            dx /
                            distance
                        ) * 0.5;


                    this.y -=
                        (
                            dy /
                            distance
                        ) * 0.5;

                }

            }


            /* ---------- TWINKLE ---------- */

            this.alpha +=
                (
                    this.targetAlpha -
                    this.alpha
                ) * 0.02;


            if (
                Math.abs(
                    this.alpha -
                    this.targetAlpha
                ) < 0.1
            ) {

                this.targetAlpha =
                    Math.random();

            }


            /* ---------- SCREEN WRAP ---------- */

            if (this.x < 0)
                this.x = canvasWidth;

            if (this.x > canvasWidth)
                this.x = 0;

            if (this.y < 0)
                this.y = canvasHeight;

            if (this.y > canvasHeight)
                this.y = 0;

        }


        draw() {

            if (!ctx) return;


            ctx.beginPath();


            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    253,
                    245,
                    201,
                    ${this.alpha * 0.8}
                )`;


            ctx.fill();

        }

    }



    function initCanvas() {

        if (!DOM.canvas) return;


        ctx =
            DOM.canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        resizeCanvas();


        window.addEventListener(
            "resize",
            () => {

                STATE.viewportHeight =
                    window.innerHeight;

                STATE.isMobile =
                    window.innerWidth <= 768;

                resizeCanvas();

            },
            {
                passive: true
            }
        );


        const particleCount =
            STATE.isMobile
                ? 60
                : 150;


        particles = [];


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            particles.push(
                new Particle()
            );

        }

    }



    function renderCanvas() {

        if (!ctx) return;


        /* ---------- BACKGROUND ---------- */

        ctx.fillStyle =
            "#020104";

        ctx.fillRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );


        /* ---------- GRADIENT ---------- */

        const gradient =
            ctx.createRadialGradient(
                canvasWidth / 2,
                canvasHeight / 2,
                0,
                canvasWidth / 2,
                canvasHeight / 2,
                Math.max(
                    canvasWidth,
                    canvasHeight
                )
            );


        gradient.addColorStop(
            0,
            "#080a14"
        );


        gradient.addColorStop(
            1,
            "#020104"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );


        ctx.globalCompositeOperation =
            "screen";


        /* ---------- PARTICLES ---------- */

        for (
            let i = 0;
            i < particles.length;
            i++
        ) {

            particles[i].update();
            particles[i].draw();

        }


        ctx.globalCompositeOperation =
            "source-over";

    }



    /* =========================================================
       14. MASTER RENDER LOOP
       ========================================================= */

    function startRenderLoop() {

        if (
            !STATE.isCanvasInitialized
        ) {

            initCanvas();

            STATE.isCanvasInitialized =
                true;

        }


        if (STATE.rafId) {

            cancelAnimationFrame(
                STATE.rafId
            );

        }


        function tick() {

            /* ---------- CURSOR ---------- */

            if (
                !STATE.isTouch &&
                DOM.cursorRing
            ) {

                STATE.cursorLerp.x +=
                    (
                        STATE.mouse.x -
                        STATE.cursorLerp.x
                    ) * 0.15;


                STATE.cursorLerp.y +=
                    (
                        STATE.mouse.y -
                        STATE.cursorLerp.y
                    ) * 0.15;


                DOM.cursorRing.style.transform =
                    `translate3d(
                        ${STATE.cursorLerp.x}px,
                        ${STATE.cursorLerp.y}px,
                        0
                    )
                    translate(-50%, -50%)`;

            }


            updateParallax();

            renderCanvas();


            STATE.rafId =
                requestAnimationFrame(
                    tick
                );

        }


        tick();

    }



    /* =========================================================
       15. TAB VISIBILITY
       ========================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                if (STATE.rafId) {

                    cancelAnimationFrame(
                        STATE.rafId
                    );

                    STATE.rafId = null;

                }


                if (
                    STATE.isPlaying &&
                    DOM.audio
                ) {

                    DOM.audio.pause();

                }

            }

            else {

                /* ---------- RESTART CANVAS ---------- */

                if (
                    DOM.introScene &&
                    DOM.introScene.style.display ===
                    "none"
                ) {

                    startRenderLoop();

                }


                /* ---------- RESUME AUDIO ---------- */

                if (
                    STATE.isPlaying &&
                    DOM.audio
                ) {

                    const playPromise =
                        DOM.audio.play();


                    if (
                        playPromise !== undefined
                    ) {

                        playPromise.catch(
                            (error) => {

                                console.warn(
                                    "Audio resume blocked:",
                                    error
                                );

                            }
                        );

                    }

                }

            }

        }
    );



    /* =========================================================
       16. INITIAL STATE
       ========================================================= */

    /*
       Website does NOT start here.
       Password must be entered first.
    */

    if (DOM.preloader) {
        DOM.preloader.classList.add("active");
    }

});
