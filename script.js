"use strict";

const synth = window.speechSynthesis;
const lang = "fi-FI";
var voice = null;

// Pronounciation fixes for letters the browser can't say right in Finnish
const CHARACTER_PRONOUNCIATIONS = {
    "i": "ii"
};

const WORDS = [
    "amme", "appelsiini", "aurinko",
    "banaani",
    "celsius",
    "delfiini",
    "etana", "elokuva",
    "faarao", "farkut",
    "gerbiili", "gorilla",
    "haarukka", "halla", "hattara", "helle", "helistin", "hömppä", "höpsö",
    "ilta", "isi", "iskä",
    "jekku", "jalkapallo", "jakkara", "juna",
    "kakku", "kameli", "karkki", "kello", "kiivi", "kilpikonna", "kuppi", "karhu", "koira", "käärme", "kala", "kana", "kesä",
        "kevät", "kännykkä",
    "lamppu", "lapsi", "lasi", "lautanen", "leijona", "leikki", "lentokone", "liukumäki", "lyhty", "lintu",
    "mi-ke", "makkara", "myyrä", "muurahainen", "möhköfantti", "mörkö",
    "naru", "nökö", "nalle", "nakupelle", "norsu",
    "orava", "omena",
    "paloauto", "piirakka", "pilli", "poliisi", "potta", "puuro", "pöytä", "papukaija",
    "quesadilla",
    "rusina", "raketti",
    "sauna", "sininen", "soittopeli", "suihku", "syksy",
    "taika", "talvi", "takka", "talvi", "tarra", "telkkari", "tietokone", "tikkari", "timantti", "trampoliini",
    "uimahousut",
    "veitsi", "västäräkki", "voltti",
    "watti",
    "yö",
    "zumba",
    "äiti",
    "öylätti"
];

// Munge the words array into a convenient hash indexed by the starting letter
var CHARACTER_TO_WORD = (function(words) {
    return words.reduce((acc, word) => {
        var letter = word[0];
        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(word);
        return acc;
    }, {})
}(WORDS));

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = function() {
        function findVoice(lang) {
            var voices = window.speechSynthesis.getVoices();
            for (var i = 0; i < voices.length; i++) {
                if (voices[i].lang === lang) {
                    return voices[i];
                }
            }
            return undefined;
        }
        voice = findVoice(lang);
    }
}

document.body.addEventListener("keypress", e => {
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

// Utter something like "s is for snail" (fi. "e niinkuin etana")
function sayWordForCharacter(character) {
    // Apply a pronounciation fix if exists
    var phrase = CHARACTER_PRONOUNCIATIONS[character] || character;
    var word = character;

    if (CHARACTER_TO_WORD[character]) {
        word = getRandomWordForCharacter(character);
        phrase = phrase + " niin kuin " + word;
    }
    showWord(word);

    var utterThis = new SpeechSynthesisUtterance(phrase);
    utterThis.voice = voice;
    utterThis.pitch = 1;
    utterThis.rate = 0.9;
    synth.speak(utterThis);
}
