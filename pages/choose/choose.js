// pages/choose/choose.js
const { categories, cuisines, dishes, preferenceOptions, getRandomDish, getDishesByCategory, searchDishes } = require('../../data/mockData.js')
const { showToast, showLoading, hideLoading, setStorage, getStorage } = require('../../utils/util.js')

Page({
  data: {
    // 页面信息
    pageTitle: '选择菜品',
    pageSubtitle: '根据你的喜好推荐',
    
    // 筛选选项
    categories: [],
    cuisines: [],
    difficultyOptions: [],
    cookingTimeOptions: [],
    
    // 当前筛选条件
    filters: {
      category: '',
      cuisine: '',
      difficulty: '',
      cookingTime: ''
    },
    
    // 搜索结果
    searchResults: [],
    isLoading: false,
    showEmpty: false,
    
    // 随机推荐
    showRandomResult: false,
    randomDish: null,
    
    // 收藏状态
    favoriteIds: []
  },

  onLoad(options) {
    console.log('选择页面加载', options)
    this.initPageData()
    this.handlePageParams(options)
    this.loadFavorites()
  },

  onShow() {
    console.log('选择页面显示')
    // 刷新收藏状态
    this.loadFavorites()
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    this.setData({
      categories,
      cuisines,
      difficultyOptions: preferenceOptions.difficulties,
      cookingTimeOptions: preferenceOptions.cookingTimes
    })
  },

  /**
   * 处理页面参数
   */
  handlePageParams(options) {
    const { category, categoryName, cuisine, cuisineName } = options
    let pageTitle = '选择菜品'
    let pageSubtitle = '根据你的喜好推荐'
    let filters = { ...this.data.filters }
    
    if (category) {
      filters.category = category
      pageTitle = categoryName || '分类菜品'
      pageSubtitle = `为你推荐${categoryName || '该分类'}的美味菜品`
      // 自动搜索该分类的菜品
      setTimeout(() => {
        this.performSearch()
      }, 500)
    }
    
    if (cuisine) {
      filters.cuisine = cuisine
      pageTitle = cuisineName || '菜系菜品'
      pageSubtitle = `为你推荐${cuisineName || '该菜系'}的特色菜品`
      // 自动搜索该菜系的菜品
      setTimeout(() => {
        this.performSearch()
      }, 500)
    }
    
    this.setData({
      pageTitle,
      pageSubtitle,
      filters
    })
  },

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    const favorites = getStorage('userFavorites', [])
    const favoriteIds = favorites.map(item => item.dishId || item.id)
    this.setData({ favoriteIds })
  },

  /**
   * 筛选条件点击
   */
  onFilterTap(e) {
    const { type, value } = e.currentTarget.dataset
    const { filters } = this.data
    
    // 如果点击的是已选中的条件，则取消选择
    const newValue = filters[type] === value ? '' : value
    
    this.setData({
      [`filters.${type}`]: newValue
    })
    
    console.log('筛选条件变更:', type, newValue)
  },

  /**
   * 重置筛选条件
   */
  onResetFilters() {
    this.setData({
      filters: {
        category: '',
        cuisine: '',
        difficulty: '',
        cookingTime: ''
      },
      searchResults: [],
      showEmpty: false
    })
    
    showToast('筛选条件已重置')
  },

  /**
   * 随机推荐
   */
  onRandomChoice() {
    console.log('随机推荐')
    
    const { filters } = this.data
    
    // 构建筛选条件
    const searchFilters = {}
    if (filters.category) searchFilters.category = filters.category
    if (filters.cuisine) searchFilters.cuisine = filters.cuisine
    if (filters.difficulty) searchFilters.difficulty = filters.difficulty
    if (filters.cookingTime) searchFilters.maxCookingTime = filters.cookingTime
    
    // 获取随机菜品
    const randomDish = getRandomDish(searchFilters)
    
    if (randomDish) {
      // 添加收藏状态
      randomDish.isFavorite = this.data.favoriteIds.includes(randomDish.id)
      
      this.setData({
        randomDish,
        showRandomResult: true
      })
      
      // 记录用户行为
      this.recordUserAction('random_choice', { 
        dishId: randomDish.id,
        filters: searchFilters
      })
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
    } else {
      showToast('暂无符合条件的菜品')
    }
  },

  /**
   * 筛选搜索
   */
  onFilterSearch() {
    console.log('筛选搜索')
    this.performSearch()
  },

  /**
   * 执行搜索
   */
  performSearch() {
    const { filters } = this.data
    
    // 检查是否有筛选条件
    const hasFilters = Object.values(filters).some(value => value !== '')
    if (!hasFilters) {
      showToast('请选择筛选条件')
      return
    }
    
    this.setData({ isLoading: true, showEmpty: false })
    
    // 模拟搜索延迟
    setTimeout(() => {
      let results = [...dishes]
      
      // 应用筛选条件
      if (filters.category) {
        results = results.filter(dish => dish.category === filters.category)
      }
      
      if (filters.cuisine) {
        results = results.filter(dish => dish.cuisine === filters.cuisine)
      }
      
      if (filters.difficulty) {
        results = results.filter(dish => dish.difficulty === filters.difficulty)
      }
      
      if (filters.cookingTime) {
        results = results.filter(dish => dish.cookingTime <= filters.cookingTime)
      }
      
      // 添加收藏状态
      results = results.map(dish => ({
        ...dish,
        isFavorite: this.data.favoriteIds.includes(dish.id)
      }))
      
      this.setData({
        searchResults: results,
        isLoading: false,
        showEmpty: results.length === 0
      })
      
      // 记录用户行为
      this.recordUserAction('filter_search', {
        filters,
        resultCount: results.length
      })
      
      if (results.length === 0) {
        showToast('暂无符合条件的菜品')
      }
      
    }, 800)
  },

  /**
   * 点击搜索结果
   */
  onResultTap(e) {
    const { dish } = e.currentTarget.dataset
    console.log('点击菜品:', dish)
    
    // 记录用户行为
    this.recordUserAction('view_dish', { dishId: dish.id })
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${dish.id}`
    })
  },

  /**
   * 切换收藏状态
   */
  onToggleFavorite(e) {
    const { dishId } = e.currentTarget.dataset
    const { favoriteIds, searchResults, randomDish } = this.data
    
    const isFavorite = favoriteIds.includes(dishId)
    let newFavoriteIds = [...favoriteIds]
    
    if (isFavorite) {
      // 取消收藏
      newFavoriteIds = newFavoriteIds.filter(id => id !== dishId)
      showToast('已取消收藏')
    } else {
      // 添加收藏
      newFavoriteIds.push(dishId)
      showToast('已添加收藏')
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' })
    }
    
    // 更新本地存储
    const favorites = getStorage('userFavorites', [])
    if (isFavorite) {
      const updatedFavorites = favorites.filter(item => 
        (item.dishId || item.id) !== dishId
      )
      setStorage('userFavorites', updatedFavorites)
    } else {
      const dish = dishes.find(d => d.id === dishId)
      if (dish) {
        favorites.push({
          dishId: dish.id,
          favoriteTime: Date.now(),
          dish: dish
        })
        setStorage('userFavorites', favorites)
      }
    }
    
    // 更新页面数据
    const updatedResults = searchResults.map(dish => ({
      ...dish,
      isFavorite: dish.id === dishId ? !isFavorite : dish.isFavorite
    }))
    
    const updatedRandomDish = randomDish && randomDish.id === dishId 
      ? { ...randomDish, isFavorite: !isFavorite }
      : randomDish
    
    this.setData({
      favoriteIds: newFavoriteIds,
      searchResults: updatedResults,
      randomDish: updatedRandomDish
    })
    
    // 记录用户行为
    this.recordUserAction(isFavorite ? 'remove_favorite' : 'add_favorite', {
      dishId
    })
  },

  /**
   * 关闭随机结果弹窗
   */
  onCloseRandomResult() {
    this.setData({
      showRandomResult: false,
      randomDish: null
    })
  },

  /**
   * 查看随机推荐详情
   */
  onViewRandomDetail() {
    const { randomDish } = this.data
    if (!randomDish) return
    
    this.onCloseRandomResult()
    
    wx.navigateTo({
      url: `/pages/detail/detail?dishId=${randomDish.id}`
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
        page: 'choose'
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
    
    // 重新加载收藏状态
    this.loadFavorites()
    
    // 如果有搜索结果，重新搜索
    if (this.data.searchResults.length > 0) {
      this.performSearch()
    }
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功')
    }, 1000)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { pageTitle } = this.data
    return {
      title: `${pageTitle} - funnyEat`,
      path: '/pages/choose/choose',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'funnyEat - 智能菜品推荐助手',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})