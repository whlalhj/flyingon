//子项
flyingon.Item = flyingon.function_extend(function (value) {

    this.value = value;

}, function () {


    //项值
    this.value = null;

    //关联控件
    this.control = null;

    //是否选中
    this.selected = false;

});

