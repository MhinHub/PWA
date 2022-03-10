$(document).ready(function () {
    var _url = "https://my-json-server.typicode.com/MhinHub/PWA/data";

    var dataResult = '';
    var jobResult = '';
    var categories = []


    function renderPage(data) {
        $.each(data, function (key, items) {
            dataResult += "<div>" +
                "<h3>" + items.full_name + "</h3>" +
                "<p>" + items.job + "</p>"
            "<div>";
            if ($.inArray(items.job, categories) == -1) {
                categories.push(items.job);
                jobResult += "<option value='" + items.job + "'>" + items.job + "</option>"
            }
        });

        $("#data").html(dataResult);
        $("#job_select").html("<option value='all'>Semua</option>" + jobResult);
    }

    var networkDataReceived = false;
    //fresh data from server
    var networkUpdate = fetch(_url).then(function (response) {
        return response.json();
    }).then(function (data) {
        networkDataReceived = true;
        renderPage(data);
    });
    //return data from cache
    caches.match(_url).then(function (response) {
        if (!response) throw Error('no data');
        return response.json();
    }).then(function (data) {
        if (!networkDataReceived) {
            renderPage(data);
            console.log('from cache');
        }
    }).catch(function () {
        return networkUpdate;
    });


    // Filter by job
    $("#job_select").change(function () {
        updateJob($(this).val());
    });
    function updateJob(job) {
        var dataResult = '';
        var new_url = _url;

        if (job != 'all') {
            new_url += "?job=" + job;
        }

        $.getJSON(new_url, function (data) {
            $.each(data, function (key, items) {
                if (job == 'all' || items.job == job) {
                    dataResult += "<div>" +
                        "<h3>" + items.full_name + "</h3>" +
                        "<p>" + items.job + "</p>"
                    "<div>";
                }
            });
            $("#data").html(dataResult);
        });

    };
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

