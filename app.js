require('babel-polyfill')
const joystick = require('nipplejs')

const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)

const playArea = document.getElementById('play-area')
const playAreaHeight = playArea.offsetHeight
const playAreaWidth = playArea.offsetWidth

const ship = document.getElementById('control-target')
let shipState = {
	degrees: 0,
	radians: 0,
	cRadians: 0,
	bottom: playAreaHeight / 2,
	left: playAreaWidth / 2,
	distance: 0,
	playAreaWidth,
	playAreaHeight
}
ship.style.bottom = `${shipState.bottom}px`
ship.style.left = `${shipState.left}px`

const leftOptions = {
	zone: document.getElementById('left-joystick'),
	mode: 'static',
	position: { left: '25%', top: '50%' },
	color: '#020000',
	threshold: 0.3,
	multitouch: true
}
const leftJoystick = joystick.create(leftOptions)

leftJoystick.on('move', (e, joystick) => {
	shipState = Object.assign(shipState, {
		degrees: joystick.angle.degree,
		radians: joystick.angle.radian,
		cRadians: Math.PI / 2 - joystick.angle.radian,
		distance: joystick.distance / 10
	})
	ship.style.transform = `rotate(-${shipState.degrees}deg)`
	if (joystick.distance > 25) {
		move()
	}
})

const rightTrigger = document.getElementById('trigger')
rightTrigger.addEventListener('touchstart', () => {
	const blaster = new Blaster(shipState)
	blaster.moveLaser()
	rightTrigger.classList.add('fired')
})
rightTrigger.addEventListener('touchend', () => {
	rightTrigger.classList.remove('fired')
})

function move() {
	const x = (Math.cos(shipState.radians) * shipState.distance).toFixed(2)
	const y = (Math.sin(shipState.radians) * shipState.distance).toFixed(2)
	shipState.left = shipState.left + parseFloat(x)
	shipState.bottom = shipState.bottom + parseFloat(y)
	if (shipState.left > playAreaWidth) {
		shipState = Object.assign(shipState, {
			bottom: shipState.bottom - Math.tan(shipState.radians) * playAreaWidth,
			left: -50
		})
	} else if (shipState.left < -50) {
		shipState = Object.assign(shipState, {
			bottom: shipState.bottom + Math.tan(shipState.radians) * playAreaWidth,
			left: playAreaWidth
		})
	}
	if (shipState.bottom > playAreaHeight) {
		shipState = Object.assign(shipState, {
			left: shipState.left - Math.tan(shipState.cRadians) * playAreaHeight,
			bottom: -50
		})
	} else if (shipState.bottom < -50) {
		shipState = Object.assign(shipState, {
			left: shipState.left + Math.tan(shipState.cRadians) * playAreaHeight,
			bottom: playAreaHeight
		})
	}
	ship.style.left = `${shipState.left}px`
	ship.style.bottom = `${shipState.bottom}px`
}

class Blaster {
	constructor(ship) {
		this._base = document.createElement('div')
		const shotSVG = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		)
		const line1 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'line'
		)
		const line2 = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'line'
		)
		this._base.appendChild(shotSVG)
		shotSVG.appendChild(line1)
		shotSVG.appendChild(line2)
		shotSVG.setAttributeNS(null, 'width', '50')
		shotSVG.setAttributeNS(null, 'height', '50')
		line1.setAttributeNS(null, 'x1', '25')
		line1.setAttributeNS(null, 'y1', '0')
		line1.setAttributeNS(null, 'x2', '50')
		line1.setAttributeNS(null, 'y2', '0')
		line2.setAttributeNS(null, 'x1', '25')
		line2.setAttributeNS(null, 'y1', '50')
		line2.setAttributeNS(null, 'x2', '50')
		line2.setAttributeNS(null, 'y2', '50')
		this._base.setAttribute('class', 'shot-div')
		this._base.style.transform = `rotate(-${ship.degrees}deg)`
		shotSVG.setAttribute('class', 'shot')
		document.getElementById('play-area').appendChild(this._base)
		this._x = ship.left
		this._y = ship.bottom
		this._radians = ship.radians
		this._playAreaHeight = ship.playAreaHeight + 50
		this._playAreaWidth = ship.playAreaWidth + 50
	}
	moveLaser() {
		this._x = this._x + parseFloat((Math.cos(this._radians) * 10).toFixed(2))
		this._y = this._y + parseFloat((Math.sin(this._radians) * 10).toFixed(2))
		this._base.style.left = `${this._x}px`
		this._base.style.bottom = `${this._y}px`
		if (
			this._x < -50 ||
			this._x > this._playAreaWidth ||
			this._y < -50 ||
			this._y > this._playAreaHeight
		) {
			const playArea = document.getElementById('play-area')
			playArea.removeChild(this._base)
			return
		}
		requestAnimationFrame(() => this.moveLaser())
	}
}
