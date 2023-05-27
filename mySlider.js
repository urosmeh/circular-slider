class CircularSlider {
    constructor({ container, color, max, min, step, value, radius }) {
        this.container = document.getElementById(container);
        this.color = color;
        this.max = max;
        this.min = min;
        this.step = step;
        this.value = value;
        this.radius = radius
        const rect = this.container.getBoundingClientRect();
        // this.cx = rect.left + rect.width / 2;
        // this.cy = rect.top + rect
    }

    render() {
        this.renderElements();
        this.renderSteps();
        this.attachEventListeners();
    }

    renderElements() {
        const containerElement = document.getElementById(this.container);

        // Create SVG Element
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "circular-slider");
        svg.setAttribute("width", "220");
        svg.setAttribute("height", "220");

        let outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        outerCircle.setAttribute("cx", "110");
        outerCircle.setAttribute("cy", "110");
        outerCircle.setAttribute("r", "80");
        outerCircle.setAttribute("stroke", "lightGrey");
        outerCircle.setAttribute("stroke-width", "20");
        outerCircle.setAttribute("fill", "transparent");

        let progressPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        progressPath.setAttribute("id", "progress");
        progressPath.setAttribute("d", "");
        progressPath.setAttribute("stroke", "magenta");
        progressPath.setAttribute("stroke-width", "20");
        progressPath.setAttribute("fill", "transparent");

        let stepsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        stepsGroup.setAttribute("id", "steps");
        stepsGroup.setAttribute("stroke", "white");
        stepsGroup.setAttribute("stroke-width", "1");

        let handleCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        handleCircle.setAttribute("id", "handle");
        handleCircle.setAttribute("cx", "110");
        handleCircle.setAttribute("cy", "30");
        handleCircle.setAttribute("r", "13");
        handleCircle.setAttribute("fill", "white");
        handleCircle.setAttribute("stroke", "lightGrey");
        handleCircle.setAttribute("stroke-width", "1");

        // Add Elements to SVG
        svg.appendChild(outerCircle);
        svg.appendChild(progressPath);
        svg.appendChild(stepsGroup);
        svg.appendChild(handleCircle);

        this.container.appendChild(svg);
    }

    renderSteps() {
        for (let i = 0; i < 50; i++) {
            const radian = (i * 2 * Math.PI) / 50 - Math.PI / 2;
            const innerX = 110 + Math.cos(radian) * (this.radius - 10);
            const innerY = 110 + Math.sin(radian) * (this.radius - 10);
            const outerX = 110 + Math.cos(radian) * (this.radius + 10);
            const outerY = 110 + Math.sin(radian) * (this.radius + 10);

            const step = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            step.setAttribute('x1', innerX);
            step.setAttribute('y1', innerY);
            step.setAttribute('x2', outerX);
            step.setAttribute('y2', outerY);

            const stepsGroup = document.getElementById("steps")
            stepsGroup.appendChild(step);
        }
    }

    attachEventListeners() {
        const svg = document.getElementById('circular-slider');
        // const progress = document.getElementById('progress');
        // const handle = document.getElementById('handle');

        svg.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.startAngle = this.calculateAngle(e);
            this.updateProgress(e);
        });

        svg.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                // this.startAngle = this.calculateAngle(e);
                this.updateProgress(e);
            }
        });

        svg.addEventListener('mouseup', (e) => {
            this.isMouseDown = false;
        });

        svg.addEventListener('mouseleave', (e) => {
            this.isMouseDown = false;
        });

        // todo: Add touch events etc.....
    }

    calculateAngle(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - 110;
        const y = e.clientY - rect.top - 110;
        return Math.atan2(y, x);
    }

    updateProgress(e) {
        e.preventDefault()
        //optimize
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left - 110;
        const y = e.clientY - rect.top - 110;
        const radian = Math.atan2(y, x);
        const endX = 110 + Math.cos(radian) * this.radius;
        const endY = 110 + Math.sin(radian) * this.radius;
        const degree = radian * (180 / Math.PI);

        let largeArcFlag = 1;
        if (Math.abs(degree) < 90 && Math.abs(radian) < Math.PI / 2) {
            largeArcFlag = 0;
        } else {
            largeArcFlag = 1;
        }

        const pathData = `
          M 110 ${110 - this.radius}
          A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        `;
        progress.setAttribute('d', pathData);

        handle.setAttribute('cx', endX);
        handle.setAttribute('cy', endY);

        let currentAngle = Math.atan2(y, x);

        currentAngle += Math.PI / 2;

        if (currentAngle < 0) {
            currentAngle += 2 * Math.PI;
        }

        const currentValue = this.min + currentAngle / (2 * Math.PI) * (this.max - this.min);
        console.log(currentValue);
        document.getElementById("val").innerHTML = Math.round(currentValue / this.step) * this.step;
    }
}
