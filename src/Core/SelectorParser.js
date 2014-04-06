
/*


css1-css3选择器


1.基础的选择器

Y *               通用元素选择器，匹配任何元素
Y E               标签选择器，匹配所有使用E标签的元素
Y .               class选择器，匹配所有class属性中包含info的元素
Y #               id选择器，匹配所有id属性等于footer的元素


2.组合选择器

Y E,F             多元素选择器，同时匹配所有E元素或F元素，E和F之间用逗号分隔
Y E F             后代元素选择器，匹配所有属于E元素后代的F元素，E和F之间用空格分隔
Y E>F             子元素选择器，匹配所有E元素的子元素F
Y E+F             毗邻元素选择器，匹配所有紧随E元素之后的同级元素F


3.CSS 2.1 属性选择器

Y E[att]          匹配所有具有att属性的E元素，不考虑它的值。（注意：E在此处可以省略，比如“[cheacked]”。以下同。）
Y E[att=val]      匹配所有att属性等于“val”的E元素
Y E[att~=val]     匹配所有att属性具有多个空格分隔的值、其中一个值等于“val”的E元素
Y E[att|=val]     匹配所有att属性具有多个连字号分隔（hyphen-separated）的值、其中一个值以“val”开头的E元素，主要用于lang属性，比如“en”、“en-us”、“en-gb”等等


4.CSS 2.1 中的伪类

Y E:first-child   匹配父元素的第一个子元素
N E:link          匹配所有未被点击的链接
N E:visited       匹配所有已被点击的链接
Y E:active        匹配鼠标已经其上按下、还没有释放的E元素
Y E:hover         匹配鼠标悬停其上的E元素
Y E:focus         匹配获得当前焦点的E元素
N E:lang(c)       匹配lang属性等于c的E元素


5.CSS 2.1中的伪元素

N E:first-line    匹配E元素的第一行
N E:first-letter  匹配E元素的第一个字母
Y E:before        在E元素之前插入生成的内容
Y E:after         在E元素之后插入生成的内容


6.CSS 3的同级元素通用选择器

Y E~F             匹配任何在E元素之后的同级F元素


7．CSS 3 属性选择器

Y E[att^=”val”] 属性att的值以”val”开头的元素
Y E[att$=”val”] 属性att的值以”val”结尾的元素
Y E[att*=”val”] 属性att的值包含”val”字符串的元素


8. CSS 3中与用户界面有关的伪类

Y E:enabled       匹配表单中激活的元素
Y E:disabled      匹配表单中禁用的元素
Y E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
Y E:selection     匹配用户当前选中的元素


9. CSS 3中的结构性伪类

N E:root                  匹配文档的根元素，对于HTML文档，就是HTML元素
Y E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
Y E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
Y E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
Y E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
Y E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
Y E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
Y E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
Y E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
Y E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)
Y E:empty                 匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素


10.CSS 3的反选伪类

N E:not(s)        匹配不符合当前选择器的任何元素


11. CSS 3中的 :target 伪类

N E:target        匹配文档中特定”id”点击后的效果


*/




/*

支持的伪类如下:

E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素
E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素

E:before        E之前元素
E:after         E之后元素

E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:first-child           匹配父元素的第一个子元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)

*/

