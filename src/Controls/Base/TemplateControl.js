//模板控件
flyingon.defineClass("TemplateControl", flyingon.Control, function (Class, base, flyingon) {



    //获取指定位置的控件
    this.findAt = function (x, y) {

        var items = this.__children;

        if (items && items.length > 0)
        {
            if (!this.__designMode) //未实现
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

        var items = this.__children,
            template;

        if ((!items || items.length <= 0) && (template = this.template))
        {
            items[0] = this.createTemplateControl(template)
        }

        if (items && items.length > 0)
        {
            this.__boxModel.content(items[0]);
        }
    };


});

