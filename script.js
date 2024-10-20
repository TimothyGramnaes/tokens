window.addEventListener('load', startPage);

/**
 * Page starter on load
 */
function startPage() {
    console.log('So you are reading the log, huh?');
    activateHamburger();

}


/**
 * Dice roll on header
 */
function rollDice() {
   // const image = document.createElement('img');
    
    const die = document.getElementById("die");
    let d1 = Math.floor(Math.random() * 6) +1;
    if (d1 == 1) {
            die.innerHTML = '<img src="./imgs/dice/1.png" alt="" srcset="">';
        //image.src = './imgs/dice/1.png';
        }
        if (d1 == 2) {
            die.innerHTML = '<img src="./imgs/dice/2.png" alt="" srcset="">';
          // image.src = './imgs/dice/2.png';
        }
        if (d1 == 3) {
            die.innerHTML = '<img src="./imgs/dice/3.png" alt="" srcset="">';
           // image.src = './imgs/dice/3.png';
        }
        if (d1 == 4) {
            die.innerHTML = '<img src="./imgs/dice/4.png" alt="" srcset="">';
        }
        if (d1 == 5) {
            die.innerHTML = '<img src="./imgs/dice/5.png" alt="" srcset="">';
        }
        if (d1 == 6) {
            die.innerHTML = '<img src="./imgs/dice/6.png" alt="" srcset="">';
        }
       // die.innerHTML = ""
      //  die.append(image)

}

/**
 * Hamburger-menu
 */
function activateHamburger() {
    const ham = document.querySelector("#hamButton");
    ham.addEventListener('click', toggleHamburger);

}

function toggleHamburger() {

    const navbar = document.querySelector(".navbar");

    navbar.classList.toggle("showNav");
    navbar.classList.toggle("closeNav");

}

