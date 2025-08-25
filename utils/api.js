// utils/api.js
// 云开发API接口封装

const { showLoading, hideLoading, showError } = require('./util.js')

// 云开发环境初始化
wx.cloud.init({
  // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
  // env: 'your-env-id',
  traceUser: true,
})

const db = wx.cloud.database()

/**
 * 云函数调用封装
 * @param {string} name 云函数名称
 * @param {object} data 传递的数据
 * @param {boolean} loading 是否显示加载提示
 * @returns {Promise} 返回Promise对象
 */
const callFunction = (name, data = {}, loading = true) => {
  return new Promise((resolve, reject) => {
    if (loading) showLoading()
    
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        if (loading) hideLoading()
        if (res.result && res.result.success) {
          resolve(res.result)
        } else {
          const errorMsg = res.result?.message || '请求失败'
          showError(errorMsg)
          reject(new Error(errorMsg))
        }
      },
      fail: (error) => {
        if (loading) hideLoading()
        console.error('云函数调用失败:', error)
        showError('网络请求失败')
        reject(error)
      }
    })
  })
}

/**
 * 菜品相关API
 */
const dishAPI = {
  /**
   * 获取推荐菜品
   * @param {object} params 查询参数
   * @returns {Promise} 菜品列表
   */
  getRecommendedDishes(params = {}) {
    return callFunction('getRecommendedDishes', params)
  },

  /**
   * 获取菜品详情
   * @param {string} dishId 菜品ID
   * @returns {Promise} 菜品详情
   */
  getDishDetail(dishId) {
    return callFunction('getDishDetail', { dishId })
  },

  /**
   * 随机获取菜品
   * @param {object} filters 筛选条件
   * @returns {Promise} 随机菜品
   */
  getRandomDish(filters = {}) {
    return callFunction('getRandomDish', filters)
  },

  /**
   * 按分类获取菜品
   * @param {string} category 分类
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Promise} 菜品列表
   */
  getDishesByCategory(category, page = 1, limit = 10) {
    return callFunction('getDishesByCategory', { category, page, limit })
  },

  /**
   * 搜索菜品
   * @param {string} keyword 关键词
   * @param {object} filters 筛选条件
   * @returns {Promise} 搜索结果
   */
  searchDishes(keyword, filters = {}) {
    return callFunction('searchDishes', { keyword, ...filters })
  }
}

/**
 * 用户相关API
 */
const userAPI = {
  /**
   * 保存用户偏好
   * @param {object} preferences 偏好设置
   * @returns {Promise} 保存结果
   */
  saveUserPreferences(preferences) {
    return callFunction('saveUserPreferences', { preferences })
  },

  /**
   * 获取用户偏好
   * @returns {Promise} 用户偏好
   */
  getUserPreferences() {
    return callFunction('getUserPreferences')
  },

  /**
   * 添加到历史记录
   * @param {string} dishId 菜品ID
   * @param {string} source 来源
   * @returns {Promise} 添加结果
   */
  addToHistory(dishId, source = 'random') {
    return callFunction('addToHistory', { dishId, source })
  },

  /**
   * 获取历史记录
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Promise} 历史记录列表
   */
  getHistory(page = 1, limit = 20) {
    return callFunction('getHistory', { page, limit })
  },

  /**
   * 添加到收藏
   * @param {string} dishId 菜品ID
   * @returns {Promise} 收藏结果
   */
  addToFavorites(dishId) {
    return callFunction('addToFavorites', { dishId })
  },

  /**
   * 从收藏中移除
   * @param {string} dishId 菜品ID
   * @returns {Promise} 移除结果
   */
  removeFromFavorites(dishId) {
    return callFunction('removeFromFavorites', { dishId })
  },

  /**
   * 获取收藏列表
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Promise} 收藏列表
   */
  getFavorites(page = 1, limit = 20) {
    return callFunction('getFavorites', { page, limit })
  },

  /**
   * 检查是否已收藏
   * @param {string} dishId 菜品ID
   * @returns {Promise} 是否已收藏
   */
  checkFavorite(dishId) {
    return callFunction('checkFavorite', { dishId })
  }
}

/**
 * 数据统计API
 */
const statsAPI = {
  /**
   * 获取用户统计数据
   * @returns {Promise} 统计数据
   */
  getUserStats() {
    return callFunction('getUserStats')
  },

  /**
   * 记录用户行为
   * @param {string} action 行为类型
   * @param {object} data 行为数据
   * @returns {Promise} 记录结果
   */
  recordUserAction(action, data = {}) {
    return callFunction('recordUserAction', { action, data }, false)
  }
}

/**
 * 本地数据库操作（用于离线模式）
 */
const localDB = {
  /**
   * 获取本地菜品数据
   * @returns {Array} 菜品列表
   */
  getLocalDishes() {
    const dishes = wx.getStorageSync('localDishes') || []
    return dishes
  },

  /**
   * 保存菜品到本地
   * @param {Array} dishes 菜品列表
   */
  saveLocalDishes(dishes) {
    wx.setStorageSync('localDishes', dishes)
  },

  /**
   * 获取本地用户数据
   * @returns {Object} 用户数据
   */
  getLocalUserData() {
    return {
      preferences: wx.getStorageSync('userPreferences') || {},
      history: wx.getStorageSync('userHistory') || [],
      favorites: wx.getStorageSync('userFavorites') || []
    }
  }
}

module.exports = {
  callFunction,
  dishAPI,
  userAPI,
  statsAPI,
  localDB,
  db
}