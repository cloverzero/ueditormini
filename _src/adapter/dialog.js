UE.registerUI('link',function(name){

    var me = this, currentRange, $dialog,
        opt = {
            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
            url: me.options.UEDITOR_HOME_URL + 'dialogs/' + name + '/' + name + '.js'
        };

    //加载模版数据
    utils.loadFile(document,{
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        //调整数据
        var data = UE.getWidgetData(name);
        if(data.buttons){
            var tmpObj = data.buttons.ok;
            if(tmpObj){
                opt.oklabel = tmpObj.label || me.getLang('ok');
                if(tmpObj.exec){
                    opt.okFn = $.proxy(tmpObj.exec,null,me)
                }
            }
            tmpObj = data.buttons.cancel;
            if(tmpObj){
                opt.cancellabel = tmpObj.label || me.getLang('cancel');
                if(tmpObj.exec){
                    opt.cancelFn = $.proxy(tmpObj.exec,null,me)
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.eduimodal(opt);

        $dialog.attr('id', 'edui-dialog-' + name)
            .find('.modal-body').addClass('edui-dialog-' + name + '-body');

        $dialog.css('zIndex',me.getOpt('zIndex') + 1).edui().on('beforehide',function () {
            var rng = me.selection.getRange();
            if (rng.equals(currentRange)) {
                rng.select()
            }
        }).on('beforeshow', function () {
                currentRange = me.selection.getRange();
                UE.setWidgetBody(name,$dialog,me);
            });


    });


    var $btn = $.eduibutton({
        icon: name,
        click: function () {
            if(!$dialog)
                return;
            if (!$dialog.parent()[0]) {
                me.$container.find('.edui-dialog-container').append($dialog);
            }
            $dialog.edui().show();

        },
        title: this.getLang('labelMap')[name] || ''
    });

    me.addListener('selectionchange', function () {
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
})