/// <reference path="Scripts\typings\lodash\lodash.d.ts" />
var GAME_BLOCK_NUMBER = 2;
var canvas;
var ctx;
var videos;
var answersRounds;
var gameBlock = [];

gameBlock[0] = [
    [ // Milline on enim kasutatud programmeerimis-/skriptimis-/markupkeel (2018)
        ["JavaScript", 70],
        ["HTML", 69],
        ["CSS", 65],
        ["SQL", 57]
    ],
    [ // Kus õpid programmeerima?
        ["Õpid ise", 99],
        ["Ülikoolis", 70],
        ["Tööl kursustel", 40],
        ["Netikursustel", 20]
    ],
    [ // Milline on populaarseim operatsioonisüsteem? (2018)
        ["Android", 40],
        ["Windows", 36],
        ["iOS", 13],
        ["OS X", 5]
    ],
    [ // Kumb on parem, tabid või tühikud?
        ["Tabid", 99],
        ["Tühikud", 50],
        ["Oleneb", 30],
        ["Ei tea", 0]
    ]
];

gameBlock[1] = [
    [
        ['15 tähte jrlaks', 32],
        ['20 tähte on siin ses 20 tähte on siin ses hahaa 20 tähte on siin ses 20 tähte on siin ses', 25],
        ['25 tähte on selles kastis', 8],
        ['IT ehk perfolintide vahetaja', 7]
    ], [
        ['M. Jõgiste', 16],
        ['M. Piirimäe', 11],
        ['E. Timak', 10],
        ['L. Astover', 9]
    ], [
        ['U. Saar', 23],
        ['Ü. Keerberg', 20],
        ['A. Pettai', 14],
        ['H. Köhler', 11]
    ], [
        ['K. Punga', 44],
        ['O. Titova', 8],
        ['J. Paaver', 7],
        ['A. Saarva', 6]
    ], [
        ['H. Tering', 21],
        ['H. Kiisel', 18],
        ['L. Tepp', 11],
        ['T. Pluum', 10]
    ]
];

gameBlock[2] = [
    [//Nimeta üks Tartu Ülikooli hoone, kust leiab kõige rohkem teadust.
        ['Füüsikum', 32],
        ['Keemikum', 25],
        ['Liivi 2', 8],
        ['Tü raamatukogu', 7]
    ], [//Nimeta üks amet, mida vanavanemad enamasti õppima soovitavad minna.
        ['Aadrilaskja/tohtrionu', 16], // arst
        ['Perfolindi asetaja/asendaja', 11], // IT
        ['Insener', 10],
        ['Põllumajandus/traktorist', 9]
    ], [//Peale toidu, nimeta veel üks asi, millega saab tudengit loengusse meelitada.
        ['Loengupunktid', 16],
        ['Hea õppejõud', 11],
        ['Meemid/huvitav loeng', 10],
        ['KT/eksami vastused', 9]
    ], [//Nimeta toit, mida tudengid tarbivad.
        ['Šokolaad/snickers', 16],
        ['(kiir)nuudlid', 11],
        ['Pelmeenid', 10],
        ['Purgisupp', 9]
    ], [//Nimeta üks avalikult tuntud TÜ õppejõud, kes sinu arvates saab kõige rohkem armastuskirju.
        ['Tarkpea', 16],
        ['Karek Kolk', 11],
        ['Mihhail Lotman', 10],
        ['Mats Mikkor', 9]
    ], [//Nimeta üks põhjus, miks inimene tahab füüsikuks saada.
        ['Keskmine palk', 16], // raha
        ['Masohhistlikult vastupidav', 11],
        ['Teadmisrõõm', 10],
        ['Vereliin - pereliin', 9]
    ], [//Nimeta üks asi, mille üle varas ei tahaks üllatuda, kui ta Füüsika Instituuti sisse murrab?
        ['Kalev Tarkpea ootab koridoris', 16],
        ['Tudengeid õppimas', 11],
        ['STEM kaalub samapalju kui bemm', 10],
        [' - ', 9]
    ], [//Nimeta midagi, mida eeldatakse, et 25-aastane inimene on juba saavutanud.
        ['Pesast välja hüpanud', 16],//Kodust välja kolinud
        ['Elukaaslane/koduloom', 11],
        ['Vumm-vumm', 10],//Auto
        [' - ', 9]
    ], [//Nimeta miski, mis paneb õppejõude kõige rohkem nutma kui nad eksamit parandavad.
        ['Magistrisse minna', 16],
        ['-', 11],
        ['-', 10],
        [' - ', 9]
    ]
];


