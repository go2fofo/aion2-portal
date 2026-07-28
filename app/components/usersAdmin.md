

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
* `name`: 账号备注名称（如 `"大号"`、`"小号"`）。
* `createdAt`: 账号创建时间。


* **`groups`**: 角色分组列表，每个分组包含 `id`、`name`、`sort` 字段。
* **`teams`**: 自定义队伍列表（当前为空数组 `[]`）。

---

### 三、 角色列表 (`characters`)

每个角色对象包含非常丰富的游戏进度和属性数据，主要字段含义如下：

#### 1. 基础身份信息

* **`id`**: 角色唯一 ID（时间戳格式）。
* **`name`**: 角色游戏昵称（如 `"尤米艾拉"`, `"乔巴"`, `"巴巴巴巴"` 等）。
* **`class`**: 角色职业（如 `"魔道星"`, `"治愈星"`, `"护法星"`, `"守护星"`, `"杀星"`, `"弓星"`, `"剑星"`, `"拳星"`）。
* **`group`**: 角色所属的分组编号。
* **`serverRegion`**: 服务器大区（`"cn"` 代表国服）。
* **`accountId`**: 关联的账号 ID，用于区分归属于哪个大号或小号。
* **`locked`**: 角色是否被锁定（防止误操作，通常为 `true`）。
* **`primaryAccount`**: 角色是否为主账号（布尔值）。
* **`premiumMember`**: 角色是否为特级会员（布尔值）。
* **`premiumMemberDay`**: 特级会员剩余天数（整数值）。

#### 2. 能量与资源 (`energy`, `storedEnergy`, `kina`)

* **`energy`**: 当前剩余能量值。
* **`storedEnergy`**: 存储/积压的能量值。
* **`weeklyEnergyPurchased`**: 本周是否已购买周能量（布尔值）及其购买时间 `weeklyEnergyPurchasedDate`。
* **`breezeEnergyPurchased`**: 是否已购买微风能量（布尔值）及其购买时间 `breezeEnergyPurchasedDate`。
* **`kina`**: 游戏内的金币/货币数量（当前角色数据中均为 `0`）。

#### 3. 副本与次数进度 (`runs`, `transcendRuns`, `nightmareCount`, 等)

* **`runs`**: 远征副本通关次数及最后更新时间 `lastRunsUpdate`。
* **`transcendRuns`**: 超越副本通关次数及最后更新时间 `lastTranscendRunsUpdate`。
* **`nightmareCount`**: 噩梦副本挑战次数及最后更新时间 `lastNightmareUpdate`。
* **`storedNightmareCount`**: 存储的噩梦副本次数。
* **`dailyRuns`**: 每日副本次数及最后更新时间 `lastDailyRunsUpdate`。
* **`storedDailyRuns`**: 存储的每日副本次数。

#### 4. 最终Boss削弱进度 (`finalBossReductionRuns`)

* **`finalBossReductionRuns`**: 最终首领削弱机制的普通进度次数及更新时间。
* **`finalBossReductionRunsTranscend`**: 最终首领削弱机制的超越进度次数及更新时间。

> **基纳收益计算规则：**
> * **征服 (Runs)：**
> * 84次以下（0–84）：基纳获得量 **100%**
> * 105次以下（85–105）：基纳获得量 **80%**
> * 126次以下（106–126）：基纳获得量 **60%**
> * 147次以下（127–147）：基纳获得量 **40%**
> * 148次以上：基纳获得量 **20%**
> 
> 
> * **超越 (Transcend Runs)：**
> * 56次以下（0–56）：基纳获得量 **100%**
> * 70次以下（57–70）：基纳获得量 **80%**
> * 84次以下（71–84）：基纳获得量 **60%**
> * 98次以下（85–98）：基纳获得量 **40%**
> * 99次以上：基纳获得量 **20%**
> 
> 
> 
> 

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

---

