class Blaster {
	constructor(ship) {
		this._base = document.createElement('div')
		const shotSVG = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		)
		const left = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'line'
		)
		const right = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'line'
		)
		this._base.appendChild(shotSVG)
		shotSVG.appendChild(left)
		shotSVG.appendChild(right)
		shotSVG.setAttributeNS(null, 'width', '1')
		shotSVG.setAttributeNS(null, 'height', '1')
		shotSVG.setAttributeNS(null, 'style', 'overflow: visible;display:block;')
		left.setAttributeNS(null, 'x1', '-12.5')
		left.setAttributeNS(null, 'y1', '-25')
		left.setAttributeNS(null, 'x2', '12.5')
		left.setAttributeNS(null, 'y2', '-25')
		right.setAttributeNS(null, 'x1', '-12.5')
		right.setAttributeNS(null, 'y1', '25')
		right.setAttributeNS(null, 'x2', '12.5')
		right.setAttributeNS(null, 'y2', '25')
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
	fire(target, player) {
		this.move(target, player)
	}
	move(target, player) {
		this._x = this._x + parseFloat((Math.cos(this._radians) * 5).toFixed(2))
		this._y = this._y + parseFloat((Math.sin(this._radians) * 5).toFixed(2))
		this._base.style.left = `${this._x}px`
		this._base.style.bottom = `${this._y}px`
		const blaster = this._base.getBoundingClientRect()
		const blasterTarget = document
			.getElementById(target.id)
			.lastElementChild.getBoundingClientRect()
		//TODO: Recalculate the hit based on radius.
		const hit =
			blaster.top > blasterTarget.bottom ||
			blaster.right < blasterTarget.left ||
			blaster.bottom < blasterTarget.top ||
			blaster.left > blasterTarget.right
		if (!hit) {
			target.health = target.health - 5
			if (player) {
				document.getElementById('health').lastElementChild.innerHTML =
					target.health
			} else {
				document.getElementById(
					'opponent-health'
				).lastElementChild.innerHTML = target.health
			}
			this.remove()
			return
		}
		if (
			this._x < -50 ||
			this._x > this._playAreaWidth ||
			this._y < -50 ||
			this._y > this._playAreaHeight
		) {
			this.remove()
			return
		}
		requestAnimationFrame(() => this.move(target, player))
	}
	remove() {
		const playArea = document.getElementById('play-area')
		playArea.removeChild(this._base)
	}
}

module.exports = Blaster