var turnedBox = [
    false, false, false, false
];
function pad(num, size) {
    var s = "0000000000" + num;
    return s.substr(s.length - size);
}
var boxLocations = [
    80, 230,
    80, 535,
    1020, 230,
    1020, 535
];
var numLocations = [
    755, 230,
    755, 535,
    1720, 230,
    1720, 535
];
var teamScore = [0, 0];
var curTeamScore = [0, 0];
var curTeam = 0;
var curWrongAnswer = [0, 0];
var curRound = 0;
function resetToNewRound() {
    for (var i = 0; i < curTeamScore.length; ++i) {
        teamScore[i] += curTeamScore[i];
        curTeamScore[i] = 0;
        curWrongAnswer[i] = 0;
    }
    if (curRound + 1 >= answersRounds.length) {
        drawFinish();
        return;
    }
    noAdd = false;
    ctx.clearRect(0, 0, 1920, 1080);
    var reset = document.getElementById("reset");
    reset.currentTime = 0;
    reset.style.display = "block";
    _.forEach(videos, function (video) {
        video.style.display = "none";
        video.currentTime = 0;
    });
    reset.play();
    drawLowerText(0, 0);
    setTimeout(function () {
        _.forEach(videos, function (video) {
            video.style.display = "block";
        });
        reset.style.display = "none";
        reset.currentTime = 0;
    }, 1000);
    for (var i = 0; i < turnedBox.length; ++i) {
        turnedBox[i] = false;
    }
    curRound += 1;
}
function pointsSteal() {
    curTeamScore[curTeam] += curTeamScore[Math.abs(curTeam - 1)];
    curTeamScore[Math.abs(curTeam - 1)] = 0;
    drawLowerText(curTeamScore[0], curTeamScore[1]);
}
function drawLowerText(score1, score2) {
    ctx.font = "400px Bebas Neue ";
    var textSize = 400;
    ctx.clearRect(canvas.width / 2 - textSize * 2, 1010 - 400, textSize * 4, 450);
    ctx.fillText(score1, 250, 1010);
    ctx.fillText(score2, 1310, 1010);
}
var finished = false;
function drawFinish() {
    finished = true;
    ctx.clearRect(0, 0, 1920, 1080);
    animate("ending", 1000);
    _.forEach(videos, function (video) {
        video.style.display = "none";
        video.currentTime = 0;
    });
    ctx.font = "600px Bebas Neue ";
    ctx.fillText(pad(teamScore[0], 3) + "   " + pad(teamScore[1], 3), 100, 800, 1800);
}
function animate(element, duration) {
    var animation = document.getElementById(element);
    animation.currentTime = 0;
    animation.style.display = "block";
    animation.play();
    setTimeout(function () {
        animation.style.display = "none";
    }, duration);
}
var startUsed = false;
function start() {
    if (startUsed === true) {
        return;
    }
    answersRounds = gameBlock[GAME_BLOCK_NUMBER];
    var logo = document.getElementById("logo");
    logo.style.display = "none";
    animate("beginning", 1000);
    setTimeout(function () {
        _.forEach(videos, function (video) {
            video.style.display = "block";
            video.currentTime = 0;
        });
    }, 700);
}
var noAdd = false;
function turnText(boxId) {
   if (!turnedBox[boxId]) {
        videos[boxId].play();
        setTimeout(function () {
            if (curTeam !== -1 && !noAdd) {
                curTeamScore[curTeam] += answersRounds[curRound][boxId][1];
            }
            if (curTeam === 0 && _.isEqual(curWrongAnswer, [2,3]) || curTeam === 1 && _.isEqual(curWrongAnswer, [3,2])) {
                pointsSteal();
                noAdd = true;
            }

            ctx.fillStyle = "white";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.clearRect(boxLocations[boxId * 2 + 0], boxLocations[boxId * 2 + 1] - 300, 850, 350);

            var strlen = answersRounds[curRound][boxId][0].length;
            if(strlen < 20){
            	ctx.font = "200px Bebas Neue";
            	ctx.fillText(answersRounds[curRound][boxId][0], boxLocations[boxId * 2 + 0], boxLocations[boxId * 2 + 1], 650);
            }else if(strlen < 40){
            	ctx.font = "100px Bebas Neue";
            	ctx.fillText(answersRounds[curRound][boxId][0], boxLocations[boxId * 2 + 0], boxLocations[boxId * 2 + 1] - (200-100)/3, 650);
            }else{
            	ctx.font = "100px Bebas Neue";
            	var str = answersRounds[curRound][boxId][0];
            	var half = strlen/2;
            	while(half < strlen){
            		if(str.charAt(half) == " "){
            			break;
            		}else{
            			half++;
            		}
            	}
            	
            	var line1 = "esimene asd asd asd asd asd asd";
            	var line2 = "teine asd asd asd asd asd asd";
				if(half >= strlen){
            		//jagame julmalt pooleks
            		line1 = str.substring(0, strlen/2);
            		line2 = str.substring(strlen/2, strlen);
            	}else{
            		//jagame ilusasti
            		line1 = str.substring(0, half);
            		line2 = str.substring(half+1, strlen);
            	}

				ctx.fillText(line1, boxLocations[boxId * 2 + 0], boxLocations[boxId * 2 + 1] - 100 + 15, 650);
				ctx.fillText(line2, boxLocations[boxId * 2 + 0], boxLocations[boxId * 2 + 1] - 0   + 15, 650);
            }

            ctx.font = "200px Bebas Neue";
            ctx.fillText(answersRounds[curRound][boxId][1], numLocations[boxId * 2], numLocations[boxId * 2 + 1]);
            drawLowerText(curTeamScore[0], curTeamScore[1]);
        }, 450);
    }
    turnedBox[boxId] = true;
}
function wrongAnswer(wrongNum) {
    if (wrongNum < 1 || wrongNum > 3) {
        console.log("error in wrong number");
        return;
    }
    var cross = document.getElementById("cross" + wrongNum);
    cross.style.display = "block";
    cross.play();
    setTimeout(function () {
        cross.style.display = "none";
    }, 1000);
}
function wrongAnswerTeams() {
    console.log("Current team false: " + curTeam);
    curWrongAnswer[curTeam] += 1;
    wrongAnswer(curWrongAnswer[curTeam]);
    if (curWrongAnswer[curTeam] === 3 && curWrongAnswer[Math.abs(curTeam - 1)] === 3) {
        noAdd = true;
    }
    else if (curWrongAnswer[curTeam] === 3 && 3) {
        switchTeam();
        curWrongAnswer[curTeam] = 2;
    }
}

