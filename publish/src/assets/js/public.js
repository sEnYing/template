import Base64 from '@/assets/js/base64'

// 全局构造类
let pubfunc={};

// 存储本地存储
pubfunc.setLStorage=function(key,val,encode){
    typeof val==='object'?val=JSON.stringify(val):null;
    encode?val=pubfunc.encode(val):null; //encode 是否加密
    window.localStorage.setItem(key,val);
};
// 获取本地存储，如果存在第二个参数则转换成JSON
pubfunc.getLStorage=function(key,flag){
    return flag?JSON.parse(window.localStorage.getItem(key)):window.localStorage.getItem(key);
};
// 删除本地存储
pubfunc.delLStorage=function(key){
    window.localStorage.removeItem(key);
};
// 清空本地存储
pubfunc.clearLStorage=function(){
    window.localStorage.clear();
};
// 存储本地存储
pubfunc.setSStorage=function(key,val,encode){
    typeof val==='object'?val=JSON.stringify(val):null;
    encode?val=pubfunc.encode(val):null; //encode 是否加密
    window.sessionStorage.setItem(key,val);
};
// 获取本地存储，如果存在第二个参数则转换成JSON
pubfunc.getSStorage=function(key,flag){
    return flag?JSON.parse(window.sessionStorage.getItem(key)):window.sessionStorage.getItem(key);
};
// 删除本地存储
pubfunc.delSStorage=function(key){
    window.sessionStorage.removeItem(key);
};
// 清空本地存储
pubfunc.clearSStorage=function(){
    window.sessionStorage.clear();
};
// cookie存储
pubfunc.setCookie=function(cname,cvalue,exdays){
    // console.log(cname,cvalue,exdays)
    var expires;
    if(exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        expires = "expires="+d.toGMTString();
    }
    document.cookie = cname + "=" + cvalue + (exdays?("; " + expires):'')+ ";path=/";
}
// cookie获取
pubfunc.getCookie=function(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
// cookie删除
pubfunc.delCookie = function (name) {
    pubfunc.setCookie(name, ' ', -1);
};
// cookie清空
pubfunc.clearCookie = function (name) {
    let date=new Date();
    date.setTime(date.getTime()-10000);
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i =  keys.length; i--;)
          document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
    }
};
//生成随机字符串
pubfunc.makeRandom = function (len, type) {
    var text = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var possible;
    if (type == "num") {
        possible = "0123456789";
    } else if (type == "str" || !type) {
        possible = str;
    } else if (type == "all") {
        possible = str + "0123456789";
    }
    for (var i = 0; i < len; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
// 获取当前时间/时间戳
pubfunc.getTimeNum = function (j) {
    return j?new Date():(new Date()).valueOf();
};

// 时间戳转换为时间
pubfunc.timestampToTime=function(timestamp) {
    timestamp?(timestamp=typeof timestamp=='string'?pubfunc.timeToTimestamp(timestamp):(timestamp).valueOf()):timestamp=pubfunc.getTimeNum();
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
    let h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours());
    let m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    let w = date.getDay();
    return {
        Year:Y,
        Month:M,
        Day:D,
        Hour:h,
        Minite:m,
        Second:s,
        Week:w
    };
};
// 上下午时间
pubfunc.transTime=function(time,en){
    if(time){
        let timeArr=time.split(':')
        timeArr[0]=(Number(timeArr[0])>12?(en?(Number(timeArr[0]-12)+(en==='small'?'pm':'PM')):('下午 '+Number(timeArr[0]-12))):(en?(timeArr[0]+(en==='small'?'am':'AM')):('上午 '+timeArr[0])));
        return timeArr.join(':')
    }
    return time
};
// 时间格式化
pubfunc.TimeTransform=function(type,addtime,updatetime){
    if(!addtime&&!updatetime){
        addtime=pubfunc.getTimeNum();
    }
    let time;
    if(updatetime&&updatetime!=null&&updatetime!=''){
        time=updatetime;
    }else{
        time=addtime;
    }
    if(type){
        let time_trans,NewTime;
        // console.log(NewTime)
        type==='差值'?null:NewTime=pubfunc.timestampToTime(time);
        switch(type){
            case '区间' : let UntilTime=Math.round(parseInt(Number(pubfunc.getTimeNum())/1000-Number(time))/3600);
                if(UntilTime==0){
                    let UntilT=parseInt(60*(Number(pubfunc.getTimeNum())/1000-Number(time))/3600);
                    UntilT=UntilT==0?1:UntilT;
                    time_trans=UntilT+'分钟前';
                }else if(UntilTime<24){
                    time_trans=UntilTime+'小时前';
                }else if(UntilTime<48){
                    time_trans='1天前';
                }else if(UntilTime<72){
                    time_trans='2天前';
                }else{
                    time_trans=NewTime.Year+'年'+NewTime.Month+'月'+NewTime.Day+'日 '+NewTime.Hour+':'+NewTime.Minite;
                }
                break;
            case '差值':
                if(!addtime||!updatetime){
                    return ''
                }
                let j=false;
                addtime=typeof addtime=='string'?pubfunc.timeToTimestamp(addtime):(addtime).valueOf();
                updatetime=typeof updatetime=='string'?pubfunc.timeToTimestamp(updatetime):(updatetime).valueOf();
                time=(updatetime-addtime)/1000;
                time<0?(time=-time,j=true):null;
                let d=24*60*60,h=60*60,m=60;
                let day=Math.floor(time/d),
                    hour=Math.floor(time%d/h),
                    minite=Math.floor(((time%d)%h)/m),
                    second=Math.floor(((time%d)%h)%m);
                // console.log(day,hour,minite,second)
                time_trans={day,hour,minite,second}
                // time_trans=day?
                // (day+'天'+(hour?(hour+'小时'):'1小时')):
                // ((hour?(hour<10?('0'+hour):hour):'00')+':'+(minite?(minite<10?('0'+minite):minite):'00')+':'+(second?(second<10?('0'+second):second):'01'));
                time_trans=(day?(day+'天'):'')+((hour?(hour+'小时'):'')+(minite?(minite+'分'):''));
                j?time_trans='-'+time_trans:null;
                break;
            default:
                type=type.replace('YYYY',NewTime.Year);
                type=type.replace('YY',NewTime.Year.toString().slice(2,4));
                type=type.replace('MM',NewTime.Month);
                type=type.replace('DD',NewTime.Day);
                type=type.replace('hh',NewTime.Hour);
                type=type.replace('mm',NewTime.Minite);
                type=type.replace('ss',NewTime.Second);
                let week=['日','一','二','三','四','五','六'];
                let weekTxt=NewTime.Week||NewTime.Week===0?week[Number(NewTime.Week)]:''
                type=type.replace('W',weekTxt);
                return type
        }
        return time_trans;
    }
    return addtime;
};
// 时间转换为时间戳
pubfunc.timeToTimestamp=function(value){
    var time=null;
    if(value!==''&&value!==null){
        value=value.toString();
        value=value.split('/').join(',');
        value=value.split(' ').join(',');
        value=value.split('-').join(',');
        value=value.split(':').join(',');
        var arr=value.split(',');
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] == null) {
                arr.splice(i,1);
                i--;
            }
        }
        time=new Date(arr[0],(arr[1]-1),arr[2],(arr[3]?arr[3]:0),(arr[4]?arr[4]:0),(arr[5]?arr[5]:0));
        time=time.valueOf();
    }
    return time;
}
// 本年第几周
pubfunc.getWeekOfYear=function(today){
    var today = today?new Date(pubfunc.timeToTimestamp(today)):new Date();
    var firstDay = new Date(today.getFullYear(),0, 1);
    var dayOfWeek = firstDay.getDay(); 
    var spendDay= 1;
    if (dayOfWeek !=0) {
      spendDay=7-dayOfWeek+1;
    }
    firstDay = new Date(today.getFullYear(),0, 1+spendDay);
    var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
    var result =Math.ceil(d/7);
    return result+1;
};
// 判定class
pubfunc.JudgeClass=function(el,name){
    var e = el || window.event || arguments[0];
    var elme = e.target || e.srcElement;
    var className = [];
    var getclass=function(){
        if(elme.classList&&elme.classList.length>0){
            className.push(elme.classList)
        }
        if(elme.parentElement||elme.parentNode){
            elme=elme.parentElement||elme.parentNode;
            getclass();
        }
    }
    getclass();
    if(name){
        let names=name.split(',')
        for(var i=0;i<className.length;i++){
            for(var j=0;j<className[i].length;j++){
                if(names.indexOf(className[i][j])>-1){
                    return true;
                }
            }
        }
    }
    return false;
}

