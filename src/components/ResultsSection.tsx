import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Play, Pause, Square } from 'lucide-react'
import type { RecapOutput } from '../types'

interface ResultsSectionProps {
  output: RecapOutput
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ output }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // State for voice selection
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;

      setAllVoices(availableVoices);

      const uniqueLangs = [...new Set(availableVoices.map(v => v.lang))];
      setLanguages(uniqueLangs);

      // Set default language to Hebrew if available
      const defaultLang = uniqueLangs.find(lang => lang.startsWith('he')) || uniqueLangs[0];
      setSelectedLanguage(defaultLang || '');
    };
    
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // Update filtered voices when language changes
  useEffect(() => {
    if (selectedLanguage) {
      const voicesForLang = allVoices.filter(v => v.lang === selectedLanguage);
      setFilteredVoices(voicesForLang);
      setSelectedVoice(voicesForLang[0] || null);
    }
  }, [selectedLanguage, allVoices]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output.script);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(output.script);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const getDisplayLanguage = (langCode: string) => {
    try {
      const languageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode.split('-')[0]);
      return `${languageName} (${langCode})`;
    } catch (e) {
      return langCode;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 1. Video Recap */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">סיכום וידאו (ללא קול)</h3>
        <video src={output.videoUrl} controls className="w-full rounded-lg mb-4" />
        <a
          href={output.videoUrl}
          download="recap-video.mp4"
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          <Download className="h-5 w-5 ml-2" />
          הורד וידאו
        </a>
      </div>

      {/* 2. Generated Script */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">תסריט שנוצר</h3>
        <textarea
          readOnly
          value={output.script}
          className="w-full h-48 bg-gray-900 text-gray-300 p-3 rounded-lg border border-gray-600 resize-none"
        />
        <button
          onClick={handleCopy}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          <Copy className="h-5 w-5 ml-2" />
          {isCopied ? 'הועתק!' : 'העתק תסריט'}
        </button>
      </div>

      {/* 3. Audio Voice-over */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">קריינות אודיו</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">בחר שפה:</label>
            <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {languages.map(lang => (
                    <option key={lang} value={lang}>{getDisplayLanguage(lang)}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">בחר קול:</label>
            <select 
                value={selectedVoice?.name || ''}
                onChange={(e) => setSelectedVoice(allVoices.find(v => v.name === e.target.value) || null)}
                disabled={filteredVoices.length === 0}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {filteredVoices.map(voice => (
                    <option key={voice.name} value={voice.name}>{voice.name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
            <button onClick={handlePlayPause} className="p-4 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={handleStop} className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors">
                <Square size={24} />
            </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">הורדת קובץ האודיו אינה נתמכת כרגע.</p>
      </div>
    </motion.div>
  )
}

export default ResultsSection
