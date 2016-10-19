var context = new AudioContext(),
    gainNode = context.createGain(), //Controls volume.
    mousedown = false,
    oscillator = null;

gainNode.connect(context.destination); //Connects to speakers.

var calculateFrequency = function (mouseXPosition) {
    var minFrequency = 20,
        maxFrequency = 2000;

    return ((mouseXPosition / window.innerWidth) * maxFrequency) + minFrequency;
};

var calculateGain = function (mouseYPosition) {
    var minGain = 0,
        maxGain = 1;

    return 1 - ((mouseYPosition / window.innerHeight) * maxGain) + minGain;
};


var createOscillator = function (e) {
    //Needs mouse location.
    var xPos = e.clientX,
        yPos = e.clientY;

    if (e.touches) {
        xPos = e.touches[0].clientX;
        yPos = e.touches[0].clientY;
    }

    mousedown = true;

    oscillator = context.createOscillator();
    oscillator.frequency.setTargetAtTime(calculateFrequency(xPos), context.currentTime, 0.001);
    gainNode.gain.setTargetAtTime(calculateGain(yPos), context.currentTime, 0.001);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);
};

var stopOscillator = function () {
    mousedown = false;

    if (oscillator) {
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    }
};

var changeFrequency = function (e) {
    var xPos = e.clientX,
        yPos = e.clientY;

    if (e.touches) {
        xPos = e.touches[0].clientX;
        yPos = e.touches[0].clientY;
    }

    if (mousedown && oscillator) {
         oscillator.frequency.setTargetAtTime(calculateFrequency(xPos), context.currentTime , 0.001);
         gainNode.gain.setTargetAtTime(calculateGain(yPos), context.currentTime, 0.001);

    }
};

var changeBackground = function () {
    if (mousedown && oscillator) {
                var color = '#';
                var letters = ['000000','FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF','C0C0C0', '9400D3', '4B0082', 'FF7F00'];
                color += letters[Math.floor(Math.random() * letters.length)];
                document.body.style.background = color;
      }
};

document.body.addEventListener('mousedown', function (e) {
    createOscillator(e);
});

document.body.addEventListener('touchstart', function (e) {
    createOscillator(e);
});

document.body.addEventListener('mouseup', function () {
    stopOscillator();
});

document.body.addEventListener('touchend', function () {
    stopOscillator();
});

document.body.addEventListener('mousemove', function (e) {
    changeFrequency(e);
    changeBackground();
});

document.body.addEventListener('touchmove', function (e) {
    changeFrequency(e);
    changeBackground();
});
