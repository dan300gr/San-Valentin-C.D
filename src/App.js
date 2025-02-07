"use client"

import { useState, useEffect, useRef } from "react"
import Confetti from "react-confetti"
import "./App.css"
import backgroundImage from "./background.jpg"

function App() {
  const [buttonPosition, setButtonPosition] = useState({
    yesX: 0,
    yesY: 0,
    noX: 0,
    noY: 0,
  })

  const [yesPressed, setYesPressed] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const buttonContainerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      updateButtonPositions()
    }

    const updateButtonPositions = () => {
      if (!buttonContainerRef.current) return

      const containerRect = buttonContainerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      const buttonSize = Math.min(containerWidth * 0.4, containerHeight * 0.4, 200)

      setButtonPosition({
        yesX: containerWidth * 0.25 - buttonSize / 2,
        yesY: containerHeight / 2 - buttonSize / 2,
        noX: containerWidth * 0.75 - buttonSize / 2,
        noY: containerHeight / 2 - buttonSize / 2,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    const audioElement = new Audio("/background-music.mp3")
    audioElement.loop = true
    audioRef.current = audioElement

    const playAudio = () => {
      audioElement.play().catch((error) => {
        console.log("Autoplay prevented:", error)
        document.addEventListener(
          "click",
          function audioUnlock() {
            audioElement.play()
            document.removeEventListener("click", audioUnlock)
          },
          { once: true },
        )
      })
    }

    playAudio()

    return () => {
      window.removeEventListener("resize", handleResize)
      audioElement.pause()
      audioElement.currentTime = 0
    }
  }, [])

  const handleNoHover = () => {
    if (!buttonContainerRef.current) return

    const containerRect = buttonContainerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const buttonSize = Math.min(containerWidth * 0.4, containerHeight * 0.4, 200)
    const padding = buttonSize * 0.1

    const newX = Math.max(
      padding,
      Math.min(containerWidth - buttonSize - padding, Math.random() * (containerWidth - buttonSize)),
    )

    const newY = Math.max(
      padding,
      Math.min(containerHeight - buttonSize - padding, Math.random() * (containerHeight - buttonSize)),
    )

    setButtonPosition((prev) => ({
      ...prev,
      noX: newX,
      noY: newY,
    }))
  }

  const handleYesClick = () => {
    setYesPressed(true)
  }

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="App-content">
        {!yesPressed ? (
          <>
            <h1>Can I be your Valentine?</h1>
            <div className="button-container" ref={buttonContainerRef}>
              <button
                className="yes-button"
                style={{ left: buttonPosition.yesX, top: buttonPosition.yesY }}
                onClick={handleYesClick}
              >
                <img src="/yes-button.png" alt="Sí" />
              </button>

              <button
                className="no-button"
                style={{ left: buttonPosition.noX, top: buttonPosition.noY }}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
              >
                <img src="/no-button.png" alt="No" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Confetti width={windowSize.width} height={windowSize.height} />
            <div className="gif-container">
              <img src="/tenor.gif" alt="¡Feliz San Valentín!" className="gif-image" />
            </div>
            <div className="success-message">¡YEIII! Te ganaste un San Valentín Especial ¡TE AMO MI AMOR! ❤️🤍</div>
          </>
        )}
        <button onClick={toggleAudio} className="audio-toggle">
          {isPlaying ? "Pausar Música" : "Reproducir Música"}
        </button>
      </div>
    </div>
  )
}

export default App

