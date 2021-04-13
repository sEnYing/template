import Vue from 'vue'
// 显示code
Vue.directive('showcode', {
    inserted:function(el){
        el.setAttribute('class','showCode');
        var html = document.createElement("span");
        html.setAttribute('class','codeTxt');
        html.innerHTML = 'HTML';
        // console.log(el.parentElement)
        el.parentElement.insertBefore(html,el)
        setTimeout(()=>{
            el.style.height=Number(el.scrollHeight+2)+'px';
            el.setAttribute('readonly',true);
        },0)
    },
})