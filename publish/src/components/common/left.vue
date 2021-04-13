<template>
  <div class="content boxRound">
    <nav class="menuCont">
      <el-scrollbar class="unitScrollbar">
        <ul class="menus">
          <li v-for="(item, k) in menus" :key="k">
            <dl
              :class="{ active: judgeLink(item), open: item.open }"
              :style="{
                'max-height':
                  (item.open
                    ? ((item.children ? item.children.length : 0) + 1) * 34
                    : 30) + 'px'
              }"
            >
              <dt @click="JumpLink(item, k)">
                {{ item.menuName
                }}<i
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
                {{ value.menuName }}
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
      menus: [
        {
          menuName: "element组件",
          name: "index",
          open: true,
          children: [
            {
              menuName: "Theme 主题",
              pname: "index",
              code: "theme",
              children: []
            },
            {
              menuName: "Font 文字",
              pname: "index",
              code: "font",
              children: []
            },
            {
              menuName: "Color 颜色",
              pname: "index",
              code: "color",
              children: []
            },
            {
              menuName: "Dialog 弹窗",
              pname: "index",
              code: "dialog",
              children: []
            },
            {
              menuName: "Form 表单",
              pname: "index",
              code: "form",
              children: []
            },
            {
              menuName: "Page 分页",
              pname: "index",
              code: "page",
              children: []
            },
            {
              menuName: "Table 表格",
              pname: "index",
              code: "table",
              children: []
            }
          ]
        },
        {
          menuName: "其他组件",
          name: "other",
          open: true,
          children: [
            {
              menuName: "Button 按钮",
              pname: "other",
              code: "button",
              children: []
            },
            {
              menuName: "Over 超出省略",
              pname: "other",
              code: "over",
              children: []
            },
            {
              menuName: "Upload 上传",
              pname: "other",
              code: "upload",
              children: []
            },
            {
              menuName: "Treebox 树形下拉",
              pname: "other",
              code: "treebox",
              children: []
            },
            {
              menuName: "Calendar 日历",
              pname: "other",
              code: "calendar",
              children: []
            }
          ]
        },
        {
          menuName: "通用方法",
          name: "function",
          open: true,
          children: []
        },
        {
          menuName: "socket.js",
          name: "socket",
          open: true,
          children: []
        },
        {
          menuName: "实时监控/录像",
          name: "video",
          open: true,
          children: [
            {
              menuName: "H5原生",
              pname: "video",
              code: "H5Video",
              children: []
            },
            {
              menuName: "video.js",
              pname: "video",
              code: "videoJS",
              children: []
            },
            {
              menuName: "flv.js",
              pname: "video",
              code: "flvJS",
              children: []
            },
            {
              menuName: "TCPlayerLite",
              pname: "video",
              code: "TCPlayerLite",
              children: []
            }
          ]
        }
      ]
    };
  },
  computed: {
    count() {
      return this.$store.state.applayCount;
    }
  },
  inject: ["reload"],
  methods: {
    // 路由跳转
    JumpLink(item, i) {
      // 直接跳转路由方法 路由地址menuUrl
      // if(item.children&&item.children.length>0){
      //     this.open=this.open===i?null:i;
      // }else{
      //     let path = this.$route.path,
      //         link=item.menuUrl;
      //     if (path === link||!link) {
      //         this.reload();
      //     } else {
      //         i!==undefined?this.open=null:null;
      //         this.$router.push(link);
      //     }
      //     // console.log(link)
      // }

      // 非跳转加hash方法
      if (item.children && item.children.length > 0) {
        item.open = !item.open;
      } else {
        var name = this.$route.name,
          linkName = item.pname ? item.pname : item.name,
          code = this.$route.hash ? this.$route.hash.replace("#", "") : "";
        // console.log(name,linkName,code,item.code)
        if (name === linkName && code === item.code) {
          this.reload();
        } else {
          this.$router.push(
            "/" + linkName + "#" + (item.code ? item.code : "index")
          );
        }
      }
    },
    // 验证路由对应显示的菜单高亮
    judgeLink(item) {
      let route = this.$route,
        code = this.$route.hash ? this.$route.hash.replace("#", "") : "";
      return route.name === item.name || code === item.code ? true : false;
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  position: relative;
}
.content > nav.menuCont {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
}
.menus li {
  position: relative;
  padding: 10px 0;
}
.menus dl {
  max-height: 30px;
  overflow: hidden;
  background-color: transparent;
  transition: all 0.2s linear;
  position: relative;
}
.menus dl > * {
  color: #484b5c;
  width: 100%;
  line-height: 30px;
  font-size: 16px;
  text-align: left;
  padding-right: 22px;
  box-sizing: border-box;
  white-space: nowrap;
  /* overflow: hidden;
    text-overflow: ellipsis; */
  cursor: pointer;
  transition: all 0.2s linear;
  position: relative;
}
.menus dl > dt {
  padding-left: 20px;
  width: 150px;
  z-index: 2;
  height: 30px;
  background-color: transparent;
  box-shadow: 0px 0px 0px 0px rgba(3, 127, 222, 0.46);
  transition: all 0.2s linear, background-color 0.15s linear;
  border-radius: 15px;
}
.menus dl.active > dt {
  background-color: #627cff;
}
.menus dl > dt > i.el-icon-arrow-down {
  position: absolute;
  top: 50%;
  right: 10px;
  display: block;
  margin-top: -6px;
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
  width: 150px;
  padding-left: 36px;
  padding-right: 8px;
  margin-top: 6px;
  height: 28px;
  font-size: 15px;
  line-height: 30px;
  z-index: 1;
}
.menus dl > dt + dd {
  margin-top: 10px;
}
.menus dl > dd:hover,
.menus dl > dt:hover,
.menus dl > dt:hover > i:not(.el-icon-arrow-down) {
  color: #627cff;
}
.menus dl > dt:hover > i:not(.el-icon-arrow-down) {
  color: #2c90f5;
}
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
  color: #4d5aff;
  transition: all 0.2s linear, color 0s linear;
}
.menus dl.open > dt > i.el-icon-arrow-down {
  transform: rotate(-180deg);
  line-height: 0.9;
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
</style>
