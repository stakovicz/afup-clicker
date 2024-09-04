const count = 50;
const $scorePotato = document.getElementById('score-potato');
const $scoreCheese = document.getElementById('score-cheese');
const $potato = document.getElementById('potato');
const $cheese = document.getElementById('cheese');

const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg";
const hub = window.location.origin+'/.well-known/mercure?authorization='+jwt;

let score = 0;
let start = false;
let step = 1;

const url = new URL(hub);
url.searchParams.append('topic', 'https://localhost/game');
const eventSource = new EventSource(url);
window.addEventListener("unload", (event) => {
    eventSource.close();
});

document.onkeyup = function(evt) {
    if (evt.code === 'KeyS') {
        countdown();
    }

    if (evt.code === 'Digit1') {
        step = 1;
        //publish({step});
    }
    if (evt.code === 'Digit2') {
        step = 2;
        //publish({step});
    }
    if (evt.code === 'Digit3') {
        step = 3;
        //publish({step});
    }

    if (evt.code === 'KeyI') {
        window.location = '/intro/';
    }
    if (evt.code === 'KeyR') {
        window.location.reload();
    }
};


// The callback will be called every time an update is published
eventSource.onmessage = e => {
    const data = JSON.parse(e.data);

    if (!start) {
        return;
    }

    data.click === 'cheese' ? score++ : score--;

    const scorePotato = (count - score);
    const scoreCheese = (count + score);

    $scorePotato.innerText = scorePotato;
    $scoreCheese.innerText = scoreCheese;

    $potato.style.width = scorePotato + "%";
    $cheese.style.width = scoreCheese + "%";

    publish({potato: scorePotato, cheese: scoreCheese, step});

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
        publish({winner: 'potato'});
        celebrate('potato');
    }
    if (score >= count) {
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

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            scalar: 8,
            origin: { x: 0 },
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
            origin: { x: 1 },
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
        publish({step});
    }, 4 * 1000);
}


setInterval(async function() {
    try {
        const response = await fetch(window.location.origin+'/.well-known/mercure/subscriptions', {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer '+jwt,
                'Content-Type': 'application/json'
            })
        });
        if (!response.ok) throw new Error(resp.statusText)
        const subscriptions = await response.json();

        const cheese = subscriptions.subscriptions.filter(function (subscription) {
            return subscription.topic === "https://localhost/cheese";
        }).length;
        document.querySelector('#cheese .connected').innerText = Number(cheese);

        const potato = subscriptions.subscriptions.filter(function (subscription) {
            return subscription.topic === "https://localhost/potato";
        }).length;
        document.querySelector('#potato .connected').innerText = Number(potato);

    } catch (e) {
        console.error(e)
    }
}, 2000);