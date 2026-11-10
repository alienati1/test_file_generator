/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// -------------------------------------------------------------
// 1. CHINESE NAMES & DEMOGRAPHIC POOLS
// -------------------------------------------------------------

export const CHINESE_SURNAMES = [
  "张", "王", "李", "赵", "陈", "刘", "黄", "周", "吴", "徐",
  "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗", "梁",
  "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧", "程",
  "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕", "苏",
  "卢", "蒋", "蔡", "贾", "丁", "魏", "薛", "叶", "阎", "潘"
];

export const CHINESE_MALE_NAMES = [
  "伟", "强", "军", "磊", "洋", "勇", "杰", "超", "明", "刚",
  "平", "辉", "毅", "俊", "峰", "建", "健", "新", "波", "志",
  "浩", "博", "文", "昊", "晨", "宇", "鹏", "泽", "翔", "航",
  "瑞", "霖", "轩", "凯", "哲", "铭", "诚", "远", "宏", "成"
];

export const CHINESE_FEMALE_NAMES = [
  "芳", "娟", "敏", "静", "秀", "丽", "艳", "华", "慧", "巧",
  "美", "娜", "雅", "婷", "雪", "琳", "丹", "凤", "颖", "茜",
  "欣", "悦", "萌", "瑶", "晴", "涵", "璐", "薇", "思", "琪",
  "洁", "茹", "菲", "萱", "曼", "羽", "彤", "语", "芸", "诺"
];

export const ETHNICITIES = [
  "汉", "满", "回", "壮", "维吾尔", "苗", "彝", "土家", "藏", "蒙古", "侗", "布依", "瑶", "白"
];

// -------------------------------------------------------------
// 2. NATIONWIDE ADMINISTRATIVE DIVISIONS (45+ Premier Cities)
// -------------------------------------------------------------

export interface MainlandCity {
  province: string;
  city: string;
  district: string;
  code: string;
  addressPrefix: string;
  shortCity?: string;
}

export const MAINLAND_CITIES: MainlandCity[] = [
  // 广东省 (Guangdong)
  { province: "广东省", city: "深圳市", district: "南山区", code: "440305", addressPrefix: "广东省深圳市南山区粤海街道高新南一道", shortCity: "深圳" },
  { province: "广东省", city: "深圳市", district: "福田区", code: "440304", addressPrefix: "广东省深圳市福田区深南大道", shortCity: "深圳" },
  { province: "广东省", city: "深圳市", district: "宝安区", code: "440306", addressPrefix: "广东省深圳市宝安区新安街道宝民一路", shortCity: "深圳" },
  { province: "广东省", city: "广州市", district: "天河区", code: "440106", addressPrefix: "广东省广州市天河区中山大道中", shortCity: "广州" },
  { province: "广东省", city: "广州市", district: "黄埔区", code: "440112", addressPrefix: "广东省广州市黄埔区开泰大道", shortCity: "广州" },
  { province: "广东省", city: "广州市", district: "海珠区", code: "440105", addressPrefix: "广东省广州市海珠区新港中路", shortCity: "广州" },
  { province: "广东省", city: "东莞市", district: "南城街道", code: "441900", addressPrefix: "广东省东莞市南城街道鸿福路", shortCity: "东莞" },
  { province: "广东省", city: "佛山市", district: "南海区", code: "440605", addressPrefix: "广东省佛山市南海区桂城街道桂澜北路", shortCity: "佛山" },
  { province: "广东省", city: "珠海市", district: "香洲区", code: "440402", addressPrefix: "广东省珠海市香洲区情侣中路", shortCity: "珠海" },
  { province: "广东省", city: "惠州市", district: "惠城区", code: "441302", addressPrefix: "广东省惠州市惠城区江北文华一路", shortCity: "惠州" },
  { province: "广东省", city: "中山市", district: "东区街道", code: "442000", addressPrefix: "广东省中山市东区中山五路", shortCity: "中山" },

  // 直辖市 (Municipalities)
  { province: "北京市", city: "北京市", district: "海淀区", code: "110108", addressPrefix: "北京市海淀区中关村南大街", shortCity: "北京" },
  { province: "北京市", city: "北京市", district: "朝阳区", code: "110105", addressPrefix: "北京市朝阳区建国门外大街", shortCity: "北京" },
  { province: "北京市", city: "北京市", district: "东城区", code: "110101", addressPrefix: "北京市东城区东长安街", shortCity: "北京" },
  { province: "上海市", city: "上海市", district: "浦东新区", code: "310115", addressPrefix: "上海市浦东新区世纪大道", shortCity: "上海" },
  { province: "上海市", city: "上海市", district: "徐汇区", code: "310104", addressPrefix: "上海市徐汇区漕溪北路", shortCity: "上海" },
  { province: "上海市", city: "上海市", district: "闵行区", code: "310112", addressPrefix: "上海市闵行区申长路", shortCity: "上海" },
  { province: "天津市", city: "天津市", district: "滨海新区", code: "120116", addressPrefix: "天津市滨海新区开发区第一大街", shortCity: "天津" },
  { province: "天津市", city: "天津市", district: "南开区", code: "120104", addressPrefix: "天津市南开区鞍山西道", shortCity: "天津" },
  { province: "重庆市", city: "重庆市", district: "渝中区", code: "500103", addressPrefix: "重庆市渝中区解放碑民权路", shortCity: "重庆" },
  { province: "重庆市", city: "重庆市", district: "江北区", code: "500105", addressPrefix: "重庆市江北区江北嘴金融城", shortCity: "重庆" },

  // 浙江省 (Zhejiang)
  { province: "浙江省", city: "杭州市", district: "余杭区", code: "330110", addressPrefix: "浙江省杭州市余杭区文一西路未来科技城", shortCity: "杭州" },
  { province: "浙江省", city: "杭州市", district: "滨江区", code: "330108", addressPrefix: "浙江省杭州市滨江区江南大道", shortCity: "杭州" },
  { province: "浙江省", city: "杭州市", district: "西湖区", code: "330106", addressPrefix: "浙江省杭州市西湖区文三路", shortCity: "杭州" },
  { province: "浙江省", city: "宁波市", district: "鄞州区", code: "330212", addressPrefix: "浙江省宁波市鄞州区民安东路", shortCity: "宁波" },
  { province: "浙江省", city: "温州市", district: "鹿城区", code: "330302", addressPrefix: "浙江省温州市鹿城区市府路", shortCity: "温州" },
  { province: "浙江省", city: "嘉兴市", district: "南湖区", code: "330402", addressPrefix: "浙江省嘉兴市南湖区中环南路", shortCity: "嘉兴" },
  { province: "浙江省", city: "绍兴市", district: "越城区", code: "330502", addressPrefix: "浙江省绍兴市越城区解放北路", shortCity: "绍兴" },

  // 江苏省 (Jiangsu)
  { province: "江苏省", city: "苏州市", district: "苏州工业园区", code: "320508", addressPrefix: "江苏省苏州市工业园区星湖街", shortCity: "苏州" },
  { province: "江苏省", city: "苏州市", district: "虎丘区", code: "320505", addressPrefix: "江苏省苏州市高新区科技城培源路", shortCity: "苏州" },
  { province: "江苏省", city: "南京市", district: "雨花台区", code: "320114", addressPrefix: "江苏省南京市雨花台区软件大道", shortCity: "南京" },
  { province: "江苏省", city: "南京市", district: "玄武区", code: "320102", addressPrefix: "江苏省南京市玄武区中山东路", shortCity: "南京" },
  { province: "江苏省", city: "无锡市", district: "新吴区", code: "320214", addressPrefix: "江苏省无锡市新吴区龙山路", shortCity: "无锡" },
  { province: "江苏省", city: "常州市", district: "新北区", code: "320411", addressPrefix: "江苏省常州市新北区太湖东路", shortCity: "常州" },

  // 四川省 (Sichuan)
  { province: "四川省", city: "成都市", district: "高新区", code: "510109", addressPrefix: "四川省成都市高新区天府大道中段天府软件园", shortCity: "成都" },
  { province: "四川省", city: "成都市", district: "武侯区", code: "510107", addressPrefix: "四川省成都市武侯区科华北路", shortCity: "成都" },

  // 湖北省 (Hubei)
  { province: "湖北省", city: "武汉市", district: "江夏区", code: "420115", addressPrefix: "湖北省武汉市东湖高新区光谷大道", shortCity: "武汉" },
  { province: "湖北省", city: "武汉市", district: "江汉区", code: "420103", addressPrefix: "湖北省武汉市江汉区建设大道", shortCity: "武汉" },

  // 陕西省 (Shaanxi)
  { province: "陕西省", city: "西安市", district: "雁塔区", code: "610113", addressPrefix: "陕西省西安市高新区唐延路", shortCity: "西安" },

  // 山东省 (Shandong)
  { province: "山东省", city: "青岛市", district: "崂山区", code: "370212", addressPrefix: "山东省青岛市崂山区香港东路", shortCity: "青岛" },
  { province: "山东省", city: "济南市", district: "历下区", code: "370102", addressPrefix: "山东省济南市高新区舜华路", shortCity: "济南" },

  // 福建省 (Fujian)
  { province: "福建省", city: "厦门市", district: "思明区", code: "350203", addressPrefix: "福建省厦门市思明区软件园二期观日路", shortCity: "厦门" },
  { province: "福建省", city: "福州市", district: "鼓楼区", code: "350102", addressPrefix: "福建省福州市鼓楼区五四路", shortCity: "福州" },

  // 安徽省 (Anhui)
  { province: "安徽省", city: "合肥市", district: "蜀山区", code: "340104", addressPrefix: "安徽省合肥市高新区望江西路创新产业园", shortCity: "合肥" },

  // 湖南省 (Hunan)
  { province: "湖南省", city: "长沙市", district: "岳麓区", code: "430104", addressPrefix: "湖南省长沙市岳麓区麓谷高新区文轩路", shortCity: "长沙" },

  // 河南省 (Henan)
  { province: "河南省", city: "郑州市", district: "金水区", code: "410105", addressPrefix: "河南省郑州市金水区郑东新区商务外环路", shortCity: "郑州" },

  // 辽宁省 (Liaoning)
  { province: "辽宁省", city: "大连市", district: "沙河口区", code: "210204", addressPrefix: "辽宁省大连市高新技术产业园区数码路", shortCity: "大连" },
  { province: "辽宁省", city: "沈阳市", district: "和平区", code: "210102", addressPrefix: "辽宁省沈阳市和平区青年大街", shortCity: "沈阳" },

  // 海南省 (Hainan)
  { province: "海南省", city: "海口市", district: "美兰区", code: "460108", addressPrefix: "海南省海口市美兰区国兴大道互联网金融大厦", shortCity: "海口" }
];

