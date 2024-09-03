window.addEventListener("load", (event) => {
    const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg";
    const hub = window.location.origin + '/.well-known/mercure?authorization=' + jwt;

    const $button = document.getElementById('button');

    const searchParams = new URLSearchParams(window.location.search);
    const team = searchParams.get('team') || 'cheese';
    $button.innerHTML = '<img src="../images/' + team + '.svg" alt="">';

    const url = new URL(hub);
    url.searchParams.append('topic', 'https://localhost/command');
    url.searchParams.append('topic', 'https://localhost/' + team);
    const eventSource = new EventSource(url);
    window.addEventListener("unload", (event) => {
        eventSource.close();
    });

    let step = 1;

// The callback will be called every time an update is published
    eventSource.onmessage = e => {
        const data = JSON.parse(e.data);

        // Winner
        if (data.winner === team) {
            celebrate();
            return;
        }

        // Change step
        if (data.step) {
            step = data.step;

            $button.classList.remove('move');

            if (step === 2) {
                $button.classList.add('move');
            }
        }

        // Game get score
        if (data[team]) {
            const points = data[team];
        }
    }

    const userAgent = window.navigator.userAgent;
    const preventDefault = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);

    $button.addEventListener("touchstart", (e) => {
        if (preventDefault) {
            e.preventDefault();
        }
        publish({click: team});
        move(step, $button);
    });

    async function publish(data) {
        const body = new URLSearchParams({
            data: JSON.stringify(data),
        })

        body.append('topic', 'https://localhost/game')
        const opt = {
            method: 'POST',
            keepalive: true,
            body
        };

        try {
            const resp = await fetch(hub, opt)
            if (!resp.ok) throw new Error(resp.statusText)
        } catch (e) {
            console.error(e)
        }
    }

    function move(step, $element) {

        if (step !== 3) {
            return;
        }

        $element.style.position = 'absolute';

        const winWidth = window.innerWidth - $element.offsetHeight;
        const winHeight = window.innerHeight - $element.offsetWidth;

        $element.style.top = (Math.random() * winHeight) + "px";
        $element.style.left = (Math.random() * winWidth) + "px";
    }

    function celebrate() {
        const end = Date.now() + 15 * 1000;

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                scalar: 8,
                origin: {x: 0},
                shapes: ["image"],
                shapeOptions: {
                    image: {
                        src: "../images/raclette.svg",
                    },
                },
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                scalar: 8,
                origin: {x: 1},
                shapes: ["image"],
                shapeOptions: {
                    image: {
                        src: "../images/raclette.svg",
                    },
                },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }
});