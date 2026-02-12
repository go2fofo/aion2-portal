---
# AION2 永恒之塔2 公共接口文档

## 1. 角色查询列表 (Search)

用于通过角色名模糊或精确匹配，获取角色的唯一标识符 `characterId`。

- **请求网址**: `https://tw.ncsoft.com/aion2/api/search/aion2tw/search/v2/character`
- **请求方法**: `GET`
- **请求参数**:
  - `keyword`: 角色名称 (例如: `fofoooooo`)
  - `serverId`: 服务器 ID (例如: `2015`)
  - `race`: 种族代码 (1: 天族, 2: 魔族)
  - `page`: 分页页码
  - `size`: 每页显示数量

### 返回数据示例

```
{
    "list": [
        {
            "characterId": "chQWw6n1ntmlSG4TAezufiyCeShvn5mCJa-IZ4GG7Hs%3D",
            "name": "fofoooooo",
            "race": 2,
            "level": 45,
            "serverId": 2015,
            "serverName": "簡卡卡",
            "profileImageUrl": "..."
        }
    ]
}
```
---
## 2. 查询角色基本信息 (Profile & Stats)

获取角色的职业、性别、详细属性值、各玩法排名以及称号数据。

- **请求网址**: `https://tw.ncsoft.com/aion2/api/character/info`
- **请求方法**: `GET`
- **请求参数**:
  - `characterId`: 角色加密 ID
  - `serverId`: 服务器 ID
  - `lang`: 语言 (例如: `zh`)

### 核心数据模块

1. **Profile**: 包含职业 (`className`)、等级、性别等基础信息。
2. **Stat**: 包含基础属性 (STR/DEX/INT/CON/AGI/WIS) 及十二主神加成的特殊属性。
3. **Ranking**: 包含深渊、恶梦、竞技场等内容的排名数据。
4. **Title**: 包含已获得和已装备的称号及其属性加成。

### 返回数据示例

