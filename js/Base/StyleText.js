/// <reference path="Core.js" />
/// <reference path="Xml.js" />


/*

带样式的文字,可使用XML样式设置多样式文本


标签说明:

<text>      文字块 支持属性: font-name font-style font-variant font-weight font-size font-family color opacity background-color width height baseline
<font>      字体   支持属性: name style variant weight size family
<b>	        定义粗体字
<i>	        定义斜体字
<u>	        定义下划线文本
<strike>    定义加删除线文本
<sub>	    定义下标文本
<sup>	    定义上标文本
<br>        定义换行        height
<a>	        定义链接        href
<img>       定义图片        src href opacity background-color width height align vertical-align


*/
(function (flyingon) {




    var prototype = (flyingon.StyleText = function () {


    }).prototype;



    var defineProperty = function (name, defaultValue, reparse, recompute) {

        prototype[name = "$" + name] = defaultValue;

        var body = "var name = '" + name + "';var oldValue = this[name];\nif (value != oldValue){\nthis[name] = value;";

        if (reparse)
        {
            body += "this['x:reparse'] = true;\nthis['x:recompute'] = true;";
        }
        else if (recompute)
        {
            body += "this['x:recompute'] = true;";
        }

        body += "\n}";


        var getter = new Function("return this['" + name + "']"),
            setter = new Function("value", body);

        flyingon.defineProperty(prototype, name, getter, setter);
    };


    //文本内容
    defineProperty("text", "", true);

    //字体
    defineProperty("left", 0, false, true);

    //字体
    defineProperty("top", 0, false, true);

    //字体
    defineProperty("width", 400, false, true);

    //字体
    defineProperty("height", 400, false, true);


    flyingon.defineProperty(prototype, "inlines", function () {

        return this["x:inlines"] || (this["x:inlines"] = []);
    });




    var fonts = flyingon.fonts,
        colors = flyingon.colors;


    prototype.render = function (context) {

        if (this["x:reparse"])
        {
            this["x:inlines"] = parse(this.text);
            this["x:reparse"] = false;
        }

        if (this["x:recompute"])
        {
            this.compute();
            this["x:recompute"] = false;
        }

        render.call(this, context);
    };



    //计算出相关的渲染数据
    prototype.compute = function () {


    };



    function render(context, rect, isStroke) {

        var attributes = node.attributes,
            cache = {};  //background, width, height, newline;

        for (var i = 0; i < attributes.length; i++)
        {
            var attr = attributes[i], name = attr.nodeName, value = attr.nodeValue;

            switch (name)
            {
                case "font":
                    context.font = value;
                    break;

                case "color":
                    context[this.isStroke ? "stokeStyle" : "fillStyle"] = value;
                    break;

                case "baseline":
                    context.textBaseline = attr.nodeValue;
                    break;

                case "cpacity":
                    context.globalAlpha = attr.nodeValue;
                    break;

                default:
                    cache[name] = value;
                    break;
            }
        }


        node.firstChild && renderChildren.call(context, node, data);


        //如果需要绘制背景
        if (cache.background)
        {

        }
    };


    //
    function renderChildren(context, node, data) {

        context.save();

        var nodes = node.childNodes;

        for (var i = 0; i < nodes.length; i++)
        {
            var item = nodes[i], name = item.nodeName, value = item.nodeValue;

            //文字节点
            if (item.nodeType == 3)
            {
                continue;
            }

            switch (name)
            {
                case "text":  //font color cpacity background lineheight baseline
                    render.call(this, context, item, data);
                    break;

                case "font":
                    var node = document.createElement("span"),
                        args = [];

                    args[0] = node.getAttribute("style");
                    args[1] = node.getAttribute("variant");
                    args[2] = node.getAttribute("weight");
                    args[3] = node.getAttribute("size");
                    args[4] = node.getAttribute("family");


                    break;

                case "b":

                    break;

                case "i":

                    break;

                case "u":

                    break;

                case "strike":
                    break;

                case "sub":
                    break;

                case "sup":
                    break;

                case "a":
                    break;

                default:
                    break;
            }
        }

        context.restore();
    };



})(flyingon);
