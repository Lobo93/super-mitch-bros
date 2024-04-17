// Canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
context.imageSmoothingEnabled = false
const gradient = context.createLinearGradient(0,12,0,84)
gradient.addColorStop(0, 'transparent')
gradient.addColorStop(0.2, '#000d')
gradient.addColorStop(0.8, '#000d')
gradient.addColorStop(1, 'transparent')

// Font
const potatoPixel = new FontFace('potato-pixel', 'url(fonts/potato-pixel.otf)')
document.fonts.add(potatoPixel)
potatoPixel.load().then(() => {
	context.font = '16px potato-pixel'
	context.strokeStyle = '#111'
	context.fillStyle = '#eee'
	context.textBaseline = 'middle'
	context.lineWidth = 3
	loadTitleScreen()
})

// Audio
let audio = new window.AudioContext()
window.addEventListener('click', () => audio.resume)

let music
let preloadedMusic
const musics = {
	overworld: 'audio/overworld.webm',
	underground: 'audio/underground.webm',
	castle: 'audio/castle.webm'
}

async function preloadMusic(music) {
	if (!musics[music]) return
	let response = await fetch(musics[music])
	let arrayBuffer = await response.arrayBuffer()
	let audioBuffer = await audio.decodeAudioData(arrayBuffer)
	preloadedMusic = audioBuffer
}

function playMusic() {
	if (!preloadedMusic) return
	stopMusic()
	music = audio.createBufferSource()
	music.loop = true
	music.buffer = preloadedMusic
	music.connect(audio.destination)
	preloadedMusic = null
	music.start()
}

function stopMusic() {
	if (!music) return
	music.stop(audio.currentTime)
	music = null
}

const sounds = {
	jump: 'audio/jump.webm',
	stomp: 'audio/stomp.webm',
	ouch: 'audio/ouch.webm',
	glug: 'audio/glug.webm',
	victory: 'audio/victory.webm'
}

async function preloadSound(name, url) {
	let response = await fetch(url)
	let arrayBuffer = await response.arrayBuffer()
	let audioBuffer = await audio.decodeAudioData(arrayBuffer)
	sounds[name] = audioBuffer
}

for (sound in sounds) {
	preloadSound(sound, sounds[sound])
}

function playSound(sound) {
	if (!sounds[sound]) return
	let source = audio.createBufferSource()
	source.buffer = sounds[sound]
	source.connect(audio.destination)
	source.start()
	source.stop(audio.currentTime + source.buffer.duration)
}

// Debug
let debug = false

// Add pizzas
function addPizza(event) {
	if (!level) return
	if (!level.pizzas) level.pizzas = []
	let canvasHTML = canvas.getBoundingClientRect()
	let x = Math.round(((event.x - canvasHTML.x) / canvasHTML.width * canvas.width + camera.left) / 8) * 8
	let y = Math.round((event.y - canvasHTML.y) / canvasHTML.height * canvas.height / 8) * 8 + 8
	let clickedpizza = level.pizzas.find(pizza => pizza.x === x && pizza.y === y)
	if (clickedpizza) {
		level.pizzas.splice(level.pizzas.indexOf(clickedpizza), 1)
		return
	}
	level.pizzas.push({x:x, y:y})
}

// Sprites
const spritesheet = new Image()
spritesheet.src = 'images/spritesheet.png'

