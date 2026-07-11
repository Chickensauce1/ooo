const WORD_LEVELS = [
  {
    id: "primary-1",
    group: "小学",
    name: "小学一年级",
    note: "字母与生活启蒙",
    words: [
      ["apple", "苹果"], ["ant", "蚂蚁"], ["arm", "手臂"], ["bag", "书包"],
      ["ball", "球"], ["banana", "香蕉"], ["bed", "床"], ["bird", "鸟"],
      ["book", "书"], ["boy", "男孩"], ["cake", "蛋糕"], ["car", "汽车"],
      ["cat", "猫"], ["class", "班级"], ["cow", "奶牛"], ["dad", "爸爸"],
      ["desk", "书桌"], ["dog", "狗"], ["door", "门"], ["egg", "鸡蛋"],
      ["eye", "眼睛"], ["face", "脸"], ["fish", "鱼"], ["girl", "女孩"],
      ["hand", "手"], ["hat", "帽子"], ["hello", "你好"], ["home", "家"],
      ["leg", "腿"], ["map", "地图"], ["milk", "牛奶"], ["mom", "妈妈"],
      ["moon", "月亮"], ["name", "名字"], ["nose", "鼻子"], ["pen", "钢笔"],
      ["pig", "猪"], ["red", "红色"], ["school", "学校"], ["star", "星星"],
      ["sun", "太阳"], ["tree", "树"], ["water", "水"], ["zoo", "动物园"]
    ]
  },
  {
    id: "primary-2",
    group: "小学",
    name: "小学二年级",
    note: "家庭与校园词汇",
    words: [
      ["afternoon", "下午"], ["animal", "动物"], ["baby", "婴儿"], ["bike", "自行车"],
      ["black", "黑色"], ["blue", "蓝色"], ["brother", "兄弟"], ["bus", "公共汽车"],
      ["chair", "椅子"], ["chicken", "鸡肉；小鸡"], ["child", "孩子"], ["classroom", "教室"],
      ["coat", "外套"], ["color", "颜色"], ["day", "白天"], ["family", "家庭"],
      ["father", "父亲"], ["friend", "朋友"], ["fruit", "水果"], ["game", "游戏"],
      ["green", "绿色"], ["happy", "开心的"], ["juice", "果汁"], ["kite", "风筝"],
      ["lunch", "午餐"], ["mother", "母亲"], ["orange", "橙子；橙色"], ["park", "公园"],
      ["pencil", "铅笔"], ["picture", "图片"], ["play", "玩耍"], ["rabbit", "兔子"],
      ["rice", "米饭"], ["sister", "姐妹"], ["teacher", "老师"], ["tiger", "老虎"],
      ["white", "白色"], ["window", "窗户"], ["yellow", "黄色"], ["young", "年轻的"]
    ]
  },
  {
    id: "primary-3",
    group: "小学",
    name: "小学三年级",
    note: "日常活动与天气",
    words: [
      ["airport", "机场"], ["answer", "回答"], ["bathroom", "浴室"], ["breakfast", "早餐"],
      ["camera", "相机"], ["candy", "糖果"], ["clean", "干净的；打扫"], ["cloudy", "多云的"],
      ["computer", "电脑"], ["dinner", "晚餐"], ["doctor", "医生"], ["draw", "画画"],
      ["drink", "喝；饮料"], ["eleven", "十一"], ["farm", "农场"], ["flower", "花"],
      ["football", "足球"], ["garden", "花园"], ["hospital", "医院"], ["hungry", "饥饿的"],
      ["library", "图书馆"], ["monkey", "猴子"], ["morning", "早晨"], ["music", "音乐"],
      ["night", "夜晚"], ["nurse", "护士"], ["plane", "飞机"], ["rainy", "下雨的"],
      ["river", "河流"], ["room", "房间"], ["shop", "商店"], ["sing", "唱歌"],
      ["snow", "雪"], ["sunny", "晴朗的"], ["table", "桌子"], ["twenty", "二十"],
      ["weather", "天气"], ["windy", "有风的"], ["write", "书写"]
    ]
  },
  {
    id: "primary-4",
    group: "小学",
    name: "小学四年级",
    note: "地点、感受与习惯",
    words: [
      ["afraid", "害怕的"], ["angry", "生气的"], ["beach", "海滩"], ["beautiful", "美丽的"],
      ["bedroom", "卧室"], ["birthday", "生日"], ["bottle", "瓶子"], ["cinema", "电影院"],
      ["city", "城市"], ["clothes", "衣服"], ["dance", "跳舞"], ["delicious", "美味的"],
      ["excited", "兴奋的"], ["favorite", "最喜欢的"], ["forest", "森林"], ["healthy", "健康的"],
      ["homework", "家庭作业"], ["kitchen", "厨房"], ["listen", "听"], ["mountain", "山"],
      ["movie", "电影"], ["often", "经常"], ["picnic", "野餐"], ["polite", "有礼貌的"],
      ["read", "阅读"], ["restaurant", "餐馆"], ["saturday", "星期六"], ["season", "季节"],
      ["sometimes", "有时"], ["sport", "运动"], ["sunday", "星期日"], ["supermarket", "超市"],
      ["swim", "游泳"], ["travel", "旅行"], ["village", "村庄"], ["weekend", "周末"],
      ["winter", "冬天"], ["wonderful", "精彩的"]
    ]
  },
  {
    id: "primary-5",
    group: "小学",
    name: "小学五年级",
    note: "学习、出行与自然",
    words: [
      ["along", "沿着"], ["always", "总是"], ["autumn", "秋天"], ["begin", "开始"],
      ["bridge", "桥"], ["careful", "小心的"], ["clever", "聪明的"], ["club", "社团"],
      ["country", "国家；乡村"], ["early", "早的"], ["earth", "地球"], ["email", "电子邮件"],
      ["finish", "完成"], ["friendly", "友好的"], ["future", "未来"], ["holiday", "假期"],
      ["lake", "湖"], ["learn", "学习"], ["leave", "离开"], ["lesson", "课程"],
      ["museum", "博物馆"], ["never", "从不"], ["plant", "植物；种植"], ["pond", "池塘"],
      ["problem", "问题；难题"], ["question", "问题"], ["right", "正确的；右边"], ["science", "科学"],
      ["should", "应该"], ["speak", "说"], ["story", "故事"], ["street", "街道"],
      ["study", "学习"], ["tomorrow", "明天"], ["train", "火车"], ["usually", "通常"],
      ["visit", "参观"], ["warm", "温暖的"], ["world", "世界"]
    ]
  },
  {
    id: "primary-6",
    group: "小学",
    name: "小学六年级",
    note: "综合表达与文化",
    words: [
      ["activity", "活动"], ["become", "成为"], ["believe", "相信"], ["between", "在……之间"],
      ["building", "建筑物"], ["camp", "营地；露营"], ["celebrate", "庆祝"], ["change", "改变"],
      ["choose", "选择"], ["difficult", "困难的"], ["dream", "梦想"], ["during", "在……期间"],
      ["enjoy", "享受；喜欢"], ["enough", "足够的"], ["famous", "著名的"], ["festival", "节日"],
      ["follow", "跟随"], ["important", "重要的"], ["interesting", "有趣的"], ["invite", "邀请"],
      ["message", "消息"], ["minute", "分钟"], ["nature", "自然"], ["office", "办公室"],
      ["people", "人们"], ["protect", "保护"], ["remember", "记得"], ["special", "特别的"],
      ["together", "一起"], ["traditional", "传统的"], ["understand", "理解"], ["useful", "有用的"],
      ["vacation", "假期"], ["volunteer", "志愿者"], ["waste", "浪费；废物"], ["yesterday", "昨天"]
    ]
  },
  {
    id: "junior-7",
    group: "初中",
    name: "初中七年级",
    note: "校园生活与基础表达",
    words: [
      ["ability", "能力"], ["across", "穿过"], ["advice", "建议"], ["already", "已经"],
      ["anything", "任何事物"], ["arrive", "到达"], ["article", "文章"], ["because", "因为"],
      ["boring", "无聊的"], ["center", "中心"], ["decide", "决定"], ["diary", "日记"],
      ["exercise", "锻炼；练习"], ["fantastic", "极好的"], ["grammar", "语法"], ["habit", "习惯"],
      ["happen", "发生"], ["information", "信息"], ["language", "语言"], ["laugh", "笑"],
      ["maybe", "也许"], ["musician", "音乐家"], ["practice", "练习"], ["quite", "相当"],
      ["reason", "原因"], ["seem", "似乎"], ["share", "分享"], ["similar", "相似的"],
      ["someone", "某人"], ["surprise", "惊喜"], ["theater", "剧院"], ["through", "通过；穿过"],
      ["twice", "两次"], ["umbrella", "雨伞"], ["until", "直到"], ["wonder", "想知道；奇迹"]
    ]
  },
  {
    id: "junior-8",
    group: "初中",
    name: "初中八年级",
    note: "经历、社会与观点",
    words: [
      ["accident", "事故"], ["against", "反对；倚着"], ["although", "虽然"], ["apartment", "公寓"],
      ["common", "普通的"], ["competition", "比赛"], ["condition", "状况"], ["culture", "文化"],
      ["danger", "危险"], ["environment", "环境"], ["experience", "经历；经验"], ["foreign", "外国的"],
      ["government", "政府"], ["improve", "提高"], ["include", "包括"], ["instead", "代替"],
      ["interest", "兴趣"], ["interview", "采访；面试"], ["journey", "旅程"], ["machine", "机器"],
      ["meaning", "意思"], ["medicine", "药"], ["member", "成员"], ["nervous", "紧张的"],
      ["opinion", "观点"], ["prepare", "准备"], ["program", "节目；程序"], ["promise", "承诺"],
      ["possible", "可能的"], ["relation", "关系"], ["simple", "简单的"], ["society", "社会"],
      ["successful", "成功的"], ["temperature", "温度"], ["thousand", "一千"]
    ]
  },
  {
    id: "junior-9",
    group: "初中",
    name: "初中九年级",
    note: "文化、科技与社会行动",
    words: [
      ["admire", "欣赏；钦佩"], ["attend", "出席"], ["behavior", "行为"], ["connect", "连接"],
      ["convenient", "方便的"], ["courage", "勇气"], ["create", "创造"], ["custom", "风俗"],
      ["direct", "直接的；指导"], ["discover", "发现"], ["eastern", "东方的"], ["educate", "教育"],
      ["effort", "努力"], ["electronic", "电子的"], ["examine", "检查"], ["exchange", "交换"],
      ["express", "表达"], ["influence", "影响"], ["invent", "发明"], ["knowledge", "知识"],
      ["local", "当地的"], ["manage", "管理；设法"], ["material", "材料"], ["method", "方法"],
      ["national", "国家的"], ["patient", "有耐心的；病人"], ["perform", "表演；执行"], ["prevent", "阻止"],
      ["public", "公众的"], ["receive", "收到"], ["request", "请求"], ["secret", "秘密"],
      ["silent", "沉默的"], ["stranger", "陌生人"], ["translate", "翻译"], ["value", "价值"],
      ["wisdom", "智慧"]
    ]
  },
  {
    id: "senior-1",
    group: "高中",
    name: "高中一年级",
    note: "学习策略与个人成长",
    words: [
      ["academic", "学术的"], ["attitude", "态度"], ["balance", "平衡"], ["challenge", "挑战"],
      ["communicate", "交流"], ["concentrate", "集中注意力"], ["concern", "担忧；关心"],
      ["confidence", "信心"], ["curious", "好奇的"], ["determine", "决定；确定"], ["equal", "平等的"],
      ["explore", "探索"], ["goal", "目标"], ["independent", "独立的"], ["individual", "个人；个体的"],
      ["likely", "可能的"], ["organize", "组织"], ["positive", "积极的"], ["prefer", "更喜欢"],
      ["pressure", "压力"], ["quality", "质量；品质"], ["recommend", "推荐"], ["reduce", "减少"],
      ["responsible", "负责的"], ["schedule", "日程安排"], ["solution", "解决办法"], ["strategy", "策略"],
      ["strength", "力量；长处"], ["suitable", "合适的"], ["topic", "话题"], ["unique", "独特的"]
    ]
  },
  {
    id: "senior-2",
    group: "高中",
    name: "高中二年级",
    note: "社会议题与逻辑表达",
    words: [
      ["adapt", "适应"], ["advance", "进步；推进"], ["affect", "影响"], ["approach", "方法；接近"],
      ["benefit", "益处；使受益"], ["career", "职业"], ["compare", "比较"], ["complex", "复杂的"],
      ["contribute", "贡献"], ["current", "当前的"], ["demand", "需求；要求"],
      ["develop", "发展"], ["economy", "经济"], ["effective", "有效的"], ["establish", "建立"],
      ["evidence", "证据"], ["factor", "因素"], ["feature", "特征"], ["function", "功能"],
      ["identity", "身份"], ["impact", "影响"], ["issue", "问题；议题"], ["maintain", "维持"],
      ["major", "主要的；专业"], ["opportunity", "机会"], ["process", "过程"], ["require", "需要"],
      ["resource", "资源"], ["significant", "重要的；显著的"], ["technology", "技术"], ["theory", "理论"]
    ]
  },
  {
    id: "senior-3",
    group: "高中",
    name: "高中三年级",
    note: "抽象概念与学术阅读",
    words: [
      ["abstract", "抽象的；摘要"], ["analyze", "分析"], ["assume", "假设；认为"], ["authority", "权威；当局"],
      ["available", "可获得的"], ["concept", "概念"], ["consist", "由……组成"], ["context", "语境；背景"],
      ["data", "数据"], ["define", "定义"], ["derive", "获得；源自"], ["distribute", "分配；分布"],
      ["estimate", "估计"], ["evaluate", "评价"], ["indicate", "表明"], ["interpret", "解释"],
      ["involve", "涉及"], ["legal", "合法的"], ["occur", "发生"], ["principle", "原则"],
      ["respond", "回应"], ["role", "角色；作用"], ["section", "部分"], ["source", "来源"],
      ["structure", "结构"], ["vary", "变化"], ["virtual", "虚拟的"], ["visible", "可见的"]
    ]
  },
  {
    id: "college-basic",
    group: "大学",
    name: "大学基础",
    note: "通用学术与校园英语",
    words: [
      ["achieve", "实现"], ["acquire", "获得"], ["alternative", "替代方案；可替代的"], ["appropriate", "合适的"],
      ["approximate", "大约的；接近"], ["capacity", "能力；容量"], ["circumstance", "情况"], ["commitment", "承诺；投入"],
      ["community", "社区；群体"], ["consequence", "后果"], ["considerable", "相当大的"], ["constant", "持续的；常数"],
      ["construct", "建造；构想"], ["consume", "消耗"], ["cooperate", "合作"], ["decline", "下降；拒绝"],
      ["demonstrate", "展示；证明"], ["despite", "尽管"], ["distinguish", "区分"], ["efficient", "高效的"],
      ["eliminate", "消除"], ["emphasis", "强调"], ["ensure", "确保"], ["equivalent", "相等的；等价物"],
      ["expand", "扩大"], ["generate", "产生"], ["illustrate", "说明；阐明"], ["imply", "暗示"],
      ["instance", "例子"], ["potential", "潜力；潜在的"], ["previous", "先前的"], ["primary", "主要的"],
      ["restrict", "限制"], ["seek", "寻求"], ["select", "选择"], ["transfer", "转移；转学"]
    ]
  },
  {
    id: "college-cet4",
    group: "大学",
    name: "大学英语四级",
    note: "四级核心词汇",
    words: [
      ["acknowledge", "承认；感谢"], ["adequate", "足够的"], ["apparent", "明显的"], ["application", "应用；申请"],
      ["artificial", "人工的"], ["assess", "评估"], ["category", "类别"], ["civil", "公民的；文明的"],
      ["comprehensive", "全面的"], ["conduct", "进行；行为"], ["conflict", "冲突"], ["consistent", "一致的"],
      ["crucial", "关键的"], ["domestic", "国内的；家庭的"], ["element", "要素"], ["enable", "使能够"],
      ["encounter", "遇到"], ["enormous", "巨大的"], ["exclude", "排除"], ["expose", "暴露；揭露"],
      ["framework", "框架"], ["fundamental", "基本的"], ["highlight", "突出；亮点"], ["hypothesis", "假设"],
      ["implement", "实施"], ["initial", "最初的"], ["justify", "证明……合理"], ["mechanism", "机制"],
      ["obtain", "获得"], ["perceive", "感知；理解"], ["proportion", "比例"], ["relevant", "相关的"],
      ["substitute", "替代"], ["sustain", "维持；支撑"]
    ]
  },
  {
    id: "college-cet6",
    group: "大学",
    name: "大学英语六级",
    note: "六级进阶词汇",
    words: [
      ["ambiguous", "模棱两可的"], ["anticipate", "预期"], ["coherent", "连贯的"], ["compensate", "补偿"],
      ["compile", "编写；汇编"], ["contradict", "反驳；与……矛盾"], ["controversial", "有争议的"], ["cumulative", "累积的"],
      ["deduce", "推断"], ["deteriorate", "恶化"], ["dilemma", "困境"], ["discriminate", "区分；歧视"],
      ["elaborate", "详尽的；阐述"], ["empirical", "实证的"], ["facilitate", "促进"], ["feasible", "可行的"],
      ["fluctuate", "波动"], ["formulate", "制定；表达"], ["integrate", "整合"], ["intrinsic", "内在的"],
      ["manipulate", "操纵；熟练处理"], ["nevertheless", "尽管如此"], ["paradigm", "范式"], ["preliminary", "初步的"],
      ["profound", "深刻的"], ["radical", "根本的；激进的"], ["reinforce", "加强"], ["reluctant", "不情愿的"],
      ["simultaneous", "同时发生的"], ["sophisticated", "复杂精密的"], ["subordinate", "次要的；下属"], ["tentative", "暂定的"],
      ["transparent", "透明的；易懂的"], ["validate", "验证"], ["vulnerable", "脆弱的"]
    ]
  }
];

