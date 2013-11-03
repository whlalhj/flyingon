
///Ajax实现
(function (global, $) {


    var ajax_fn = null, //ajax创建函数

        defaults = {

            type: "GET",

            dataType: "text/plain",

            contentType: "application/x-www-form-urlencoded",

            error: function (request) {

                alert(request.status + ":" + request.statusText);
            }
        };




    function ajax() {


        if (!ajax_fn)
        {
            items = [

                function () { return new XMLHttpRequest(); },
                function () { return new ActiveXObject("Microsoft.XMLHTTP"); },
                function () { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); },
                function () { return new ActiveXObject("MSXML2.XMLHTTP"); }
            ];

            for (var i = 0, length = items.length; i < length; i++)
            {
                try
                {
                    var result = (ajax_fn = items[i])();
                    if (result)
                    {
                        return result;
                    }
                }
                catch (e)
                {
                }
            }
        }


        return ajax_fn();
    };


    $.encodeURL = function (url, json) {

        if (url && json)
        {
            var values = [];

            for (var name in json)
            {
                values.push(encodeURIComponent(name).replace(/%20/g, "+"));
                values.push("=");
                values.push(encodeURIComponent((json[name].toString()).replace(/%20/g, "+")));
            }

            return url + "?" + values.join("&");
        }

        return url;
    };



    function response(event) {

        var fn,
            target = event.target,
            options = target.options;

        if (target.readyState == 4)
        {
            if (options.timer)
            {
                clearTimeout(options.timer);
                delete options.timer;
            }

            if (target.status < 300)
            {
                switch (options.dataType || defaults.dataType)
                {
                    case "json":
                        options.response = $.parseJson(response.responseText);
                        break;

                    case "script":
                        options.response = eval(response.responseText);
                        break;

                    case "xml":
                        options.response = response.responseXML;
                        break;

                    default:
                        options.response = response.responseText;
                        break;
                }

                if (fn = options.success)
                {
                    fn(target, options.response);
                }
            }
            else
            {
                (options["error"] || defaults["error"])(target);
            }

            if (fn = options.complete)
            {
                fn(target, options.response);
            }
        }
        else if (fn = options.progress)
        {
            fn(++(options.progressValue || (options.progressValue = 0)));
        }
    };

    /*
    {

        url: "http://www.xxx.com"

        type: "GET",

        dataType: "text/plain" || "json" || "script" || "xml"

        contentType: "application/x-www-form-urlencoded",

        async: true,

        user: undefined,

        password: undefined,

        timeout: 0,

        data: null,

        success: function(request, response) {

        },

        error: function (request) {

            alert(request.status + ":" + request.statusText);
        },

        abort: function(request) {

        },

        complete: function(request) {

        }

    }
    */
    $.ajax = function (options) {

        var type = options.type || defaults.type,
            result = ajax_fn ? ajax_fn() : ajax(),
            async = options.async !== false;


        if (options.timeout > 0)
        {
            options.timer = setTimeout(function () {

                result.abort();

                if (options.abort)
                {
                    options.abort(result);
                }

            }, options.timeout);
        }

        result.options = options;
        result.onreadystatechange = response;
        result.open(type, options.url, async, options.user, options.password);

        if (type == "POST" || type == "PUT")
        {
            result.setRequestHeader("Content-Type", options["contentType"] || defaults["contentType"]);
        }

        if (options.headers)
        {
            for (var name in options.headers)
            {
                result.setRequestHeader(name, options.headers[name]);
            }
        }

        result.send(options.data);
        return async ? result : options.response;
    };


    $.get = function (url, options) {

        (options || (options = {})).url = url;
        options.type = "GET";

        return $.ajax(options);
    };

    $.post = function (url, options) {

        (options || (options = {})).url = url;
        options.type = "POST";

        return $.ajax(options);
    };

    $.require = function (url) {

        if (url)
        {
            var options = {

                url: url,
                type: "GET",
                dataType: "script",
                async: false
            };

            $.ajax(options);
            return options.response;
        };
    };




})(this, flyingon);





