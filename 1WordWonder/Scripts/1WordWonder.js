var restore = function () {
    $("#inputDiv").hide();
    $("#youtubeDiv").hide();
    updateScore("");
    $(".slider").slider("value", "0");
    $("body").css("background-color", "#FCEDA7");
}

var reqDone = function (data) {
    var obj = $.parseJSON(data);

    if (obj.result_code === "469" || obj.score === 0) {
        noValReturned();
    } else {
        updateScore(obj.score);
    }
};

var noValReturned = function () {
    // Failure indicates that a 469 error was thrown
    $("#inputDiv").toggle("slow");
};

var updateScore = function (score) {
    $("#scorespan").html(score);
}

var color = function (color) {
    $("body").css("background-color", color);
}

var changeBackground = function (value) {
    newvalue = (value * 100) + 100;
    var rem = Math.ceil(newvalue / 10);

    switch (rem) {
        case 20:
            color("#BCF1A7");
            break;
        case 19:
            color("#C3F1A7");
            break;
        case 18:
            color("#CAF2A7");
            break;
        case 17:
            color("#D1F3A8");
            break;
        case 16:
            color("#D8F4A8");
            break;
        case 15:
            color("#E0F4A8");
            break;
        case 14:
            color("#E7F5A9");
            break;
        case 13:
            color("#EEF6A9");
            break;
        case 12:
            color("#F5F7A9");
            break;
        case 11:
            color("#FDF8AA");
            break;
        case 10:
            color("#FCEDA7");
            break;
        case 9:
            color("#FCE3A4");
            break;
        case 8:
            color("#FBD8A2");
            break;
        case 7:
            color("#FBCE9F");
            break;
        case 6:
            color("#FBC49D");
            break;
        case 5:
            color("#FAB99A");
            break;
        case 4:
            color("#FAAF97");
            break;
        case 3:
            color("#F9A495");
            break;
        case 2:
            color("#F99A92");
            break;
        case 1:
            color("#F99090");
            break;
        default:
            color("#FFFFFF");
    }
}

$(document).ready(function () {
    //create the slider for when Twinword doesn't return a usable value
    $(".slider").slider({
        min: -1,
        max: 1,
        step: 0.01,
        value: 0,
        animate: "fast",
        change: function (event, ui) {
            $("#scorespan").html(ui.value);
            $("#slider_container").attr("title", ui.value);
            changeBackground(ui.value);
        }
    });

    $("#scoreconfirm").click(function () {
        var slider_value = $(".slider").slider("option", "value");
        updateScore(slider_value);
        $("#inputDiv").toggle("slow");
        $("#youtubeDiv").toggle("slow");
    });

    $('#submitBtn').click(function () {
        restore();
        var text = $('#wordbox').val();

        var req = $.ajax({
            data: { text: text },
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader("X-Mashape-Key", APIKey); // Enter here your Mashape key
            }
        }).done(function (data) {
            console.log(data.result_code);
            reqDone(data);
        }).fail(function (jqXHR, textStatus) {
            alert("Error: AJAX call to Mashape could not be completed.");
        });
    });
});