// pages/profile/profile.js
const { dishes, getRandomDish } = require('../../data/mockData.js')
const { formatTime, showToast, showSuccess, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 用户信息
    userInfo: {},
    
    // 统计数据
    stats: {
      historyCount: 0,
      favoriteCount: 0,
      cookingCount: 0
    },
    
    // 最近浏览
    recentDishes: [],
    
    // 推荐菜品
    recommendDishes: [],
    
    // 弹窗状态
    showAuthModal: false,
    showShareModal: false
  },

  onLoad(options) {
    console.log('个人中心页面加载', options)
    this.initUserInfo()
    this.loadUserStats()
    this.loadRecentDishes()
    this.loadRecommendDishes()
  },

  onShow() {
    console.log('个人中心页面显示')
    // 每次显示时刷新数据
    this.loadUserStats()
    this.loadRecentDishes()
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    const app = getApp()
    const userInfo = app.globalData.userInfo || getStorage('userInfo', {})
    
    this.setData({ userInfo })
  },

  /**
   * 加载用户统计数据
   */
  loadUserStats() {
    try {
      // 获取历史记录数量
      const history = getStorage('userHistory', [])
      const historyCount = history.length
      
      // 获取收藏数量
      const favorites = getStorage('userFavorites', [])
      const favoriteCount = favorites.length
      
      // 获取制作次数（从用户行为记录中统计）
      const actions = getStorage('userActions', [])
      const cookingCount = actions.filter(action => action.action === 'start_cooking').length
      
      this.setData({
        stats: {
          historyCount,
          favoriteCount,
          cookingCount
        }
      })
      
    } catch (error) {
      console.error('加载用户统计数据失败:', error)
    }
  },

  /**
   * 加载最近浏览
   */
  loadRecentDishes() {
    try {
      const history = getStorage('userHistory', [])
      
      // 取最近5条记录
      const recentHistory = history.slice(0, 5)
      
      // 处理时间显示
      const recentDishes = recentHistory.map(item => {
        const timeText = this.formatTimeText(item.selectTime)
        return {
          ...item,
          timeText
        }
      })
      
      this.setData({ recentDishes })
      
    } catch (error) {
      console.error('加载最近浏览失败:', error)
    }
  },

  /**
   * 加载推荐菜品
   */
  loadRecommendDishes() {
    try {
      // 基于用户偏好和历史记录推荐
      const app = getApp()
      const userPreferences = app.getUserPreferences()
      const history = getStorage('userHistory', [])
      const favorites = getStorage('userFavorites', [])
      
      let recommendDishes = []
      
      // 如果有偏好设置，基于偏好推荐
      if (userPreferences.favoriteCuisines && userPreferences.favoriteCuisines.length > 0) {
        recommendDishes = dishes.filter(dish => 
          userPreferences.favoriteCuisines.includes(dish.cuisine)
        )
      }
      
      // 如果推荐不足，基于历史记录推荐相似菜品
      if (recommendDishes.length < 3 && history.length > 0) {
        const historyCategories = [...new Set(history.map(item => item.dish?.category).filter(Boolean))]
        const categoryDishes = dishes.filter(dish => 
          historyCategories.includes(dish.category) &&
          !history.find(h => h.dish?.id === dish.id)
        )
        recommendDishes = recommendDishes.concat(categoryDishes)
      }
      
      // 如果还是不足，随机推荐
      if (recommendDishes.length < 3) {
        const remainingDishes = dishes.filter(dish => 
          !recommendDishes.find(r => r.id === dish.id) &&
          !history.find(h => h.dish?.id === dish.id) &&
          !favorites.find(f => (f.dishId || f.id) === dish.id)
        )
        recommendDishes = recommendDishes.concat(remainingDishes)
      }
      
      // 随机排序并取前3个
      recommendDishes = recommendDishes
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
      
      this.setData({ recommendDishes })
      
    } catch (error) {
      console.error('加载推荐菜品失败:', error)
    }
  },

  /**
   * 格式化时间文本
   */
  formatTimeText(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    
    if (diff < minute) {
      return '刚刚'
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`
    } else if (diff < 7 * day) {
      return `${Math.floor(diff / day)}天前`
    } else {
      return formatTime(new Date(timestamp), 'MM-DD')
    }
  },

  /**
   * 获取用户信息
   */
  onGetUserInfo() {
    const { userInfo } = this.data
    
    if (!userInfo.nickName) {
      this.setData({ showAuthModal: true })
    }
  },

  /**
   * 获取用户资料
   */
  onGetUserProfile(e) {
    console.log('获取用户资料:', e.detail)
    
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo
      
      // 保存用户信息
      const app = getApp()
      app.globalData.userInfo = userInfo
      setStorage('userInfo', userInfo)
      
      this.setData({
        userInfo,
        showAuthModal: false
      })
      
      showSuccess('登录成功')
      
      // 记录用户行为
      this.recordUserAction('user_login', { nickName: userInfo.nickName })
      
    } else {
      showToast('授权失败，请重试')
    }
  },

  /**
   * 关闭授权弹窗
   */
  onCloseAuthModal() {
    this.setData({ showAuthModal: false })
  },

  /**
   * 导航到历史记录
   */
  onNavigateToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },

  /**
   * 导航到收藏页面
   */
  onNavigateToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  /**
   * 导航到设置页面
   */
  onNavigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  /**
   * 随机推荐
   */
  onRandomChoice() {
    const app = getApp()
    const userPreferences = app.getUserPreferences()
    
    // 根据用户偏好获取随机菜品
    const filters = {}
    if (userPreferences.favoriteCuisines && userPreferences.favoriteCuisines.length > 0) {
      const randomCuisine = userPreferences.favoriteCuisines[
        Math.floor(Math.random() * userPreferences.favoriteCuisines.length)
      ]
      filters.cuisine = randomCuisine
    }
    
    const randomDish = getRandomDish(filters)
    
    if (randomDish) {
      // 记录用户行为
      this.recordUserAction('random_choice_from_profile', { dishId: randomDish.id })
      
      // 跳转到详情页
      wx.navigateTo({
        url: `/pages/detail/detail?dishId=${randomDish.id}`
      })
    } else {
      showToast('暂无推荐菜品')
    }
  },

  /**
   * 分享应用
   */
  onShareApp() {
    this.setData({ showShareModal: true })
  },

  /**
   * 关闭分享弹窗
   */
  onCloseShareModal() {
    this.setData({ showShareModal: false })
  },

  /**
   * 意见反馈
   */
  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！您可以通过以下方式联系我们：\n\n• 微信群：搜索"funnyEat用户群"\n• 邮箱：feedback@funnyeat.com\n• 客服电话：400-123-4567',
      showCancel: false,
      confirmText: '知道了'
    })
    
    // 记录用户行为
    this.recordUserAction('feedback_click')
  },

  /**
   * 关于我们
   */
  onAbout() {
    wx.showModal({
      title: '关于 funnyEat',
      content: 'funnyEat v1.0.0\n\n一个精简实用的"每天吃什么"小程序，致力于解决选择困难症，让美食选择变得简单有趣。\n\n© 2024 funnyEat Team',
      showCancel: false,
      confirmText: '知道了'
    })
    
    // 记录用户行为
    this.recordUserAction('about_click')
  },

  /**
   * 点击最近浏览
   */
  onRecentTap(e) {
    const { dish } = e.currentTarget.dataset
    console.log('点击最近浏览:', dish)
    
    // 记录用户行为
    this.recordUserAction('view_recent', { dishId: dish.dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${dish.dish.id}`
    })
  },

  /**
   * 点击推荐菜品
   */
  onRecommendTap(e) {
    const { dish } = e.currentTarget.dataset
    console.log('点击推荐菜品:', dish)
    
    // 记录用户行为
    this.recordUserAction('view_recommend', { dishId: dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${dish.id}`
    })
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  /**
   * 记录用户行为
   */
  recordUserAction(action, data = {}) {
    try {
      const actions = getStorage('userActions', [])
      
      actions.push({
        action,
        data,
        timestamp: Date.now(),
        page: 'profile'
      })
      
      if (actions.length > 100) {
        actions.splice(0, actions.length - 100)
      }
      
      setStorage('userActions', actions)
      
      console.log('记录用户行为:', action, data)
    } catch (error) {
      console.error('记录用户行为失败:', error)
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    console.log('下拉刷新')
    
    // 刷新所有数据
    this.initUserInfo()
    this.loadUserStats()
    this.loadRecentDishes()
    this.loadRecommendDishes()
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功')
    }, 1000)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { userInfo } = this.data
    const title = userInfo.nickName 
      ? `${userInfo.nickName} 邀请你一起使用 funnyEat`
      : 'funnyEat - 每天吃什么不再是难题！'
    
    // 记录分享行为
    this.recordUserAction('share_app')
    
    return {
      title,
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    // 记录分享行为
    this.recordUserAction('share_timeline')
    
    return {
      title: 'funnyEat - 让美食选择变得简单有趣',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})