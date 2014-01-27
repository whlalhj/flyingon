
flyingon.class("ListControl", flyingon.TemplateControl, function (Class, flyingon) {



  

    this.__fn_create_item__ = function () {

    };

    this.clearTemplate = function () {

        var items = this.__items__,
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item.__control__;

            if (control)
            {
                item.__control__ = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (clientRect) {

        var items = this.__items__,
            children = this.__render_children__ = [],

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
                var control = item.__control__;

                if (!control)
                {
                    if (template || (template = this.template))
                    {
                        control = item.__control__ = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item.__control__ = this.__fn_create_item__();
                    }
                }


                if (control)
                {
                    control.__boxModel__.measure(0, y, width, lineHeight);

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

