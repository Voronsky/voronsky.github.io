//'use strict';

//Do window.onLoad = function () { var game}:
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

game.load.audio('nujabes',['assets/audio/nujabes_afternoon.mp3']);
game.load.image('sky', 'assets/sky.png');
game.load.image('ground', 'assets/platform.png');
game.load.image('star', 'assets/star.png');
game.load.image('oneUp','assets/firstaid.png');
game.load.spritesheet('Dog','assets/Dog.png',50,50);
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
game.load.spritesheet('enemy','assets/baddie.png',32,48);

}

var player;
var dogs;
var platforms;
var cursors;
var enemies;
var giveLife;
var stars;
var score = 0;
var scoreText;
var clock = 60000;
var clockText;
var music;

function create() {

    music = game.add.audio('nujabes');
    music.play();
    music.volume = 0.5;

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
   
    enemies = game.add.group();
    enemies.enableBody = true;
    var enemy = enemies.create(game.world.randomX, game.world.randomY, 'enemy');
    
    enemy.body.bounce.y = 0;
    enemy.body.gravity.y = 320;
 
    //Adding dog groups

    dogs = game.add.group(); 
    dogs.enableBody = true;

    //Adding dog into the game at random X and Y
    var dog = dogs.create(game.world.randomX, game.world.randomY, 'Dog');


    //Adding dog physics
    //game.physics.arcade.enable(dog);
    
    dog.body.bounce.y = 0.2;
    dog.body.gravity.y = 320;
    dog.body.collideWorldBounds = true;

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    var star = stars.create(game.world.randomX, game.world.randomY, 'star');
    star.body.gravity.y = 300;
    star.body.bounce.y = 0.9;
    game.time.events.repeat(Phaser.Timer.SECOND*30, 50, resurrectStar, this);
    /*for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(game.world.randomX, game.world.randomY, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }*/

	//  The score
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	clockText = game.add.text(40,40, 'Time: ' + clock, {fontSize: '32px', fill: '#000' });			

	//  Our controls.
	cursors = game.input.keyboard.createCursorKeys();
    
    }

   function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(dogs, platforms);

    //  Checks to see if the player overlaps with any of the dogs, if he does call the collectDog function
    game.physics.arcade.overlap(player, dogs, collectDog, null, this);
    //  Checks to see if the player overlaps with any of the stars, if so call the collectStar			
    game.physics.arcade.overlap(player, stars, collectStars, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    updateCounter();

    }


function collectDog (player, dogs) {
    
    // Removes the dog from the screen
    dogs.kill();
	
    // Spawn another one
    resurrectDog();			

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function collectStars (player, stars) {
    //Remove the stars			
    stars.kill();			

    //Add 100 miliseconds			
    clock+=100;
    clockText.text = ("Time: "+clock);
}
			
function resurrectDog() {
   var thing = dogs.getFirstDead();

   if (thing)
   {
     
      thing.reset(game.world.randomX,game.world.randomY);

   }
}

function resurrectStar() {
   var thing = stars.getFirstDead();

   if (thing)
   {
     
      thing.reset(game.world.randomX,game.world.randomY);

   }
}

    function updateCounter() {
    clock--;
    clockText.setText("Time: " + clock);
    }
