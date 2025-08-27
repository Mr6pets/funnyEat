// pages/index/index.js
const { categories, cuisines, dishes, todayRecommendations, getRandomDish } = require('../../data/mockData.js')
const { showToast, randomChoice, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 页面数据
    categories: [],
    cuisines: [],
    todayRecommendations: [],
    
    // 快速选择相关
    isShaking: false,
    showResult: false,
    selectedDish: null,
    
    // 用户偏好
    userPreferences: {}
  },

  onLoad(options) {
    console.log('首页加载', options)
    this.initPageData()
    this.loadUserPreferences()
  },

  onShow() {
    console.log('首页显示')
    // 每次显示页面时刷新今日推荐
    this.refreshTodayRecommendations()
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    // 处理今日推荐数据，添加菜品详情
    const processedRecommendations = todayRecommendations.map(rec => {
      const dish = dishes.find(d => d.id === rec.dishId)
      return {
        ...rec,
        dish: dish || {}
      }
    })



    this.setData({
      categories,
      cuisines,
      todayRecommendations: processedRecommendations
    }, () => {
      console.log('页面数据设置完成:', this.data)
      console.log('=== 数据设置完成 ===')
    })
  },

  /**
   * 加载用户偏好
   */
  loadUserPreferences() {
    const app = getApp()
    const preferences = app.getUserPreferences()
    this.setData({
      userPreferences: preferences
    })
  },

  /**
   * 刷新今日推荐
   */
  refreshTodayRecommendations() {
    // 基于用户偏好和时间生成推荐
    const { userPreferences } = this.data
    let recommendedDishes = [...dishes]
    
    // 根据用户偏好筛选
    if (userPreferences.favoriteCuisines && userPreferences.favoriteCuisines.length > 0) {
      const favoriteDishes = dishes.filter(dish => 
        userPreferences.favoriteCuisines.includes(dish.cuisine)
      )
      if (favoriteDishes.length > 0) {
        recommendedDishes = favoriteDishes
      }
    }
    
    // 随机选择3个推荐
    const shuffled = recommendedDishes.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)
    
    const newRecommendations = selected.map((dish, index) => ({
      id: `rec_${Date.now()}_${index}`,
      dishId: dish.id,
      dish: dish,
      reason: this.getRecommendationReason(dish),
      tag: this.getRecommendationTag(dish, index)
    }))
    
    this.setData({
      todayRecommendations: newRecommendations
    })
  },

  /**
   * 获取推荐理由
   */
  getRecommendationReason(dish) {
    const reasons = [
      '经典美味，值得一试',
      '营养丰富，健康之选',
      '制作简单，新手友好',
      '口感丰富，层次分明',
      '家常美味，温暖人心'
    ]
    return randomChoice(reasons)
  },

  /**
   * 获取推荐标签
   */
  getRecommendationTag(dish, index) {
    const tags = ['热门推荐', '健康推荐', '快手推荐', '经典推荐', '特色推荐']
    return tags[index] || randomChoice(tags)
  },

  /**
   * 点击今日推荐
   */
  onRecommendationTap(e) {
    const { dish } = e.currentTarget.dataset
    console.log('点击推荐菜品:', dish)
    
    // 记录用户行为
    this.recordUserAction('view_recommendation', { dishId: dish.dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${dish.dish.id}`
    })
  },

  /**
   * 快速选择（摇一摇）
   */
  onQuickChoice() {
    if (this.data.isShaking) return
    
    console.log('快速选择')
    
    this.setData({ isShaking: true })
    
    // 添加震动反馈
    wx.vibrateShort({
      type: 'medium'
    })
    
    // 模拟选择过程
    setTimeout(() => {
      const { userPreferences } = this.data
      
      // 根据用户偏好获取随机菜品
      const filters = {
        maxCookingTime: userPreferences.maxCookingTime,
        difficulty: userPreferences.difficultyLevel
      }
      
      if (userPreferences.favoriteCuisines && userPreferences.favoriteCuisines.length > 0) {
        filters.cuisine = randomChoice(userPreferences.favoriteCuisines)
      }
      
      const randomDish = getRandomDish(filters)
      
      this.setData({
        isShaking: false,
        selectedDish: randomDish,
        showResult: true
      })
      
      // 记录用户行为
      this.recordUserAction('quick_choice', { dishId: randomDish.id })
      
      // 添加成功反馈
      wx.vibrateShort({
        type: 'light'
      })
      
    }, 1500)
  },

  /**
   * 关闭结果弹窗
   */
  onCloseResult() {
    this.setData({
      showResult: false,
      selectedDish: null
    })
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  /**
   * 查看详情
   */
  onViewDetail() {
    const { selectedDish } = this.data
    if (!selectedDish) return
    
    this.onCloseResult()
    
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${selectedDish.id}`
    })
  },

  /**
   * 点击分类
   */
  onCategoryTap(e) {
    const dataset = e.currentTarget.dataset
    const { category, categoryId, categoryName } = dataset
    console.log('点击分类 - 完整数据集:', dataset)
    console.log('点击分类 - category对象:', category)
    
    let finalCategory = category
    
    // 如果category对象为空，尝试从单独的属性构建
    if (!category && categoryId && categoryName) {
      finalCategory = {
        id: categoryId,
        name: categoryName
      }
      console.log('使用备用数据构建分类对象:', finalCategory)
    }
    
    // 添加调试信息
    if (!finalCategory) {
      console.error('分类数据为空:', dataset)
      wx.showToast({
        title: '分类数据错误',
        icon: 'none'
      })
      return
    }
    
    if (!finalCategory.id || !finalCategory.name) {
      console.error('分类数据不完整:', finalCategory)
      wx.showToast({
        title: '分类数据不完整',
        icon: 'none'
      })
      return
    }
    
    // 记录用户行为
    this.recordUserAction('browse_category', { category: finalCategory.id })
    
    // 跳转到选择页面，传递分类参数
    wx.navigateTo({
      url: `/pages/choose/choose?category=${finalCategory.id}&categoryName=${encodeURIComponent(finalCategory.name)}`
    })
  },

  /**
   * 点击菜系
   */
  onCuisineTap(e) {
    const { cuisine } = e.currentTarget.dataset
    console.log('点击菜系:', cuisine)
    
    // 记录用户行为
    this.recordUserAction('browse_cuisine', { cuisine: cuisine.id })
    
    // 跳转到选择页面，传递菜系参数
    wx.navigateTo({
      url: `/pages/choose/choose?cuisine=${cuisine.id}&cuisineName=${cuisine.name}`
    })
  },



  /**
   * 记录用户行为
   */
  recordUserAction(action, data = {}) {
    try {
      // 获取历史行为记录
      const actions = getStorage('userActions', [])
      
      // 添加新行为
      actions.push({
        action,
        data,
        timestamp: Date.now(),
        page: 'index'
      })
      
      // 保持最近100条记录
      if (actions.length > 100) {
        actions.splice(0, actions.length - 100)
      }
      
      // 保存到本地
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
    
    this.refreshTodayRecommendations()
    
    // 停止下拉刷新
    setTimeout(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功')
    }, 1000)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: 'funnyEat - 今天吃什么不再是难题！',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'funnyEat - 每天吃什么的精简助手',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})