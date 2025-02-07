"use client"

import { useState, useEffect, useRef } from "react"
import Confetti from "react-confetti"
import "./App.css"
import backgroundImage from "./background.jpg"

function App() {
  const [buttonPosition, setButtonPosition] = useState({
    yesX: window.innerWidth / 2 - 250,
    yesY: window.innerHeight / 2 - 350,
    noX: window.innerWidth / 2 + 50,
    noY: window.innerHeight / 2 - 350,
  });

  const [yesPressed, setYesPressed] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    const audioElement = new Audio("/background-music.mp3")
    audioElement.loop = true
    audioRef.current = audioElement

    const playAudio = async () => {
      try {
        await audioElement.play()
        setIsPlaying(true)
      } catch (error) {
        console.log("Autoplay prevented:", error)
        setupWebAudio()
      }
    }

    audioElement.addEventListener("canplaythrough", playAudio)
    playAudio(); // Inicia la música al cargar

    return () => {
      window.removeEventListener("resize", handleResize)
      audioElement.removeEventListener("canplaythrough", playAudio)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const setupWebAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    fetch("/background-music.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)
        source.loop = true
        source.start()
        setIsPlaying(true)
      })
      .catch((error) => console.log("Error setting up Web Audio:", error))
  }

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause()
      if (audioContextRef.current) {
        audioContextRef.current.suspend()
      }
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log("Playback failed:", error)
            if (audioContextRef.current) {
              audioContextRef.current.resume()
            } else {
              setupWebAudio()
            }
          })
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleNoHover = () => {
    const buttonWidth = 500;
    const buttonHeight = 500;
    const padding = 10;

    const newX = Math.max(
      padding,
      Math.min(window.innerWidth - buttonWidth - padding, Math.random() * (window.innerWidth - buttonWidth))
    );

    const newY = Math.max(
      padding,
      Math.min(window.innerHeight - buttonHeight - padding, Math.random() * (window.innerHeight - buttonHeight))
    );

    setButtonPosition((prev) => ({
      ...prev,
      noX: newX,
      noY: newY,
    }));
  };

  const handleYesClick = () => {
    setYesPressed(true)
  }

  return (
    <div
      className="App"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <header className="App-header">
        {!yesPressed ? (
          <>
            <h1>Can I be your Valentine?</h1>
            <div className="button-container">
              <button
                className="yes-button"
                style={{ position: "absolute", left: buttonPosition.yesX, top: buttonPosition.yesY }}
                onClick={handleYesClick}
              >
                <img src="/yes-button.png" alt="Sí" />
              </button>

              <button
                className="no-button"
                style={{ position: "absolute", left: buttonPosition.noX, top: buttonPosition.noY }}
                onMouseEnter={handleNoHover}
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
      </header>
    </div>
  )
}

export default App;
