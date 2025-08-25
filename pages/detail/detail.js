// pages/detail/detail.js
const { dishes } = require('../../data/mockData.js')
const { showToast, showSuccess, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 菜品信息
    dish: {},
    dishImages: [],
    
    // 相关推荐
    relatedDishes: [],
    
    // 交互状态
    showPreview: false,
    previewUrl: '',
    showCookingModal: false,
    
    // 收藏状态
    favoriteIds: []
  },

  onLoad(options) {
    console.log('详情页面加载', options)
    const { dishId } = options
    if (dishId) {
      this.loadDishDetail(dishId)
      this.loadRelatedDishes(dishId)
    } else {
      showToast('菜品信息不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
    
    this.loadFavorites()
  },

  onShow() {
    console.log('详情页面显示')
    // 刷新收藏状态
    this.loadFavorites()
  },

  /**
   * 加载菜品详情
   */
  loadDishDetail(dishId) {
    const dish = dishes.find(d => d.id === dishId)
    
    if (!dish) {
      showToast('菜品不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    // 处理图片数组
    const dishImages = dish.imageUrl ? [dish.imageUrl] : []
    
    // 添加收藏状态
    const favoriteIds = getStorage('userFavorites', []).map(item => item.dishId || item.id)
    dish.isFavorite = favoriteIds.includes(dish.id)
    
    this.setData({
      dish,
      dishImages
    })
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: dish.name
    })
    
    // 记录用户行为
    this.recordUserAction('view_detail', { dishId: dish.id })
  },

  /**
   * 加载相关推荐
   */
  loadRelatedDishes(currentDishId) {
    const currentDish = dishes.find(d => d.id === currentDishId)
    if (!currentDish) return
    
    // 根据分类和菜系推荐相关菜品
    let related = dishes.filter(dish => {
      if (dish.id === currentDishId) return false
      
      // 优先推荐同分类或同菜系的菜品
      return dish.category === currentDish.category || 
             dish.cuisine === currentDish.cuisine
    })
    
    // 如果相关菜品不足，补充其他菜品
    if (related.length < 3) {
      const others = dishes.filter(dish => 
        dish.id !== currentDishId && 
        !related.find(r => r.id === dish.id)
      )
      related = related.concat(others)
    }
    
    // 随机排序并取前5个
    related = related.sort(() => 0.5 - Math.random()).slice(0, 5)
    
    this.setData({
      relatedDishes: related
    })
  },

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    const favorites = getStorage('userFavorites', [])
    const favoriteIds = favorites.map(item => item.dishId || item.id)
    
    // 更新当前菜品的收藏状态
    const { dish } = this.data
    if (dish.id) {
      dish.isFavorite = favoriteIds.includes(dish.id)
      this.setData({ dish, favoriteIds })
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack()
  },

  /**
   * 切换收藏状态
   */
  onToggleFavorite() {
    const { dish, favoriteIds } = this.data
    const isFavorite = favoriteIds.includes(dish.id)
    
    let newFavoriteIds = [...favoriteIds]
    let favorites = getStorage('userFavorites', [])
    
    if (isFavorite) {
      // 取消收藏
      newFavoriteIds = newFavoriteIds.filter(id => id !== dish.id)
      favorites = favorites.filter(item => (item.dishId || item.id) !== dish.id)
      showToast('已取消收藏')
    } else {
      // 添加收藏
      newFavoriteIds.push(dish.id)
      favorites.push({
        dishId: dish.id,
        favoriteTime: Date.now(),
        dish: dish
      })
      showSuccess('已添加收藏')
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
    }
    
    // 更新本地存储
    setStorage('userFavorites', favorites)
    
    // 更新页面状态
    dish.isFavorite = !isFavorite
    this.setData({
      dish,
      favoriteIds: newFavoriteIds
    })
    
    // 记录用户行为
    this.recordUserAction(isFavorite ? 'remove_favorite' : 'add_favorite', {
      dishId: dish.id
    })
  },

  /**
   * 预览图片
   */
  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset
    const { dishImages } = this.data
    
    wx.previewImage({
      current: url,
      urls: dishImages
    })
  },

  /**
   * 关闭图片预览
   */
  onClosePreview() {
    this.setData({
      showPreview: false,
      previewUrl: ''
    })
  },

  /**
   * 加入历史记录
   */
  onAddToHistory() {
    const { dish } = this.data
    
    try {
      // 获取历史记录
      let history = getStorage('userHistory', [])
      
      // 检查是否已存在
      const existingIndex = history.findIndex(item => 
        (item.dishId || item.id) === dish.id
      )
      
      if (existingIndex >= 0) {
        // 更新时间并移到最前面
        history.splice(existingIndex, 1)
      }
      
      // 添加到历史记录开头
      history.unshift({
        dishId: dish.id,
        selectTime: Date.now(),
        source: 'detail',
        dish: dish
      })
      
      // 保持最近50条记录
      if (history.length > 50) {
        history = history.slice(0, 50)
      }
      
      // 保存到本地
      setStorage('userHistory', history)
      
      showSuccess('已加入历史记录')
      
      // 记录用户行为
      this.recordUserAction('add_to_history', { dishId: dish.id })
      
    } catch (error) {
      console.error('加入历史记录失败:', error)
      showToast('操作失败，请重试')
    }
  },

  /**
   * 开始制作
   */
  onStartCooking() {
    this.setData({ showCookingModal: true })
  },

  /**
   * 关闭制作弹窗
   */
  onCloseCookingModal() {
    this.setData({ showCookingModal: false })
  },

  /**
   * 确认开始制作
   */
  onConfirmCooking() {
    const { dish } = this.data
    
    this.onCloseCookingModal()
    
    // 添加到历史记录
    this.onAddToHistory()
    
    // 记录制作行为
    this.recordUserAction('start_cooking', { 
      dishId: dish.id,
      cookingTime: dish.cookingTime
    })
    
    showSuccess(`开始制作《${dish.name}》！`)
    
    // 震动反馈
    wx.vibrateShort({ type: 'medium' })
    
    // 可以在这里添加制作计时器或其他功能
    setTimeout(() => {
      showToast('制作愉快！记得按步骤操作哦~')
    }, 2000)
  },

  /**
   * 点击相关推荐
   */
  onRelatedTap(e) {
    const { dish } = e.currentTarget.dataset
    console.log('点击相关推荐:', dish)
    
    // 记录用户行为
    this.recordUserAction('view_related', { 
      fromDishId: this.data.dish.id,
      toDishId: dish.id
    })
    
    // 跳转到新的详情页
    wx.redirectTo({
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
        page: 'detail'
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
    
    // 重新加载菜品信息
    const { dish } = this.data
    if (dish.id) {
      this.loadDishDetail(dish.id)
      this.loadRelatedDishes(dish.id)
    }
    
    // 刷新收藏状态
    this.loadFavorites()
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功')
    }, 1000)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { dish } = this.data
    return {
      title: `${dish.name} - 来看看这道美味的制作方法！`,
      path: `/pages/detail/detail?dishId=${dish.id}`,
      imageUrl: dish.imageUrl || '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { dish } = this.data
    return {
      title: `${dish.name} - funnyEat美食推荐`,
      imageUrl: dish.imageUrl || '/images/share-cover.jpg'
    }
  },

  /**
   * 页面卸载
   */
  onUnload() {
    console.log('详情页面卸载')
    // 清理定时器等资源
  }
})