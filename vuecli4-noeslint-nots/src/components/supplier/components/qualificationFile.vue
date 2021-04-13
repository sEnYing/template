<!--
 * @Descripttion: 
 * @Author: SongEnYing
 * @Date: 2020-12-14 09:27:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-14 09:29:09
-->
<template>
  <div class="qualificationFile">
    <div class="title-box">
      <span>{{ titleTxT }}</span>
    </div>
    <div class="content-box" v-if="edit || (!edit && !supplierId)">
      <el-upload
        action="/api/service/supplier/uploadDocument"
        list-type="picture-card"
        :file-list="fileList"
        :on-success="uploadSucc"
        :before-upload="beforeUpload"
        :headers="{
          Authorization: $store.state.token,
        }"
        :data="{ documentType: type }"
        :disabled="disabled"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.logo" alt="" />
          <span class="name">{{ file.documentName }}</span>
          <span class="el-upload-list__item-actions">
            <!-- <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span> -->
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </div>
    <div class="content-box" v-else>
      <div>
        <ul class="el-upload-list el-upload-list--picture-card">
          <li
            v-for="(item, index) in list"
            :key="index"
            class="el-upload-list__item is-ready"
          >
            <div>
              <img
                :src="item.logo"
                alt=""
                class="el-upload-list__item-thumbnail"
              />
              <span class="name">{{ item.documentName }}</span>
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(item)"
                >
                  <i class="el-icon-download"></i>
                </span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="justShowPic"
      modal-append-to-body
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/font/supplierManage/iconfont.js";
import { fileToBlob } from "@/assets/js/changeFile";
export default {
  props: ["titleTxT", "list", "edit", "supplierId", "type"],
  watch: {
    list: {
      deep: true,
      handler(newV, oldv) {
        this.fileList = newV;
        for (const [k, v] of Object.entries(this.fileList)) {
          var type = v.documentName.substring(v.documentName.indexOf(".") + 1);
          v.type = type.toLowerCase();
          if (v.type === "ppt" || v.type === "pptx") {
            v.logo = require("../../../assets/images/ppt.jpg");
          } else if (v.type === "xlsx" || v.type === "xls") {
            v.logo = require("../../../assets/images/excel.jpg");
          } else if (v.type === "doc" || v.type === "docx") {
            v.logo = require("../../../assets/images/word.png");
          } else if (v.type === "pdf") {
            v.logo = require("../../../assets/images/pdf.jpg");
          } else if (v.type === "txt") {
            v.logo = require("../../../assets/images/txt.jpg");
          } else if (v.type === "zip" || v.type === "rar") {
            v.logo = require("../../../assets/images/rar.jpg");
          } else {
            v.logo = v.url || require("../../../assets/images/jpeg.jpg");
          }
        }
        console.log(this.fileList);
      },
    },
  },
  data() {
    return {
      disabled: false,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      documentIdsForDelete: [],
      fileType: [
        "jpeg",
        "JPEG",
        "jpg",
        "JPG",
        "png",
        "PNG",
        "doc",
        "DOC",
        "docx",
        "DOCX",
        "xls",
        "XLS",
        "xlsx",
        "XLSX",
        "ppt",
        "PPT",
        "pptx",
        "PPTX",
        "txt",
        "TXT",
        "pdf",
        "PDF",
      ],
    };
  },
  methods: {
    handleRemove(file) {
      this.$store.commit("confirmFn", {
        type: "warning",
        text: "确认删除该文件吗？",
        func: () => {
          if (file.documentId) {
            this.documentIdsForDelete.push(file.documentId);
            for (const [k, v] of Object.entries(this.fileList)) {
              if (v.documentId && v.documentId === file.documentId) {
                this.fileList.splice(k, 1);
              }
            }
            this.$emit("removePic", this.documentIdsForDelete.join(","));
            this.$emit("getFile", { [this.type]: this.fileList });
          } else {
            this.$api.public.uploadDelete(
              { filePath: file.documentAddr },
              (res) => {
                if (res.code === "0") {
                  for (const [k, v] of Object.entries(this.fileList)) {
                    if (v.uid && v.uid === file.uid) {
                      this.fileList.splice(k, 1);
                    }
                  }
                  this.$emit("getFile", { [this.type]: this.fileList });
                  this.$store.commit("alertFn", {
                    text: "操作成功！",
                    type: "success",
                  });
                } else {
                  res.message
                    ? this.$store.commit("alertFn", {
                        text: res.message,
                        type: "error",
                      })
                    : null;
                }
              }
            );
          }
        },
      });
    },
    handleDownload(file) {
      if (this.disabled) return;
      this.disabled = true;
      this.$api.download.supplierFileDownload(
        { filePath: file.documentAddr },
        (res) => {
          this.$pubfunc.downloadFile(res, file.documentName, file.type);
          this.disabled = false;
        }
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      if (this.fileList && this.fileList.length === 10) {
        this.$store.commit("alertFn", {
          text: "每类附件最多可上传10份！",
          type: "error",
        });
        return false;
      }
      var type = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.fileType.indexOf(type) > -1) {
        if (file.size / 1024 / 1024 > 50) {
          this.$store.commit("alertFn", {
            text: "文件大小不可超过50MB，请重新上传",
            type: "error",
          });
          return false;
        } else {
          this.disabled = true;
          return true;
        }
      } else {
        this.$store.commit("alertFn", {
          text:
            '文件格式错误，仅支持上传,仅支持上传"jpeg,jpg,png,doc,docx,xls,xlsx,ppt,pptx,txt,pdf"格式文件',
          type: "error",
        });
        return false;
      }
    },
    uploadSucc(response, file, fileList) {
      if (response.code === "0") {
        this.fileList.push(Object.assign({ ...response.data }, { ...file }));
        for (const [k, v] of Object.entries(this.fileList)) {
          var type = v.documentName.substring(
            v.documentName.lastIndexOf(".") + 1
          );
          v.type = type.toLowerCase();
          if (v.type === "ppt" || v.type === "pptx") {
            v.logo = require("../../../assets/images/ppt.jpg");
          } else if (v.type === "xlsx" || v.type === "xls") {
            v.logo = require("../../../assets/images/excel.jpg");
          } else if (v.type === "doc" || v.type === "docx") {
            v.logo = require("../../../assets/images/word.png");
          } else if (v.type === "pdf") {
            v.logo = require("../../../assets/images/pdf.jpg");
          } else if (v.type === "txt") {
            v.logo = require("../../../assets/images/txt.jpg");
          } else if (v.type === "zip" || v.type === "rar") {
            v.logo = require("../../../assets/images/rar.jpg");
          } else {
            v.logo = v.url || require("../../../assets/images/jpeg.jpg");
          }
        }
        this.$emit("getFile", { [this.type]: this.fileList });
        this.disabled = false;
      } else {
        response.message
          ? this.$store.commit("alertFn", {
              text: response.message,
              type: "error",
            })
          : null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.qualificationFile {
  .title-box {
    height: 30px;
    line-height: 30px;
    color: #000;
    span {
      display: inline-block;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #444444;
    }
  }
  .content-box {
    width: 100%;
    height: 80px;
    border: 1px solid #ccc;
    margin-bottom: 5px;
    box-sizing: border-box;
    padding-top: 5px;
    padding-left: 15px;
    /deep/ .el-upload-list {
      .el-upload-list__item {
        border-radius: 0;
        border: 0;
        height: 70px;
        text-align: center;
        margin: 0 auto;
        img,
        .el-upload-list__item-actions {
          width: 65px !important;
          height: 50px;
          width: auto;
        }
        .el-upload-list__item-actions {
          margin-left: 40px;
        }
        .name {
          display: inline-block;
          width: 100%;
          text-align: center;
          font-size: 12px;
        }
      }
    }
    /deep/ .el-upload {
      height: 60px;
      line-height: 60px;
      width: 60px;
      margin-top: 4px;
      .el-icon-plus {
        line-height: unset;
      }
    }
  }
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
<style lang="scss">
.justShowPic {
  img {
    width: 100%;
    height: 700px;
  }
}
</style>
