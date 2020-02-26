class Level {
    constructor(gridScale, width, height, blockType, playerStart) {
        this.m_gridScale = gridScale;
        this.m_width = width;
        this.m_height = height;
        this.m_grid = [];
        this.m_playerStart = playerStart;
        this.m_canvas = document.getElementById("Canvas_Background");
        this.m_ctx = this.m_canvas.getContext("2d");
        this.initGrid(width, height, blockType);
    }
    initGrid(width, height, blockType) {
        var typeCounter = 0;
        for (var h = 0; h < height; h++) {
            for (var w = 0; w < width; w++) {
                var newBlock = {x:0, y:0, type:0};
                newBlock.x = w;
                newBlock.y = h;
                newBlock.type = blockType[typeCounter++];
                this.m_grid.push(newBlock);
            }
        }
    }
    drawGrid() {
        console.log("height: " + this.m_height);
        console.log("width: " + this.m_width);
        console.log("scale: " + this.m_gridScale);

        var blockCounter = 0;
        for (var fy = 0; fy < this.m_height; fy++) {
            for (var fx = 0; fx < this.m_width; fx++) {
                this.m_ctx.beginPath();
                this.m_ctx.rect(this.m_grid[blockCounter].x * this.m_gridScale, this.m_grid[blockCounter].y * this.m_gridScale, this.m_gridScale, this.m_gridScale);
                if (this.m_grid[blockCounter].type == 1) this.m_ctx.fillStyle = "rgba(43, 221, 227, 1)";
                else if (this.m_grid[blockCounter].type == 0) this.m_ctx.fillStyle = "rgba(227, 200, 43, 0.25)";
                else this.m_ctx.fillStyle = "orange";
                this.m_ctx.fill();
                this.m_ctx.closePath();
                blockCounter++;
            }
        }
    }
    
    getPlayerCollisions(bDrawCollisions) {
        var arr = [];
        for (var i = 0; i < this.m_grid.length; i++) {
            if (this.m_grid[i].type == 1) {
                var nb = {x0:0, y0:0, x1:0, y1:0, scale:this.m_gridScale};
                
                nb.x0 = this.m_grid[i].x * this.m_gridScale;
                nb.y0 = this.m_grid[i].y * this.m_gridScale;
                nb.x1 = (this.m_grid[i].x * this.m_gridScale) + this.m_gridScale;
                nb.y1 = (this.m_grid[i].y * this.m_gridScale) + this.m_gridScale;
                
                arr.push(nb);
            }
        }
        
        //draw collisions
        if (bDrawCollisions) {
            this.m_ctx.clearRect(0, 0, this.m_canvas.width, this.m_canvas.height);
            
            var colCount = 0;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                var element = arr[i];
                
                this.m_ctx.beginPath();
                this.m_ctx.arc(element.x0, element.y0, 3, 0, Math.PI*2);
                this.m_ctx.fillStyle = "rgba(255, 0, 0, .5)";
                this.m_ctx.fill();
                this.m_ctx.closePath();
            
                this.m_ctx.beginPath();
                this.m_ctx.arc(element.x1, element.y1, 3, 0, Math.PI*2);
                this.m_ctx.fillStyle = "rgba(0, 0, 255, .5)";
                this.m_ctx.fill();
                this.m_ctx.closePath();
                
                this.m_ctx.beginPath();
                this.m_ctx.rect(element.x0, element.y0, element.scale, element.scale);
                this.m_ctx.strokeStyle = "rgba(233, 212, 96, 1)"
                this.m_ctx.stroke();
                this.m_ctx.closePath();
                
                colCount++;
            }
            
            var rCount = 0;
            var cCount = 0
            for (var y = 0; y < colCount; y++) {
                this.m_ctx.beginPath();
                this.m_ctx.arc(10 + (rCount*10), (this.m_gridScale / 2) + cCount * this.m_gridScale, 3, 0, Math.PI*2);
                this.m_ctx.fillStyle = "black";
                this.m_ctx.fill();
                this.m_ctx.closePath();
                
                rCount++;
                
                if ((rCount / (this.m_gridScale/10)) == (this.m_canvas.width / this.m_gridScale) - (1/(this.m_gridScale/10))) {cCount++;rCount = 0;}
            }
        }
        
        return arr;
    }
    
    getPlayerStart() {
        var x = {x:(this.m_playerStart.x * (this.m_gridScale / 10)), y:(this.m_playerStart.y * (this.m_gridScale / 10))};
        return x;
    }
    getMovementScale() {return this.m_gridScale / 10;}
    getPlayerScale() {return this.m_gridScale / 10;}
    getStartCoords() {return this.m_playerStart};
}

class Player {
    constructor(size, colour) {
        this.m_size = size;
        this.m_colour = colour;
        
        this.m_canvas = document.getElementById("Canvas_Player");
        this.m_ctx = this.m_canvas.getContext("2d");
        
        this.m_x = 0;
        this.m_y = 0;
        
        this.m_moveForward = 0;
        this.m_moveBackward = 0;
        this.m_moveRight = 0;
        this.m_moveLeft = 0;
        
        //changes movement speed
        this.m_movementSpeed = 1.5;
        //default value, gets changed during setup
        this.m_movementScale = 1;
        
        this.m_currentLevelCollisions = []
    }
    
    setPlayerSize(scale) {
        this.m_size *= scale;
        console.log("Player size: " +  this.m_size);
    }
    
    setPlayerSpawn(coords) {
        this.m_x = coords.x;
        this.m_y = coords.y;
    }
    
    setMovementScale(scale) {
        this.m_movementScale = scale;
    }
    
    setCurrentLevelCollisions(collisions) {
        this.m_currentLevelCollisions = collisions;
        
    }
    
