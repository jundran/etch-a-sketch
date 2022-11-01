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
let colourMode = true

/* KEYBOARD EVENT LISTENERS */
document.addEventListener('keydown', e => {
  if(e.code === 'ControlLeft') doNotDrawKey = true
})

document.addEventListener('keyup', e => {
  if(e.code === 'ControlLeft') doNotDrawKey = false
})

/* BUTTON EVENT LISTENERS */
generateButton.onclick = () => handleGenerateButton()
colourButton.onclick = () => handleColourButton()
clearButton.onclick = () => handleClearButton()
gridButton.onclick = () => handleGridButton()
eraseButton.onclick = () => handleEraseButton()

/* FUNCTIONS */
function handleClearButton() {
  // Note different argument syntax for querySelectorAll and classList remove
  document.querySelectorAll('.plain, .coloured').forEach(s => {
    clearColourAttributes(s)
  })
  // Ensure sketch is in draw mode after clearing grid
  setDrawMode(true)
}

function handleColourButton() {
  colourMode = !colourMode
  colourButton.textContent = colourMode ? 'Plain mode' : 'Colour Mode'
}

function handleEraseButton() {
  setDrawMode() // don't pass arg to toggle
}

function handleGenerateButton() {
  const userInput = prompt('Enter number of squares per axis (max 100)')
  let parsedNumber = parseInt(userInput)
  if(isNaN(parsedNumber) ) return
  if(parsedNumber > 100) parsedNumber = 100

  sketch.innerHTML = ''
  setDrawMode(true)
  sketch.style.gridTemplateRows = `repeat(${parsedNumber}, 1fr)`,
  sketch.style.gridTemplateColumns = `repeat(${parsedNumber}, 1fr)`

  for (let i = 0; i < parsedNumber ** 2; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    setDrawModeListeners(square)
    squares.push(square)
    sketch.appendChild(square)
  }

  // Newly rendered squares have border through css rule
  gridShown = true
  gridButton.textContent = 'Hide grid'
}

function handleGridButton() {
  if(gridShown) squares.forEach(s => s.style.border = `none`)
  else squares.forEach(s => s.style.border = `.25px solid #FFF`)

  gridShown = !gridShown
  gridButton.textContent = gridShown ? 'Hide grid' : 'Show grid'
}

function setDrawMode(mode = !drawMode) {
  const currentDrawMode = drawMode
  drawMode = mode
  eraseButton.textContent = drawMode ? "Erase Mode" : "Draw Mode"
  if(currentDrawMode !== drawMode) squares.forEach(square => setDrawModeListeners(square))
}

function getRGBColourString(e, getNewColour) {
  if(getNewColour) {
    const newColour = []
    for (let i = 0; i < 3; i++) {
      newColour.push(Math.floor(Math.random() * 256)) // 0 - 255
    }
    e.target.setAttribute('data-originalColour', newColour)
    const [r,g,b] = [...newColour]
    return `rgb(${r}, ${g}, ${b})`
  }
  else {
    // If square already has a colour then return this colour but 10% darker
    const original = e.target.getAttribute('data-originalColour').split(',')
    const current = e.target.style.backgroundColor.split(/(rgb\()|[,)]/g).filter(e => e && e.match(/[\d]/g))
    const tenPercent = original.map(value => Math.ceil(value * .1))
    const reduced = current.map((value, i) => {
      const reducedValue = value - tenPercent[i]
      return reducedValue < 0 ? 0 : reducedValue
    })

    // If all colour has been stripped then return null else darkened colour
    if(reduced.filter(colour => colour === 0).length === 3) {
      return null
    }
    else {
      const [r,b,g] = [...reduced]
      return `rgb(${r}, ${b}, ${g})`
    }
  }
}

function colourSquare(e) {
  // Modify current colour
  if([...e.target.classList].includes('coloured')) {
    const modifiedColour = getRGBColourString(e, false)
    e.target.style.backgroundColor = modifiedColour
    if(!modifiedColour) clearColourAttributes(e.target)
  }
  // Get new colour
  else {
    // ".coloured" is just an empty class to mark the square as
    // coloured but the actualy colour is set by getRGBColourString()
    e.target.classList.remove('plain') // may or may not be set
    e.target.classList.add('coloured')
    e.target.style.backgroundColor = getRGBColourString(e, true)
  }
}

function applyPlainColour(e) {
  // Must clear any existing background colour to make adding plain class take effect
  clearColourAttributes(e.target)
  e.target.classList.add('plain')
}

function clearColourAttributes(target) {
  target.classList.remove('plain', 'coloured')
  target.setAttribute('data-originalColour', null)
  target.style.backgroundColor = null
}

const drawEventCallback = e => {
  if (doNotDrawKey) return
  if (colourMode) colourSquare(e)
  else applyPlainColour(e)
}

const eraseEventCallback = e => {
  if (doNotDrawKey) return
  clearColourAttributes(e.target)
}

function setDrawModeListeners(square) {
  if(drawMode) {
    square.removeEventListener('mouseover', eraseEventCallback)
    square.addEventListener('mouseover', drawEventCallback)
  }
  else {
    square.removeEventListener('mouseover', drawEventCallback)
    square.addEventListener('mouseover', eraseEventCallback)
  }
}
