// import Cookies from 'js-cookie'

// const TokenKey = "";
// Cookies.set(TokenKey, 'ssdbsjdsisgui')

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(TokenKey: string) {
  return localStorage.setItem("token", TokenKey);
}

export function setAccountId(accountId: string) {
  return localStorage.setItem("accountId", accountId);
}
export function getAccountId(accountId: string) {
  return localStorage.getItem("accountId");
}
export function setAccountType(accountType: string) {
  return localStorage.setItem("accountType", accountType);
}
export function getAccountType(accountType: string) {
  return localStorage.getItem("accountType");
}


export function removeToken() {
  return localStorage.removeItem("token");
}
export function getLoginName() {
  return localStorage.getItem("loginName");
}
export function setLoginName(value: string) {
  return localStorage.setItem("loginName", value);
}
export function removeLoginName() {
  return localStorage.removeItem("loginName");
}
export function setResorceList(list: any) {
  const this_ = localStorage.setItem("ResorceList", list);
  const changeLimit: any = new Event("changeLimit");
  changeLimit.key = "limit";
  changeLimit.newValue = list;
  window.dispatchEvent(changeLimit);
  return this_;
}
export function getResorceList() {
  return localStorage.getItem("ResorceList");
}
export function removeResorceList() {
  return localStorage.removeItem("ResorceList");
}

export function removeMenus() {
  return localStorage.removeItem("Menus");
}

export function removeLoginInfo() {
  return localStorage.removeItem("loginInfo");
}

export function setColor(v: any) {
  return localStorage.setItem("theme", v);
}
export function getColor() {
  return localStorage.getItem("theme");
}
export function removeColor() {
  return localStorage.removeItem("theme");
}
