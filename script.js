"use strict";

var synth = window.speechSynthesis;
var voice = null;
var lang = "fi-FI";
var lastCharacter = null;

function getVoice(lang) {
    var voices = window.speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang === lang) {
            return voices[i];
        }
    }
    return undefined;
}

function findVoice() {
    voice = getVoice(lang);
}

findVoice();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = findVoice;
}

document.body.addEventListener("keypress", function(e) {
    if (synth.speaking) {
        return false;
    }
    var str = ("" + String.fromCharCode(e.keyCode)).toLowerCase();
    sayWordForCharacter(str[0]);
});

var CHARACTER_TO_WORD = {
    "a": ["appelsiini"],
    "b": ["banaani"],
    "h": ["halla"],
    "k": ["kello", "kuppi"],
    "j": ["jekku", "jalkapallo", "jakkara"],
    "m": ["mi-ke", "makkara"],
    "n": ["nökö", "nalle", "nakupelle"],
    "p": ["puuro", "potta", "pöytä"],
    "s": ["sininen"],
    "t": ["taika", "takka"],
    "y": ["yö"],
    "ä": ["äiti"]
};

function getRandomWordForCharacter(character) {
    var len = CHARACTER_TO_WORD[character].length;
    return CHARACTER_TO_WORD[character][Math.round(Math.random() * (len - 1))]
}

function showWord(word) {
    document.querySelector(".word").innerText = word;
}

function sayWordForCharacter(character) {
    var phrase = character;
    var word = character;

    if (CHARACTER_TO_WORD[character] && character === lastCharacter) {
        var word = getRandomWordForCharacter(character);
        phrase = phrase + " niin kuin " + word;
    }
    showWord(word);

    var utterThis = new SpeechSynthesisUtterance(phrase);
    utterThis.voice = voice;

    utterThis.pitch = 1;
    utterThis.rate = 0.9;
    synth.speak(utterThis);

    lastCharacter = character;
}
