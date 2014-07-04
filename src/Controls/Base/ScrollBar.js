
//滚动条
(function (flyingon) {



    //滚动条基类
    flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {


        var ScrollEvent = flyingon.ScrollEvent,
            round = Math.round,
            timer; //定时变更定时器


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




        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);

        //最大值
        this.maxValue = 0;



        //当前值
        this.defineProperty("value", 0, {

            minValue: 0,
            maxValue: "this.maxValue",
            change: "this.__fn_change_value(value - oldValue, false);"
        });



        //是否竖直滚动条
        this.defineProperty("vertical", false, {

            attributes: "rearrange",
            change: "this.__fn_vertical(value);"
        });


        //禁止访问子控件
        this.defineProperty("children", function () {

            return null;
        });



        //滚动事件
        this.defineEvent("scroll");





        this.__event_bubble_mousedown = function (event) {

            if (event.which === 1)
            {
                var vertical = this.vertical,
                    maxValue = this.maxValue,
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
                    to_value = maxValue;
                }
                else if (to_value < this.slider_start || to_value > this.slider_end)
                {
                    step = vertical ? this.__parent.clientHeight : this.__parent.clientWidth;

                    if (to_value < this.slider_start)
                    {
                        step = -step;
                    }
                    else
                    {
                        to_value -= this.slider_length;
                    }

                    to_value = round((to_value - this.scroll_start) * maxValue / this.scroll_length);
                }

                if (step)
                {
                    if (!vertical && this.__rtl) //右向顺序转换
                    {
                        step = -step;
                        to_value = maxValue - to_value;
                    }

                    change_to(this, step, to_value);

                    flyingon.__disable_click = flyingon.__disable_dbclick = true;
                }

                event.stopImmediatePropagation();
            }
        };


        this.__event_bubble_mousemove = function (event) {

            if (event.source === this.slider && event.mousedown && event.which === 1) //如果处于鼠标按下状态
            {
                this.__fn_moveTo(event);
            }
        };


        this.__event_bubble_mouseup = function (event) {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            }

            if (event.which === 1)
            {
                event.stopImmediatePropagation();
            }
        };

        this.__fn_moveTo = function (event) {

            var start = event.mousedown.start || (event.mousedown.start = { x: this.slider.controlX, y: this.slider.controlY }),
                vertical = this.vertical,
                maxValue = this.maxValue,
                value = vertical ? event.distanceY + start.y : event.distanceX + start.x;

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

            if (value -= this.value)
            {
                this.__fn_change_value(value, true);
                flyingon.__disable_click = flyingon.__disable_dbclick = true;
            }

            event.stopImmediatePropagation();
        };



        //重载值改变方法触发父控件滚动事件
        this.__fn_change_value = function (change_value, add_value) {

            var fields = this.__fields,
                vertical = this.vertical,
                parent = this.__parent;

            if (add_value)
            {
                fields.value += change_value;
            }

            if (parent)
            {
                var x = 0,
                    y = 0;

                if (vertical)
                {
                    y = change_value;
                    parent.__visible_y = fields.value;
                }
                else
                {
                    x = change_value;
                    parent.__visible_x = this.__rtl ? this.maxValue - fields.value : fields.value;
                }

                parent.__fn_scrollTo(parent.__visible_x, parent.__visible_y);

                parent.dispatchEvent(new ScrollEvent(parent, x, y));
                parent.invalidate(false);

                //修正因滚动造成的输入符位置变更问题

            }

            return fields.value; //返回新值
        };


        //变更值至指定值
        function change_to(target, step, to_value, delay) {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            }

            if (step > 0)
            {
                if (target.value + step > to_value)
                {
                    step = to_value - target.value;
                }
            }
            else if (step < 0)
            {
                if (target.value + step < to_value)
                {
                    step = to_value - target.value;
                }
            }

            if (step)
            {
                timer = setTimeout(function () {

                    timer = 0;

                    if (target.__fn_change_value(step, true) !== to_value)
                    {
                        change_to(target, step, to_value, 200);
                    }

                }, delay || 5);
            }
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


        //是否事件目标
        this.__event_target = false;


        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);



        //重载排列子控件方法
        this.__fn_arrange = function () {

            this.__arrange_dirty = false;
        };

    };



    //滚动条按钮
    var scroll_button = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {


        Class.create_mode = "merge";

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


        Class.create_mode = "merge";

        Class.create = function (parent, className) {

            this.__parent = parent;
            this.__fn_initialize_className("scrollbar-block", "scrollbar-block-" + className);
        };



        extender_fn.call(this);


    });



    //滚动条拐角控件
    flyingon.defineClass("ScrollCorner", flyingon.Control, function (Class, base, flyingon) {



        Class.create_mode = "merge";

        Class.create = function (parent) {

            this.__parent = parent;
        };


        extender_fn.call(this);


    });




})(flyingon);

