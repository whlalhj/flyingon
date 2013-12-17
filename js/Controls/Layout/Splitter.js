//分隔条控件
$.class("Splitter", $.ContentControl, function (Class, $) {



    function handleMouseDown(e) {


    };

    function handleMouseMove(e) {

    };

    function handleMouseUp(e) {


    };



    Class.create = function () {

        var storage = this["x:storage"];

        storage.cursor = $.cursors["col-resize"];
        storage.dock = "left";
        storage.draggable = true;


        this.addEventListener("mousedown", handleMouseDown);
        this.addEventListener("mousemove", handleMouseMove);
        this.addEventListener("mouseup", handleMouseUp);
    };



    this.setDefaultValue("draggable", true);




    this.dragger = {

        allowdropCursor: $.cursors["col-Resize"],

        nodropCursor: $.cursors["no-drop"],

        paint: function (dragTargets) {

            var context = layer.context,
                boxModel = this["x:boxModel"],
                r = boxModel.innerRect;

            context.fillStyle = this.getStyleValue("dragColor") || "rgba(255,0,0,0.5)";
            context.fillRect(r.x, r.y, r.width, r.height);

            this.paint(context);
            this.paintBorder(context);
        },

        move: function (event, offsetX, offsetY) {

            switch (this["x:storage"].dock)
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


});

