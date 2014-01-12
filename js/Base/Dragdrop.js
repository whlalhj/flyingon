/*

*/
(function (flyingon) {



    //拖拉管理
    var Dragdrop = flyingon.Dragdrop = {};





    //局部变量
    var dragger,            //拖拉者
        timer,              //定时器

        ownerWindow,        //所属窗口
        ownerLayer,         //拖拉层
        ownerControl,       //目标控件

        dragTargets,        //拖动目标
        dropTarget,         //接收目标

        allowdropCursor,    //允许拖放时的光标
        nodropCursor,       //禁止拖放时的光标

        dragging,   //是否正在拖动
        start_event,         //原始事件
        last_event,  //记录最后的mousemove事件参数, 用于记录停止拖拉时的最后位置, mouseup为鼠标按下时的坐标,与需求不符
        offsetX,    //X方向因移动造成的修正距离
        offsetY;    //Y方向因移动造成的修正距离




    //新建事件
    function new_event(type, originalEvent) {

        var result = new flyingon.DragEvent(type, ownerControl, originalEvent);

        result.dragTargets = dragTargets;
        result.dropTarget = dropTarget;

        return result;
    };

    //创建拖拉层
    function createLayer() {

        ownerLayer = new flyingon.Layer();
        ownerLayer.disableGetControlAt = true;
        ownerLayer["x:storage"].clipToBounds = false;

        var style = ownerLayer.domLayer.style;

        style.overflow = "visible";
        style.cursor = dragger.allowdropCursor;
        style.opacity = dragger.opacity || 0.5;

        ownerWindow.appendLayer(9999, ownerLayer);
    };




    //默认拖拉者
    Dragdrop.dragger = {

        //允许拖放地显示光标
        allowdropCursor: flyingon.cursors["allow-drop"],

        //不允许拖放时显示光标
        nodropCursor: flyingon.cursors["no-drop"],

        //透明度
        opacity: 0.5,

        //默认开始行为
        start: function (event) {

            //发送事件
            ownerControl.dispatchEvent(event);
        },

        //默认绘制行为
        paint: function (context, dragTargets) {

            for (var i = 0; i < dragTargets.length; i++)
            {
                var box = dragTargets[i]["x:boxModel"];
                box && box.render(context);
            }
        },

        //默认移动行为
        move: function (domMouseEvent, offsetX, offsetY) {

            //需修正div移动偏差
            var target = ownerWindow.getControlAt(domMouseEvent.offsetX + offsetX, domMouseEvent.offsetY + offsetY),
                event;


            target == ownerControl && (target = ownerControl["x:parent"]);

            if (dropTarget != target)
            {
                ownerLayer.domLayer.style.cursor = target == null ? nodropCursor : allowdropCursor;

                if (dropTarget)
                {
                    event = new_event("dragleave", domMouseEvent);
                    dropTarget.dispatchEvent(event);
                }


                if (target && target["x:storage"].droppable)
                {
                    dropTarget = target;

                    event = new_event("dragenter", domMouseEvent);
                    target.dispatchEvent(event);
                }
                else
                {
                    dropTarget = target = null;
                }
            }


            event = new_event("drag", domMouseEvent);
            ownerControl.dispatchEvent(event);


            if (target)
            {
                event = new_event("dragover", domMouseEvent);
                target.dispatchEvent(event);
            }
        },

        //默认停止行为
        stop: function (domMouseEvent, offsetX, offsetY) {

            dropTarget && dropTarget.dispatchEvent(new_event("drop", domMouseEvent));
            ownerControl.dispatchEvent(new_event("dragend", domMouseEvent));
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
        var event = new_event("dragstart", start_event);

        //是否取消
        event.canceled = false;


        //开始
        dragger.start && dragger.start(event);


        if (!event.canceled)
        {
            event.dragTargets && (dragTargets = event.dragTargets);

            createLayer();
            dragger.paint.call(ownerControl, ownerLayer.context, dragTargets);
        }
        else
        {
            dragging = false;
        }
    };

    //开始拖动(200毫秒内保持按下鼠标则执行拖动)
    Dragdrop.start = function (window, target, domMouseEvent) {

        timer && clearTimeout(timer);

        dragging = true;

        ownerWindow = window;
        ownerControl = target;
        start_event = domMouseEvent;

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
            var event = last_event = domMouseEvent;

            //div移动距离
            offsetX = event.clientX - start_event.clientX;
            offsetY = event.clientY - start_event.clientY;

            var offset = dragger.move.call(ownerControl, event, offsetX, offsetY);

            if (offset)
            {
                offsetX = offset.x || 0;
                offsetY = offset.y || 0;
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
            if (last_event && ownerLayer.domLayer.style.cursor != nodropCursor)
            {
                dragger.stop.call(ownerControl, last_event, offsetX, offsetY);
            };

            ownerWindow.removeLayer(ownerLayer);
            ownerLayer = null;

            //处理捕获控件
            ownerWindow["x:captureDelay"].registry([last_event]);
        }
        else
        {
            ownerControl.dispatchEvent(new flyingon.MouseEvent("mousedown", ownerControl, start_event));
        };

        ownerWindow = ownerLayer = ownerControl = null;
        start_event = last_event = null;
        dragger = dragTargets = dropTarget = dragging = null;

        return result;
    };



})(flyingon);
