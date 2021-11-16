// ==UserScript==
// @name     Anime 365 Advanced Player
// @version  1
// @grant    none
// @include https://smotret-anime.online/*
// ==/UserScript==

let interval, timeout, finalInterval, mouseTimeout, playerDocument
let toggled = localStorage.getItem('smotretAnime') == 'true'

const startButton = document.createElement('button')
startButton.innerText = 'Начать Просмотр'
startButton.style = 'width: 400px; height: 40px; text-align: center; line-height: 40px; background: rgba(0,0,0,.8); color: white; border: 1px solid white; position: fixed; left: 20px; bottom: 20px; z-index: 10000;'
if (!toggled) document.querySelector('body').appendChild(startButton)
        
startButton.onclick = () => {
  startButton.remove()
  
  toggled = true
  localStorage.setItem('smotretAnime', toggled)
  
  start()
}

const stopButton = document.createElement('button')
stopButton.innerText = 'X'
stopButton.style = 'width: 40px; height: 40px; text-align: center; line-height: 40px; background: rgba(0,0,0,.8); color: white; border: 1px solid white; position: fixed; right: 20px; top: 40px; z-index: 10000;'
stopButton.onclick = () => {
  stopButton.remove()
  
  toggled = false
  localStorage.setItem('smotretAnime', toggled)

  document.querySelector('body').appendChild(startButton)
  playerDocument.querySelector('video').pause()
  
  start()

  clearTimeout(mouseTimeout)
  playerDocument.querySelector('.vjs-control-bar').style = ''
}

document.querySelector('iframe').onload = () => {
  start()
  const data = JSON.parse(localStorage.getItem('rememberedTime'))

  if (location == data.location) playerDocument.querySelector('video').currentTime = data.currentTime
}

function mousemoveHandler(e) {
  if (!playerDocument) return

  const controlBar = playerDocument.querySelector('.vjs-control-bar')

  controlBar.style = 'transform: translateY(-78px);'
  playerDocument.querySelector('body').appendChild(stopButton)

  clearTimeout(mouseTimeout)

  mouseTimeout = setTimeout(() => {
    controlBar.style = ''
    stopButton.remove()
  }, 3000)
}

function keyupHandler (e) {
  if (!playerDocument) return

  const media = playerDocument.querySelector('video')

  if (e.code == 'ArrowLeft') {
    media.currentTime -= 5

    const controlBar = playerDocument.querySelector('.vjs-control-bar')

    controlBar.style = 'transform: translateY(-78px);'
    playerDocument.querySelector('body').appendChild(stopButton)

    clearTimeout(mouseTimeout)

    mouseTimeout = setTimeout(() => {
      controlBar.style = ''
      stopButton.remove()
    }, 3000)
  }
  if (e.code == 'ArrowRight') {
    media.currentTime += 5

    const controlBar = playerDocument.querySelector('.vjs-control-bar')

    controlBar.style = 'transform: translateY(-78px);'
    playerDocument.querySelector('body').appendChild(stopButton)

    clearTimeout(mouseTimeout)

    mouseTimeout = setTimeout(() => {
      controlBar.style = ''
      stopButton.remove()
    }, 3000)
  }
  if (e.code == 'Escape') {
    toggled = false
    localStorage.setItem('smotretAnime', toggled)

    document.querySelector('body').appendChild(startButton)
    media.pause()

    start()

    clearTimeout(mouseTimeout)
    playerDocument.querySelector('.vjs-control-bar').style = ''
  }
  if (e.code == 'Space') {
    if (media.paused) media.play()
    else media.pause()
  }
}

function start() {
  setTimeout(() => {
		clearTimeout(timeout)
  	clearInterval(interval)
  	clearInterval(finalInterval)
    stopButton.remove()
    if (playerDocument) playerDocument.removeEventListener('mousemove', mousemoveHandler)

		if (!toggled) {
			document.querySelector('.video-container').style = ''
			document.querySelector('html').style = ''

			return
		}
  
    playerDocument = document.querySelector('iframe').contentWindow.document

    playerDocument.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('keyup', keyupHandler)

    document.querySelector('.video-container').style = 'position: fixed; top: 0; transform: translateY(-40px); left: 0; width: 100vw; height: 100vh; z-index: 1000;'
    document.querySelector('html').style = 'overflow: hidden; height: 100vh'
    playerDocument.querySelector('.vjs-big-play-button').click()
    
    interval = setInterval(() => {
      const data = JSON.stringify({ location, currentTime: playerDocument.querySelector('video').currentTime })
      localStorage.setItem('rememberedTime', data)

      const progress = +playerDocument.querySelector('.vjs-play-progress').style.width.match(/[0-9\.]{0,}/)[0]
      const nextLoc = document.querySelectorAll('a.waves-effect.waves-light.btn.orange.accent-4.white-text')[1].href

      if (progress >= 93) {
        clearInterval(interval)

        timeout = setTimeout(() => {
          location = nextLoc
        }, 10000)

        const button = playerDocument.createElement('button')
        button.innerText = 'Отменить переключение'
        button.style = 'width: 400px; height: 40px; text-align: center; line-height: 40px; background: rgba(0,0,0,.4); color: white; border: 1px solid white; position: absolute; left: 20px; top: 80px;'
        button.onclick = () => {
          playerDocument.querySelector('body').removeChild(button)
          clearTimeout(timeout)
        }

        playerDocument.querySelector('body').appendChild(button)
      }
    }, 1000)

    finalInterval = setInterval(() => {
      const progress = +playerDocument.querySelector('.vjs-play-progress').style.width.match(/[0-9\.]{0,}/)[0]
      const nextLoc = document.querySelectorAll('a.waves-effect.waves-light.btn.orange.accent-4.white-text')[1].href

      if (progress >= 99.9) {
        clearInterval(finalInterval)

        location = nextLoc
      }
    })
  }, 1000)
}