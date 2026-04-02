export const formatCombatPower = (value: any) => {
  const n = Number(String(value ?? '').replace(/,/g, ''))
  if (!Number.isFinite(n) || n <= 0) return '-'
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(Math.round(n))
}

