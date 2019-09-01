import Vue from 'vue'
import joystick from 'nipplejs'
import Peer from 'peerjs'
import _ from 'lodash'
import StartFinish from './Components/StartFinish.vue'
import Ship from './Components/Ship'
import './index.scss'

//Global variables.
let connection
let opponentShip
let playerShip

const vH = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vH}px`)
const vW = window.innerWidth * 0.01
document.documentElement.style.setProperty('--vw', `${vW}px`)
const playArea = document.getElementById('play-area')
const playAreaHeight = playArea.offsetHeight
const playAreaWidth = playArea.offsetWidth
let gameState = {
	connected: false,
	peerID: '',
	opponentID: '',
	isPlayerOne: true,
	isPlayerOneWinner: true,
	gameOver: false
}
let playerOne = {
	id: 'playerOne',
	color: 'green',
	degrees: 45,
	distance: 0,
	rawDistance: 0,
	radians: 0.785398,
	cRadians: 0,
	bottom: 50,
	left: 50,
	playAreaWidth,
	playAreaHeight,
	shots: 10,
	health: 100
}
let playerTwo = {
	id: 'playerTwo',
	color: 'blue',
	degrees: 135,
	distance: 0,
	rawDistance: 0,
	radians: 2.35619,
	cRadians: 0,
	bottom: 50,
	left: 300,
	playAreaWidth,
	playAreaHeight,
	shots: 10,
	health: 100
}
const options = {
	zone: document.getElementById('left-joystick'),
	mode: 'static',
	position: { left: '25%', top: '50%' },
	color: '#020000',
	threshold: 0.3,
	multitouch: true
}
new Vue({
	data: gameState,
	methods: {
		connectToPeer
	},
	...StartFinish
}).$mount('#start-finish')
const peer = new Peer(null, { debug: 2 })
peer.on('open', id => {
	gameState.peerID = id
})

//Form to get ID of peer, you are playerOne.
function connectToPeer() {
	//Connect to the opponent.
	connection = peer.connect(gameState.opponentID)
	connection.on('open', () => {
		gameState.connected = true
		playerShip = new Ship(playerOne, true)
		connection.send({ action: 'init', payload: playerOne })
	})
	connection.on('data', data => {
		//Update the playerTwo object with the new data.
		playerTwo = Object.assign(playerTwo, data.payload)
		switch (data.action) {
			case 'init':
				opponentShip = new Ship(playerTwo, false)
				break
			case 'fire':
				opponentShip.fire({
					shooter: playerTwo,
					target: playerOne,
					gameState
				})
				break
			case 'move':
				opponentShip.move(playerTwo)
				break
			default:
				break
		}
	})
}
//Receiving player, you are playerTwo.
peer.on('connection', conn => {
	//Set the global variable connection equal to the client connection.
	connection = conn
	gameState.isPlayerOne = false
	playerShip = new Ship(playerTwo, true)
	gameState.connected = true
	connection.on('data', data => {
		//Update the playerOne object with the new data.
		playerOne = Object.assign(playerOne, data.payload)
		switch (data.action) {
			case 'init':
				connection.send({
					action: 'init',
					payload: playerTwo
				})
				opponentShip = new Ship(playerOne, false)
				break
			case 'fire':
				opponentShip.fire({
					shooter: playerOne,
					target: playerTwo,
					gameState
				})
				break
			case 'move':
				opponentShip.move(playerOne)
				break
			default:
				break
		}
	})
})

//Joystick
const leftJoystick = joystick.create(options)
leftJoystick.on('move', (e, joystick) => {
	if (gameState.isPlayerOne) {
		playerOne = Object.assign(playerOne, {
			degrees: joystick.angle.degree,
			radians: joystick.angle.radian,
			cRadians: Math.PI / 2 - joystick.angle.radian,
			distance: joystick.distance / 10,
			rawDistance: joystick.distance
		})
	} else {
		playerTwo = Object.assign(playerTwo, {
			degrees: joystick.angle.degree,
			radians: joystick.angle.radian,
			cRadians: Math.PI / 2 - joystick.angle.radian,
			distance: joystick.distance / 10,
			rawDistance: joystick.distance
		})
	}
	playerShip.move(gameState.isPlayerOne ? playerOne : playerTwo)
	if (!_.isUndefined(connection)) {
		connection.send({
			action: 'move',
			payload: gameState.isPlayerOne ? playerOne : playerTwo
		})
	}
})
leftJoystick.on('end', () => {
	if (gameState.isPlayerOne) {
		playerOne = Object.assign(playerOne, {
			rawDistance: 0
		})
	} else {
		playerTwo = Object.assign(playerTwo, {
			rawDistance: 0
		})
	}
	playerShip.move(gameState.isPlayerOne ? playerOne : playerTwo)
	if (!_.isUndefined(connection)) {
		connection.send({
			action: 'move',
			payload: gameState.isPlayerOne ? playerOne : playerTwo
		})
	}
})
//Handle button presses to fire blasters.
const rightTrigger = document.getElementById('trigger')
rightTrigger.addEventListener('touchstart', () => {
	//Check to see if there are any available blaster shots.
	if (gameState.isPlayerOne ? playerOne.shots > 0 : playerTwo.shots > 0) {
		playerShip.fire({
			shooter: gameState.isPlayerOne ? playerOne : playerTwo,
			target: gameState.isPlayerOne ? playerTwo : playerOne,
			gameState
		})
		if (!_.isUndefined(connection)) {
			connection.send({
				action: 'fire',
				payload: gameState.isPlayerOne ? playerOne : playerTwo
			})
		}
	}
	rightTrigger.classList.add('fired')
})
rightTrigger.addEventListener('touchend', () => {
	rightTrigger.classList.remove('fired')
})
