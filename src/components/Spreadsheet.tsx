import { useEffect, useRef, useState, useCallback } from 'react'
import { Sheet, CellData } from '../App'

interface SpreadsheetProps {
  sheet: Sheet
  selectedCell: string
  selectedRange: string[]
  isEditing: boolean
  editingValue: string
  onCellSelect: (cellId: string) => void
  onRangeSelect: (range: string[]) => void
  onCellEdit: (cellId: string) => void
  onEditingValueChange: (value: string) => void
  onStopEdit: (save?: boolean) => void
  onCellUpdate: (cellId: string, data: Partial<CellData>) => void
}

const COLUMN_WIDTH = 80
const ROW_HEIGHT = 20
const HEADER_HEIGHT = 20
const HEADER_WIDTH = 40

// Generate column labels (A, B, C, ..., Z, AA, AB, ...)
const getColumnLabel = (index: number): string => {
  let result = ''
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result
    index = Math.floor(index / 26) - 1
  }
  return result
}

// Convert column label to index (A=0, B=1, ..., Z=25, AA=26, ...)
const getColumnIndex = (label: string): number => {
  let result = 0
  for (let i = 0; i < label.length; i++) {
    result = result * 26 + (label.charCodeAt(i) - 64)
  }
  return result - 1
}

// Parse cell ID (e.g., "A1" -> {col: 0, row: 0})
const parseCellId = (cellId: string) => {
  const match = cellId.match(/^([A-Z]+)(\d+)$/)
  if (!match) return { col: 0, row: 0 }
  return {
    col: getColumnIndex(match[1]),
    row: parseInt(match[2]) - 1
  }
}

// Generate cell ID from coordinates
const getCellId = (col: number, row: number): string => {
  return `${getColumnLabel(col)}${row + 1}`
}

