<template>
  <div class="loginPage">
    <div class="login">
      <div class="bg" :class="{'success':error==='success'}">
        <div class="roundOutside1"></div>
        <div class="roundInset1"></div>
        <div class="roundOutside2"></div>
        <div class="background"></div>
        <div class="roundOutside3"></div>
        <div class="roundInset2"></div>
        <div class="roundOutside4"></div>
      </div>
      <div class="content">
        <div class="title">
          <span>登 录</span>
        </div>
        <ul>
          <li @click="focusInput('username')">
            <input
              type="text"
              placeholder="请输入您的账号"
              v-model="username"
              @keyup.enter="keyUp('username')"
              ref="username"
            />
          </li>
          <li @click="focusInput('password')">
            <input
              type="password"
              placeholder="请输入您的密码"
              v-model="password"
              @keyup.enter="keyUp('password')"
              ref="password"
            />
          </li>
          <li @click="focusInput('code')">
            <input
              type="text"
              placeholder="请输入验证码"
              v-model="code"
              @keyup.enter="keyUp('code')"
              ref="code"
            />
            <i class="codeImg" @click.stop="getCode">
              <unit-loading class="btnLoading" :loading="true" v-if="!codeImg.img||codeImg.loading"></unit-loading>
              <img
                v-if="codeImg.img"
                :src="'data:image/jpg;base64,'+codeImg.img"
                alt="验证码"
                title="点击重新获取验证码"
              />
            </i>
          </li>
        </ul>
        <transition name="error">
          <u v-if="error===true">{{errText}}</u>
        </transition>
        <div
          class="button"
          type="button"
          @click="submit"
          :class="[error==='success'?'success':(error==='loading'?'':'AbleClick')]"
        >
          <transition :name="error==='success'?'fade':'fade1'">
            <unit-loading class="btnLoading" :white="true" :loading="true" v-if="error==='loading'"></unit-loading>
          </transition>
          <transition :name="error==='success'?'scale':'fade1'">
            <span v-if="error!=='loading'">{{error==='success'?'登录成功':'登录'}}</span>
          </transition>
          <div class="bg" v-if="error==='success'">
            <div class="roundOutside1"></div>
            <div class="roundInset1"></div>
            <div class="roundOutside2"></div>
            <div class="background"></div>
            <div class="roundOutside3"></div>
            <div class="roundInset2"></div>
            <div class="roundOutside4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  inject: ["judgelogin"],
  data() {
    return {
      username: "",
      password: "",
      code: "",
      error: false,
      errText: "",
      codeImg: {
        loading: true,
        cToken: null,
        img: null
      }
    };
  },
  created() {
    this.getCode();
  },
  mounted() {
    this.$pubfunc.delLStorage("userInfo");
    this.$pubfunc.delLStorage("menu");
  },
  methods: {
    getCode() {
      this.codeImg.loading = true;
      this.code = "";
      this.$api.account.getVerifyCode(
        this.codeImg.cToken ? { cToken: this.codeImg.cToken } : {},
        res => {
          switch (res.code) {
            case "0":
              this.codeImg.cToken = res.data.cToken;
              this.codeImg.img = res.data.img;
              this.codeImg.loading = false;
              break;
            default:
          }
        }
      );
    },
    keyUp(n) {
      switch (n) {
        case "username":
          if (!this.password || !this.code) {
            this.$refs.password.focus();
            break;
          }
        case "password":
          if (!this.code) {
            this.$refs.code.focus();
            break;
          }
        default:
          this.submit();
      }
    },
    focusInput(el) {
      this.$refs[el].focus();
    },
    submit() {
      if (this.error === "loading" || this.error === "success") {
        return;
      }
      this.error = false;
      if (!this.username) {
        this.errText = "请输入用户名";
        this.error = true;
        this.focusInput("username");
        return;
      }
      if (!this.password) {
        this.errText = "请输入密码";
        this.error = true;
        this.focusInput("password");
        return;
      }
      if (!this.code) {
        this.errText = "请输入验证码";
        this.error = true;
        this.focusInput("code");
        return;
      }
      if (!this.error) {
        this.error = "loading";
        setTimeout(() => {
          this.$api.account.login(
            {
              loginName: this.username,
              password: this.password,
              verifyCode: this.code,
              cToken: this.codeImg.cToken
            },
            res => {
              switch (res.code) {
                case "0":
                  this.error = "success";
                  setTimeout(() => {
                    this.$store.commit("tokenFn", res.data);
                  }, 800);
                  break;
                default:
                  this.errText = res.message;
                  this.error = true;
                  this.getCode();
              }
            }
          );
        }, 200);
      }
    }
  }
};
</script>


