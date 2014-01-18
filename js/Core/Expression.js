//表达式
(function (flyingon) {


    var prototype = (flyingon.Expression = function (expression) {

        if (expression)
        {
            this.expression = expression;
        }

    }).prototype;



    var parse = function (expression, variables) {


        if (!expression)
        {
            return null;
        }


        if (!expression.match(/return[\s;]/))
        {
            expression = "return " + expression;
        }


        var values = expression.match(/['"\\]|@\w+|[^'"\\@]+/g),
            value,
            quote,  //引号
            escape, //转义
            body = "";

        for (var i = 0, length = values.length; i < length; i++)
        {
            switch (value = values[i])
            {
                case "'":
                case "\"":
                    if (!escape)
                    {
                        quote ? (quote == value && (quote = null)) : (quote = value);
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
        }


        for (var i = 0, length = variables.length; i < length; i++)
        {
            body += "var " + (value = variables[i]) + " = this[\"" + value + "\"];\n";
        }


        body += values.join("");
        return new Function(body);
    };


    prototype["x:expression"] = "";



    //表达式内容
    flyingon.defineProperty(prototype, "expression",

        function () {

            return this["x:expression"];
        },

        function (value) {

            this["x:expression"] = "" + value;
            this.variables = [];
            this["x:fn"] = parse(this["x:expression"], this.variables);
        });


    //计算
    prototype.eval = function (thisArg) {

        var fn = this["x:fn"];

        if (fn)
        {
            return fn.call(thisArg);
        }
    };



    prototype.serialize = function (writer) {

        writer.string("expression", this["x:expression"]);
    };

    prototype.deserialize = function (reader, data) {

        reader.string(this, "expression", data.expression);
    };





})(flyingon);