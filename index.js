
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score')

    const width = 10;
    let count = 0;
    let score = 0
    // for(let i=0;i<200;i++){
    //   squares[i].textContent = count;
    //   count++;
    // }

    const rotateBtn = document.getElementById('rotate');
    const leftBtn  = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const downBtn = document.getElementById('down');


    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]
    
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let CurrentPosition = 4;
    let CurrentRotation = 0;
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let Current = theTetrominoes[random][CurrentRotation];

    function draw(){
          Current.forEach(index =>{
              squares[CurrentPosition+index].classList.add('tetromino');
          })
    }

    function undraw(){
        Current.forEach(index =>{
            squares[CurrentPosition+index].classList.remove('tetromino');
        })
  }

  function control(e) {
    if(e.keyCode === 37) {
      moveleft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      move()
    }
  }

  
leftBtn.addEventListener("click",moveleft)
rightBtn.addEventListener("click",moveRight)
rotateBtn.addEventListener("click",rotate)
downBtn.addEventListener("click",move)

  document.addEventListener('keyup', control)
  timerId = setInterval(move,1000);

  

    function move(){
        undraw();
        CurrentPosition += width;
        draw();
        freeze();
    }


    function freeze() {
        if(Current.some(index => squares[CurrentPosition + index + width].classList.contains('taken'))) {
          Current.forEach(index => squares[CurrentPosition + index].classList.add('taken'))
          //start a new tetromino falling
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          random = nextRandom
          Current = theTetrominoes[random][CurrentRotation]
          CurrentPosition = 4
          draw()
          add_score()
          gameOver()
        }
      }

    function moveleft(){
        undraw()
        const left = Current.some(index => (CurrentPosition+index)%width === 0)

        if(!left) CurrentPosition -= 1;

        if(Current.some(index => squares[CurrentPosition + index].classList.contains('taken'))) {
            CurrentPosition +=1
          }

        draw();
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = Current.some(index => (CurrentPosition + index) % width === width -1)
        if(!isAtRightEdge) CurrentPosition +=1
        if(Current.some(index => squares[CurrentPosition + index].classList.contains('taken'))) {
          CurrentPosition -=1
        }
        draw()
      }

    function isAtRight() {
        return Current.some(index=> (CurrentPosition + index + 1) % width === 0)  
      }
      
    function isAtLeft() {
        return Current.some(index=> (CurrentPosition + index) % width === 0)
      }
      
    function checkRotatedPosition(P){
        P = P || CurrentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            CurrentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            CurrentPosition -= 1
          checkRotatedPosition(P)
          }
        }
    }

    function checkpiece(){
      if(Current.some(index => squares[CurrentPosition + index+width].classList.contains('taken'))){
        return true;
      }
      else if(Current.some(index => squares[CurrentPosition + index+width+width].classList.contains('taken'))){
        return true;
      }
      else if(Current.some(index => squares[CurrentPosition + index+1].classList.contains('taken'))){
        return true;
      }
      else if(Current.some(index => squares[CurrentPosition + index+-1].classList.contains('taken'))){
        return true;
      }
      else if(Current.some(index => squares[CurrentPosition + index+2].classList.contains('taken'))){
        return true;
      }
      else if(Current.some(index => squares[CurrentPosition + index+-2].classList.contains('taken'))){
        return true;
      }
    }

    function rotate(){
        if(!checkpiece()){
        undraw();
        CurrentRotation ++;
        if(CurrentRotation === Current.length) CurrentRotation =0;
        Current = theTetrominoes[random][CurrentRotation];
        checkRotatedPosition();
        draw();
        }
    }

    function add_score(){
      for (let i=0;i<199;i+=width){
        const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];

        if(row.every(index => squares[index].classList.contains('taken'))){
          score +=10;
          scoreDisplay.innerHTML = score;
          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino');
          })
          const squaresRemoved = squares.splice(i,width);
          squares = squaresRemoved.concat(squares);
          squares.forEach(cell => grid.appendChild(cell));
          console.log(squaresRemoved)
        }
      }
    }
     
    function gameOver() {
      if(Current.some(index => squares[CurrentPosition + index].classList.contains('taken'))) {
        clearInterval(timerId)
        document.querySelector(".grid").style.filter = 'blur(5px)';
        document.querySelector(".buttons").style.filter = 'blur(5px)';
        document.querySelector(".result").style.display = 'block';
      }
    }

function reload(){
  location.reload();
}
    


    