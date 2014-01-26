
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
                if (flyingon.__initializing__)
                {
                    this.__content__ = value;
                }
                else
                {
                    if (oldValue instanceof flyingon.Control)
                    {
                        oldValue.__fn_parent__(null);
                    }

                    this.__content__ = value;
                    this.__boxModel__.__measure__ = true;
                    this.dispatchEvent(new flyingon.ChangeEvent(this, "content", parent, oldValue));

                    this.invalidate();
                }
            }

            return this;
        });




    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        var content = this.__content__;

        if (content && content.hitTest(x, y))
        {
            return content.getControlAt ? content.getControlAt(x, y) : content;
        }

        return this;
    };


    this.arrange = function (boxModel, clientRect) {

        boxModel.content(this.__content__);
    };



    this.serialize = function (writer) {

        flyingon.ContentControl.super.serialize.call(this, writer);
        writer.object("content", this.__content__);
    };

    this.deserialize = function (reader, data) {

        flyingon.ContentControl.super.deserialize.call(this, reader, data);
        reader.object(this, "__content__", data["content"]);
    };


});