//获取字符串长度
pubfunc.getByteLen=function(val,char){
    var len = 0;
    if(val){
        val=val.toString();
        if(!char){char=2;}else{char=Number(char);}
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += char;
            }
            else {
                len += 1;
            }
        }
    }
    // console.log(len)
    return len;
};

//替换
pubfunc.replaceSpace=function(val,type){
    // type 不传返回val去头尾空格,  1 返回去除所有空格, 2 返回去头尾空格 文字间多个空格只保留一个
    if(val){
        val=val.toString();
        if(type){
            switch(type){
                case 1: return val.replace(/\s/g, '');
                case 2: var text=val.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s\s*/g, ' ');
                    return text;
            }
        }
        return val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }else{
        return '';
    }
};
pubfunc.replaceBr=function(val,type){
    // type 不传无变化,  1 替换val中回车为html的<br/> 空格为html的&bsp,  2 替换为段落,  3 回车替换为空格,  4 清除回车空格返回纯文本
    if(val){
        val=val.toString();
        switch(type){
            case 1: return val.replace(/\r\n/g,"<br/>").replace(/\n/g,"<br/>").replace(/\r/g,"<br/>").replace(/\s/g,"&nbsp;");
            case 2: return "<p>"+val.replace(/\r\n/g,"</p><p>").replace(/\n/g,"</p><p>").replace(/\r/g,"</p><p>").replace(/\s/g,"&nbsp;")+"</p>";
            case 3: return val.replace(/\r\n/g,' ').replace(/\n/g,' ').replace(/\r/g,' ');
            case 4: return val.replace(/\r\n/g,'').replace(/\n/g,'').replace(/\r/g,'').replace(/\s/g,'');
            default: return val;
        }
    }else{
        return '';
    }
};
pubfunc.replacePhone=function(val){
    return val?val.toString().replace(/[^0-9-]/g, ''):'';
}
// 验证手机号
pubfunc.judgePhone=function(val){
    let reg=/^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    return reg.test(val);
}
// 返回价格
pubfunc.transformPrice=function(price,judge){
    if(!price&&price!==0){return '';}
    price=price.toString().replace(/[^0-9.]/g, "");
    var price1;
    var arr=price.split(".");
    if(arr.length>1){
        price1=arr[0]+'.'+arr[1].substr(0,2);
        // console.log(arr[2])
    }else{
        price1=price;
    }
    var shortPrice=function(val){
        return val?val.toString().substr(0,12):val;
    };
    var setPoint=function(n){
        // console.log(n.toLocaleString())
        let nString=n.toLocaleString();
        let nStringArr=nString.split('.'),nFront=[];
        let nChange=nStringArr[0].split(',').join('');
        for(let i=0;i<nChange.length/3;i++){
            nFront.splice(0,0,nChange.slice((nChange.length-(i+1)*3)>0?(nChange.length-(i+1)*3):0,nChange.length-i*3))
        }
        return nFront.join(',')+(nFront.length>0?('.'+(nStringArr.length>1&&Number(nStringArr[1])?(nStringArr[1].toString().length<2?(nStringArr[1]+'0'):nStringArr[1]):'00')):'')
    }
    if(judge===true&&Number(price1)>1000000000000){
        // 提示 金额过长，已为您缩短到12位之内
        console.log('金额过长，已为您缩短到12位之内')
    }
    return judge?setPoint(judge===true?shortPrice(price1):price1):shortPrice(price1);
};
// 万元
pubfunc.getSmallPrice=function(v){
    v=Number(v);
    let int=Math.round(v/10000);
    return Number(int<10?
    (Math.floor(v/10000)+(Math.round((v-Math.floor(v/10000)*10000)/100)>0?
    ('.'+(
        Math.round((v-Math.floor(v/10000)*10000)/100)<10?
        ('0'+Math.round((v-Math.floor(v/10000)*10000)/100)):
        Math.round((v-Math.floor(v/10000)*10000)/100)))
    :'')):
    (int<100?
        (Math.floor(v/10000)+(Math.round((v-Math.floor(v/10000)*10000)/1000)>0?('.'+Math.round((v-Math.floor(v/10000)*10000)/1000)):'')):
        int))
}

