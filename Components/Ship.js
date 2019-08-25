const Blaster = require('./Blaster')

class Ship {
	constructor(state, player) {
		this._state = state
		const playArea = document.getElementById('play-area')
		this._ship = document.createElement('div')
		this._ship.setAttribute('class', 'control-target')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttributeNS(null, 'height', '1')
		svg.setAttributeNS(null, 'width', '1')
		svg.setAttributeNS(null, 'style', 'overflow: visible;display:block;')
		const polygon = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'polygon'
		)
		polygon.setAttributeNS(null, 'points', '-25,-25 -25,25 25,0')
		polygon.setAttributeNS(
			null,
			'style',
			`fill:${state.color};stroke:${state.color};stroke-width:1`
		)
		svg.appendChild(polygon)
		this._ship.appendChild(svg)
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
			const x = (Math.cos(state.radians) * state.distance).toFixed(2)
			const y = (Math.sin(state.radians) * state.distance).toFixed(2)
			state.left = state.left + parseFloat(x)
			state.bottom = state.bottom + parseFloat(y)
			if (state.left > state.playAreaWidth) {
				state = Object.assign(state, {
					bottom:
						state.bottom - Math.tan(state.radians) * state.playAreaWidth,
					left: -50
				})
			} else if (state.left < -50) {
				state = Object.assign(state, {
					bottom:
						state.bottom + Math.tan(state.radians) * state.playAreaWidth,
					left: state.playAreaWidth
				})
			}
			if (state.bottom > state.playAreaHeight) {
				state = Object.assign(state, {
					left:
						state.left - Math.tan(state.cRadians) * state.playAreaHeight,
					bottom: -50
				})
			} else if (state.bottom < -50) {
				state = Object.assign(state, {
					left:
						state.left + Math.tan(state.cRadians) * state.playAreaHeight,
					bottom: state.playAreaHeight
				})
			}
			this._ship.style.left = `${state.left}px`
			this._ship.style.bottom = `${state.bottom}px`
		}
	}
	fire({ shooter, target }) {
		if (this._player) {
			const blaster = new Blaster(shooter)
			blaster.fire(target, this._player)
			shooter = Object.assign(shooter, { shots: shooter.shots - 1 })
			const shots = document.getElementById('shots').lastElementChild
			shots.innerHTML = shooter.shots
			setTimeout(() => {
				shooter.shots = shooter.shots + 1
				shots.innerHTML = shooter.shots
			}, 3000)
		} else {
			const blaster = new Blaster(shooter)
			blaster.fire(target, this._player)
			shooter = Object.assign(shooter, { shots: shooter.shots - 1 })
		}
	}
}

module.exports = Ship
