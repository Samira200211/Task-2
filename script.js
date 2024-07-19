let start = document.getElementById('start');
let output = document.getElementById('result');
let intervalId;
let transcript = '';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US'; 

const saveContent = () => {
    const xhr = new XMLHttpRequest();
    const url = 'content.php';
    const params = `content=${encodeURIComponent(transcript)}`;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };

    xhr.send(params);
};

const startRecognition = () => {
    recognition.start();
    start.classList.add('recording');
};

const stopRecognition = () => {
    recognition.stop();
    start.classList.remove('recording');
};

recognition.onresult = (event) => {
    transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript).join('');
    output.innerHTML = transcript;
};

recognition.onerror = (event) => {
    output.textContent = `Error occurred in recognition: ${event.error}`;
};

start.addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId);
        stopRecognition();
        saveContent();
        intervalId = null;
    } else {
        startRecognition();
        intervalId = setInterval(() => {
            stopRecognition();
            saveContent();
            startRecognition();
        }, 5000);
    }
});
