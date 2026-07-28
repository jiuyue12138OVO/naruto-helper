import { Button } from '@/components/ui/button'

interface DonePhaseProps {
  onConfirmNextGame: () => void
  myConfirmed: boolean
  isSpectator?: boolean
}

export default function DonePhase({ onConfirmNextGame, myConfirmed, isSpectator = false }: DonePhaseProps) {
  if (isSpectator) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold text-primary">本局 BP 完成！</p>
        <p className="text-muted-foreground">观众等待玩家确认下一局...</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-lg font-semibold text-primary">本局 BP 完成！</p>
      {myConfirmed ? (
        <p className="text-muted-foreground">已确认，等待对手确认进入下一局...</p>
      ) : (
        <Button onClick={onConfirmNextGame}>确认进入下一局</Button>
      )}
    </div>
  )
}