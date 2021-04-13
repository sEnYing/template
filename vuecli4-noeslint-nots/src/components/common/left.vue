<template>
  <div class="content">
    <div class="userInfo">
      <i class="CoverImg">
        <img
          v-if="
            userInfo.info &&
            userInfo.info.staff &&
            userInfo.info.staff.headImage
          "
          :src="userInfo.info.staff.headImage"
          alt="userImg"
        />
        <img
          v-if="
            userInfo.info &&
            userInfo.info.accountId === 'admin' &&
            userInfo.info.loginName === 'admin'
          "
          src="/static/images/headImage/admin.png"
          alt="userImg"
        />
      </i>
      <span>{{
        userInfo.info && userInfo.info.staff && userInfo.info.staff.staffName
          ? userInfo.info.staff.staffName
          : ""
      }}</span>
    </div>
    <nav class="menuCont">
      <el-scrollbar class="unitScrollbar">
        <ul class="menus">
          <li
            v-for="(item, k) in userInfo.menus ? userInfo.menus : []"
            :key="k"
          >
            <dl
              :class="{ active: judgeLink(item), open: k === open }"
              :style="{
                'max-height':
                  (k === open
                    ? (item.children ? item.children.length : 0) * 34 + 34
                    : 30) + 'px',
              }"
            >
              <i
                v-if="item.menuCode === 'workflowtask' && count"
                class="count"
                @click="JumpLink(item, k)"
                >{{ Number(count) > 99 ? "99+" : count }}</i
              >
              <dt @click="JumpLink(item, k)">
                <i :class="[item.menuCode + '_icon']"></i>
                <span>{{ item.menuName }}</span>
                <i
                  class="el-icon-arrow-down right"
                  v-if="item.children && item.children.length > 0"
                ></i>
              </dt>
              <dd
                @click="JumpLink(value)"
                :class="{ active: judgeLink(value) }"
                v-for="(value, i) in item.children ? item.children : []"
                :key="i"
              >
                <span>{{ value.menuName }}</span>
              </dd>
            </dl>
          </li>
        </ul>
      </el-scrollbar>
    </nav>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "left",
  data() {
    return {
      open: null,
    };
  },
  computed: {
    count() {
      return this.$store.state.applayCount;
    },
    userInfo() {
      let userInfo = this.$store.state.userInfo;
      this.getOpen(userInfo);
      if (this.count === null) {
        let menu = userInfo && userInfo.menus ? userInfo.menus : [];
        for (let i in menu) {
          if (menu[i].menuCode === "workflowtask") {
            this.$store.dispatch("getCount");
            break;
          }
        }
      }
      return userInfo;
    },
  },
  watch: {
    userInfo: {
      deep: true,
      handler() {
        this.getOpen(this.userInfo);
      },
    },
  },
  inject: ["reload"],
  mounted() {},
  methods: {
    getOpen(userInfo) {
      if (userInfo && userInfo.menus) {
        // console.log(userInfo.menus)
        for (let i in userInfo.menus) {
          if (
            this.judgeLink(userInfo.menus[i]) &&
            userInfo.menus[i].children &&
            userInfo.menus[i].children.length > 0
          ) {
            this.open = Number(i);
            break;
          }
        }
      }
    },
    // 路由跳转
    JumpLink(item, i) {
      this.$pubfunc.setSStorage("tag", "");
      this.$pubfunc.setSStorage("tabChoose", "");
      this.$pubfunc.setSStorage("stage", "");
      this.$pubfunc.setSStorage("tab", "");
      this.$pubfunc.setSStorage("weekreportSelect", "");
      if (item.children && item.children.length > 0) {
        this.open = this.open === i ? null : i;
      } else {
        let path = this.$route.path,
          link = item.menuUrl;
        if (path === link || !link) {
          this.reload();
        } else {
          i !== undefined ? (this.open = null) : null;
          // this.$store.commit('searchConditionFn', '')
          this.$router.push(link);
          this.$store.commit("searchConditionFn", {});
          this.$store.commit("pageFn", { page: 1, limit: 10 });
        }
        // console.log(link)
      }
    },
    // 验证路由对应显示的菜单高亮
    judgeLink(item) {
      // console.log(item)
      let route = this.$route;
      let res =
        route.name === item.menuCode || route.meta.pname === item.menuCode
          ? true
          : false;
      if (res) {
        return true;
      }
      if (item.children && item.children.length > 0) {
        for (let i in item.children) {
          if (
            item.children[i].menuCode === route.name ||
            item.children[i].menuCode === route.meta.pname
          ) {
            return true;
          }
        }
      }
      return false;
    },
  },
};
</script>