const sprites = {
	player0Right: {x:0, y:0, width:16, height:16},
	player1Right: {x:16, y:0, width:16, height:16},
	player2Right: {x:32, y:0, width:16, height:16},
	playerJumpRight: {x:48, y:0, width:16, height:16},
	player0Left: {x:64, y:0, width:16, height:16},
	player1Left: {x:80, y:0, width:16, height:16},
	player2Left: {x:96, y:0, width:16, height:16},
	playerJumpLeft: {x:112, y:0, width:16, height:16},
	playerDead: {x:0, y:16, width:16, height:16},
	grass: {x:16, y:16, width:16, height:16},
	rocks: {x:16, y:32, width:16, height:16},
	bricks: {x:32, y:16, width:16, height:16},
	stone: {x:48, y:16, width:16, height:16},
	grassPlatformLeft: {x:32, y:32, width:16, height:16},
	grassPlatform: {x:48, y:32, width:16, height:16},
	grassPlatformRight: {x:64, y:32, width:16, height:16},
	mushroomLeft: {x:64, y:16, width:16, height:16},
	mushroom: {x:80, y:16, width:16, height:16},
	mushroomRight: {x:96, y:16, width:16, height:16},
	mushroomStem: {x:80, y:32, width:16, height:16},
	castleBricks: {x:0, y:64, width:16, height:16},
	castleStone: {x:16, y:64, width:16, height:16},
	castlePlatformLeft: {x:0, y:48, width:16, height:16},
	castlePlatform: {x:16, y:48, width:16, height:16},
	castlePlatformRight: {x:32, y:48, width:16, height:16},
	bushLeft: {x:48, y:48, width:16, height:16},
	bush: {x:64, y:48, width:16, height:16},
	bushRight: {x:80, y:48, width:16, height:16},
	chains: {x:0, y:32, width:16, height:16},
	cloudLeft: {x:32, y:64, width:16, height:16},
	cloud: {x:48, y:64, width:16, height:16},
	cloudRight: {x:64, y:64, width:16, height:16},
	bridge: {x:96, y:48, width:16, height:16},
	bridgeRails: {x:96, y:32, width:16, height:16},
	treeTop: {x:112, y:16, width:16, height:16},
	treeMiddle: {x:112, y:32, width:16, height:16},
	treeTrunk: {x:112, y:48, width:16, height:16},
	caveRocks: {x:80, y:64, width:16, height:16},
	caveBricks: {x:96, y:64, width:16, height:16},
	caveStone: {x:112, y:64, width:16, height:16},
	window: {x:0, y:80, width:16, height:16},
	castleWindow: {x:0, y:96, width:16, height:16},
	lamp: {x:16, y:80, width:16, height:16},
	lampPost: {x:16, y:96, width:16, height:16},
	water0: {x:32, y:80, width:16, height:16},
	water1: {x:48, y:80, width:16, height:16},
	water2: {x:64, y:80, width:16, height:16},
	lava0: {x:80, y:80, width:16, height:16},
	lava1: {x:96, y:80, width:16, height:16},
	lava2: {x:112, y:80, width:16, height:16},
	pizza0: {x:32, y:96, width:16, height:16},
	pizza1: {x:48, y:96, width:16, height:16},
	pizza2: {x:64, y:96, width:16, height:16},
	clock: {x:80, y:96, width:16, height:16},
	skull: {x:96, y:96, width:16, height:16},
	flag0: {x:112, y:96, width:16, height:16},
	flag1: {x:96, y:112, width:16, height:16},
	flag2: {x:112, y:112, width:16, height:16},
	day: {x:128, y:0, width:128, height:128},
	night: {x:128, y:128, width:128, height:128},
	sky: {x:256, y:0, width:128, height:128},
	space: {x:256, y:128, width:128, height:128},
	spikeFloor: {x:64, y:112, width:16, height:16},
	spikeCeiling: {x:80, y:112, width:16, height:16},
	fly0Left: {x:0, y:112, width:16, height:16},
	fly1Left: {x:0, y:128, width:16, height:16},
	flyDeadLeft: {x:0, y:144, width:16, height:16},
	fly0Right: {x:16, y:112, width:16, height:16},
	fly1Right: {x:16, y:128, width:16, height:16},
	flyDeadRight: {x:16, y:144, width:16, height:16},
	cockroach0Left: {x:32, y:112, width:16, height:16},
	cockroach1Left: {x:32, y:128, width:16, height:16},
	cockroachDeadLeft: {x:32, y:144, width:16, height:16},
	cockroach0Right: {x:48, y:112, width:16, height:16},
	cockroach1Right: {x:48, y:128, width:16, height:16},
	cockroachDeadRight: {x:48, y:144, width:16, height:16},
	fish0Left: {x:64, y:128, width:16, height:16},
	fish1Left: {x:64, y:144, width:16, height:16},
	fish0Right: {x:80, y:128, width:16, height:16},
	fish1Right: {x:80, y:144, width:16, height:16},
	ghost0Left: {x:96, y:128, width:16, height:16},
	ghost1Left: {x:96, y:144, width:16, height:16},
	ghost0Right: {x:112, y:128, width:16, height:16},
	ghost1Right: {x:112, y:144, width:16, height:16},
	jumpingFire0Left: {x:0, y:160, width:16, height:16},
	jumpingFire1Left: {x:0, y:176, width:16, height:16},
	jumpingFire0Right: {x:16, y:160, width:16, height:16},
	jumpingFire1Right: {x:16, y:176, width:16, height:16},
	firebar0: {x:32, y:160, width:16, height:16},
	firebar1: {x:32, y:176, width:16, height:16},
	boss0Right: {x:48, y:160, width:16, height:16},
	boss1Right: {x:64, y:160, width:16, height:16},
	boss2Right: {x:80, y:160, width:16, height:16},
	bossJumpRight: {x:96, y:160, width:16, height:16},
	boss0Left: {x:48, y:176, width:16, height:16},
	boss1Left: {x:64, y:176, width:16, height:16},
	boss2Left: {x:80, y:176, width:16, height:16},
	bossJumpLeft: {x:96, y:176, width:16, height:16},
	bossDead: {x:112, y:160, width:16, height:16}
}

function drawSprite(sprite, positionX = 0, positionY = 0, scale = 1) {
	if (!sprites[sprite]) return
	let {x, y, width, height} = sprites[sprite]
	positionX = Math.round(positionX)
	positionY = Math.round(positionY)
	if (positionX >= 256) return
	if (positionX + width * scale <= 0) return
	context.drawImage(spritesheet, x, y, width, height, positionX, positionY, width * scale, height * scale)
}

