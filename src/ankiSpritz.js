/**
 * Spritz - https://spritz.com/
 * 
 */


var ankiSpritz = function (el) {

    el.classList.add('spritzed')
    el.appendChild(document.createElement("div"))
    this.playing = true
    this.currentTimer = null

    function processWord(word) {
        var center = Math.floor(word.length / 2),
            letters = word.split('')
        return letters.map(function (letter, idx) {
            if (idx === center)
                return '<span class="highlight">' + letter + '</span>'
            return letter;
        }).join('')
    }

    function positionWord() {
        var wordEl = el.firstElementChild,
            highlight = wordEl.firstElementChild

        var centerOffsetX = (highlight.offsetWidth / 2) + highlight.offsetLeft,
            centerOffsetY = (highlight.offsetHeight / 2) + highlight.offsetTop

        wordEl.style.left = ((el.clientWidth / 2) - centerOffsetX) + 'px'
        wordEl.style.top = ((el.clientHeight / 2) - centerOffsetY) + 'px'
    }

    var currentWord = 0,
        delay,
        trackLine

    var displayNextWord = function () {
        var word = this.words[currentWord++]

        if (typeof word == 'undefined') return
        // WTB> nlp.js...
        var hasPause = /^\(|[,\.\)]$/.test(word)

        // XSS?! :(
        window.el = el
        el.firstElementChild.innerHTML = word
        positionWord()

        // Trackline Calculation
        trackLine = (100 / this.words.length) * currentWord;

        document.getElementById("trackLine").style["width"] = trackLine + "%";

        if (currentWord !== this.words.length)
            this.currentTimer = setTimeout(displayNextWord, delay * (hasPause ? 2 : 1))
    }.bind(this)

    this.render = function (text, wpm) {

        this.words = text.split(/\s+/).map(processWord)
        // this.words = text.replace(/^\s+|\s+|\n$/,'').split(/\s+/).map(processWord)

        delay = 60000 / wpm

        this.playing = true
        clearTimeout(this.currentTimer)
        displayNextWord()

    }

    this.play = function () {
        this.playing = true
        displayNextWord()
    }

    this.pause = function () {
        this.playing = false
        clearTimeout(this.currentTimer)
    }

    this.toggle = function () {
        if (this.playing)
            this.pause()
        else
            this.play()
    }
}


var wordsPerMinute = 500;

// textContent div içindeki text'i direk alıyor.
var text = document.getElementById('text').textContent;

// double spaces to one space
text = text.replace(/\s{2,}/g, ' ');

// first empty spaces deleting
text = text.replace(/^ /, '');

// last empty spaces deleting
text = text.replace(/ \s*$/, '');


var target = document.getElementById('target');
var divElement = document.createElement('div');

var content = target.appendChild(divElement);
var output = new ankiSpritz(content);


// waiting for first word as a words per minute
setTimeout(function () {
    output.render(text, wordsPerMinute);
}, wordsPerMinute)