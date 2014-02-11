
/*


css1-css3选择器


1.基础的选择器

*               通用元素选择器，匹配任何元素
E               标签选择器，匹配所有使用E标签的元素
.               class选择器，匹配所有class属性中包含info的元素
#               id选择器，匹配所有id属性等于footer的元素


2.组合选择器

E,F             多元素选择器，同时匹配所有E元素或F元素，E和F之间用逗号分隔
E F             后代元素选择器，匹配所有属于E元素后代的F元素，E和F之间用空格分隔
E>F             子元素选择器，匹配所有E元素的子元素F
E+F             毗邻元素选择器，匹配所有紧随E元素之后的同级元素F


3.CSS 2.1 属性选择器

E[att]          匹配所有具有att属性的E元素，不考虑它的值。（注意：E在此处可以省略，比如“[cheacked]”。以下同。）
E[att=val]      匹配所有att属性等于“val”的E元素
E[att~=val]     匹配所有att属性具有多个空格分隔的值、其中一个值等于“val”的E元素
E[att|=val]     匹配所有att属性具有多个连字号分隔（hyphen-separated）的值、其中一个值以“val”开头的E元素，主要用于lang属性，比如“en”、“en-us”、“en-gb”等等


4.CSS 2.1 中的伪类

E:first-child   匹配父元素的第一个子元素
E:link          匹配所有未被点击的链接
E:visited       匹配所有已被点击的链接
E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:lang(c)       匹配lang属性等于c的E元素


5.CSS 2.1中的伪元素

E:first-line    匹配E元素的第一行
E:first-letter  匹配E元素的第一个字母
E:before        在E元素之前插入生成的内容
E:after         在E元素之后插入生成的内容


6.CSS 3的同级元素通用选择器

E~F             匹配任何在E元素之后的同级F元素


7．CSS 3 属性选择器

E[att^=”val”] 属性att的值以”val”开头的元素
E[att$=”val”] 属性att的值以”val”结尾的元素
E[att*=”val”] 属性att的值包含”val”字符串的元素


8. CSS 3中与用户界面有关的伪类

E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素


9. CSS 3中的结构性伪类

E:root                  匹配文档的根元素，对于HTML文档，就是HTML元素
E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)
E:empty                 匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素


10.CSS 3的反选伪类

E:not(s)        匹配不符合当前选择器的任何元素


11. CSS 3中的 :target 伪类

E:target        匹配文档中特定”id”点击后的效果

*/