window.WORD_LEVELS = WORD_LEVELS;

const vocabularyIndex = new Map();
WORD_LEVELS.forEach((level) => {
  level.words.forEach(([word]) => vocabularyIndex.set(word, level.id));
});

window.VOCABULARY_WARNINGS = [];
window.addVocabularyPack = (levelId, source) => {
  const level = WORD_LEVELS.find((item) => item.id === levelId);
  if (!level) {
    window.VOCABULARY_WARNINGS.push(`未知词库层级：${levelId}`);
    return;
  }

  source.trim().split(/\r?\n/).forEach((line, lineIndex) => {
    const separator = line.indexOf("|");
    const word = line.slice(0, separator).trim().toLowerCase();
    const meaning = line.slice(separator + 1).trim();

    if (separator < 1 || !/^[a-z]+$/.test(word) || !meaning) {
      window.VOCABULARY_WARNINGS.push(`${levelId} 第 ${lineIndex + 1} 行格式错误：${line}`);
      return;
    }
    if (vocabularyIndex.has(word)) {
      window.VOCABULARY_WARNINGS.push(
        `${word} 同时出现在 ${vocabularyIndex.get(word)} 和 ${levelId}`
      );
      return;
    }

    vocabularyIndex.set(word, levelId);
    level.words.push([word, meaning]);
  });
};
