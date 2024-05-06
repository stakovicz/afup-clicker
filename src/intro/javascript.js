
const length = 2048;
var qrcode = new QRCode("qrcode", {
    width: length,
    height: length,
});
let url  = 'https://'+window.location.hostname+'/choose/';
qrcode.makeCode(url);
document.querySelector('#url').innerText = url;

document.onkeyup = function(evt) {
    if (evt.code === 'KeyN') {
        window.location = '/score/';
    }
};

setInterval(async function() {
    try {
        const response = await fetch('https://'+window.location.hostname+'/.well-known/mercure/subscriptions', {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.9oYBowhbaaqGrJmsiToEbpWPBk4Wq9ceCxGNAB793Wg',
                'Content-Type': 'application/json'
            })
        });
        if (!response.ok) throw new Error(resp.statusText)
        const subscriptions = await response.json();

        document.querySelector('#cheese div').innerText = subscriptions.subscriptions.filter(function (subscription) {
            return subscription.topic === "https://localhost/cheese";
        }).length;


        document.querySelector('#potato div').innerText = subscriptions.subscriptions.filter(function (subscription) {
            return subscription.topic === "https://localhost/potato";
        }).length;

    } catch (e) {
        console.error(e)
    }
}, 500);