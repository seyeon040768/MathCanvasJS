class vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    static Coordinate2Canvas(pos)
    {
        let x = pos.x + centerPoint[0];
        let y = pos.y + centerPoint[1];
        return new vec2(x, y);
    }

    len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

function dgr2rad(theta)
{
    return theta / 180 * Math.PI;
}

function linearInterpolation(startPos, endPos, delta)
{
    let a = delta;
    let b = 1 - delta;
    return new vec2(startPos.x * b + endPos.x * a, startPos.y * b + endPos.y * a);
}

function linearTransformation(basis1, basis2, v)
{
    return new vec2(v.x * basis1.x + v.y * basis2.x, v.x * basis1.y + v.y * basis2.y);
}

class MathCanvas
{
    constructor(canvasId)
    {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.center = [this.canvas.width * 0.5, this.canvas.height * 0.5];
        this.spacing = this.center[0] / 6;
    }

    clearRect()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    cartesian2Screen(pos)
    {
        let res = new vec2(pos.x + this.center[0], -pos.y + this.center[1]);
        
        return res;
    }

    moveTo(pos)
    {
        pos = this.cartesian2Screen(pos);
        this.ctx.moveTo(pos.x, pos.y);
    }

    lineTo(pos)
    {
        pos = this.cartesian2Screen(pos);
        this.ctx.lineTo(pos.x, pos.y);
    }

