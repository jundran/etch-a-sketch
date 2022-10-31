/* DOM ELEMENTS */
const sketch = document.querySelector('#sketch')
const generateButton = document.querySelector('#generateButton')
const colourButton = document.querySelector('#colourButton')
const clearButton = document.querySelector('#clearButton')
const gridButton = document.querySelector('#gridButton')
const eraseButton = document.querySelector('#eraseButton')
const squares = []

/* STATE VARIABLES */
let gridShown = false
let drawMode = true
let doNotDrawKey = false

/* KEYBOARD EVENT LISTENERS */
document.addEventListener('keydown', e => {
  if(e.code === 'ControlLeft') doNotDrawKey = true
})

document.addEventListener('keyup', e => {
  if(e.code === 'ControlLeft') doNotDrawKey = false
})

/* BUTTON EVENT LISTENERS */
generateButton.onclick = () => handleGenerateButton()
clearButton.onclick = () => handleClearButton()
gridButton.onclick = () => handleGridButton()
eraseButton.onclick = () => handleEraseButton()
colourButton.onclick = () => handleColourButton()

/* FUNCTIONS */
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
  if(!drawMode) {
    setDrawMode(true)
    squares.forEach(square => toggleDrawMode(square))
  }
}

function handleColourButton() {

}

function handleEraseButton() {
  setDrawMode() // don't pass arg to toggle
  squares.forEach(square => toggleDrawMode(square))
}

function handleGenerateButton() {
  let ns = prompt('Enter number of squares per axis (max 100)')
  ns = parseInt(ns)
  if(isNaN(ns) ) return
  if(ns > 100) ns = 100

  setDrawMode(true)

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

function setDrawMode(mode = !drawMode) {
  drawMode = mode
  eraseButton.textContent = drawMode ? "Erase Mode" : "Draw Mode"
}

function toggleDrawMode(square) {
  if(drawMode)square.addEventListener('mouseover', e =>
    !doNotDrawKey && e.target.classList.add('selected')
  )
  else square.addEventListener('mouseover', e =>
    !doNotDrawKey && e.target.classList.remove('selected')
  )
}
