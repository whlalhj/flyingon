
//内容控件
flyingon.class("ContentControl", flyingon.Control, function (Class, flyingon) {



    this.defaultValue("width", 100);

    this.defaultValue("height", 21);



    //内容控件
    this.defineProperty("content",

        function () {

            return this.__content__;
        },

        function (value) {

            var oldValue = this.__content__;

            if (oldValue != value)
            {
                var box = this.__boxModel__,
                    reset = !flyingon.__initializing__;


                if (box.children)
                {
                    box.children.length = 0;
                }
                else
                {
                    box.children = [];
                }

                if (value instanceof flyingon.Control)
                {
                    value.__boxModel__.initialize(box);
                    this.__content__ = value;

                    if (reset)
                    {
                        value.__fn_parent__(null);
                    }
                }

                if (oldValue instanceof flyingon.Control)
                {
                    box = oldValue.__boxModel__;
                    box.parent = box.offsetParent = null;
                    oldValue.__fn_parent__(null);
                }

                if (reset)
                {
                    this.dispatchEvent(new flyingon.ChangeEvent(this, "content", value, oldValue));
                    this.invalidate();
                }
            }

            return this;
        });




    //查找指定位置的控件
    this.find_control = function (x, y) {

        var content = this.__content__;

        if (content && content.hitTest(x, y))
        {
            return content.find_control ? content.find_control(x, y) : content;
        }

        return this;
    };



    this.arrange = function (clientRect) {

        this.__boxModel__.content(this.__content__);
    };



    this.serialize = function (writer) {

        flyingon.ContentControl.super.serialize.call(this, writer);
        writer.object("content", this.__content__);
    };

    this.deserialize = function (reader, data, except) {

        excludes.__content__ = true;

        flyingon.ContentControl.super.deserialize.call(this, reader, data, except);
        reader.object(this, "__content__", data.content);
    };


});

