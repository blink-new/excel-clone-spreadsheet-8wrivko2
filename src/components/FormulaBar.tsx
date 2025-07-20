import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from './ui/button'

interface FormulaBarProps {
  selectedCell: string
  cellValue: string
  isEditing: boolean
  editingValue: string
  onEditingValueChange: (value: string) => void
  onStartEdit: () => void
  onStopEdit: (save?: boolean) => void
}

export function FormulaBar({
  selectedCell,
  cellValue,
  isEditing,
  editingValue,
  onEditingValueChange,
  onStartEdit,
  onStopEdit
}: FormulaBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onStopEdit(true)
      e.preventDefault()
    } else if (e.key === 'Escape') {
      onStopEdit(false)
      e.preventDefault()
    }
  }

  return (
    <div className="h-6 bg-white border-b border-[#d1d1d1] flex items-center">
      {/* Name Box */}
      <div className="w-20 h-full border-r border-[#d1d1d1] flex items-center justify-center bg-[#f3f2f1]">
        <span className="text-xs font-medium">{selectedCell}</span>
      </div>
      
      {/* Formula Bar Controls */}
      {isEditing && (
        <div className="flex items-center border-r border-[#d1d1d1]">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-[#e1dfdd]"
            onClick={() => onStopEdit(false)}
            title="Cancel (Esc)"
          >
            <X className="h-3 w-3 text-red-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-[#e1dfdd]"
            onClick={() => onStopEdit(true)}
            title="Confirm (Enter)"
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>
        </div>
      )}
      
      {/* Formula Input */}
      <div className="flex-1 h-full">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editingValue}
            onChange={(e) => onEditingValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onStopEdit(true)}
            className="w-full h-full px-2 text-xs border-none outline-none"
            placeholder="Enter value or formula..."
          />
        ) : (
          <button
            onClick={onStartEdit}
            className="w-full h-full px-2 text-xs text-left hover:bg-[#f8f9fa] flex items-center"
          >
            {cellValue || ''}
          </button>
        )}
      </div>
    </div>
  )
}