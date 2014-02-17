
//内容控件
flyingon.class("ContentControl", flyingon.Control, function (Class, flyingon) {



    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);

        //初始化子盒模型
        this.__boxModel__.children = [];
    };



    //内容控件
    this.defineProperty("content",

        function () {

            return this.__children__[0] || null;
        },

        function (value) {

            if (this.__children__[0] != value)
            {
                this.__children__.replace(0, value);
            }
        });




    //查找指定位置的控件
    this.findAt = function (x, y) {

        var content = this.__children__[0];

        if (content && content.hitTest(x, y))
        {
            return content.findAt ? content.findAt(x, y) : content;
        }

        return this;
    };



    this.arrange = function (clientRect) {

        this.__boxModel__.content(this.__children__[0]);
    };



    this.serialize = function (writer) {

        flyingon.ContentControl.super.serialize.call(this, writer);
        writer.object("content", this.__children__[0]);
    };

    this.deserialize = function (reader, data, excludes) {

        excludes.children = true;

        flyingon.ContentControl.super.deserialize.call(this, reader, data, excludes);
        reader.object(this.__children__, "0", data.content);
    };


});

