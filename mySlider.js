class CircularSlider {
    constructor({container, color, max, min, step, value, radius}) {
        this.container = document.getElementById(container);
        this.color = color;
        this.max = max;
        this.min = min;
        this.step = step;
        this.value = value || 0;
        this.radius = radius
        // this.svgSize = radius * 2 + 30;
        this.center = 300;
        this.elementId = Math.round(Math.random() * 1000);
        this.parentSvg = this.container.querySelector("svg");


        if (!this.parentSvg) {
            this.parentSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.parentSvg.setAttribute("class", "parent-svg")
            this.parentSvg.setAttribute("width", 600); //set this to max possible width and height
            this.parentSvg.setAttribute("height", 600);
            this.container.appendChild(this.parentSvg);
        }

        // remove fixed values
        this.cx = 300; //rect.left + rect.width / 2;
        this.cy = 300; //rect.top + rect.height /2
    }

    render() {
        this.renderElements();
        this.renderSteps();
        this.attachEventListeners();
    }

    renderElements() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.setAttribute("id", `svg-${this.elementId}`);

        const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        outerCircle.setAttribute("id", `outer-circle-${this.elementId}`)
        outerCircle.setAttribute("cx", 300);
        outerCircle.setAttribute("cy", 300);
        outerCircle.setAttribute("r", this.radius);
        outerCircle.setAttribute("stroke", "lightGrey");
        outerCircle.setAttribute("stroke-width", "20");
        outerCircle.setAttribute("fill", "transparent");

        let progressPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        progressPath.setAttribute("id", `progress-${this.elementId}`);
        progressPath.setAttribute("d", "");
        progressPath.setAttribute("stroke", "magenta");
        progressPath.setAttribute("stroke-width", "20");
        progressPath.setAttribute("fill", "transparent");

        let stepsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        stepsGroup.setAttribute("id", `steps-${this.elementId}`);
        stepsGroup.setAttribute("stroke", "white");
        stepsGroup.setAttribute("stroke-width", "1");

        let handleCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        handleCircle.setAttribute("id", `handle-${this.elementId}`);
        handleCircle.setAttribute("cx", 300);
        handleCircle.setAttribute("cy", (300 - this.radius));
        handleCircle.setAttribute("r", "12");
        handleCircle.setAttribute("fill", "white");
        handleCircle.setAttribute("stroke", "lightGrey");
        handleCircle.setAttribute("stroke-width", "1");

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
            const innerX = 300 + Math.cos(radian) * (this.radius - 10);
            const innerY = 300 + Math.sin(radian) * (this.radius - 10);
            const outerX = 300 + Math.cos(radian) * (this.radius + 10);
            const outerY = 300 + Math.sin(radian) * (this.radius + 10);

            const step = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            step.setAttribute('x1', innerX);
            step.setAttribute('y1', innerY);
            step.setAttribute('x2', outerX);
            step.setAttribute('y2', outerY);

            const stepsGroup = document.getElementById(`steps-${this.elementId}`)
            stepsGroup.appendChild(step);
        }
    }

    attachEventListeners() {
        this.parentSvg.addEventListener('mousedown', (e) => {
            console.log('mousedown', e.target.id);
            if (e.target.id === `handle-${this.elementId}` || e.target.id === `outer-circle-${this.elementId}` || e.target.id === `progress-${this.elementId}` || e.target.id === `steps-${this.elementId}`) {
                this.isMouseDown = true;
                this.startAngle = this.calculateAngle(e);
                this.updateProgress(e);
            }
        });

        this.parentSvg.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                this.updateProgress(e);
            }
        });

        this.parentSvg.addEventListener('mouseup', (_) => {
            this.isMouseDown = false;
        });

        this.parentSvg.addEventListener('mouseleave', (_) => {
            this.isMouseDown = false;
        });

        this.parentSvg.addEventListener('touchstart', e => {
            console.log('touchstart', e);

            if (e.target.id === `handle-${this.elementId}` || e.target.id === `outer-circle-${this.elementId}` || e.target.id === `progress-${this.elementId}` || e.target.id === `steps-${this.elementId}`) {
                this.isMouseDown = true;
                this.startAngle = this.calculateAngle(e);
                this.updateProgress(e, true);
            }
        });

        this.parentSvg.addEventListener('touchmove', (e) => {
            console.log('touchmove', e.target.id);

            if (this.isMouseDown) {
                this.updateProgress(e, true);
            }
        });

        this.parentSvg.addEventListener('touchend', (e) => {
            console.log('touchleave', e.target.id);

            this.isMouseDown = false;
        });

        // todo: Add touch events etc.....
    }

    calculateAngle(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - 300;
        const y = e.clientY - rect.top - 300;
        return Math.atan2(y, x);
    }

    updateProgress(e, isMobile = false) {
        e.preventDefault()
        e = isMobile ? e.changedTouches[0] : e;

        //optimize
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - 300;
        const y = e.clientY - rect.top - 300;

        const radian = Math.atan2(y, x);
        const endX = 300 + Math.cos(radian) * this.radius;
        const endY = 300 + Math.sin(radian) * this.radius;
        const degree = radian * (180 / Math.PI);

        let largeArcFlag;

        if (Math.abs(degree) < 90 && Math.abs(radian) < Math.PI / 2) {
            largeArcFlag = 0;
        } else {
            largeArcFlag = 1;
        }

        const pathData = `
          M ${300} ${300 - this.radius}
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
        console.log(this.value);
    }
}
