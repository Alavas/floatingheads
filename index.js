require('./index.scss')
const joystick = require('nipplejs')
const Ship = require('./Components/Ship')
const _ = require('lodash')

//Global variables.
var connection
var opponentShip
var playerShip
var isPlayerOne = true

//Wait until the peerjs file has been loaded.
window.addEventListener('load', () => {
	const vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty('--vh', `${vh}px`)
	const peerForm = document.getElementById('peer-id-form')
	const peerIDInput = document.getElementById('peer-id')
	const playArea = document.getElementById('play-area')
	const playAreaHeight = playArea.offsetHeight
	const playAreaWidth = playArea.offsetWidth
	let playerOneBase = {
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
	let playerOne = new Proxy(playerOneBase, {
		get: (target, prop) => {
			return Reflect.get(target, prop)
		},
		set: (target, prop, value) => {
			if (prop === 'health') {
				console.log({ type: 'set', target, prop, value })
			}
			return Reflect.set(target, prop, value)
		}
	})
	let playerTwoBase = {
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
	let playerTwo = new Proxy(playerTwoBase, {
		get: (target, prop) => {
			return Reflect.get(target, prop)
		},
		set: (target, prop, value) => {
			if (prop === 'health') {
				console.log({ type: 'set', target, prop, value })
			}
			return Reflect.set(target, prop, value)
		}
	})
	const options = {
		zone: document.getElementById('left-joystick'),
		mode: 'static',
		position: { left: '25%', top: '50%' },
		color: '#020000',
		threshold: 0.3,
		multitouch: true
	}
	/*
	const peer = new Peer(null, { debug: 2 })
	peer.on('open', id => {
		console.log('Peer ID:', id)
	})
	//Receiving player, you are playerTwo.
	peer.on('connection', conn => {
		//Set the global variable connection equal to the client connection.
		connection = conn
		isPlayerOne = false
		playerShip = new Ship(playerTwo, true)
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
						target: playerTwo
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
	*/
	//REMOVE BELOW
	opponentShip = new Ship(playerTwo, false)
	playerShip = new Ship(playerOne, true)
	//Form to get ID of peer, you are playerOne.
	peerForm.addEventListener('submit', e => {
		e.preventDefault()
		const opponentID = peerIDInput.value
		peerForm.reset()
		//Connect to the opponent.
		connection = peer.connect(opponentID)
		connection.on('open', () => {
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
						target: playerOne
					})
					break
				case 'move':
					opponentShip.move(playerTwo)
					break
				default:
					break
			}
		})
	})

	const leftJoystick = joystick.create(options)

	leftJoystick.on('move', (e, joystick) => {
		if (isPlayerOne) {
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
		playerShip.move(isPlayerOne ? playerOne : playerTwo)
		if (!_.isUndefined(connection)) {
			connection.send({
				action: 'move',
				payload: isPlayerOne ? playerOne : playerTwo
			})
		}
	})

	//Handle button presses to fire blasters.
	const rightTrigger = document.getElementById('trigger')
	rightTrigger.addEventListener('touchstart', () => {
		//Check to see if there are any available blaster shots.
		if (isPlayerOne ? playerOne.shots > 0 : playerTwo.shots > 0) {
			playerShip.fire({
				shooter: isPlayerOne ? playerOne : playerTwo,
				target: isPlayerOne ? playerTwo : playerOne
			})
			if (!_.isUndefined(connection)) {
				connection.send({
					action: 'fire',
					payload: isPlayerOne ? playerOne : playerTwo
				})
			}
		}
		rightTrigger.classList.add('fired')
	})
	rightTrigger.addEventListener('touchend', () => {
		rightTrigger.classList.remove('fired')
	})
})
