class CircularSlider {
    constructor({ container, color, max, min, step, radius, title, strokeWidth = 20, nOfSteps = 50 }) {
        this.container = document.getElementById(container);
        this.color = color;
        this.max = max;
        this.min = min;
        this.step = step;
        this.value = min;
        this.radius = radius;
        this.title = title;
        this.strokeWidth = strokeWidth;
        this.nOfSteps = nOfSteps;
        this.elementId = Math.round(Math.random() * 1000);
        this.parentSvg = this.container.querySelector('.parent-svg');
        this.valuesSvg = this.container.querySelector('.values-svg');

        const rect = this.container.getBoundingClientRect();
        if (!this.parentSvg) {
            this.parentSvg = this.createSvgElement('svg', {
                class: 'parent-svg',
                width: rect.width,
                height: rect.height,
            });
            this.parentSvg.style.userSelect = 'none';

            this.container.appendChild(this.parentSvg);
        }

        this.cx = rect.width / 2;
        this.cy = rect.height / 2;
    }

    render() {
        this.renderElements();
        this.renderSteps();
        this.attachEventListeners();
    }

    renderElements() {
        const existingValueElements = this.parentSvg.querySelectorAll('.value-text');
        // const elementDy = existingValueElements.length * 30 + this.cy;
        const elementDy = this.radius;

        // value group contains values, colors and name of sliders
        const valueGroup = this.createSvgElement('g', { class: 'value-text' });

        const valueElement = this.createSvgElement('text', {
            dy: elementDy,
            id: `value-${this.elementId}`,
        });

        valueElement.style.fontSize = '20px';
        valueElement.textContent = this.value;
        valueGroup.appendChild(valueElement);

        const valueLegendBox = this.createSvgElement('rect', {
            width: 25,
            height: 10,
            fill: this.color,
            transform: `translate(50, ${elementDy - 10})`,
        });

        valueGroup.appendChild(valueLegendBox);

        const valueTitle = this.createSvgElement('text', {
            dy: elementDy,
            dx: 80,
            id: `value-title-${this.elementId}`,
        });

        valueTitle.style.fontSize = '20px';
        valueTitle.textContent = this.title;
        valueGroup.appendChild(valueTitle);

        this.parentSvg.appendChild(valueGroup);

        const svg = this.createSvgElement('g', { class: 'svg-container' });

        const outerCircle = this.createSvgElement('circle', {
            id: `outer-circle-${this.elementId}`,
            class: 'outer-circle',
            cx: this.cx,
            cy: this.cy,
            r: this.radius,
            stroke: 'lightGrey',
            'stroke-width': this.strokeWidth,
            fill: 'transparent',
        });

        const progressPath = this.createSvgElement('path', {
            id: `progress-${this.elementId}`,
            stroke: this.color,
            'stroke-width': this.strokeWidth,
            fill: 'transparent',
        });

        const stepsGroup = this.createSvgElement('g', {
            id: `steps-${this.elementId}`,
            stroke: 'white',
            'stroke-width': 1,
        });

        const handleCircle = this.createSvgElement('circle', {
            id: `handle-${this.elementId}`,
            cx: this.cx,
            cy: this.cy - this.radius,
            r: this.strokeWidth / 2 + Math.round(this.strokeWidth * 0.1),
            fill: 'white',
            stroke: 'lightGrey',
            'stroke-width': 1,
        });

        // add elements to svg
        svg.appendChild(outerCircle);
        svg.appendChild(progressPath);
        svg.appendChild(stepsGroup);
        svg.appendChild(handleCircle);

        this.parentSvg.appendChild(svg);
        this.container.appendChild(this.parentSvg);
    }