// Animations
const animations = {
	playerIdle: {
		name: 'playerIdle',
		frames: ['player0'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	playerMoving: {
		name: 'playerMoving',
		frames: ['player1', 'player0', 'player2', 'player0'],
		time: 0,
		frame: 0,
		speed: 12,
		directional: true
	},
	playerJump: {
		name: 'playerJump',
		frames: ['playerJump'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	playerDead: {
		name: 'playerDead',
		frames: ['playerDead'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: false
	},
	pizza: {
		name: 'pizza',
		frames: ['pizza0', 'pizza1', 'pizza0', 'pizza2'],
		time: 0,
		frame: 0,
		speed: 6,
		directional: false
	},
	flag: {
		name: 'flag',
		frames: ['flag0', 'flag1', 'flag0', 'flag2'],
		time: 0,
		frame: 0,
		speed: 8,
		directional: false
	},
	water: {
		name: 'water',
		frames: ['water0', 'water1', 'water2'],
		time: 0,
		frame: 0,
		speed: 4,
		directional: false
	},
	lava: {
		name: 'lava',
		frames: ['lava0', 'lava1', 'lava2'],
		time: 0,
		frame: 0,
		speed: 3,
		directional: false
	},
	spikeCeiling: {
		name: 'spikeCeiling',
		frames: ['spikeCeiling'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: false
	},
	spikeFloor: {
		name: 'spikeFloor',
		frames: ['spikeFloor'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: false
	},
	fly: {
		name: 'fly',
		frames: ['fly0', 'fly1'],
		time: 0,
		frame: 0,
		speed: 30,
		directional: true
	},
	flyDead: {
		name: 'flyDead',
		frames: ['flyDead'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	cockroach: {
		name: 'cockroach',
		frames: ['cockroach0', 'cockroach1'],
		time: 0,
		frame: 0,
		speed: 12,
		directional: true
	},
	cockroachDead: {
		name: 'cockroachDead',
		frames: ['cockroachDead'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	fish: {
		name: 'fish',
		frames: ['fish0', 'fish1'],
		time: 0,
		frame: 0,
		speed: 8,
		directional: true
	},
	ghost: {
		name: 'ghost',
		frames: ['ghost0', 'ghost1'],
		time: 0,
		frame: 0,
		speed: 8,
		directional: true
	},
	jumpingFire: {
		name: 'jumpingFire',
		frames: ['jumpingFire0', 'jumpingFire1'],
		time: 0,
		frame: 0,
		speed: 16,
		directional: true
	},
	firebar: {
		name: 'firebar',
		frames: ['firebar0', 'firebar1'],
		time: 0,
		frame: 0,
		speed: 16,
		directional: false
	},
	bossIdle: {
		name: 'bossIdle',
		frames: ['boss0'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	bossMoving: {
		name: 'bossMoving',
		frames: ['boss1', 'boss0', 'boss2', 'boss0'],
		time: 0,
		frame: 0,
		speed: 12,
		directional: true
	},
	bossJump: {
		name: 'bossJump',
		frames: ['bossJump'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: true
	},
	bossDead: {
		name: 'bossDead',
		frames: ['bossDead'],
		time: 0,
		frame: 0,
		speed: 0,
		directional: false
	}
}
const sharedAnimations = [animations.pizza, animations.water, animations.lava, animations.flag]

// Blocks
let blocks = ['', 'grass', 'rocks', 'bricks', 'stone', 'grassPlatformLeft', 'grassPlatform', 'grassPlatformRight', 'bushLeft', 'bush', 'bushRight', 'mushroomLeft', 'mushroom', 'mushroomRight', 'mushroomStem', 'castleBricks', 'castleStone', 'castlePlatformLeft', 'castlePlatform', 'castlePlatformRight', 'chains', 'cloudLeft', 'cloud', 'cloudRight', 'bridge', 'bridgeRails', 'treeTop', 'treeMiddle', 'treeTrunk', 'window', 'castleWindow','lamp', 'lampPost', 'caveRocks', 'caveBricks', 'caveStone']
let solids = ['grass', 'rocks', 'bricks', 'stone', 'castleBricks', 'castleStone', 'window', 'castleWindow', 'caveRocks', 'caveBricks', 'caveStone']
let semiSolids = ['grassPlatformLeft', 'grassPlatform', 'grassPlatformRight', 'mushroomLeft', 'mushroom', 'mushroomRight', 'castlePlatformLeft', 'castlePlatform', 'castlePlatformRight', 'cloudLeft', 'cloud', 'cloudRight', 'bridge']

function printBlocks() {
	let blockList = blocks.map((block, index) => {
		return (index).toString(36) + ' = ' + block
	}).join('\n')
	console.log(blockList)
}

function getBlock(x, y) {
	x = Math.floor(x / 16)
	y = Math.floor(y / 16)
	if (y < 0) return
	if (y >= level.blocks.length) return
	if (y < 0) return
	if (y >= level.blocks.length) return
	let index = parseInt(level.blocks[y][x], 36)
	return blocks[index]
}

function isSolid(block) {
	return solids.includes(block)
}

function isSemiSolid(block) {
	return semiSolids.includes(block)
}

// Title screen
let titleScreen = false

function loadTitleScreen() {
	if (titleScreen) return
	titleScreen = true
	level = null
	gameTime = 0
	totalpizzas = 0
	collectedpizzas = 0
	deaths = 0
	canvas.removeEventListener('click', loadTitleScreen)
	canvas.removeEventListener('click', startGame)

	canvas.addEventListener('click', startGame)
	window.requestAnimationFrame(titleScreenFrames)
}

function startGame() {
	loadLevel('level1')
}

function titleScreenFrames(currentTime) {
	if (!titleScreen) return

	drawSprite('day', 0, 0, 2)

	context.textAlign = 'center'
	context.font = '40px potato-pixel'
	context.strokeText('Mitch', 139, 55)
	context.fillText('Mitch', 140, 54)

	drawSprite('playerJumpRight', 54, 42, 2)

	context.font = '16px potato-pixel'
	context.strokeText('Super', 111, 35)
	context.fillText('Super', 112, 34)
	context.strokeText('Bros', 161, 75)
	context.fillText('Bros', 162, 74)
	
	context.fillText('Made by Lobo', 206, 244)

	if (new Date().getMilliseconds() % 250 < 150) {
		context.strokeText('Start', 128, 128)
		context.fillText('Start', 128, 128)
	}

	window.requestAnimationFrame(titleScreenFrames)
}

// Characters
class Character {
	constructor(x, y, maxSpeedX, maxSpeedY, acceleration, gravity, animation, direction, invincible, ignoreBlocks) {
		this.x = x
		this.y = y
		this.animation = {...animations[animation]}
		this.invincible = invincible
		this.ignoreBlocks = ignoreBlocks
		this.maxSpeedX = maxSpeedX
		this.maxSpeedY = maxSpeedY
		this.acceleration = acceleration
		this.gravity = gravity
		this.direction = direction
	}
	speedX = 0
	speedY = 0
	onFloor = false
	dead = false
	checkWalls = () => {
		if (this.ignoreBlocks) return

		let blockTopLeft = getBlock(this.x - 8.1, this.y - 7)
		let blockBottomLeft = getBlock(this.x - 8.1, this.y - 0.1)
		if (isSolid(blockTopLeft) || isSolid(blockBottomLeft) || this.x < 8) {
			this.speedX = Math.max(0, this.speedX)
			this.x = Math.max(this.x, Math.floor(this.x / 16) * 16 + 8)
			if (this.hitWallLeft) this.hitWallLeft()
		}
		let blockTopRight = getBlock(this.x + 8.1, this.y - 7)
		let blockBottomRight = getBlock(this.x + 8.1, this.y - 0.1)
		if (isSolid(blockTopRight) || isSolid(blockBottomRight) || this.x > levelWidth - 8) {
			this.speedX = Math.min(0, this.speedX)
			this.x = Math.min(this.x, Math.floor(this.x / 16) * 16 + 8)
			if (this.hitWallRight) this.hitWallRight()
		}
	}
	checkCeiling = () => {
		if (this.onFloor || this.speedY >= 0 || this.ignoreBlocks) return

		let blockLeft = getBlock(this.x - 5, this.y - 12)
		let blockRight = getBlock(this.x + 5, this.y - 12)
		if (!isSolid(blockLeft) && !isSolid(blockRight)) return
		this.y = Math.floor(this.y / 16 + 1) * 16 - 1
		this.speedY = 0
		if (this.hitCeiling) this.hitCeiling()
	}
	checkFall = () => {
		if (!this.onFloor) return

		let blockLeft = getBlock(this.x - 4, this.y + 1)
		let blockRight = getBlock(this.x + 4, this.y + 1)
		if (!isSolid(blockLeft) && !isSolid(blockRight) && !isSemiSolid(blockLeft) && !isSemiSolid(blockRight)) {
			this.onFloor = false
			if (this.fell) this.fell()
		}
	}
	checkLanded = () => {
		if (this.onFloor || this.speedY < 0 || this.ignoreBlocks) return

		let position = Math.floor(this.y / 16) * 16
		let oldPosition = Math.floor((this.y - 0.01 - this.speedY * deltaTime) / 16) * 16
		let blockLeft = getBlock(this.x - 4, this.y)
		let blockRight = getBlock(this.x + 4, this.y)
		let landed = false
		if (isSolid(blockLeft)) landed = true
		if (isSolid(blockRight)) landed = true
		if (isSemiSolid(blockLeft) && position > oldPosition) landed = true
		if (isSemiSolid(blockRight) && position > oldPosition) landed = true
		if (!landed) return
		this.onFloor = true
		this.y = position
		this.speedY = 0
		if (this.landed) this.landed()
	}
	moveX = () => {
		this.speedX += this.acceleration * this.direction * deltaTime
		this.speedX = Math.min(Math.max(-this.maxSpeedX, this.speedX), this.maxSpeedX)
		this.x += this.speedX * deltaTime
	}
	moveY = () => {
		if (this.onFloor) return

		this.speedY = this.speedY += this.gravity * deltaTime
		this.speedY = Math.min(Math.max(-this.maxSpeedY, this.speedY), this.maxSpeedY)
		this.y += this.speedY * deltaTime
	}
	customAction = () => {

	}
	drawAnimation = () => {
		let {x, y, direction} = this
		let {frame, time, speed, frames, directional} = this.animation

		time = (time + speed * deltaTime) % frames.length
		frame = Math.floor(time)
		let image = frames[frame]
		let imageDirection = direction === -1 ? 'Left' : 'Right'
		if (directional) image += imageDirection
		drawSprite(image, x - 8 - camera.left, y - 16)

		this.animation.time = time
		this.animation.frame = frame
	}
	changeAnimation = (animationName) => {
		if (this.animation.name === animationName) return
		if (!animations[animationName]) return
		this.animation = {...animations[animationName]}
	}
	die = () => {
		if (this.dead) return
		this.dead = true
		this.animation = {...animations[`${this.animation.name}Dead`]}
		this.acceleration = 0
		this.maxSpeedY = 400
		this.gravity = 1000
		this.ignoreBlocks = true
		this.onFloor = false
		this.speedX = 0
		this.speedY = -120
	}
	despawn = () => {
		level.characters?.splice(level.characters.indexOf(this), 1)
	}
}

let player
class Player extends Character {
	constructor(x, y) {
		super (x, y, 160, 400, 500, 1000, 'playerIdle', 1, false, false)
	}
	deceleration = 1200
	jumpStrength = 400
	jumpEnabled = false
	jumpCancelEnabled = true
	pizzas = 0
	landed = () => {
		this.deceleration = 1500
		this.jumpCancelEnabled = true
	}
	fell = () => {
		this.deceleration = 100
		this.jumpEnabled = false
	}
	jump = () => {
		if (this.dead) return
		if (!this.onFloor) return
		if (!this.jumpEnabled) return
		this.speedY = -this.jumpStrength
		this.onFloor = false
		this.jumpEnabled = false
		this.deceleration = 100
		playSound('jump')
	}
	jumpCancel = () => {
		if (this.dead) return
		if (this.speedY >= 0) return
		if (!this.jumpCancelEnabled) return
		this.speedY *= 0.5
		this.jumpCancelEnabled = false
	}
	moveX = () => {
		this.x += this.speedX * deltaTime
		if (this.speedX < 0) this.direction = -1
		if (this.speedX > 0) this.direction = 1
	}
	moveLeft = () => {
		if (this.dead) return
		this.speedX = Math.max(-this.maxSpeedX, this.speedX - this.acceleration * deltaTime)
	}
	moveRight = () => {
		if (this.dead) return
		this.speedX = Math.min(this.speedX + this.acceleration * deltaTime, this.maxSpeedX)
	}
	stop = () => {
		if (this.speedX < 0) this.speedX = Math.min(this.speedX + this.deceleration * deltaTime, 0)
		else if (this.speedX > 0) this.speedX = Math.max(0, this.speedX - this.deceleration * deltaTime)
	}
	die = (hole = false) => {
		if (this.dead) return
		if (this.invincible && !hole) return
	
		deaths++
		this.dead = true
		this.ignoreBlocks = true
		this.onFloor = false
		this.speedX = 0
		playSound('ouch')
		if (!hole) this.speedY = -240
		window.setTimeout(() => {
			resetLevel()
		}, 2000)
	}
}

let enemyClasses = {
	Fly: class extends Character {
		constructor(x, y) {
			super (x, y, 48, 200, 500, 600, 'fly', -1, false, false)
		}
		landed = () => {
			this.onFloor = false
			this.speedY = -200
		}
		hitWallLeft = () => {
			this.direction = 1
		}
		hitWallRight = () => {
			this.direction = -1
		}
	},
	FlyingFly: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 120, 0, -200, 'fly', -1, false, true)
		}
		customAction = () => {
			if (this.speedY >= this.maxSpeedY) this.gravity = -200
			else if (this.speedY <= -this.maxSpeedY) this.gravity = 200

			if (this.x < player.x - 8) this.direction = 1
			else if (this.x > player.x + 8) this.direction = -1
		}
	},
	HoveringFly: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 24, 0, -200, 'fly', -1, false, true)
		}
		customAction = () => {
			if (this.speedY >= this.maxSpeedY) this.gravity = -200
			else if (this.speedY <= -this.maxSpeedY) this.gravity = 200

			if (this.x < player.x - 8) this.direction = 1
			else if (this.x > player.x + 8) this.direction = -1
		}
	},
	Cockroach: class extends Character {
		constructor(x, y) {
			super (x, y, 40, 400, 500, 1000, 'cockroach', -1, false, false)
		}
		hitWallLeft = () => {
			this.direction = 1
		}
		hitWallRight = () => {
			this.direction = -1
		}
	},
	SpikeFloor: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 0, 0, 0, 'spikeFloor', -1, true, false)
		}
	},
	SpikeCeiling: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 0, 0, 0, 'spikeCeiling', -1, true, false)
		}
	},
	Fish: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 400, 0, 500, 'fish', -1, true, true)
		}
		customAction = () => {
			this.direction = this.speedY < 0 ? -1 : 1
			if (this.y >= 320) {
				this.y = 272
				this.speedY = -400
			}
		}
	},
	Ghost: class extends Character {
		constructor(x, y) {
			super (x, y, 500, 100, 0, -400, 'ghost', -1, true, true)
		}
		customAction = () => {
			this.speedX = Math.min(-64, camera.speed - 32)

			if (this.speedY >= this.maxSpeedY) this.gravity = -400
			else if (this.speedY <= -this.maxSpeedY) this.gravity = 400
		}
	},
	ReverseGhost: class extends Character {
		constructor(x, y) {
			super (x, y, 500, 100, 0, -400, 'ghost', 1, true, true)
		}
		teleportLeft = true
		customAction = () => {
			if (this.teleportLeft) {
				this.x = camera.left - 8
				this.teleportLeft = false
			}

			this.speedX = Math.max(128, camera.speed + 64)

			if (this.speedY >= this.maxSpeedY) this.gravity = -400
			else if (this.speedY <= -this.maxSpeedY) this.gravity = 400
		}
	},
	AngryGhost: class extends Character {
		constructor(x, y) {
			super (x, y, 160, 120, 400, -400, 'ghost', -1, true, true)
		}
		teleportLeft = true
		customAction = () => {
			if (this.teleportLeft) {
				this.x = camera.left - 8
				this.teleportLeft = false
			}

			this.targetSpeed = Math.min(Math.max(40, Math.abs(this.x - player.x) * 8), 180)
			this.lerp = 1 - 0.1 ** deltaTime
			this.maxSpeedX += (this.targetSpeed - this.maxSpeedX) * this.lerp

			if (this.x < player.x - 4) this.direction = 1
			else if (this.x > player.x + 4) this.direction = -1

			if (this.y < player.y - 16) this.gravity = 400
			else if (this.y > player.y - 8) this.gravity = -400
		}
	},
	JumpingFire: class extends Character {
		constructor(x, y) {
			super (x, y, 0, 520, 0, 800, 'jumpingFire', -1, true, true)
		}
		customAction = () => {
			this.direction = this.speedY < 0 ? -1 : 1
			if (this.y >= 320) {
				this.y = 272
				this.speedY = -520
			}
		}
	},
	Firebar: class extends Character {
		constructor(x, y, distance = 2, spawn = true) {
			super (x, y, 0, 0, 0, 0, 'firebar', -1, true, true)
			this.originX = x
			this.originY = y
			this.distance = distance
			this.spawn = spawn
		}
		customAction = () => {
			if (this.spawn) {
				level.characters.unshift(new enemyClasses.Firebar(this.x, this.y, 8, false))
				level.characters.unshift(new enemyClasses.Firebar(this.x, this.y, 14, false))
				level.characters.unshift(new enemyClasses.Firebar(this.x, this.y, 20, false))
				this.spawn = false
			}
			let angle = gameTime * 2 % Math.PI * 2
			this.x = this.originX + this.distance * 2 * Math.sin(angle)
			this.y = this.originY + this.distance * 2 * Math.cos(angle)
		}
	},
	Fireball: class extends Character {
		constructor(x, y) {
			super (x, y, 120, 300, 1000, 1000, 'firebar', -1, true, false)
		}
		landed = () => {
			this.onFloor = false
			this.speedY = -200
		}
		hitWallLeft = () => {
			this.despawn()
		}
		hitWallRight = () => {
			this.despawn()
		}
	},
	Boss: class extends Character {
		constructor(x, y) {
			super (x, y, 64, 400, 280, 500, 'bossMoving', -1, false, false)
			this.originX = x
			this.targetX = x
		}
		movementLimit = 24
		movementDirection = -1
		jumpTimer = 1
		fireTimer = 0.25
		customAction = () => {
			// Change movement direction
			if (this.x < this.originX - this.movementLimit) {
				this.movementDirection = 1
			}
			else if (this.x > this.originX + this.movementLimit) {
				this.movementDirection = -1
			}

			// Turn towards player direction
			if (this.x < player.x - 4) this.direction = 1
			else if (this.x > player.x + 4) this.direction = -1

			// Jump
			if (this.jumpTimer > 0) this.jumpTimer -= deltaTime
			if (this.jumpTimer <= 0 && this.onFloor) {
				this.onFloor = false
				this.speedY = -200
				this.changeAnimation('bossJump')
			}

			// Throw fireball
			if (this.fireTimer > 0) this.fireTimer -= deltaTime
			if (this.fireTimer <= 0 && !this.dead && !player.dead) {
				let fireball = new enemyClasses.Fireball(this.x + this.direction * 14, this.y)
				fireball.direction = this.direction
				level.characters.push(fireball)
				switch (Math.floor(Math.random() * 5)) {
					case 0: this.fireTimer = 0.2; break;
					case 1: this.fireTimer = 1; break;
					case 2: this.fireTimer = 1; break;
					case 3: this.fireTimer = 1; break;
					case 4: this.fireTimer = 2; break;
				}
			}
		}
		moveX = () => {
			if (!this.onFloor) {
				this.speedX -= this.speedX * deltaTime * 2
			}
			else {
				this.speedX += this.acceleration * this.movementDirection * deltaTime
				this.speedX = Math.min(Math.max(-this.maxSpeedX, this.speedX), this.maxSpeedX)
			}

			this.x += this.speedX * deltaTime
		}
		landed = () => {
			this.changeAnimation('bossMoving')
			switch (Math.floor(Math.random() * 4)) {
				case 0: this.jumpTimer = 0.25; break;
				case 1: this.jumpTimer = 0.5; break;
				case 2: this.jumpTimer = 0.5; break;
				case 3: this.jumpTimer = 1; break;
			}
		}
		die = () => {
			if (this.dead) return

			stopTime = true
			player.dead = false
			player.invincible = true
			player.ignoreBlocks = false
			player.speedX = 0
			player.moveLeft = () => {}
			player.moveRight = () => {}
			player.jump = () => {}
			this.changeAnimation('bossDead')
			this.dead = true
			this.ignoreBlocks = true
			this.onFloor = false
			this.speedX = 0
			this.speedY = -80
			stopMusic()
			window.setTimeout(() => {
				collectedpizzas += player.pizzas
				context.textAlign = 'center'
				context.strokeText('Level complete!', 128, 128)
				context.fillText('Level complete!', 128, 128)
				level = null
				playSound('victory')
			}, 2000)
			window.setTimeout(() => loadLevel(levelJSON.nextLevel), 6200)
		}
	}
}

