﻿/*

*/
(function (flyingon) {



    //控件可重载拖拉接口

    //drag_cursor:      拖动时鼠标样式
    //drag_opacity:     拖动时图层透明度

    //__fn_drag_start:  自定义开始拖动方法
    //__fn_drag_paint:  自定义拖动绘制方式
    //__fn_drag_move:   自定义拖动方式
    //__fn_drag_stop:   自定义拖停止方法




    //拖拉管理
    var Dragdrop = flyingon.Dragdrop = {};





    //局部变量
    var timer,              //定时器

        ownerWindow,        //所属窗口
        ownerLayer,         //拖拉层
        ownerControl,       //目标控件

        dragTargets,        //拖动目标
        dropTarget,         //接收目标

        dragging,           //是否正在拖动
        droppable,          //是否可放下

        start_event,        //原始事件
        last_event,         //记录最后的mousemove事件参数, 用于记录停止拖拉时的最后位置, mouseup为鼠标按下时的坐标,与需求不符
        offsetX,            //x方向因移动造成的修正距离
        offsetY;            //y方向因移动造成的修正距离




    //新建事件
    function new_event(type, original_event) {

        var result = new flyingon.DragEvent(type, ownerControl, original_event);

        result.dragTargets = dragTargets;
        result.dropTarget = dropTarget;

        return result;
    };




    //默认开始行为
    function drag_start(event) {

        //发送事件
        ownerControl.dispatchEvent(event);
    };


    //默认绘制行为
    function drag_paint(layer, dragTargets) {

        for (var i = 0; i < dragTargets.length; i++)
        {
            dragTargets[i].paint_to_layer(layer);
        }
    };

    //默认拖动行为
    function drag_move(dom_MouseEvent, offsetX, offsetY) {

        //需修正div移动偏差
        var target = ownerWindow.fintAt(dom_MouseEvent.offsetX + offsetX, dom_MouseEvent.offsetY + offsetY),
            event;

        if (target === ownerControl)
        {
            target = ownerControl.__parent;
        }

        if (dropTarget !== target)
        {
            if (dropTarget)
            {
                event = new_event("dragleave", dom_MouseEvent);
                dropTarget.dispatchEvent(event);
            }

            droppable = false;

            if (target && target.droppable)
            {
                dropTarget = target;

                event = new_event("dragenter", dom_MouseEvent);

                if (target.dispatchEvent(event))
                {
                    droppable = true;
                }
            }
            else
            {
                dropTarget = target = null;
            }

            ownerLayer.dom_layer.style.cursor = droppable ? (ownerControl.drag_cursor || "move") : "no-drop";
        }

        event = new_event("drag", dom_MouseEvent);
        ownerControl.dispatchEvent(event);

        if (target)
        {
            event = new_event("dragover", dom_MouseEvent);
            target.dispatchEvent(event);
        }
    };

    //默认停止行为
    function drag_stop(dom_MouseEvent, offsetX, offsetY) {

        if (dropTarget)
        {
            dropTarget.dispatchEvent(new_event("drop", dom_MouseEvent));
        }

        ownerControl.dispatchEvent(new_event("dragend", dom_MouseEvent));
    }




    //执行拖动
    function start() {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        }

        //拖动目标
        dragTargets = [ownerControl];

        //开始拖拉事件
        var event = new_event("dragstart", start_event);

        //是否取消
        event.canceled = false;

        //开始
        (ownerControl.__fn_drag_start || drag_start).call(ownerControl, event);

        if (!event.canceled)
        {
            if (event.dragTargets)
            {
                dragTargets = event.dragTargets;
            }

            //创建拖拉层
            var style = (ownerLayer = ownerWindow.appendLayer(9999, true)).dom_layer.style;

            style.overflow = "visible";
            style.cursor = ownerControl.drag_cursor || "move";
            style.opacity = ownerControl.drag_opacity || 0.5;

            (ownerControl.__fn_drag_paint || drag_paint).call(ownerControl, ownerLayer, dragTargets);
        }
        else
        {
            dragging = false;
        }
    };


    //开始拖动(200毫秒内保持按下鼠标则执行拖动)
    Dragdrop.start = function (window, target, dom_MouseEvent) {

        dragging = true;

        ownerWindow = window;
        ownerControl = target;
        start_event = dom_MouseEvent;

        offsetX = 0;
        offsetY = 0;

        timer = setTimeout(start, 200);
    };


    //移动
    Dragdrop.move = function (dom_MouseEvent) {

        if (!dragging)
        {
            return;
        }

        if (timer)
        {
            start();
        }

        if (ownerLayer)
        {
            var event = last_event = dom_MouseEvent;

            //div移动距离
            offsetX = event.clientX - start_event.clientX;
            offsetY = event.clientY - start_event.clientY;

            var offset = (ownerControl.__fn_drag_move || drag_move).call(ownerControl, event, offsetX, offsetY),
                style = ownerLayer.dom_layer.style;

            if (offset)
            {
                offsetX = offset.x || 0;
                offsetY = offset.y || 0;
            }

            style.left = offsetX + "px";
            style.top = offsetY + "px";

            return true;
        }

        return false;
    };



    //停止拖动, 成功取消则返回true
    Dragdrop.stop = function () {

        var result = !ownerLayer;

        //如果未执行则补上mousedown事件
        if (ownerLayer)
        {
            //如果按下且移动过且可接受拖放时才触发停止方法
            if (last_event && droppable)
            {
                (ownerControl.__fn_drag_stop || drag_stop).call(ownerControl, last_event, offsetX, offsetY);
            }

            ownerWindow.removeLayer(ownerLayer);
            ownerLayer = null;

            //处理捕获控件
            ownerWindow.__capture_delay.registry([last_event]);
        }
        else
        {
            ownerControl.dispatchEvent(new flyingon.MouseEvent("mousedown", ownerControl, start_event));
        }

        dragTargets = dropTarget = dragging = null;
        ownerWindow = ownerLayer = ownerControl = null;
        start_event = last_event = null;

        return result;
    };



})(flyingon);