// base64加密解密
pubfunc.encode=function(v){
    v=typeof v==='object'?JSON.stringify(v):v;
    v=Base64.enc.Utf8.parse(v);
    v=Base64.enc.Base64.stringify(v);
    return v
}
pubfunc.decode=function(v){
    v = Base64.enc.Base64.parse(v);
    v = v.toString(Base64.enc.Utf8);
    try{
        let nv=JSON.parse(v);
        typeof nv==='object'?v=nv:null;
    }catch(e){
        v=v;
    }
    return v;
}
// 获取localStorage并解码
pubfunc.getInfo=function(key){
    let token=pubfunc.getLStorage(key);
    token=token?pubfunc.decode(token):token;
    return token?token:false;
}

// 获取el位置
pubfunc.getClientRect=function (element){
    var bcr;
    //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
    try{
        bcr = element.getBoundingClientRect();
    }catch(e){
        bcr={left:0,top:0,height:0,width:0}
    }
    var rect = {
        left: Math.round(bcr.left),
        top: Math.round(bcr.top),
        height: Math.round(bcr.bottom - bcr.top),
        width: Math.round(bcr.right - bcr.left)
    };
    var doc;
    while ((doc = element.ownerDocument) !== document &&
        (element = pubfunc.getWindow(doc).frameElement)) {
        bcr = element.getBoundingClientRect();
        rect.left += bcr.left;
        rect.top += bcr.top;
    }
    rect.bottom = rect.top + rect.height;
    rect.right = rect.left + rect.width;
    return rect;
}
pubfunc.getWindow=function (node) {
    var doc = node.ownerDocument || node;
    return doc.defaultView || doc.parentWindow;
}

// 下载文件
pubfunc.downloadFile=function(content, filename, type) {
    // console.log(content)
    // 创建隐藏的可下载链接
    let url,blob;
    // 字符内容转变成blob地址
    switch(type){
        case 'excel':
            blob = new Blob([content],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            url = URL.createObjectURL(blob);
            break;
        case 'doc':
            blob = new Blob([content],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'});
            url = URL.createObjectURL(blob);
            break;
        case 'other':
            blob = new Blob([content],{type:'application/octet-stream;charset=utf-8'});
            url = URL.createObjectURL(blob);
            break;
        case 'url':
            url = content
            break;
        default:
            blob = content;
            url = URL.createObjectURL(blob);
            break;
    }
    // console.log(eleLink)
    let eleLink;
    if(typeof window.navigator.msSaveBlob!=='undefined'){
        // console.log(blob)
        // eleLink = document.createElement("iframe");
        // eleLink.src = url;
        blob?window.navigator.msSaveBlob(blob, filename):(window.open(url,'_blank'));
    }else{
        eleLink = document.createElement('a');
        eleLink.href = url;
        eleLink.style.display = 'none';
        filename? eleLink.download = filename:null;
        document.body.appendChild(eleLink);
        // 触发点击
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }
}

export default pubfunc;