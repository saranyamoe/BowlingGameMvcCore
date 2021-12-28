class Bowling {
    gameElement;
    randomNumber: any;
    strike: boolean;
    spare: boolean;
    nextFrame: boolean;
    tempPins: any[];
    frameList: any[];
    frameCount: number;
    lastFrame: number;
    lastFrameStrike: boolean;
    lastFrameSpare: boolean;
    score: number;
   
    constructor(element) {
        this.gameElement = element;
        this.randomNumber;
        this.strike = false;
        this.spare = false;
        this.nextFrame = false;
        this.tempPins = [];

        this.frameList = [];
        this.frameCount = 1;

        this.lastFrame = 10;
        this.lastFrameStrike = false;
        this.lastFrameSpare  = false;
        this.score = 0;
    }

    startGame() {

        //Hide start button  and show roll button
        this.gameElement.querySelector("#Start").classList.add("d-none");

        let rollButton = this.gameElement.querySelector("#Roll");
        rollButton.classList.remove("d-none");
        this.updateTable();
    }
    updateTable() {
        let tr = "";
        for (let i = 1; i <= this.lastFrame; i++) {
            tr += `<tr>
                        <td data-frame=${i}>${i}</td>
                        <td data-roll1=${i}></td>
                        <td data-roll2=${i}></td>
                        <td data-roll3=${i}></td>
                        <td data-bonus=${i}></td>
                       
                      </tr>`;
        }

        let tbody = this.gameElement.querySelector("#Tbody");

        tbody.insertAdjacentHTML('beforeend', tr);
    }
    roll() {
        //either 1 throw or 2 throws or 3 of the tenth frame if there is  a strike or spare     
        //Frame 1 -9
        if (this.frameCount < this.lastFrame) {
           
            // Determine what the random will be
            let random;

            // random of second roll if [ 5, ?]
            if (this.tempPins.length == 1 && this.tempPins[0] < 10) {
                random = Math.floor(Math.random() * (11 - this.tempPins[0]));
            }
            // random of first roll [ ?,]
            else {
                random = this.getRandomZeroToTen();
            }

            this.randomNumber = random;
            let strike = this.isStrike(random);
            // strike [10]
            if (strike) {


                //assign random to tempPins
                // tempPins.push(this.randomNumber);
                this.tempPins[0] = random;
                this.tempPins[1] = null;

                //Binding to U
                this.gameElement.querySelector(`[data-roll1="${this.frameCount}"]`).innerHTML = this.tempPins[0];
                this.disPlayStrike();
                //add tempPins to frameList
                this.frameList.push(this.tempPins);
                console.log(this.frameList);

                //reset tempPins
                this.tempPins = [];
                this.nextFrame = true;
            }
            // normal throw get 2 throws  [3]
            else if (random < 10 && this.tempPins.length < 2) {

                //meaning random is less than 10
                //add random to tempPins

                // first throw
                if (this.tempPins.length == 0) {

                    this.tempPins[0] = random;
                    this.nextFrame = false; //don't increse the frameCount
                    //Binding to U
                    this.gameElement.querySelector(`[data-roll1="${this.frameCount}"]`).innerHTML = this.tempPins[0];
                }
                // second throw
                else if (this.tempPins.length == 1) {

                    this.tempPins[1] = random;
                    this.frameList.push(this.tempPins);

                    console.log(this.frameList);

                    //Binding to U
                    this.gameElement.querySelector(`[data-roll2="${this.frameCount}"]`).innerHTML = this.tempPins[1];
                    this.isSpare() ? this.disPlaySpare() : "";
                    //reset tempPins
                    this.tempPins = [];
                    this.nextFrame = true;
                }

            }
            

        }
        //End Frame 1 -9

        //Frame 10th (last Frame)
        else if (this.frameCount == this.lastFrame) {
            //frame 10 is ,Determine what the random will be
            let random;
            //  random of first roll
            if (this.tempPins.length == 0) {
                random = this.getRandomZeroToTen();
            }
            // random of second roll if [ 8, ?]
            else if (this.tempPins.length == 1 && this.tempPins[0] < 10) {
                random = Math.floor(Math.random() * (11 - this.tempPins[0]));
            }
            // random of second roll if [ 10, ?]
            else if (this.tempPins.length == 1 && this.tempPins[0] == 10) {
                random = this.getRandomZeroToTen();
            }
            //random of  third roll [ 10, 10,?]
            else if (this.tempPins.length == 2 && this.tempPins[0] == 10 && this.tempPins[1] == 10) {
                random = this.getRandomZeroToTen();

            }
            //random of  third roll [ 10, 5,?]
            else if (this.tempPins.length == 2 && this.tempPins[0] == 10 && this.tempPins[1] < 10) {
                random = Math.floor(Math.random() * (11 - this.tempPins[1]));
            }
            //random of  third roll [ 6, 4,?] spare
            else if (this.tempPins.length == 2 && (this.tempPins[0] + this.tempPins[1] == 10)) {
                random = this.getRandomZeroToTen();

            }


            this.randomNumber = random;
            let strike = this.isStrike(random);
            //if last frame strike [10]
            if (strike || this.lastFrameStrike) {

                //set a flag got a strike on the last frame, so the next roll so this block will run again
                this.lastFrameStrike = true;
                // first roll
                if (this.tempPins.length == 0) {
                    // first throw
                    this.tempPins[0] = random;
                    //Binding to UI
                    this.gameElement.querySelector(`[data-roll1="${this.frameCount}"]`).innerHTML = this.tempPins[0];
                    this.disPlayStrike();
                } else if (this.tempPins.length == 1) {
                    this.tempPins[1] = random;
                    //Binding to UI
                    this.gameElement.querySelector(`[data-roll2="${this.frameCount}"]`).innerHTML = this.tempPins[1];
                }
                else if (this.tempPins.length == 2) {
                    this.tempPins[2] = random;
                    //Binding to UI
                    this.gameElement.querySelector(`[data-roll3="${this.frameCount}"]`).innerHTML = this.tempPins[2];

                    this.frameList.push(this.tempPins);

                    //reset tempPins
                    this.tempPins = [];
                    this.gameOver();
                }
            }
            //if last frame NOT strike [3,?]
            else if (random < 10 && this.tempPins.length <= 2 || this.lastFrameSpare) {
                // first throw
                if (this.tempPins.length == 0) {

                    this.tempPins[0] = random;

                    //Binding to U
                    this.gameElement.querySelector(`[data-roll1="${this.frameCount}"]`).innerHTML = this.tempPins[0];
                }
                // second throw
                else if (this.tempPins.length == 1) {

                    this.tempPins[1] = random;

                    //Binding to U
                    this.gameElement.querySelector(`[data-roll2="${this.frameCount}"]`).innerHTML = this.tempPins[1];


                    //if is spare  [3,7], //get one more roll
                    if (this.isSpare()) {
                        this.lastFrameSpare == true;
                        this.isSpare() ? this.disPlaySpare() : "";
                    }
                    //else it is NOT spare [3,5]
                    else { //done rolling
                        this.frameList.push(this.tempPins);
                        this.tempPins = [];
                        this.gameOver();
                    }


                }
                //third throw
                else if (this.tempPins.length == 2) {

                    this.tempPins[2] = random;

                    //Binding to UI
                    this.gameElement.querySelector(`[data-roll3="${this.frameCount}"]`).innerHTML = this.tempPins[2];
                    this.frameList.push(this.tempPins);
                    //reset tempPins
                    this.tempPins = [];
                    this.gameOver();
                }
            }
            this.nextFrame = false;
        }
        if (this.nextFrame == true) {
            //move to the next frame
            this.frameCount++;
        }

    }
    //ending roll method
    getRandomZeroToTen() {

        return Math.floor(Math.random() * 11);
    }
    isStrike(random) {

        return random == 10;
    }
    isSpare() {

        return this.tempPins[0] + this.tempPins[1] == 10;
    }
    disPlayStrike() {
        this.gameElement.querySelector(`[data-bonus="${this.frameCount}"]`).innerHTML = "<span class=text-success>Strike</span>";
    }
    disPlaySpare() {
        this.gameElement.querySelector(`[data-bonus="${this.frameCount}"]`).innerHTML = "<span class=text-info>Spare</span>";
    }
    gameOver() {
        //hide Roll button
        let rollButton = this.gameElement.querySelector("#Roll");
        rollButton.classList.add("d-none");

        this.displayScore();
        //display play again PlayAgain
        this.gameElement.querySelector("#PlayAgain").classList.remove("d-none");

    }
    displayScore() {
        this.gameElement.querySelector("#Score").innerHTML = this.getScore(this.frameList);
    }
    getScore(list) {
        
        let totalScore = 0;
        let rollIndex = 0;

        let lastFrameIndex = list.length - 2;
        let lastFrame = list[list.length - 1];
        //iterate 9 through each frame only 9 frames first loop 0-8 index
        for (let frameIndex = 0; frameIndex <= list.length - 2; frameIndex++) {

            //If strike , current frame + next next frame throw1 and throw2 (list.length - 1 / 10-1 == 9 and < 9 is 8)
            //current frame is strike
            if (list[frameIndex][rollIndex] == 10) {

                //if next frame is the next frame is the last of the frame Be back need to check if next frame is last
                //Last frame
                if (frameIndex == lastFrameIndex) {

                    totalScore += 10 + list[frameIndex + 1][rollIndex] + list[frameIndex + 1][rollIndex + 1];
                    continue;
                }
                //not last frame yet
                else {
                    if (list[frameIndex + 1][rollIndex] == 10) { //strike one item to add
                        totalScore += 10 + list[frameIndex + 1][rollIndex] + list[frameIndex + 2][rollIndex];
                        continue;
                    } else { // two item to add
                        totalScore += 10 + list[frameIndex + 1][rollIndex] + list[frameIndex + 1][rollIndex + 1];
                        continue;
                    }

                }
            }
            //Ending if Strike

            //sum the pins in current/ this regular frame which is 2 throws
            let frameScore = list[frameIndex][rollIndex] + list[frameIndex][rollIndex + 1];


            //If spare (frame score is 10 )
            if (frameScore == 10) {
                totalScore += 10 + list[frameIndex + 1][rollIndex]
            } else {
                totalScore += frameScore;
            }


        }//ending for loop

        //For loop for last frame
        for (let i = 0; i < lastFrame.length; i++) {
            totalScore += lastFrame[i];
        }

        return totalScore;
    }

    resetGame() {

        //if play again is click 
        // show the roll button
        this.gameElement.querySelector("#Roll").classList.remove("d-none");

        // hide the play again
        this.gameElement.querySelector("#PlayAgain").classList.add("d-none");
        // clear the total score
        this.clearScore();
        //reset the class property
        this.resetProperty();
        //clear table delet tr off tbody
        this.clearTableData();
        // insert tr back in to tbody
        this.updateTable();
    }
    clearScore() {
        this.gameElement.querySelector("#Score").innerHTML = "";
    }
    resetProperty() {
        this.strike = false;
        this.spare = false;
        this.nextFrame = false;

        this.tempPins = [];

        this.frameList = [];
        this.frameCount = 1;

        this.lastFrame = 10;
        this.lastFrameStrike = false;
        this.lastFrameSpare = false;
        this.score = 0;
    }
    clearTableData() {

        var tbody = this.gameElement.getElementsByTagName("Tbody")[0];
        var tr = tbody.getElementsByTagName('tr');
        var rowCount = tr.length;

        for (let x = rowCount - 1; x >= 0; x--) {
            tbody.removeChild(tr[x]);
        }


    }
}
//ending class
