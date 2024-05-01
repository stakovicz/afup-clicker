const count = 50;
const $scorePotato = document.getElementById('score-potato');
const $scoreCheese = document.getElementById('score-cheese');
const $potato = document.getElementById('potato');
const $cheese = document.getElementById('cheese');

const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg";
const hub = 'https://'+window.location.hostname+'/.well-known/mercure?authorization='+jwt;

let score = 0;

const url = new URL(hub);
url.searchParams.append('topic', 'https://localhost/game');
const eventSource = new EventSource(url);

// The callback will be called every time an update is published
eventSource.onmessage = e => {
    e.data === 'cheese' ? score++ : score--;

    const scorePotato = (count - score);
    const scoreCheese = (count + score);

    $scorePotato.innerText = scorePotato;
    $scoreCheese.innerText = scoreCheese;

    $potato.style.width = scorePotato + "%";
    $cheese.style.width = scoreCheese + "%";

    publish(score);

    $potato.classList.remove('near');
    $cheese.classList.remove('near');
    const near = count - 10;
    if (score <= -near) {
        $potato.classList.add('near');
    }
    if (score >= near) {
        $cheese.classList.add('near');
    }

    // winner ?
    if (score <= -count) {
        celebrate('potato');
    }
    if (score >= count) {
        celebrate('cheese');
    }
}


async function publish(score) {
    const body = new URLSearchParams({
        data: score,
    })

    body.append('topic', 'https://localhost/command')

    const opt = {method: 'POST', body}

    try {
        const resp = await fetch(hub, opt)
        if (!resp.ok) throw new Error(resp.statusText)
    } catch (e) {
        console.error(e)
    }
}

function celebrate(who)
{
    const $img = document.createElement('img');
    $img.src = 'images/'+who+'.svg';

    const $winner = document.getElementById('winner');
    $winner.append($img);
    $winner.style.backgroundColor = '#FFF';
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