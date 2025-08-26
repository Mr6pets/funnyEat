// data/mockData.js
// 模拟数据

/**
 * 菜品分类数据
 */
const categories = [
  {
    id: 'meat',
    name: '荤菜',
    icon: '🥩',
    color: '#FF6B35'
  },
  {
    id: 'vegetable',
    name: '素菜',
    icon: '🥬',
    color: '#4CAF50'
  },
  {
    id: 'soup',
    name: '汤品',
    icon: '🍲',
    color: '#2196F3'
  },
  {
    id: 'staple',
    name: '主食',
    icon: '🍚',
    color: '#FF9800'
  }
]

/**
 * 菜系分类数据
 */
const cuisines = [
  {
    id: 'sichuan',
    name: '川菜',
    icon: '🌶️',
    description: '麻辣鲜香'
  },
  {
    id: 'cantonese',
    name: '粤菜',
    icon: '🦐',
    description: '清淡鲜美'
  },
  {
    id: 'shandong',
    name: '鲁菜',
    icon: '🐟',
    description: '咸鲜为主'
  },
  {
    id: 'jiangsu',
    name: '苏菜',
    icon: '🦆',
    description: '清淡微甜'
  }
]

/**
 * 菜品数据
 */
const dishes = [
  {
    id: 'dish001',
    name: '宫保鸡丁',
    category: 'meat',
    cuisine: 'sichuan',
    imageUrl: '/images/dish-gongbaojiding.png',
    description: '经典川菜，酸甜适中，口感丰富',
    difficulty: '中等',
    cookingTime: 30,
    calories: 280,
    ingredients: ['鸡胸肉 300g', '花生米 100g', '干辣椒 10个', '花椒 1勺', '葱 2根', '蒜 3瓣', '生抽 2勺', '老抽 1勺', '糖 1勺', '醋 1勺'],
    steps: [
      '鸡胸肉切丁，用料酒、生抽、淀粉腌制15分钟',
      '花生米过油炸至金黄，捞出备用',
      '热锅下油，爆炒干辣椒和花椒',
      '下鸡丁炒至变色，加入调料炒匀',
      '最后加入花生米和葱段炒匀即可'
    ],
    tags: ['下饭菜', '经典菜', '川菜', '家常菜'],
    nutrition: {
      protein: 25.5,
      carbs: 15.2,
      fat: 12.8,
      fiber: 3.1,
      suitableFor: '一般人群'
    },
    rating: 4.8,
    favoriteCount: 1250
  },
  {
    id: 'dish002',
    name: '麻婆豆腐',
    category: 'vegetable',
    cuisine: 'sichuan',
    imageUrl: '/images/dish-mapodoufu.png',
    description: '麻辣鲜香，嫩滑爽口的经典川菜',
    difficulty: '简单',
    cookingTime: 20,
    calories: 180,
    ingredients: ['嫩豆腐 400g', '肉末 100g', '豆瓣酱 2勺', '花椒粉 1勺', '葱花 适量', '蒜末 1勺', '生抽 1勺', '淀粉 1勺'],
    steps: [
      '豆腐切块，用盐水焯一下',
      '热锅下油，炒香肉末',
      '加入豆瓣酱炒出红油',
      '加水烧开，下豆腐块煮3分钟',
      '用淀粉勾芡，撒花椒粉和葱花即可'
    ],
    tags: ['素食', '川菜', '下饭菜', '家常菜'],
    nutrition: {
      protein: 12.3,
      carbs: 8.5,
      fat: 9.2,
      fiber: 2.8,
      suitableFor: '一般人群'
    },
    rating: 4.6,
    favoriteCount: 980
  },
  {
    id: 'dish003',
    name: '白切鸡',
    category: 'meat',
    cuisine: 'cantonese',
    imageUrl: '/images/dish-baiqieji.png',
    description: '粤菜经典，清淡鲜美，原汁原味',
    difficulty: '中等',
    cookingTime: 45,
    calories: 220,
    ingredients: ['土鸡 1只', '生姜 50g', '葱 3根', '料酒 2勺', '盐 适量', '生抽 3勺', '香油 1勺'],
    steps: [
      '整鸡洗净，用盐和料酒腌制30分钟',
      '锅中加水，放入姜片和葱段煮开',
      '下鸡煮20分钟后关火焖10分钟',
      '捞出过冰水，切块装盘',
      '调制蘸料：生抽、香油、葱丝、姜丝'
    ],
    tags: ['粤菜', '清淡', '原味', '宴客菜'],
    nutrition: {
      protein: 28.5,
      carbs: 2.1,
      fat: 8.9,
      fiber: 0.5,
      suitableFor: '一般人群'
    },
    rating: 4.7,
    favoriteCount: 756
  },
  {
    id: 'dish004',
    name: '西红柿鸡蛋汤',
    category: 'soup',
    cuisine: 'home',
    imageUrl: '/images/dish-xihongshijidantang.png',
    description: '家常汤品，酸甜开胃，营养丰富',
    difficulty: '简单',
    cookingTime: 15,
    calories: 120,
    ingredients: ['西红柿 2个', '鸡蛋 2个', '葱花 适量', '盐 适量', '糖 少许', '香油 几滴'],
    steps: [
      '西红柿去皮切块，鸡蛋打散',
      '热锅下油，炒西红柿出汁',
      '加水煮开，调味',
      '淋入蛋液，快速搅拌成蛋花',
      '撒葱花，滴香油即可'
    ],
    tags: ['汤品', '家常菜', '开胃', '营养'],
    nutrition: {
      protein: 8.2,
      carbs: 6.8,
      fat: 5.5,
      fiber: 1.8,
      suitableFor: '所有人群'
    },
    rating: 4.5,
    favoriteCount: 1100
  },
  {
    id: 'dish005',
    name: '蛋炒饭',
    category: 'staple',
    cuisine: 'home',
    imageUrl: '/images/dish-danchaofan.png',
    description: '简单快手，香喷喷的家常主食',
    difficulty: '简单',
    cookingTime: 10,
    calories: 320,
    ingredients: ['米饭 2碗', '鸡蛋 2个', '葱花 适量', '盐 适量', '生抽 1勺', '油 适量'],
    steps: [
      '鸡蛋打散，炒熟盛起',
      '热锅下油，下米饭炒散',
      '加入炒蛋翻炒均匀',
      '调味，撒葱花炒匀即可'
    ],
    tags: ['主食', '快手菜', '家常菜', '简单'],
    nutrition: {
      protein: 12.5,
      carbs: 45.2,
      fat: 8.8,
      fiber: 1.2,
      suitableFor: '所有人群'
    },
    rating: 4.3,
    favoriteCount: 890
  }
]