    drawGrid(basis1, basis2, strokeColor='#eee', strokeWidth=1.0)
    {
        if (basis1 == undefined)
        {
            basis1 = new vec2(1, 0);
        }
        if (basis2 == undefined)
        {
            basis2 = new vec2(0, 1);
        }
        
        this.ctx.beginPath();
        for (let i = this.spacing; i <= this.canvas.height; i += this.spacing)
        {
            {
                let sampleX = new vec2(this.canvas.width, -i);
                let endPos = linearTransformation(basis1, basis2, sampleX);
                sampleX = new vec2(-this.canvas.width, -i);
                let startPos = linearTransformation(basis1, basis2, sampleX);

                this.moveTo(startPos);
                this.lineTo(endPos);
            }

            {
                let sampleX = new vec2(this.canvas.width, i);
                let endPos = linearTransformation(basis1, basis2, sampleX);
                sampleX = new vec2(-this.canvas.width, i);
                let startPos = linearTransformation(basis1, basis2, sampleX);

                this.moveTo(startPos);
                this.lineTo(endPos);
            }
        }

        for (let i = this.spacing; i <= this.canvas.width; i += this.spacing)
        {
            {
                let sampleY = new vec2(-i, this.canvas.height);
                let endPos = linearTransformation(basis1, basis2, sampleY);
                sampleY = new vec2(-i, -this.canvas.height);
                let startPos = linearTransformation(basis1, basis2, sampleY);

                this.moveTo(startPos);
                this.lineTo(endPos);
            }

            {
                let sampleY = new vec2(i, this.canvas.height);
                let endPos = linearTransformation(basis1, basis2, sampleY);
                sampleY = new vec2(i, -this.canvas.height);
                let startPos = linearTransformation(basis1, basis2, sampleY);

                this.moveTo(startPos);
                this.lineTo(endPos);
            }
        }
        this.ctx.closePath();
        this.ctx.lineWidth = strokeWidth;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.stroke();


        this.ctx.beginPath();
        {
            let sampleX = new vec2(this.canvas.width, 0);
            let endPos = linearTransformation(basis1, basis2, sampleX);
            sampleX = new vec2(-this.canvas.width, 0);
            let startPos = linearTransformation(basis1, basis2, sampleX);

            this.moveTo(startPos);
            this.lineTo(endPos);
        }

        {
            let sampleY = new vec2(0, this.canvas.height);
            let endPos = linearTransformation(basis1, basis2, sampleY);
            sampleY = new vec2(0, -this.canvas.height);
            let startPos = linearTransformation(basis1, basis2, sampleY);

            this.moveTo(startPos);
            this.lineTo(endPos);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = strokeWidth;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
    }

    drawXY()
    {
        this.ctx.beginPath();
        this.moveTo(new vec2(-this.center[0], 0));
        this.lineTo(new vec2(this.center[0], 0));
        this.moveTo(new vec2(0, -this.center[1]));
        this.lineTo(new vec2(0, this.center[1]));
        this.ctx.closePath();
        this.ctx.lineWidth = 1.0;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
    }

    drawVector(location, direction, width=2.0, color='#000000')
    {
        let startPos = new vec2(location.x, location.y);
        startPos.x *= this.spacing;
        startPos.y *= this.spacing;
        let endPos = new vec2(startPos.x + direction.x * this.spacing, startPos.y + direction.y * this.spacing);
        console.log(startPos, endPos);
        this.ctx.beginPath();
        this.moveTo(startPos);
        this.lineTo(endPos);
        this.ctx.closePath();

        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.moveTo(endPos);
        let arrowAngle = dgr2rad(60);
        let theta = Math.atan2(direction.y, direction.x);
        theta += Math.PI - arrowAngle * 0.5;
        this.lineTo(new vec2(endPos.x + Math.cos(theta) * 10, endPos.y + Math.sin(theta) * 10));
        theta += arrowAngle;
        this.lineTo(new vec2(endPos.x + Math.cos(theta) * 10, endPos.y + Math.sin(theta) * 10));
        this.lineTo(endPos);
        this.ctx.fill();
        this.ctx.closePath();
        
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
}





let mathCanvas = new MathCanvas('vectorCanvas');
let randomButtom = document.getElementById('vectorButton');
let vectorPos = document.getElementById('vectorPos');

// const slider = document.getElementById('Slider');
// slider.min = -100;
// slider.max = 100;
// slider.min = -mathCanvas.center[0];
// slider.max = mathCanvas.center[0];

mathCanvas.drawGrid();
mathCanvas.drawVector(new vec2(0, 0), new vec2(5, 5));

// Update transformation on slider change
// slider.oninput = () => {
//     let theta = parseFloat(slider.value) / 1000 * Math.PI * 2;
//     let startPos = new vec2(0, 0);
//     let direction = new vec2(1 * Math.cos(theta) - 0 * Math.sin(theta), 1 * Math.sin(theta) + 0 * Math.cos(theta));
//     direction.x *= 100;
//     direction.y *= 100;

//     mathCanvas.clearRect();
//     // mathCanvas.drawGrid(new vec2(Math.cos(theta), Math.sin(theta)), new vec2(-Math.sin(theta), Math.cos(theta)))
//     //mathCanvas.drawGrid();

//     let u = linearInterpolation(new vec2(1, 0), new vec2(2, 1), parseFloat(slider.value) / 100);
//     let v = linearInterpolation(new vec2(0, 1), new vec2(3, 1), parseFloat(slider.value) / 100);
//     mathCanvas.drawGrid(u, v);
//     mathCanvas.drawVector(new vec2(0, 0), linearTransformation(u, v, new vec2(1, 0)));
//     mathCanvas.drawVector(new vec2(0, 0), linearTransformation(u, v, new vec2(0, 1)));
//     mathCanvas.drawVector(new vec2(0, 0), linearTransformation(u, v, new vec2(2, 1)));
//     // mathCanvas.drawXY();
//     // mathCanvas.drawVector(startPos, direction);
// };

randomButtom.onclick = () => {
    const randomVec = new vec2(Math.round(Math.random() * 12 - 6), Math.round(Math.random() * 12 - 6));

    vectorPos.innerText = `(${randomVec.x}, ${randomVec.y})`;
    mathCanvas.clearRect();
    mathCanvas.drawGrid();
    mathCanvas.drawVector(new vec2(0, 0), randomVec);
}