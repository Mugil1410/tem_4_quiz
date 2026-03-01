$(document).ready(function () {

    var spinButton = $("#spin");
    var landingEntryText = $("#landingEntry");
    var questionBox = $("#questionBox");
    var questionText = $("#questionText");
    var optionsBox = $("#optionsBox");
    var spinAgainBtn = $("#spinAgainBtn");

    var score = 0;
    var totalAnswered = 0;
    var testLimit = 15;

    var entries = [];
    for (var i = 1; i <= 15; i++) {
        entries.push(i.toString());
    }

    var usedNumbers = [];

    var wheel = new Wheel(entries, wheelSliceColors);

    function loop() {
        wheel.update();
        requestAnimationFrame(loop);
    }

    $("#startQuizBtn").on("click", function () {
        $("#welcomeCard").addClass("d-none");
        $("#wheelWrapper").removeClass("d-none");
        $("#landingEntry").text("Press Spin");
    });

    wheel.spinDone = function () {

        spinSound.pause();

        var result = wheel.getCurrentEntry();

        if (usedNumbers.includes(result)) {
            var available = entries.filter(e => !usedNumbers.includes(e));
            result = available[0];
        }

        usedNumbers.push(result);
        landingEntryText.text(result);

        var questionIndex = parseInt(result) - 1;
        var question = questions[questionIndex];
        if (!question) return;

        questionText.text(question.q);
        optionsBox.html("");

        $.each(question.o, function (i, option) {
            var btn = $("<button>")
                .addClass("btn btn-outline-light d-block w-100 mb-2")
                .text(option)
                .on("click", function () {
                    checkAnswer(i, question.a);
                });

            optionsBox.append(btn);
        });

        questionBox.removeClass("d-none");
        $("#wheelWrapper").addClass("d-none");
        spinButton.css("visibility", "visible");
    };

    spinButton.on("click", function () {
        if (wheel.spin()) {
            spinSound.currentTime = 0;
            spinSound.play();
            landingEntryText.text("");
            spinButton.css("visibility", "hidden");
        }
    });

    function checkAnswer(selected, correct) {

        var buttons = optionsBox.find("button");

        buttons.each(function (i) {

            $(this).prop("disabled", true);

            if (i === correct)
                $(this).removeClass("btn-outline-light").addClass("btn-success");

            if (i === selected && i !== correct)
                $(this).removeClass("btn-outline-light").addClass("btn-danger");
        });

        totalAnswered++;

        if (selected === correct) {
            score++;
            happySound.currentTime = 0;
            happySound.play();
            confetti({ particleCount: 200, spread: 120 });
        } else {
            sadSound.currentTime = 0;
            sadSound.play();
        }

        spinAgainBtn.removeClass("d-none");

        if (totalAnswered >= testLimit)
            setTimeout(showFinalResult, 1500);
    }

    function showFinalResult() {

        questionBox.addClass("d-none");
        $("#wheelWrapper").addClass("d-none");
        spinButton.prop("disabled", true);

        landingEntryText.html(`
            <div style="font-size:28px;">🎯 Final Score</div>
            <div style="font-size:48px; margin:10px 0;">${score} / ${testLimit}</div>
        `);

        confetti({ particleCount: 400, spread: 180 });
    }

    function loadProjectName() {

        $(".projectName").text(projectName);

        document.title = projectName;
    }

    function loadTeamMembers() {

        if ($("#teamMembers").length === 0) return;

        var html = "Team Members: ";

        for (var i = 0; i < teamMembers.length; i++) {

            html += "<strong>" + teamMembers[i] + "</strong>";

            if (i !== teamMembers.length - 1) {
                html += " | ";
            }
        }

        $("#teamMembers").html(html);
    }

    spinAgainBtn.on("click", function () {
        questionBox.addClass("d-none");
        spinAgainBtn.addClass("d-none");
        $("#wheelWrapper").removeClass("d-none");
        landingEntryText.text("Press Spin");
    });

    loop();
    loadProjectName();
    loadTeamMembers();

});