const Blaster = require('./Blaster')
const PlayerOneShip = require('../Assets/PlayerOneShip.svg')
const PlayerTwoShip = require('../Assets/PlayerTwoShip.svg')
const EngineFlame = require('../Assets/EngineFlame.svg')
const wOffset = 40
const hOffset = 40

class Ship {
	constructor(state, player) {
		this._state = state
		const playArea = document.getElementById('play-area')
		this._ship = document.createElement('div')
		const target = document.createElement('div')
		target.setAttribute('class', 'target-zone')
		this._ship.appendChild(target)
		this._ship.setAttribute('class', 'control-target')
		const shipBody = document.createElement('img')
		shipBody.setAttribute(
			'src',
			state.id === 'playerOne' ? PlayerOneShip : PlayerTwoShip
		)
		shipBody.setAttribute('class', 'ship-body')
		this._ship.appendChild(shipBody)
		this._flame = document.createElement('img')
		this._flame.setAttribute('src', EngineFlame)
		this._flame.setAttribute('class', 'ship-flame')
		this._ship.appendChild(this._flame)
		playArea.appendChild(this._ship)
		this._ship.style.bottom = `${this._state.bottom}px`
		this._ship.style.left = `${this._state.left}px`
		this._ship.style.transform = `rotate(-${this._state.degrees}deg)`
		this._ship.setAttribute('id', this._state.id)
		this._player = player
	}
	move(state) {
		this._ship.style.transform = `rotate(-${state.degrees}deg)`
		if (state.rawDistance > 25) {
			this._flame.style.visibility = 'visible'
			const x = (Math.cos(state.radians) * state.distance).toFixed(2)
			const y = (Math.sin(state.radians) * state.distance).toFixed(2)
			state.left = state.left + parseFloat(x)
			state.bottom = state.bottom + parseFloat(y)
			if (state.left > state.playAreaWidth + wOffset) {
				state = Object.assign(state, {
					bottom:
						state.bottom - Math.tan(state.radians) * state.playAreaWidth,
					left: -50
				})
			} else if (state.left < -50) {
				state = Object.assign(state, {
					bottom:
						state.bottom + Math.tan(state.radians) * state.playAreaWidth,
					left: state.playAreaWidth + wOffset
				})
			}
			if (state.bottom > state.playAreaHeight + hOffset) {
				state = Object.assign(state, {
					left:
						state.left - Math.tan(state.cRadians) * state.playAreaHeight,
					bottom: -50
				})
			} else if (state.bottom < -50) {
				state = Object.assign(state, {
					left:
						state.left + Math.tan(state.cRadians) * state.playAreaHeight,
					bottom: state.playAreaHeight + hOffset
				})
			}
			this._ship.style.left = `${state.left}px`
			this._ship.style.bottom = `${state.bottom}px`
		} else if (state.rawDistance < 25) {
			this._flame.style.visibility = 'hidden'
		}
	}
	fire({ shooter, target, gameState }) {
		if (this._player) {
			const blaster = new Blaster(shooter)
			blaster.fire(target, this._player, gameState)
			shooter = Object.assign(shooter, { shots: shooter.shots - 1 })
			const shots = document.getElementById('shots').lastElementChild
			shots.innerHTML = shooter.shots
			setTimeout(() => {
				shooter.shots = shooter.shots + 1
				shots.innerHTML = shooter.shots
			}, 3000)
		} else {
			const blaster = new Blaster(shooter)
			blaster.fire(target, this._player, gameState)
			shooter = Object.assign(shooter, { shots: shooter.shots - 1 })
		}
	}
}

module.exports = Ship
