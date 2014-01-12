//模板控件
flyingon.class("TemplateControl", flyingon.Control, function (Class, flyingon) {



    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        if (!this["x:designMode"]) //未实现
        {
            var content = this["x:content"];

            if (content && content.hitTest(x, y))
            {
                return content.getControlAt ? content.getControlAt(x, y) : content;
            }
        }

        return this;
    };


    this.clearTemplate = function () {

        var content = this["x:content"];
        if (content)
        {
            content["x:parent"] = null;
            this["x:content"] = null;
        }
    };


    this.arrange = function (boxModel, usableRect) {

        var content = this["x:content"] || (this["x:content"] = this.createTemplateControl(this.template));
        content && boxModel.content(content);
    };


});

