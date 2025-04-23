import { useState, useCallback, useRef } from 'react'

interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioUrl: string | null
  error: string | null
}

export default function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioUrl: null,
    error: null
  })

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // Reset any previous errors
      setState(prev => ({ ...prev, error: null }))
      
      // Request permission with constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      })
      
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setState((prev) => ({ ...prev, audioUrl }))
      }

      mediaRecorder.current.start()

      // Start duration timer
      let seconds = 0
      timerInterval.current = setInterval(() => {
        seconds++
        setState((prev) => ({ ...prev, duration: seconds }))
      }, 1000)

      setState((prev) => ({ ...prev, isRecording: true, isPaused: false }))
    } catch (error) {
      let errorMessage = 'Could not access microphone'
      
      // Provide more specific error messages based on the error type
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone detected. Please connect a microphone and try again.'
        } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
          errorMessage = 'Your microphone is busy or unavailable. Please close other applications that might be using it.'
        }
      }
      
      console.error('Error accessing microphone:', error)
      setState(prev => ({ ...prev, error: errorMessage }))
      throw new Error(errorMessage)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
    }

    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }

    setState((prev) => ({ ...prev, isRecording: false, isPaused: false }))
  }, [state.isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.pause()
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
      setState((prev) => ({ ...prev, isPaused: true }))
    }
  }, [state.isRecording])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current && state.isPaused) {
      mediaRecorder.current.resume()
      let seconds = state.duration
      timerInterval.current = setInterval(() => {
        seconds++
        setState((prev) => ({ ...prev, duration: seconds }))
      }, 1000)
      setState((prev) => ({ ...prev, isPaused: false }))
    }
  }, [state.isPaused, state.duration])

  const getAudioBlob = useCallback(() => {
    if (audioChunks.current.length === 0) return null
    return new Blob(audioChunks.current, { type: 'audio/wav' })
  }, [])

  const resetRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
    }
    audioChunks.current = []
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioUrl: null,
      error: null
    })
  }, [state.audioUrl])

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioBlob,
    resetRecording,
    formatDuration,
  }
}
