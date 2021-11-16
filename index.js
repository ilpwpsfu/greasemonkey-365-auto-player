// ==UserScript==
// @name     Anime 365 Advanced Player
// @version  1
// @grant    none
// @include https://smotret-anime.online/*
// ==/UserScript==


let interval, timeout
const func = () => {
  setTimeout(() => {
    console.log('autoplay loaded')
		if (!toggled) {
			document.querySelector('.video-container').style = ''
			document.querySelector('html').style = ''

			return
		}
  
		clearTimeout(timeout)
  	clearInterval(interval)
  	const playerDocument = document.querySelector('iframe').contentWindow.document

    document.querySelector('.video-container').style = 'position: fixed; top: 0; transform: translateY(-40px); left: 0; width: 100vw; height: 100vh; z-index: 1000;'
    document.querySelector('html').style = 'overflow: hidden; height: 100vh'
    playerDocument.querySelector('.vjs-big-play-button').click()
    
    interval = setInterval(() => {
      const progress = +playerDocument.querySelector('.vjs-play-progress').style.width.match(/[0-9\.]{0,}/)[0]
      const nextLoc = document.querySelectorAll('a.waves-effect.waves-light.btn.orange.accent-4.white-text')[1].href
      console.log(progress)

      if (progress >= 93) {
        clearInterval(interval)

        timeout = setTimeout(() => {
          location = nextLoc
        }, 10000)

        const button = playerDocument.createElement('button')
        button.innerText = 'Отменить переключение'
        button.style = 'width: 400px; height: 40px; text-align: center; line-height: 40px; background: rgba(0,0,0,.4); color: white; border: 1px solid white; position: absolute; left: 20px; top: 80px;'
        playerDocument.querySelector('body').appendChild(button)
        
        button.onclick = () => {
          playerDocument.querySelector('body').removeChild(button)
          clearTimeout(timeout)
        }
      }
    })
  }, 0)
}
let toggled = localStorage.getItem('smotretAnime') == 'true'
console.log('autoplay', toggled)

document.addEventListener('keyup', e => {
  if (e.code == 'KeyO') {
    toggled = !toggled
    localStorage.setItem('smotretAnime', toggled)

    console.log(toggled, 'pressed')

		func()
  }
})

document.querySelector('iframe').onload = func

