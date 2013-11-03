/*

*/
(function ($) {



    //拖拉管理
    var Dragdrop = $.Dragdrop = {};





    //局部变量
    var dragger,            //拖拉者
        timer,              //定时器

        ownerWindow,        //所属窗口
        ownerLayer,         //拖拉层
        ownerControl,       //目标控件

        startEvent,         //原始事件
        dragTargets,        //拖动目标
        dropTarget,         //接收目标

        allowdropCursor,    //允许拖放时的光标
        nodropCursor,       //禁止拖放时的光标

        dragging,   //是否正在拖动
        lastEvent,  //记录最后的mousemove事件参数, 用于记录停止拖拉时的最后位置, mouseup为鼠标按下时的坐标,与需求不符
        offsetX,    //X方向因移动造成的修正距离
        offsetY;    //Y方向因移动造成的修正距离




    //新建事件
    function newevent(type, originalEvent) {

        var result = new $.DragEvent(type, ownerControl, originalEvent);

        result.dragTargets = dragTargets;
        result.dropTarget = dropTarget;

        return result;
    };

    //创建拖拉层
    function createLayer() {

        ownerLayer = new $.Layer();
        ownerLayer.disableGetControlAt = true;
        ownerLayer["x:storage"].clipToBounds = false;

        var style = ownerLayer.domLayer.style;

        style.overflow = "visible";
        style.cursor = dragger.allowdropCursor;
        style.opacity = dragger.opacity || 0.5;

        ownerWindow.appendLayer(ownerLayer, 9999);
    };




    //默认拖拉者
    Dragdrop.dragger = {

        //允许拖放地显示光标
        allowdropCursor: $.cursors["allow-drop"],

        //不允许拖放时显示光标
        nodropCursor: $.cursors["no-drop"],

        //透明度
        opacity: 0.5,

        //默认开始行为
        start: function (event) {

            //发送事件
            ownerControl.dispatchEvent(event);
        },

        //默认绘制行为
        paint: function (dragTargets) {

            for (var i = 0; i < dragTargets.length; i++)
            {
                var box = dragTargets[i]["x:boxModel"];

                if (box)
                {
                    box.render(layer.context);
                }
            }
        },

        //默认移动行为
        move: function (domMouseEvent, offsetX, offsetY) {

            //需修正div移动偏差
            var target = ownerWindow.getControlAt(domMouseEvent.offsetX + offsetX, domMouseEvent.offsetY + offsetY),
                event;


            if (target == ownerControl)
            {
                target = ownerControl["x:parent"];
            }


            if (dropTarget != target)
            {
                ownerLayer.domLayer.style.cursor = target == null ? nodropCursor : allowdropCursor;

                if (dropTarget)
                {
                    event = newevent("dragleave", domMouseEvent);
                    dropTarget.dispatchEvent(event);
                }


                if (target && target["x:storage"].droppable)
                {
                    dropTarget = target;

                    event = newevent("dragenter", domMouseEvent);
                    target.dispatchEvent(event);
                }
                else
                {
                    dropTarget = target = null;
                }
            }


            event = newevent("drag", domMouseEvent);
            ownerControl.dispatchEvent(event);


            if (target)
            {
                event = newevent("dragover", domMouseEvent);
                target.dispatchEvent(event);
            }
        },

        //默认停止行为
        stop: function (domMouseEvent, offsetX, offsetY) {

            if (dropTarget)
            {
                dropTarget.dispatchEvent(newevent("drop", domMouseEvent));
            }

            ownerControl.dispatchEvent(newevent("dragend", domMouseEvent));
        }

    };







    //执行拖动
    function start() {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }


        //拖动者
        dragger = ownerControl.dragger || Dragdrop.dragger;

        allowdropCursor = dragger.allowdropCursor || Dragdrop.dragger.allowdropCursor;
        nodropCursor = dragger.nodropCursor || Dragdrop.dragger.nodropCursor;


        //拖动目标
        dragTargets = [ownerControl];


        //开始拖拉事件
        var event = newevent("dragstart", startEvent);

        //是否取消
        event.canceled = false;


        //开始
        if (dragger.start)
        {
            dragger.start(event);
        }

        if (!event.canceled)
        {
            if (event.dragTargets)
            {
                dragTargets = event.dragTargets;
            }

            createLayer();
            dragger.paint.call(ownerControl, ownerLayer, dragTargets);
        }
        else
        {
            dragging = false;
        }
    };

    //开始拖动(200毫秒内保持按下鼠标则执行拖动)
    Dragdrop.start = function (window, target, domMouseEvent) {

        if (timer)
        {
            clearTimeout(timer);
        }

        dragging = true;

        ownerWindow = window;
        ownerControl = target;
        startEvent = domMouseEvent;

        offsetX = 0;
        offsetY = 0;

        timer = setTimeout(start, 200);
    };


    //移动
    Dragdrop.move = function (domMouseEvent) {

        if (!dragging)
        {
            return;
        }

        if (timer)
        {
            clearTimeout(timer);
            timer = null;

            start();
        }

        if (ownerLayer)
        {
            var event = lastEvent = domMouseEvent;

            //div移动距离
            offsetX = event.clientX - startEvent.clientX;
            offsetY = event.clientY - startEvent.clientY;

            var p = dragger.move.call(target, event, offsetX, offsetY);

            if (p)
            {
                offsetX = p.x || 0;
                offsetY = p.y || 0;
            };

            ownerLayer.domLayer.style.left = offsetX + "px";
            ownerLayer.domLayer.style.top = offsetY + "px";

            return true;
        };

        return false;
    };



    //停止拖动, 成功取消则返回true
    Dragdrop.stop = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        };

        var result = !ownerLayer;

        //如果未执行则补上mousedown事件
        if (ownerLayer)
        {
            //如果按下且移动过且可接受拖放时才触发停止方法
            if (lastEvent && ownerLayer.domLayer.style.cursor != nodropCursor)
            {
                dragger.stop.call(target, lastEvent, offsetX, offsetY);
            };

            ownerWindow.removeLayer(ownerLayer);
            ownerLayer = null;

            //处理捕获控件
            ownerWindow["x:captureDelay"].registry([lastEvent]);
        }
        else
        {
            target.dispatchEvent(new $.MouseEvent("mousedown", target, startEvent));
        };

        ownerWindow = ownerLayer = ownerControl = null;
        startEvent = lastEvent = null;
        dragger = dragTargets = dropTarget = dragging = null;

        return result;
    };



})(flyingon);
