
//滚动条及滑块
(function (flyingon) {


    //滚动事件
    (flyingon.ScrollEvent = function (target, original_event) {

        this.target = target;
        this.original_event = original_event;

    }).prototype = flyingon.Event.prototype;


    (function () {

        //事件类型
        this.type = "scroll";

        //水平变化距离
        this.changeX = 0;

        //竖直变化距离
        this.changeY = 0;

    }).call(flyingon.ScrollEvent.prototype);






    //滑块控件扩展器
    function slider_extender() {



        var timer,                  //定时变更定时器
            dragger;                //拖拉者




        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);



        //当前值
        this.defineProperty("value", 0, {

            minValue: "this.minValue",
            maxValue: "this.maxValue",
            change: "this.__fn_change_value(value - oldValue, false);"
        });

        //最小值
        this.defineProperty("minValue", 0, {

            attributes: "invalidate",
            minValue: 0,
            change: "if (this.value < value) fields.value = value;"
        });

        //最大值
        this.defineProperty("maxValue", 100, {

            attributes: "invalidate",
            minValue: 1,
            change: "if (this.value > value) fields.value = value;"
        });



        //禁止访问子控件
        this.defineProperty("children", function () {

            return null;
        });




        this.__event_bubble_mousedown = function (event) {

            if (event.button === 0 && (dragger = this.__fn_mousedown(event)))
            {
                flyingon.__capture_control = this.slider;
                event.stopImmediatePropagation();
            }
        };


        this.__event_bubble_mousemove = function (event) {

            if (dragger)
            {
                var value = this.__fn_drag_value(dragger, event),
                    step = value - this.value;

                if (step)
                {
                    this.__fn_change_value_to(step, value, event);
                }

                event.stopImmediatePropagation();
            }
        };


        this.__event_bubble_mouseup = function (event) {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            }

            if (dragger)
            {
                event.stopImmediatePropagation();
                dragger = null;
            }
        };


        //值改变方法
        this.__fn_change_value = function (change, event) {

            this.invalidate(false);
        };



        //变更值至指定值
        this.__fn_change_value_to = function (step, to_value, event, delay) {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            }

            if (step > 0)
            {
                if (this.value + step > to_value)
                {
                    step = to_value - this.value;
                }
            }
            else if (step < 0)
            {
                if (this.value + step < to_value)
                {
                    step = to_value - this.value;
                }
            }

            if (step)
            {
                var self = this;

                timer = setTimeout(function () {

                    timer = 0;

                    if (self.__fn_change_value(step, event) !== to_value)
                    {
                        self.__fn_change_value_to(step, to_value, event, 200);
                    }

                }, delay || 5);
            }
        };


    };




    //滚动条基类
    flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {


        var round = Math.round;



        Class.create = function (parent, vertical) {

            this.__parent = parent;
            this.__additions = true;

            var name;

            if (vertical)
            {
                name = "y";
                this.__fields.vertical = true;
            }
            else
            {
                name = "x";
            }

            //添加.scrollbar-x或.scrollbar-y className
            this.__fn_initialize_className("scrollbar-" + name);

            this.__visible_items = [
                this.button1 = new scroll_button(this, name, true),
                this.button2 = new scroll_button(this, name),
                this.slider = new scroll_block(this, name)];
        };



        slider_extender.call(this);



        //是否竖直滚动条
        this.defineProperty("vertical", false, {

            attributes: "rearrange",
            change: "this.__fn_vertical(value);"
        });



        //滚动事件
        this.defineEvent("scroll");


        this.__fn_mousedown = function (event) {

            var vertical = this.vertical,
                to_value = vertical ? event.controlY : event.controlX,
                step;

            if (to_value < this.scroll_start)
            {
                step = -20;
                to_value = 0;
            }
            else if (to_value > this.scroll_end)
            {
                step = 20;
                to_value = this.maxValue;
            }
            else if (to_value >= this.slider_start && to_value <= this.slider_end)
            {
                return this.slider.canvas_to_control(event.canvasX, event.canvasY); //返回拖动初始位置
            }
            else
            {
                step = vertical ? this.__parent.clientHeight : this.__parent.clientWidth;

                if (to_value < this.slider_start)
                {
                    step = -step;
                }
                else if (to_value > this.slider_end)
                {
                    to_value -= this.slider_length;
                }

                to_value = round((to_value - this.scroll_start) * this.maxValue / this.scroll_length);
            }

            if (this.__rtl && !this.vertical) //右向顺序转换
            {
                step = -step;
                to_value = this.maxValue - to_value;
            }

            this.__fn_change_value_to(step, to_value, event);
        };


        //获取当前位置的拖动值 竖直滚动条不支持rtl
        this.__fn_drag_value = function (start, event) {

            var vertical = this.vertical,
                maxValue = this.maxValue,
                value = vertical ? event.controlY - start.y : event.controlX - start.x;

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
        this.__fn_change_value = function (change_value, event) {

            var fields = this.__fields,
                vertical = this.vertical,
                parent = this.__parent;

            if (event !== false) //不是直接设置value
            {
                fields.value += change_value;
            }

            if (parent)
            {
                var scroll = new flyingon.ScrollEvent(parent, event);

                if (vertical)
                {
                    scroll.changeY = change_value;
                    parent.__visible_y = fields.value;
                }
                else
                {
                    scroll.changeX = change_value;
                    parent.__visible_x = this.__rtl ? this.maxValue - fields.value : fields.value;
                }

                parent.__fn_scrollTo(parent.__visible_x, parent.__visible_y);

                parent.dispatchEvent(scroll, true);
                parent.invalidate(false);

                //修正因滚动造成的输入符位置变更问题

            }

            return fields.value; //返回新值
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
                length = round(scroll * scroll / this.__parent.contentWidth),
                x;

            if (length < 20) //保证滑块不小于20
            {
                length = 20;
            }

            this.slider_length = length = slider.measure(length, height, 1, 1).width;
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
            this.slider_end = slider.locate(x, 0, 0, height).x;

            base.render.call(this, painter, clear);
        };

        //竖直滚动条渲染
        function render2(painter, clear) {

            var slider = this.slider,
                width = this.clientWidth,
                scroll = this.scroll_end - this.scroll_start,
                maxValue = this.maxValue,
                length = round(scroll * scroll / this.__parent.contentHeight),
                y;

            if (length < 20)
            {
                length = 20;
            }

            this.slider_length = length = slider.measure(width, length, 1, 1).height;
            this.scroll_length = scroll - length; //有效区域

            this.slider_start = y = round(this.value * this.scroll_length / maxValue) + this.scroll_start;
            this.slider_end = slider.locate(0, y, width, 0).y;

            base.render.call(this, painter, clear);
        };



        this.render = function (painter, clear) {

            if (this.vertical)
            {
                if (this.__arrange_dirty)
                {
                    arrange2.call(this);
                }

                render2.call(this, painter, clear);
            }
            else
            {
                if (this.__arrange_dirty)
                {
                    arrange1.call(this);
                }

                render1.call(this, painter, clear);
            }
        };


    });







    function extender_fn() {


        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);



        //转移(事件,使区域无效)至父控件
        this.__fn_transfer_to_parent();




        //重载排列子控件方法
        this.__fn_arrange = function () {

            this.__arrange_dirty = false;
        };

    };



    //滚动条按钮
    var scroll_button = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {


        Class.combine_create = true;

        Class.create = function (parent, className, first) {

            this.__parent = parent;
            this.__fn_initialize_className("scrollbar-button", "scrollbar-button-" + className);

            this.first = first;
        };



        extender_fn.call(this);


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
    var scroll_block = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {


        Class.combine_create = true;

        Class.create = function (parent, className) {

            this.__parent = parent;
            this.__fn_initialize_className("scrollbar-block", "scrollbar-block-" + className);
        };



        extender_fn.call(this);


    });



    //滚动条拐角控件
    flyingon.defineClass("ScrollCorner", flyingon.Control, function (Class, base, flyingon) {



        Class.combine_create = true;

        Class.create = function (parent) {

            this.__parent = parent;
        };



        extender_fn.call(this);


    });






    //滑块
    flyingon.defineClass("Slider", flyingon.Control, function (Class, base, flyingon) {




        slider_extender.call(this, false);




    }, true);




    //滑动块
    var slider_block = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {


        Class.combine_create = true;

        Class.create = function (parent) {

            this.__parent = parent;
        };



        extender_fn.call(this);


    });




})(flyingon);

