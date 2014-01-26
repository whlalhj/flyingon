//模板控件
flyingon.class("TemplateControl", flyingon.Control, function (Class, flyingon) {



    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        if (!this.__designMode__) //未实现
        {
            var content = this.__content__;

            if (content && content.hitTest(x, y))
            {
                return content.getControlAt ? content.getControlAt(x, y) : content;
            }
        }

        return this;
    };


    this.clearTemplate = function () {

        var content = this.__content__;
        if (content)
        {
            content.__parent__ = null;
            this.__content__ = null;
        }
    };


    this.arrange = function (boxModel, clientRect) {

        var content = this.__content__ || (this.__content__ = this.createTemplateControl(this.template));

        if (content)
        {
            boxModel.content(content);
        }
    };


});

