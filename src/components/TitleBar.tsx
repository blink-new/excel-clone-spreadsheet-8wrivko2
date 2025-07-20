import { Minimize2, Square, X } from 'lucide-react'
import { Button } from './ui/button'

export function TitleBar() {
  return (
    <div className="h-8 bg-[#217346] text-white flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
          <span className="text-[#217346] text-xs font-bold">X</span>
        </div>
        <span className="text-sm font-medium">Microsoft Excel</span>
        <span className="text-sm opacity-75">- Book1</span>
      </div>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
        >
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-600 text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}