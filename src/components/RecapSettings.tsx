import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Clock, Scissors, FileVideo } from 'lucide-react'
import type { RecapSettings } from '../types'

interface RecapSettingsProps {
  settings: RecapSettings
  onSettingsChange: (settings: RecapSettings) => void
}

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
};

const RecapSettingsComponent: React.FC<RecapSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const handleChange = (field: keyof RecapSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [field]: value
    })
  }

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-blue-400 ml-3" />
        <h2 className="text-xl font-semibold text-white">הגדרות סיכום</h2>
      </div>

      <div className="space-y-6">
        {/* אורך הסיכום */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Clock className="h-4 w-4 ml-2" />
            אורך הסיכום (עד 3 שעות)
          </label>
          <div className="flex items-center space-x-4 space-x-reverse">
            <input
              type="range"
              min="1"
              max="10800"
              value={settings.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white font-medium min-w-[4rem] text-center">
              {formatDuration(settings.duration)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            הסיכום יהיה באורך של {formatDuration(settings.duration)}
          </p>
        </div>

        {/* תדירות חיתוך */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Scissors className="h-4 w-4 ml-2" />
            חתוך כל (שניות)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.intervalSeconds}
            onChange={(e) => handleChange('intervalSeconds', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8"
          />
          <p className="text-xs text-gray-400 mt-1">
            כל {settings.intervalSeconds} שניות ייחתך קטע של שנייה אחת
          </p>
        </div>

        {/* תיאור הווידאו */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <FileVideo className="h-4 w-4 ml-2" />
            תיאור הווידאו
          </label>
          <textarea
            value={settings.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="תאר את תוכן הווידאו לצורך יצירת סיכום מדויק..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-400 mt-1">
            תיאור מפורט יעזור ל-AI ליצור סיכום איכותי יותר
          </p>
        </div>

        {/* סיכום הגדרות */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">סיכום הגדרות:</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• אורך סיכום: {formatDuration(settings.duration)}</p>
            <p>• חיתוך כל {settings.intervalSeconds} שניות</p>
            <p>• קטעים כוללים: ~{Math.floor(settings.duration / settings.intervalSeconds)} קטעים</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RecapSettingsComponent
