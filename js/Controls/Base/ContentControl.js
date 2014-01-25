
//内容控件
flyingon.class("ContentControl", flyingon.Control, function (Class, flyingon) {



    this.defaultValue("width", 100);

    this.defaultValue("height", 21);



    //内容控件
    this.defineProperty("content",

        function () {

            return this["x:content"];
        },

        function (value) {

            var oldValue = this["x:content"];

            if (oldValue != value)
            {
                if (flyingon["x:initializing"])
                {
                    this["x:content"] = value;
                }
                else
                {
                    if (oldValue instanceof flyingon.Control)
                    {
                        oldValue["y:parent"](null);
                    }

                    this["x:content"] = value;
                    this["x:boxModel"]["x:measure"] = true;
                    this.dispatchEvent(new flyingon.ChangeEvent(this, "content", parent, oldValue));

                    this.invalidate();
                }
            }

            return this;
        });




    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        var content = this["x:content"];

        if (content && content.hitTest(x, y))
        {
            return content.getControlAt ? content.getControlAt(x, y) : content;
        }

        return this;
    };


    this.arrange = function (boxModel, clientRect) {

        boxModel.content(this["x:content"]);
    };



    this.serialize = function (writer) {

        flyingon.ContentControl.super.serialize.call(this, writer);
        writer.object("content", this["x:content"]);
    };

    this.deserialize = function (reader, data) {

        flyingon.ContentControl.super.deserialize.call(this, reader, data);
        reader.object(this, "x:content", data["content"]);
    };


});

