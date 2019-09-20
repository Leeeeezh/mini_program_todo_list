// pages/home/home.js
let todos = []
let trash = {}
let result = []
let filter = 'none'
let scrollTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clear: '',
    indicatorColor: 'none',
    order: 'asc', //'asc'/'desc'
    isSearchBarShow: true,
    isFilterShow: false,
    isSearching: false,
    todos: [],
    isHeartBeat: false
  },
  filtLabel(evt) {
    const label = evt.detail.color
    filter = label
    this.setData({
      indicatorColor: label,
      isFilterShow: false,
    })
    if (label == 'none') {
      this._toast('取消标签过滤')
    }
    this._render()
  },
  toggleFilter() {
    this.setData({
      isFilterShow: !this.data.isFilterShow
    })
  },
  changeOrder() {
    let order = this.data.order
    if (order === 'asc') {
      this.setData({
        order: 'desc'
      })
    } else {
      this.setData({
        order: 'asc'
      })
    }
    wx.setStorageSync('order', this.data.order)
    this._render()
  },
  addTodo() {
    this.setData({
      isHeartBeat: true
    })
    setTimeout(() => {
      this._navToEditPage()
      this.setData({
        isHeartBeat: false
      })
    }, 500)
  },
  _navToEditPage() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },
  _render() {
    if (!todos) {
      return
    }
    let computed = []
    if (this.data.isSearching) {
      if (filter != 'none') {
        computed = result.filter(todo => todo.label == filter)
      } else {
        computed = result
      }
      if (this.data.order == 'asc') {
        computed = computed.sort((a, b) => b.timeStamp - a.timeStamp)
      } else {
        computed = computed.sort((a, b) => a.timeStamp - b.timeStamp)
      }
    } else {
      if (filter != 'none') {
        computed = todos.filter(todo => todo.label == filter)
      } else {
        computed = todos
      }
      if (this.data.order == 'asc') {
        computed = computed.sort((a, b) => b.timeStamp - a.timeStamp)
      } else {
        computed = computed.sort((a, b) => a.timeStamp - b.timeStamp)
      }
    }
    this.setData({
      todos: computed
    })
  },
  onSearch(event) {
    const keyword = event.detail.keyword.trim()
    if (!keyword) {
      this.setData({
        todos
      })
      return
    }
    filter = 'none'
    this.setData({
      isSearching: true,
      indicatorColor: 'none'
    })
    result = todos.filter(item => {
      return item.title.includes(keyword) || item.content.includes(keyword)
    })
    this._render()
    // this.setData({
    //   todos: result
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadSettings()
    this._loadTodos()
  },
  enTag(evt) {
    let color = evt.detail.color
    let timeStamp = evt.detail.timeStamp
    for (let i in todos) {
      if (todos[i].timeStamp == timeStamp) {
        todos[i].label = color
        break
      }
    }
    this._saveTodos()
  },

  onRemove(event) {
    const timeStamp = event.detail.timeStamp
    for (let index in todos) {
      if (todos[index].timeStamp == timeStamp) {
        trash = todos[index]
        todos.splice(index, 1)
        break
      }
    }
    if (this.data.isSearching) {
      for (let index in result) {
        if (result[index].timeStamp == timeStamp) {
          result.splice(index, 1)
          console.log('result updated')
        }
      }
    }
    console.log(result)
    this._updateTrashesInStorage()
    this._render()
    this._saveTodos()

    setTimeout(() => {
      this._toast('已丢到垃圾桶💥')
    }, 400)
  },
  _updateTrashesInStorage() {
    let trashes = wx.getStorageSync('trashes')
    if (!trashes) {
      trashes = []
    }
    trashes.unshift(trash)
    wx.setStorageSync('trashes', trashes)
  },
  _saveTodos() {
    wx.setStorageSync('todos', todos)
  },
  _loadTodos() {
    todos = wx.getStorageSync('todos')
    if (!todos) {
      wx.setStorageSync('todos', [{
        "title": "聊斋志异·聂小倩",
        "content": "      宁采臣，浙人，性慷爽，廉隅自重。每对人言：“生平无二色。”适赴金华，至北郭，解装兰若。寺中殿塔壮丽，然蓬蒿没人，似绝行踪。东西僧舍，双扉虚掩，惟南一小舍，扃键如新。又顾殿东隅，修竹拱把，阶下有巨池，野藕已花。意甚乐其幽杳。会学使案临，城舍价昂，思便留止，遂散步以待僧归。日暮有士人来启南扉，宁趋为礼，且告以意。士人曰：“此间无房主，仆亦侨居。能甘荒落，旦暮惠教，幸甚！”宁喜，藉藁代床，支板作几，为久客计。是夜月明高洁，清光似水，二人促膝殿廊，各展姓字。士人自言燕姓，字赤霞。宁疑为赴试者，而听其音声，殊不类浙。诘之，自言秦人，语甚朴诚。既而相对词竭，遂拱别归寝。\n\n　　宁以新居，久不成寐。闻舍北喁喁，如有家口。起，伏北壁石窗下微窥之，见短墙外一小院落，有妇可四十余；又一媪衣绯，插蓬沓，鲐背龙钟，偶语月下。妇曰：“小倩何久不来？”媪曰：“殆好至矣。”妇曰：“将无向姥姥有怨言否？”曰：“不闻；但意似蹙蹙。”妇曰：“婢子不宜好相识。”言未已，有十七八女子来，仿佛艳绝。媪笑曰：“背地不言人，我两个正谈道，小妖婢悄来无迹响，幸不訾着短处。”又曰：“小娘子端好是画中人，遮莫老身是男子，也被摄去。”女曰：“姥姥不相誉，更阿谁道好？”妇人女子又不知何言。宁意其邻人眷口，寝不复听；又许时始寂无声。\n\n　　方将睡去，觉有人至寝所，急起审顾，则北院女子也。惊问之，女笑曰：“月夜不寐，愿修燕好。”宁正容曰：“卿防物议，我畏人言。略一失足，廉耻道丧。”女云：“夜无知者。”宁又咄之。女逡巡若复有词。宁叱：“速去！不然，当呼南舍生知。”女惧，乃退。至户外忽返，以黄金一锭置褥上。宁掇掷庭墀，曰：“非义之物，污我囊囊！”女惭出，拾金自言曰：“此汉当是铁石。”\n\n　　诘旦有兰溪生携一仆来候试，寓于东厢，至夜暴亡。足心有小孔，如锥刺者，细细有血出，俱莫知故。经宿一仆死，症亦如之。向晚燕生归，宁质之，燕以为魅。宁素抗直，颇不在意。宵分女子复至，谓宁曰：“妾阅人多矣，未有刚肠如君者。君诚圣贤，妾不敢欺。小倩，姓聂氏，十八夭殂，葬于寺侧，被妖物威胁，历役贱务，腆颜向人，实非所乐。今寺中无可杀者，恐当以夜叉来。”宁骇求计。女曰：“与燕生同室可免。”问：“何不惑燕生？”曰：“彼奇人也，固不敢近。”又问：“迷人若何？”曰：“狎昵我者，隐以锥刺其足，彼即茫若迷，因摄血以供妖饮。又惑以金，非金也，乃罗刹鬼骨，留之能截取人心肝。二者，凡以投时好耳。”宁感谢，问戒备之期，答以明宵。临别泣曰：“妾堕玄海，求岸不得。郎君义气干云，必能拔生救苦。倘肯囊妾朽骨，归葬安宅，不啻再造。”宁毅然诺之。因问葬处，曰：“但记白杨之上，有乌巢者是也。”言已出门，纷然而灭。\n\n　　明日恐燕他出，早诣邀致。辰后具酒馔，留意察燕。既约同宿，辞以性癖耽寂。宁不听，强携卧具来，燕不得已，移榻从之，嘱曰：“仆知足下丈夫，倾风良切。要有微衷，难以遽白。幸勿翻窥箧襆，违之两俱不利。”宁谨受教。既各寝，燕以箱箧置窗上，就枕移时，齁如雷吼。宁不能寐。近一更许，窗外隐隐有人影。俄而近窗来窥，目光睒闪。宁惧，方欲呼燕，忽有物裂箧而出，耀若匹练，触折窗上石棂，飙然一射，即遽敛入，宛如电灭。燕觉而起，宁伪睡以觇之。燕捧箧检征，取一物，对月嗅视，白光晶莹，长可二寸，径韭叶许。已而数重包固，仍置破箧中。自语曰：“何物老魅，直尔大胆，致坏箧子。”遂复卧。宁大奇之，因起问之，且告以所见。燕曰：“既相知爱，何敢深隐。我剑客也。若非石棂，妖当立毙；虽然，亦伤。”问：“所缄何物？”曰：“剑也。适嗅之有妖气。”宁欲观之。慨出相示，荧荧然一小剑也。于是益厚重燕。\n\n　　明日，视窗外有血迹。遂出寺北，见荒坟累累，果有白杨，乌巢其颠。迨营谋既就，趣装欲归。燕生设祖帐，情义殷渥，以破革囊赠宁，曰：“此剑袋也。宝藏可远魑魅。”宁欲从受其术。曰：“如君信义刚直，可以为此，然君犹富贵中人，非此道中人也。”宁托有妹葬此，发掘女骨，敛以衣衾，赁舟而归。宁斋临野，因营坟葬诸斋外，祭而祝曰：“怜卿孤魂，葬近蜗居，歌哭相闻，庶不见凌于雄鬼。一瓯浆水饮，殊不清旨，幸不为嫌！”祝毕而返，后有人呼曰：“缓待同行！”回顾，则小倩也。欢喜谢曰：“君信义，十死不足以报。请从归，拜识姑嫜，媵御无悔。”审谛之，肌映流霞，足翘细笋，白昼端相，娇丽尤绝。遂与俱至斋中。嘱坐少待，先入白母。母愕然。时宁妻久病，母戒勿言，恐所骇惊。言次，女已翩然入，拜伏地下。宁曰：“此小倩也。”母惊顾不遑。女谓母曰：“儿飘然一身，远父母兄弟。蒙公子露覆，泽被发肤，愿执箕帚，以报高义。”母见其绰约可爱，始敢与言，曰：“小娘子惠顾吾儿，老身喜不可已。但生平止此儿，用承祧绪，不敢令有鬼偶。”女曰：“儿实无二心。泉下人既不见信于老母，请以兄事，依高堂，奉晨昏，如何？”母怜其诚，允之。即欲拜嫂，母辞以疾，乃止。女即入厨下，代母尸饔。入房穿榻，似熟居者。\n\n　　日暮母畏惧之，辞使归寝，不为设床褥。女窥知母意，即竟去。过斋欲入，却退，徘徊户外，似有所惧。生呼之。女曰：“室有剑气畏人。向道途中不奉见者，良以此故。”宁悟为革囊，取悬他室。女乃入，就烛下坐；移时，殊不一语。久之，问：“夜读否？妾少诵《楞严经》，今强半遗忘。浼求一卷，夜暇就兄正之。”宁诺。又坐，默然，二更向尽，不言去。宁促之。愀然曰：“异域孤魂，殊怯荒墓。”宁曰：“斋中别无床寝，且兄妹亦宜远嫌。”女起，颦蹙欲啼，足儴而懒步，从容出门，涉阶而没。宁窃怜之，欲留宿别榻，又惧母嗔。女朝旦朝母，捧匜沃盥，下堂操作，无不曲承母志。黄昏告退，辄过斋头，就烛诵经。觉宁将寝，始惨然出。\n\n　　先是，宁妻病废，母劬不堪；自得女，逸甚，心德之。日渐稔，亲爱如己出，竟忘其为鬼，不忍晚令去，留与同卧起。女初来未尝饮食，半年渐啜稀酡。母子皆溺爱之，讳言其鬼，人亦不知辨也。无何，宁妻亡，母隐有纳女意，然恐于子不利。女微知之，乘间告曰：“居年余，当知肝膈。为不欲祸行人，故从郎君来。区区无他意，止以公子光明磊落，为天人所钦瞩，实欲依赞三数年，借博封诰，以光泉壤。”母亦知无恶意，但惧不能延宗嗣。女曰：“子女惟天所授。郎君注福籍，有亢宗子三，不以鬼妻而遂夺也。”母信之，与子议。宁喜，因列筵告戚党。或请觌新妇，女慨然华妆出，一堂尽眙，反不疑其鬼，疑为仙。由是五党诸内眷，咸执贽以贺，争拜识之。女善画兰、梅，辄以尺幅酬答，得者藏之什袭以为荣。一日俯颈窗前，怊怅若失。忽问：“革囊何在？”曰：“以卿畏之，故缄致他所。”曰：“妾受生气已久，当不复畏，宜取挂床头。”宁诘其意，曰：“三日来，心怔忡无停息，意金华妖物，恨妾远遁，恐旦晚寻及也。”宁果携革囊来。女反复审视，曰：“此剑仙将盛人头者也。敝败至此，不知杀人几何许！妾今日视之，肌犹粟栗。”乃悬之。次日又命移悬户上。夜对烛坐，欻有一物，如飞鸟至。女惊匿夹幕间。宁视之，物如夜叉状，电目血舌，睒闪攫拿而前，至门却步，逡巡久之，渐近革囊，以爪摘取，似将抓裂。囊忽格然一响，大可合篑，恍惚有鬼物突出半身，揪夜叉入，声遂寂然，囊亦顿索如故。宁骇诧，女亦出，大喜曰：“无恙矣！”共视囊中，清水数斗而已。\n\n　　后数年，宁果登进士。举一男。纳妾后，又各生一男，皆仕进有声。",
        "timeStamp": Date.now().toString(),
        label: 'white'
      }])
      todos = wx.getStorageSync('todos')
    }
    this._render()
    this.setData({
      isSearching: false
    })
  },
  _loadSettings() {
    let order = wx.getStorageSync('order')
    if (!order) {
      order = 'asc'
    }
    this.setData({
      order
    })
    wx.setStorageSync('order', order)
  },
  _toast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 1500
    })
  },
  cancelSearch() {
    this.setData({
      isSearching: false,
      clear: Date.now()
    })
    this._loadTodos()
  },

  onPageScroll(event) {
    if (event.scrollTop > scrollTop) {
      scrollTop = event.scrollTop
      if (this.data.isSearchBarShow) {
        this.setData({
          isSearchBarShow: false
        })
      }
    } else {
      scrollTop = event.scrollTop
      if (!this.data.isSearchBarShow) {
        this.setData({
          isSearchBarShow: true
        })
      }
    }
  },
  onShow() {
    this.setData({
      clear: Date.now().toString()
    })
    let isReloadRequired = wx.getStorageSync('isReloadRequired')
    if (isReloadRequired) {
      wx.setStorageSync('isReloadRequired', false)
      this.onLoad()
    }
  }
})