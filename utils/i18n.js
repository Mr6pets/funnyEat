// utils/i18n.js
// 国际化配置

/**
 * 语言配置
 */
const languages = {
  zh: {
    // 通用
    common: {
      confirm: '确定',
      cancel: '取消',
      loading: '加载中...',
      retry: '重试',
      back: '返回',
      more: '更多',
      search: '搜索',
      filter: '筛选',
      all: '全部',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      share: '分享',
      favorite: '收藏',
      unfavorite: '取消收藏'
    },
    
    // 底部导航
    tabBar: {
      home: '首页',
      choose: '选择',
      profile: '我的'
    },
    
    // 首页
    index: {
      greeting: '今天吃什么？',
      subGreeting: '让我们为您推荐美味佳肴',
      todayRecommend: '今日推荐',
      recommendSubtitle: '根据您的喜好精心挑选',
      quickChoice: '快速选择',
      quickChoiceSubtitle: '不知道吃什么？试试手气吧',
      shakeIt: '摇一摇',
      categories: '分类浏览',
      categoriesSubtitle: '按类型查找您想要的菜品',
      cuisines: '菜系推荐',
      cuisinesSubtitle: '探索不同地方的特色美食'
    },
    
    // 选择页面
    choose: {
      title: '智能选择',
      subtitle: '根据条件为您推荐',
      randomChoice: '随机推荐',
      filterSearch: '筛选搜索',
      searchResults: '搜索结果',
      resultsCount: '共{count}道菜',
      noResults: '暂无符合条件的菜品',
      tryOtherFilters: '试试其他筛选条件吧'
    },
    
    // 详情页面
    detail: {
      ingredients: '所需食材',
      steps: '制作步骤',
      nutrition: '营养信息',
      tips: '制作小贴士',
      difficulty: '难度',
      cookingTime: '制作时间',
      calories: '卡路里',
      addToFavorites: '加入收藏',
      removeFromFavorites: '取消收藏',
      startCooking: '开始制作'
    },
    
    // 个人中心
    profile: {
      title: '个人中心',
      loginTip: '点击登录',
      explorer: '美食探索者',
      loginSubtitle: '登录后享受更多功能',
      stats: '我的数据',
      totalTries: '尝试次数',
      favorites: '收藏菜品',
      history: '历史记录',
      recentChoices: '最近选择',
      viewAll: '查看全部',
      settings: '设置',
      language: '语言设置',
      about: '关于我们',
      feedback: '意见反馈'
    },
    
    // 收藏页面
    favorites: {
      title: '我的收藏',
      subtitle: '{count}道收藏菜品',
      sortByTime: '按时间',
      sortByName: '按名称',
      sortByRating: '按评分',
      manage: '管理',
      done: '完成',
      selectAll: '全选',
      cancelSelectAll: '取消全选',
      selectedCount: '已选择 {count} 项',
      batchDelete: '删除选中',
      emptyTitle: '暂无收藏菜品',
      emptySubtitle: '去发现一些美味的菜品收藏吧',
      goDiscover: '去发现',
      confirmRemove: '确定要取消收藏这道菜品吗？',
      confirmBatchDelete: '确定要删除选中的 {count} 道菜品吗？'
    },
    
    // 历史记录
    history: {
      title: '历史记录',
      subtitle: '您的选择历史',
      emptyTitle: '暂无历史记录',
      emptySubtitle: '开始您的美食探索之旅吧',
      goExplore: '去探索',
      source: {
        random: '随机推荐',
        category: '分类浏览',
        cuisine: '菜系浏览',
        search: '搜索结果',
        recommendation: '今日推荐'
      }
    },
    
    // 设置页面
    settings: {
      title: '设置',
      preferences: '偏好设置',
      favoriteCuisines: '喜欢的菜系',
      dislikedIngredients: '不喜欢的食材',
      difficultyLevel: '制作难度',
      maxCookingTime: '最长制作时间',
      vegetarianOnly: '仅素食',
      language: '语言',
      chinese: '中文',
      english: 'English',
      about: '关于',
      version: '版本',
      feedback: '反馈',
      privacy: '隐私政策'
    },
    
    // 菜品分类
    categories: {
      meat: '荤菜',
      vegetable: '素菜',
      soup: '汤品',
      staple: '主食'
    },
    
    // 菜系
    cuisines: {
      sichuan: '川菜',
      cantonese: '粤菜',
      shandong: '鲁菜',
      jiangsu: '苏菜',
      home: '家常菜'
    },
    
    // 难度等级
    difficulty: {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    }
  },
  
  en: {
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      loading: 'Loading...',
      retry: 'Retry',
      back: 'Back',
      more: 'More',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      favorite: 'Favorite',
      unfavorite: 'Unfavorite'
    },
    
    // Tab Bar
    tabBar: {
      home: 'Home',
      choose: 'Choose',
      profile: 'Profile'
    },
    
    // Home Page
    index: {
      greeting: 'What to eat today?',
      subGreeting: 'Let us recommend delicious dishes for you',
      todayRecommend: "Today's Picks",
      recommendSubtitle: 'Carefully selected based on your preferences',
      quickChoice: 'Quick Choice',
      quickChoiceSubtitle: "Don't know what to eat? Try your luck",
      shakeIt: 'Shake It',
      categories: 'Browse Categories',
      categoriesSubtitle: 'Find dishes by type',
      cuisines: 'Cuisine Recommendations',
      cuisinesSubtitle: 'Explore specialties from different regions'
    },
    
    // Choose Page
    choose: {
      title: 'Smart Choice',
      subtitle: 'Recommendations based on your criteria',
      randomChoice: 'Random Pick',
      filterSearch: 'Filter Search',
      searchResults: 'Search Results',
      resultsCount: '{count} dishes found',
      noResults: 'No dishes match your criteria',
      tryOtherFilters: 'Try other filter options'
    },
    
    // Detail Page
    detail: {
      ingredients: 'Ingredients',
      steps: 'Cooking Steps',
      nutrition: 'Nutrition Info',
      tips: 'Cooking Tips',
      difficulty: 'Difficulty',
      cookingTime: 'Cooking Time',
      calories: 'Calories',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      startCooking: 'Start Cooking'
    },
    
    // Profile Page
    profile: {
      title: 'Profile',
      loginTip: 'Tap to Login',
      explorer: 'Food Explorer',
      loginSubtitle: 'Login to enjoy more features',
      stats: 'My Stats',
      totalTries: 'Total Tries',
      favorites: 'Favorites',
      history: 'History',
      recentChoices: 'Recent Choices',
      viewAll: 'View All',
      settings: 'Settings',
      language: 'Language',
      about: 'About',
      feedback: 'Feedback'
    },
    
    // Favorites Page
    favorites: {
      title: 'My Favorites',
      subtitle: '{count} favorite dishes',
      sortByTime: 'By Time',
      sortByName: 'By Name',
      sortByRating: 'By Rating',
      manage: 'Manage',
      done: 'Done',
      selectAll: 'Select All',
      cancelSelectAll: 'Deselect All',
      selectedCount: '{count} selected',
      batchDelete: 'Delete Selected',
      emptyTitle: 'No Favorites Yet',
      emptySubtitle: 'Discover and save some delicious dishes',
      goDiscover: 'Discover',
      confirmRemove: 'Remove this dish from favorites?',
      confirmBatchDelete: 'Delete {count} selected dishes?'
    },
    
    // History Page
    history: {
      title: 'History',
      subtitle: 'Your choice history',
      emptyTitle: 'No History Yet',
      emptySubtitle: 'Start your culinary exploration journey',
      goExplore: 'Explore',
      source: {
        random: 'Random Pick',
        category: 'Category Browse',
        cuisine: 'Cuisine Browse',
        search: 'Search Result',
        recommendation: "Today's Pick"
      }
    },
    
    // Settings Page
    settings: {
      title: 'Settings',
      preferences: 'Preferences',
      favoriteCuisines: 'Favorite Cuisines',
      dislikedIngredients: 'Disliked Ingredients',
      difficultyLevel: 'Difficulty Level',
      maxCookingTime: 'Max Cooking Time',
      vegetarianOnly: 'Vegetarian Only',
      language: 'Language',
      chinese: '中文',
      english: 'English',
      about: 'About',
      version: 'Version',
      feedback: 'Feedback',
      privacy: 'Privacy Policy'
    },
    
    // Categories
    categories: {
      meat: 'Meat',
      vegetable: 'Vegetable',
      soup: 'Soup',
      staple: 'Staple'
    },
    
    // Cuisines
    cuisines: {
      sichuan: 'Sichuan',
      cantonese: 'Cantonese',
      shandong: 'Shandong',
      jiangsu: 'Jiangsu',
      home: 'Home Style'
    },
    
    // Difficulty
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    }
  }
}

/**
 * 国际化管理类
 */
class I18n {
  constructor() {
    this.currentLanguage = wx.getStorageSync('language') || 'zh'
    this.languages = languages
  }
  
  /**
   * 获取当前语言
   */
  getCurrentLanguage() {
    return this.currentLanguage
  }
  
  /**
   * 设置语言
   */
  setLanguage(lang) {
    if (this.languages[lang]) {
      this.currentLanguage = lang
      wx.setStorageSync('language', lang)
      return true
    }
    return false
  }
  
  /**
   * 获取翻译文本
   */
  t(key, params = {}) {
    const keys = key.split('.')
    let value = this.languages[this.currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    
    if (typeof value === 'string') {
      // 替换参数
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match
      })
    }
    
    // 如果找不到翻译，返回key
    return key
  }
  
  /**
   * 获取所有可用语言
   */
  getAvailableLanguages() {
    return Object.keys(this.languages)
  }
}

// 创建全局实例
const i18n = new I18n()

module.exports = {
  i18n,
  I18n
}