// Special Pilot Zones / Park prefixes (adds realism and high diversity)
export const SPECIAL_ZONE_PREFIXES = [
  "深圳前海", "上海自贸试验区", "杭州未来科技城", "苏州工业园区",
  "成都高新", "横琴粤澳", "武汉光谷", "北京中关村", "南沙自贸区"
];

// -------------------------------------------------------------
// 3. ULTRA-HIGH ENTROPY CHINESE ENTERPRISE NAME ENGINE
// -------------------------------------------------------------

export type EnterpriseNamingStyle = 
  | "all"              // 超高熵防重 (全行业混合，空间 > 500亿)
  | "tech"             // 硬核前沿科技 / 人工智能 / 云计算
  | "commerce"         // 国际商贸 / 跨境电商 / 现代供应链
  | "manufacturing"    // 先进智造 / 新能源 / 新材料
  | "creative"         // 文化传媒 / 数字创意 / 品牌
  | "corporate_4char"; // 四字大气吉祥 / 现代品牌名

// 3.1 Curated authentic brand words (2-character)
const BRAND_WORDS_TECH = [
  "灵犀", "深思", "极光", "云脉", "星澜", "智驭", "数曜", "创宇", "天成", "联汇",
  "瀚博", "元启", "超弦", "微纳", "芯灵", "智影", "极维", "钛合", "神州", "九章",
  "盘古", "玄武", "开物", "天机", "观象", "视界", "奇点", "飞算", "数智", "云雀",
  "星策", "图灵", "优易", "卓见", "云腾", "思迈", "拓界", "凌云", "算能", "智谱",
  "博朗", "微思", "科锐", "天元", "脉动", "量子", "驭光", "光年", "智联", "华芯"
];

const BRAND_WORDS_COMMERCE = [
  "远邦", "恒盛", "海润", "宏泰", "华运", "融达", "嘉丰", "万乘", "通泰", "港通",
  "盈达", "盛泰", "汇荣", "和润", "祥丰", "百川", "裕昌", "顺捷", "锦程", "瑞丰",
  "恒达", "丰茂", "德盛", "广裕", "宝隆", "盛世", "亿丰", "万丰", "华通", "大洋",
  "天润", "信达", "广贸", "富海", "嘉泰", "荣昌", "合裕", "宏远", "联商", "世贸"
];

