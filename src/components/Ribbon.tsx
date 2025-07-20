import { useState } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ChevronDown,
  Palette,
  Type
} from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Sheet, CellStyle } from '../App'

interface RibbonProps {
  onFormatCell: (style: Partial<CellStyle>) => void
  selectedCell: string
  selectedRange: string[]
  activeSheet: Sheet
}

export function Ribbon({ onFormatCell, selectedCell, activeSheet }: RibbonProps) {
  const [activeTab, setActiveTab] = useState('Home')
  
  const tabs = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View']
  
  const currentCellStyle = activeSheet.cells[selectedCell]?.style || {}

  const handleBold = () => {
    onFormatCell({ bold: !currentCellStyle.bold })
  }

  const handleItalic = () => {
    onFormatCell({ italic: !currentCellStyle.italic })
  }

  const handleUnderline = () => {
    onFormatCell({ underline: !currentCellStyle.underline })
  }

  const handleAlign = (align: 'left' | 'center' | 'right') => {
    onFormatCell({ textAlign: align })
  }

  return (
    <div className="bg-[#f3f2f1] border-b border-[#d1d1d1]">
      {/* Tab Headers */}
      <div className="flex border-b border-[#d1d1d1]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#217346] bg-white text-[#217346]'
                : 'border-transparent hover:bg-[#e1dfdd] text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Home' && (
        <div className="p-2 flex items-center gap-4">
          {/* Clipboard Group */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-[#e1dfdd]"
                title="Paste (Ctrl+V)"
              >
                <span className="text-xs">Paste</span>
              </Button>
            </div>
            <span className="text-xs text-gray-600">Clipboard</span>
          </div>
          
          <Separator orientation="vertical" className="h-12" />
          
          {/* Font Group */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {/* Font Name */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-[#e1dfdd] min-w-[80px] justify-between"
              >
                Calibri
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {/* Font Size */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-[#e1dfdd] min-w-[40px] justify-between"
              >
                11
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Bold */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.bold ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={handleBold}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-3 w-3" />
              </Button>
              
              {/* Italic */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.italic ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={handleItalic}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-3 w-3" />
              </Button>
              
              {/* Underline */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.underline ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={handleUnderline}
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-3 w-3" />
              </Button>
              
              {/* Font Color */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-[#e1dfdd]"
                title="Font Color"
              >
                <Type className="h-3 w-3" />
              </Button>
              
              {/* Fill Color */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-[#e1dfdd]"
                title="Fill Color"
              >
                <Palette className="h-3 w-3" />
              </Button>
            </div>
            
            <span className="text-xs text-gray-600">Font</span>
          </div>
          
          <Separator orientation="vertical" className="h-12" />
          
          {/* Alignment Group */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.textAlign === 'left' ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={() => handleAlign('left')}
                title="Align Left"
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.textAlign === 'center' ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={() => handleAlign('center')}
                title="Center"
              >
                <AlignCenter className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-[#e1dfdd] ${
                  currentCellStyle.textAlign === 'right' ? 'bg-[#e1dfdd] border border-[#217346]' : ''
                }`}
                onClick={() => handleAlign('right')}
                title="Align Right"
              >
                <AlignRight className="h-3 w-3" />
              </Button>
            </div>
            
            <span className="text-xs text-gray-600">Alignment</span>
          </div>
        </div>
      )}
      
      {activeTab === 'Insert' && (
        <div className="p-2 flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-[#e1dfdd]"
            >
              <span className="text-xs">Chart</span>
            </Button>
            <span className="text-xs text-gray-600">Charts</span>
          </div>
          
          <Separator orientation="vertical" className="h-12" />
          
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-[#e1dfdd]"
            >
              <span className="text-xs">Table</span>
            </Button>
            <span className="text-xs text-gray-600">Tables</span>
          </div>
        </div>
      )}
      
      {activeTab === 'Formulas' && (
        <div className="p-2 flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-[#e1dfdd]"
            >
              <span className="text-xs">AutoSum</span>
            </Button>
            <span className="text-xs text-gray-600">Function Library</span>
          </div>
        </div>
      )}
    </div>
  )
}