```

{
    "skill": {
        "skillList": [
            {
                "id": 18010000,
                "name": "擊破碎",
                "needLevel": 1,
                "skillLevel": 15,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_001.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18040000,
                "name": "百裂擊",
                "needLevel": 1,
                "skillLevel": 10,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_004.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18090000,
                "name": "突進擊破",
                "needLevel": 1,
                "skillLevel": 15,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_009.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18060000,
                "name": "打擊碎",
                "needLevel": 3,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_006.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18100000,
                "name": "闇擊碎",
                "needLevel": 4,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_010.png",
                "category": "Active",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18300000,
                "name": "疾風亂舞",
                "needLevel": 5,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_030.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18150000,
                "name": "裂破擊",
                "needLevel": 7,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_015.png",
                "category": "Active",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18120000,
                "name": "痊癒咒語",
                "needLevel": 8,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_013.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18210000,
                "name": "震動碎",
                "needLevel": 10,
                "skillLevel": 6,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_021.png",
                "category": "Active",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18080000,
                "name": "波動擊",
                "needLevel": 12,
                "skillLevel": 9,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_008.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18290000,
                "name": "旋轉擊",
                "needLevel": 14,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_029.png",
                "category": "Active",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18200000,
                "name": "衝擊解除",
                "needLevel": 16,
                "skillLevel": 4,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_002.png",
                "category": "Active",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18710000,
                "name": "生命祝福",
                "needLevel": 1,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_012.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18720000,
                "name": "十字防禦",
                "needLevel": 6,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_002.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18730000,
                "name": "保護陣",
                "needLevel": 9,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_001.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18740000,
                "name": "鼓吹咒語",
                "needLevel": 11,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_011.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18750000,
                "name": "攻擊準備",
                "needLevel": 13,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_005.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18760000,
                "name": "衝擊擊中",
                "needLevel": 15,
                "skillLevel": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_006.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18770000,
                "name": "激怒咒語",
                "needLevel": 17,
                "skillLevel": 6,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_007.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18780000,
                "name": "大地約定",
                "needLevel": 21,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_010.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18790000,
                "name": "生存意志",
                "needLevel": 23,
                "skillLevel": 9,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_009.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18800000,
                "name": "風之約定",
                "needLevel": 25,
                "skillLevel": 16,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_008.png",
                "category": "Passive",
                "acquired": 1,
                "equip": 0
            },
            {
                "id": 18220000,
                "name": "滅禍",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_022.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18190000,
                "name": "不敗真言",
                "needLevel": 22,
                "skillLevel": 15,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_019.png",
                "category": "Dp",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18140000,
                "name": "集中防禦",
                "needLevel": 22,
                "skillLevel": 1,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_014.png",
                "category": "Dp",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18160000,
                "name": "疾走真言",
                "needLevel": 22,
                "skillLevel": 5,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_016.png",
                "category": "Dp",
                "acquired": 1,
                "equip": 1
            },
            {
                "id": 18130000,
                "name": "粉碎擊",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_043.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18330000,
                "name": "瑪爾庫坦憤怒",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_033.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18240000,
                "name": "阻斷權能",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_024.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18230000,
                "name": "結縛之印",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_023.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18170000,
                "name": "痊癒之手",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_017.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18250000,
                "name": "疾風權能",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_025.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18420000,
                "name": "守護祝福",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_042.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            },
            {
                "id": 18700000,
                "name": "強襲衝擊",
                "needLevel": 22,
                "skillLevel": 0,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_003.png",
                "category": "Dp",
                "acquired": 0,
                "equip": 0
            }
        ]
    },
    "petwing": {
        "pet": {
            "id": 1136,
            "name": "拉普蕾西亞",
            "level": 4,
            "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Vehicle_Portrait_Rafflesia_01_CV01.png"
        },
        "wing": {
            "id": 40200100,
            "name": "守護者最上級翅膀",
            "enchantLevel": 0,
            "grade": "Unique",
            "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_WingB_001.png"
        },
        "wingSkin": {
            "id": 40200400,
            "name": "阿爾拉烏翅膀",
            "enchantLevel": 0,
            "grade": "Rare",
            "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_WingB_004.png"
        }
    },
    "equipment": {
        "equipmentList": [
            {
                "id": 110830048,
                "name": "魂魄法杖",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 1,
                "slotPosName": "MainHand",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_WP_ST_0078_T05.png"
            },
            {
                "id": 115040043,
                "name": "激盪臂甲",
                "enchantLevel": 5,
                "exceedLevel": 0,
                "grade": "Legend",
                "slotPos": 2,
                "slotPosName": "SubHand",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Weapon_Guarder_L_005.png"
            },
            {
                "id": 210130052,
                "name": "巴克隆胸甲",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 5,
                "slotPosName": "Torso",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Torso.png"
            },
            {
                "id": 210230052,
                "name": "巴克隆腿甲",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 6,
                "slotPosName": "Pants",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Pants.png"
            },
            {
                "id": 210320011,
                "name": "古代精靈頭盔",
                "enchantLevel": 11,
                "exceedLevel": 0,
                "grade": "Epic",
                "slotPos": 3,
                "slotPosName": "Helmet",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_GM_0050_T05_Helmet.png"
            },
            {
                "id": 210420011,
                "name": "古代精靈肩甲",
                "enchantLevel": 12,
                "exceedLevel": 0,
                "grade": "Epic",
                "slotPos": 4,
                "slotPosName": "Shoulder",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_GM_0050_T05_Shoulder.png"
            },
            {
                "id": 210530052,
                "name": "巴克隆手套",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 7,
                "slotPosName": "Gloves",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Gloves.png"
            },
            {
                "id": 210630052,
                "name": "巴克隆長靴",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 8,
                "slotPosName": "Boots",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Boots.png"
            },
            {
                "id": 210730052,
                "name": "巴克隆披風",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 19,
                "slotPosName": "Cape",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Cape.png"
            },
            {
                "id": 215240001,
                "name": "高潔腰帶",
                "enchantLevel": 5,
                "exceedLevel": 0,
                "grade": "Legend",
                "slotPos": 17,
                "slotPosName": "Belt",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Belt_C_021.png"
            },
            {
                "id": 310130050,
                "name": "奧拉姆斯項鍊",
                "enchantLevel": 10,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 10,
                "slotPosName": "Necklace",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_NL_0072.png"
            },
            {
                "id": 310230052,
                "name": "奧拉姆斯耳環",
                "enchantLevel": 3,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 12,
                "slotPosName": "Earring2",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_ER_0072.png"
            },
            {
                "id": 310230053,
                "name": "憤怒的克羅梅德耳環",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 11,
                "slotPosName": "Earring1",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_ER_0053.png"
            },
            {
                "id": 310330052,
                "name": "奧拉姆斯戒指",
                "enchantLevel": 6,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 14,
                "slotPosName": "Ring2",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Ring_0072.png"
            },
            {
                "id": 310330052,
                "name": "奧拉姆斯戒指",
                "enchantLevel": 6,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 13,
                "slotPosName": "Ring1",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Ring_0072.png"
            },
            {
                "id": 310430047,
                "name": "覺醒手鐲",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Unique",
                "slotPos": 15,
                "slotPosName": "Bracelet1",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Bracelet_R_027.png"
            },
            {
                "id": 310440018,
                "name": "解放者手鐲",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Legend",
                "slotPos": 16,
                "slotPosName": "Bracelet2",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Bracelet_0071.png"
            },
            {
                "id": 310900001,
                "name": "激戰古文石",
                "enchantLevel": 5,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 23,
                "slotPosName": "Rune1",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Rune_R_002.png"
            },
            {
                "id": 310900001,
                "name": "激戰古文石",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 24,
                "slotPosName": "Rune2",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Rune_R_002.png"
            },
            {
                "id": 311040001,
                "name": "啟示護身符",
                "enchantLevel": 5,
                "exceedLevel": 0,
                "grade": "Legend",
                "slotPos": 22,
                "slotPosName": "Amulet",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Item_Craft_Conversion_Crystal_L_lv4_01.png"
            },
            {
                "id": 810160001,
                "name": "活力聖杯",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Common",
                "slotPos": 41,
                "slotPosName": "Arcana1",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Arcana_Card_Grail_u_PveSet2.png"
            },
            {
                "id": 810360001,
                "name": "活力指南針",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Common",
                "slotPos": 43,
                "slotPosName": "Arcana3",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Arcana_Card_Compass_u_PveSet2.png"
            },
            {
                "id": 810450002,
                "name": "魔力鐘",
                "enchantLevel": 2,
                "exceedLevel": 0,
                "grade": "Rare",
                "slotPos": 44,
                "slotPosName": "Arcana4",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Arcana_Card_Bell_u_DefenceSet2.png"
            }
        ],
        "skinList": [
            {
                "id": 40048101,
                "name": "皮短版套裝(胸甲)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 3,
                "slotPosName": "Torso",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_GF_Idol_03_Torso.png"
            },
            {
                "id": 40029105,
                "name": "生命之光(手套)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 5,
                "slotPosName": "Gloves",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_GM_Grisilla_01_Gloves.png"
            },
            {
                "id": 70001103,
                "name": "烏爾德松鼠(肩膀)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 25,
                "slotPosName": "ShoulderWear",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_DECO_SDW_Squirrel_01.png"
            },
            {
                "id": 40048106,
                "name": "皮短版套裝(長靴)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 6,
                "slotPosName": "Boots",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_GF_Idol_03_Boots.png"
            },
            {
                "id": 30026102,
                "name": "自然綠林(腿甲)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Rare",
                "slotPos": 4,
                "slotPosName": "Pants",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0026_T03_Pants.png"
            },
            {
                "id": 30026107,
                "name": "自然綠林(披風)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Rare",
                "slotPos": 7,
                "slotPosName": "Cape",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0026_T03_Cape.png"
            },
            {
                "id": 20001108,
                "name": "溫暖林中樹古(法杖)",
                "enchantLevel": 0,
                "exceedLevel": 0,
                "grade": "Special",
                "slotPos": 14,
                "slotPosName": "Staff",
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Item_BattlePass_ST_shugo_01.png"
            }
        ]
    }
}


```

