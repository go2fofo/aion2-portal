

### 一、 根目录字段

* **`version`**: 数据结构的版本号（当前为 `"1.13"`）。
* **`dataType`**: 数据类型（`"complete"` 表示完整数据导出）。
* **`exportDate`**: 数据导出的具体时间。
* **`characterCount`**: 角色总数量（当前共 **10** 个角色）。
* **`groupCount`**: 分组总数量（共 **5** 个分组）。
* **`autoRefreshEnabled`**: 是否开启自动刷新功能（布尔值）。

---

### 二、 账号与分组信息 (`accounts`, `groups`)

* **`accounts`**: 账号列表，区分不同的大区或子账号。
* `id`: 账号唯一标识。

* `createdAt`: 账号创建时间。


* **`groups`**: 角色分组列表，每个分组包含 `id`、`name`、`sort` 字段。
* **`teams`**: 自定义队伍列表（当前为空数组 `[]`）。

---

### 三、 角色列表 (`characters`)

每个角色对象包含非常丰富的游戏进度和属性数据，主要字段含义如下：

#### 1. 基础身份信息

* **`id`**: 角色唯一 ID（时间戳格式）。
* **`characterId`**: 角色系统加密唯一标识符。
* **`characterName`**: 角色游戏昵称
* **`characterLevel`**: 角色等级
* **`itemLevel`**: 道具/装备评分等级
* **`className`**: 职业名称
* **`gender`**: 性别标识数值
* **`genderName`**: 性别文本名称
* **`combatPower`**: 角色战力评分。
* **`equipmentScore`**: 装备评分
* **`group`**: 角色所属的分组编号。
* **`locked`**: 角色是否被锁定（防止误操作，通常为 `true`）。
* **`primaryAccount`**: 角色是否为主账号（布尔值）用于区分归属于哪个大号或小号。
* **`premiumMember`**: 角色是否为特级会员（布尔值）。
* **`premiumMemberDay`**: 特级会员剩余天数（整数值）。
* **`premiumStartTime`**: 特级会员开始时间（yyyy-MM-dd格式）。
* **`premiumEndTime`**: 特级会员结束时间（yyyy-MM-dd格式）。




#### 2. 能量与资源 (`energy`, `storedEnergy`, `kina`)

* **`energy`**: 当前奥德能量值。
* **`storedEnergy`**: 存储/积压/补充的奥德能量值。
* **`weeklyEnergyPurchased`**: 本周是否已购买周奥德能量（布尔值）及其购买时间 `weeklyEnergyPurchasedDate`。
* **`breezeEnergyPurchased`**: 是否已购买微风奥德能量（布尔值）及其购买时间 `breezeEnergyPurchasedDate`。
* **`kina`**: 游戏内的吉纳数量（当前角色数据中均为 `0`）。

#### 3. 副本与次数进度 (`runs`, `transcendRuns`, `nightmareCount`, 等)

* **`runs`**: 远征副本通关次数。
* **`transcendRuns`**: 超越副本通关次数。
* **`nightmareCount`**: 噩梦副本挑战次数。
* **`storedNightmareCount`**: 存储的噩梦副本次数。
* **`dailyRuns`**: 每日副本次数及最后更新时间 `lastDailyRunsUpdate`。
* **`storedDailyRuns`**: 存储的每日副本次数。



#### 5. 圣域与小游戏 (`sanctuary`, `minigame`)

* **`sanctuary`**: 新版多 Boss 圣域次数结构（例如 `"s1": 1, "s2": 1, "s3": 1` 分别对应三个不同 Boss 的进度）。
* **`minigameCount`**: 参与小游戏的次数及最后更新时间 `lastMinigameUpdate`。

#### 6. 觉醒与日常状态 (`awakening`, `dailyMission`, `dailySignIn`)

* **`awakening`**: 角色是否已觉醒（`true` / `false`）及觉醒的具体时间 `awakeningDate`。
* **`dailyMission`**: 每日任务完成状态及时间 `dailyMissionDate`。
* **`dailySignIn`**: 每日签到状态及时间 `dailySignInDate`。

#### 7. 战斗属性

* **`equipmentScore`**: 装备评分。
* **`combatPower`**: 战斗力数值。
* **`transcendNote`**: 超越玩法相关的备注文本。
* **`teamId`**: 当前所属队伍 ID（未组队时为 `null`）。

---

### 四、 账号共享数据 (`accountSharedData`)

这部分记录跨角色或整个账号通用的全局进度：

* **`aetherEnergyShopCraft`**: 以太能量商店制作次数（当前已用 `usedCount`、上限 `maxCount: 20`、最后更新时间 `lastUpdate`）。
* **`abyssOrder`**: 深渊指令（Abyss Order）在各个账号上的完成状态与时间。
* **`localOrder`**: 本地指令（Local Order）在各个账号上的完成状态与时间。
* **`minigame`**: 按账号统计的小游戏参与进度（包含当前进度 `count`、最大上限 `maxCount`、存储次数 `storedCount` 及 `lastUpdate`）。
* **`dailyRuns`**: 按账号统计的日常副本完成情况（包含 `count`、`maxCount`、`storedCount` 及 `lastUpdate`）。
