<template>
  <div class="example">
    <div class="thisTitle">日历组件 unit-calendar</div>
    <div class="box">
      <div class="thisText">
        <span><i class="must"></i>需要 unit-over</span>
      </div>
      <div class="thisText"></div>
      <div class="thisEx">
        <div class="divEx" style="width:1000px">
          <unit-calendar></unit-calendar>
        </div>
      </div>
      <textarea v-showcode>
<template>
    <unit-calendar></unit-calendar>
</template></textarea
      >
    </div>
  </div>
</template>

<script>
// import css和第三方js
export default {
  name: "methodOfUpload",
  props: ["dom"],
  data() {
    return {
      fileList1: [
        {
          id: "1",
          realName: "example.jpg",
          fileSize: "107671",
          filePath: "/static/data/example.jpg"
        },
        {
          id: "2",
          realName: "用户手册.pdf",
          fileSize: "2829010",
          filePath: "/static/data/用户手册.pdf"
        },
        {
          id: "3",
          loading: 72,
          realName: "文本.docx",
          fileSize: "321",
          filePath: "/文本.docx"
        },
        {
          id: "4",
          loading: "服务器异常",
          realName: "全部人员信息.xlsx",
          fileSize: "241123",
          filePath: "/全部人员信息.xlsx"
        },
        {
          id: "5",
          realName: "学习成长考核反馈表-前端类.xlsx",
          fileSize: "19016",
          filePath: "/static/data/学习成长考核反馈表-前端类.xlsx"
        }
      ],
      fileList2: [
        {
          id: "1",
          realName: "example.jpg",
          fileSize: "107671",
          filePath: "/static/data/example.jpg"
        },
        {
          id: "2",
          realName: "卓朗科技-前端.docx",
          fileSize: "24384432",
          filePath: "/static/data/卓朗科技-前端.docx"
        },
        {
          id: "3",
          loading: 72,
          realName: "文本.docx",
          fileSize: "321",
          filePath: "/文本.docx"
        },
        {
          id: "4",
          loading: "服务器异常",
          realName: "全部人员信息.xlsx",
          fileSize: "241123",
          filePath: "/全部人员信息.xlsx"
        }
      ],
      fileList3: [
        {
          id: "1",
          realName: "Video.mp4",
          fileSize: "21377024",
          filePath: "/static/data/Video.mp4"
        }
      ],
      fileList4: [
        {
          id: "1",
          realName: "example.jpg",
          fileSize: "1235566",
          filePath: "/static/data/example.jpg",
          src: "/static/data/example.jpg"
        },
        {
          id: "2",
          realName: "手机拍照角度问题.jpg",
          fileSize: "4656363",
          filePath: "/static/data/手机拍照角度问题.jpg",
          src: "/static/data/手机拍照角度问题.jpg"
        }
      ],
      fileList5: [
        {
          id: "1",
          realName: "动图.gif",
          fileSize: "331776",
          filePath: "/static/data/动图.gif"
        }
      ],
      total1: 19,
      total2: 19,
      ajaxing1: false,
      ajaxing2: false,
      option: {
        fileType: {
          img: ["gif", "png"],
          psd: ["psd"],
          video: ["mp4"]
        },
        statusKey: "state",
        statusValue: "200",
        id: "data.fileId",
        path: "data.filePath",
        message: "msg"
      },
      param: {
        userId: "userId"
      },
      text1: "{{total1}}",
      text2: "{{total2}}"
    };
  },
  methods: {
    deleteFile(item, cb) {
      // 操作接口删除文件或数据关联等
      console.log("delete：", item);
      // 删除该行
      cb(item);
    },
    changeHeight(key) {
      console.log(key + "的高度变化了");
    },
    successUpload1(item, key) {
      // 操作接口 如刷新列表table
      this.total1++;
      this.$message({
        customClass: "troilaAlart",
        message: key + "上传成功",
        type: "success",
        duration: 1500
      });
    },
    ajaxChange1(j) {
      this.ajaxing1 = j;
    },
    successUpload2(item, key) {
      // 操作接口 如刷新列表table
      this.total2++;
      this.$message({
        customClass: "troilaAlart",
        message: key + "上传成功",
        type: "success",
        duration: 1500
      });
    },
    ajaxChange2(j) {
      this.ajaxing2 = j;
      console.log(key + "的高度变化了");
    }
  }
};
</script>

<style scoped>
.thisEx > button,
.thisEx > .btnGroup {
  margin-right: 24px;
}
.thisEx > button.textBtn {
  margin: 7px 48px 19px 24px;
}
.thisEx > * {
  margin-bottom: 12px;
}
.thisEx > button:nth-last-child(1),
.thisEx > .btnGroup:nth-last-child(1) {
  margin-right: 0;
}
.thisIndex {
  text-indent: 34px;
}
</style>
