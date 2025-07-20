import { useState } from 'react'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet } from '../App'

interface SheetTabsProps {
  sheets: Sheet[]
  activeSheetId: string
  onSheetSelect: (sheetId: string) => void
  onAddSheet: () => void
  onDeleteSheet: (sheetId: string) => void
  onRenameSheet: (sheetId: string, newName: string) => void
}

export function SheetTabs({
  sheets,
  activeSheetId,
  onSheetSelect,
  onAddSheet,
  onDeleteSheet,
  onRenameSheet
}: SheetTabsProps) {
  const [editingSheet, setEditingSheet] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const startRename = (sheet: Sheet) => {
    setEditingSheet(sheet.id)
    setEditingName(sheet.name)
  }

  const finishRename = () => {
    if (editingSheet && editingName.trim()) {
      onRenameSheet(editingSheet, editingName.trim())
    }
    setEditingSheet(null)
    setEditingName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishRename()
    } else if (e.key === 'Escape') {
      setEditingSheet(null)
      setEditingName('')
    }
  }

  return (
    <div className="h-6 bg-[#f3f2f1] border-t border-[#d1d1d1] flex items-center">
      {/* Navigation arrows */}
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-[#e1dfdd]"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-[#e1dfdd]"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Sheet tabs */}
      <div className="flex-1 flex items-center overflow-x-auto">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className={`group relative flex items-center min-w-0 ${
              activeSheetId === sheet.id
                ? 'bg-white border-t border-l border-r border-[#d1d1d1] z-10'
                : 'bg-[#f3f2f1] hover:bg-[#e1dfdd] border-r border-[#d1d1d1]'
            }`}
            style={{ height: '24px' }}
          >
            {editingSheet === sheet.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={finishRename}
                onKeyDown={handleKeyDown}
                className="px-2 text-xs bg-transparent border-none outline-none w-20"
                autoFocus
              />
            ) : (
              <button
                onClick={() => onSheetSelect(sheet.id)}
                onDoubleClick={() => startRename(sheet)}
                className="px-2 text-xs font-medium truncate min-w-0 flex-1 text-left"
              >
                {sheet.name}
              </button>
            )}
            
            {sheets.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSheet(sheet.id)
                }}
              >
                <X className="h-2 w-2 text-red-600" />
              </Button>
            )}
          </div>
        ))}

        {/* Add sheet button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 ml-1 hover:bg-[#e1dfdd]"
          onClick={onAddSheet}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 px-2 text-xs">
        <span>100%</span>
        <div className="w-16 h-1 bg-[#d1d1d1] rounded">
          <div className="w-8 h-1 bg-[#217346] rounded"></div>
        </div>
      </div>
    </div>
  )
}