function selectTeam(team) {
    curTeam = team;
}

function switchTeam() {
    curTeam = Math.abs(curTeam - 1);
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';
}

function toggleMusic() {
    audioEl = document.getElementById("theme");
    if (audioEl.paused) {
        audioEl.play();
    } else {
        var duration = 5000
        fade(1,
            0,
            duration,
            function() { return audioEl.volume; },
            function(newVolume) { return audioEl.volume = newVolume; }
            );
        setTimeout(function() {
            audioEl.pause();
            audioEl.currentTime = 0;
        }, duration);
    }
}

function fade(start, end, duration, getter, setter) {
    // var dt = (end-start) / duration * 10; // (*10) since we are gonna set it every 10 ms
    
    var t = start * duration;
    var dt = 10;

    var fader = setInterval(function () {
        
        var cur = getter();
        next = t*t/(start*duration)/(start*duration);
        if (t <= 0) {
            setter(end);
            clearInterval(fader);
            return;
        } 
        console.log(next);
        setter(next);
        t -= dt;
    }, dt);
}

window.onload = function () {
    unloadScrollBars();
    canvas = document.getElementById('vastus');
    ctx = canvas.getContext("2d");
    videos = document.getElementsByClassName('anim');
};
window.addEventListener('mousedown', function (event) {
    console.log("X: " + event.clientX + " Y: " + event.clientY);
});
window.addEventListener("keypress", function (event) {
    if (event.charCode == 49) { // 1
        turnText(0);
    }
    else if (event.charCode == 50) { // 2
        turnText(1);
    }
    else if (event.charCode == 51) { // 3
        turnText(2);
    }
    else if (event.charCode == 52) { // 4
        turnText(3);
    }
    else if (event.charCode == 53) { // 5
        wrongAnswer(1);
    }
    else if (event.charCode == 54) { // 6
        wrongAnswer(2);
    }
    else if (event.charCode == 55) { // 7
        wrongAnswer(3);
    }
    else if (event.charCode == 106) { // j
        selectTeam(0);
    }
    else if (event.charCode == 107) { // k
        selectTeam(1);
    }
    else if (event.charCode == 114) { // r
        resetToNewRound();
    }
    else if (event.charCode == 113) { // q
        wrongAnswerTeams();
    }
    else if (event.charCode == 115) { // s
        start();
    }
    else if (event.charCode == 105) { // i
        pointsSteal();
    }
    else if (event.charCode == 48) { // 0
        noAdd = true;
    } 
    else if (event.charCode == 109) { // m
        toggleMusic();
    }
    else if (event.charCode == 109) { // m
        toggleMusic();
    }
    else {
        console.log(event.charCode);
    }
});
