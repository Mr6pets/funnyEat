// pages/favorites/favorites.js
const { formatTime, showToast, showSuccess, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 收藏数据
    favoritesList: [],
    sortedList: [],
    
    // 排序方式
    currentSort: 'time',
    
    // 管理状态
    isManaging: false,
    selectedCount: 0,
    
    // 弹窗状态
    showDeleteModal: false,
    deleteType: 'single', // single | batch
    deleteTarget: null,
    
    // 状态
    isLoading: false
  },

  onLoad(options) {
    console.log('收藏页面加载', options)
    this.loadFavoritesData()
  },

  onShow() {
    console.log('收藏页面显示')
    // 刷新数据
    this.loadFavoritesData()
  },

  /**
   * 加载收藏数据
   */
  loadFavoritesData() {
    this.setData({ isLoading: true })
    
    try {
      const favorites = getStorage('userFavorites', [])
      
      // 处理收藏数据
      const processedFavorites = favorites.map((item, index) => {
        return {
          id: item.id || `favorite_${index}_${item.favoriteTime}`,
          ...item,
          timeText: this.formatTimeText(item.favoriteTime),
          selected: false
        }
      })
      
      this.setData({
        favoritesList: processedFavorites,
        isLoading: false,
        selectedCount: 0
      })
      
      // 应用当前排序
      this.applySorting()
      
    } catch (error) {
      console.error('加载收藏数据失败:', error)
      this.setData({ isLoading: false })
      showToast('加载失败，请重试')
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
   * 排序方式点击
   */
  onSortTap(e) {
    const { sort } = e.currentTarget.dataset
    
    this.setData({ currentSort: sort })
    this.applySorting()
    
    // 记录用户行为
    this.recordUserAction('sort_favorites', { sort })
  },

  /**
   * 应用排序
   */
  applySorting() {
    const { favoritesList, currentSort } = this.data
    let sortedList = [...favoritesList]
    
    switch (currentSort) {
      case 'time':
        sortedList.sort((a, b) => b.favoriteTime - a.favoriteTime)
        break
      case 'name':
        sortedList.sort((a, b) => a.dish.name.localeCompare(b.dish.name, 'zh-CN'))
        break
      case 'rating':
        sortedList.sort((a, b) => b.dish.rating - a.dish.rating)
        break
      default:
        break
    }
    
    this.setData({ sortedList })
  },

  /**
   * 切换管理模式
   */
  onToggleManage() {
    const { isManaging } = this.data
    
    if (isManaging) {
      // 退出管理模式，清除所有选择
      const { favoritesList } = this.data
      const updatedList = favoritesList.map(item => ({
        ...item,
        selected: false
      }))
      
      this.setData({
        isManaging: false,
        favoritesList: updatedList,
        selectedCount: 0
      })
      
      this.applySorting()
    } else {
      // 进入管理模式
      this.setData({ isManaging: true })
    }
    
    // 记录用户行为
    this.recordUserAction('toggle_manage', { isManaging: !isManaging })
  },

  /**
   * 选择项目
   */
  onSelectItem(e) {
    const { itemId } = e.currentTarget.dataset
    const { favoritesList } = this.data
    
    const updatedList = favoritesList.map(item => {
      if (item.id === itemId) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    
    const selectedCount = updatedList.filter(item => item.selected).length
    
    this.setData({
      favoritesList: updatedList,
      selectedCount
    })
    
    this.applySorting()
  },

  /**
   * 全选/取消全选
   */
  onSelectAll() {
    const { favoritesList, selectedCount } = this.data
    const isAllSelected = selectedCount === favoritesList.length
    
    const updatedList = favoritesList.map(item => ({
      ...item,
      selected: !isAllSelected
    }))
    
    this.setData({
      favoritesList: updatedList,
      selectedCount: isAllSelected ? 0 : favoritesList.length
    })
    
    this.applySorting()
    
    // 记录用户行为
    this.recordUserAction('select_all_favorites', { selectAll: !isAllSelected })
  },

  /**
   * 点击收藏项
   */
  onFavoriteTap(e) {
    const { item } = e.currentTarget.dataset
    
    // 如果在管理模式下，点击选择
    if (this.data.isManaging) {
      this.onSelectItem(e)
      return
    }
    
    console.log('点击收藏项:', item)
    
    // 记录用户行为
    this.recordUserAction('view_favorite_item', { dishId: item.dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${item.dish.id}`
    })
  },

  /**
   * 移除单个收藏
   */
  onRemoveFavorite(e) {
    const { itemId } = e.currentTarget.dataset
    
    this.setData({
      showDeleteModal: true,
      deleteType: 'single',
      deleteTarget: itemId
    })
  },

  /**
   * 批量删除
   */
  onBatchDelete() {
    const { selectedCount } = this.data
    
    if (selectedCount === 0) {
      showToast('请选择要删除的项目')
      return
    }
    
    this.setData({
      showDeleteModal: true,
      deleteType: 'batch',
      deleteTarget: null
    })
  },

  /**
   * 关闭删除弹窗
   */
  onCloseDeleteModal() {
    this.setData({
      showDeleteModal: false,
      deleteType: 'single',
      deleteTarget: null
    })
  },

  /**
   * 确认删除
   */
  onConfirmDelete() {
    const { deleteType, deleteTarget } = this.data
    
    if (deleteType === 'single') {
      this.deleteSingleFavorite(deleteTarget)
    } else {
      this.deleteBatchFavorites()
    }
    
    this.onCloseDeleteModal()
  },

  /**
   * 删除单个收藏
   */
  deleteSingleFavorite(itemId) {
    try {
      const favorites = getStorage('userFavorites', [])
      const updatedFavorites = favorites.filter(item => {
        const id = item.id || `favorite_${favorites.indexOf(item)}_${item.favoriteTime}`
        return id !== itemId
      })
      
      setStorage('userFavorites', updatedFavorites)
      
      // 重新加载数据
      this.loadFavoritesData()
      
      showSuccess('已取消收藏')
      
      // 记录用户行为
      this.recordUserAction('remove_single_favorite', { itemId })
      
    } catch (error) {
      console.error('删除收藏失败:', error)
      showToast('删除失败，请重试')
    }
  },

  /**
   * 批量删除收藏
   */
  deleteBatchFavorites() {
    try {
      const { favoritesList } = this.data
      const selectedIds = favoritesList
        .filter(item => item.selected)
        .map(item => item.id)
      
      const favorites = getStorage('userFavorites', [])
      const updatedFavorites = favorites.filter(item => {
        const id = item.id || `favorite_${favorites.indexOf(item)}_${item.favoriteTime}`
        return !selectedIds.includes(id)
      })
      
      setStorage('userFavorites', updatedFavorites)
      
      // 退出管理模式并重新加载数据
      this.setData({ isManaging: false })
      this.loadFavoritesData()
      
      showSuccess(`已删除 ${selectedIds.length} 项收藏`)
      
      // 记录用户行为
      this.recordUserAction('remove_batch_favorites', { 
        count: selectedIds.length,
        ids: selectedIds
      })
      
    } catch (error) {
      console.error('批量删除收藏失败:', error)
      showToast('删除失败，请重试')
    }
  },

  /**
   * 去发现
   */
  onGoDiscover() {
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
        page: 'favorites'
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
    
    this.loadFavoritesData()
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功')
    }, 1000)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { favoritesList } = this.data
    return {
      title: `我收藏了 ${favoritesList.length} 道美味菜品 - funnyEat`,
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'funnyEat - 收藏每一道心动的美味',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})