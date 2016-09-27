$(function () {

    'use strict'

    var tsNext = '';
    var tsPrevious = '';
    var ts = '';
    var position = 0;

    $('.search__button').on('click', update);

    $('.results-navigation__next').on('click', function () {

        $('.results').remove();
        $('.results__title').remove();

        position++;

        ts = tsNext;

        update();

        $('.results-navigation__previous').show();
    });

    $('.results-navigation__previous').on('click', function () {

        $('.results').remove();
        $('.results__title').remove();

        position--;

        ts = tsPrevious;

        update();

        if (position === 0) {
            $('.results-navigation__previous').hide();
        }
    });



    function update() {

        var parameters = {
            token: 'd591b44bcfb8f776c8d721fa9905867dbf4be79c',
            format: 'json',
            language: 'english',
            ts: ts,
            q: $("#q").val()
        };

        $.getJSON("https://webhose.io/search", parameters)
        .done(function (data, textStatus, jqXHR) {

            // here we analyze data and add search results to the page
            console.log(data);

            tsNext = getParameterByName('ts', data['next']);

            console.log(tsNext);

            if (data['moreResultsAvailable'] === 0) {
                $('.results-navigation__next').hide();
            } else {
                $('.results-navigation__next').show();
            }

            var posts = data['posts'];

            // here we must look through our data
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].title === '') {
                    var title = posts[i].text.slice(0, 100) + '...';
                    $("main").append('<div class="results"><a href="' + posts[i].url + '" target="_blank">' + title + '</a>' + '<p>' + posts[i].text.slice(0, 200) + '...' + '</p>' + '</div>');
                } else {
                    $("main").append('<div class="results"><a href="' + posts[i].url + '" target="_blank">' + posts[i].title + '</a>' + '<p>' + posts[i].text.slice(0, 200) + '...' + '</p>' + '</div>');
                }
            }
        })
         .fail(function (jqXHR, textStatus, errorThrown) {

             // log error to browser's console
             console.log(errorThrown.toString());
         });
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});
