import { useState, useCallback, useRef } from 'react'
import Webcam from 'react-webcam'

interface VideoRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  videoUrl: string | null
}

export default function useVideoRecorder() {
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    videoUrl: null,
  })

  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoChunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    if (!webcamRef.current?.stream) {
      throw new Error('Webcam stream not available')
    }

    videoChunks.current = []
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    })

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.current.push(event.data)
      }
    }

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(videoChunks.current, { type: 'video/webm' })
      const videoUrl = URL.createObjectURL(videoBlob)
      setState((prev) => ({ ...prev, videoUrl }))
    }

    mediaRecorderRef.current.start()

    // Start duration timer
    let seconds = 0
    timerInterval.current = setInterval(() => {
      seconds++
      setState((prev) => ({ ...prev, duration: seconds }))
    }, 1000)

    setState((prev) => ({ ...prev, isRecording: true, isPaused: false }))
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
    }

    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }

    setState((prev) => ({ ...prev, isRecording: false, isPaused: false }))
  }, [state.isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause()
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
      setState((prev) => ({ ...prev, isPaused: true }))
    }
  }, [state.isRecording])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isPaused) {
      mediaRecorderRef.current.resume()
      let seconds = state.duration
      timerInterval.current = setInterval(() => {
        seconds++
        setState((prev) => ({ ...prev, duration: seconds }))
      }, 1000)
      setState((prev) => ({ ...prev, isPaused: false }))
    }
  }, [state.isPaused, state.duration])

  const getVideoBlob = useCallback(() => {
    if (videoChunks.current.length === 0) return null
    return new Blob(videoChunks.current, { type: 'video/webm' })
  }, [])

  const resetRecording = useCallback(() => {
    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl)
    }
    videoChunks.current = []
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      videoUrl: null,
    })
  }, [state.videoUrl])

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Video constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  }

  return {
    ...state,
    webcamRef,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getVideoBlob,
    resetRecording,
    formatDuration,
    videoConstraints,
  }
}
