const sketch = document.querySelector('#sketch')
const generateButton = document.querySelector('#generateButton')
const clearButton = document.querySelector('#clearButton')
const gridButton = document.querySelector('#gridButton')
const eraseButton = document.querySelector('#eraseButton')

let gridShown = false
let eraseMode = false
const squares = []

generateButton.onclick = () => handleGenerateButton()
clearButton.onclick = () => handleClearButton()
gridButton.onclick = () => handleGridButton()
eraseButton.onclick = () => handleEraseButton()

function generateSquares(num) {
  sketch.innerHTML = ''

  for (let i = 0; i < num**2; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    toggleDrawMode(square, true)
    squares.push(square)
    sketch.appendChild(square)
  }

  // Newly rendered squares have border through css rule
  gridShown = true
  gridButton.textContent = 'Hide grid'
}

function handleClearButton() {
  document.querySelectorAll('.selected').forEach(s => s.classList.remove('selected'))
}

function handleEraseButton() {
  eraseMode = !eraseMode
  squares.forEach(square => toggleDrawMode(square, !eraseMode))
  eraseButton.textContent = eraseMode ? "Draw Mode" : "Erase Mode"
}

function handleGenerateButton() {
  let ns = prompt('Enter number of squares per axis (max 100)')
  ns = parseInt(ns)
  if(isNaN(ns) ) return
  if(ns > 100) ns = 100

  generateSquares(
    ns,
    sketch.style.gridTemplateRows = `repeat(${ns}, 1fr)`,
    sketch.style.gridTemplateColumns = `repeat(${ns}, 1fr)`
  )
}

function handleGridButton() {
  if(gridShown) {
    squares.forEach(s => s.style.border = `none`)
  } else {
    squares.forEach(s => s.style.border = `.25px solid #FFF`)
  }
  gridShown = !gridShown
  gridButton.textContent = gridShown ? 'Hide grid' : 'Show grid'
}

function toggleDrawMode(square, isDraw) {
  if(isDraw)square.addEventListener('mouseover', e =>e.target.classList.add('selected'))
  else square.addEventListener('mouseover', e =>e.target.classList.remove('selected'))
}