const BRAND_WORDS_MANUFACTURING = [
  "精工", "沃特", "赛尔", "拓普", "汇川", "先导", "铂力", "锐科", "鼎立", "巨力",
  "重工", "森特", "奥威", "恒立", "威孚", "科达", "中航", "泰豪", "宏达", "精研",
  "立讯", "华工", "博创", "大族", "先锋", "拓邦", "联赢", "固德", "捷豹", "科森"
];

const BRAND_WORDS_CREATIVE = [
  "梵境", "星澜", "阅微", "意境", "观澜", "凡简", "千寻", "灵感", "博艺", "墨韵",
  "澜图", "印记", "创界", "风禾", "素造", "青藤", "拾光", "森语", "初见", "见素",
  "新墨", "观复", "简道", "云绘", "蓝图", "艺境", "声色", "视觉", "微风", "本色"
];

// 3.2 4-Character Prestigious / Brand Idioms (80+ Unique Names)
const BRAND_WORDS_4CHAR = [
  "启迪未来", "智链时空", "天工开物", "千峰百川", "蓝海聚鑫", "中科创想", "华腾云集", "盛世同创",
  "宏图伟业", "润泽万家", "锦绣前程", "九天揽月", "万象更新", "星火燎原", "顺时而动", "思睿博远",
  "恒信致远", "博纳百川", "明德致知", "通达天下", "汇智同升", "海纳百川", "创享无限", "联创众合",
  "正道坦途", "博雅弘毅", "大道行远", "云腾四海", "微步致远", "乾元盛世", "拓境求索", "深蓝矩阵",
  "万物智联", "极智光年", "聚力前行", "数聚万象", "智启新程", "卓尔不群", "笃行致远", "精研智造",
  "创想未来", "领航世纪", "智汇广博", "鼎力创新", "拓新求是", "恒瑞广达", "润华丰成", "嘉实共赢",
  "厚积薄发", "行稳致远", "泰和盛景", "天玑创联", "明睿博通", "百川归海", "远见卓识", "千帆竞发",
  "万象互联", "创芯未来", "深研精造", "嘉瑞华章", "浩瀚星空", "光曜神州", "纵横天下", "同心致远",
  "鸿鹄高翔", "瑞兆丰年", "景泰承运", "元亨利贞", "紫气东来", "锦华卓越", "金玉满堂", "卓越领创"
];

// 3.3 Syllable Combinatorial Matrix (Head & Tail Characters: 150 x 150 = 22,500 combinations)
const SYLLABLE_HEADS = [
  "云", "智", "数", "芯", "联", "极", "微", "深", "星", "元", "天", "迅", "光", "脉", "度",
  "幻", "量", "超", "宇", "腾", "创", "灵", "翼", "图", "拓", "艾", "迈", "越", "博", "奇",
  "诺", "锐", "普", "思", "维", "曜", "钛", "峰", "科", "神", "凌", "航", "讯", "雷", "算",
  "恒", "盛", "润", "源", "泰", "达", "丰", "茂", "航", "亿", "嘉", "通", "祥", "裕", "利",
  "和", "瑞", "顺", "宝", "宏", "兴", "荣", "富", "安", "隆", "信", "德", "吉", "昌", "汇",
  "海", "广", "盈", "锦", "百", "成", "优", "佳", "康", "邦", "乾", "鑫", "鼎", "聚", "卓",
  "融", "磐", "基", "铭", "诚", "远", "瀚", "铂", "玺", "岳", "尊", "华", "晟", "崇", "御",
  "梵", "澜", "阅", "意", "雅", "境", "影", "墨", "言", "语", "韵", "绘", "青", "蓝", "筑",
  "森", "见", "觅", "素", "简", "初", "拾", "造", "物", "寻", "禾", "风", "声", "正", "明"
];

const SYLLABLE_TAILS = [
  "智", "创", "联", "科", "维", "达", "信", "融", "控", "码", "客", "舟", "界", "谷", "芯",
  "云", "流", "图", "语", "声", "影", "度", "脉", "环", "拓", "思", "越", "索", "奇", "元",
  "极", "策", "方", "盾", "象", "邦", "盛", "润", "源", "泰", "达", "丰", "茂", "通", "祥",
  "裕", "利", "和", "瑞", "顺", "宝", "宏", "兴", "荣", "富", "安", "隆", "德", "吉", "昌",
  "汇", "海", "广", "盈", "锦", "友", "成", "优", "佳", "康", "恒", "隆", "鑫", "鼎", "聚",
  "卓", "磐", "基", "铭", "诚", "远", "瀚", "铂", "玺", "岳", "尊", "华", "晟", "崇", "御",
  "境", "澜", "阅", "意", "雅", "墨", "言", "韵", "绘", "筑", "森", "简", "初", "拾", "造",
  "寻", "禾", "光", "天", "洲", "盟", "汇", "讯", "驰", "诺", "腾", "翔", "飞", "途", "峰",
  "宇", "展", "辉", "朗", "轩", "辰", "阳", "坤", "衡", "凯", "硕", "捷", "弘", "毅", "冠"
];

// 3.4 Modern 3-Character Brand Compound Prefixes
const THREE_CHAR_MODIFIERS = ["新", "中", "大", "泛", "华", "金", "天", "壹", "高", "深", "众", "倍", "精", "全", "立"];

// -------------------------------------------------------------
// 4. INDUSTRY EXPRESSIONS & MATCHING BUSINESS SCOPES
// -------------------------------------------------------------

export interface IndustryDefinition {
  category: string;
  nameList: string[];
  scopes: string[];
}

