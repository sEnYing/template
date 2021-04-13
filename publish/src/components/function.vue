<template>
    <div class="content">
		<div class="example">
            <div class="thisTitle">通用方法 $pubfunc</div>
            <div class="box">
                <div class="thisText">
                    <span>main.js中注册（public.js）</span>
                </div>
                <textarea v-showcode>
import pubfunc from './assets/js/public'
Vue.prototype.$pubfunc=pubfunc</textarea>
            </div>
            <div class="box">
                <div class="thisText">引用<span>this.$pubfunc.方法名</span></div>
                <textarea v-showcode>
<!-- localStorage操作 -->
this.$pubfunc.setLStorage(key,val,encode);    //  encode 是否加密
this.$pubfunc.getLStorage(key,flag);    //  如果存在第二个参数则转换成JSON
this.$pubfunc.delLStorage(key);
this.$pubfunc.clearLStorage();

<!-- sessionStorage操作 -->
this.$pubfunc.setSStorage(key,val,encode);    //  encode 是否加密
this.$pubfunc.getSStorage(key,flag);    //  如果存在第二个参数则转换成JSON
this.$pubfunc.delSStorage(key);
this.$pubfunc.clearSStorage();

<!-- cookie操作 -->
this.$pubfunc.setCookie(cname,cvalue,exdays);    //  exdays 过期时间，不传默认关闭浏览器删除
this.$pubfunc.getCookie(cname);
this.$pubfunc.delCookie(key);
this.$pubfunc.clearCookie();

<!-- base64 -->
this.$pubfunc.encode(v);    //  base64加密，多用于存储storage/cookie和url参数
this.$pubfunc.decode(v);    //  base64解密
this.$pubfunc.getInfo(key);    //  获取localStorage并base64解码

<!-- 生成随机字符串 -->
this.$pubfunc.makeRandom(len, type);    // len 字符串长度，type 字符串类型：'num' 'str' 'all'，默认str

<!-- 时间相关 -->
//  获取当前时间/时间戳
this.$pubfunc.getTimeNum(judge);    //  judge存在则返回当前时间，否则返回当前时间戳

//  时间转换为时间戳
this.$pubfunc.timeToTimestamp(date);    //  date为字符串类型时间 如 2020-02-02 00:00:00
                                           //  可不包含时间 如 2020-02-02
//  时间拆分
this.$pubfunc.timestampToTime(date);    //  date不限制格式，为空则为当前时间，结果为json
                                           //  包含Year，Month，Day，Hour，Minite，Second，Week
//  时间格式化
this.$pubfunc.TimeTransform(type,time1,time2);
    //  type  必传，为时间格式：
    //        1.普通格式 ： YYYY-MM-DD hh:mm:ss 星期W
    //        2.type为"区间" ： 传入时间与当前时间的时间差，根据差值返回 x分钟前 x小时前 1天前 2天前
    //                           超过2天返回 xxxx年xx月xx日 xx:xx
    //        3.type为"差值" ： 返回time1与time2直接的差值，x天x小时x分（此时time1，time2必传）
    //  time1 需要格式化的时间，不传为当前时间
    //  time2 除type为"差值"的情况下 time2会替代time1
    //        比如在某个值需要在存在修改时间时候显示修改时间，不存在修改时间显示创建时间时，
    //        time1传创建时间，time2传修改时间，简化页面中的非空判断
//  上下午时间
this.$pubfunc.transTime(time,en);    //  time 需要转化的时间 格式为hh:mm(:ss)
                                      //  en 传值分为 不传/null/false/0、"small"、非"small"
                                      //      例：this.$pubfunc.transTime("23:50") ===> 下午 11:50
                                      //      例：this.$pubfunc.transTime("23:50",true) ===> 11:50PM
                                      //      例：this.$pubfunc.transTime("23:50","small") ===> 11:50pm
//  本年第几周
this.$pubfunc.getWeekOfYear(time);    //  time不穿为当天时间，返回number

<!-- 获取字符串长度 -->
this.$pubfunc.getByteLen(val,char);    //  val 字符串
                                        //  char 一个字符对应长度，不穿默认为2

<!-- 替换 -->
//  空格替换
this.$pubfunc.replaceSpace(val,type);    //  val 字符串
                                          //  type Number格式，不传返回val去头尾空格
                                          //  type为1 返回去除所有空格
                                          //  type为2 返回去头尾空格 文字间多个空格只保留一个
//  回车替换
this.$pubfunc.replaceBr(val,type);    //  val 字符串
                                          //  type Number格式，不传无变化
                                          //  type为1 替换val中回车为html的<br/> 空格为html的& nbsp
                                          //  type为2 替换为段落
                                          //  type为3 替换为空格
                                          //  type为4 清除回车空格返回纯文本
//  字符串替换为纯数字
this.$pubfunc.replacePhone(val);    //  val 字符串

//  验证手机号
this.$pubfunc.judgePhone(val);    //  val 字符串

//  返回价格
this.$pubfunc.transformPrice(price,judge);    //  price 价格字符串 返回值会截取前12有效位
                                              //  judge 传出格式是否为金额计数格式
                                              //  judge为true会文字提示（目前console提示，最好根据项目修改）

//  返回价格-万元
this.$pubfunc.getSmallPrice(price);    //  price 价格字符串
                                        //  返回结果为原price/10000
                                        //  大于100则返回整数，10-100保留一位小数，小于10保留两位小数

<!-- dom相关 -->
//  判定dom元素及其祖级是否包含class（冒泡）
this.$pubfunc.JudgeClass(el,name);    //  el 需要判断的dom元素
                                        //  name 判断是否存在的class名，逗号分隔

//  获取dom元素位置
this.$pubfunc.getClientRect(element);    //  返回json
                                          //  width height top left bottom right
                                          //  bottom right为下边和右边距离屏幕左侧的距离

//  下载文件
this.$pubfunc.downloadFile(content, filename, type);    //  content 文件流或url
                                                         //  filename 文件名称
                                                         //  type 文件下载类型
                                                         //       excel 下载excel文件流
                                                         //       doc 下载doc文件流
                                                         //       other 下载其他格式文件流
                                                         //       url 下载文件url
                                                         //       不传或其他 直接下载content
                </textarea>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'function',
    props:['dom'],
    data () {
        return{
        }
    },
    methods:{
    },
    created(){
    },
    mounted(){
    },
}
</script>

<style scoped>
.content{
    padding: 12px 16px;
    text-align: center;
}
</style>