export function Spreadsheet({
  sheet,
  selectedCell,
  selectedRange,
  isEditing,
  editingValue,
  onCellSelect,
  onRangeSelect,
  onCellEdit,
  onEditingValueChange,
  onStopEdit,
  onCellUpdate
}: SpreadsheetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{col: number, row: number} | null>(null)

  const visibleRows = 50
  const visibleCols = 26

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  const handleCellClick = useCallback((col: number, row: number, e: React.MouseEvent) => {
    const cellId = getCellId(col, row)
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      if (!selectedRange.includes(cellId)) {
        onRangeSelect([...selectedRange, cellId])
      }
    } else if (e.shiftKey && selectedRange.length > 0) {
      // Range select
      const startCell = parseCellId(selectedRange[0])
      const endCell = { col, row }
      const range = []
      
      const minCol = Math.min(startCell.col, endCell.col)
      const maxCol = Math.max(startCell.col, endCell.col)
      const minRow = Math.min(startCell.row, endCell.row)
      const maxRow = Math.max(startCell.row, endCell.row)
      
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          range.push(getCellId(c, r))
        }
      }
      onRangeSelect(range)
    } else {
      // Single select
      onCellSelect(cellId)
      onRangeSelect([cellId])
    }
  }, [selectedRange, onCellSelect, onRangeSelect])

  const handleCellDoubleClick = useCallback((col: number, row: number) => {
    const cellId = getCellId(col, row)
    onCellEdit(cellId)
  }, [onCellEdit])

  const handleMouseDown = useCallback((col: number, row: number, e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true)
      setDragStart({ col, row })
      handleCellClick(col, row, e)
    }
  }, [handleCellClick])

  const handleMouseEnter = useCallback((col: number, row: number) => {
    if (isDragging && dragStart) {
      const range = []
      const minCol = Math.min(dragStart.col, col)
      const maxCol = Math.max(dragStart.col, col)
      const minRow = Math.min(dragStart.row, row)
      const maxRow = Math.max(dragStart.row, row)
      
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          range.push(getCellId(c, r))
        }
      }
      onRangeSelect(range)
    }
  }, [isDragging, dragStart, onRangeSelect])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        onStopEdit(true)
        e.preventDefault()
      } else if (e.key === 'Escape') {
        onStopEdit(false)
        e.preventDefault()
      }
      return
    }

    const { col, row } = parseCellId(selectedCell)
    let newCol = col
    let newRow = row

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1)
        break
      case 'ArrowDown':
        newRow = row + 1
        break
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1)
        break
      case 'ArrowRight':
        newCol = col + 1
        break
      case 'Enter':
        newRow = row + 1
        break
      case 'Tab':
        newCol = col + 1
        e.preventDefault()
        break
      case 'F2':
        onCellEdit(selectedCell)
        e.preventDefault()
        return
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          onCellEdit(selectedCell)
          return
        }
        return
    }

    const newCellId = getCellId(newCol, newRow)
    onCellSelect(newCellId)
    onRangeSelect([newCellId])
    e.preventDefault()
  }, [isEditing, selectedCell, onCellSelect, onRangeSelect, onCellEdit, onStopEdit])

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp()
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [handleMouseUp])

  const getCellStyle = (cellData: CellData) => {
    const style: React.CSSProperties = {}
    
    if (cellData.style) {
      if (cellData.style.bold) style.fontWeight = 'bold'
      if (cellData.style.italic) style.fontStyle = 'italic'
      if (cellData.style.underline) style.textDecoration = 'underline'
      if (cellData.style.color) style.color = cellData.style.color
      if (cellData.style.backgroundColor) style.backgroundColor = cellData.style.backgroundColor
      if (cellData.style.textAlign) style.textAlign = cellData.style.textAlign
      if (cellData.style.fontSize) style.fontSize = `${cellData.style.fontSize}px`
    }
    
    return style
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-auto bg-white relative"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        {/* Column Headers */}
        <div className="sticky top-0 z-20 flex bg-[#f3f2f1] border-b border-[#d1d1d1]">
          <div 
            className="bg-[#f3f2f1] border-r border-[#d1d1d1] flex items-center justify-center"
            style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
          />
          {Array.from({ length: visibleCols }, (_, i) => (
            <div
              key={i}
              className="border-r border-[#d1d1d1] flex items-center justify-center text-xs font-medium bg-[#f3f2f1] hover:bg-[#e1dfdd]"
              style={{ width: COLUMN_WIDTH, height: HEADER_HEIGHT }}
            >
              {getColumnLabel(i)}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: visibleRows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {/* Row Header */}
            <div
              className="sticky left-0 z-10 border-r border-b border-[#d1d1d1] flex items-center justify-center text-xs font-medium bg-[#f3f2f1] hover:bg-[#e1dfdd]"
              style={{ width: HEADER_WIDTH, height: ROW_HEIGHT }}
            >
              {rowIndex + 1}
            </div>

            {/* Cells */}
            {Array.from({ length: visibleCols }, (_, colIndex) => {
              const cellId = getCellId(colIndex, rowIndex)
              const cellData = sheet.cells[cellId] || { value: '' }
              const isSelected = selectedCell === cellId
              const isInRange = selectedRange.includes(cellId)
              const isEditingThis = isEditing && isSelected

              return (
                <div
                  key={cellId}
                  className={`border-r border-b border-[#d1d1d1] relative cursor-cell ${
                    isSelected 
                      ? 'bg-[#4285f4] bg-opacity-20 border-[#4285f4] border-2' 
                      : isInRange 
                        ? 'bg-[#4285f4] bg-opacity-10' 
                        : 'hover:bg-[#f8f9fa]'
                  }`}
                  style={{ 
                    width: COLUMN_WIDTH, 
                    height: ROW_HEIGHT,
                    ...getCellStyle(cellData)
                  }}
                  onMouseDown={(e) => handleMouseDown(colIndex, rowIndex, e)}
                  onMouseEnter={() => handleMouseEnter(colIndex, rowIndex)}
                  onDoubleClick={() => handleCellDoubleClick(colIndex, rowIndex)}
                >
                  {isEditingThis ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingValue}
                      onChange={(e) => onEditingValueChange(e.target.value)}
                      onBlur={() => onStopEdit(true)}
                      className="w-full h-full px-1 text-xs border-none outline-none bg-transparent"
                      style={getCellStyle(cellData)}
                    />
                  ) : (
                    <div className="w-full h-full px-1 flex items-center text-xs overflow-hidden">
                      {cellData.value}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}