//选择器解析器(类css选择器语法)
(function (flyingon) {



    //元素节点
    var Selector_Element = flyingon.Selector_Element = function (type, token, name, previous) {

        this.type = type;
        this.token = token;

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }

        if (previous)
        {
            previous.next = this;
            this.previous = previous;

            if (type == ",")
            {
                this.previous_type = previous.type;
            }
        }
    };


    (function () {

        //所属组合类型
        this.type = null;

        //前一个组合类型 仅对","有效
        this.previous_type = " ";

        //token标记
        this.token = null;

        //上一个节点
        this.previous = null;

        //下一个节点
        this.next = null;

        //改变构造函数
        this.constructor = Selector_Element;

        this.toString = this.toLocaleString = function () {

            var result = [];

            result.push(this.type);
            result.push(this.token);

            if (this.name != "*")
            {
                result.push(this.name);
            }

            for (var i = 0, length = this.length; i < length; i++)
            {
                result.push(this[i].toString());
            }

            var next = this.next;

            while (next)
            {
                result.push(next.toString());
                next = next.next;
            }

            return result.join("");
        };


    }).call(Selector_Element.prototype = flyingon.__pseudo_array__());





    //属性节点 
    var Selector_Property = flyingon.Selector_Property = function (name) {

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }
    };

    (function () {

        //符号
        this.token = "[]";

        //操作符
        this.operator = "";

        //属性值
        this.value = null;

        //条件检测 通过返回目标对象 否则返回false
        this.check = function (target) {

            var value = target[this.name];

            switch (this.operator)
            {
                case "":
                    return value !== undefined ? target : false;

                case "=":
                    return value == this.value ? target : false;

                case "*=": // *= 包含属性值XX (由属性解析)
                    return value && ("" + value).indexOf(this.value) >= 0 ? target : false;

                case "^=": // ^= 属性值以XX开头 (由属性解析)
                    return value && ("" + value).indexOf(this.value) == 0 ? target : false;

                case "$=": // $= 属性值以XX结尾 (由属性解析)
                    return value && (value = "" + value).lastIndexOf(this.value) == value.length - this.value.length ? target : false;

                case "~=": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                    return value && (this.regex || (this.regex = new RegExp("/(\b|\s+)" + this.value + "(\s+|\b)"))).test("" + value) ? target : false;

                case "|=": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    return value && (this.regex || (this.regex = new RegExp("/(\b|\-+)" + this.value + "(\-+|\b)"))).test("" + value) ? target : false;

                default:
                    return false;
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            return "[" + this.name + "]";
        };

    }).call(Selector_Property.prototype);



    //属性集
    var Selector_Properties = flyingon.Selector_Properties = function (item) {

        this.push(item);
    };

    (function () {

        this.token = "[][]";

        //条件检测 通过返回目标对象 否则返回false
        this.check = function (target) {

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (this[i].check(target) === false)
                {
                    return false;
                }
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            var result = [];

            for (var i = 0, length = this.length; i < length; i++)
            {
                result.push(this[i].name);
            }

            return "[" + result.join(",") + "]";
        };

    }).call(Selector_Properties.prototype = flyingon.__pseudo_array__());




    //伪类(不包含伪元素)
    var Selector_Pseudo_Class = flyingon.Selector_Pseudo_Class = function (name) {

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }
    };

    (function () {

        this.token = ":";

        //条件检测 通过返回目标对象 否则返回false
        //注: 返回的目标对象可能与传入的对象不同(伪类元素会改变目标对象)
        this.check = function (target, element_fn) {

            switch (this.name)
            {
                case "active":
                case "hover":
                case "focus":
                case "disabled":
                case "checked":
                case "selection":
                    return target.states && target.states[this.name] ? target : false;

                case "enabled":
                    return !target.states || !target.states.disabled ? target : false;

                case "empty":
                    return !target.__children__ || target.__children__.length == 0 ? target : false;

                default: //伪元素 element_fn:伪元素查询方法
                    return element_fn ? element_fn[this.name].call(this, target) : false;
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            return ":" + this.name;
        };

    }).call(Selector_Pseudo_Class.prototype = flyingon.__pseudo_array__());






    var split_regex = /"[^"]*"|'[^']*'|[\w-@%&]+|[.#* ,>+:=~|^$()\[\]]/g; //选择器拆分正则表达式


    //[name?=value]属性选择器
    function parse_property(values, length, index) {


        var nodes,
            item,
            token,

            count = 0,  //占用数组数量
            loop = true,
            end = false;


        while (loop && index < length)
        {
            count++;

            switch (token = values[index++])
            {
                case "]":
                    loop = false;
                    break;

                case ",":
                    if (nodes == null)
                    {
                        nodes = new Selector_Properties(item);
                    }

                    end = false;
                    break;

                case "*": // *= 包含属性值XX (由属性解析)
                case "^": // ^= 属性值以XX开头 (由属性解析)
                case "$": // $= 属性值以XX结尾 (由属性解析)
                case "~": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                case "|": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    item.operator += token;
                    break;

                case "=":
                    item.operator += "=";
                    end = true;
                    break;

                case " ":
                    break;

                default:
                    if (item && end)
                    {
                        switch (token[0])
                        {
                            case "\"":
                            case "'":
                                token = token.substring(1, token.length - 1);
                                break;
                        }

                        item.value = token;
                    }
                    else
                    {
                        item = new Selector_Property(token);

                        if (nodes)
                        {
                            nodes.push(item);
                        }
                    }
                    break;
            }
        }


        return {

            result: nodes || item,
            count: count
        };
    };



    //(p1[,p2...])
    function parse_parameters(values, length, index) {

        var result = 0,  //占用数组数量

            token,
            loop = true;

        while (loop && index < length)
        {
            result++;

            switch (token = values[index++])
            {
                case ")":
                    loop = false;
                    break;

                case " ":
                case ",":
                    break;

                default:
                    this.push(token);
                    break;
            }
        }

        return result;
    };



    //解析选择器 按从左至右的顺序解析
    flyingon.parse_selector = function (selector) {


        var result,
            node,   //当前节点

            type = " ", //组合类型
            token,      //当前标记

            values = selector.match(split_regex),
            i = 0,
            length = values.length;


        while (i < length)
        {
            //switch代码在chrome下的效率没有IE9好,不知道什么原因,有可能是其操作非合法变量名的时候性能太差
            switch (token = values[i++])
            {
                case "#":  //id选择器标记
                case ".":  //class选择器标记
                    node = new Selector_Element(type, token, values[i++], node);
                    break;

                case "*":  //全部元素选择器标记
                    node = new Selector_Element(type, "*", "*", node);
                    break;

                case " ":  //后代选择器标记
                    if (i == 1 || values[i - 2] != type) //前一个节点是类型则忽略
                    {
                        type = token;
                    }
                    continue;

                case ">":  //子元素选择器标记
                case "+":  //毗邻元素选择器标记
                case "~":  //之后同级元素选择器标记
                case ",":  //组合选择器标记
                    type = token;
                    continue;

                case "[": //属性 [name[?=value]] | [name[?=value]][, [name[?=value]]...] 必须属性某一节点
                    var item = parse_property(values, length, i);
                    i += item.count;

                    if (item = item.result)
                    {
                        (node || (node = new Selector_Element(type, "*", "*"))).push(item);  //未指定节点则默认添加*节点
                    }
                    break;

                case ":": //伪类 :name | :name(p1[,p2...])  必须属于某一节点 
                    if (token = values[i++])
                    {
                        var item = new Selector_Pseudo_Class(token);

                        //处理参数
                        if (i < length && values[i] == "(")
                        {
                            i += parse_parameters.call(item, values, length, ++i);
                        }

                        (node || (node = new Selector_Element(type, "*", "*"))).push(item); //未指定节点则默认添加*节点
                    }
                    break;

                case "]":  //属性选择器结束标记
                case "=":  //属性名与值的分隔 可与其它字符组合
                case "|":  //|= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                case "^":  //^= 属性值以XX开头 (由属性解析)
                case "$":  //$= 属性值以XX结尾 (由属性解析)
                case "(":  //开始参数
                case ")":  //结束参数
                    //由子类处理
                    continue;

                default: //类名 token = ""
                    node = new Selector_Element(type, "", token, node);
                    break;
            }


            type = " "; //容错处理(css不支持容错) 未指定组合类型则默认使用" "

            if (!result && node)
            {
                result = node;
            }
        }


        return result || new Selector_Element(type, "*", "*");
    };



})(flyingon);
