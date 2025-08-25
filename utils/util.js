// utils/util.js
// 工具函数库

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @param {string} format 格式化字符串
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return format
    .replace('YYYY', year)
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'))
}

/**
 * 显示加载提示
 * @param {string} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 * @param {string} title 提示文字
 * @param {number} duration 显示时长
 */
const showSuccess = (title, duration = 2000) => {
  wx.showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 * @param {string} title 提示文字
 * @param {number} duration 显示时长
 */
const showError = (title, duration = 2000) => {
  wx.showToast({
    title,
    icon: 'error',
    duration
  })
}

/**
 * 显示普通提示
 * @param {string} title 提示文字
 * @param {number} duration 显示时长
 */
const showToast = (title, duration = 2000) => {
  wx.showToast({
    title,
    icon: 'none',
    duration
  })
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 节流后的函数
 */
const throttle = (func, delay = 300) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 随机数生成
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数组随机选择
 * @param {Array} arr 数组
 * @returns {any} 随机选择的元素
 */
const randomChoice = (arr) => {
  if (!arr || arr.length === 0) return null
  return arr[randomInt(0, arr.length - 1)]
}

/**
 * 数组洗牌
 * @param {Array} arr 数组
 * @returns {Array} 洗牌后的数组
 */
const shuffle = (arr) => {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

/**
 * 存储数据到本地
 * @param {string} key 键名
 * @param {any} data 数据
 */
const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
  } catch (error) {
    console.error('存储数据失败:', error)
  }
}

/**
 * 从本地获取数据
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any} 获取的数据
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const data = wx.getStorageSync(key)
    return data || defaultValue
  } catch (error) {
    console.error('获取数据失败:', error)
    return defaultValue
  }
}

/**
 * 删除本地存储数据
 * @param {string} key 键名
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.error('删除数据失败:', error)
  }
}

module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showToast,
  debounce,
  throttle,
  deepClone,
  randomInt,
  randomChoice,
  shuffle,
  setStorage,
  getStorage,
  removeStorage
}