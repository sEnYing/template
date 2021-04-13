
import store from '@/store'

let socket=function(url){
    if(!url){return {}}
    url=url.replace('http://','ws://');
    let ws=null;
    return {
        url:url,
        ws:ws,
        loading:false,
        close:false,
        heartCheck : {
            timeout: 20000,
            timeoutObj: null,
            serverTimeoutObj: null,
            reset(){
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start(){
                this.timeoutObj = setTimeout(()=>{
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常
                    ws.send("HeartBeat");
                    this.serverTimeoutObj = setTimeout(()=>{//如果超过一定时间还没重置，说明后端主动断开了
                        ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, this.timeout)
                }, this.timeout)
            }
        },
        reconnect() {
            if(this.loading){return}
            this.loading=true;
            setTimeout(()=>{     //没连接上会一直重连，设置延迟避免请求过多
                this.createWebSocket();
                this.loading=false;
            }, 2000);
        },
        createWebSocket(){
            try {
                if ('WebSocket' in window) {
                    this.ws = ws = new WebSocket(this.url);
                } else if ('MozWebSocket' in window) {
                    this.ws = ws = new MozWebSocket(this.url);
                } else {
                    // store.commit('alertFn',{
                    //     type:'error',
                    //     text:'当前浏览器不支持websocket协议,建议使用现代浏览器',
                    //     time:3000
                    // })
                    console.log('当前浏览器不支持websocket协议,建议使用现代浏览器')
                }
                this.initEventHandle();
            } catch (e) {
                console.log(e)
                this.reconnect();
            }
        },
        initEventHandle() {
            let self=this;
            ws.onclose = function () {
                if(self.close){return;}
                self.reconnect();
            };
            ws.onerror = function (err) {
                self.reconnect();
            };
            ws.onopen = function () {
                self.heartCheck.reset().start();      //心跳检测重置
            };
            ws.onmessage = function (msg) {    //如果获取到消息，心跳检测重置
                self.heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
                if(process.env.NODE_ENV === "development"){
                    console.log(msg)
                }
                try{
                    store.commit('socketFn',JSON.parse(msg.data))
                }
                catch(e){
                }
            };
        },
        destroyed() {
            this.close=true;
            this.heartCheck.reset();
            ws?ws.close():null;
        },
    }
};
export default socket;