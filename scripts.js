document.addEventListener('DOMContentLoaded', function () {
  const car = document.querySelector('.car')
  let position = -200
  const screenWidth = window.innerWidth

  function animateCar() {
    if (position < screenWidth) {
      position += 2
      car.style.left = position + 'px'
      requestAnimationFrame(animateCar)
    } else {
      position = -200
      car.style.left = position + 'px'
      requestAnimationFrame(animateCar)
    }
  }

  animateCar()

  const grid = document.querySelector('.grid')
  let opacity = 0.5
  let increasing = true

  function animateGrid() {
    if (increasing) {
      opacity += 0.01
      if (opacity >= 0.7) increasing = false
    } else {
      opacity -= 0.01
      if (opacity <= 0.3) increasing = true
    }
    grid.style.opacity = opacity
    requestAnimationFrame(animateGrid)
  }

  animateGrid()
})
