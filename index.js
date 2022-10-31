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

function getColour(existingColour) {
  if(existingColour) {
    const RGB_TEN_PERCENT = Math.ceil(256 / 10)
    const x = existingColour.split(/(rgb\()|[,)]/g)

    // Darken by 10%
    const reduced = [x[2],x[4],x[6]].map(colour => {
      let c = Math.floor(colour - RGB_TEN_PERCENT)
      return c < 0 ? 0 : c
    })

    // If all colour has been stripped then return null else darkened colour
    if(reduced.filter(colour => colour === 0).length === 3) return null
    else return `rgb(${reduced})`
  }
  else {
    const newColour = []
    for (let i = 0; i < 3; i++) {
      newColour.push(Math.floor(Math.random()* 255))
    }
    const [r,g,b] = [...newColour]
    return  `rgb(${r}, ${g}, ${b})`
  }
}

function handleClearButton() {
  document.querySelectorAll('.selected').forEach(s => {
    s.classList.remove('selected', 'coloured')
    s.style.backgroundColor = 'black'
  })

  if(!drawMode) {
    setDrawMode(true)
    squares.forEach(square => toggleDrawMode(square))
  }
}

function handleColourButton() {
  colourMode = !colourMode
  colourButton.textContent = colourMode ? 'Plain mode' : 'Colour Mode'
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

function colourSquare(e) {
  if([...e.target.classList].includes('coloured')) {
    const newColour = getColour(e.target.style.backgroundColor)
    if(newColour) {
      e.target.style.backgroundColor = newColour
    } 
    else {
      e.target.style.backgroundColor = "black"
      e.target.classList.remove('coloured')
      e.target.classList.remove('selected')
    }
  } else {
    e.target.classList.add('coloured')
    e.target.style.backgroundColor = getColour()
  }
}

function toggleDrawMode(square) {
  if(drawMode)square.addEventListener('mouseover', e => {
    if(!doNotDrawKey) {
      e.target.classList.add('selected')
      if(colourMode) colourSquare(e)
    }
  })
  else square.addEventListener('mouseover', e => {
    if(!doNotDrawKey) {
      e.target.classList.remove('selected', 'coloured')
      e.target.style.backgroundColor = 'black'
    }
  })
}
