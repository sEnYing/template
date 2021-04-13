import unitBtn from "@/unit/components/button";
import unitBtnGroup from "@/unit/components/buttonGroup";
import unitOver from "@/unit/components/over";
import unitUpload from "@/unit/components/upload";
import unitTreebox from "@/unit/components/treebox";
import unitCalendar from "@/unit/components/calendar";
const unit = {
  install(Vue) {
    Vue.component("unitBtn", unitBtn);
    Vue.component("unitBtnGroup", unitBtnGroup);
    Vue.component("unitOver", unitOver);
    Vue.component("unitUpload", unitUpload);
    Vue.component("unitTreebox", unitTreebox);
    Vue.component("unitCalendar", unitCalendar);
  }
};
export default unit;
