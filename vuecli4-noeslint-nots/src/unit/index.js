import unitBtn from '@/unit/components/button'
import unitLoading from '@/unit/components/element/loading'
import unitPage from '@/unit/components/element/page'
import unitDropdown from '@/unit/components/element/dropdown'
const unit={
    install(Vue){
        Vue.component('unitLoading',unitLoading);
        Vue.component('unitBtn',unitBtn);
        Vue.component('unitPage',unitPage);
        Vue.component('unitDropdown',unitDropdown);
    },
}
export default unit