---

## 3. 查询角色装备与技能 (Equipment & Skills)

获取角色当前穿着的装备细节、宠物、翅膀以及技能配置。

- **请求网址**: `https://tw.ncsoft.com/aion2/api/character/equipment`
- **请求方法**: `GET`
- **请求参数**: 同上

### 核心数据模块

1. **Skill**: 包含主动 (`Active`)、被动 (`Passive`) 及 DP 技能的等级与装备状态。
2. **Equipment**: 包含所有部位装备的名称、强化等级 (`enchantLevel`)、品质 (`grade`) 及对应图标。
3. **PetWing**: 当前使用的宠物 (`pet`) 信息、翅膀 (`wing`) 及其外形皮肤 (`wingSkin`)。
4. **SkinList**: 角色当前应用的所有时装外形。

字段详情

```
{
  "daevanion": {
    "_comment": "代行者/守护者系统进度",
    "boardList": [
      {
        "id": "板块ID",
        "name": "板块名称(对应主神名)",
        "totalNodeCount": "总节点数",
        "openNodeCount": "已开启节点数",
        "icon": "板块图标URL",
        "open": "开启状态(1为已开启)",
        "openPercent": "当前板块完成百分比"
      }
    ]
  },
  "stat": {
    "_comment": "角色各项能力值与属性",
    "statList": [
      {
        "type": "属性缩写(STR/DEX等)",
        "name": "属性中文名",
        "value": "基础属性数值",
        "statSecondList": "该属性转换后的二级效果(如: 攻击力、命中、回避百分比加成)"
      },
      {
        "type": "ItemLevel",
        "name": "综合道具等级/装等",
        "value": "具体数值",
        "statSecondList": null
      }
    ]
  },
  "title": {
    "_comment": "称号收集与佩戴信息",
    "totalCount": "全游戏称号总数",
    "ownedCount": "已获得称号总数",
    "titleList": [
      {
        "id": "称号ID",
        "equipCategory": "装备位置分类(Attack/Defense/Etc)",
        "name": "称号名称",
        "grade": "等级(Legend传说/Unique唯一)",
        "totalCount": "该类别总数",
        "ownedCount": "该类别已获得数",
        "ownedPercent": "该类别收集百分比",
        "statList": "持有属性(获得即永久生效)",
        "equipStatList": "佩戴属性(只有装备该称号才生效)"
      }
    ]
  },
  "profile": {
    "_comment": "角色基础档案信息",
    "characterId": "角色唯一加密ID(通常用作数据库主键)",
    "characterName": "角色昵称",
    "serverId": "服务器ID",
    "serverName": "服务器名称",
    "regionName": "大区/地区名称",
    "pcId": "职业代号ID",
    "className": "职业名称",
    "raceId": "种族ID",
    "raceName": "种族名称",
    "gender": "性别代码",
    "genderName": "性别名称",
    "characterLevel": "角色等级",
    "titleId": "当前佩戴的称号ID",
    "titleName": "当前佩戴的称号名称",
    "titleGrade": "当前称号品质",
    "profileImage": "角色头像/形象图URL"
  },
  "ranking": {
    "_comment": "各项玩法排名信息",
    "rankingList": [
      {
        "rankingContentsType": "排名玩法类型(1:深渊/3:竞技场等)",
        "rankingContentsName": "玩法名称",
        "rank": "当前排名",
        "characterName": "角色名",
        "guildName": "所属公会名称",
        "point": "当前排名积分",
        "prevRank": "前一次统计排名",
        "rankChange": "排名变动(0为持平, 负数通常代表上升)",
        "gradeName": "当前军衔/段位名称",
        "gradeIcon": "段位图标URL"
      }
    ]
  }
}
```



