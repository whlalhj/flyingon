/// <reference path="Core.js" />


/*

Xml解析实现



XHTML中的js操作dom原属差不多,不过没有getElementById,只有getElementsByTagName

xmlDoc.documentElement.childNodes(0).nodeName,可以得到这个节点的名称
xmlDoc.documentElement.childNodes(0).nodeValue,可以得到这个节点的值
xmlDoc.documentElement.childNodes(0).hasChild,可以判断是否有子节点

可通过使用getElementsByTagName(xPath)的方法对节点进行访问

*/
(function (flyingon) {




    var prototype = (flyingon.Xml = function (data) {

        data && this.parse(data);

    }).prototype;




    //如果支持W3C DOM 则使用此方式创建
    if (document.implementation && document.implementation.createDocument)
    {
        prototype.parse = function (data) {

            this.dom = new DOMParser().parseFromString(data, "text/xml");
            this.root = this.dom.documentElement;

            return this;
        };

        prototype.load = function (file) {

            this.dom = document.implementation.createDocument('', '', null);
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this;
        };

        prototype.serialize = function () {

            return new XMLSerializer().serializeToString(this.dom);
        };
    }
    else if (window.ActiveXObject) //IE使用ActiveX方式创建
    {
        prototype.parse = function (data) {

            this.dom = new ActiveXObject("Microsoft.XMLDOM");
            this.dom.async = "false";
            this.dom.loadXML(data);
            this.root = this.dom.documentElement;

            return this.dom;
        };

        prototype.load = function (file) {

            this.dom = new ActiveXObject('Microsoft.XMLDOM');
            this.dom.async = false;
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this.dom;
        };

        prototype.serialize = function () {

            return this.dom.xml;
        };
    }
    else
    {
        throw "you browse does not support w3c xml api!";
    }





    /**************************扩展Xml解析方法****************************/


    var encode_keys = {

        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&apos;",
        " ": "&nbsp;",
        "&": "&amp;"
    },

    decode_keys = {

        "&lt;": "<",
        "&gt;": ">",
        "&quot;": "\"",
        "&apos;": "'",
        "&nbsp;": " ",
        "&amp;": "&"
    };


    //编码
    flyingon.encodeXml = function (data) {

        return data.replace(/[\<\>\"\' \&]/g, function (key) {

            return encode_keys[key];
        });
    };

    //解码
    flyingon.decodeXml = function (data) {

        return data.replace(/&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/g, function (key) {

            return decode_keys[key];
        });
    };






    //解析Xml数据为Json对象 根节点的名称忽略
    flyingon.parseXml = function (data) {


        if (!data)
        {
            return null;
        }


        //处理空格
        data = data.replace(/^[^\<]+|[^>]+$/, "").replace(/\>\s+\</g, "><");


        var decodeXml = flyingon.decodeXml,              //解码方法
            segments = data.match(/[^<>]+|\<\/?[^<>]+\/?>/g),
            escape = /&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/.test(data),   //是否存在需解码的字符

            node,
            name,
            type,
            value,

            nodes = [],
            types = [];


        for (var i = 0, length = segments.length; i < length; i++)
        {
            var segment = segments[i];

            if (segment[0] == "<") //如果是标签
            {
                if (!(name = segment.match(/[\w\.\:_\-\u0370-\uffff]+/)))
                {
                    throw new Error("xml tag error!");
                }

                name = name[0];

                if (segment[1] != "/") //开始标签
                {
                    if (type = segment.match(/type\s*=\s*[\"\']/))
                    {
                        var index = type.index + type[0].length,
                            type = segment.substring(index, segment.indexOf(segment[index - 1], index));
                    }
                    else if (length > i + 1) //未指定类型时有子项则为对象否则为字符串
                    {
                        var text = segments[i + 1];
                        type = text[0] == "<" && text[1] != "/" ? "object" : "string";
                    }
                    else
                    {
                        type = "string";
                    }

                    switch (type)
                    {
                        case "null":
                        case "boolean":
                        case "number":
                        case "string":
                        case "function":
                            break;

                        case "array":
                            nodes.push(node = []);
                            break;

                        case "object":
                            nodes.push(node = {});
                            break;

                        default:
                            nodes.push(node = {});
                            node.className = type;
                            break;
                    }

                    types.push(type);
                }
                else //结束标签
                {
                    switch (types.pop())
                    {
                        case "null":
                            value = null;
                            break;

                        case "boolean":
                            value = !!value;
                            break;

                        case "number":
                            value = parseFloat(value);
                            break;

                        case "string":
                            break;

                        case "function":
                            value = new Function(value);
                            break;

                        default: //对象或数组
                            value = nodes.pop();

                            //根节点时返回(不处理根节点名称)
                            if (nodes.length == 0)
                            {
                                return value;
                            }

                            node = nodes[nodes.length - 1];
                            break;
                    }

                    if (Array.isArray(node) == Array)
                    {
                        node.push(value);
                    }
                    else
                    {
                        node[name] = value;
                    }
                }
            }
            else //否则是文本内容
            {
                value = escape && segment.charAt("&") >= 0 ? decodeXml(segment) : segment;
            }
        }


        return node;
    };




})(flyingon);