// Camera
let camera = {
	x: 0,
	left: 0,
	right: 0,
	oldX: 0,
	speed: 0,
	moveCamera: () => {
		camera.x = Math.min(Math.max(128, player.x), levelWidth - 128)
		camera.left = camera.x - 128
		camera.right = camera.x + 128
		camera.speed = (camera.x - camera.oldX) / deltaTime
		camera.oldX = camera.x
	}
}

// Keyboard controls
let pressedKeys = []

window.addEventListener('keydown', ({code}) => {
	if (!pressedKeys.includes(code)) pressedKeys.push(code)
})

window.addEventListener('keyup', ({code}) => {
	pressedKeys.splice(pressedKeys.indexOf(code), 1)
})

// Touch controls
window.addEventListener('contextmenu', event => {
	event.preventDefault()
})

window.addEventListener('touchstart', function enableTouch() {
	document.body.classList.add('touch-enabled')
	window.removeEventListener('touchstart', enableTouch)
})

let touchButtons = []

function checkTouchButtons(event) {
	// event.preventDefault()
	touchButtons = []
	for(let i = 0; i < event.touches.length; i++) {
		let target = document.elementFromPoint(event.touches[i].clientX, event.touches[i].clientY)
		if (target) touchButtons.push(target.dataset.button)
	}
}

