// app.js
const { i18n } = require('./utils/i18n')

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })
  },
  
  onShow() {
    // 应用被用户从后台切换到前台时触发
    console.log('应用切换到前台')
  },
  
  onHide() {
    // 应用从前台切换到后台时触发
    console.log('应用切换到后台')
  },
  
  globalData: {
    userInfo: null,
    // 国际化实例
    i18n: i18n,
    // 用户偏好设置
    userPreferences: {
      favoriteCuisines: [],
      dislikedIngredients: [],
      difficultyLevel: '简单',
      maxCookingTime: 60,
      vegetarianOnly: false
    },
    // 应用配置
    appConfig: {
      version: '1.0.0',
      apiBaseUrl: 'https://your-cloud-function-url',
      defaultPageSize: 10
    }
  },
  
  // 全局方法
  // 获取用户信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            this.globalData.userInfo = res.userInfo
            resolve(res.userInfo)
          },
          fail: reject
        })
      }
    })
  },
  
  // 保存用户偏好
  saveUserPreferences(preferences) {
    this.globalData.userPreferences = { ...this.globalData.userPreferences, ...preferences }
    wx.setStorageSync('userPreferences', this.globalData.userPreferences)
  },
  
  // 获取用户偏好
  getUserPreferences() {
    const stored = wx.getStorageSync('userPreferences')
    if (stored) {
      this.globalData.userPreferences = stored
    }
    return this.globalData.userPreferences
  },
  
  // 切换语言
  switchLanguage(lang) {
    const success = this.globalData.i18n.setLanguage(lang)
    if (success) {
      // 触发页面重新渲染
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page.onLanguageChange && typeof page.onLanguageChange === 'function') {
          page.onLanguageChange()
        }
      })
    }
    return success
  },
  
  // 获取当前语言
  getCurrentLanguage() {
    return this.globalData.i18n.getCurrentLanguage()
  },
  
  // 获取翻译文本
  t(key, params) {
    return this.globalData.i18n.t(key, params)
  }
})