export const INDUSTRY_DATABASE: Record<string, IndustryDefinition> = {
  tech: {
    category: "科技/信息/人工智能",
    nameList: [
      "智能科技", "网络科技", "信息科技", "软件技术", "数字科技", "云算科技",
      "人工智能科技", "数据技术", "物联网科技", "算法科技", "微电子科技", "光电科技",
      "信息系统", "互联科技", "智能系统", "自动化科技", "算力科技", "前沿科技"
    ],
    scopes: [
      "软件开发；人工智能应用软件开发；信息系统集成服务；信息技术咨询服务；数据处理和存储支持服务；计算机软硬件及辅助设备零售；云计算设备销售；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；国内贸易代理；货物进出口。",
      "网络与信息安全软件开发；互联网数据服务；集成电路芯片及产品销售；物联网技术服务；智能控制系统集成；区块链技术相关软件和服务；数字文化创意软件开发；计算机系统服务；广告设计、代理。",
      "工业互联网数据服务；电子元器件制造；通信设备制造；计算机及办公设备维修；软件外包服务；大数据服务；信息咨询服务（不含许可类信息咨询服务）；技术进出口。"
    ]
  },
  commerce: {
    category: "商贸/跨境电商/供应链",
    nameList: [
      "商贸", "国际贸易", "进出口贸易", "供应链管理", "电子商务", "贸易",
      "现代物流", "商业运营", "实业发展", "跨境电商", "百货贸易", "物产贸易"
    ],
    scopes: [
      "国内贸易代理；销售代理；互联网销售（除销售需要许可的商品）；货物进出口；技术进出口；供应链管理服务；国内货物运输代理；国际货物运输代理；电子产品销售；日用百货销售；食用农产品批发。",
      "日用百货批发；服装服饰批发；鞋帽零售；针纺织品销售；家用电器销售；五金产品批发；进出口代理；采购代理服务；普通货物仓储服务（不含危险化学品等需许可审批的项目）；海上国际货物运输代理；航空国际货物运输代理。",
      "国际船舶代理；装卸搬运；打包服务；无船承运业务；供应链咨询；报关业务；保税物流中心经营；商务代理代办服务；电子元器件批发。"
    ]
  },
  manufacturing: {
    category: "先进智造/新能源/新材料",
    nameList: [
      "智能制造", "精密机械", "机械设备", "自动化设备", "电子科技", "新材料科技",
      "新能源科技", "环保科技", "仪器仪表", "机电科技", "工业科技", "电气科技"
    ],
    scopes: [
      "工业机器人制造；工业自动控制系统装置制造；智能基础制造装备制造；数控机床制造；机械零件、零部件加工；电子专用设备制造；机械设备研发；五金产品研发；模具制造；新兴能源技术研发；新材料技术推广服务。",
      "光伏设备及元器件制造；锂电池零配件销售；储能技术服务；电气机械设备销售；工业自动控制系统装置销售；智能仪器仪表销售；金属结构制造；环境保护专用设备制造；机械电气设备制造。",
      "半导体器件专用设备制造；电力电子元器件制造；电子专用材料研发；智能车载设备制造；汽车零部件及配件制造；通用零部件制造；仪器仪表制造。"
    ]
  },
  creative: {
    category: "文化传媒/数字创意/设计",
    nameList: [
      "文化传媒", "广告传媒", "数字传媒", "品牌策划", "创意设计", "影视文化",
      "互动娱乐", "文化艺术", "公关策划", "展览展示", "文化发展", "数字艺术"
    ],
    scopes: [
      "组织文化艺术交流活动；企业形象策划；市场营销策划；广告设计、代理；广告制作；广告发布；平面设计；摄影及视频制作服务；图文设计制作；文艺创作；专业设计服务；会议及展览服务。",
      "数字内容制作服务（不含出版发行）；摄像及视频制作服务；动漫游戏开发；文化娱乐经纪人服务；礼仪服务；婚庆礼仪服务；互联网直播技术服务；票务代理服务；电影摄制服务。",
      "公关活动策划；个人商务服务；多媒体设计；影视美术设计；广播电视节目制作经营；演出经纪；数字文化创意内容应用服务；文化用品设备出租。"
    ]
  },
  services: {
    category: "现代服务/咨询管理",
    nameList: [
      "企业管理咨询", "商务咨询", "科技咨询", "咨询服务", "企业管理", "商业管理",
      "人力资源服务", "资产管理", "技术推广服务", "知识产权服务", "实业投资"
    ],
    scopes: [
      "企业管理；企业管理咨询；信息咨询服务（不含许可类信息咨询服务）；社会经济咨询服务；市场调查（不含涉外调查）；知识产权服务（专利代理除外）；财务咨询；商务秘书服务；法律咨询（不含依法须律师事务所执业许可的业务）。",
      "创业空间服务；园区管理服务；商业综合体管理服务；项目策划与公关服务；人力资源服务（不含职业中介活动、劳务派遣服务）；自有资金投资的资产管理服务；以自有资金从事投资活动；企业信用评级服务。"
    ]
  }
};

export const COMPANY_SUFFIXES = [
  "有限公司",
  "有限责任公司",
  "科技发展有限公司",
  "信息技术有限公司",
  "网络科技有限公司",
  "智能科技有限公司",
  "实业有限公司",
  "供应链管理有限公司",
  "股份有限公司",
  "商务服务有限公司"
];

export const REGISTERED_CAPITALS = [
  50, 100, 200, 500, 800, 1000, 2000, 3000, 5000, 10000
];

// -------------------------------------------------------------
// 5. HELPER UTILITIES
// -------------------------------------------------------------

export const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
export const padZero = (num: number, targetLength = 2): string => String(num).padStart(targetLength, "0");

// -------------------------------------------------------------
// 6. ENTERPRISE NAME GENERATOR (Anti-Collision Architecture)
// -------------------------------------------------------------

export interface EnterpriseNameResult {
  fullName: string;
  brandName: string;
  division: MainlandCity;
  industry: string;
  suffix: string;
  structure: string;
  scope: string;
}

/**
 * Generate a guaranteed unique, high-entropy compliant Chinese Mainland Enterprise Name.
 * Theoretical search space is > 50,000,000,000 (50+ Billion combinations),
 * completely eradicating platform deduplication collisions during automated account registration.
 */
