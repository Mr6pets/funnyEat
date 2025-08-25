// pages/history/history.js
const { formatTime, showToast, showSuccess, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 历史记录数据
    historyList: [],
    filteredList: [],
    
    // 筛选条件
    currentFilter: 'all',
    
    // 状态
    isLoading: false,
    showClearModal: false,
    
    // 收藏状态
    favoriteIds: []
  },

  onLoad(options) {
    console.log('历史记录页面加载', options)
    this.loadHistoryData()
    this.loadFavorites()
  },

  onShow() {
    console.log('历史记录页面显示')
    // 刷新数据
    this.loadHistoryData()
    this.loadFavorites()
  },

  /**
   * 加载历史记录数据
   */
  loadHistoryData() {
    this.setData({ isLoading: true })
    
    try {
      const history = getStorage('userHistory', [])
      
      // 处理历史记录数据
      const processedHistory = history.map((item, index) => {
        return {
          id: item.id || `history_${index}_${item.selectTime}`,
          ...item,
          timeText: this.formatTimeText(item.selectTime),
          sourceText: this.getSourceText(item.source)
        }
      })
      
      // 按时间倒序排列
      processedHistory.sort((a, b) => b.selectTime - a.selectTime)
      
      this.setData({
        historyList: processedHistory,
        isLoading: false
      })
      
      // 应用当前筛选条件
      this.applyFilter()
      
    } catch (error) {
      console.error('加载历史记录失败:', error)
      this.setData({ isLoading: false })
      showToast('加载失败，请重试')
    }
  },

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    const favorites = getStorage('userFavorites', [])
    const favoriteIds = favorites.map(item => item.dishId || item.id)
    
    // 更新历史记录中的收藏状态
    const { historyList } = this.data
    const updatedHistory = historyList.map(item => ({
      ...item,
      dish: {
        ...item.dish,
        isFavorite: favoriteIds.includes(item.dish.id)
      }
    }))
    
    this.setData({
      favoriteIds,
      historyList: updatedHistory
    })
    
    // 重新应用筛选
    this.applyFilter()
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
      return formatTime(new Date(timestamp), 'MM-DD HH:mm')
    }
  },

  /**
   * 获取来源文本
   */
  getSourceText(source) {
    const sourceMap = {
      'random': '随机推荐',
      'category': '分类浏览',
      'cuisine': '菜系浏览',
      'search': '搜索结果',
      'recommendation': '今日推荐',
      'detail': '详情页面',
      'favorite': '收藏列表'
    }
    return sourceMap[source] || '未知来源'
  },

  /**
   * 筛选条件点击
   */
  onFilterTap(e) {
    const { filter } = e.currentTarget.dataset
    
    this.setData({ currentFilter: filter })
    this.applyFilter()
    
    // 记录用户行为
    this.recordUserAction('filter_history', { filter })
  },

  /**
   * 应用筛选条件
   */
  applyFilter() {
    const { historyList, currentFilter } = this.data
    let filteredList = [...historyList]
    
    const now = Date.now()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()
    
    const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000
    
    switch (currentFilter) {
      case 'today':
        filteredList = historyList.filter(item => item.selectTime >= todayStart)
        break
      case 'week':
        filteredList = historyList.filter(item => item.selectTime >= weekStart)
        break
      case 'all':
      default:
        filteredList = historyList
        break
    }
    
    this.setData({ filteredList })
  },

  /**
   * 点击历史记录
   */
  onHistoryTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('点击历史记录:', item)
    
    // 记录用户行为
    this.recordUserAction('view_history_item', { dishId: item.dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${item.dish.id}`
    })
  },

  /**
   * 切换收藏状态
   */
  onToggleFavorite(e) {
    const { dishId } = e.currentTarget.dataset
    const { favoriteIds, historyList } = this.data
    
    const isFavorite = favoriteIds.includes(dishId)
    let newFavoriteIds = [...favoriteIds]
    
    // 找到对应的菜品
    const historyItem = historyList.find(item => item.dish.id === dishId)
    if (!historyItem) return
    
    const dish = historyItem.dish
    
    if (isFavorite) {
      // 取消收藏
      newFavoriteIds = newFavoriteIds.filter(id => id !== dishId)
      
      const favorites = getStorage('userFavorites', [])
      const updatedFavorites = favorites.filter(item => 
        (item.dishId || item.id) !== dishId
      )
      setStorage('userFavorites', updatedFavorites)
      
      showToast('已取消收藏')
    } else {
      // 添加收藏
      newFavoriteIds.push(dishId)
      
      const favorites = getStorage('userFavorites', [])
      favorites.push({
        dishId: dish.id,
        favoriteTime: Date.now(),
        dish: dish
      })
      setStorage('userFavorites', favorites)
      
      showSuccess('已添加收藏')
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
    }
    
    // 更新页面状态
    const updatedHistory = historyList.map(item => ({
      ...item,
      dish: {
        ...item.dish,
        isFavorite: item.dish.id === dishId ? !isFavorite : item.dish.isFavorite
      }
    }))
    
    this.setData({
      favoriteIds: newFavoriteIds,
      historyList: updatedHistory
    })
    
    // 重新应用筛选
    this.applyFilter()
    
    // 记录用户行为
    this.recordUserAction(isFavorite ? 'remove_favorite' : 'add_favorite', {
      dishId,
      from: 'history'
    })
  },

  /**
   * 删除单条历史记录
   */
  onDeleteHistory(e) {
    const { itemId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteHistoryItem(itemId)
        }
      }
    })
  },

  /**
   * 删除历史记录项
   */
  deleteHistoryItem(itemId) {
    try {
      const history = getStorage('userHistory', [])
      const updatedHistory = history.filter(item => {
        const id = item.id || `history_${history.indexOf(item)}_${item.selectTime}`
        return id !== itemId
      })
      
      setStorage('userHistory', updatedHistory)
      
      // 重新加载数据
      this.loadHistoryData()
      
      showSuccess('删除成功')
      
      // 记录用户行为
      this.recordUserAction('delete_history_item', { itemId })
      
    } catch (error) {
      console.error('删除历史记录失败:', error)
      showToast('删除失败，请重试')
    }
  },

  /**
   * 清空历史记录
   */
  onClearHistory() {
    if (this.data.historyList.length === 0) {
      showToast('暂无历史记录')
      return
    }
    
    this.setData({ showClearModal: true })
  },

  /**
   * 关闭清空弹窗
   */
  onCloseClearModal() {
    this.setData({ showClearModal: false })
  },

  /**
   * 确认清空
   */
  onConfirmClear() {
    try {
      setStorage('userHistory', [])
      
      this.setData({
        historyList: [],
        filteredList: [],
        showClearModal: false
      })
      
      showSuccess('历史记录已清空')
      
      // 记录用户行为
      this.recordUserAction('clear_all_history')
      
    } catch (error) {
      console.error('清空历史记录失败:', error)
      showToast('清空失败，请重试')
    }
  },

  /**
   * 去首页
   */
  onGoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击操作按钮时触发列表项点击
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
        page: 'history'
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
    
    this.loadHistoryData()
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
    return {
      title: '我的美食浏览记录 - funnyEat',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'funnyEat - 记录每一次美食探索',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})