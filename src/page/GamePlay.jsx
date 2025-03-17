import { useEffect, useRef, useState } from "react"
import '../style/gamePlay.css'

const timeCountcown = 3000 //3s

function GamePlay() {
  const [time,setTime] = useState(0)
  const [points,setPoints] = useState(5)
  const [sizeGamePlay,setSizeGamePlay] = useState({width: 0, height: 0})
  const [arrDisplay,setArrDisplay] = useState([])
  const gamePlayRef = useRef()
  const [numberPoints,setNumberPoints] = useState(0)
  let [idInterval,setIdInterval] = useState('')
  const [win,setWin] = useState(false)
  const [error,setError] = useState(false)
  const [auto,setAuto] = useState(false)
  const [intervalId,setIntervalId]= useState([])

  useEffect(()=>{
    const height = gamePlayRef.current.clientHeight - 35
    const width = gamePlayRef.current.clientWidth - 35
    setSizeGamePlay({width, height})
  },[])


  const handleClickPoint = (e)=>{
    const element = e.currentTarget
    const value = element.value*1 
    if(numberPoints + 1 === value){
      setNumberPoints(numberPoints+1)
      element.classList.add('hidden')
      let newArrDisplay = [...arrDisplay]
      let id = setInterval(()=>{
        if(newArrDisplay[value-1].countdown>0){
          newArrDisplay[value-1].countdown = newArrDisplay[value-1].countdown - 100 
          setArrDisplay(newArrDisplay)
        }
        else{
          clearInterval(id)
        }
      },100)
      setIntervalId(prev=>[...prev,id])
      setTimeout(()=>{
        element.style.display = 'none'
      },timeCountcown)
      if(numberPoints + 1 === points){
        clearInterval(idInterval)
        setWin(true)
        setNumberPoints(0)
      }
    }
    else{
      setError(true)
      clearInterval(idInterval)
      setAuto(false)
     
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
    setError(false)
    setNumberPoints(0)
    setAuto(false)
    setWin(false)
    intervalId.forEach(clearInterval)
    if(!points){
      alert('Vui long nhap so diem!')
      return
    }
    for(let i=0; i<points; i++) {
      const randX = Math.random()*sizeGamePlay.width - 5 
      const randY = Math.random() * sizeGamePlay.height - 5
      const positionX =randX<0?0:randX
      const positionY = randY< 0?0:randY
      setArrDisplay((prev)=>([...prev,{top:positionY,left:positionX,id:Math.floor(Math.random()*10000) +positionX+ positionY,countdown:timeCountcown}]))
    }
    let id = setInterval(()=>{
      setTime((pre)=>pre+0.1)
    },100)
    setIdInterval(id)
  }

  useEffect(()=>{
    let id;
    let number = numberPoints;
    if(auto){
      const buttons = gamePlayRef.current.querySelectorAll("button")
      id = setInterval(()=>{
        console.log(number);
        buttons.forEach((item,index)=>{
          if(number + 1 === item.value*1){
            item.click()
          }
        })
        number++
      },[1000])
    }
    else{
      clearInterval(id)
    }
    
   return ()=>{
    clearInterval(id)
  }
  },[auto])

  return (
    <div className="container">
      <div className="backgroud__game">
          <div>
            {!error && <h3 style={{color:win?'green':'black'}}>{win?"ALL CLEARED":`Let's Play`}</h3>}
            {error && <h3 style={{color:'red'}}>Game Over</h3>}
            <p style={{display:'inline-block'}}>Points:</p>
            <input onChange={handleChangePoint} value={points}  className='backgroud__game--input' type="text"  />
            <div>
              <p style={{display:'inline-block'}}>Time:</p>
              <span>{time.toFixed(1)}</span>
            </div>
            <div style={{display:"flex",gap:"5px"}}>
              <button onClick={handleStartGame}>Restart</button>
              {(time>0 && !win && !error) && <button onClick={()=>setAuto(!auto)}>Auto Play {auto?"ON":"OFF"}</button>}
            </div>
          </div>
          <div ref={gamePlayRef} className="game-play">
              {arrDisplay.map((item,index)=> {             
                const zIndex = arrDisplay.length - index                
                return <button 
                    onClick={handleClickPoint} 
                    style={{top:`${item.top}px`,left:`${item.left}px`,zIndex:zIndex}} 
                    className='point' 
                    value={index+1} 
                    key={item.id}
                >
                  {index+1} 
                  <span style={{display:item.countdown===timeCountcown?"none":"block"}} value={index+1}>{(item.countdown/1000).toFixed(1)}s</span>
                </button>
              })}
          </div>
      </div>
    </div>
  );
}

export default GamePlay;