<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 22px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  position: relative;
}
.content > div.userInfo {
  position: relative;
  height: 180px;
  width: 100%;
  padding: 28px 0 26px;
  box-sizing: border-box;
}
.content > div.userInfo > i {
  display: block;
  width: 100px;
  height: 100px;
  border: 3px solid #4780f4;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
}
.content > div.userInfo > span {
  text-align: center;
  display: block;
  margin-top: 12px;
  line-height: 1;
  font-size: 14px;
  color: #bdbdbd;
}
.content > nav.menuCont {
  position: absolute;
  top: 180px;
  bottom: 20px;
  left: 0;
  right: 0;
}
.menus {
  padding: 0 38px;
}
.menus li {
  position: relative;
  padding: 10px 0;
}
.menus dl {
  /* max-height: 42px; */
  max-height: 30px;
  overflow: hidden;
  background-color: transparent;
  /* box-shadow:0px 0px 0px 0px rgba(3,127,222,0.46); */
  /* transition: all 0.2s linear,box-shadow 0s linear; */
  transition: all 0.2s linear;
  position: relative;
  /* z-index: 1; */
}
/* .menus dl.active{
    z-index: 2;
    background-color: #4780F4;
} */
.menus dl > * {
  color: #484b5c;
  width: 100%;
  /* line-height: 42px; */
  line-height: 30px;
  /* font-size: 14px; */
  font-size: 16px;
  text-align: left;
  padding-right: 22px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  /* text-shadow: 0 0 1px rgba(72, 75, 92, 0); */
  transition: all 0.2s linear;
  position: relative;
}
.menus dl > dt {
  padding-left: 45px;
  width: 150px;
  z-index: 2;
  height: 30px;
  background-color: transparent;
  box-shadow: 0px 0px 0px 0px rgba(3, 127, 222, 0.46);
  transition: all 0.2s linear, background-color 0.15s linear;
  border-radius: 15px;
}
.menus dl.active > dt {
  /* z-index: 2; */
  background-color: #4780f4;
}
.menus dl > dt > i.el-icon-arrow-down {
  float: right;
  margin-right: -14px;
  display: block;
  font-size: 14px;
  transform: rotate(0);
  transition: transform 0.2s linear;
}
.menus dl > dt > span {
  display: block;
  line-height: 1;
  top: 50%;
  position: relative;
  margin-top: -7px;
}
.menus dl > dd {
  padding-left: 40px;
  padding-right: 10px;
  margin-top: 6px;
  height: 28px;
  font-size: 15px;
  line-height: 30px;
  /* background-color: #f1f4fb; */
  z-index: 1;
}
.menus dl > dt + dd {
  margin-top: 10px;
}
.menus dl > dd:hover,
.menus dl > dt:hover,
.menus dl > dt:hover > i:not(.el-icon-arrow-down) {
  color: #4780f4;
}
.menus dl > dt:hover > i:not(.el-icon-arrow-down) {
  color: #2c90f5;
}
/* .menus dl>dd:hover,.menus dl:hover>dt,.menus dl:hover>dt>i:not(.el-icon-arrow-down),
.menus dl.open:not(.active)>dt{
    color: #4780F4;
}
.menus dl:hover>dt>i:not(.el-icon-arrow-down),
.menus dl.open:not(.active)>dt>i:not(.el-icon-arrow-down){
    color: #2c90f5;
} */
.menus dl.active > dt,
.menus dl.active:hover > dt,
.menus dl.active > dt > i,
.menus dl.active:hover > dt > i {
  color: #fff;
  transition: all 0.2s linear, color 0s linear;
}
.menus dl > dd.active,
.menus dl:hover > dd.active,
.menus dl > dd.active:hover {
  /* background-color: #dfe4f6; */
  color: #4780f4;
  transition: all 0.2s linear, color 0s linear;
}
/* .menus dl.active:not(.open),
.menus dl.active:hover:not(.open),
.menus dl.active.open>dt,
.menus dl.active.open>dt{
    box-shadow: 0px 3px 8px 0px rgba(3,127,222,0.46);
    transition: all 0.2s linear,box-shadow 0.2s linear 0.1s;
} */
/* .menus dl::before{
    content: '';
    display: block;
    width: 100%;
    height: 42px;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(-90deg,rgba(0,131,254,1) 0%,rgba(0,195,255,1) 100%);
    transition: all 0.2s linear;
    opacity: 0;
    z-index: 1;
}
.menus dl.active::before{
    opacity: 1;
} */
.menus dl.open > dt > i.el-icon-arrow-down {
  transform: rotate(-180deg);
  line-height: 0.9;
}
i.count {
  position: absolute;
  z-index: 9;
  width: auto;
  min-width: 6px;
  background-color: #f56c6c;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  right: 22px;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
}
.menus dl > dt > i:not(.el-icon-arrow-down) {
  display: block;
  font-size: 20px;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 5px;
  left: 18px;
  color: #a8b0ca;
  transition: all 0.2s linear;
}
.menus dl > dt > i:not(.el-icon-arrow-down)::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("../../assets/images/left.png") no-repeat;
  transition: opacity 0.15s linear;
}
.menus dl > dt > i:not(.el-icon-arrow-down)::before {
  opacity: 1;
}
.menus dl:not(.active) > dt:hover > i:not(.el-icon-arrow-down)::before {
  opacity: 0.8;
}
.menus dl.active > dt > i:not(.el-icon-arrow-down)::before {
  background-position-y: -23px;
}
.menus dl > dt > i.main_icon::before,
.menus dl > dt > i.mainleader_icon::before {
  background-position: 3px -3px;
}
.menus dl > dt > i.customer_icon::before {
  background-position: -17px -3px;
}
.menus dl > dt > i.supplier_icon::before {
  background-position: -37px -3px;
}
.menus dl > dt > i.project_icon::before {
  background-position: -57px -3px;
}
.menus dl > dt > i.visit_icon::before {
  background-position: -77px -3px;
}
.menus dl > dt > i.workreport_icon::before {
  background-position: -97px -3px;
}
.menus dl > dt > i.manufacturer_icon::before {
  background-position: -117px -3px;
}
.menus dl > dt > i.contact_icon::before {
  background-position: -137px -3px;
}
.menus dl > dt > i.salestarget_icon::before {
  background-position: -157px -3px;
}
.menus dl > dt > i.dashboard_icon::before {
  background-position: -177px -3px;
}
.menus dl > dt > i.department_icon::before {
  background-position: -197px -3px;
}
.menus dl > dt > i.staff_icon::before {
  background-position: -217px -3px;
}
.menus dl > dt > i.role_icon::before {
  background-position: -237px -3px;
}
.menus dl > dt > i.myapply_icon::before {
  background: url("../../assets/images/myapply.png") center center no-repeat;
}
.menus dl > dt > i.myapprove_icon::before {
  background: url("../../assets/images/myapprove.png") center center no-repeat;
}
.menus dl.active > dt > i:not(.el-icon-arrow-down).myapply_icon::before {
  background: url("../../assets/images/myapply_.png") center center no-repeat;
}
.menus dl.active > dt > i:not(.el-icon-arrow-down).myapprove_icon::before {
  background: url("../../assets/images/myapprove_.png") center center no-repeat;
}
</style>