    renderSteps() {
        for (let i = 0; i < this.nOfSteps; i++) {
            const radian = (i * 2 * Math.PI) / this.nOfSteps - Math.PI / 2;
            const innerX = this.cx + Math.cos(radian) * (this.radius - this.strokeWidth / 2);
            const innerY = this.cy + Math.sin(radian) * (this.radius - this.strokeWidth / 2);
            const outerX = this.cx + Math.cos(radian) * (this.radius + this.strokeWidth / 2);
            const outerY = this.cy + Math.sin(radian) * (this.radius + this.strokeWidth / 2);

            const step = this.createSvgElement('line', {
                x1: innerX,
                y1: innerY,
                x2: outerX,
                y2: outerY,
                class: `line-${this.elementId}`,
            });

            const stepsGroup = document.getElementById(`steps-${this.elementId}`)
            stepsGroup.appendChild(step);
        }
    }

    createSvgElement(type, attributes) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', type);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    attachEventListeners() {
        this.parentSvg.addEventListener('mousedown', (e) => {
            if (this.isOnPath(e)) {
                this.isValid = true; // this is used to know if first click before dragging was on correct element
                this.isMouseDown = true;
                this.startAngle = this.calculateAngle(e);
                this.updateProgress(e);
            }
        });

        this.parentSvg.addEventListener('mousemove', (e) => {
            if (this.isMouseDown && this.isValid) {
                this.updateProgress(e);
            }
        });

        this.parentSvg.addEventListener('mouseup', (_) => {
            this.isMouseDown = false;
            this.isValid = false;
        });

        this.parentSvg.addEventListener('mouseleave', (_) => {
            this.isMouseDown = false;
            this.isValid = false;
        });

        // touch events
        this.parentSvg.addEventListener('touchstart', e => {
            if (this.isOnPath(e, true)) {
                this.isValid = true;
                this.isMouseDown = true;
                this.startAngle = this.calculateAngle(e);
                this.updateProgress(e, true);
            }
        });

        this.parentSvg.addEventListener('touchmove', (e) => {
            if (this.isMouseDown && this.isValid) {
                this.updateProgress(e, true);
            }
        });

        this.parentSvg.addEventListener('touchend', (e) => {
            this.isMouseDown = false;
            this.isValid = false;
        });
    }

    calculateAngle(e) {
        const { x, y } = this.getCointainerXY(e);
        return Math.atan2(y, x);
    }

    getCointainerXY(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - this.cx;
        const y = e.clientY - rect.top - this.cy;
        return { x, y };
    }

    updateProgress(e, isMobile = false) {
        e.preventDefault()
        e = isMobile ? e.changedTouches[0] : e;
        const { x, y } = this.getCointainerXY(e);

        const radian = Math.atan2(y, x);
        const endX = this.cx + Math.cos(radian) * this.radius;
        const endY = this.cy + Math.sin(radian) * this.radius;
        const degree = radian * (180 / Math.PI);

        let largeArcFlag;

        if (Math.abs(degree) < 90 && Math.abs(radian) < Math.PI / 2) {
            largeArcFlag = 0;
        } else {
            largeArcFlag = 1;
        }

        const pathData = `
          M ${this.cx} ${this.cy - this.radius}
          A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        `;

        const progress = document.getElementById(`progress-${this.elementId}`)
        const handle = document.getElementById(`handle-${this.elementId}`)

        progress.setAttribute('d', pathData);

        handle.setAttribute('cx', endX);
        handle.setAttribute('cy', endY);

        let currentAngle = Math.atan2(y, x);

        currentAngle += Math.PI / 2;

        if (currentAngle < 0) {
            currentAngle += 2 * Math.PI;
        }

        // actual decimal value
        const val = this.min + currentAngle / (2 * Math.PI) * (this.max - this.min);

        // value with step considered
        this.value = Math.round(val / this.step) * this.step;
        this.parentSvg.querySelector(`#value-${this.elementId}`).textContent = this.value;
    }

    // calculate if event happened on the slider path
    isOnPath(e, isMobile = false) {
        e = isMobile ? e.changedTouches[0] : e;
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - this.cx;
        const y = e.clientY - rect.top - this.cy;

        const distance = Math.sqrt(x * x + y * y);
        return distance >= this.radius - this.strokeWidth / 2 && distance <= this.radius + this.strokeWidth / 2;
    }
}