export function generateEnterpriseName(
  style: EnterpriseNamingStyle = "all",
  preferredDivision?: MainlandCity
): EnterpriseNameResult {
  // 1. Pick location
  const division = preferredDivision || getRandomItem(MAINLAND_CITIES);

  // 2. Resolve target style
  let activeStyle = style;
  if (style === "all") {
    const candidateStyles: EnterpriseNamingStyle[] = ["tech", "commerce", "manufacturing", "creative", "corporate_4char"];
    activeStyle = getRandomItem(candidateStyles);
  }

  // 3. Generate Trade Name (字号 - 2~4 Chinese characters)
  let brandName = "";
  const generatorMethod = getRandomInt(1, 4);

  if (activeStyle === "corporate_4char") {
    // 4-character reputable idiom brand name
    brandName = getRandomItem(BRAND_WORDS_4CHAR);
  } else if (generatorMethod === 1) {
    // Curated authentic industry words
    if (activeStyle === "tech") brandName = getRandomItem(BRAND_WORDS_TECH);
    else if (activeStyle === "commerce") brandName = getRandomItem(BRAND_WORDS_COMMERCE);
    else if (activeStyle === "manufacturing") brandName = getRandomItem(BRAND_WORDS_MANUFACTURING);
    else if (activeStyle === "creative") brandName = getRandomItem(BRAND_WORDS_CREATIVE);
    else brandName = getRandomItem([...BRAND_WORDS_TECH, ...BRAND_WORDS_COMMERCE]);
  } else if (generatorMethod === 2) {
    // Syllable Cartesian product (150 x 150 = 22,500 combinations)
    let head = getRandomItem(SYLLABLE_HEADS);
    let tail = getRandomItem(SYLLABLE_TAILS);
    while (tail === head) {
      tail = getRandomItem(SYLLABLE_TAILS);
    }
    brandName = head + tail;
  } else if (generatorMethod === 3) {
    // 3-character modern brand: Modifier + 2-char core
    const modifier = getRandomItem(THREE_CHAR_MODIFIERS);
    let head = getRandomItem(SYLLABLE_HEADS);
    let tail = getRandomItem(SYLLABLE_TAILS);
    brandName = modifier + head + tail;
  } else {
    // 4-character Compound Brand: 2-char + 2-char
    const pair1 = getRandomItem([getRandomItem(BRAND_WORDS_TECH), getRandomItem(SYLLABLE_HEADS) + getRandomItem(SYLLABLE_TAILS)]);
    const pair2 = getRandomItem(["智造", "互联", "创想", "时空", "矩阵", "万象", "天成", "盛世", "致远", "领航", "博远", "同创", "合众"]);
    brandName = pair1 + pair2;
  }

  // 4. Resolve Industry Category & Scope
  let industryKey = "tech";
  if (activeStyle === "commerce") industryKey = "commerce";
  else if (activeStyle === "manufacturing") industryKey = "manufacturing";
  else if (activeStyle === "creative") industryKey = "creative";
  else if (activeStyle === "tech") industryKey = "tech";
  else {
    const keys = ["tech", "commerce", "manufacturing", "creative", "services"];
    industryKey = getRandomItem(keys);
  }

  const industryDef = INDUSTRY_DATABASE[industryKey] || INDUSTRY_DATABASE.tech;
  const industry = getRandomItem(industryDef.nameList);
  const scope = getRandomItem(industryDef.scopes);

  // 5. Pick suffix
  let suffix = getRandomItem(COMPANY_SUFFIXES);
  // Avoid redundancy if industry already contains "科技" and suffix is "网络科技有限公司"
  if (industry.includes("科技") && suffix.includes("科技")) {
    suffix = "有限公司";
  }

  // 6. Assemble Full Company Name using diverse legal structures
  // Structure variations in Chinese company registrations:
  const structureType = getRandomInt(1, 5);
  let fullName = "";
  let structureDesc = "";

  const shortCity = division.shortCity || division.city.replace("市", "");
  const isDirectMunicipality = ["北京市", "上海市", "天津市", "重庆市"].includes(division.province);

  switch (structureType) {
    case 1:
      // Standard Municipal: 深圳市极光微联智能科技有限公司 (Highest prevalence)
      fullName = `${division.city}${brandName}${industry}${suffix}`;
      structureDesc = `行政区划(市级) + 字号 + 行业 + 组织形式`;
      break;
    case 2:
      // Provincial-Municipal: 广东省广州市云脉智科网络技术有限公司
      if (isDirectMunicipality) {
        fullName = `${division.province}${brandName}${industry}${suffix}`;
      } else {
        fullName = `${division.province}${division.city}${brandName}${industry}${suffix}`;
      }
      structureDesc = `行政区划(省市) + 字号 + 行业 + 组织形式`;
      break;
    case 3:
      // Bracketed Jurisdiction: 灵犀(深圳)数字科技有限公司
      fullName = `${brandName}（${shortCity}）${industry}${suffix}`;
      structureDesc = `字号 + (区划) + 行业 + 组织形式`;
      break;
    case 4:
      // Provincial Leader: 广东省深思灵犀信息科技有限公司
      fullName = `${division.province}${brandName}${industry}${suffix}`;
      structureDesc = `行政区划(省级) + 字号 + 行业 + 组织形式`;
      break;
    case 5:
    default:
      // High-Tech Development Zone / Comprehensive Industry
      const isPilot = getRandomInt(1, 3) === 1;
      if (isPilot) {
        const pilot = getRandomItem(SPECIAL_ZONE_PREFIXES);
        fullName = `${pilot}${brandName}${industry}${suffix}`;
        structureDesc = `国家级新区/自贸区 + 字号 + 行业 + 组织形式`;
      } else {
        fullName = `${division.city}${brandName}${industry}${suffix}`;
        structureDesc = `行政区划(市级) + 字号 + 行业 + 组织形式`;
      }
      break;
  }

  return {
    fullName,
    brandName,
    division,
    industry,
    suffix,
    structure: structureDesc,
    scope
  };
}

/**
 * Quick helper returning only a single high-entropy enterprise name
 */
export function generateEnterpriseNameOnly(style: EnterpriseNamingStyle = "all"): string {
  return generateEnterpriseName(style).fullName;
}

// -------------------------------------------------------------
// 7. COMPLIANT RESIDENT ID CARD, USCC & PHONE GENERATORS
// -------------------------------------------------------------

/**
 * Generate a compliant Mainland China 11-digit mobile phone number
 */
export function generatePhoneNumber(): string {
  const prefixes = [
    "130", "131", "132", "133", "134", "135", "136", "137", "138", "139",
    "150", "151", "152", "153", "155", "156", "157", "158", "159",
    "170", "173", "175", "176", "177", "178",
    "180", "181", "182", "183", "184", "185", "186", "187", "188", "189",
    "198", "199"
  ];
  const prefix = getRandomItem(prefixes);
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += getRandomInt(0, 9);
  }
  return prefix + suffix;
}

/**
 * Generate a compliant Chinese Mainland Resident ID Card Number (18 digits, GB 11643-1999)
 */
