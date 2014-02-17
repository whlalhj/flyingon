//模板控件
flyingon.class("TemplateControl", flyingon.Control, function (Class, flyingon) {



    //获取指定位置的控件
    this.findAt = function (x, y) {

        var items = this.__children__;

        if (items && items.length > 0)
        {
            if (!this.__designMode__) //未实现
            {
                var content = items[0];

                if (content && content.hitTest(x, y))
                {
                    return content.findAt ? content.findAt(x, y) : content;
                }
            }
        }

        return this;
    };

    this.arrange = function (clientRect) {

        var items = this.__children__,
            template;

        if ((!items || items.length <= 0) && (template = this.template))
        {
            items[0] = this.createTemplateControl(template)
        }

        if (items && items.length > 0)
        {
            this.__boxModel__.content(items[0]);
        }
    };


});

