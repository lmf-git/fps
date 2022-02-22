import { MathUtils,	Spherical, Vector3 } from 'three';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

export class FirstPersonControls {

	constructor(object, domElement) {
		this.object = object;
		this.domElement = domElement;

		this.enabled = true;

		this.movementSpeed = 1.0;
		this.lookSpeed = 0.005;

		this.lookVertical = true;
		this.autoForward = false;

		this.activeLook = true;

		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.mouseDragOn = false;

		// internals
		this.autoSpeedFactor = 0.0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.viewHalfX = 0;
		this.viewHalfY = 0;

		// private variables
		let lat = 0;
		let lon = 0;

		this.handleResize = function () {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		};

		this.onMouseMove = function (event) {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		};

		this.lookAt = function (x, y, z) {
			if (x.isVector3) {
				_target.copy(x);
			} else {
				_target.set(x, y, z);
			}

			this.object.lookAt(_target);

			setOrientation(this);

			return this;
		};

		this.update = function () {
			const targetPosition = new Vector3();

			return function update(delta) {
				if (this.enabled === false) return;

				if (this.heightSpeed) {
					const y = MathUtils.clamp(this.object.position.y, this.heightMin, this.heightMax);
					const heightDelta = y - this.heightMin;

					this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

				} else {
					this.autoSpeedFactor = 0.0;
				}

				let actualLookSpeed = delta * this.lookSpeed;

				if (!this.activeLook) {
					actualLookSpeed = 0;
				}

				let verticalLookRatio = 1;

				if (this.constrainVertical) {
					verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
				}

				lon -= this.mouseX * actualLookSpeed;
				if (this.lookVertical) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

				lat = Math.max(- 85, Math.min(85, lat));

				let phi = MathUtils.degToRad(90 - lat);
				const theta = MathUtils.degToRad(lon);

				if (this.constrainVertical) {
					phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
				}

				const position = this.object.position;

				targetPosition.setFromSphericalCoords(1, phi, theta).add(position);

				this.object.lookAt(targetPosition);
			};

		}();

		this.dispose = function () {
			this.domElement.removeEventListener('mousemove', _onMouseMove);
		};

		const _onMouseMove = this.onMouseMove.bind(this);

		this.domElement.addEventListener('mousemove', _onMouseMove);

		function setOrientation(controls) {
			const quaternion = controls.object.quaternion;

			_lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
			_spherical.setFromVector3(_lookDirection);

			lat = 90 - MathUtils.radToDeg(_spherical.phi);
			lon = MathUtils.radToDeg(_spherical.theta);
		}

		this.handleResize();

		setOrientation(this);
	}
}
