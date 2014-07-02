/*

拖拉管理器

*/
(function (flyingon) {



    var ownerLayer,             //拖拉层

        dragTargets,            //拖动目标
        dropTarget,             //接收目标

        droppable,              //是否可放下

        start_event,            //关联的起始事件

        drag_axisX,             //x轴是否可拖动(仅dragstart事件有效)
        drag_axisY,             //y轴是否可拖动(仅dragstart事件有效)

        cursor,                 //可拖动时的鼠标状态
        no_drop_cursor;         //不可放下时鼠标样式




    //所属窗口
    this.ownerWindow = null;

    //目标控件
    this.target = null;




    //分发事件
    this.dispatchEvent = function (type, target, dom_event) {

        var event = new flyingon.DragEvent(type, this.target, dom_event, start_event);

        event.dragTargets = dragTargets;
        event.dropTarget = dropTarget;

        cursor = event.__cursor || cursor;
        no_drop_cursor = event.__no_drop_cursor || no_drop_cursor;

        return event;
    };


    //开始拖动
    this.start = function (target, dom_event) {

        //分发拖拉事件
        var event = new flyingon.DragEvent("dragstart", target, dom_event);

        //拖动目标
        event.dragTargets = [target];

        //取消则返回
        if (target.dispatchEvent(event) === false)
        {
            return false;
        }

        //设置拖动状态为准备拖动
        this.ownerWindow = target.ownerWindow;
        this.target = target;

        //关联起始事件
        start_event = dom_event;

        //获取被拖动控件集合
        dragTargets = event.dragTargets || [target];

        //创建拖拉层
        ownerLayer = this.ownerWindow.appendLayer(9999, true);

        //绘制被拖动控件到指定画布
        for (var i = 0; i < dragTargets.length; i++)
        {
            dragTargets[i].paint_to_layer(ownerLayer);
        }

        //设置画布样式
        var style = ownerLayer.dom_layer.style;

        style.overflow = "visible";
        style.opacity = event.__opacity || 0.5;

        cursor = style.cursor = event.__cursor || "move";
        no_drop_cursor = event.__no_drop_cursor || "no-drop";

        drag_axisX = event.__drag_axisX !== false;
        drag_axisY = event.__drag_axisY !== false;

        return true;
    };


    //移动
    this.move = function (dom_event) {

        var source = this.ownerWindow.fintAt(dom_event.canvasX, dom_event.__canvasY),
            target = this.target,
            style = ownerLayer.dom_layer.style;

        //如果放置目标与当前对象相同则设置当前对象的父对象为drop对象
        if (source === target)
        {
            source = target.__parent;
        }

        //如果放置目标发生变化则分发相关事件
        if (dropTarget !== source)
        {
            droppable = false;

            if (dropTarget)
            {
                this.dispatchEvent("dragleave", dropTarget, dom_event);
            }

            if (source && source.droppable)
            {
                dropTarget = source;

                if (this.dispatchEvent("dragenter", source, dom_event) !== false)
                {
                    droppable = true;
                }
            }
            else
            {
                dropTarget = source = null;
            }
        }

        //分发drag事件
        var event = this.dispatchEvent("drag", target, dom_event);

        style.cursor = droppable ? cursor : no_drop_cursor;

        if (drag_axisX)
        {
            style.left = event.distanceX + "px";
        }

        if (drag_axisY)
        {
            style.top = event.distanceY + "px";
        }

        //分发dragover事件
        if (source)
        {
            this.dispatchEvent("dragover", source, dom_event);
        }
    };


    //停止拖动
    this.stop = function (dom_event) {

        //分发drop事件
        if (droppable && dropTarget)
        {
            this.dispatchEvent("drop", dropTarget, dom_event);
        }

        //分发dragend事件
        this.dispatchEvent("dragend", this.target, dom_event);

        //移动图层
        this.ownerWindow.removeLayer(ownerLayer);

        //清空缓存对象
        ownerLayer = dragTargets = dropTarget = this.ownerWindow = this.target = null;
    };




}).call(flyingon.dragdrop = Object.create(null), flyingon);