///选择器解析器
(function (flyingon) {

    //sample: Panel,Repeater .button[text="确定",name="button1"][isMouseOver=false] :checked
    //以下为解析过程
    //Panel
    //组合1[Panel]
    //组合1[Panel, Repeater]
    //后代1[组合1[Panel, Repeater]]
    //后代1[组合1[Panel, Repeater], .button]
    //后代1[组合1[Panel, Repeater], .button[[text="确定"]]]
    //后代1[组合1[Panel, Repeater], .button[组合2[[text="确定"]]]]
    //后代1[组合1[Panel, Repeater], .button[组合2[[text="确定"], [name="button1"]]]]
    //后代1[组合1[Panel, Repeater], .button[组合2[[text="确定"], [name="button1"]], [isMouseOver=false]]]
    //后代1[组合1[Panel, Repeater], .button[组合2[[text="确定"], [name="button1"]], [isMouseOver=false], :checked]]




    var split_regex = /\"[^\"]*\"|\'[^\']*\'|[\w\-\@\#\%\&]+|[\.\#\:\[\]\,\>\+\=\~\|\^\$\*\(\)]/g, //
        ast_cache = {}; //语法树缓存



    var QueryParser = flyingon.QueryParser = function (selector) {

        var values = selector.match(split_regex);

        this.selector = selector;
        this.ast = parse.call(this, values); //语法树

    }, prototype = QueryParser.prototype;



    //解析选择器
    //cache: 是否缓存
    QueryParser.parse = function (selector, cache) {

        return cache ? ast_cache[selector] || (ast_cache[selector] = new QueryParser(selector)) : new QueryParser(selector);
    };


    //全部元素选择器标记
    QueryParser.token_all = "*";

    //样式选择器标记
    QueryParser.token_style = ".";

    //id选择器标记
    QueryParser.token_id = "#";

    //类型选择器标记
    QueryParser.token_type = "";

    //伪类选择器标记
    QueryParser.token_pseudo = ":";

    //属性选择器标记
    QueryParser.token_property = "[]";

    //后代选择器标记
    QueryParser.token_descendant = " ";

    //组合选择器标记
    QueryParser.token_compsite = ",";

    //子元素选择器标记
    QueryParser.token_son = ">";

    //毗邻选择器标记
    QueryParser.token_next = "+";

    //之后同级元素选择器标记
    QueryParser.token_behind = "~";





    //组合节点类型
    function composite(token) {

        this.token = token;
    };

    composite.prototype = [];



    //元素类(all_element type_element style_element id_element)解析方法 
    function parse(values) {


        var nodes,  //节点集合
            node,   //当前节点 

            item,   //当前项  

            token,
            token_last,

            cache,

            i = 0,
            length = values.length;


        while (i < length)
        {
            //以下switch代码在chrome下的效率没有IE9好,不知道什么原因
            switch (token = values[i++])
            {
                case ".": //样式选择器
                case "#": //id选择器
                    item = new composite(token);
                    item.name = values[i++];
                    break;

                case ":": //伪类选择器
                    item = parse_pseudo.call(this, values, length, i);
                    i += this.__length__;

                    if (node) //加至当前节点
                    {
                        node.push(item);
                        item = null;
                    }
                    break;

                case "[": //开始属性
                    item = parse_property.call(this, values, length, i);
                    i += this.__length__;

                    if (node) //加至当前节点
                    {
                        node.push(item);
                        item = null;
                    }
                    break;

                case "]": //结束属性
                    break;

                case "*": // * 所有当前上下文内的元素 *= 包含属性值XX (由属性解析)
                    item = { token: token };
                    break;

                case ">>": //后代选择器
                case ",":  //组合选择器
                case ">":  //子元素选择器
                case "+":  //毗邻元素选择器
                case "~":  //~ 之后同级元素 ~= (此处不处理)匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                    if (!nodes)
                    {
                        nodes = new composite(token);

                        if (node)
                        {
                            nodes.push(node);
                        }
                    }
                    else if (nodes.token != token)
                    {
                        cache = new composite(token);
                        cache.push(nodes);
                        nodes = cache;
                    }
                    break;

                case "=": // 属性名与值的分隔 可与其它字符组合
                case "|": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                case "^": // ^= 属性值以XX开头 (由属性解析)
                case "$": // $= 属性值以XX结尾 (由属性解析)
                    //此节不处理 仅在属性中处理
                    break;

                case "(": //开始参数
                case ")": //结束参数
                    //此节不处理 仅在伪类中处理
                    break;

                default: //类名 token = ""
                    item = new composite("");

                    switch (token[0])
                    {
                        case "'":
                        case "\"":
                            item.name = token.substring(1, token.length - 1);
                            break;

                        default:
                            item.name = token;
                            break;
                    }
                    break;
            }


            //处理当前节点
            if (item)
            {
                if (nodes)
                {
                    if (nodes.token != " " && nodes.token != token_last) //如果组合选择器token不等前一token 按后代选择器处理
                    {
                        cache = new composite(" ");
                        cache.push(nodes);
                        nodes = cache;
                    }

                    nodes.push(node = item);
                }
                else if (node)
                {
                    nodes = new composite(" ");
                    nodes.push(node);
                    nodes.push(node = item);
                }
                else
                {
                    node = item;
                }

                item = null;
            }


            token_last = token;
        }


        return nodes || node;
    };



    //[name?=value]属性选择器
    function parse_property(values, length, index) {


        var nodes,
            item,
            loop = true,
            end = false,
            token;


        this.__length__ = 0;

        while (loop && index < length)
        {
            this.__length__++;

            switch (token = values[index++])
            {
                case "]":
                    loop = false;
                    break;

                case ",":
                    if (nodes == null)
                    {
                        nodes = new composite(",");
                        nodes.push(item);
                    }

                    end = false;
                    break;

                case "*": // *= 包含属性值XX (由属性解析)
                case "^": // ^= 属性值以XX开头 (由属性解析)
                case "$": // $= 属性值以XX结尾 (由属性解析)
                case "~": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                case "|": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    item.relation += token;
                    break;

                case "=":
                    item.relation += "=";
                    end = true;
                    break;

                default:
                    if (item && end)
                    {
                        switch (token[0])
                        {
                            case "\"":
                            case "'":
                                item.value = token.substring(1, token.length - 1);
                                break;

                            default:
                                item.value = token;
                                break;
                        }
                    }
                    else
                    {
                        item = { token: "[]" };
                        item.name = token;
                        item.relation = "";

                        if (nodes)
                        {
                            nodes.push(item);
                        }
                    }
                    break;
            }
        }


        return nodes || item;
    };


    //:name :name(p1[,p2...]) 伪类(扩展)选择器
    function parse_pseudo(values, length, index) {

        var result = { token: ":" };

        result.name = values[index++];
        this.__length__ = 1;

        if (index < length && values[index] == "(") //无参数
        {
            var loop = true,
                token;

            result.parameters = [];

            while (loop && index < length)
            {
                result++;

                switch (token = values[index++])
                {
                    case ")":
                        loop = false;
                        break;

                    case ",":
                        break;

                    default:
                        result.parameters.push(token);
                        break;
                }
            }
        }

        return result;
    };




})(flyingon);
