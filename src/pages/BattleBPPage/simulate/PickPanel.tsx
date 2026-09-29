import BlindPickPanel from './BlindPickPanel'
import CounterPickPanel from './CounterPickPanel'
import Venn3Panel from './Venn3Panel'
import type { INinja } from '@/data/ninjas'

interface PickPanelProps {
  myRole: '1P' | '2P'
  currentSlot: { player: '1P' | '2P'; index: number } | null
  team1P: (INinja | null)[]
  team2P: (INinja | null)[]
  usedNinjas: Set<string>
  banned1P: (INinja | null)[]
  banned2P: (INinja | null)[]
  onSelect: (ninja: INinja) => void
  pendingNinjaId?: string
}

export default function PickPanel({
  myRole,
  currentSlot,
  team1P, team2P,
  usedNinjas, banned1P, banned2P,
  onSelect, pendingNinjaId,
}: PickPanelProps) {
  if (!currentSlot) return null

  const { player, index } = currentSlot
  const sharedProps = {
    myRole,
    currentSlot,
    team1P, team2P, usedNinjas, banned1P, banned2P,
    onSelect, pendingNinjaId,
  }

  // 1P 1号位：盲选，无参考
  if (player === '1P' && index === 0) {
    return <BlindPickPanel {...sharedProps} />
  }

  // 1P 2号位：克制 2P 1号位 + 2P 2号位（对位 = 2P 2号位，index 1）
  if (player === '1P' && index === 1) {
    const targets = [team2P[0], team2P[1]].filter(Boolean) as INinja[]
    if (targets.length === 0) return <BlindPickPanel {...sharedProps} />
    return <Venn3Panel mode="counter" {...sharedProps} targets={targets} primaryIndex={1} />
  }

  // 1P 3号位：盲选+参考 2P 2号位（Venn3Panel 盲选模式）
  if (player === '1P' && index === 2) {
    const targets = [team2P[1]].filter(Boolean) as INinja[]
    if (targets.length === 0) return <BlindPickPanel {...sharedProps} />
    return (
      <Venn3Panel
        mode="blind"
        {...sharedProps}
        targets={targets}
        warningTarget={team2P[0]}
      />
    )
  }

  // 2P 1号位：克制 1P 1号位
  if (player === '2P' && index === 0) {
    return <CounterPickPanel {...sharedProps} target={team1P[0]} />
  }

  // 2P 2号位：盲选+参考 1P 1号位（Venn3Panel 盲选模式）
  if (player === '2P' && index === 1) {
    const targets = [team1P[0]].filter(Boolean) as INinja[]
    if (targets.length === 0) return <BlindPickPanel {...sharedProps} />
    return (
      <Venn3Panel
        mode="blind"
        {...sharedProps}
        targets={targets}
      />
    )
  }

  // 2P 3号位：克制 1P 2号位 + 1P 3号位，警示若 1P 1号位克制
  if (player === '2P' && index === 2) {
    const targets = [team1P[1], team1P[2]].filter(Boolean) as INinja[]
    if (targets.length === 0) return <BlindPickPanel {...sharedProps} />
    return (
      <Venn3Panel
        mode="counter"
        {...sharedProps}
        targets={targets}
        warningTarget={team1P[0]}
        primaryIndex={1}
      />
    )
  }

  return null
}