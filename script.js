"use strict";

var synth = window.speechSynthesis;
var voice = null;
var lang = "fi-FI";
var lastCharacter = null;

var CHARACTER_TO_WORD = {
    "a": ["appelsiini"],
    "b": ["banaani"],
    "c": ["celsius"],
    "d": ["delfiini"],
    "e": ["etana"],
    "f": ["faarao", "farkut"],
    "g": ["gerbiili", "gorilla"],
    "h": ["halla", "helle", "helistin"],
    "i": ["ilta", "isi", "iskä"],
    "j": ["jekku", "jalkapallo", "jakkara"],
    "k": ["kello", "kuppi", "karhu", "käärme", "kala", "kana"],
    "l": ["lautanen", "leijona", "lyhty", "lintu"],
    "m": ["mi-ke", "makkara"],
    "n": ["nökö", "nalle", "nakupelle", "norsu"],
    "o": ["orava", "omena"],
    "p": ["puuro", "potta", "pöytä", "papukaija"],
    "q": ["quesadilla"],
    "r": ["rusina", "raketti"],
    "s": ["sininen", "soittopeli"],
    "t": ["taika", "takka", "trampoliini"],
    "u": ["uimahousut"],
    "v": ["västäräkki", "voltti"],
    "w": ["watti"],
    "y": ["yö"],
    "ä": ["äiti"],
    "ö": ["öylätti"]
};

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

function getRandomWordForCharacter(character) {
    var len = CHARACTER_TO_WORD[character].length;
    return CHARACTER_TO_WORD[character][Math.round(Math.random() * (len - 1))]
}

function showWord(word) {
    document.querySelector(".word").innerText = word.toUpperCase();
}

function sayWordForCharacter(character) {
    var phrase = character;
    var word = character;

    if (CHARACTER_TO_WORD[character]) {
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
