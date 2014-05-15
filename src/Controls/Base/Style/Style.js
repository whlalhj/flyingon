
//样式相关
(function (flyingon) {




    var style_split_fn = {},                //样式拆分函数

        convert_name_regex = /[-_](\w)/g;   //名称转换规则 例: margin-left || margin_left -> marginLeft




    //定义样式类   
    function style_class(target) {

        this.__target = target;
        this.__fields = Object.create(this.__style = Object.create(null));
    };


    //开放样式类给Control
    flyingon.__style_class = style_class;




    //扩展样式类属性
    (function (prototype) {



        //修改集合项为首字母大写
        function toUpperCase(values, prefix) {

            prefix = prefix || "";

            for (var i = 0, length = values.length; i < length; i++)
            {
                values[i] = prefix + values[i][0].toUpperCase() + values[i].substring(1);
            }

            return values;
        };


        //定义复合属性 不存储实际数据 通过定义属性进行操作
        function complex(name, getter, split_fn) {

            var name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            if (getter.constructor !== Function) //如果getter为数组则表示子属性
            {
                var template, names;

                if (getter[1].constructor !== String)
                {
                    template = getter[0];
                    names = getter[1];
                }
                else
                {
                    template = name + "-?";
                    names = getter;
                }

                for (var i = 0, length = names.length; i < length; i++)
                {
                    names[i] = "this." + template.replace("?", names[i]).replace(convert_name_regex, function (_, x) {

                        return x.toUpperCase();
                    });
                }

                getter = new Function("return [" + names.join(",") + "].join(\" \");")

                if (!split_fn) //未指定则默认拆分成4个值 只有一个值则全部相等 两个值则2,3=0,1 3个值则3=1
                {
                    var body = "\n";

                    for (var i = 0, length = names.length; i < length; i++)
                    {
                        body += names[i] + " = values[" + i + "];\n";
                    }

                    split_fn = Function("value", (function () {

                        var values = value && ("" + value).match(/[\w-_%]+/g);

                        if (values)
                        {
                            switch (values.length)
                            {
                                case 1:
                                    values[1] = values[2] = values[3] = values[0];
                                    break;

                                case 2:
                                    values[2] = values[0];
                                    values[3] = values[1];
                                    break;

                                default:
                                    values[3] = values[1];
                                    break;
                            }
                        }
                        else
                        {
                            values = [];
                        }

                    }).get_body() + body);
                }
            }

            flyingon.defineProperty(prototype, name, getter, style_split_fn[name] = split_fn);
        };


        //创建样式
        function style(name, defaultValue, inherit) {

            name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            var getter = new Function("return this.__fields." + name
                    + (inherit ? " || (this.__target.__parent && this.__target.__parent.__style." + name + ")" : "")
                    + " || \"" + defaultValue + "\""),

                setter = new Function("value", "if (value) this.__fields." + name + " = value;\n"
                    + "else delete this.__fields." + name + ";\n"
                    + "this.__" + name + " = undefined;\n"
                    + "this.__dirty = true;");

            flyingon.defineProperty(prototype, name, getter, setter);
        };


        //创建多个相同性质的样式
        function styles(template, names, defaultValue, inherit) {

            for (var i = 0, length = names.length; i < length; i++)
            {
                style(template.replace("?", names[i]), defaultValue, inherit);
            }
        };




        //auto	    默认 浏览器会计算出实际的高度 
        //fill      
        //content   
        //length	使用 px、cm 等单位定义高度 
        //%	        基于包含它的块级对象的百分比高度 
        //inherit	规定应该从父元素继承 height 属性的值 
        styles("?", ["width", "height"], "auto", false);


        //auto	    默认值 通过浏览器计算左边缘的位置 
        //%	        设置以包含元素的百分比计的左边位置 可使用负值 
        //length	使用 px、cm 等单位设置元素的左边位置 可使用负值 
        //inherit	规定应该从父元素继承 left 属性的值 
        styles("?", ["top", "right", "bottom", "left"], "auto", false);


        //length	定义元素的最小宽度值 默认值：取决于浏览器 
        //%	    定义基于包含它的块级对象的百分比最小宽度 
        //inherit	规定应该从父元素继承 min-width 属性的值 
        styles("min-?", ["width", "height"], "0px", false);


        //none	    默认 定义对元素的最大宽度没有限制 
        //length	定义元素的最大宽度值 
        //%	        定义基于包含它的块级对象的百分比最大宽度 
        //inherit	规定应该从父元素继承 max-width 属性的值 
        styles("max-?", ["width", "height"], "none", false);


        //normal	默认 设置合理的行间距 
        //number	设置数字, 此数字会与当前的字体尺寸相乘来设置行间距 
        //length	设置固定的行间距 
        //%	        基于当前字体尺寸的百分比行间距 
        //inherit	规定应该从父元素继承 line-height 属性的值 
        style("line-height", "normal", true);


        //auto	    默认 堆叠顺序与父元素相等 
        //number	设置元素的堆叠顺序 
        //inherit	规定应该从父元素继承 z-index 属性的值 
        style("z-index", "auto", false);


        //visible	默认值 元素是可见的 
        //hidden	元素是不可见的 
        //collapse	当在表格元素中使用时, 此值可删除一行或一列, 但是它不会影响表格的布局 被行或列占据的空间会留给其他内容使用 如果此值被用在其他的元素上, 会呈现为 "hidden" 
        //inherit	规定应该从父元素继承 visibility 属性的值 
        style("visibility", "visible", true);

        //value	规定不透明度 从 0.0 （完全透明）到 1.0（完全不透明） 	测试
        //inherit	应该从父元素继承 opacity 属性的值 
        style("opacity", 1, false);

        //url	    需使用的自定义光标的 URL     注释：请在此列表的末端始终定义一种普通的光标, 以防没有由 URL 定义的可用光标 
        //default	默认光标（通常是一个箭头）
        //auto	    默认 浏览器设置的光标 
        //crosshair	光标呈现为十字线 
        //pointer	光标呈现为指示链接的指针（一只手）
        //move	    此光标指示某对象可被移动 
        //e-resize	此光标指示矩形框的边缘可被向右（东）移动 
        //ne-resize	此光标指示矩形框的边缘可被向上及向右移动（北/东） 
        //nw-resize	此光标指示矩形框的边缘可被向上及向左移动（北/西） 
        //n-resize	此光标指示矩形框的边缘可被向上（北）移动 
        //se-resize	此光标指示矩形框的边缘可被向下及向右移动（南/东） 
        //sw-resize	此光标指示矩形框的边缘可被向下及向左移动（南/西） 
        //s-resize	此光标指示矩形框的边缘可被向下移动（南） 
        //w-resize	此光标指示矩形框的边缘可被向左移动（西） 
        //text	    此光标指示文本 
        //wait	    此光标指示程序正忙（通常是一只表或沙漏） 
        //help	    此光标指示可用的帮助（通常是一个问号或一个气球） 
        style("cursor", "auto", true);

        //ltr	    默认 文本方向从左到右 
        //rtl	    文本方向从右到左 
        //inherit	规定应该从父元素继承 direction 属性的值 
        style("direction", "ltr", true);

        //是否竖排 非css属性
        //true      竖排
        //false     横排
        style("vertical", false, false);


        //shape	    设置元素的形状 唯一合法的形状值是：rect (top, right, bottom, left)
        //auto	    默认值 不应用任何剪裁 
        //inherit	规定应该从父元素继承 clip 属性的值 
        style("clip", "auto", false);


        //margin
        complex("margin", ["top", "right", "bottom", "left"]);


        //auto	    浏览器计算下外边距 
        //length	规定以具体单位计的下外边距值, 比如像素、厘米等 默认值是 0px 
        //%	        规定基于父元素的宽度的百分比的下外边距 
        //inherit	规定应该从父元素继承下外边距 
        styles("margin-?", ["top", "right", "bottom", "left"], "0px", false);



        //拆分边框
        //必须按照 width -> style -> color 的顺序编写 可省略某些属性 未传入有效数据则清空相关属性
        function split_border(name) {

            var regex = /(\d+[\w|%]*)?\s*(none|hidden|dotted|dashed|solid|double|groove|ridge|inset)?\s*(\S+)?/,
                names = toUpperCase(["width", "style", "color"], "border" + (name ? name[0].toUpperCase() + name.substring(1) : ""));

            return function (value) {

                if (value)
                {
                    var self = this;

                    ("" + value).replace(regex, function (_, width, style, color) {

                        self[names[0]] = width;
                        self[names[1]] = style;
                        self[names[2]] = color;
                    });
                }
            };
        };

        //border-width	规定边框的宽度 参阅：border-width 中可能的值 
        //border-style	规定边框的样式 参阅：border-style 中可能的值 
        //border-color	规定边框的颜色 参阅：border-color 中可能的值 
        //inherit	    规定应该从父元素继承 border 属性的设置 
        complex("border", (function () {

            var items1 = toUpperCase(["width", "style", "color"]),
                items2 = toUpperCase(["top", "right", "bottom", "left"]);

            return function () {

                var values = [];

                loop:
                    for (var i = 0; i < 3; i++)
                    {
                        var name = items1[i],
                            value = this["border" + items2[0] + name];

                        for (var j = 1; j < 4; j++)
                        {
                            if (value !== this["border" + items2[j] + name])
                            {
                                continue loop;
                            }
                        }

                        values.push(value);
                    }

                return values.join(" ");
            };

        })(), split_border());

        //border-top-width	规outset定上边框的宽度 参阅：border-top-width 中可能的值 
        //border-top-style	规inherit定上边框的样式 参阅：border-top-style 中可能的值 
        //border-top-color	规定上边框的颜色 参阅：border-top-color 中可能的值 
        //inherit	        规定应该从父元素继承 border-top 属性的设置 
        complex("border-top", ["width", "style", "color"], split_border("top"));

        //border-right-width	规定右边框的宽度 参阅：border-right-width 中可能的值 
        //border-right-style	规定右边框的样式 参阅：border-right-style 中可能的值 
        //border-right-color	规定右边框的颜色 参阅：border-right-color 中可能的值 
        //inherit	            规定应该从父元素继承 border-right 属性的设置 
        complex("border-right", ["width", "style", "color"], split_border("right"));

        //border-bottom-width	规定下边框的宽度 参阅：border-bottom-width 中可能的值 
        //border-bottom-style	规定下边框的样式 参阅：border-bottom-style 中可能的值 
        //border-bottom-color	规定下边框的颜色 参阅：border-bottom-color 中可能的值 
        //inherit	            规定应该从父元素继承 border-bottom 属性的设置 
        complex("border-bottom", ["width", "style", "color"], split_border("bottom"));

        //border-left-width	规定左边框的宽度 参阅：border-left-width 中可能的值 
        //border-left-style	规定左边框的样式 参阅：border-left-style 中可能的值 
        //border-left-color	规定左边框的颜色 参阅：border-left-color 中可能的值 
        //inherit	        规定应该从父元素继承 border-left 属性的设置 
        complex("border-left", ["width", "style", "color"], split_border("left"));

        //
        complex("border-style", ["border-?-style", ["top", "right", "bottom", "left"]]);

        //none	    定义无边框 
        //hidden	与 "none" 相同 不过应用于表时除外, 对于表, hidden 用于解决边框冲突 
        //dotted	定义点状边框 在大多数浏览器中呈现为实线 
        //dashed	定义虚线 在大多数浏览器中呈现为实线 
        //solid	    定义实线 
        //double	定义双线 双线的宽度等于 border-width 的值 
        //groove	定义 3D 凹槽边框 其效果取决于 border-color 的值 
        //ridge	    定义 3D 垄状边框 其效果取决于 border-color 的值 
        //inset	    定义 3D inset 边框 其效果取决于 border-color 的值 
        //outset	定义 3D outset 边框 其效果取决于 border-color 的值 
        //inherit	规定应该从父元素继承边框样式 
        styles("border-?-style", ["top", "right", "bottom", "left"], "none", false);

        //
        complex("border-width", ["border-?-width", ["top", "right", "bottom", "left"]]);

        //length	允许您自定义下边框的宽度 
        //inherit	规定应该从父元素继承边框宽度 
        styles("border-?-width", ["top", "right", "bottom", "left"], "0px", false);

        //
        complex("border-color", ["border-?-color", ["top", "right", "bottom", "left"]]);

        //color_name	规定颜色值为颜色名称的边框颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的边框颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的边框颜色（比如 rgb(255,0,0)） 
        //transparent	默认值 边框颜色为透明 
        //inherit	    规定应该从父元素继承边框颜色 
        styles("border-?-color", ["top", "right", "bottom", "left"], "transparent", false);

        //
        complex("border-radius", ["border-?-radius", ["top-left", "top-right", "bottom-left", "bottom-right"]]);

        //length	定义圆角的形状
        //%	        以百分比定义圆角的形状 
        styles("border-?-radius", ["top-left", "top-right", "bottom-left", "bottom-right"], "0px", false);


        //"border-collapse"
        //"border-image"
        //"border-image-outset"
        //"border-image-repeat"
        //"border-image-slice"
        //"border-image-source"
        //"border-image-width"





        complex("padding", ["top", "right", "bottom", "left"]);

        //length	规定以具体单位计的固定的下内边距值, 比如像素、厘米等 默认值是 0px 
        //%	        定义基于父元素宽度的百分比下内边距 此值不会如预期地那样工作于所有的浏览器中 
        //inherit	规定应该从父元素继承下内边距 
        styles("padding-?", ["top", "right", "bottom", "left"], "0px", false);



        //必须按照 color -> image -> repeat -> attachment -> position -> family 的顺序编写 可省略某些属性
        complex("background", ["color", "image", "repeat", "attachment", "position"], (function () {

            var regex = /(none|url\([^\)]*\))|(repeat|repeat-x|repeat-y|no-repeat)|(scroll|fixed)|(left|top|center|right|bottom|\d+[\w%]*)|\S+/g,
                names = toUpperCase(["color", "image", "repeat", "attachment", "position"], "background"),
                name;

            return function (value) {

                if (value)
                {
                    var values, cache;

                    ("" + value).replace(regex, function (_, image, repeat, attachment, position, color) {

                        values = values || {};

                        color && (values.color = color);
                        image && (values.mage = image);
                        repeat && (values.repeat = repeat);
                        attachment && (values.attachment = attachment);

                        if (position)
                        {
                            switch (position)
                            {
                                case "top":
                                    cache ? (cache[1] = "0%") : (cache = ["50%", "0%"]);
                                    break;

                                case "left":
                                    cache ? (cache[0] = "0%") : (cache = ["0%", "50%"]);
                                    break;

                                case "center":
                                    cache ? (cache[1] = "50%") : (cache = ["50%", "50%"]);
                                    break;

                                case "right":
                                    cache ? (cache[0] = "100%") : (cache = ["100%", "50%"]);
                                    break;

                                case "bottom":
                                    cache ? (cache[1] = "100%") : (cache = ["50%", "100%"]);
                                    break;

                                default:
                                    cache ? (cache[1] = position) : (cache = [position, "50%"]);
                                    break;
                            }
                        }
                    });

                    if (values)
                    {
                        if (cache)
                        {
                            values.position = cache.join(" ");
                        }

                        for (var i = 0; i < 5; i++)
                        {
                            cache = names[i];
                            this[cache[1]] = values[cache[0]];
                        }
                    }
                }
            };

        })());

        //color_name	规定颜色值为颜色名称的背景颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的背景颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的背景颜色（比如 rgb(255,0,0)） 
        //transparent	默认 背景颜色为透明 
        //inherit	    规定应该从父元素继承 background-color 属性的设置 
        style("background-color", "transparent", false);

        //url('URL')	指向图像的路径 
        //none	        默认值 不显示背景图像 
        //inherit	    规定应该从父元素继承 background-image 属性的设置 
        style("background-image", "none", false);

        //repeat	默认 背景图像将在垂直方向和水平方向重复 
        //repeat-x	背景图像将在水平方向重复 
        //repeat-y	背景图像将在垂直方向重复 
        //no-repeat	背景图像将仅显示一次 
        //inherit	规定应该从父元素继承 background-repeat 属性的设置 
        style("background-repeat", "repeat", false);

        //scroll	默认值 背景图像会随着页面其余部分的滚动而移动 
        //fixed	    当页面的其余部分滚动时, 背景图像不会移动 
        //inherit	规定应该从父元素继承 background-attachment 属性的设置 
        style("background-attachment", "scroll", false);

        //top left
        //top center
        //top right
        //center left
        //center center
        //center right
        //bottom left
        //bottom center
        //bottom right  如果您仅规定了一个关键词, 那么第二个值将是"center"     默认值：0% 0% 
        //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
        //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
        style("background-position", "0% 0%", false);

        //padding-box	背景图像相对于内边距框来定位 	
        //border-box	背景图像相对于边框盒来定位 	
        //content-box	背景图像相对于内容框来定位 
        style("background-origin", "padding-box", false);

        //length	    设置背景图像的高度和宽度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //percentage	以父元素的百分比来设置背景图像的宽度和高度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //cover	        把背景图像扩展至足够大, 以使背景图像完全覆盖背景区域     背景图像的某些部分也许无法显示在背景定位区域中 
        //contain	    把图像图像扩展至最大尺寸, 以使其宽度和高度完全适应内容区域 
        style("background-size", "auto", false);

        //border-box	背景被裁剪到边框盒 
        //padding-box	背景被裁剪到内边距框 
        //content-box	背景被裁剪到内容框 
        style("background-clip", "border-box", false);



        //color_name	规定颜色值为颜色名称的颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的颜色（比如 rgb(255,0,0)） 
        //inherit	    规定应该从父元素继承颜色 
        style("color", "black", true);




        //必须按照 style -> variant -> weight -> size -> line-height -> family 的顺序编写 可省略某些属性
        complex("font", ["style", "variant", "weight", "size + \"/\" + this.lineHeight", "family"], (function () {

            var regex = /(normal|italic|oblique)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+[\w|%]*|xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)?\s*\/?\s*(\d+[\w|%]*)?/;

            return function (value) {

                if (value)
                {
                    var self = this;

                    (value = "" + value).replace(regex, function (all, style, variant, weight, size, lineHeight) {

                        style && (self.fontStyle = style);
                        variant && (self.fontVariant = variant);
                        weight && (self.fontWeight = weight);
                        size && (self.fontSize = size);
                        lineHeight && (self.lineHeight = lineHeight);

                        if (value.length > all.length)
                        {
                            self.fontFamily = value.substring(all.length);
                        }
                    });
                }
            };

        })());

        //normal	默认值 浏览器显示一个标准的字体样式 
        //italic	浏览器会显示一个斜体的字体样式 
        //oblique	浏览器会显示一个倾斜的字体样式 
        //inherit	规定应该从父元素继承字体样式 
        style("font-style", "normal", true);

        //normal	    默认值 浏览器会显示一个标准的字体 
        //small-caps	浏览器会显示小型大写字母的字体 
        //inherit	    规定应该从父元素继承 font-variant 属性的值 
        style("font-variant", "normal", true);

        //normal	默认值 定义标准的字符 
        //bold	    定义粗体字符 
        //bolder	定义更粗的字符 
        //lighter	定义更细的字符 
        //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
        //inherit	规定应该从父元素继承字体的粗细 
        style("font-weight", "normal", true);

        //xx-small
        //x-small
        //small
        //medium
        //large
        //x-large
        //xx-large  把字体的尺寸设置为不同的尺寸, 从 xx-small 到 xx-large  默认值：medium 
        //smaller	把 font-size 设置为比父元素更小的尺寸 
        //larger	把 font-size 设置为比父元素更大的尺寸 
        //length	把 font-size 设置为一个固定的值 
        //%	        把 font-size 设置为基于父元素的一个百分比值 
        //inherit	规定应该从父元素继承字体尺寸 
        style("font-size", "medium", true);

        //family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表  默认值：取决于浏览器 
        //inherit	规定应该从父元素继承字体系列 
        style("font-family", "arial,宋体,sans-serif", true);


        //left	    把文本排列到左边 默认值：由浏览器决定 
        //right	    把文本排列到右边 
        //center	把文本排列到中间 
        //justify	实现两端对齐文本效果 
        //inherit	规定应该从父元素继承 text-align 属性的值 
        style("text-align", "left", true);

        //baseline	    默认 元素放置在父元素的基线上 
        //top	        把元素的顶端与行中最高元素的顶端对齐
        //middle	    把此元素放置在父元素的中部 
        //bottom	    把元素的顶端与行中最低的元素的顶端对齐 
        //sub	        垂直对齐文本的下标 
        //super	        垂直对齐文本的上标
        //text-top	    把元素的顶端与父元素字体的顶端对齐
        //text-bottom	把元素的底端与父元素字体的底端对齐 
        //length	 
        //%	            使用 "line-height" 属性的百分比值来排列此元素 允许使用负值 
        //inherit	    规定应该从父元素继承 vertical-align 属性的值 
        style("vertical-align", "baseline", false);

        //normal	默认 规定字符间没有额外的空间 
        //length	定义字符间的固定空间（允许使用负值） 
        //inherit	规定应该从父元素继承 letter-spacing 属性的值 
        style("letter-spacing", "normal", true);

        //normal	默认 定义单词间的标准空间 
        //length	定义单词间的固定空间 
        //inherit	规定应该从父元素继承 word-spacing 属性的值 
        style("word-spacing", "normal", true);

        //length	定义固定的缩进 默认值：0 
        //%	        定义基于父元素宽度的百分比的缩进 
        //inherit	规定应该从父元素继承 text-indent 属性的值 
        style("text-indent", "yes", true);

        //none	        默认 定义标准的文本 
        //underline	    定义文本下的一条线 
        //overline	    定义文本上的一条线 
        //line-through	定义穿过文本下的一条线 
        //blink	        定义闪烁的文本 
        //inherit	    规定应该从父元素继承 text-decoration 属性的值 
        style("text-decoration", "none", false);

        //文字换行
        //false	    不换行
        //true	    自动换行
        style("text-wrap", false, false)


        //clip	    修剪文本 	测试
        //ellipsis	显示省略符号来代表被修剪的文本 	
        //string	使用给定的字符串来代表被修剪的文本 
        //"text-overflow"

        //none	        默认 定义带有小写字母和大写字母的标准的文本 
        //capitalize	文本中的每个单词以大写字母开头 
        //uppercase	    定义仅有大写字母 
        //lowercase	    定义无大写字母, 仅有小写字母 
        //inherit	    规定应该从父元素继承 text-transform 属性的值 
        //"text-transform"

        //normal	    默认 空白会被浏览器忽略 
        //pre	        空白会被浏览器保留 其行为方式类似 HTML 中的 <pre> 标签 
        //nowrap	    文本不会换行, 文本会在在同一行上继续, 直到遇到 <br> 标签为止 
        //pre-wrap	    保留空白符序列, 但是正常地进行换行 
        //pre-line	    合并空白符序列, 但是保留换行符 
        //inherit	    规定应该从父元素继承 white-space 属性的值 
        //"white-space"

        //normal	    使用浏览器默认的换行规则 
        //break-all	    允许在单词内换行 
        //keep-all	    只能在半角空格或连字符处换行 
        //"word-break"

        //normal	    只在允许的断字点换行（浏览器保持默认处理） 
        //break-word	在长单词或 URL 地址内部进行换行 
        //"word-wrap"


        //销毁
        defineProperty = complex = style = styles = null;



    })(style_class.prototype);




    //四舍五入求整
    var round = Math.round;


    //计算实际大小
    function compute_size(value) {


        if (unit)
        {
            switch (unit)
            {
                case "px":
                    return value;

                case "in":
                    return round(value * 96);

                case "cm":
                    return round(value * 96 / 2.54);

                case "mm":
                    return round(value * 96 / 25.4);

                case "pt":
                    return round(value * 4 / 3);

                case "pc":
                    return round(value * 16); //96 / 6

                case "em":
                    return round(value * this.__font_height);

                case "ex":
                    return round(value * this.__storage.x);

                case "%":
                    return round(value * this.__font_height / 100);
            }
        }

        return value;
    };







    var element_node = flyingon.__element_node,  //缓存元素类型

        class_list = flyingon.__registry_class_list, //已注册类型集合

        style_sheets = {},      //样式表集合

        style_use_names = {},   //所有使用过的名称

        style_type_fn = {},     //样式类型检测函数

        style_version = 0,      //当前样式版本(控制样式组缓存更新)

        style_cache_list = {},  //缓存样式值集合`  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

        style_type_names = {},  //样式类别名集合(按类别缓存样式) 缓存方式: 属性名 -> 类别 -> 权重 -> [选择器, 样式值]

        all_max_level = 0,      //从后开始的最大连续*元素级别

        pseudo_keys = {         //伪类key 不在此列即为伪元素 value为伪元素权重 默认为10

            selection: 16,
            enabled: 15,
            disabled: 15,
            active: 14,
            hover: 13,
            focus: 12,
            checked: 11
        };




    //已注册的样式表
    flyingon.styleSheets = function () {

        return style_sheets;
    };


    //定义样式
    flyingon.defineStyle = function (selector, style, super_selector) {

        if (selector && style)
        {
            var cache;

            //处理继承
            if (super_selector && (cache = style_sheets[super_selector]))
            {
                for (var name in cache)
                {
                    if (!style[name])
                    {
                        style[name] = cache[name];
                    }
                }
            }

            //缓存样式
            style_sheets[selector] = style;

            //解析选择器
            selector = flyingon.parse_selector(selector);

            if (selector.forks) //如果存在分支则拆分分支为独立选择器
            {
                selector = split_selector(selector);

                for (var i = selector.length - 1; i >= 0; i--)
                {
                    handle_style(selector[i], style);
                }
            }
            else
            {
                handle_style(selector, style);
            }

            style_version++;
        }
    };


    //重置样式表
    flyingon.resetStyle = function () {

        flyingon.clearStyle();

        for (var name in style_sheets)
        {
            flyingon.defineStyle(name, style);
        }
    };


    //清除所有样式
    flyingon.clearStyle = function () {

        style_sheets = {};
        style_cache_list = {};
        style_type_names = {};
        all_max_level = 0;

        style_version++;
    };



    //拆分有分支的选择器为多个独立选择器
    function split_selector(selector) {

        var result = [],                    //结果集
            forks = selector.forks,         //分支位置集合
            fill = 1,                       //每一轮的填充个数(从后到前逐级递增)
            total = 1;                      //总数

        //计算总结果数
        for (var i = forks.length - 1; i >= 0; i--)
        {
            total *= selector[forks[i]].length;
        }

        result.length = total;

        //先全部复制选择器内容
        for (var i = 0; i < total; i++)
        {
            result[i] = selector.slice(0);
        }

        //再从后到前替换每个分支子项
        for (var i = forks.length - 1; i >= 0; i--)
        {
            var index = forks[i],            //目标位置
                nodes = selector[index],     //当前分支节点
                length = nodes.length,
                j = 0;                       //填充位置

            while (j < total)
            {
                for (var j1 = 0; j1 < length; j1++)
                {
                    var node = nodes[j1];
                    node.type = nodes.default_type;

                    for (var j2 = 0; j2 < fill; j2++)
                    {
                        result[j++][index] = node;
                    }
                }
            }

            fill *= length;
        }

        return result;
    };



    //处理样式 按样式属性名存储 再根据
    function handle_style(selector, style) {

        var type = selector_type(selector), //处理样式类别
            value;

        //以字符串作为选择器key(不包含属性值)
        selector.key = selector.join("");

        for (var name in style)
        {
            if (value = style[name]) //未注册的属性及未设置样式值则不处理
            {
                name = name.replace(convert_name_regex, function (_, x) {

                    return x.toUpperCase();
                });

                //复合样式进行拆分 然后丢弃
                if (name in style_split_fn)
                {
                    var values = {};
                    style_split_fn[name].call(values, value);

                    for (var key in values)
                    {
                        if (value = values[key])
                        {
                            store_style(selector, type, key, value);
                        }
                    }
                }
                else
                {
                    store_style(selector, type, name, value);
                }
            }
        }
    };


    //缓存样式
    function store_style(selector, type, name, value) {

        var weight = selector.weight || selector_weight(selector), //当前权重
            cache_name = style_cache_list[name],
            cache_type;

        if (cache_name) //已有属性
        {
            if (cache_type = cache_name[type])
            {
                while ((cache_name = cache_type[weight]) && cache_name[0].key !== selector.key) //如果选择器相等则后置优先
                {
                    weight++;
                }

                cache_type[weight] = [selector, value];
                delete cache_type.__names;
            }
            else
            {
                (cache_name[type] = {})[weight] = [selector, value];
            }
        }
        else
        {
            ((style_cache_list[name] = {})[type] = {})[weight] = [selector, value];
        }
    };


    //获取样式类别
    //类别规则: 最后一个非*元素(token + name) + 尾部连续*元素的个数
    function selector_type(selector) {

        var result, node, max = 0;

        for (var i = selector.length - 1; i >= 0; i--)
        {
            if (selector[i].token !== "*")
            {
                node = selector[i];
                break;
            }
            else
            {
                max++;
            }
        }

        result = node ? node.token + node.name : "*";

        if (max > 0)
        {
            if (all_max_level < max)
            {
                all_max_level = max;
            }

            //后面叠加": + 级别数"作为组名
            //如#id:firstchild记为#id:1, #id:firstchild:firstchild记为#id:2
            result += ":" + max;
        }

        //缓存样式类别名
        style_type_names[result] = true;

        return result;
    };


    //获取选择器的权重
    /*
    css选择器权重参考
    
    类型选择符的权重为：0001
    类选择符的权重为：0010
    通用选择符的权重为：0000
    子选择符的权重为：0000
    属性选择符的权重为：0010
    伪类选择符的权重为：0010 (此处做了特殊处理:默认为10, 其它伪类提升至11-16)
    伪元素选择符的权重为：0010
    包含选择符的权重为：包含的选择符权重值之和
    内联样式的权重为：1000
    继承的样式的权重为：0000
    */
    function selector_weight(selector) {

        var result = 0;

        for (var i = selector.length - 1; i >= 0; i--)
        {
            var node = selector[i];

            switch (node.token)
            {
                case "#":
                    result += 100;
                    break;

                case ".":
                    result += 10;
                    break;

                case "":
                    result += 1;
                    break;

                case "*":
                    if (node.name === "") //伪元素
                    {
                        result += 10;
                    }
                    break;
            }

            for (var i = 0; i < node.length; i++)
            {
                result += pseudo_keys[node[i].name] || 10;
            }
        }

        return selector.weight = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
    };






    //组合查询方法
    //注: ","组合类型已被拆分,此处不处理
    (function (check_fn) {
        
        
        //样式检测 检测指定对象是否符合当前选择器
        function check_element(element, target) {

            switch (element.token)
            {
                case "":  //类型
                    if (!(target instanceof (element.__class_type || (element.__class_type = class_list[element.name] || flyingon.Control))))
                    {
                        return false;
                    }
                    break;

                case ".": //class
                    if (!target.className || !target.className[element.name])
                    {
                        return false;
                    }
                    break;

                case "#": //id
                    if (target.id !== element.name)
                    {
                        return false;
                    }
                    break;
            }

            //再检测属性及伪类(不包含伪元素)
            var length = element.length;

            if (length > 0)
            {
                for (var i = 0; i < length; i++)
                {
                    if (element[i].check(target) === false)
                    {
                        return false;
                    }
                }
            }

            return true;
        };
        

        this[" "] = function (element, target) {

            var cache = target.__parent;

            while (cache)
            {
                if (check_fn(element, cache))
                {
                    return true;
                }

                cache = cache.__parent;
            }

            return false;
        };

        this[">"] = function (element, target) {

            return (target = target.__parent) ? this.style_check(target, true) : false;
        };

        this["+"] = function (element, target) {

            var cache = target.__parent, index;

            target = cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0 && cache[--index];
            return target ? this.style_check(target, true) : false;
        };

        this["~"] = function (element, target) {

            var cache = target.__parent, index;

            if (cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0)
            {
                for (var i = index - 1; i >= 0; i--)
                {
                    if (this.style_check(cache[i], true))
                    {
                        return true;
                    }
                }
            }

            return false;
        };
        

        //获取后一节点
        this[":before"] = function (element, target) {

            var cache = target.__parent, index;
            return (cache && (cache = cache.__children) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //获取前一节点
        this[":after"] = function (element, target) {

            var cache = target.__parent, index;
            return (cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this[":first-child"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[0] === target ? parent : false;
        };

        this[":first-of-type"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[0] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this[":last-child"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[cache.length - 1] === target ? parent : false;
        };

        this[":last-of-type"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[cache.length - 1] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this[":only-child"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length === 1 ? parent : false;
        };

        this[":only-of-type"] = function (element, target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length === 1 && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this[":nth-child"] = function (element, target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[index] === target ? parent : false;
        };

        this[":nth-of-type"] = function (element, target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[index] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this[":nth-last-child"] = function (element, target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[cache.length - index - 1] === target ? parent : false;
        };

        this[":nth-last-of-type"] = function (element, target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[cache.length - index - 1] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };


    }).call(style_type_fn, check_element);


    
    

    //计算样式
    style_class.prototype.__compute = function () {

        var types = this.__types || reset_style_types(target);

        if (this.__version !== style_version)
        {
            var target = this.__target,
                style = this.__style,
                cache_name,
                cache_type;

            for (var name in style_cache_list)
            {
                cache_name = style_cache_list[name];

                next_name:
                    for (var i = 0, length = types.length; i < length; i++)
                    {
                        if (cache_type = cache_name[types[i]])
                        {
                            var weights = cache_type.__weights || (cache_type.__weights = Object.keys(cache_type));

                            for (var j = weights.length - 1; j >= 0; j--)
                            {
                                var values = cache_type[weights[j]],
                                    selector = values[0],
                                    count = selector.length - 1;

                                while (count >= 0)
                                {
                                    //再检测属性及伪类(不包含伪元素)
                                    var length = element.length;

                                    if (length > 0)
                                    {
                                        for (var i = 0; i < length; i++)
                                        {
                                            if (element[i].check(target) === false)
                                            {
                                                return false;
                                            }
                                        }
                                    }

                                    if (check_element(selector, target))
                                    {
                                        style[name] = values[1]; //缓存并返回结果
                                        continue next_name;
                                    }
                                }
                            }
                        }
                    }
            }
        }
    };


    //重置样式类别排除无关的样式
    function reset_style_types(target) {


        var types = [],
            names = style_type_names,
            max = all_max_level,
            items,
            item,
            cache;


        //预处理伪元素
        //比如最大需处理的伪元素级别为2, 则从子到父记下需处理的控件为 [target, parent, parent_parent]
        if (max > 0)
        {
            items = [target]; //第一个元素不使用
            item = target;

            for (var i = max; i > 0; i--)
            {
                if (item = item.__parent)
                {
                    items.push(item);
                }
                else
                {
                    break;
                }
            }
        }


        //1. id伪元素
        if (max > 0)
        {
            for (var i = max; i > 0; i--)
            {
                item = items[i];

                if ((cache = item.id) && (names[cache = "#" + cache + ":" + i]))
                {
                    types.push(cache);
                }
            }
        }


        //2. id
        if ((cache = target.id) && (names[cache = "#" + cache]))
        {
            types.push(cache);
        }


        //3. class伪元素
        if (max >= 0)
        {
            for (var i = max; i > 0; i--)
            {
                item = items[i];

                if (item = item.__class_names)
                {
                    item = item.__keys;

                    for (var j = item.length - 1; j >= 0; j--) //后置优先
                    {
                        if (names[cache = "." + item[j] + ":" + i])
                        {
                            types.push(cache);
                        }
                    }
                }
            }
        }


        //4. class
        if (item = target.__class_names)
        {
            item = item.__keys;

            for (var j = item.length - 1; j >= 0; j--) //后置优先
            {
                if (names[cache = "." + item[i]])
                {
                    types.push(cache);
                }
            }
        }


        //5. type伪元素
        if (max >= 0)
        {
            for (var i = max; i > 0; i--)
            {
                item = items[i];

                if ((cache = item.__fullTypeName) && (names[cache = cache + ":" + i]))
                {
                    types.push(cache);
                }
            }
        }


        //6. type
        item = target.__class_type;

        while (item)
        {
            if (item === flyingon.Control)
            {
                if (names["*"])
                {
                    types.push("*");
                }

                break;
            }

            if (names[cache = cache.fullTypeName])
            {
                types.push(cache);
            }

            item = item.superclass;
        }


        var style = target.__style;
        style.__version = 0;

        return style.__types = types;
    };






})(flyingon);

