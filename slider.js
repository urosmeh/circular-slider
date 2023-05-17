const svg = document.getElementById('circular-slider');
const progress = document.getElementById('progress');
const radius = 80;
const circumference = 2 * Math.PI * radius; //obseg
const stepsContainer = document.getElementById('steps');
createSteps(100);

let isMouseDown = false;

function createSteps(stepCount) {
    for (let i = 0; i < stepCount; i++) {
        const radian = (i * 2 * Math.PI) / stepCount - Math.PI / 2;
        const innerX = 110 + Math.cos(radian) * (radius - 10); // Adjust 10 for the length of the step
        const innerY = 110 + Math.sin(radian) * (radius - 10);
        const outerX = 110 + Math.cos(radian) * (radius + 10);
        const outerY = 110 + Math.sin(radian) * (radius + 10);

        const step = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        step.setAttribute('x1', innerX);
        step.setAttribute('y1', innerY);
        step.setAttribute('x2', outerX);
        step.setAttribute('y2', outerY);

        stepsContainer.appendChild(step);
    }
}


function updateProgress(e) {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - 110; // Subtract the adjusted center x-coordinate
    const y = e.clientY - rect.top - 110; // Subtract the adjusted center y-coordinate
    const radian = Math.atan2(y, x);
    const endX = 110 + Math.cos(radian) * radius;
    const endY = 110 + Math.sin(radian) * radius;
    const degree = radian * (180 / Math.PI);

    let largeArcFlag = 1;
    if (Math.abs(degree) < 90 && Math.abs(radian) < Math.PI / 2) {
        largeArcFlag = 0;
    } else {
        largeArcFlag = 1;
    }

    console.log(radian, degree);
    const pathData = `
      M 110 ${110 - radius}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;
    progress.setAttribute('d', pathData);
}


svg.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    updateProgress(e);
});

svg.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        updateProgress(e);
    }
});

svg.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});

svg.addEventListener('mouseleave', (e) => {
    isMouseDown = false;
});