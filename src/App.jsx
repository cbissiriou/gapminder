

import './App.css'
import Bubbleplot from './gdp'

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>Gapminder Overview</h1>
          <p>
            world GDP
          </p>
          <Bubbleplot />
        </div>
      </section>
     

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
