function uuidV4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function aikenToJson(aikenText) {
    const lines = aikenText.split(/\n/);
    const jsonResult = [];
    let currentQuestion = {};

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.toUpperCase().startsWith("ANSWER:")) {
            currentQuestion.answer = trimmedLine.substring(7);
            jsonResult.push(currentQuestion);
            currentQuestion = {};
        } else if (trimmedLine.match(/^[A-Z]\.\s/)) {
            const option = trimmedLine[0];
            const desc = trimmedLine.substring(3);
            if (!currentQuestion.options) {
                currentQuestion.options = [];
            }
            currentQuestion.options.push({ answer: option, desc });
        } else if (trimmedLine.length > 0) {
            if (currentQuestion.question) {
                currentQuestion.question += "\n" + trimmedLine;
            } else {
                currentQuestion.question = trimmedLine;
            }
        }
    }
    return jsonResult;
}

function convertJSONQuestionToAiken(jsonData) {
    let aikenText = "";


    jsonData.forEach((question, index) => {
        aikenText += `${question.question}\n`;

        let answer = "";
        question.answer_json.forEach((option, idx) => {
            // convert idx to alphabet
            let alphabet = String.fromCharCode(65 + idx); // 65 is ASCII for A letter
            aikenText += `${alphabet}. ${option.answer}\n`;

            if(parseInt(option.score) > 0){
                answer = alphabet;
            }
        });

        aikenText += `ANSWER:${answer}\n\n`;
    });

    return aikenText;
}

async function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            resolve(e.target.result);
        };

        reader.onerror = function (e) {
            reject(e.target.error);
        };

        reader.readAsText(file);
    });
}

function saveAsBlob(data, name){
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob([data], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
}

function humanDateTime(date){
    if (!date) return "";
    return moment(date).local().format("DD MMM YYYY, HH:mm");
}

function humanDate(date){
    if (!date) return "";
    return moment(date).local().format("DD MMM YYYY");
}

function ucwords(str){
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function strRandom(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toUpperCase();
}

function prettyBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function moneyFormat(number){
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}
