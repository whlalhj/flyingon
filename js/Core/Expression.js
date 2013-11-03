//表达式
(function ($) {


    $.Expression = function () {

    };



    var p = $.Expression.prototype;


    var parse = $.Expression.parse = function (data, variables) {


        if (!variables)
        {
            variables = [];
        }

        if (!data)
        {
            return null;
        }


        var values = data.match(/['"\\]|@\w+|[^'"\\@]+/g),
            i = 0,
            length = values.length,
            value,
            quote,  //引号
            escape, //转义
            body = "";

        while (i < length)
        {
            switch (value = values[i])
            {
                case "'":
                case "\"":
                    if (!escape)
                    {
                        if (quote)
                        {
                            if (quote == value)
                            {
                                quote = null;
                            }
                        }
                        else
                        {
                            quote = value;
                        }
                    }
                    else
                    {
                        escape = false;
                    }
                    break;

                case "\\":
                    escape = quote ? !escape : false;
                    break;

                default:
                    if (value[0] == "@" && !quote)
                    {
                        value = values[i] = value.substring(1);

                        if (!values[value])
                        {
                            values[value] = true;
                            variables.push(value);
                        }
                    }

                    escape = false;
                    break;
            }

            i++;
        }


        i = 0;
        length = variables.length;

        while (i < length)
        {
            body += "var " + (value = variables[i++]) + " = this[\"" + value + "\"];\n";
        }

        body += "return " + values.join("") + ";";
        return new Function(body);
    };



    //表达式内容
    $.defineProperty(p, "data",

        function () {

            return this["x:data"];
        },

        function (value) {

            this["x:data"] = "" + value;
            this.variables = [];
            this.fn = parse(this["x:data"], this.variables);
        });


    //函数 由表达式自动生成(请勿修改)
    p.fn = null;



})(flyingon);