export function generateCitizenIdNumber(gender?: "M" | "F", birthDateStr?: string, customRegionCode?: string): string {
  // 1. Administrative Code (6 digits)
  const regionCode = customRegionCode || getRandomItem(MAINLAND_CITIES).code;

  // 2. Birthday Code (8 digits)
  let birthStr = "";
  if (birthDateStr && /^\d{8}$/.test(birthDateStr)) {
    birthStr = birthDateStr;
  } else {
    const year = getRandomInt(1968, 2004);
    const month = getRandomInt(1, 12);
    const day = getRandomInt(1, 28);
    birthStr = `${year}${padZero(month)}${padZero(day)}`;
  }

  // 3. Sequence Code (3 digits)
  let seq = getRandomInt(10, 99);
  let lastDigitOfSeq = getRandomInt(0, 9);
  if (gender === "M") {
    if (lastDigitOfSeq % 2 === 0) lastDigitOfSeq = (lastDigitOfSeq + 1) % 10;
  } else if (gender === "F") {
    if (lastDigitOfSeq % 2 !== 0) lastDigitOfSeq = (lastDigitOfSeq + 1) % 10;
  }
  const sequenceCode = `${seq}${lastDigitOfSeq}`;

  const partialCode = regionCode + birthStr + sequenceCode;

  // 4. Mod-11 Check Digit
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(partialCode[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkDigits = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
  const checkDigit = checkDigits[remainder];

  return partialCode + checkDigit;
}

/**
 * Validate a Chinese Resident ID Card Number
 */
export function validateCitizenIdNumber(id: string): boolean {
  if (!id || id.length !== 18) return false;
  if (!/^\d{17}[\dXx]$/.test(id)) return false;

  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkDigits = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
  const calculatedCheckDigit = checkDigits[remainder];

  return id[17].toUpperCase() === calculatedCheckDigit;
}

/**
 * Generate a compliant Chinese Mainland Uniform Social Credit Code (18 digits, GB 32100-2015, Mod 31)
 */
export function generateSocialCreditCode(targetRegionCode?: string): string {
  // Authority: 9 (Market Regulation Administration)
  const authority = "9";
  // Entity type: 1 (Enterprise/Company) or 2 (Non-corporate)
  const entityType = getRandomItem(["1", "2"]);
  // Region Code (6 digits)
  const regionCode = targetRegionCode || getRandomItem(MAINLAND_CITIES).code;

  // Org Code (9 characters)
  const alphabet = "0123456789ABCDEFGHJKLMNPQRTUWXY"; // excludes I, O, S, V, Z

  let body = authority + entityType + regionCode;
  for (let i = 0; i < 9; i++) {
    body += getRandomItem(alphabet.split(""));
  }

  // Calculate check digit (Mod 31)
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = body[i];
    const val = alphabet.indexOf(char);
    sum += val * weights[i];
  }

  const remainder = sum % 31;
  const checkIndex = (31 - remainder) % 31;
  const checkDigit = alphabet[checkIndex];

  return body + checkDigit;
}

/**
 * Validate a Uniform Social Credit Code
 */
export function validateSocialCreditCode(code: string): boolean {
  if (!code || code.length !== 18) return false;
  const alphabet = "0123456789ABCDEFGHJKLMNPQRTUWXY";
  if (!/^[0-9A-HJ-NP-RTUW-Y]{18}$/.test(code)) return false;

  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const val = alphabet.indexOf(code[i]);
    if (val === -1) return false;
    sum += val * weights[i];
  }

  const remainder = sum % 31;
  const checkIndex = (31 - remainder) % 31;
  const calculatedCheckDigit = alphabet[checkIndex];

  return code[17] === calculatedCheckDigit;
}

// -------------------------------------------------------------
// 8. HONG KONG SPECIFIC GENERATORS & CONSTANTS
// -------------------------------------------------------------

export const HK_ENGLISH_SURNAMES = ["CHAN", "WONG", "LI", "CHEUNG", "LEE", "LAU", "CHENG", "NG", "LAM", "YU"];
export const HK_ENGLISH_MALE_NAMES = ["DAVID", "ALEX", "JOHN", "DANIEL", "PETER", "MICHAEL", "RAYMOND", "ALAN", "JACKY", "ANDY"];
export const HK_ENGLISH_FEMALE_NAMES = ["MARY", "CHERRY", "GRACE", "AMY", "WENDY", "SARAH", "HELEN", "FIONA", "KELLY", "IVY"];
export const HK_CHINESE_NAMES = ["陈大文", "黄志强", "李嘉欣", "张学友", "刘德华", "林国雄", "郑秀文", "吴志明", "余诗曼", "梁朝伟"];

export const HK_COMPANY_PREFIX = ["EASTERN", "GOLDEN", "VIBRANT", "HARBOUR", "PACIFIC", "GLOBAL", "APEX", "DRAGON", "SINO", "METRO"];
export const HK_COMPANY_MID = ["TRADING", "TECHNOLOGY", "INVESTMENT", "LOGISTICS", "ENTERPRISE", "INDUSTRIES", "HOLDINGS", "DEVELOPMENT"];
export const HK_CHINESE_COMPANY_PREFIX = ["东方", "金河", "万隆", "维港", "太平洋", "环球", "恒峰", "龙腾", "华夏", "大都会"];
export const HK_CHINESE_COMPANY_MID = ["贸易", "科技", "投资", "物流", "企业", "实业", "集团", "发展"];

export const HK_STREETS = [
  "ROOM 701 UNIT 108B 7/F TOWER B\nNEW MANDARIN PLAZA 14 SCIENCE\nMUSEUM ROAD TSIM SHA TSUI\nKL",
  "FLAT A, 15/F, GOLDEN PLAZA\n745-747 NATHAN ROAD\nMONG KOK, KOWLOON\nHONG KONG",
  "8 CONNAUGHT ROAD CENTRAL\nCENTRAL, HONG KONG\nHONG KONG",
  "UNIT 1205, 12/F, APEX TOWER\n61-65 CONNAUGHT ROAD WEST\nSHEUNG WAN, HONG KONG\nHONG KONG",
  "SHOP 3B, G/F, HIGH STREET TOWER\n12-14 HIGH STREET, SAI YING PUN\nHONG KONG",
  "BLOCK B, 9/F, VIBRANT INDUSTRIAL BUILDING\n24 YIP FAT STREET\nWONG CHUK HANG, HONG KONG"
];

export function generateHKBRNumber(commencementMonth = "11", commencementYear = "25"): string {
  let brBody = "";
  for (let i = 0; i < 8; i++) {
    brBody += getRandomInt(0, 9);
  }
  const branch = "000";
  const checkDigit = getRandomInt(1, 9);
  return `${brBody}-${branch}-${commencementMonth}-${commencementYear}-${checkDigit}`;
}

export function generateHKCRNumber(): string {
  let cr = "";
  for (let i = 0; i < 7; i++) {
    cr += getRandomInt(0, 9);
  }
  return cr;
}

export function generateHKIDCardNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numLetters = getRandomItem([1, 2]);
  let hkidLetters = "";
  for (let i = 0; i < numLetters; i++) {
    hkidLetters += getRandomItem(letters.split(""));
  }

  let numbers = "";
  for (let i = 0; i < 6; i++) {
    numbers += getRandomInt(0, 9);
  }

  const checkDigit = getRandomItem(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A"]);
  return `${hkidLetters}${numbers}(${checkDigit})`;
}

export function generateHomeReturnPermitNumber(origin: "H" | "M" = "H"): string {
  const letter = origin;
  let numbers = "";
  for (let i = 0; i < 8; i++) {
    numbers += getRandomInt(0, 9);
  }
  const renewal = padZero(getRandomInt(1, 3));
  return letter + numbers + renewal;
}