/**
 * 今日推荐数据
 */
const todayRecommendations = [
  {
    id: 'rec001',
    dishId: 'dish001',
    reason: '经典川菜，下饭神器',
    tag: '热门推荐'
  },
  {
    id: 'rec002',
    dishId: 'dish004',
    reason: '清爽汤品，开胃解腻',
    tag: '健康推荐'
  },
  {
    id: 'rec003',
    dishId: 'dish005',
    reason: '简单快手，10分钟搞定',
    tag: '快手推荐'
  }
]

/**
 * 用户偏好选项
 */
const preferenceOptions = {
  cuisines: cuisines,
  difficulties: [
    { id: 'easy', name: '简单', description: '30分钟内完成' },
    { id: 'medium', name: '中等', description: '30-60分钟' },
    { id: 'hard', name: '困难', description: '60分钟以上' }
  ],
  cookingTimes: [
    { id: 'quick', name: '快手菜', time: 15, description: '15分钟内' },
    { id: 'normal', name: '常规菜', time: 30, description: '15-30分钟' },
    { id: 'slow', name: '慢炖菜', time: 60, description: '30分钟以上' }
  ],
  commonIngredients: [
    '香菜', '胡萝卜', '洋葱', '青椒', '茄子', '豆腐', '鸡蛋', '猪肉', '牛肉', '鸡肉', '鱼类', '虾类'
  ]
}

/**
 * 获取随机菜品
 * @param {object} filters 筛选条件
 * @returns {object} 随机菜品
 */
const getRandomDish = (filters = {}) => {
  let filteredDishes = [...dishes]
  
  if (filters.category) {
    filteredDishes = filteredDishes.filter(dish => dish.category === filters.category)
  }
  
  if (filters.cuisine) {
    filteredDishes = filteredDishes.filter(dish => dish.cuisine === filters.cuisine)
  }
  
  if (filters.difficulty) {
    filteredDishes = filteredDishes.filter(dish => dish.difficulty === filters.difficulty)
  }
  
  if (filters.maxCookingTime) {
    filteredDishes = filteredDishes.filter(dish => dish.cookingTime <= filters.maxCookingTime)
  }
  
  if (filteredDishes.length === 0) {
    return dishes[Math.floor(Math.random() * dishes.length)]
  }
  
  return filteredDishes[Math.floor(Math.random() * filteredDishes.length)]
}

/**
 * 根据分类获取菜品
 * @param {string} category 分类
 * @returns {array} 菜品列表
 */
const getDishesByCategory = (category) => {
  return dishes.filter(dish => dish.category === category)
}

/**
 * 搜索菜品
 * @param {string} keyword 关键词
 * @returns {array} 搜索结果
 */
const searchDishes = (keyword) => {
  const lowerKeyword = keyword.toLowerCase()
  return dishes.filter(dish => 
    dish.name.toLowerCase().includes(lowerKeyword) ||
    dish.description.toLowerCase().includes(lowerKeyword) ||
    dish.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

module.exports = {
  categories,
  cuisines,
  dishes,
  todayRecommendations,
  preferenceOptions,
  getRandomDish,
  getDishesByCategory,
  searchDishes
}