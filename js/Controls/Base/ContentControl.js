//内容控件
$.class("ContentControl", $.Control, function (Class, $) {



    //内容控件
    this.defineProperty("content", null, {

        getter: function () {

            return this["x:content"];
        },

        setter: function (value) {

            var oldValue = this["x:content"];

            if (oldValue != value)
            {
                if ($["x:initializing"])
                {
                    this["x:content"] = value;
                }
                else
                {
                    if (oldValue)
                    {
                        oldValue["y:parent"](null);
                    }

                    if (value)
                    {
                        value["y:parent"](this);
                    }

                    this["x:content"] = value;

                    this.dispatchChangeEvent("content", parent, oldValue);
                }
            }
        }

    });



    this.serialize = function (writer) {

        $.ContentControl.super.serialize.call(this, writer);

        writer.object("content", this["x:content"]);
    };

    this.deserialize = function (reader, data) {

        $.ContentControl.super.deserialize.call(this, reader, data);

        reader.object(this, "x:content", data["content"]);
    };


});

