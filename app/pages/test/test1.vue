<script setup>
import { executeRulesByDictionary } from '@/utils/gameRefreshManager' // 根据你实际的路径调整

const testRefreshLogic = () => {
  console.clear()
  console.log('%c [Test] 开始执行游戏规则刷新测试...', 'color: #00dc82; font-weight: bold; font-size: 14px;')

  // 1. 构造一个包含各种边界情况的假游戏数据
  const mockGameData = {
    groups: [
      {
        id: 'group_1',
        minigameCount: 13, // 假设古树庆典当前13次 (上限14)
        storedMinigameCount: 5, // 存储池当前5次
        // 把最后更新时间设为“48小时前”（模拟跨了多天，本应加很多次）
        lastMinigameUpdate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ],
    characters: [
      {
        id: 'char_1',
        name: '测试战士A',
        energy: 100,
        premiumMember: false,
        // 把能量最后更新时间设为“4小时前”（满足 >= 3小时恢复10点的条件）
        lastEnergyUpdate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        
        nightmareCount: 13, // 假设噩梦副本当前13次 (上限14)
        storedNightmareCount: 2, // 噩梦存储池当前2次
        lastNightmareUpdate: new Date(Date.now() - 25 * 3600 * 1000).toISOString()
      }
    ]
  }

  console.log('--- 刷新前原始数据 ---', JSON.parse(JSON.stringify(mockGameData)))

  // 2. 执行核心解释器
  const hasChanges = executeRulesByDictionary(mockGameData)

  console.log('--- 是否检测到变更 ---', hasChanges)
  console.log('--- 刷新后结果数据 ---', JSON.parse(JSON.stringify(mockGameData)))

  // 3. 结果校验提示
  console.log('%c [校验说明]：', 'color: #3b82f6; font-weight: bold;')
  console.log('1. 古树庆典 (13次 + 跨天恢复)：应该被死死卡在上限 14，且存储池保持 5 不变。当前值:', mockGameData.groups[0].minigameCount)
  console.log('2. 噩梦副本 (13次 + 跨天恢复)：应该被死死卡在上限 14，且存储池保持 2 不变。当前值:', mockGameData.characters[0].nightmareCount)
  console.log('3. 奥德能量 (100 + 10)：应该变成 110。当前值:', mockGameData.characters[0].energy)
}
</script>

<template>
  <div style="padding: 40px; font-family: sans-serif;">
    <h2>🎮 Aion2 规则解释器与上限测试页面</h2>
    <p style="color: #666; margin-bottom: 20px;">点击下方按钮后，请按 <strong>F12</strong> 打开浏览器控制台查看详细的刷新前后对比与上限拦截日志。</p>
    
    <button 
      @click="testRefreshLogic" 
      style="padding: 12px 24px; background: #00dc82; color: #fff; font-size: 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
    >
      🚀 运行自动化规则与上限测试
    </button>
  </div>
</template>