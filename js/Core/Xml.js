/// <reference path="Core.js" />


/*

Xml解析实现



XHTML中的js操作dom原属差不多,不过没有getElementById,只有getElementsByTagName

xmlDoc.documentElement.childNodes(0).nodeName,可以得到这个节点的名称
xmlDoc.documentElement.childNodes(0).nodeValue,可以得到这个节点的值
xmlDoc.documentElement.childNodes(0).hasChild,可以判断是否有子节点

可通过使用getElementsByTagName(xPath)的方法对节点进行访问

*/
(function ($) {




    $.Xml = function (xml) {

        if (xml)
        {
            this.parse(xml);
        }
    };




    var p = $.Xml.prototype;




    //如果支持W3C DOM 则使用此方式创建
    if (document.implementation && document.implementation.createDocument)
    {
        p.parse = function (xml) {

            this.dom = new DOMParser().parseFromString(xml, "text/xml");
            this.root = this.dom.documentElement;

            return this;
        };

        p.load = function (file) {

            this.dom = document.implementation.createDocument('', '', null);
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this;
        };

        p.serialize = function () {

            return new XMLSerializer().serializeToString(this.dom);
        };
    }
        //else if (window.ActiveXObject) //IE使用ActiveX方式创建
        //{
        //    p.parse = function (xml) {

        //        this.dom = new ActiveXObject("Microsoft.XMLDOM");
        //        this.dom.async = "false";
        //        this.dom.loadXML(xml);
        //        this.root = this.dom.documentElement;

        //        return this.dom;
        //    };

        //    p.load = function (file) {

        //        this.dom = new ActiveXObject('Microsoft.XMLDOM');
        //        this.dom.async = false;
        //        this.dom.load(file);
        //        this.root = this.dom.documentElement;

        //        return this.dom;
        //    };

        //    p.serialize = function () {

        //        return this.dom.xml;
        //    };
        //}
    else
    {
        throw "you browse does not support w3c xml api!";
    }





    /*********************以上内置的Xml解析方法性能太差,以下扩展正则表达式自定义解析支持****************************/


    var regex_split = /[^<>]+|\<\/?[^<>]+\/?>/g,    //分隔标签
        regex_tag1 = /\<\s+\/\s+|\<\/\s+/g,         //替换标签空格如"< / " || "</ "
        regex_tag2 = /\<\s+/g,                      //替换标签空格如"< "
        regex_tag3 = /\s+\/\s+\>|\/\s+\>/g,         //替换标签空格如" / >" || "/ >"
        regex_tag4 = /\s+\>/g,                      //替换标签空格如" >" 
        regex_attr = /\"[^\"]*\"|[\w-_.:\u0370-\uffff]+|\'[^\']*\'/g,   //分隔属性 \u4e00-\u9fa5:汉字 参考unicode表 不返回引号的表达式(性能偏差不使用):/[\w-.:\u0370-\uffff]+|(?=\")[^\"]+(?=\")|\"\"|(?=\')[^\']+(?=\')|\'\'/g
        regex_escape = /&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/;          //解码


    //编码
    $.Xml.encode = function (value) {

        return value.replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;")
            .replace(" ", "&nbsp;")
            .replace("&", "&amp;");
    };

    //解码
    $.Xml.decode = function (value) {

        return value.replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&apos;", "'")
            .replace("&nbsp;", " ")
            .replace("&amp;", "&");
    };


    $.Xml.parse = function (xml) {

        var data = { tagName: "text", childNodes: [] };

        if (!xml)
        {
            return data;
        }


        //处理不规范的格式
        xml = xml.replace(regex_tag1, "</")
           .replace(regex_tag2, "<")
           .replace(regex_tag3, "/>")
           .replace(regex_tag4, ">");



        var escape = xml.match(regex_escape),   //是否存在需解码的字符
            decode = $.Xml.decode,              //解码方法
            segments = xml.match(regex_split),

            i = 0,
            length = segments.length;  //截取


        while (i < length)
        {
            var segment = segments[i++];

            if (segment[0] == "<") //如果是标签
            {
                if (segment[1] == "/") //结束标签
                {
                    var tagName = segment.substring(2, segment.length - 1);

                    if (tagName != data.tagName)
                    {
                        throw "xml data is not correct! the tag \"" + data.tagName + "\" is not closed!";;
                    }

                    data = data.parent || data;
                }
                else //开始标签
                {
                    var tokens = segment.match(regex_attr),
                        attributes = {},
                        node = { tagName: tokens[0], parentNode: data, childNodes: [], nodeType: 1, attributes: attributes },

                        j = 0,
                        count = tokens.length;

                    while (j < count)
                    {
                        var name = tokens[j++],
                            value = tokens[j++];

                        value = value.substring(1, value.length - 1);
                        attributes[name] = escape && value.charAt("&") >= 0 ? decode(value) : value;
                    }

                    data.childNodes.push(node);

                    if (segment[segment.length - 2] != "/") //不是直接结束
                    {
                        data = node;
                    }
                }
            }
            else //否则是文本内容
            {
                data.childNodes.push({ tagName: "#text", nodeType: 3, nodeValue: escape && segment.charAt("&") >= 0 ? decode(segment) : segment });
            }
        }


        return data;
    };




})(flyingon);