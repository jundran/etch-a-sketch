const container = document.querySelector('.container')

const squares = []

for (let i = 0; i < 16; i++) {
  const square = document.createElement('div')
  square.classList.add("square")
  squares.push(square)
  container.appendChild(square)
}