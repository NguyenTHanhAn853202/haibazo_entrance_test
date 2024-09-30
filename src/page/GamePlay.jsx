import { useEffect, useMemo, useRef, useState } from "react"
import '../style/gamePlay.css'
function GamePlay() {
  const [time,setTime] = useState(0)
  const [points,setPoints] = useState('')
  const [sizeGamePlay,setSizeGamePlay] = useState({width: 0, height: 0})
  const [arrDisplay,setArrDisplay] = useState([])
  const gamePlayRef = useRef()
  const [numberPoints,setNumberPoints] = useState(0)
  let [idInterval,setIdInterval] = useState('')
  const [win,setWin] = useState(false)

  useEffect(()=>{
    const height = gamePlayRef.current.clientHeight - 35
    const width = gamePlayRef.current.clientWidth - 35
    setSizeGamePlay({width, height})
  },[])

  const handleClickPoint = (e)=>{
    const value = e.target.value*1 
    if(numberPoints + 1 === value){
      e.target.classList.add('hidden')
      setTimeout(()=>{
        e.target.style.display = 'none'
      },300)
      setNumberPoints(numberPoints+1)
      if(numberPoints + 1 === points){
        clearInterval(idInterval)
        setWin(true)
        setNumberPoints(0)
      }
    }
  }

  const handleChangePoint = (e) => {
    const value = e.target.value*1
      value && setPoints(value)
    value === 0 && setPoints('')
  }

  const handleStartGame = ()=>{
    setArrDisplay([])
    clearInterval(idInterval)
    setTime(0)
    setNumberPoints(0)
    setWin(false)
    if(!points){
      alert('Vui long nhap so diem!')
      return
    }
    for(let i=0; i<points; i++) {
      const randX = Math.random()*sizeGamePlay.width
      const randY = Math.random() * sizeGamePlay.height
      const positionX =randX<0?0:randX
      const positionY = randY< 0?0:randY
      setArrDisplay((props)=>[...props,
        {top:positionY,left:positionX,id:Math.floor(Math.random()*10000) +positionX+ positionY}])
    }
    let id = setInterval(()=>{
      setTime((pre)=>pre+0.1)
    },100)
    setIdInterval(id)
  }

  
  return (
    <div className="container">
      <div className="backgroud__game">
          <div><h3 style={{color:win?'green':'black'}}>{win?"ALL CLEARED":`Let's Play`}</h3>
          <p style={{display:'inline-block'}}>Points:</p>
          <input onChange={handleChangePoint} value={points}  className='backgroud__game--input' type="text"  />
          <div></div>
          <p style={{display:'inline-block'}}>Time:</p>
          <span>{time.toFixed(1)}</span>
          <button onClick={handleStartGame}>Restart</button></div>
          <div ref={gamePlayRef} className="game-play">
              {arrDisplay.map((item,index)=> {             
                const zIndex = arrDisplay.length - index
                return <button 
                    onClick={handleClickPoint} 
                    style={{top:`${item.top}px`,left:`${item.left}px`,zIndex:zIndex}} 
                    className='point' 
                    value={index+1} 
                    key={item.id}
                >{index+1}</button>
              })}
          </div>
      </div>
    </div>
  );
}

export default GamePlay;
