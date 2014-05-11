
//文字控件基类
flyingon.defineClass("TextControl", flyingon.Control, function (Class, base, flyingon) {



    //当前文本布局
    this.__text_layout = null;


    //文本布局类型
    this.__text_layout_type = flyingon.single_text_layout;


    //文字内容
    this.defineProperty("text", null, {

        attributes: "measure",
        changed: "this.__text = value ? new this.__text_layout_type(value) : null;"
    });


    //行高
    this.defineProperty("lineHeight", "1.2em", "measure|style");


    //文字顺序
    //lr-tb: 从左到右 从上到下 (默认常见顺序)
    //lr-bt: 从左到右 从下到上 
    //rl-tb: 从右到左 从上到下 (如阿拉伯文等)
    //rl-bt: 从右到左 从下到上
    //tb-lr: 从上到下 从左到右
    //tb-rl: 从上到下 从右到左 (如中国古文)
    //bt-lr: 从下到上 从左到右
    //bt-rl: 从下到上 从右到左
    this.defineProperty("writingMode", "lr-tb", "measure|style");


    //文字对齐方式(仅对单行有效)
    //top:      顶部对齐
    //middle:   垂直居中对齐
    //bottom:   底部对齐
    //left:     左边对齐
    //center:   水平居中对齐
    //right:    右边对齐
    //可用逗号分隔同时设置水平及垂直对齐方式 如: "middle,center"
    this.defineProperty("textAlign", null, "measure|style");


    //字距
    this.defineProperty("letterSpacing", 0, "measure|style");

    //词距(空格调整)
    this.defineProperty("wordSpacing", 0, "measure|style");



    //字体
    this.defineProperty("font", null, {

        attributes: "measure|style",
        changed: "this.__font = new flyingon.Font(value);"
    });


    var attributes = {

        attributes: "measure|style",
        changed: "(this.__font || (this.__font = new flyingon.Font()))[name.substring(4).toLocaleLowerCase()] = value;"
    };


    //字体样式
    this.defineProperty("fontStyle", "normal", attributes);

    //字体变体 normal small-caps
    this.defineProperty("fontVariant", "normal", attributes);

    //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
    this.defineProperty("fontWeight", "normal", attributes);

    //字体大小
    this.defineProperty("fontSize", "9pt", attributes);

    //字体系列
    this.defineProperty("fontFamily", "微软雅黑,宋体,Times New Roman", attributes);




    //是否支持多行显示
    this.defineProperty("multiline", false, "measure|style");

    //多行显示时是否自动折行
    this.defineProperty("textWrap", false, "measure|style");




    //文本被选中事件
    this.defineEvent("select");

    //取消文本选中事件
    this.defineEvent("unselect");



    attributes = {

        attributes: "invalidate",
        changing: "if ((value = +value) < 0) value = 0;\nelse if (value >= fields.text.length) value = fields.text.length - 1;",
        changed: ""
    };

    //开始选中位置
    this.defineProperty("selectionStart", 0, attributes);

    //结束选中位置
    this.defineProperty("selectionEnd", 0, attributes);

    //选中文字长度(只读)
    this.defineProperty("selectionLength", function () {

        var fields = this.__fields;
        return Math.abs(fields.selectionEnd - fields.selectionStart);
    });


    //获取或设置选中文本
    this.defineProperty("selectionText", function () {

        var fields = this.__fields, start, end;

        if (fields.text && (start = fields.selectionStart) !== (end = fields.selectionEnd))
        {
            if (start > end)
            {
                start = end;
                end = fields.selectionStart;
            }

            return fields.text.substring(start, end);
        }

        return null;
    });



});