//表达式
(function ($) {


    $.Expression = function (expression) {

        if (expression)
        {
            this.expression = expression;
        }
    };



    var p = $.Expression.prototype;


    var parse = function (expression, variables) {


        if (!expression)
        {
            return null;
        }


        var values = expression.match(/['"\\]|@\w+|[^'"\\@]+/g),
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


    p["x:expression"] = "";



    //表达式内容
    $.defineProperty(p, "expression",

        function () {

            return this["x:expression"];
        },

        function (value) {

            this["x:expression"] = "" + value;
            this.variables = [];
            this["x:fn"] = parse(this["x:expression"], this.variables);
        });


    //计算
    p.eval = function (thisArg) {

        var fn = this["x:fn"];

        if (fn)
        {
            fn.call(thisArg);
        }
    };



    p.serialize = function (writer) {

        writer.string("expression", this["x:expression"]);
    };

    p.deserialize = function (reader, data) {

        reader.string(this, "expression", data.expression);
    };





})(flyingon);