let leftInputs = ['ArrowLeft', 'KeyA', 'ButtonLeft']
let rightInputs = ['ArrowRight', 'KeyD', 'ButtonRight']
let jumpInputs = ['ArrowUp', 'KeyW', 'Space', 'ButtonJump']
let inputs = []

window.addEventListener('touchstart', checkTouchButtons)
window.addEventListener('touchmove', checkTouchButtons)
window.addEventListener('touchend', checkTouchButtons)

// Levels
let loading = false
let level
let levelFile
let levelJSON
let levelWidth
let backgroundRepeat
let gameTime = 0
let stopTime = false
let totalpizzas = 0
let collectedpizzas = 0
let deaths = 0

let gameOverLevel = {
	spawnX: 128,
	spawnY: 224,
	background: 'night',
	enemies: [],
	blocks: [
		'','','','','','','','','','','',
		'  v          v  ',
		'  w          w  ',
		'9aw        8aw 8',
		'1111111111111111',
		'2222222222222222'
	]
}

async function loadLevel(fileName) {
	if (loading) return
	titleScreen = false
	loading = true
	level = null
	titleScreen = false
	canvas.removeEventListener('click', loadTitleScreen)
	canvas.removeEventListener('click', startGame)
	stopMusic()

	try {
		levelFile = await fetch(`levels/${fileName}.json`)
		levelJSON = await levelFile.json()
		context.font = '16px potato-pixel'
		context.fillStyle = '#111'
		context.fillRect(0,0,256,256)
		context.textAlign = 'center'
		context.fillStyle = '#eee'
		context.fillText(levelJSON.name, 128, 128)
		stopTime = false
	}
	catch(error) {
		levelJSON = gameOverLevel
		stopTime = true
		canvas.addEventListener('click', loadTitleScreen)
	}

	levelJSON.blocks = levelJSON.blocks.map(row => Array.from(row))
	if (levelJSON.water) levelJSON.water = Array.from(levelJSON.water)
	if (levelJSON.lava) levelJSON.lava = Array.from(levelJSON.lava)
	levelWidth = Math.max(...levelJSON.blocks.map(row => row.length)) * 16
	backgroundRepeat = Math.ceil((levelWidth - 256) / 2560) + 1
	if (levelJSON.pizzas) totalpizzas += levelJSON.pizzas.length
	preloadMusic(levelJSON.music)

	let levelNameTime = levelJSON === gameOverLevel ? 0 : 3000

	window.setTimeout(() =>{
		loading = false
		frameFix = true
		level = JSON.parse(JSON.stringify(levelJSON))
		player = new Player(level.spawnX, level.spawnY)
		level.characters = [player]
		camera.moveCamera()
		playMusic()

		window.requestAnimationFrame(gameFrames)
	}, levelNameTime)
}
 
