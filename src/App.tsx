import { useState, useCallback, useEffect } from 'react'
import { QuickAccessToolbar } from './components/QuickAccessToolbar'
import { TitleBar } from './components/TitleBar'
import { Ribbon } from './components/Ribbon'
import { FormulaBar } from './components/FormulaBar'
import { Spreadsheet } from './components/Spreadsheet'
import { SheetTabs } from './components/SheetTabs'
import { StatusBar } from './components/StatusBar'

export interface CellStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: number
}

export interface CellData {
  value: string
  formula?: string
  style?: CellStyle
}

export interface Sheet {
  id: string
  name: string
  cells: Record<string, CellData>
}

function App() {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: 'sheet1',
      name: 'Sheet1',
      cells: {}
    }
  ])
  const [activeSheetId, setActiveSheetId] = useState('sheet1')
  const [selectedCell, setSelectedCell] = useState('A1')
  const [selectedRange, setSelectedRange] = useState(['A1'])
  const [isEditing, setIsEditing] = useState(false)
  const [editingValue, setEditingValue] = useState('')
  const [undoStack, setUndoStack] = useState<Sheet[][]>([])
  const [redoStack, setRedoStack] = useState<Sheet[][]>([])

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId) || sheets[0]

  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(sheets))])
    setRedoStack([])
  }, [sheets])

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(sheets))])
      setSheets(previousState)
      setUndoStack(prev => prev.slice(0, -1))
    }
  }, [undoStack, sheets])

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(sheets))])
      setSheets(nextState)
      setRedoStack(prev => prev.slice(0, -1))
    }
  }, [redoStack, sheets])

  const handleCellSelect = useCallback((cellId: string) => {
    setSelectedCell(cellId)
    if (isEditing) {
      setIsEditing(false)
    }
  }, [isEditing])

  const handleCellEdit = useCallback((cellId: string) => {
    const cellData = activeSheet.cells[cellId]
    setEditingValue(cellData?.value || '')
    setIsEditing(true)
  }, [activeSheet.cells])

  const handleStopEdit = useCallback((save: boolean = true) => {
    if (save && isEditing) {
      saveState()
      setSheets(prev => prev.map(sheet => 
        sheet.id === activeSheetId
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [selectedCell]: {
                  ...sheet.cells[selectedCell],
                  value: editingValue
                }
              }
            }
          : sheet
      ))
    }
    setIsEditing(false)
    setEditingValue('')
  }, [isEditing, editingValue, selectedCell, activeSheetId, saveState])

  const handleCellUpdate = useCallback((cellId: string, data: Partial<CellData>) => {
    saveState()
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheetId
        ? {
            ...sheet,
            cells: {
              ...sheet.cells,
              [cellId]: {
                ...sheet.cells[cellId],
                ...data
              }
            }
          }
        : sheet
    ))
  }, [activeSheetId, saveState])

  const handleFormatCell = useCallback((style: Partial<CellStyle>) => {
    if (selectedRange.length > 0) {
      saveState()
      setSheets(prev => prev.map(sheet => 
        sheet.id === activeSheetId
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                ...selectedRange.reduce((acc, cellId) => ({
                  ...acc,
                  [cellId]: {
                    ...sheet.cells[cellId],
                    style: {
                      ...sheet.cells[cellId]?.style,
                      ...style
                    }
                  }
                }), {})
              }
            }
          : sheet
      ))
    }
  }, [selectedRange, activeSheetId, saveState])

  const handleAddSheet = useCallback(() => {
    const newSheetNumber = sheets.length + 1
    const newSheet: Sheet = {
      id: `sheet${newSheetNumber}`,
      name: `Sheet${newSheetNumber}`,
      cells: {}
    }
    setSheets(prev => [...prev, newSheet])
    setActiveSheetId(newSheet.id)
  }, [sheets.length])

  const handleDeleteSheet = useCallback((sheetId: string) => {
    if (sheets.length > 1) {
      setSheets(prev => prev.filter(sheet => sheet.id !== sheetId))
      if (activeSheetId === sheetId) {
        const remainingSheets = sheets.filter(sheet => sheet.id !== sheetId)
        setActiveSheetId(remainingSheets[0].id)
      }
    }
  }, [sheets, activeSheetId])

  const handleRenameSheet = useCallback((sheetId: string, newName: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId ? { ...sheet, name: newName } : sheet
    ))
  }, [])

  const getCellValue = useCallback((cellId: string) => {
    return activeSheet.cells[cellId]?.value || ''
  }, [activeSheet.cells])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              handleRedo()
            } else {
              handleUndo()
            }
            e.preventDefault()
            break
          case 'y':
            handleRedo()
            e.preventDefault()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  return (
    <div className="h-screen flex flex-col bg-white font-segoe">
      <QuickAccessToolbar 
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />
      <TitleBar />
      <Ribbon 
        onFormatCell={handleFormatCell}
        selectedCell={selectedCell}
        selectedRange={selectedRange}
        activeSheet={activeSheet}
      />
      <FormulaBar 
        selectedCell={selectedCell}
        cellValue={getCellValue(selectedCell)}
        isEditing={isEditing}
        editingValue={editingValue}
        onEditingValueChange={setEditingValue}
        onStartEdit={() => handleCellEdit(selectedCell)}
        onStopEdit={handleStopEdit}
      />
      <Spreadsheet
        sheet={activeSheet}
        selectedCell={selectedCell}
        selectedRange={selectedRange}
        isEditing={isEditing}
        editingValue={editingValue}
        onCellSelect={handleCellSelect}
        onRangeSelect={setSelectedRange}
        onCellEdit={handleCellEdit}
        onEditingValueChange={setEditingValue}
        onStopEdit={handleStopEdit}
        onCellUpdate={handleCellUpdate}
      />
      <SheetTabs
        sheets={sheets}
        activeSheetId={activeSheetId}
        onSheetSelect={setActiveSheetId}
        onAddSheet={handleAddSheet}
        onDeleteSheet={handleDeleteSheet}
        onRenameSheet={handleRenameSheet}
      />
      <StatusBar 
        selectedRange={selectedRange}
        getCellValue={getCellValue}
      />
    </div>
  )
}

export default App