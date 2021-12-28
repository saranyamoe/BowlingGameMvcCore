var Bowling = /** @class */ (function () {
    function Bowling(element) {
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
        this.lastFrameSpare = false;
        this.score = 0;
    }
    Bowling.prototype.startGame = function () {
        //Hide start button  and show roll button
        this.gameElement.querySelector("#Start").classList.add("d-none");
        var rollButton = this.gameElement.querySelector("#Roll");
        rollButton.classList.remove("d-none");
        this.updateTable();
    };
    Bowling.prototype.updateTable = function () {
        var tr = "";
        for (var i = 1; i <= this.lastFrame; i++) {
            tr += "<tr>\n                        <td data-frame=".concat(i, ">").concat(i, "</td>\n                        <td data-roll1=").concat(i, "></td>\n                        <td data-roll2=").concat(i, "></td>\n                        <td data-roll3=").concat(i, "></td>\n                        <td data-bonus=").concat(i, "></td>\n                       \n                      </tr>");
        }
        var tbody = this.gameElement.querySelector("#Tbody");
        tbody.insertAdjacentHTML('beforeend', tr);
    };
    Bowling.prototype.roll = function () {
        //either 1 throw or 2 throws or 3 of the tenth frame if there is  a strike or spare     
        //Frame 1 -9
        if (this.frameCount < this.lastFrame) {
            // Determine what the random will be
            var random = void 0;
            // random of second roll if [ 5, ?]
            if (this.tempPins.length == 1 && this.tempPins[0] < 10) {
                random = Math.floor(Math.random() * (11 - this.tempPins[0]));
            }
            // random of first roll [ ?,]
            else {
                random = this.getRandomZeroToTen();
            }
            this.randomNumber = random;
            var strike = this.isStrike(random);
            // strike [10]
            if (strike) {
                //assign random to tempPins
                // tempPins.push(this.randomNumber);
                this.tempPins[0] = random;
                this.tempPins[1] = null;
                //Binding to U
                this.gameElement.querySelector("[data-roll1=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[0];
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
                    this.gameElement.querySelector("[data-roll1=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[0];
                }
                // second throw
                else if (this.tempPins.length == 1) {
                    this.tempPins[1] = random;
                    this.frameList.push(this.tempPins);
                    console.log(this.frameList);
                    //Binding to U
                    this.gameElement.querySelector("[data-roll2=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[1];
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
            var random = void 0;
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
            var strike = this.isStrike(random);
            //if last frame strike [10]
            if (strike || this.lastFrameStrike) {
                //set a flag got a strike on the last frame, so the next roll so this block will run again
                this.lastFrameStrike = true;
                // first roll
                if (this.tempPins.length == 0) {
                    // first throw
                    this.tempPins[0] = random;
                    //Binding to UI
                    this.gameElement.querySelector("[data-roll1=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[0];
                    this.disPlayStrike();
                }
                else if (this.tempPins.length == 1) {
                    this.tempPins[1] = random;
                    //Binding to UI
                    this.gameElement.querySelector("[data-roll2=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[1];
                }
                else if (this.tempPins.length == 2) {
                    this.tempPins[2] = random;
                    //Binding to UI
                    this.gameElement.querySelector("[data-roll3=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[2];
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
                    this.gameElement.querySelector("[data-roll1=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[0];
                }
                // second throw
                else if (this.tempPins.length == 1) {
                    this.tempPins[1] = random;
                    //Binding to U
                    this.gameElement.querySelector("[data-roll2=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[1];
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
                    this.gameElement.querySelector("[data-roll3=\"".concat(this.frameCount, "\"]")).innerHTML = this.tempPins[2];
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
    };
    //ending roll method
    Bowling.prototype.getRandomZeroToTen = function () {
        return Math.floor(Math.random() * 11);
    };
    Bowling.prototype.isStrike = function (random) {
        return random == 10;
    };
    Bowling.prototype.isSpare = function () {
        return this.tempPins[0] + this.tempPins[1] == 10;
    };
    Bowling.prototype.disPlayStrike = function () {
        this.gameElement.querySelector("[data-bonus=\"".concat(this.frameCount, "\"]")).innerHTML = "<span class=text-success>Strike</span>";
    };
    Bowling.prototype.disPlaySpare = function () {
        this.gameElement.querySelector("[data-bonus=\"".concat(this.frameCount, "\"]")).innerHTML = "<span class=text-info>Spare</span>";
    };
    Bowling.prototype.gameOver = function () {
        //hide Roll button
        var rollButton = this.gameElement.querySelector("#Roll");
        rollButton.classList.add("d-none");
        this.displayScore();
        //display play again PlayAgain
        this.gameElement.querySelector("#PlayAgain").classList.remove("d-none");
    };
    Bowling.prototype.displayScore = function () {
        this.gameElement.querySelector("#Score").innerHTML = this.getScore(this.frameList);
    };
    Bowling.prototype.getScore = function (list) {
        var totalScore = 0;
        var rollIndex = 0;
        var lastFrameIndex = list.length - 2;
        var lastFrame = list[list.length - 1];
        //iterate 9 through each frame only 9 frames first loop 0-8 index
        for (var frameIndex = 0; frameIndex <= list.length - 2; frameIndex++) {
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
                    }
                    else { // two item to add
                        totalScore += 10 + list[frameIndex + 1][rollIndex] + list[frameIndex + 1][rollIndex + 1];
                        continue;
                    }
                }
            }
            //Ending if Strike
            //sum the pins in current/ this regular frame which is 2 throws
            var frameScore = list[frameIndex][rollIndex] + list[frameIndex][rollIndex + 1];
            //If spare (frame score is 10 )
            if (frameScore == 10) {
                totalScore += 10 + list[frameIndex + 1][rollIndex];
            }
            else {
                totalScore += frameScore;
            }
        } //ending for loop
        //For loop for last frame
        for (var i = 0; i < lastFrame.length; i++) {
            totalScore += lastFrame[i];
        }
        return totalScore;
    };
    Bowling.prototype.resetGame = function () {
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
    };
    Bowling.prototype.clearScore = function () {
        this.gameElement.querySelector("#Score").innerHTML = "";
    };
    Bowling.prototype.resetProperty = function () {
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
    };
    Bowling.prototype.clearTableData = function () {
        var tbody = this.gameElement.getElementsByTagName("Tbody")[0];
        var tr = tbody.getElementsByTagName('tr');
        var rowCount = tr.length;
        for (var x = rowCount - 1; x >= 0; x--) {
            tbody.removeChild(tr[x]);
        }
    };
    return Bowling;
}());
//ending class
//# sourceMappingURL=bowling.js.map