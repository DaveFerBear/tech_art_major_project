// Toggle between pages
function changePage(page) {
    for (var i = 1; i <= 3; i++) {
        var displayOption = i == page ? "block" : "none";
        document.getElementById("page-" + i).style.display = displayOption;
    }

    // Redirect home if at last page.
    var PAGE_3_TIME_DELAY_MS = 5000;
    var PAGE_2_TIME_DELAY_MS = 10000;
    if (page == 2) {
        setTimeout(function () {
            changePage(1);
        }, PAGE_2_TIME_DELAY_MS);
    } else if (page == 3) {
        document.getElementById("welcome-text").innerHTML = "User " + Math.floor(Math.random() * 1000);
        setTimeout(function () {
            changePage(1);
        }, PAGE_3_TIME_DELAY_MS);
    }
}

function animateEye(i) {
    EYE_FLICKER_MS = 3000;
    document.getElementById("eye").src = "img/eye-v2-" + i + ".png";
    console.log(i);
    setTimeout(function () {
        animateEye((i) % 4 + 1);
    }, EYE_FLICKER_MS);
}

function videoSetup() {
    let shouldStop = false;
    let stopped = false;
    const downloadLink = document.getElementById('download');
    const stopButton = document.getElementById('stop');

    stopButton.addEventListener('click', function () {
        shouldStop = true;
    })

    var handleSuccess = function (stream) {
        const options = { mimeType: 'video/webm' };
        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener('dataavailable', function (e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }

            if (shouldStop === true && stopped === false) {
                mediaRecorder.stop();
                stopped = true;
            }
        });

        mediaRecorder.addEventListener('stop', function () {
            downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
            downloadLink.download = 'acetest.webm';
        });

        mediaRecorder.start();
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(handleSuccess);
}

$(document).ready(function () {
    // Hide Scrollbars (no overflow)
    $("body").css("overflow", "hidden");

    document.getElementById("page-1-button").addEventListener("click", function () {
        changePage(2);
    });

    document.getElementById("page-2-button").addEventListener("click", function () {
        changePage(3);
    });

    animateEye(1);

    // videoSetup();

    var video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (error) {
                console.log("Something went wrong!");
            });
    }
});