    setStartCoords(coords) {
        this.m_x = coords.x;
        this.m_y = coords.y;
    }
    
    clearPlayer() {
        if (this.m_size <= 15) this.m_ctx.clearRect(this.m_x - 1, this.m_y - 1, this.m_size + 2, this.m_size + 2);
        else this.m_ctx.clearRect(this.m_x, this.m_y, this.m_size, this.m_size);
    }
    
    drawPlayer() {
        this.m_ctx.beginPath();
        this.m_ctx.rect(this.m_x, this.m_y, this.m_size, this.m_size);
        this.m_ctx.fillStyle = this.m_colour;
        this.m_ctx.fill();
        this.m_ctx.closePath();
    }
    
    move() {
        var canMoveForward = true;
        var canMoveBackward = true;
        var canMoveRight = true;
        var canMoveLeft = true;
        var delta_x = this.m_movementScale * this.m_movementSpeed * (this.m_moveRight + this.m_moveLeft);
        var delta_y = this.m_movementScale * this.m_movementSpeed * (this.m_moveForward + this.m_moveBackward);
        
        
        for (var i = 0; i < this.m_currentLevelCollisions.length; i++) {
            var element = this.m_currentLevelCollisions[i];
            
            if ((this.m_y > element.y0 && this.m_y < element.y1) ||
                (this.m_y + this.m_size > element.y0 && this.m_y + this.m_size < element.y1) ||
                (this.m_y == element.y0 && this.m_y + this.m_size == element.y1) ||
                (this.m_y == element.y0 || this.m_y == element.y1) ||
                (this.m_y + this.m_size == element.y0 || this.m_y + this.m_size == element.y1)) {
                
                if (this.m_x + this.m_size + delta_x > element.x0 && (this.m_x < element.x1)) {
                    if (element.x0 - (this.m_x + this.m_size) == 0) canMoveRight = false;
                }
                if (this.m_x + delta_x < element.x1 && (this.m_x > element.x0)) {
                    if (this.m_x - element.x1 == 0) canMoveLeft = false;
                }
            }
            
            if ((this.m_x > element.x0 && this.m_x < element.x1) ||
                (this.m_x + this.m_size > element.x0 && this.m_x + this.m_size < element.x1) ||
                (this.m_x == element.x0 && this.m_x + this.m_size == element.x1) ||
                (this.m_x == element.x0 || this.m_x == element.x1) ||
                (this.m_x + this.m_size == element.x0 || this.m_x + this.m_size == element.x1)) {
                
                if (this.m_y + delta_y + 1 < element.y1 && this.m_y > element.y0) canMoveForward = false;
                if (this.m_y + this.m_size + delta_y + 1 > element.y0 && this.m_y < element.y1) canMoveBackward = false;
            }
        }
        
        if ((canMoveLeft && delta_x < 0) || (canMoveRight && delta_x > 0)) {
            /*if (element.x0 - (this.m_x + this.m_size) < delta_x) delta_x = element.x0 - (this.m_x + this.m_size);
            if (element.x1 - this.m_x < delta_x) delta_x = element.x1 - this.m_x;*/
            
            this.m_x += delta_x;
        }
        if ((canMoveForward && delta_y < 0) || (canMoveBackward && delta_y > 0)) this.m_y += delta_y;
        
        var delta_x = this.m_movementScale * this.m_movementSpeed * (this.m_moveRight + this.m_moveLeft);
        var delta_y = this.m_movementScale * this.m_movementSpeed * (this.m_moveForward + this.m_moveBackward);
    }
}

class Game {
    constructor(level, player) {
        this.m_level = level;
        this.m_player = player;
        this.initGame();
    }
    
    initGame(level, player) {
        this.m_level.drawGrid();
        this.m_player.setPlayerSize(this.m_level.getPlayerScale());
        this.m_player.setPlayerSpawn(this.m_level.getPlayerStart());
        this.m_player.setMovementScale(this.m_level.getMovementScale());
        this.m_player.setCurrentLevelCollisions(this.m_level.getPlayerCollisions(false));
        this.m_player.setStartCoords(this.m_level.getPlayerStart());
    }
    
    playGame(player) {
        setInterval(function() {
            player.clearPlayer();
            player.move();
            player.drawPlayer();
        }, 10);
    }

}

function main() {
    var game = new Game(collisionTestLevel, defaultPlayer);
    game.playGame(defaultPlayer);
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") defaultPlayer.m_moveRight = 1;
    else if (e.key == "Left" || e.key == "ArrowLeft") defaultPlayer.m_moveLeft = -1;
    
    if (e.key == "Up" || e.key == "ArrowUp") defaultPlayer.m_moveForward = -1;
    else if (e.key == "Down" || e.key == "ArrowDown") defaultPlayer.m_moveBackward = 1;
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") defaultPlayer.m_moveRight = 0;
    else if (e.key == "Left" || e.key == "ArrowLeft") defaultPlayer.m_moveLeft = 0;
    
    if (e.key == "Up" || e.key == "ArrowUp") defaultPlayer.m_moveForward = 0;
    else if (e.key == "Down" || e.key == "ArrowDown") defaultPlayer.m_moveBackward = 0;
}

var cw = document.getElementById("Canvas_Background");

var testingLevel = new Level(cw.height / 20, 20, 20, [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
],
                            {x:30, y:30});

var collisionTestLevel = new Level(cw.height / 10, 10, 10, [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
                                  {x:30, y:30});

var drawCollisionTestLevel = new Level(cw.height / 10, 10, 10, [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
],
                                  {x:30, y:30});

var mazeTestingLevel = new Level(cw.height / 40, 40, 40, [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
],
                                {x:30, y:30});

var defaultPlayer = new Player(10, "violet");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

main();
