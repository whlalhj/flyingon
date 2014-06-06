/// <reference path="../js/flyingon.js" />




/*
定义系统图片
*/
(function (flyingon) {


    flyingon.defineImages({


        //空白图片 找不到相关图片时显示的图片
        "blank": null,

        //窗口图标
        "window-icon": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //窗口关闭按钮
        "window-close": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时窗口关闭按钮
        "window-close-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时窗口关闭按钮
        "window-close-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //窗口最小化按钮
        "window-minimize": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时窗口最小化按钮
        "window-minimize-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时窗口最小化按钮
        "window-minimize-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //窗口最大化按钮
        "window-maximize": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时窗口最大化按钮
        "window-maximize-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时窗口最大化按钮
        "window-maximize-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",



        //向左滚动条图标
        "scroll-left": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时向左滚动条图标
        "scroll-left-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时向左滚动条图标
        "scroll-left-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //向右滚动条图标
        "scroll-right": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时向右滚动条图标
        "scroll-right-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时向右滚动条图标
        "scroll-right-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //向上滚动条图标
        "scroll-up": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时向上滚动条图标
        "scroll-up-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时向上滚动条图标
        "scroll-up-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //向下滚动条图标
        "scroll-down": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标按下时向下滚动条图标
        "scroll-down-active": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时向下滚动条图标
        "scroll-down-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",



        //选择选中图标
        "check-checked": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时选择选中图标
        "check-checked-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时选择选中图标
        "check-checked-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //选择未选中图标
        "check-unchecked": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时选择未选中图标
        "check-unchecked-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时选择未选中图标
        "check-unchecked-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //选择未知选择图标
        "check-unkown": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时选择未知选择图标
        "check-unkown-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时选择未知选择图标
        "check-unkown-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",



        //单选选中图标
        "radio-checked": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时单选选中图标
        "radio-checked-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时单选选中图标
        "radio-checked-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //单选未选中图标
        "radio-unchecked": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时单选未选中图标
        "radio-unchecked-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时单选未选中图标
        "radio-unchecked-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //单选未知选择图标
        "radio-unkown": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //捕获焦点时单选未知选择图标
        "radio-unkown-focus": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //鼠标划过时单选未知选择图标
        "radio-unkown-hover": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",



        //树收拢图标
        "tree-collapse": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw==",

        //树展开图标
        "tree-expand": "data:image/gif;base64,R0lGODlhDAAMAMQAAP//////AP8A//8AAAD//wD/AAAA/wAAAPDx9OHk6neIoIKSqJ2qu6GtvbvE0MPL1f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABAALAAAAAAMAAwAAAU+IAQhD7MszIOIUNIocNwk4xvfDQkDDuwAsJKP9+spTLEfL3ZKApYw1NBRhKV2xl8QYbvBcq2ujCYimVAqUQgAOw=="

    });


})(flyingon);







﻿/// <reference path="../js/flyingon.js" />




/*

定义样式

注1: 使用类css选择器样式字符串
注2: 子类直接继承父类控件样式
注3: 注意选择器权重(与css相仿)
注4: 伪类优先级 selection > enabled, disabled > active > hover > focus > checked 


支持的伪类如下:
    
E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素
E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素
    
E:before        E之前元素
E:after         E之后元素
    
E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:first-child           匹配父元素的第一个子元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)

*/
(function (flyingon) {




    //颜色可选值如下
    //#rrggbb                                                                           rgb颜色 与css规则相同
    //name                                                                              颜色名称 与css规则相同
    // rgb(0-255 | x%, 0-255 | x%, 0-255 | x%)                                          rgb颜色 与css规则相同
    //rgba(0-255 | x%, 0-255 | x%, 0-255 | x%, 0-1)                                     rgba颜色 与css规则相同
    // hsl(0-360, x%, x%)                                                               hsl颜色 与css规则相同
    //hsla(0-360, x%, x%, 0-1)                                                          hsla颜色 与css规则相同
    //linear(x1, y1, x2, y2, step1, color1, step2, color2[, ...])                       线性渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
    //radial(x1, y1, radius1, x2, y2, radius2, step1, color1, step2, color2[, ...])     径向渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
    //pattern(image, repeat|repeat-x|repeat-y|no-repeat)                                图像填充




    //缓存定义样式方法
    var defineStyle = flyingon.defineStyle;



    //默认样式
    defineStyle("*", {

        backgroundColor: "#AAAAAA",
        color: "#000000",
        borderColor: "blue"
    });

    //选中时控件默认样式
    defineStyle("*:checked", {

        backgroundColor: "#FFFFFF",
        borderColor: "#CCCCCC"
    });

    //获取焦点时控件默认样式
    defineStyle("*:focus", {

        borderColor: "#CCCCCC"
    });


    //捕获鼠标时控件默认样式
    defineStyle("*:hover", {

        borderColor: "#CCCCCC"
    });

    //活动状态时控件默认样式
    defineStyle("*:active", {

        borderColor: "#222222"
    });

    //禁用时控件默认样式
    defineStyle("*:disabled", {

        backgroundColor: "#444444",
        color: "#222222"
    });




    //选中文字颜色
    defineStyle(".selection-text", {

        backgroundColor: "skyblue",
        color: "white"
    });



    //横向滚动条
    defineStyle("HScrollBar", {

        padding: 1,
        backgroundColor: "silver"
    });


    //纵向滚动条
    defineStyle("VScrollBar", {

        padding: 1,
        backgroundColor: "silver"
    });


    //滚动条按钮
    defineStyle("ScrollButton", {

        width: "fill",
        height: "fill",
        backgroundColor: "#666666"
    });

    //defineStyle("ScrollButton:active", {

    //    backgroundColor: "red"
    //});

    defineStyle("ScrollButton:hover", {

        backgroundColor: "yellow"
    });


    //滚动条滑块
    defineStyle("ScrollSlider", {

        width: "fill",
        height: "fill",
        backgroundColor: "#666666",
    });

    defineStyle("ScrollSlider:active", {

        backgroundColor: "red"
    });

    defineStyle("ScrollSlider:hover", {

        backgroundColor: "yellow"
    });


    //滚动条拐角
    defineStyle("ScrollCorner", {

        width: "fill",
        height: "fill",
    });




    //内容控件样式
    defineStyle("ContentControl", {

    });



    //面板控件样式
    defineStyle("Panel", {

        overflowX: "auto",
        overflowY: "auto"
    });



    //文本框样式
    defineStyle("TextBoxBase", {

        backgroundColor: "#FFFFFF",
        border: "1 solid #CCCCCC",
        cursor: "text"
    });



    //文本框样式
    defineStyle("ListBox", {

    });



    //文本框样式
    defineStyle("Button", {

        backgroundColor: "linear(0, 0, 0, 1, 0, skyblue, 0.5, blue, 0.5, blue, 1, skyblue)",
        cursor: "pointer"
    });


    defineStyle("Window", {

    });


    defineStyle("ChildWindow", {

    });


})(flyingon);