<style scoped>
.loginPage {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 1112;
  overflow: hidden;
  min-width: 1300px;
}
.loginPage::before {
  width: 35%;
  height: 0;
  padding-bottom: 35%;
  display: block;
  position: absolute;
  content: "";
  background: url("../../assets/images/loginBg.png") center/cover no-repeat;
  bottom: 54%;
  right: 0;
}
.loginPage::after {
  width: 9.85%;
  height: 0;
  padding-bottom: 2.8664%;
  display: block;
  position: absolute;
  content: "";
  background: url("../../assets/images/logo.png") center/auto 100% no-repeat;
  top: 3.5185%;
  left: 2.1875%;
}
@media screen and (max-width: 1300px) {
  .loginPage {
    left: 50%;
    margin-left: -650px;
  }
  .loginPage::after {
    left: 5%;
  }
}
@media screen and (max-width: 1250px) {
  .loginPage::after {
    left: 10%;
  }
}
@media screen and (max-width: 1100px) {
  .loginPage::after {
    left: 15%;
  }
}
@media screen and (max-width: 1000px) {
  .loginPage::after {
    left: 20%;
  }
}
@media screen and (max-width: 830px) {
  .loginPage {
    left: 0;
    margin-left: -235px;
  }
}
.login {
  width: 22%;
  padding-bottom: 28%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -40%);
}
.login::after {
  width: 107.5%;
  height: 0;
  padding-bottom: 8.287%;
  display: block;
  position: absolute;
  content: "";
  background: url("../../assets/images/loginLogo.png") center/auto 100%
    no-repeat;
  top: -10%;
  left: 50%;
  transform: translate(-50%, -105%);
}
.login > .bg {
  opacity: 1;
  transition: opacity 0.15s ease-in-out;
}
.login > .bg.success {
  opacity: 0;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 11, 131, 0.07);
  box-shadow: 0 2px 18px rgba(0, 11, 131, 0.15);
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
}
.bg > * {
  position: absolute;
}
.bg > .roundOutside1 {
  width: 100%;
  background-color: #fff;
  height: 16px;
  top: 0;
  left: 0;
  border-top-right-radius: 6px;
}
.bg > .roundOutside1::before {
  content: "";
  display: block;
  position: absolute;
  width: 28px;
  height: 100%;
  border-radius: 8px;
  left: -20px;
  top: 0;
  background-color: #fff;
  box-shadow: -10px 0px 18px rgba(0, 11, 131, 0.1);
}
.bg > .roundOutside1::after {
  position: absolute;
  content: "";
  display: block;
  top: 100%;
  height: 14px;
  right: 0;
  left: 21px;
  background-color: #fff;
}
.bg > .roundOutside2 {
  width: 100%;
  background-color: #fff;
  height: 16px;
  top: 30px;
  left: 0;
}
.bg > .roundOutside2::before {
  content: "";
  display: block;
  position: absolute;
  width: 23px;
  height: 100%;
  border-radius: 8px;
  left: -15px;
  top: 0;
  background-color: #fff;
  box-shadow: -10px 0px 18px rgba(0, 11, 131, 0.08);
}
.bg > .background {
  left: 0;
  right: 0;
  top: 46px;
  bottom: 46px;
  background-color: #fff;
}
.bg > .roundOutside4 {
  width: 100%;
  background-color: #fff;
  height: 16px;
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 6px;
}
.bg > .roundOutside4::before {
  content: "";
  display: block;
  position: absolute;
  width: 23px;
  height: 100%;
  border-radius: 8px;
  right: -15px;
  bottom: 0;
  background-color: #fff;
  box-shadow: 10px 0px 18px rgba(0, 11, 131, 0.1);
}
.bg > .roundOutside4::after {
  position: absolute;
  content: "";
  display: block;
  bottom: 100%;
  height: 14px;
  left: 0;
  right: 24px;
  background-color: #fff;
}
.bg > .roundOutside3 {
  width: 100%;
  background-color: #fff;
  height: 16px;
  bottom: 30px;
  right: 0;
}
.bg > .roundOutside3::before {
  content: "";
  display: block;
  position: absolute;
  width: 15px;
  height: 100%;
  border-radius: 8px;
  right: -7px;
  bottom: 0;
  background-color: #fff;
  box-shadow: 10px 0px 18px rgba(0, 11, 131, 0.08);
}
.bg > .roundInset1,
.bg > .roundInset2 {
  overflow: hidden;
  width: 21px;
  height: 42px;
}
.bg > .roundInset1 {
  left: 10px;
  top: 2px;
}
.bg > .roundInset2 {
  right: 14px;
  bottom: 2px;
}
.bg > .roundInset1:before,
.bg > .roundInset2:before {
  position: absolute;
  padding: 7px;
  border-radius: 50%;
  box-shadow: 0 0 0 14px #ffffff;
  content: "";
  top: 14px;
}
.bg > .roundInset1:before {
  left: -7px;
}
.bg > .roundInset2:before {
  right: -10px;
}
.button.success > .bg > .roundOutside1,
.button.success > .bg > .roundOutside1::before,
.button.success > .bg > .roundOutside1::after,
.button.success > .bg > .roundOutside2,
.button.success > .bg > .roundOutside2::before,
.button.success > .bg > .background,
.button.success > .bg > .roundOutside4,
.button.success > .bg > .roundOutside4::before,
.button.success > .bg > .roundOutside4::after,
.button.success > .bg > .roundOutside3,
.button.success > .bg > .roundOutside3::before {
  background-color: rgba(70, 128, 244, 1);
  z-index: 11;
}
.button.success > .bg > .roundOutside1::after,
.button.success > .bg > .background,
.button.success > .bg > .roundOutside4::after {
  border-top: 1px solid rgba(70, 128, 244, 1);
  border-bottom: 1px solid rgba(70, 128, 244, 1);
  margin: -1px 0;
}
.button.success > .bg > .roundInset1:before,
.button.success > .bg > .roundInset2:before {
  box-shadow: 0 0 0 14px rgba(70, 128, 244, 1);
}
.login > .content {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 2;
}
.login > .content > .title {
  font-size: 24px;
  height: 8%;
  text-align: center;
  color: #333333;
  padding-bottom: 1%;
  word-spacing: 2px;
  margin-top: 12%;
  position: relative;
}
.login > .content > .title > span {
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login > .content > ul {
  width: 100%;
  height: 40%;
  padding: 0 12%;
  margin-bottom: 5%;
  box-sizing: border-box;
}
.login > .content > ul > li {
  padding-top: 10%;
  width: 100%;
  height: 33%;
  box-sizing: border-box;
  border-bottom: 1px solid #dfdfdf;
  padding-left: 16%;
  box-sizing: border-box;
  position: relative;
}
.login > .content > ul > li::before {
  width: 9%;
  height: 0;
  padding-bottom: 9%;
  content: "";
  position: absolute;
  display: block;
  left: 4%;
  bottom: 10%;
  opacity: 0.8;
}
.login > .content > ul > li:nth-child(1):before {
  background: url("../../assets/images/username.png") center/90% 90% no-repeat;
}
.login > .content > ul > li:nth-child(2):before {
  background: url("../../assets/images/password.png") center/90% 90% no-repeat;
}
.login > .content > ul > li:nth-child(3):before {
  background: url("../../assets/images/code.png") center/90% 90% no-repeat;
}
.login > .content > ul > li > input {
  font-size: 16px;
  height: 100%;
  display: block;
  width: 100%;
  margin: 0;
  padding: 0 14% 0 0;
  box-sizing: border-box;
  border: 0;
  background-color: transparent;
  color: #666666;
}
.login > .content > ul > li:nth-child(3) > input {
  width: 50%;
  float: left;
  padding: 0;
}
@media screen and (max-width: 1400px) {
  .login > .content > ul > li > input {
    font-size: 15px;
  }
}
.login > .content > ul > li > input:-moz-placeholder,
.login > .content > ul > li > input::-moz-placeholder {
  color: #cacaca;
  opacity: 1;
}
.login > .content > ul > li > input:-ms-input-placeholder {
  color: #cacaca;
}
.login > .content > ul > li > input::-webkit-input-placeholder {
  color: #cacaca;
}
.login > .content > ul > li:nth-child(3) > i.codeImg {
  display: block;
  float: left;
  position: relative;
  width: 50%;
  height: 100%;
  cursor: pointer;
}
.login > .content > ul > li:nth-child(3) > i.codeImg > img {
  width: 100%;
  height: 95%;
}
.login > .content > u {
  padding: 20px 12% 0;
  display: block;
  text-decoration: none;
  color: #fb5151;
}
.login > .content > u::before {
  content: "";
  display: inline-block;
  margin-right: 5px;
  width: 12px;
  height: 12px;
  margin-top: 1px;
  vertical-align: top;
  background: url("../../assets/images/loginIcon.png") -16px -69px no-repeat;
}
.login > .content > .button {
  position: absolute;
  left: 0;
  width: 78%;
  left: 50%;
  bottom: 15%;
  height: 8.8%;
  border: 0;
  border-radius: 50px;
  color: #fff;
  font-size: 0;
  background-color: rgba(70, 128, 244, 1);
  box-shadow: 0 4px 8px rgba(70, 128, 244, 0.4);
  transition: all 0.1s linear;
  letter-spacing: 5px;
  text-indent: 5px;
  text-align: center;
  margin-bottom: 0;
  margin-left: -39%;
}
.login > .content > .button.AbleClick:hover {
  margin-bottom: 0.8%;
  box-shadow: 0 6px 9px rgba(70, 128, 244, 0.4);
}
.login > .content > .button > div:not(.bg) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  z-index: 12;
}
.login > .content > .button.success > div:not(.bg) {
  transform: translate(-50%, -50%) scale(1.5);
}
.login > .content > .button > span {
  display: block;
  font-size: 16px;
  position: absolute;
  z-index: 13;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login > .content > .button.success > span {
  font-size: 20px;
  padding-top: 40px;
}
.login > .content > .button.success {
  transition: all 0.15s ease-in-out;
  left: 40%;
  bottom: 0;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  transform: translate(0, 0);
  background-color: rgba(70, 128, 244, 0.2);
  box-shadow: 0 6px 12px rgba(0, 11, 131, 0.22);
}
.login > .content > .button.success > span::before {
  width: 245px;
  height: 200px;
  content: "";
  display: block;
  position: absolute;
  top: -120px;
  background: url("../../assets/images/success.png") no-repeat;
  left: 50%;
  transform: translateX(-50%) scale(0.3);
}
.login > .content > .button > i {
  font-size: 20px;
}
/* 蒙版显示隐藏 */
.fade-leave-active {
  -webkit-transition: all 0.4s ease-in-out 0.15s;
  -moz-transition: all 0.4s ease-in-out 0.15s;
  -o-transition: all 0.4s ease-in-out 0.15s;
  transition: all 0.4s ease-in-out 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active {
  -webkit-transition: all 0.2s ease-in-out 0.15s;
  -moz-transition: all 0.2s ease-in-out 0.15s;
  -o-transition: all 0.2s ease-in-out 0.15s;
  transition: all 0.2s ease-in-out 0.15s;
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: scale(0);
}
.error-leave-active,
.error-enter-active {
  -webkit-transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  -o-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.error-enter,
.error-leave-to {
  opacity: 0;
}
.fade1-leave-active,
.fade1-enter-active {
  -webkit-transition: all 0.05s linear;
  -moz-transition: all 0.05s linear;
  -o-transition: all 0.05s linear;
  transition: all 0.05s linear;
}
.fade1-enter,
.fade1-leave-to {
  opacity: 0;
}
</style>
<style>
.login
  > .content
  > ul
  > li:nth-child(3)
  > i.codeImg
  > i.loadingBox
  .el-loading-spinner {
  transform: translateY(-50%) scale(0.6);
}
</style>
