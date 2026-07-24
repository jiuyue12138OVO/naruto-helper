import { Button } from '@/components/ui/button'

interface DonePhaseProps {
  onNextGame: () => void
}

export default function DonePhase({ onNextGame }: DonePhaseProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-lg font-semibold text-primary">本局 BP 完成！</p>
      <Button onClick={onNextGame}>进入下一局</Button>
    </div>
  )
}