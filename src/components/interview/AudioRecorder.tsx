'use client'

import { useState } from 'react'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import {
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/solid'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  isAnalyzing?: boolean
}

export default function AudioRecorder({
  onRecordingComplete,
  isAnalyzing = false,
}: AudioRecorderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const {
    isRecording,
    isPaused,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioBlob,
    formatDuration,
  } = useAudioRecorder()

  const handleSubmit = () => {
    const blob = getAudioBlob()
    if (blob) {
      onRecordingComplete(blob)
    }
  }

  const handlePlayPause = () => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    if (!isPlaying) {
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <MicrophoneIcon className="h-6 w-6" />
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isPaused ? (
                <PlayIcon className="h-6 w-6" />
              ) : (
                <PauseIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={stopRecording}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-700"
            >
              <StopIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {audioUrl && !isRecording && (
          <>
            <button
              onClick={handlePlayPause}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => startRecording()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Recording Status */}
      <div className="text-center">
        {isRecording && (
          <p className="text-sm text-gray-600">
            Recording {isPaused ? '(Paused)' : ''}: {formatDuration(duration)}
          </p>
        )}
        {!isRecording && audioUrl && (
          <p className="text-sm text-gray-600">
            Recording length: {formatDuration(duration)}
          </p>
        )}
      </div>

      {/* Submit Button */}
      {audioUrl && !isRecording && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Recording'}
          </button>
        </div>
      )}
    </div>
  )
}
