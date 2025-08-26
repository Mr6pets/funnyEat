// pages/settings/settings.js
const { cuisines, preferenceOptions } = require('../../data/mockData.js')
const { showToast, showSuccess, setStorage, getStorage } = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    // 选项数据
    cuisineOptions: [],
    difficultyOptions: [],
    ingredientOptions: [],
    
    // 语言设置
    currentLanguage: 'zh',
    
    // 用户偏好设置
    preferences: {
      favoriteCuisines: [],
      dislikedIngredients: [],
      difficultyLevel: '简单',
      maxCookingTime: 60,
      vegetarianOnly: false,
      smartRecommend: true,
      seasonalRecommend: true
    },
    
    // 原始偏好（用于重置）
    originalPreferences: {},
    
    // 弹窗状态
    showResetModal: false,
    
    // 是否有变更
    hasChanges: false
  },

  onLoad(options) {
    console.log('设置页面加载', options)
    this.initOptionsData()
    this.loadUserPreferences()
    this.initLanguage()
  },

  onShow() {
    console.log('设置页面显示')
  },

  /**
   * 初始化选项数据
   */
  initOptionsData() {
    this.setData({
      cuisineOptions: cuisines,
      difficultyOptions: preferenceOptions.difficulties,
      ingredientOptions: preferenceOptions.commonIngredients
    })
  },

  /**
   * 加载用户偏好设置
   */
  loadUserPreferences() {
    try {
      const app = getApp()
      const userPreferences = app.getUserPreferences()
      
      // 合并默认设置和用户设置
      const preferences = {
        ...this.data.preferences,
        ...userPreferences
      }
      
      this.setData({
        preferences,
        originalPreferences: JSON.parse(JSON.stringify(preferences))
      })
      
    } catch (error) {
      console.error('加载用户偏好失败:', error)
    }
  },

  /**
   * 菜系选择
   */
  onCuisineTap(e) {
    const { cuisine } = e.currentTarget.dataset
    const { preferences } = this.data
    
    let favoriteCuisines = [...preferences.favoriteCuisines]
    
    if (favoriteCuisines.includes(cuisine)) {
      // 取消选择
      favoriteCuisines = favoriteCuisines.filter(c => c !== cuisine)
    } else {
      // 添加选择
      favoriteCuisines.push(cuisine)
    }
    
    this.updatePreferences({ favoriteCuisines })
    
    // 记录用户行为
    this.recordUserAction('select_cuisine', { 
      cuisine, 
      selected: favoriteCuisines.includes(cuisine)
    })
  },

  /**
   * 难度选择
   */
  onDifficultyTap(e) {
    const { difficulty } = e.currentTarget.dataset
    
    this.updatePreferences({ difficultyLevel: difficulty })
    
    // 记录用户行为
    this.recordUserAction('select_difficulty', { difficulty })
  },

  /**
   * 时间滑块变化
   */
  onTimeChange(e) {
    const maxCookingTime = e.detail.value
    
    this.updatePreferences({ maxCookingTime })
    
    // 记录用户行为
    this.recordUserAction('change_cooking_time', { maxCookingTime })
  },

  /**
   * 食材选择
   */
  onIngredientTap(e) {
    const { ingredient } = e.currentTarget.dataset
    const { preferences } = this.data
    
    let dislikedIngredients = [...preferences.dislikedIngredients]
    
    if (dislikedIngredients.includes(ingredient)) {
      // 取消选择
      dislikedIngredients = dislikedIngredients.filter(i => i !== ingredient)
    } else {
      // 添加选择
      dislikedIngredients.push(ingredient)
    }
    
    this.updatePreferences({ dislikedIngredients })
    
    // 记录用户行为
    this.recordUserAction('select_ingredient', { 
      ingredient, 
      disliked: dislikedIngredients.includes(ingredient)
    })
  },

  /**
   * 素食主义切换
   */
  onVegetarianToggle(e) {
    const vegetarianOnly = e.detail ? e.detail.value : !this.data.preferences.vegetarianOnly
    
    this.updatePreferences({ vegetarianOnly })
    
    // 记录用户行为
    this.recordUserAction('toggle_vegetarian', { vegetarianOnly })
  },

  /**
   * 智能推荐切换
   */
  onSmartRecommendToggle(e) {
    const smartRecommend = e.detail ? e.detail.value : !this.data.preferences.smartRecommend
    
    this.updatePreferences({ smartRecommend })
    
    // 记录用户行为
    this.recordUserAction('toggle_smart_recommend', { smartRecommend })
  },

  /**
   * 时令推荐切换
   */
  onSeasonalToggle(e) {
    const seasonalRecommend = e.detail ? e.detail.value : !this.data.preferences.seasonalRecommend
    
    this.updatePreferences({ seasonalRecommend })
    
    // 记录用户行为
    this.recordUserAction('toggle_seasonal_recommend', { seasonalRecommend })
  },

  /**
   * 初始化语言设置
   */
  initLanguage() {
    const currentLanguage = app.getCurrentLanguage()
    this.setData({ currentLanguage })
  },

  /**
   * 语言切换
   */
  onLanguageTap(e) {
    const { language } = e.currentTarget.dataset
    const success = app.switchLanguage(language)
    
    if (success) {
      this.setData({ currentLanguage: language })
      showSuccess(language === 'zh' ? '语言已切换为中文' : 'Language switched to English')
      
      // 记录用户行为
      this.recordUserAction('switch_language', { language })
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
    } else {
      showToast('语言切换失败')
    }
  },

  /**
   * 语言变更回调
   */
  onLanguageChange() {
    // 页面重新渲染时更新语言状态
    this.initLanguage()
    this.setData({})
  },

  /**
   * 获取翻译文本
   */
  t(key, params) {
    return app.t(key, params)
  },

  /**
   * 更新偏好设置
   */
  updatePreferences(updates) {
    const { preferences } = this.data
    const newPreferences = { ...preferences, ...updates }
    
    this.setData({
      preferences: newPreferences,
      hasChanges: true
    })
  },

  /**
   * 保存设置
   */
  onSaveSettings() {
    try {
      const { preferences } = this.data
      
      // 保存到全局状态
      const app = getApp()
      app.saveUserPreferences(preferences)
      
      // 更新原始偏好
      this.setData({
        originalPreferences: JSON.parse(JSON.stringify(preferences)),
        hasChanges: false
      })
      
      showSuccess('设置已保存')
      
      // 记录用户行为
      this.recordUserAction('save_preferences', { preferences })
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
      
    } catch (error) {
      console.error('保存设置失败:', error)
      showToast('保存失败，请重试')
    }
  },

  /**
   * 重置设置
   */
  onResetSettings() {
    this.setData({ showResetModal: true })
  },

  /**
   * 关闭重置弹窗
   */
  onCloseResetModal() {
    this.setData({ showResetModal: false })
  },

  /**
   * 确认重置
   */
  onConfirmReset() {
    try {
      // 恢复默认设置
      const defaultPreferences = {
        favoriteCuisines: [],
        dislikedIngredients: [],
        difficultyLevel: '简单',
        maxCookingTime: 60,
        vegetarianOnly: false,
        smartRecommend: true,
        seasonalRecommend: true
      }
      
      this.setData({
        preferences: defaultPreferences,
        hasChanges: true,
        showResetModal: false
      })
      
      showSuccess('已恢复默认设置')
      
      // 记录用户行为
      this.recordUserAction('reset_preferences')
      
    } catch (error) {
      console.error('重置设置失败:', error)
      showToast('重置失败，请重试')
    }
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
        page: 'settings'
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
   * 页面卸载前检查
   */
  onUnload() {
    const { hasChanges } = this.data
    
    if (hasChanges) {
      wx.showModal({
        title: '提示',
        content: '你有未保存的设置，确定要离开吗？',
        success: (res) => {
          if (res.confirm) {
            // 用户确认离开，不保存设置
            console.log('用户放弃保存设置')
          } else {
            // 用户取消离开，阻止页面卸载
            return false
          }
        }
      })
    }
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '个性化设置让美食推荐更精准 - funnyEat',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'funnyEat - 个性化美食推荐助手',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})