//分隔条控件
flyingon.class("Splitter", flyingon.ContentControl, function (Class, flyingon) {



    Class.create = function () {

        var fields = this.__fields__;
        fields.cursor = flyingon.cursors["col-resize"];
        fields.dock = "left";
        fields.draggable = true;
    };



    this.defaultValue("draggable", true);

    this.defaultValue("dock", "left");





    this.__event_mousedown__ = function (event) {


    };

    this.__event_mousemove__ = function (event) {


    };

    this.__event_mouseup__ = function (event) {


    };



    this.dragger = {

        drop_cursor: "col-Resize",

        nodrop_cursor: "no-drop",

        paint: function (context, dragTargets) {

            var boxModel = this.__boxModel__,
                r = boxModel.clientRect;

            context.fillStyle = "rgba(255,0,0,0.5)";
            context.fillRect(r.x, r.y, r.width, r.height);

            this.paint(context, boxModel);
            this.paint_border(context, boxModel);
        },

        move: function (event, offsetX, offsetY) {

            switch (this.dock)
            {
                case "left":
                case "right":
                    return { x: offsetX, y: 0 };

                case "top":
                case "bottom":
                    return { x: 0, y: offsetY };
            }
        },

        stop: function (event, offsetX, offsetY) {

        }

    };


}, true);

