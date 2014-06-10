(function (flyingon) {


    //滚动事件
    flyingon.ScrollEvent = function (target, originalEvent) {

        this.target = target;
        this.originalEvent = originalEvent;
    };


    (function () {

        //事件类型
        this.type = "scroll";

        //水平变化距离
        this.changeX = 0;

        //竖直变化距离
        this.changeY = 0;

    }).call(flyingon.ScrollEvent.prototype = new flyingon.Event());






    //滑块控件扩展器
    function slider_extender() {



        var timer,          //定时变更定时器
            dragger;        //拖拉者




        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);



        //当前值
        this.defineProperty("value", 0, {

            changing: flyingon.function_body(function () {

                if (value < this.minValue)
                {
                    value = this.minValue;
                }
                else if (value > this.maxValue)
                {
                    value = this.maxValue;
                }
            }),

            changed: "this.__fn_change_value(value - oldValue, false);"
        });

        //最小值
        this.defineProperty("minValue", 0, {

            attributes: "invalidate",
            changing: "if (value < 0) value = 0;",
            changed: "if (this.value < value) fields.value = value;"
        });

        //最大值
        this.defineProperty("maxValue", 100, {

            attributes: "invalidate",
            changing: "if (value < 0) value = 0;",
            changed: "if (this.value > value) fields.value = value;"
        });



        //禁止访问子控件
        this.defineProperty("children", function () {

            return null;
        });




        this.__event_mousedown = function (event) {

            if (dragger = this.__fn_mousedown(event))
            {
                this.ownerWindow.__capture_control = this.slider;

                event.stopPropagation();
                event.preventDefault();
            }
        };


        this.__event_mousemove = function (event) {

            var change;

            if (dragger && (change = this.__fn_drag_value(event, dragger) - this.value))
            {
                this.__fn_change_value(change, event);
            }
        };


        this.__event_mouseup = function (event) {

            if (timer)
            {
                clearTimeout(timer);
                timer = null;
            }

            if (dragger)
            {
                this.ownerWindow.__capture_control = null;
                dragger = null;
            }
        };


        //值改变方法
        this.__fn_change_value = function (change, event) {

            this.invalidate(false);
        };




        //定时移动至指定的位置
        this.__fn_delay_change = function (change, limit, event) {

            if (delay_change(this, change, limit, event) != limit)
            {
                var self = this;

                function fn() {

                    if (delay_change(self, change, limit, event) != limit)
                    {
                        timer = setTimeout(fn, 200);
                    }
                };

                timer = setTimeout(fn, 200);
            }
        };

        function delay_change(target, change, limit, event) {

            if (change > 0)
            {
                if (target.value + change > limit)
                {
                    change = limit - target.value;
                }
            }
            else if (change < 0)
            {
                if (target.value + change < limit)
                {
                    change = limit - target.value;
                }
            }

            return target.__fn_change_value(change, event) != limit;
        };


    };




    //滚动条基类
    flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {


        var round = Math.round;



        Class.create = function (parent, vertical) {

            var button1 = this.button1 = new flyingon.ScrollButton(),
                button2 = this.button2 = new flyingon.ScrollButton(),
                slider = this.slider = new flyingon.ScrollBlock();

            button1.first = true;

            if (vertical)
            {
                this.__fields.vertical = true;
                this.__fn_vertical(true);
            }

            (this.__children = this.__visible_items = new flyingon.ControlCollection(this)).appendRange(slider, button1, button2);

            this.__parent = parent;
            this.__additions = true;
        };



        slider_extender.call(this);



        //是否竖直滚动条
        this.defineProperty("vertical", false, {

            attributes: "rearrange",
            changed: "this.__fn_vertical(value);"
        });



        //滚动事件
        this.defineEvent("scroll");


        this.__fn_mousedown = function (event) {

            var vertical = this.vertical,
                limit = vertical ? event.controlY : event.controlX,
                change;

            if (limit < this.scroll_start)
            {
                change = -20;
                limit = 0;
            }
            else if (limit > this.scroll_end)
            {
                change = 20;
                limit = this.maxValue;
            }
            else if (limit >= this.slider_start && limit <= this.slider_end)
            {
                return this.slider.canvas_to_control(event.canvasX, event.canvasY); //返回拖动初始位置
            }
            else
            {
                change = vertical ? this.__parent.clientHeight : this.__parent.clientWidth;

                if (limit < this.slider_start)
                {
                    change = -change;
                }
                else if (limit > this.slider_end)
                {
                    limit -= this.slider_length;
                }

                limit = round((limit - this.scroll_start) * this.maxValue / this.scroll_length);
            }

            if (this.__rtl && !this.vertical) //右向顺序转换
            {
                change = -change;
                limit = this.maxValue - limit;
            }

            this.__fn_delay_change(change, limit, event);
        };


        //获取当前位置的拖动值 竖直滚动条不支持rtl
        this.__fn_drag_value = function (event, offset) {

            var vertical = this.vertical,
                maxValue = this.maxValue,
                value = vertical ? event.controlY - offset.y : event.controlX - offset.x;

            if (value <= this.scroll_start)
            {
                value = 0;
            }
            else if (value >= this.scroll_start + this.scroll_length)
            {
                value = maxValue;
            }
            else
            {
                value = round((value - this.scroll_start) * maxValue / this.scroll_length);
            }

            if (!vertical && this.__rtl) //处理右向顺序
            {
                value = maxValue - value;
            }

            return value;
        };


        //重载值改变方法触发父控件滚动事件
        this.__fn_change_value = function (change, event) {

            var fields = this.__fields,
                vertical = this.vertical,
                parent = this.__parent;

            if (event !== false) //不是直接设置value
            {
                fields.value += change;
            }

            if (parent)
            {
                event = new flyingon.ScrollEvent(event, event);

                if (vertical)
                {
                    event.changeY = change;
                    parent.contentY = fields.value;
                }
                else
                {
                    event.changeX = change;
                    parent.contentX = this.__rtl ? this.maxValue - fields.value : fields.value;
                }

                parent.dispatchEvent(event);
                parent.invalidate(false);

                //修正因滚动造成的输入符位置变更问题
                var ownerWindow = parent.ownerWindow;
                if (ownerWindow && parent.isParent(ownerWindow.__focused_control))
                {
                    ownerWindow.__fn_change_caret(event.changeX, event.changeY);
                }
            }

            return fields.value; //返加新值
        };



        //水平滚动条子控件排列
        function arrange1() {

            var button1 = this.button1,
                button2 = this.button2,
                height = this.clientHeight;

            this.scroll_start = button1.measure(height, height, 1, 1).width;
            button1.locate(0, 0, 0, height);

            this.scroll_end = this.clientWidth - button2.measure(height, height, 1, 1).width;
            button2.locate(this.scroll_end, 0, 0, height);

            this.__arrange_dirty = false;
        };

        //竖直滚动条子控件排列
        function arrange2() {

            var button1 = this.button1,
                button2 = this.button2,
                width = this.clientWidth;

            this.scroll_start = button1.measure(width, width, 1, 1).height;
            button1.locate(0, 0, width, 0);

            this.scroll_end = this.clientHeight - button2.measure(width, width, 1, 1).height;
            button2.locate(0, this.scroll_end, width, 0);

            this.__arrange_dirty = false;
        };


        //水平滚动条渲染
        function render1(painter, clear) {

            var slider = this.slider,
                height = this.clientHeight,
                scroll = this.scroll_end - this.scroll_start,
                maxValue = this.maxValue,
                length = round(scroll * scroll / maxValue),
                x;

            if (length < 20) //保证滑块不小于20
            {
                length = 20;
            }

            length = slider.measure(length, height, 1, 1).width;

            var box = slider.__fn_box_style();
            this.slider_length = (length -= box.margin_spaceX);
            this.scroll_length = scroll - length; //有效滚动区域

            if (this.__rtl) //右向顺序处理
            {
                x = round((maxValue - this.value) * this.scroll_length / maxValue) + this.scroll_start;
            }
            else
            {
                x = round(this.value * this.scroll_length / maxValue) + this.scroll_start;
            }

            this.slider_start = x;
            this.slider_end = x + length;

            box.margin_left = box.margin_right = box.margin_spaceX = 0; //忽略左边距和右边距
            slider.locate(x, 0, 0, height);

            base.render.call(this, painter, clear);
        };

        //竖直滚动条渲染
        function render2(painter, clear) {

            var slider = this.slider,
                width = this.clientWidth,
                scroll = this.scroll_end - this.scroll_start,
                maxValue = this.maxValue,
                length = round(scroll * scroll / maxValue),
                y;

            if (length < 20)
            {
                length = 20;
            }

            length = slider.measure(width, length, 1, 1).height;

            var box = slider.__fn_box_style();
            this.slider_length = (length -= box.margin_spaceY);
            this.scroll_length = scroll - length; //有效区域

            this.slider_start = y = round(this.value * this.scroll_length / maxValue) + this.scroll_start;
            this.slider_end = y + length;

            box.margin_top = box.margin_bottom = box.margin_spaceY = 0; //忽略顶边距和底边距
            slider.locate(0, y, width, 0);

            base.render.call(this, painter, clear);
        };



        //切换滚动条方向
        this.__fn_vertical = function (value) {

            this.__fn_arrange = value ? arrange2 : arrange1;
            this.render = value ? render2 : render1;
        };


        //默认绑定水平滚动条
        this.__fn_arrange = arrange1;
        this.render = render1;



    }, true);







    function extender_fn(Class) {


        Class.create = function (parent) {

            this.__parent = parent;
            this.__additions = true;
        };


        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);

        //屏蔽事件响应直接分发至父控件
        this.__event_mask = false;


        //重载排列子控件方法
        this.__fn_arrange = function () {

            this.__arrange_dirty = false;
        };


    }



    //滚动条按钮
    flyingon.defineClass("ScrollButton", flyingon.Control, function (Class, base, flyingon) {


        extender_fn.call(this, Class);


        //是否开始控件
        this.start = true;


        //绘制图像
        this.paint = function (painter) {

            var image = this.__parent.vertical ? (this.first ? "up" : "down") : (this.first ? "left" : "right");

            if (image = this.__fn_state_image("scroll-" + image))
            {
                painter.paint_image(image, this.clientX, this.clientY, this.clientWidth, this.clientHeight, "center", "middle");
            }
        };


    });



    //滚动块
    flyingon.defineClass("ScrollBlock", flyingon.Control, extender_fn);



    //滚动条拐角控件
    flyingon.defineClass("ScrollCorner", flyingon.Control, extender_fn);






    //滑块
    flyingon.defineClass("Slider", flyingon.Control, function (Class, base, flyingon) {




        slider_extender.call(this, false);




    });




    //滑动块
    flyingon.defineClass("SliderBlock", flyingon.Control, extender_fn);




})(flyingon);