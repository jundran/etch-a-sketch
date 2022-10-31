const sketch = document.querySelector('.sketch')
const numSquaresButton = document.querySelector('#numSquaresButton')

numSquaresButton.onclick = () => {
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
}


