import store from '@/store'

export const baseUrls = (store.getters.menuList
  ? store.getters.menuList
  : []
).map((v: any) => {
  return {
    baseUrl: v.url,
    redirect: v.children.length > 0 ? v.children[0].url : v.url,
  }
})

export function findBase(url: any) {
  const res = baseUrls.filter((v: any) => {
    return v.baseUrl === url
  })
  return res.length > 0 ? res[0].redirect : '/reception'
}
