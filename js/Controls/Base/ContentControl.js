//内容控件
$.class("ContentControl", $.Control, function ($) {



    //内容控件
    this.defineProperty("content", null, {

        getter: function () {

            return this["x:content"];
        },

        setter: function (value) {

            var oldValue = this["x:content"];

            if (oldValue != value)
            {
                if (this["x:global"].initializing)
                {
                    this["x:content"] = value;
                }
                else
                {
                    if (oldValue)
                    {
                        oldValue["fn:parent"](null);
                    }

                    if (value)
                    {
                        value["fn:parent"](this);
                    }

                    this["x:content"] = value;

                    this.dispatchEvent({

                        type: "change",
                        name: "content",
                        value: parent,
                        oldValue: oldValue
                    });
                }
            }
        }


    });




});

