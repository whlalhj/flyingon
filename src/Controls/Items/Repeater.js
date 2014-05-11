
flyingon.defineClass("Repeater", flyingon.TemplateControl, function (Class, base, flyingon) {



  

    this.__fn_create_item = function () {

    };

    this.clearTemplate = function () {

        var items = this.__items,
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item.__control;

            if (control)
            {
                item.__control = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (clientRect) {

        var items = this.__items,
            children = this.__render_children = [],

            maxIndex = this.maxIndex,
            lineHeight = this.lineHeight,
            visibleIndex = this.visibleIndex,

            y = 0,
            width = clientRect.width,
            height = clientRect.height,

            template;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            if (item.visible)
            {
                var control = item.__control;

                if (!control)
                {
                    if (template || (template = this.template))
                    {
                        control = item.__control = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item.__control = this.__fn_create_item();
                    }
                }


                if (control)
                {
                    control.__boxModel.measure(0, y, width, lineHeight);

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