```
参考案例{
  "characters": [
    {
      "id": 1780580178734,
      "name": "尤米艾拉",
      "class": "魔道星",
      "group": 1,
      "serverRegion": "cn",
      "accountId": "1780579258817",
      "energy": 625,
      "storedEnergy": 1990,
      "runs": 21,
      "lastEnergyUpdate": "2026-07-27T04:33:49.950Z",
      "lastRunsUpdate": "2026-07-27T04:33:49.950Z",
      "transcendRuns": 14,
      "lastTranscendRunsUpdate": "2026-07-27T04:33:49.950Z",
      "awakening": true,
      "awakeningDate": "2026-07-22T11:52:10.777Z",
      "weeklyEnergyPurchased": true,
      "weeklyEnergyPurchasedDate": "2026-07-22T11:52:14.279Z",
      "breezeEnergyPurchased": true,
      "breezeEnergyPurchasedDate": "2026-07-22T11:52:15.976Z",
      "nightmareCount": 10,
      "lastNightmareUpdate": "2026-07-27T04:33:49.950Z",
      "storedNightmareCount": 0,
      "locked": true,
      "dailyMission": false,
      "dailyMissionDate": "2026-06-25T16:38:06.300Z",
      "dailySignIn": false,
      "dailySignInDate": "2026-07-08T11:38:09.580Z",
      "equipmentScore": 0,
      "combatPower": 0,
      "finalBossReductionRuns": 35,
      "finalBossReductionRunsDate": "2026-07-21T21:00:20.228Z",
      "finalBossReductionRunsTranscend": 28,
      "finalBossReductionRunsTranscendDate": "2026-07-21T21:00:20.228Z",
      "sanctuary": {
        "s1": 1,
        "s2": 1,
        "s3": 1
      },
      "minigameCount": 14,
      "lastMinigameUpdate": "2026-06-11T23:09:59.018Z",
      "abyssOrderCompleted": false,
      "abyssOrderDate": "2026-06-05T08:06:49.551Z",
      "localOrderCompleted": false,
      "localOrderDate": "2026-06-05T08:06:49.551Z",
      "storedMinigameCount": 0,
      "storedDailyRuns": 0,
      "transcendNote": "",
      "dailyRuns": 7,
      "lastDailyRunsUpdate": "2026-06-05T08:06:49.551Z",
      "teamId": null,
      "kina": 0
    }
 
  ],
  "accounts": [
    {
      "id": "1780579258817",
      "name": "大号",
      "note": "",
      "createdAt": "2026-06-04T13:20:58.817Z"
    },
    {
      "id": "1780579267414",
      "name": "小号",
      "note": "",
      "createdAt": "2026-06-04T13:21:07.414Z"
    }
  ],
  //舍弃
  "groupNames": {
    "1": "分组1",
    "2": "分组2",
    "3": "分组3",
    "4": "分组4",
    "5": "分组5"
  },
  "groups": [
  { "id": 1, "name": "分组1", "sort": 1 },
  { "id": 2, "name": "分组2", "sort": 2 },
  { "id": 3, "name": "分组3", "sort": 3 },
  { "id": 4, "name": "分组4", "sort": 4 },
  { "id": 5, "name": "分组5", "sort": 5 }
],
  "groupCount": 5,

  "autoRefreshEnabled": true,
  "teams": [],
  "accountSharedData": {
    "aetherEnergyShopCraft": {
      "usedCount": 0,
      "maxCount": 20,
      "lastUpdate": "2026-07-22T02:51:37.956Z"
    },
    "abyssOrder": {
      "1780579258817": {
        "completed": false,
        "date": "2026-07-19T07:51:54.387Z"
      },
      "1780579267414": {
        "completed": false,
        "date": "2026-06-24T12:22:42.927Z"
      }
    },
    "localOrder": {
      "1780579258817": {
        "completed": false,
        "date": "2026-07-18T20:06:36.152Z"
      },
      "1780579267414": {
        "completed": false,
        "date": "2026-07-19T09:36:26.612Z"
      }
    },
    "minigame": {
      "1780579258817": {
        "count": 6,
        "maxCount": 14,
        "lastUpdate": "2026-07-27T04:33:49.950Z",
        "storedCount": 0
      },
      "1780579267414": {
        "count": 12,
        "maxCount": 14,
        "lastUpdate": "2026-07-27T04:33:49.950Z",
        "storedCount": 8
      }
    },
    "dailyRuns": {
      "1780579258817": {
        "count": 14,
        "maxCount": 14,
        "lastUpdate": "2026-07-22T02:51:37.956Z",
        "storedCount": 0
      },
      "1780579267414": {
        "count": 0,
        "maxCount": 14,
        "lastUpdate": "2026-07-22T02:51:19.481Z",
        "storedCount": 0
      }
    }
  },
  "exportDate": "2026/7/27 12:58:51",
  "version": "1.13",
  "dataType": "complete",
  "characterCount": 10
}
```
