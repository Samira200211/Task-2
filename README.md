# 2nd-Task-Web

## 1- Use http request in ESP32 code to get the data from database

 ### [Project Page](https://wokwi.com/projects/403532315770129409)

- First, I defined each LED with its corresponding pin number
```
#define red 13
#define green 12
#define yellow 27
#define blue 15
#define white 4
```
- Second, set the pin mode for each LED to OUTPUT
```
pinMode(red, OUTPUT);
pinMode(green, OUTPUT);
pinMode(yellow, OUTPUT);
pinMode(blue, OUTPUT);
pinMode(white, OUTPUT);
```
- Third, set the conditions for each response
```
 if(payload == "forward"){
    digitalWrite(red, HIGH);
  }else if(payload == "backward"){
    digitalWrite(green, HIGH);
  }else if(payload == "stop"){
    digitalWrite(yellow, HIGH);
  }else if(payload == "right"){
    digitalWrite(blue, HIGH);
  }else if(payload == "left"){
    digitalWrite(white, HIGH);
  }
```

![](imgs/t2-1.png)  

----
## 2- Build a user interface to convert voice to text

### [Web Page - Speech Recognition](https://5efatimah.github.io/2nd-Task-Web/)

- First, I built a simple HTML page and customized it with CSS. Then, I created a new table in my database to save the content from the textarea on the page. The table has two columns: one for the ID and one for the text.

![](imgs/t2-2-1.png)
![](imgs/t2-2-2.png)

- Second, in JS File, i set up a speech recognition instance
```
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
```

Then, I created a saveContent function that sends the data to a server using XMLHttpRequest
```
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
```
Then, I created two functions to start and stop the recognition instance
```
const startRecognition = () => {
    recognition.start();
    start.classList.add('recording');
};

const stopRecognition = () => {
    recognition.stop();
    start.classList.remove('recording');
};
```
Then I wrote the code that handles the result
```
recognition.onresult = (event) => {
    transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript).join('');
        output.innerHTML = transcript;
};

recognition.onerror = (event) => {
    output.textContent = `Error occurred in recognition: ${event.error}`;
};
```
Then i add event to button, when start is clicked:
 - If `intervalId` exists, clear it, stop recognition, save content, and reset `intervalId`.
 - Otherwise, start recognition and set an interval to stop, save, and restart recognition every 5 seconds.
```
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
```
- Finally, connect to the DB
 In the PHP file, start by connecting to the database and then insert the content into the table :)
```
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $content = $conn->real_escape_string($_POST['content']);

    $sql = "INSERT INTO content (textContent) VALUES ('$content')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
```
