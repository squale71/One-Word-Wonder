$(document).ready(function () {
    $("#slider").slider({
        min: -1,
        max: 1,
        step: 0.01,
        value: 0,
        animate: "fast",
        change: function (event, ui) {
            $("#slider_container").attr("title", ui.value);
            changeBackground(ui.value);
        }
    });
    var songScore = 0;
    var targetMinTempo = 0;  // 0 to 500 in BPM
    var targetMaxTempo = 0;
    var targetMinExcitement = 0; // 0 to 1
    var targetMaxExcitement = 0;
    var sortByArray = ['artist_start_year-desc',
                  'artist_end_year-desc',
                  'song_hotttnesss-asc',
                  'duration-asc',
                  'loudness-asc',
                  'speechiness-asc',
                  'acousticness-asc',
                  'artist_familiarity-asc',
                  'speechiness-desc',
                  'danceability-desc',
                  'energy-desc',
                  'song_hotttnesss-desc',
                  'artist_hotttnesss-desc',
                  'loudness-desc',
                  'tempo-desc',
                  'duration-desc', ];
    var sortBy = '';


    $('#submit').click(function () {
        $('#submit').toggle("fast");
        $('#query').prop('disabled', true);
        $.ajax({
            type: 'GET',
            url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
            async: true,
            data: {
                text: $('#query').val().trim(),
            },
            datatype: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "ubUxY19KHDmshujwQyNYlpwzKOeFp1I1opDjsnhgSSyBqCsIrD"); // Enter here your Mashape key
                $('#loading').toggle();
            },
            success: function (data) {
                data = JSON.parse(data);
                songScore = data.score;
                // If word does not exist in API then create new entry in application database.
                if (songScore === 0) {
                    console.log("Word not found with Twinword API, need input from user.");
                    $('#loading').hide();
                    $('#newEntry').toggle("fast");                   
                    $('#dataStatement').append('We are still collecting data on the word \"' + $('#query').val().trim() + '\". Please tell us how you feel about this word. Your input will help us determine the sentiment of \"' + $('#query').val().trim() + '\".')
                    $('#submitNewWord').click(function() {
                        saveEntry();
                    });                  
                }
                // If API is currently down, revert to application database.
                else if (data.score === undefined) {
                    console.log("The TwinWord API is currently not functioning. Reverting to OneWordWonder database. Need input from user");
                    $('#loading').hide();
                    $('#newEntry').toggle("fast");
                    $('#dataStatement').append('We are still collecting data on the word \"' + $('#query').val().trim() + '\". Please tell us how you feel about this word.')
                    $('#submitNewWord').click(function () {
                        saveEntry();
                    });
                }
                // If API is functioning and input is a match, display song information.
                else {
                    changeBackground(data.score)
                    console.log("Success -- \"" + $('#query').val().trim() + "\" has been found in TwinWord API. Sentiment value is " + songScore)
                    calculateSong();
                    getSong();
                }

            },
            error: function(err) { alert(err)}
        });
    });

    function calculateSong() {
        calculateTempo()
        calculateExcitement();
        randomizeSort();
        
    }

    function calculateTempo() {
        
        if (songScore === 0) {
            var tempo = 135;
        }
        else {
            var tempo = (((songScore / 2) + 1.5) * 90);
        }
        targetMinTempo = tempo - 25 > 90 ? (tempo - 25) : 90;  // do not let tempo go under 90 BPM.
        targetMaxTempo = tempo + 25 < 180 ? (tempo + 25) : 180; // do not let tempo go over 180 BPM.
    }

    function calculateExcitement() {
        var excitement = ((songScore / 4) + 0.5);
        targetMinExcitement = excitement - .02;
        targetMaxExcitement = excitement + .02;
    }

    function randomizeSort() {
        var sortIdx = Math.floor(Math.random() * 15); // gets a number between 0 and 15 at random
        sortBy = sortByArray[sortIdx];
    }

    function saveEntry() {
        $('#newEntry').toggle("fast");
        var songData = {
            word: $('#query').val().trim(),
            sentimentValue: $('#slider').slider("value")
        }
        console.log("Sentiment value from user for \"" + songData.word + "\" is " + songData.sentimentValue)
        $.ajax({
            url: "/Home/Entry",
            data: songData,
            type: 'POST',
            beforeSend: function (xhr) {
                $('#loading').show();
            },
            success: function (result) {
                console.log("Success -- Average sentiment value of \"" + songData.word + "\" is " + result.score);
                console.log(songData.word + " has been input " + result.count + " times.")
                songScore = result.score;
                calculateSong();
                getSong();
            },
            error: function (xhr) {
                alert('Error: ' + xhr.statusText);
            },
        });
    }

    function getSong() {
        console.log("Target Tempo Range: " + targetMinTempo + " to " + targetMaxTempo + "  -- RANGE: 90 to 180 BPM");
        console.log("Target Valence Range: " + targetMinExcitement + " to " + targetMaxExcitement + " -- RANGE: 0.25 to 0.75 Scale");
        var APIKey = 'AYGIBWRIBOTV5EEX0';
        var URL = 'http://developer.echonest.com/api/v4/song/search';
        $.ajax({
            url: URL,
            dataType: 'jsonp',
            async: true,
            data: {
                api_key: APIKey,
                min_tempo: targetMinTempo,
                max_tempo: targetMaxTempo,
                min_valence: targetMinExcitement,
                max_valence: targetMaxExcitement,
                song_min_hotttnesss: 0.5,
                format: 'jsonp',
                results: 100,
                sort: sortBy,
            },           
            beforeSend: function (xhr) {

            },
            success: function (data) {
                var idx = Math.floor(Math.random() * 99)
                var matchedSong = data.response.songs[idx];
                getYouTubeVid(matchedSong.artist_name, matchedSong.title);
                console.log("Artist: " + matchedSong.artist_name);
                console.log("Song Title: " + matchedSong.title);
            },
            error: function (err) { console.log(err) }
        });
    }

    

    function getYouTubeVid(artist, song) {
        var youTubeURL = "https://www.googleapis.com/youtube/v3/videos";
        var APIKey = "AIzaSyByAUR-mOw12NrwDoezY1ievqshnjxklqU";  //comment in production
        //var APIKey = "AIzaSyDxw4hjwqdzxFqC49psRmWlrbzgGvsw3as"; //uncomment in production
        var query = artist + " " + song;
        gapi.client.setApiKey(APIKey);
        gapi.client.load('youtube', 'v3', function () {
            var request = gapi.client.youtube.search.list({
                type: 'video',
                videoEmbeddable: 'true',
                videoDefinition: 'high',
                maxResults: 1,
                q: query,
                part: 'snippet'
            });
            request.execute(function (data) {
                var songId = (data.items[0].id.videoId);
                console.log(data.items[0].id.videoId);
                $('#loading').hide();
                $('#videoTitle').append(song + " by " + artist);
                $("#vid").toggle("fast");
                $('#reset').toggle("fast");               
                $("#vid").attr("data", "http://www.youtube.com/embed/" + songId + "?rel=0&autoplay=1");
                $('#reset').click(function () {
                    $('#query').prop('disabled', false);   //Firefox workaround, doesn't seem to like to reenable upon reload.
                    window.location.reload();
                });
            });
        });
        
    }

    function changeBackground(value) {
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
            case 0:
                color("#F99090");
                break;
            default:
                color("#FFFFFF");
        }
    }

    function color (color) {
        $("body").css("background-color", color);
    }

});
