import { Save, Undo, Redo } from 'lucide-react'
import { Button } from './ui/button'

interface QuickAccessToolbarProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function QuickAccessToolbar({ onUndo, onRedo, canUndo, canRedo }: QuickAccessToolbarProps) {
  return (
    <div className="h-7 bg-[#f3f2f1] border-b border-[#d1d1d1] flex items-center px-2 gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-[#e1dfdd]"
        title="Save (Ctrl+S)"
      >
        <Save className="h-3 w-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-[#e1dfdd] disabled:opacity-50"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-3 w-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-[#e1dfdd] disabled:opacity-50"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-3 w-3" />
      </Button>
    </div>
  )
}