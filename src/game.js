// Create a reference for the Wake Lock.
if ("wakeLock" in navigator) {
    let wakeLock = null;
    wakeLock = await navigator.wakeLock.request("screen");
}


const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg";
const hub = 'https://'+window.location.hostname+'/.well-known/mercure?authorization='+jwt;

const $potato = document.getElementById('potato');
const $cheese = document.getElementById('cheese');

const searchParams = new URLSearchParams(window.location.search);
const team = searchParams.get('team');
if (team === 'potato') {
    $cheese.remove();
}
if (team === 'cheese') {
    $potato.remove();
}

const url = new URL(hub);
url.searchParams.append('topic', 'https://localhost/command');

const eventSource = new EventSource(url);

// The callback will be called every time an update is published
eventSource.onmessage = e => {
    const points = Math.abs(e.data);

    if (points >= 50) {
        celebrate();
    }
}
async function publish(topic) {
    const body = new URLSearchParams({
        data: topic,
    })

    body.append('topic', 'https://localhost/game')

    const opt = {method: 'POST', body}
    try {
        const resp = await fetch(hub, opt)
        if (!resp.ok) throw new Error(resp.statusText)
    } catch (e) {
        console.error(e)
    }
}


function celebrate()
{
    const end = Date.now() + 15 * 1000;

    const colors = ["#9400D3", "#4B0082", "#0000FF", "#00FF00", "#FFFF00", "#FF7F00", "#FF0000"];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            scalar: 2,
            origin: { x: 0 },
            colors: colors,
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            scalar: 2,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

if ($potato) {
    $potato.addEventListener("click", (event) => {
        event.preventDefault();
        publish('potato');
    });
}
if ($cheese) {
    $cheese.addEventListener("click", (event) => {
        event.preventDefault();
        publish('cheese');
    });
}