function resetLevel() {
	level = JSON.parse(JSON.stringify(levelJSON))
	player = new Player(level.spawnX, level.spawnY)
	level.characters = [player]
	camera.moveCamera()
}

// Time variables
let deltaTime = 0
let previousTime = 0
let fpsAverage = [0,0,0,0,0]
let fps = 0
let frameFix = true

function formatTime(time, decimalPlaces = 1) {
	powerOf10 = 10 ** decimalPlaces
	let hours = Math.floor(time / 3600)
	let minutes = Math.floor(time % 3600 / 60)
	let seconds = Math.floor(time % 3600 % 60)
	let milisseconds = `.${Math.floor(time % 1 * powerOf10).toString().padStart(decimalPlaces, 0)}`

	if (hours || minutes) seconds = `:${(seconds).toString().padStart(2, 0)}`
	if (hours) minutes = `:${(minutes).toString().padStart(2, 0)}`

	let formattedTime = ''
	if (hours) formattedTime += hours
	if (minutes) formattedTime += minutes
	formattedTime += seconds
	formattedTime += milisseconds

	return formattedTime
}

window.addEventListener('visibilitychange', ({timestamp}) => {
	frameFix = true
	pressedKeys = []
	touchButtons = []
})

// Game events
function gameFrames(currentTime) {
	if (!level) return

	if (frameFix) {
		previousTime = currentTime - 1
		frameFix = false
	}

	deltaTime = (currentTime - previousTime) / 1000
	previousTime = currentTime
	fpsAverage.pop()
	fpsAverage.unshift(1 / deltaTime)
	fps = Math.round(fpsAverage.reduce((a, b) => a + b) / fpsAverage.length)
	if (!stopTime) gameTime += deltaTime

	// Player controls
	inputs = pressedKeys.concat(touchButtons)

	// Move
	let moveLeft = leftInputs.some(input => inputs.includes(input))
	let moveRight = rightInputs.some(input => inputs.includes(input))

	if (moveLeft && !moveRight) {
		player.moveLeft()
	}
	else if (!moveLeft && moveRight) {
		player.moveRight()
	}
	
	// Stop
	if (player.dead) {
		player.stop()
	}
	else if (moveLeft === moveRight) {
		player.stop()
	}
	else if (moveLeft && player.speedX > 0) {
		player.stop()
	}
	else if (moveRight && player.speedX < 0) {
		player.stop()
	}

	// Jump
	if (jumpInputs.some(input => inputs.includes(input))) {
		player.jump()
	}

	// Re-enable jump
	if (!jumpInputs.some(input => inputs.includes(input)) && player.onFloor && !player.jumpEnabled) {
		player.jumpEnabled = true 
	}

	// Jump cancel
	if (!jumpInputs.some(input => inputs.includes(input))) {
		player.jumpCancel()
	}

	// Fall into hole
	if (player.y > 272) {
		player.die(true)
	}

	// Character functions
	level.characters?.forEach(character => {
		if (!character.dead) character.customAction()
		character.moveY()
		character.checkCeiling()
		character.checkFall()
		character.checkLanded()
		character.moveX()
		character.checkWalls()
	})

	// Move camera
	camera.moveCamera()

	// Player animations
	if (player.dead) player.changeAnimation('playerDead')
	else if (!player.onFloor) player.changeAnimation('playerJump')
	else if (player.speedX === 0) player.changeAnimation('playerIdle')
	else {
		player.changeAnimation('playerMoving')
		player.animation.speed = Math.abs(player.speedX / 13)
	}

	// Shared animation
	sharedAnimations.forEach(animation => {
		animation.time = (animation.time + animation.speed * deltaTime) % animation.frames.length
		animation.frame = Math.floor(animation.time)
	})

	// Pick pizzas
	level.pizzas?.forEach((pizza, index) => {
		if (player.dead) return
		if (Math.abs(pizza.x - player.x) > 10 || Math.abs(pizza.y - player.y) > 10) return
		level.pizzas.splice(index, 1)
		player.pizzas += 1
		playSound('glug')
	})

	// Spawn enemies
	level.enemies?.forEach((enemy, index) => {
		let {name, x, y} = enemy
		let distance = name === 'Firebar' ? 40 : 8
		if (x > camera.right + distance || x < camera.left - distance) return
		let newEnemy = new enemyClasses[name](x, y)
		level.characters.unshift(newEnemy)
		level.enemies.splice(index, 1)
	})

	// Despawn enemies
	level.characters?.forEach(character => {
		if (character.y > 512) character.despawn()
	})

	// Collision with enemies
	level.characters?.filter(character => character !== player).forEach(enemy => {
		if (enemy.dead || player.dead) return
		if (Math.abs(enemy.x - player.x) > 12 || Math.abs(enemy.y - player.y) > 12) return
		else if (enemy.invincible || player.speedY <= 0 || player.y >= enemy.y) player.die()
		else {
			enemy.die()
			playSound('stomp')
			player.speedY = -player.jumpStrength
			player.jumpCancelEnabled = true
		}
	})

	// Draw background
	context.fillStyle = '#111'
	context.fillRect(0,0,256,256)

	for (let i = 0; i < backgroundRepeat; i++) {
		drawSprite(level.background, -0.1 * camera.left + i * 256, 0, 2)
	}

	// Draw level blocks
	for (let y = 0; y < 16; y++) {
		for (let x = Math.floor(camera.left / 16); x <= Math.floor(camera.right / 16); x++) {
			let block = parseInt(level.blocks[y][x], 36)
			if (block) drawSprite(blocks[block], x * 16 - camera.left, y * 16)
		}
	}

	// Draw pizzas
	level.pizzas?.forEach(pizza => {
		drawSprite(animations.pizza.frames[animations.pizza.frame], pizza.x - 8 - camera.left, pizza.y - 16)
	})

	// Draw flag
	drawSprite(animations.flag.frames[animations.flag.frame], level.endX - 8 - camera.left, level.endY - 16)

	// Draw characters
	level.characters?.forEach(character => {
		character.drawAnimation()
	})

	// Draw water
	level.water?.forEach((water, index) => {
		if (!parseInt(water)) return
		drawSprite(animations.water.frames[animations.water.frame], index * 16 - camera.left, 240)
	})

	// Draw lava
	level.lava?.forEach((lava, index) => {
		if (!parseInt(lava)) return
		drawSprite(animations.lava.frames[animations.lava.frame], index * 16 - camera.left, 240)
	})

	// HUD
	context.fillStyle = '#eee'
	context.textAlign = 'left'

	if (levelJSON !== gameOverLevel) {
		drawSprite('pizza0', 0, 0)
		context.strokeText(player.pizzas + collectedpizzas, 18, 7)
		context.fillText(player.pizzas + collectedpizzas, 18, 7)
		let displayTime = formatTime(gameTime)
		drawSprite('clock', 48, 0)
		context.strokeText(displayTime, 66, 7)
		context.fillText(displayTime, 66, 7)
	}

	else {
		context.fillStyle = gradient
		context.fillRect(0,0, 256, 256)
		context.fillStyle = '#eee'
		let displayTime = formatTime(gameTime, 2)
		let displaypizzas = `${collectedpizzas}/${totalpizzas}`
		let textPosition = 136 - Math.max(context.measureText(displayTime).width, context.measureText(displaypizzas).width, context.measureText(deaths).width) / 2
		let iconPosition = textPosition - 18
		drawSprite('pizza0', iconPosition, 24)
		context.strokeText(displaypizzas, textPosition, 32)
		context.fillText(displaypizzas, textPosition, 32)
		drawSprite('clock', iconPosition, 40)
		context.strokeText(displayTime, textPosition, 48)
		context.fillText(displayTime, textPosition, 48)
		drawSprite('skull', iconPosition, 56)
		context.strokeText(deaths, textPosition, 64)
		context.fillText(deaths, textPosition, 64)

		if (new Date().getMilliseconds() % 250 < 150) {
			context.textAlign = 'center'
	
			context.strokeText('Play again?', 128, 128)
			context.fillText('Play again?', 128, 128)
		}
	}

	// Debug
	if (debug) {
		context.strokeText(`FPS: ${fps}`, 4, 20)
		context.fillText(`FPS: ${fps}`, 4, 20)
		context.strokeText(`Inputs: ${inputs.join(', ')}`, 4, 32)
		context.fillText(`Inputs: ${inputs.join(', ')}`, 4, 32)
		context.strokeText(`X:${Math.round(player.x)} Y:${Math.round(player.y)}`, 4, 44)
		context.fillText(`X:${Math.round(player.x)} Y:${Math.round(player.y)}`, 4, 44)
	}

	// End level flag
	if (!player.dead && Math.abs(player.x - level.endX) < 12 && Math.abs(player.y - level.endY) < 12) {
		collectedpizzas += player.pizzas
		context.textAlign = 'center'
		context.strokeText('Level complete!', 128, 128)
		context.fillText('Level complete!', 128, 128)
		level = null
		stopMusic()
		playSound('victory')
		window.setTimeout(() => loadLevel(levelJSON.nextLevel), 4200)
	}

	// Call next frame
	window.requestAnimationFrame(gameFrames)
}
