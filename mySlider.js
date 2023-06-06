class CircularSlider {
    constructor({ container, color, max, min, step, radius, title }) {
        this.container = document.getElementById(container);
        this.color = color;
        this.max = max;
        this.min = min;
        this.step = step;
        this.value = min;
        this.radius = radius;
        this.title = title;
        this.elementId = Math.round(Math.random() * 1000);
        this.parentSvg = this.container.querySelector('.parent-svg');
        this.valuesSvg = this.container.querySelector('.values-svg');

        const rect = this.container.getBoundingClientRect();
        if (!this.parentSvg) {
            this.parentSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.parentSvg.setAttribute('class', 'parent-svg')
            this.parentSvg.setAttribute('width', rect.width);
            this.parentSvg.setAttribute('height', rect.height);
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
        const elementDy = existingValueElements.length * 30 + this.cy;

        const valueGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        valueGroup.setAttribute('class', 'value-text');

        const valueElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueElement.setAttribute('dy', elementDy.toString())
        valueElement.setAttribute('id', `value-${this.elementId}`);
        valueElement.style.fontSize = '30px';
        valueElement.textContent = this.value;
        valueGroup.appendChild(valueElement);

        const valueLegendBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        valueLegendBox.setAttribute('width', '25');
        valueLegendBox.setAttribute('height', '10');
        valueLegendBox.setAttribute('fill', this.color);
        valueLegendBox.setAttribute('transform', `translate(50, ${elementDy - 10})`);
        valueGroup.appendChild(valueLegendBox);

        const valueTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueTitle.setAttribute('dy', elementDy);
        valueTitle.setAttribute('dx', '80');
        valueTitle.setAttribute('id', `value-title-${this.elementId}`);
        valueTitle.style.fontSize = '20px';
        valueTitle.textContent = this.title;
        valueGroup.appendChild(valueTitle);

        this.parentSvg.appendChild(valueGroup);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.setAttribute('class', 'svg-container');

        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('id', `outer-circle-${this.elementId}`)
        outerCircle.setAttribute('class', 'outer-circle')
        outerCircle.setAttribute('cx', this.cx);
        outerCircle.setAttribute('cy', this.cy);
        outerCircle.setAttribute('r', this.radius);
        outerCircle.setAttribute('stroke', 'lightGrey');
        outerCircle.setAttribute('stroke-width', '20');
        outerCircle.setAttribute('fill', 'transparent');

        const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        progressPath.setAttribute('id', `progress-${this.elementId}`);
        progressPath.setAttribute('d', '');
        progressPath.setAttribute('stroke', this.color);
        progressPath.setAttribute('stroke-width', '20');
        progressPath.setAttribute('fill', 'transparent');

        const stepsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stepsGroup.setAttribute('id', `steps-${this.elementId}`);
        stepsGroup.setAttribute('stroke', 'white');
        stepsGroup.setAttribute('stroke-width', '1');

        const handleCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        handleCircle.setAttribute('id', `handle-${this.elementId}`);
        handleCircle.setAttribute('cx', this.cx);
        handleCircle.setAttribute('cy', (this.cy - this.radius));
        handleCircle.setAttribute('r', '12');
        handleCircle.setAttribute('fill', 'white');
        handleCircle.setAttribute('stroke', 'lightGrey');
        handleCircle.setAttribute('stroke-width', '1');

        // Add Elements to SVG
        svg.appendChild(outerCircle);
        svg.appendChild(progressPath);
        svg.appendChild(stepsGroup);
        svg.appendChild(handleCircle);

        this.parentSvg.appendChild(svg);
        this.container.appendChild(this.parentSvg);
    }

    renderSteps() {
        for (let i = 0; i < 50; i++) {
            const radian = (i * 2 * Math.PI) / 50 - Math.PI / 2;
            const innerX = this.cx + Math.cos(radian) * (this.radius - 10);
            const innerY = this.cy + Math.sin(radian) * (this.radius - 10);
            const outerX = this.cx + Math.cos(radian) * (this.radius + 10);
            const outerY = this.cy + Math.sin(radian) * (this.radius + 10);

            const step = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            step.setAttribute('x1', innerX);
            step.setAttribute('y1', innerY);
            step.setAttribute('x2', outerX);
            step.setAttribute('y2', outerY);
            step.setAttribute('class', `line-${this.elementId}`);

            const stepsGroup = document.getElementById(`steps-${this.elementId}`)
            stepsGroup.appendChild(step);
        }
    }

    attachEventListeners() {
        this.parentSvg.addEventListener('mousedown', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = e.clientX - rect.left - this.cx;
            const y = e.clientY - rect.top - this.cy;

            const distance = Math.sqrt(x * x + y * y);
            const isOnPath = distance >= this.radius - 10 && distance <= this.radius + 10;

            if (isOnPath) {
                this.isValid = true; //this is used to know if first click before dragging was on correct element
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

        this.parentSvg.addEventListener('touchstart', e => {
            const rect = this.container.getBoundingClientRect();
            const x = e.changedTouches[0].clientX - rect.left - this.cx;
            const y = e.changedTouches[0].clientY - rect.top - this.cy;

            const distance = Math.sqrt(x * x + y * y);
            const isOnPath = distance >= this.radius - 10 && distance <= this.radius + 10;

            if (this.isEventOnSliderElement(e) && isOnPath) {
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

        const val = this.min + currentAngle / (2 * Math.PI) * (this.max - this.min);
        this.value = Math.round(val / this.step) * this.step;
        this.parentSvg.querySelector(`#value-${this.elementId}`).textContent = this.value;
    }

    isEventOnSliderElement(e) {
        return e.target.id === `handle-${this.elementId}` || (e.target.id === `outer-circle-${this.elementId}`) || e.target.id === `progress-${this.elementId}` || e.target.classList.contains(`line-${this.elementId}`);
    }

    getMaxRadius() {
        const sliders = this.parentSvg.querySelectorAll('.outer-circle');
        let maxRadius = 0;

        sliders.forEach(s => {
            const radius = parseInt(s.getAttribute('r'));
            if (radius > maxRadius) {
                maxRadius = radius;
            }
        });

        return maxRadius;
    }

}