返回数据示例

```
### 

{
    "profile": {
        "characterId": "chQWw6n1ntmlSG4TAezufiyCeShvn5mCJa-IZ4GG7Hs=",
        "characterName": "fofoooooo",
        "serverId": 2015,
        "serverName": "簡卡卡",
        "regionName": "",
        "pcId": 36,
        "className": "護法星",
        "raceId": 2,
        "raceName": "魔族",
        "gender": 2,
        "genderName": "女性",
        "characterLevel": 45,
        "titleId": 0,
        "titleName": "",
        "titleGrade": "",
        "profileImage": "https://profileimg.plaync.com/game_profile_images/aion2_tw/images?gameServerKey=2015&charKey=567172078072110950"
    },
    "ranking": {
        "rankingList": [
            {
                "rankingContentsType": 1,
                "rankingContentsName": "深淵",
                "rankingType": null,
                "rank": null,
                "characterId": null,
                "characterName": null,
                "classId": null,
                "className": null,
                "guildName": null,
                "point": null,
                "prevRank": null,
                "rankChange": null,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 3,
                "rankingContentsName": "惡夢",
                "rankingType": 0,
                "rank": 7971,
                "characterId": null,
                "characterName": "fofoooooo",
                "classId": 9,
                "className": "Chanter",
                "guildName": null,
                "point": 13736,
                "prevRank": 8512,
                "rankChange": -12,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 4,
                "rankingContentsName": "超越",
                "rankingType": null,
                "rank": null,
                "characterId": null,
                "characterName": null,
                "classId": null,
                "className": null,
                "guildName": null,
                "point": null,
                "prevRank": null,
                "rankChange": null,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 5,
                "rankingContentsName": "孤獨競技場",
                "rankingType": null,
                "rank": null,
                "characterId": null,
                "characterName": null,
                "classId": null,
                "className": null,
                "guildName": null,
                "point": null,
                "prevRank": null,
                "rankChange": null,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 6,
                "rankingContentsName": "協力競技場",
                "rankingType": null,
                "rank": null,
                "characterId": null,
                "characterName": null,
                "classId": null,
                "className": null,
                "guildName": null,
                "point": null,
                "prevRank": null,
                "rankChange": null,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 20,
                "rankingContentsName": "討伐戰",
                "rankingType": null,
                "rank": null,
                "characterId": null,
                "characterName": null,
                "classId": null,
                "className": null,
                "guildName": null,
                "point": null,
                "prevRank": null,
                "rankChange": null,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            },
            {
                "rankingContentsType": 21,
                "rankingContentsName": "覺醒戰",
                "rankingType": 0,
                "rank": 9793,
                "characterId": null,
                "characterName": "fofoooooo",
                "classId": 9,
                "className": "Chanter",
                "guildName": null,
                "point": 30566,
                "prevRank": 0,
                "rankChange": -10,
                "gradeId": null,
                "gradeName": null,
                "gradeIcon": null,
                "profileImage": null,
                "extraDataMap": null
            }
        ]
    },
    "daevanion": {
        "boardList": [
            {
                "id": 81,
                "name": "奈薩肯",
                "totalNodeCount": 88,
                "openNodeCount": 71,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Sword_1H.png",
                "open": 1,
                "openPercent": 81
            },
            {
                "id": 82,
                "name": "吉凱爾",
                "totalNodeCount": 88,
                "openNodeCount": 70,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Mace.png",
                "open": 1,
                "openPercent": 80
            },
            {
                "id": 83,
                "name": "白傑爾",
                "totalNodeCount": 88,
                "openNodeCount": 77,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Sword_1H.png",
                "open": 1,
                "openPercent": 88
            },
            {
                "id": 84,
                "name": "崔妮爾",
                "totalNodeCount": 116,
                "openNodeCount": 98,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Mace.png",
                "open": 1,
                "openPercent": 84
            },
            {
                "id": 85,
                "name": "艾瑞爾",
                "totalNodeCount": 152,
                "openNodeCount": 14,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Sword_1H.png",
                "open": 1,
                "openPercent": 9
            },
            {
                "id": 86,
                "name": "阿斯佩爾",
                "totalNodeCount": 152,
                "openNodeCount": 9,
                "icon": "https://assets.playnccdn.com/static-aion2-gamedata/resources/UT_Weapon_Mace.png",
                "open": 1,
                "openPercent": 6
            }
        ]
    },
    "stat": {
        "statList": [
            {
                "type": "STR",
                "name": "威力",
                "value": 72,
                "statSecondList": [
                    "攻擊力增加 +7.2%"
                ]
            },
            {
                "type": "DEX",
                "name": "敏捷",
                "value": 65,
                "statSecondList": [
                    "迴避增加 +6.5%",
                    "格擋增加 +6.5%",
                    "暴擊抵抗增加 +6.5%"
                ]
            },
            {
                "type": "INT",
                "name": "知識",
                "value": 122,
                "statSecondList": [
                    "異常狀態擊中 +12.2%"
                ]
            },
            {
                "type": "CON",
                "name": "體力",
                "value": 90,
                "statSecondList": [
                    "生命力增加 +9%"
                ]
            },
            {
                "type": "AGI",
                "name": "精確",
                "value": 48,
                "statSecondList": [
                    "命中增加 +4.8%",
                    "暴擊增加 +4.8%"
                ]
            },
            {
                "type": "WIS",
                "name": "意志",
                "value": 88,
                "statSecondList": [
                    "異常狀態抵抗 +8.8%"
                ]
            },
            {
                "type": "Justice",
                "name": "正義[奈薩肯]",
                "value": 55,
                "statSecondList": [
                    "防禦力增加 +11%",
                    "完美 +11%"
                ]
            },
            {
                "type": "Freedom",
                "name": "自由[白傑爾]",
                "value": 46,
                "statSecondList": [
                    "命中增加 +9.2%",
                    "迴避增加 +9.2%"
                ]
            },
            {
                "type": "Illusion",
                "name": "幻象[凱西內爾]",
                "value": 28,
                "statSecondList": [
                    "冷卻時間 -5.6%",
                    "鐵壁貫穿 +5.6%"
                ]
            },
            {
                "type": "Life",
                "name": "生命[尤斯迪埃]",
                "value": 28,
                "statSecondList": [
                    "生命力增加 +5.6%",
                    "再生 +5.6%"
                ]
            },
            {
                "type": "Time",
                "name": "時間[希埃爾]",
                "value": 83,
                "statSecondList": [
                    "戰鬥速度 +16.6%",
                    "強擊抵抗 +16.6%"
                ]
            },
            {
                "type": "Destruction",
                "name": "破壞[吉凱爾]",
                "value": 34,
                "statSecondList": [
                    "攻擊力增加 +6.8%",
                    "完美抵抗 +6.8%"
                ]
            },
            {
                "type": "Death",
                "name": "死亡[崔妮爾]",
                "value": 56,
                "statSecondList": [
                    "暴擊增加 +11.2%",
                    "再生貫穿 +11.2%"
                ]
            },
            {
                "type": "Wisdom",
                "name": "智慧[露梅爾]",
                "value": 29,
                "statSecondList": [
                    "精神力消耗量 -5.8%",
                    "強擊 +5.8%"
                ]
            },
            {
                "type": "Destiny",
                "name": "命運[瑪爾庫坦]",
                "value": 34,
                "statSecondList": [
                    "精神力增加 +6.8%",
                    "鐵壁 +6.8%"
                ]
            },
            {
                "type": "Space",
                "name": "空間[伊斯拉佩爾]",
                "value": 58,
                "statSecondList": [
                    "移動速度 +11.6%",
                    "格擋增加 +11.6%"
                ]
            },
            {
                "type": "ItemLevel",
                "name": "아이템레벨",
                "value": 2207,
                "statSecondList": null
            }
        ]
    },
    "title": {
        "totalCount": 391,
        "ownedCount": 198,
        "titleList": [
            {
                "id": 21020021,
                "equipCategory": "Etc",
                "name": "小屁孩",
                "grade": "Legend",
                "totalCount": 125,
                "ownedCount": 67,
                "ownedPercent": 54,
                "statList": [
                    {
                        "desc": "額外防禦力 +20"
                    }
                ],
                "equipStatList": [
                    {
                        "desc": "戰鬥速度 +3.9%"
                    },
                    {
                        "desc": "行動力 +170"
                    }
                ]
            },
            {
                "id": 22030002,
                "equipCategory": "Attack",
                "name": "亞爾特蓋德守護者",
                "grade": "Legend",
                "totalCount": 143,
                "ownedCount": 66,
                "ownedPercent": 46,
                "statList": [
                    {
                        "desc": "PVE傷害增幅 +1%"
                    }
                ],
                "equipStatList": [
                    {
                        "desc": "PVE傷害增幅 +3.7%"
                    },
                    {
                        "desc": "強擊 +2%"
                    }
                ]
            },
            {
                "id": 22030003,
                "equipCategory": "Defense",
                "name": "亞爾特蓋德聖者",
                "grade": "Unique",
                "totalCount": 123,
                "ownedCount": 65,
                "ownedPercent": 53,
                "statList": [
                    {
                        "desc": "PVE傷害耐性 +1%"
                    }
                ],
                "equipStatList": [
                    {
                        "desc": "額外防禦力 +300"
                    },
                    {
                        "desc": "傷害耐性 +5%"
                    },
                    {
                        "desc": "格擋 +110"
                    }
                ]
            }
        ]
    }
}

```

---

## 💡 开发说明

- **ID 获取**: 必须先调用 `search` 接口拿到 `characterId`，才能请求后续详情。
- **资源路径**: 文档中返回的图标链接（如 `Icon_WP_ST_...`）均指向 `assets.playnccdn.com`。
- **接口权限**: 该文档基于 NCSoft 官方公开 API，建议在请求头中携带正确的 `User-Agent` 与 `Referer` 以保证请求稳定性。