export function generateBankCardNumber(): string {
  const bins = ["622202", "622848", "621700", "622700", "621483", "621226", "621661"];
  const bin = getRandomItem(bins);
  let body = bin;
  
  const targetLength = getRandomItem([16, 19]);
  const fillLength = targetLength - bin.length - 1;
  
  for (let i = 0; i < fillLength; i++) {
    body += getRandomInt(0, 9);
  }

  let sum = 0;
  let shouldDouble = true;
  
  for (let i = body.length - 1; i >= 0; i--) {
    let digit = parseInt(body[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return body + checkDigit;
}

// -------------------------------------------------------------
// 9. COMPLETE BUSINESS LICENSE & ID CARD SUITE BUILDERS
// -------------------------------------------------------------

export interface BusinessLicenseFields {
  uscc: string;
  name: string;
  type: string;
  legalRep: string;
  registeredCapital: string;
  establishmentDate: string;
  businessTerm: string;
  address: string;
  businessScope: string;
  registrationAuthority: string;
  issueDate: string;
  // Extra metadata for debugging & anti-collision metrics
  _meta?: {
    brandName: string;
    division: MainlandCity;
    industry: string;
    structure: string;
  };
}

/**
 * Generate a complete, coherent Mainland Business License with ultra-high entropy enterprise name
 */
export function generateMockBusinessLicense(
  style: EnterpriseNamingStyle = "all",
  preferredDivision?: MainlandCity,
  fixedLegalRep?: string
): BusinessLicenseFields {
  // 1. Generate guaranteed unique enterprise name & associated location
  const ent = generateEnterpriseName(style, preferredDivision);
  const division = ent.division;

  // 2. Legal Representative
  let legalRep = fixedLegalRep;
  if (!legalRep) {
    const surname = getRandomItem(CHINESE_SURNAMES);
    const givenPool = getRandomItem([CHINESE_MALE_NAMES, CHINESE_FEMALE_NAMES]);
    const isSingleCharName = getRandomInt(1, 3) === 1;
    const givenName = isSingleCharName
      ? getRandomItem(givenPool)
      : getRandomItem(givenPool) + getRandomItem(givenPool);
    legalRep = surname + givenName;
  }

  // 3. Dates & Registered Capital
  const estYear = getRandomInt(2014, 2025);
  const estMonth = getRandomInt(1, 12);
  const estDay = getRandomInt(1, 28);
  const estDateStr = `${estYear}年${padZero(estMonth)}月${padZero(estDay)}日`;
  
  const cap = getRandomItem(REGISTERED_CAPITALS);
  const isPerpetual = getRandomInt(1, 3) !== 1;
  const duration = isPerpetual ? "长期" : `${estYear + getRandomInt(10, 30)}年${padZero(estMonth)}月${padZero(estDay)}日`;

  // 4. Registration Authority
  // In China: e.g. "深圳市市场监督管理局", "广州市天河区市场监督管理局", "北京市海淀区市场监督管理局"
  const registrationAuthority = `${division.city}${division.district}市场监督管理局`;

  // 5. Registration Address
  const roomNumber = `${getRandomInt(1, 4)}栋${getRandomInt(101, 2808)}室`;
  const address = `${division.addressPrefix}${getRandomInt(1, 999)}号${roomNumber}`;

  return {
    uscc: generateSocialCreditCode(division.code),
    name: ent.fullName,
    type: getRandomItem([
      "有限责任公司（自然人独资）",
      "有限责任公司（自然人投资或控股）",
      "有限责任公司（法人独资）",
      "其他有限责任公司"
    ]),
    legalRep,
    registeredCapital: `人民币 ${cap} 万元整`,
    establishmentDate: estDateStr,
    businessTerm: `${estDateStr} 至 ${duration}`,
    address,
    businessScope: ent.scope,
    registrationAuthority,
    issueDate: `2026年${padZero(getRandomInt(1, 10))}月${padZero(getRandomInt(1, 28))}日`,
    _meta: {
      brandName: ent.brandName,
      division: ent.division,
      industry: ent.industry,
      structure: ent.structure
    }
  };
}

export interface ResidentIdCardFields {
  name: string;
  gender: "男" | "女";
  ethnicity: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  address: string;
  idNumber: string;
  authority: string;
  validityStart: string;
  validityEnd: string;
}

export function generateMockResidentIdCard(
  fixedGender?: "M" | "F",
  preferredDivision?: MainlandCity,
  fixedName?: string
): ResidentIdCardFields {
  const genderChar = fixedGender || getRandomItem(["M", "F"]);
  const genderText = genderChar === "M" ? "男" : "女";
  const namePool = genderChar === "M" ? CHINESE_MALE_NAMES : CHINESE_FEMALE_NAMES;
  
  let name = fixedName;
  if (!name) {
    const isSingleChar = getRandomInt(1, 3) === 1;
    name = getRandomItem(CHINESE_SURNAMES) + (isSingleChar ? getRandomItem(namePool) : getRandomItem(namePool) + getRandomItem(namePool));
  }

  const ethnicity = getRandomItem(ETHNICITIES);
  
  const birthYear = String(getRandomInt(1972, 2003));
  const birthMonth = padZero(getRandomInt(1, 12));
  const birthDay = padZero(getRandomInt(1, 28));
  
  const division = preferredDivision || getRandomItem(MAINLAND_CITIES);
  const address = `${division.addressPrefix}${getRandomInt(1, 888)}号${getRandomInt(1, 6)}单元${getRandomInt(101, 1802)}室`;
  
  const idNumber = generateCitizenIdNumber(genderChar as "M" | "F", `${birthYear}${birthMonth}${birthDay}`, division.code);

  const startYear = getRandomInt(2016, 2024);
  const startMonth = padZero(getRandomInt(1, 12));
  const startDay = padZero(getRandomInt(1, 28));
  const age = 2026 - parseInt(birthYear, 10);
  
  let validityEnd = "长期";
  if (age < 26) {
    validityEnd = `${startYear + 10}.${startMonth}.${startDay}`;
  } else if (age < 46) {
    validityEnd = `${startYear + 20}.${startMonth}.${startDay}`;
  }

  return {
    name,
    gender: genderText,
    ethnicity,
    birthYear,
    birthMonth,
    birthDay,
    address,
    idNumber,
    authority: `${division.city}公安局${division.district}分局`,
    validityStart: `${startYear}.${startMonth}.${startDay}`,
    validityEnd
  };
}

// -------------------------------------------------------------
// 10. HONG KONG BR & HOME RETURN PERMITS
// -------------------------------------------------------------

export interface HKBusinessRegistrationFields {
  brNumber: string;
  nameEnglish: string;
  nameChinese: string;
  address: string;
  natureEnglish: string;
  natureChinese: string;
  statusEnglish: string;
  statusChinese: string;
  commencementDate: string;
  expiryDate: string;
  fee: string;
  levy: string;
  total: string;
}

export function generateMockHKBR(): HKBusinessRegistrationFields {
  const prefixEng = getRandomItem(HK_COMPANY_PREFIX);
  const midEng = getRandomItem(HK_COMPANY_MID);
  const prefixChi = getRandomItem(HK_CHINESE_COMPANY_PREFIX);
  const midChi = getRandomItem(HK_CHINESE_COMPANY_MID);

  const nameEnglish = `${prefixEng} ${midEng} LIMITED`;
  const nameChinese = `${prefixChi}${midChi}有限公司`;

  const nature = getRandomItem([
    { eng: "E-COMMERCE, TRADING, WHOLESALE & RETAIL", chi: "經營電子商務，國際貿易，商品批發，零售，貨物及技術進出口" },
    { eng: "SOFTWARE DEVELOPMENT, IT CONSULTING & SERVICES", chi: "計算機軟硬件研發、技術諮詢、技術服務" },
    { eng: "INVESTMENT HOLDINGS & BUSINESS MANAGEMENT SERVICES", chi: "投資控股及企業管理服務" },
    { eng: "IMPORT & EXPORT, SUPPLY CHAIN SOLUTIONS", chi: "進出口貿易、物流行業及供應鏈解決方案" },
    { eng: "CATERING & RESTAURANT OPERATIONS", chi: "餐飲服務、餐館經營及食品批發零售" }
  ]);

  const year = getRandomInt(2023, 2025);
  const month = getRandomInt(1, 12);
  const day = getRandomInt(1, 28);

  const commencementDate = `${padZero(day)}/${padZero(month)}/${year}`;
  const expiryDate = `${padZero(day)}/${padZero(month)}/${year + 1}`;

  const fee = getRandomItem(["2,000.00", "150.00", "0.00"]);
  const levy = "150.00";
  const total = String((parseFloat(fee.replace(",", "")) + parseFloat(levy)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return {
    brNumber: generateHKBRNumber(padZero(month), String(year).substring(2)),
    nameEnglish,
    nameChinese,
    address: getRandomItem(HK_STREETS),
    natureEnglish: nature.eng,
    natureChinese: nature.chi,
    statusEnglish: "BODY CORPORATE",
    statusChinese: "法人团体",
    commencementDate,
    expiryDate,
    fee: `HKD ${fee}`,
    levy: `HKD ${levy}`,
    total: `HKD ${total}`
  };
}

export interface HomeReturnPermitFields {
  nameChinese: string;
  nameEnglish: string;
  gender: "男" | "女";
  birthDate: string;
  idNumber: string;
  validityPeriod: string;
  authority: string;
  placeOfIssue: string;
  renewalCount: string;
  hkidNumber: string;
  hkNameTraditional: string;
}

interface HKPerson {
  simplified: string;
  traditional: string;
  english: string;
  gender: "男" | "女";
}

const HK_PEOPLE_POOL: HKPerson[] = [
  { simplified: "刘芷兰", traditional: "劉芷蘭", english: "LAU, TSZ LAN", gender: "女" },
  { simplified: "陈大文", traditional: "陳大文", english: "CHAN, TAI MAN", gender: "男" },
  { simplified: "黄志强", traditional: "黃志強", english: "WONG, CHI KEUNG", gender: "男" },
  { simplified: "李嘉欣", traditional: "李嘉欣", english: "LI, KA YAN", gender: "女" },
  { simplified: "张学友", traditional: "張學友", english: "CHEUNG, HOK YAU", gender: "男" },
  { simplified: "刘德华", traditional: "劉德華", english: "LAU, TAK WAH", gender: "男" },
  { simplified: "林国雄", traditional: "林國雄", english: "LAM, KOK HUNG", gender: "男" },
  { simplified: "郑秀文", traditional: "鄭秀文", english: "CHENG, SAU MAN", gender: "女" },
  { simplified: "吴志明", traditional: "吳志明", english: "NG, CHI MING", gender: "男" },
  { simplified: "余诗曼", traditional: "佘詩曼", english: "SHE, SZE MAN", gender: "女" },
  { simplified: "梁朝伟", traditional: "梁朝偉", english: "LEUNG, CHIU WAI", gender: "男" }
];

export function generateMockHomeReturnPermit(): HomeReturnPermitFields {
  const person = getRandomItem(HK_PEOPLE_POOL);
  const origin = getRandomItem(["H", "M"]) as "H" | "M";

  const birthYear = getRandomInt(1970, 2005);
  const birthMonth = padZero(getRandomInt(1, 12));
  const birthDay = padZero(getRandomInt(1, 28));
  const birthDate = `${birthYear}.${birthMonth}.${birthDay}`;

  const issueYear = getRandomInt(2015, 2025);
  const issueMonth = padZero(getRandomInt(1, 12));
  const issueDay = padZero(getRandomInt(1, 28));

  const validStart = `${issueYear}.${issueMonth}.${issueDay}`;
  const age = 2026 - birthYear;
  const validityYears = age >= 18 ? 10 : 5;
  
  let endYear = issueYear + validityYears;
  let endMonth = parseInt(issueMonth, 10);
  let endDay = parseInt(issueDay, 10) - 1;
  if (endDay === 0) {
    endMonth -= 1;
    if (endMonth === 0) {
      endMonth = 12;
      endYear -= 1;
    }
    endDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][endMonth - 1];
  }
  const validEnd = `${endYear}.${padZero(endMonth)}.${padZero(endDay)}`;
  const validityPeriod = `${validStart}-${validEnd}`;

  let baseNumbers = "";
  for (let i = 0; i < 8; i++) {
    baseNumbers += getRandomInt(0, 9);
  }
  const idNumber = origin + baseNumbers;
  const renewalCount = padZero(getRandomInt(1, 15));

  const letter = getRandomItem(["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "P", "R", "S", "T", "V", "W", "Y", "Z"]);
  let hkidNumbers = "";
  for (let i = 0; i < 6; i++) {
    hkidNumbers += getRandomInt(0, 9);
  }
  const hkidCheck = getRandomInt(0, 9);
  const hkidNumber = `${letter}${hkidNumbers}(${hkidCheck})`;

  return {
    nameChinese: person.simplified,
    nameEnglish: person.english,
    gender: person.gender,
    birthDate,
    idNumber,
    validityPeriod,
    authority: "公安部出入境管理局",
    placeOfIssue: origin === "H" ? "香港" : "澳门",
    renewalCount,
    hkidNumber,
    hkNameTraditional: person.traditional
  };
}
