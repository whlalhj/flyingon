
flyingon.class("ListControl", flyingon.TemplateControl, function (Class, flyingon) {



  

    this["y:create-item"] = function () {

    };

    this.clearTemplate = function () {

        var items = this["x:items"],
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item["x:control"];

            if (control)
            {
                item["x:control"] = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (boxModel, clientRect) {

        var items = this["x:items"],
            children = this["x:render-children"] = [],

            storage = this["x:storage"],
            maxIndex = storage.maxIndex,
            itemHeight = storage.itemHeight,
            visibleIndex = storage.visibleIndex,

            y = 0,
            width = clientRect.width,
            height = clientRect.height,

            template;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            if (item.visible)
            {
                var control = item["x:control"];

                if (!control)
                {
                    if (template || (template = this.template))
                    {
                        control = item["x:control"] = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item["x:control"] = this["y:create-item"]();
                    }
                }


                if (control)
                {
                    var box = control["x:boxModel"];
                    box.measure(boxModel, 0, y, width, itemHeight);

                    children.push(control);

                    if ((y += box.height) >= height)
                    {
                        break;
                    }
                }
            }
        }
    };



});

