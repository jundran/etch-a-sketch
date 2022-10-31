const sketch = document.querySelector('#sketch')
const generateButton = document.querySelector('#generateButton')
const clearButton = document.querySelector('#clearButton')
const gridButton = document.querySelector('#gridButton')
const eraseButton = document.querySelector('#eraseButton')

let gridShown = false

generateButton.onclick = () => handleGenerateSquares()
clearButton.onclick = () => clearCanvas()
gridButton.onclick = () => handleGridButton()
eraseButton.onclick = () => handleEraseButton()

function generateSquares(num) {
  sketch.innerHTML = ""

  for (let i = 0; i < num**2; i++) {
    const square = document.createElement('div')
    square.classList.add("square")
    
    square.addEventListener('mouseover', e =>
      e.target.classList.add('selected')
    )
    sketch.appendChild(square)
  }

  // Newly rendered squares have border through css rule
  gridShown = true
  gridButton.textContent = 'Hide grid'
}

function handleGenerateSquares() {
  let ns = prompt("Enter number of squares per row / column (max 100)")
  ns = parseInt(ns)
  if(isNaN(ns) ) return
  if(ns > 100) ns = 100
  console.log(typeof ns, ns)

  generateSquares(
    ns,
    sketch.style.gridTemplateRows = `repeat(${ns}, 1fr)`,
    sketch.style.gridTemplateColumns = `repeat(${ns}, 1fr)`
  )
}

function clearCanvas() {
  document.querySelectorAll('.selected').forEach(s => s.classList.remove('selected'))
}

function handleGridButton() {
  if(gridShown) {
    document.querySelectorAll('.square').forEach(s => s.style.border = `none`)
  } else {
    document.querySelectorAll('.square').forEach(s => s.style.border = `.25px solid #FFF`)
  }
  gridShown = !gridShown
  gridButton.textContent = gridShown ? 'Hide grid' : 'Show grid'
}

function handleEraseButton() {

}