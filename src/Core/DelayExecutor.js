
/*
延时执行器

*/
flyingon.DelayExecutor = function (interval, fn, thisArg) {


    var timer,
        data;


    //时间间隔
    this.interval = interval;

    //注册延时执行
    this.registry = function () {

        if (timer)
        {
            clearTimeout(timer);
        }

        data = arguments;
        timer = setTimeout(this.execute, this.interval);

        return thisArg;
    };


    //立即执行
    this.execute = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;

            fn.apply(thisArg, data);
            data = null;
        };

        return thisArg;
    };


    //取消执行
    this.cancel = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
            data = null;
        }

        return thisArg;
    };

};

