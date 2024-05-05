const count = 50;
const $scorePotato = document.getElementById('score-potato');
const $scoreCheese = document.getElementById('score-cheese');
const $connPotato = document.getElementById('connected-potato');
const $connCheese = document.getElementById('connected-cheese');
const $potato = document.getElementById('potato');
const $cheese = document.getElementById('cheese');

const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg";
const hub = 'https://'+window.location.hostname+'/.well-known/mercure?authorization='+jwt;

let javascript = 0;
let start = false;
let step = 1;

const url = new URL(hub);
url.searchParams.append('topic', 'https://localhost/game');
const eventSource = new EventSource(url);

document.onkeyup = function(evt) {
    if (evt.code === 'KeyS') {
        countdown();
    }

    if (evt.code === 'Digit1') {
        step = 1;
        publish({step});
    }
    if (evt.code === 'Digit2') {
        step = 2;
        publish({step});
    }
    if (evt.code === 'Digit3') {
        step = 3;
        publish({step});
    }

    if (evt.code === 'KeyI') {
        window.location = '/intro/';
    }
};


// The callback will be called every time an update is published
eventSource.onmessage = e => {
    const data = JSON.parse(e.data);

    if (data.hello) {
        if (data.hello === 'potato') {
            $connPotato.innerText = Number($connPotato.innerText) + 1;
        }
        if (data.hello === 'cheese') {
            $connCheese.innerText = Number($connCheese.innerText) + 1;
        }
        return;
    }
    if (data.bye) {
        if (data.bye === 'potato') {
            $connPotato.innerText = Number($connPotato.innerText) - 1;
        }
        if (data.bye === 'cheese') {
            $connCheese.innerText = Number($connCheese.innerText) - 1;
        }
        return;
    }

    if (!start) {
        return;
    }

    data.click === 'cheese' ? javascript++ : javascript--;

    const scorePotato = (count - javascript);
    const scoreCheese = (count + javascript);

    $scorePotato.innerText = scorePotato;
    $scoreCheese.innerText = scoreCheese;

    $potato.style.width = scorePotato + "%";
    $cheese.style.width = scoreCheese + "%";

    publish({potato: scorePotato, cheese: scoreCheese, step});

    $potato.classList.remove('near');
    $cheese.classList.remove('near');
    const near = count - 10;
    if (javascript <= -near) {
        $potato.classList.add('near');
    }
    if (javascript >= near) {
        $cheese.classList.add('near');
    }

    // winner ?
    if (javascript <= -count) {
        publish({winner: 'potato'});
        celebrate('potato');
    }
    if (javascript >= count) {
        publish({winner: 'cheese'});
        celebrate('cheese');
    }
}


async function publish(data) {
    const body = new URLSearchParams({
        data: JSON.stringify(data),
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

function celebrate(who)  {
    start = false;
    const $img = document.createElement('img');
    $img.src = '../images/'+who+'.svg';

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

function countdown() {
    start = false;
    document.body.insertAdjacentHTML( 'beforeend', '<div id="countdown">\n' +
        '    <div>3</div>\n' +
        '    <div>2</div>\n' +
        '    <div>1</div>\n' +
        '</div>' );

    setTimeout(function() {
        start = true;

        document.getElementById('countdown').remove();
    }, 4 * 1000);
}