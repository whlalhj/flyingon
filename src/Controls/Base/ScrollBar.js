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
    flyingon.slider_extender = function (vertical) {



        var timer,      //定时变更定时器
            dragger;    //拖拉者




        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);



        //当前值
        this.defineProperty("value", 0, "invalidate");

        //最小值
        this.defineProperty("minValue", 0, "invalidate");

        //最大值
        this.defineProperty("maxValue", 100, "invalidate");

        //视图尺寸
        this.defineProperty("view_size", 10, "invalidate");

        //最大变更值
        this.defineProperty("max_change", 200);

        //最小变更值
        this.defineProperty("min_change", 20);



        //禁止访问子控件
        this.defineProperty("children", function () {

            return null;
        });



        //滚动事件
        this.defineEvent("scroll");




        this.__event_mousedown = function (event) {

            if (timer)
            {
                clearTimeout(timer);
            }

            var value = this.__target, limit;

            if (value)
            {
                if (value === this.__button1)
                {
                    value = -this.min_change;
                }
                else if (value === this.__button2)
                {
                    value = this.min_change;
                }
                else //slider
                {
                    this.ownerWindow.__capture_control = this;

                    dragger = {

                        x: event.offsetX,
                        y: event.offsetY,
                        value: this.value
                    };

                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
            }
            else
            {
                //var r = this.__boxModel.clientRect;
                //value = this.vertical ? event.windowY - r.windowY : event.windowX - r.windowX;

                //if (value < this.__offset_value) //slider before
                //{
                //    limit = Math.round((value - this.thickness) * this.maxValue / this.__length_value);
                //    value = -this.max_change;
                //}
                //else  //slider after
                //{
                //    limit = Math.round((value - this.thickness - this.__slider_value) * this.maxValue / this.__length_value);
                //    value = this.max_change;
                //}
            }

            if (this.step_to(value, limit, event))
            {
                step_to_delay.call(this, value, limit, event);
            }
        };


        this.__event_mousemove = function (event) {

            if (dragger)
            {
                var offset = this.vertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                    value = Math.round(offset * this.maxValue / this.__length_value);

                if (value)
                {
                    this.step_to(0, dragger.value + value, event);
                }
            }
        };


        this.__event_mouseup = function (event) {

            if (timer)
            {
                clearTimeout(timer);
                timer = null;
            }

            this.ownerWindow.__capture_control = null;
            dragger = null;
        };



        //移动指定距离
        this.step_to = function (step, limit, originalEvent) {

            var value = this.value + step,
                length = this.maxValue - this.viewportSize;


            if (limit == null)
            {
                limit = step < 0 ? 0 : length;
            }
            else if (limit < 0)
            {
                limit = 0;
            }
            else if (limit > length)
            {
                limit = length;
            }


            if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
            {
                value = limit;
            }


            if ((step = value - this.value) === 0)
            {
                return false;
            }


            this.value = value;


            var event = new flyingon.ScrollEvent(this, originalEvent);

            if (this.vertical)
            {
                event.changeY = step;
            }
            else
            {
                event.changeX = step;
            }

            this.dispatchEvent(event);


            this.invalidate(true);

            return value !== limit;
        };


        //定时移动指定的距离
        function step_to_delay(step, limit, originalEvent) {

            var self = this,

                fn = function () {

                    clearTimeout(timer);

                    if (self.step_to(step, limit, originalEvent))
                    {
                        timer = setTimeout(fn, 200);
                    }
                };

            timer = setTimeout(fn, 200);
        };


    };


    

    //水平滚动条控件
    flyingon.defineClass("HScrollBar", flyingon.Control, function (Class, base, flyingon) {


        Class.create = function (parent) {

            var button1 = this.__button1 = new flyingon.ScrollButton(true),
                button2 = this.__button2 = new flyingon.ScrollButton(false),
                slider = this.__slider = new flyingon.ScrollSlider();

            button1.image = "scroll-left";
            button2.image = "scroll-right";

            (this.__children = this.__visible_items = new flyingon.ControlCollection(this)).appendRange(slider, button1, button2);

            this.__parent = parent;
            this.__addtions = true;
        };



        //flyingon.slider_extender.call(this);


        

        function slider_length(length) {

            if (length <= 8)
            {
                return 0;
            }

            var result = Math.round(length * this.viewportSize / this.maxValue);
            return result <= 8 ? 8 : result;
        };

        function slider_start(length, slider) {

            if (length <= 0)
            {
                return 0;
            }

            if (this.value >= this.maxValue - this.viewportSize)
            {
                return length - slider;
            }

            return Math.round(this.value * length / this.maxValue);
        };



        //重载子控件排列
        this.__fn_arrange = function () {

            var button1 = this.__button1,
                button2 = this.__button2,
                slider = this.__slider,
                width,
                height = this.clientHeight;


            //执行rtl变换
            if (this.__rtl)
            {
                width = button1.measure(height, height, 1, 1).width;
                button1.locate(this.clientWidth - width, 0, height, height);

                button2.measure(height, height, 1, 1);
                button2.locate(0, 0, height, height);

                slider.measure(height, height, 1, 1);
                slider.locate(0, 0, height, height);
            }
            else
            {
                button1.measure(height, height, 1, 1);
                button1.locate(0, 0, height, height);

                width = button2.measure(height, height, 1, 1).width;
                button2.locate(this.clientWidth - width, 0, height, height);

                slider.measure(height, height, 1, 1);
                slider.locate(0, 0, height, height);
            }

            this.__arrange_dirty = false;
        };



    });



    //水平滚动条控件
    flyingon.defineClass("VScrollBar", flyingon.Control, function (Class, base, flyingon) {


        Class.create = function (parent) {

            var button1 = this.__button1 = new flyingon.ScrollButton(true),
                button2 = this.__button2 = new flyingon.ScrollButton(false),
                slider = this.__slider = new flyingon.ScrollSlider();

            button1.image = "scroll-up";
            button2.image = "scroll-down";

            (this.__children = this.__visible_items = new flyingon.ControlCollection(this)).appendRange(slider, button1, button2);

            this.__parent = parent;
            this.__addtions = true;
        };



        //flyingon.slider_extender.call(this);

        

        //重载子控件排列
        this.__fn_arrange = function () {

            var button1 = this.__button1,
                button2 = this.__button2,
                slider = this.__slider,
                width = this.clientWidth,
                height;

            button1.measure(width, width, 1, 1);
            button1.locate(0, 0);

            height = button2.measure(width, width, 1, 1).height;
            button2.locate(0, this.clientHeight - height);

            slider.measure(width, width, 1, 1);
            slider.locate(0, 0);

            this.__arrange_dirty = false;
        };

    });




    function extender_fn(Class) {


        Class.create = function (parent) {

            this.__parent = parent;
            this.__addtions = true;
        };


        this.defaultValue("width", 16);

        this.defaultValue("height", 16);

        //禁止获取焦点
        this.defaultValue("focusable", false);

        //禁止事件响应 如不可响应事件则直接分发至父控件
        this.__dispatch_event = false;


        //重载排列子控件方法
        this.__fn_arrange = function () {

            this.__arrange_dirty = false;
        };


    }


    //滚动条按钮
    flyingon.defineClass("ScrollButton", flyingon.Control, function (Class, base, flyingon) {


        extender_fn.call(this, Class);


        //图片名
        this.image = null;


        //绘制图像
        this.paint = function (context, boxModel) {

            var image = this.__fn_state_image(this.image);

            if (image)
            {
                //var r = boxModel.clientRect;
                //context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
            }
        };


    });




    //滚动条滑块
    flyingon.defineClass("ScrollSlider", flyingon.Control, extender_fn);




    //滚动条拐角控件
    flyingon.defineClass("ScrollCorner", flyingon.Control, extender_fn);




})(flyingon);