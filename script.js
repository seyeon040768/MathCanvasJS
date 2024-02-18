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
}

function dgr2rad(theta)
{
    return theta / 180 * Math.PI;
}

class MathCanvas
{
    constructor(canvasId)
    {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.center = [this.canvas.width * 0.5, this.canvas.height * 0.5];
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

    drawGrid(basis1, basis2, spacing=50, strokeColor='#eee', strokeWidth=1.0)
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

        const longer = (this.canvas.width > this.canvas.height) ? this.canvas.width : this.canvas.height;

        let basis1Start = new vec2(basis1.x * -longer, basis1.y * -longer);
        let basis1End = new vec2(-basis1Start.x, -basis1Start.y);
        let basis1Theta = Math.atan(basis1.y, basis1.x);

        if (Math.abs(basis1.y / basis1.x) > 1)
        {
            let basis1Space = spacing / Math.sin(basis1Theta);
            for (let i = 0; i <= this.canvas.width; i += basis1Space)
            {
                console.log(i);
                this.moveTo(new vec2(basis1Start.x - i, basis1Start.y));
                this.lineTo(new vec2(basis1End.x - i, basis1End.y));

                this.moveTo(new vec2(basis1Start.x + i, basis1Start.y));
                this.lineTo(new vec2(basis1End.x + i, basis1End.y));
            }
        }
        else
        {
            let basis1Space = spacing / Math.cos(basis1Theta);
            for (let i = 0; i <= this.canvas.height; i += spacing)
            {
                this.moveTo(new vec2(basis1Start.x, basis1Start.y - i));
                this.lineTo(new vec2(basis1End.x, basis1End.y - i));

                this.moveTo(new vec2(basis1Start.x, basis1Start.y + i));
                this.lineTo(new vec2(basis1End.x, basis1End.y + i));
            }
        }
        
        let basis2Start = new vec2(basis2.x * -longer, basis2.y * -longer);
        let basis2End = new vec2(-basis2Start.x, -basis2Start.y);
        let basis2Theta = Math.atan2(basis2.y, basis2.x);

        if (Math.abs(basis2.y / basis2.x) > 1)
        {
            let basis2Space = spacing / Math.sin(basis2Theta);
            for (let i = 0; i <= this.canvas.width; i += basis2Space)
            {
                this.moveTo(new vec2(basis2Start.x - i, basis2Start.y));
                this.lineTo(new vec2(basis2End.x - i, basis2End.y));

                this.moveTo(new vec2(basis2Start.x + i, basis2Start.y));
                this.lineTo(new vec2(basis2End.x + i, basis2End.y));
            }
        }
        else
        {
            let basis2Space = spacing / Math.cos(basis2Theta);
            for (let i = 0; i <= this.canvas.height; i += spacing)
            {
                this.moveTo(new vec2(basis2Start.x, basis2Start.y - i));
                this.lineTo(new vec2(basis2End.x, basis2End.y - i));

                this.moveTo(new vec2(basis2Start.x, basis2Start.y + i));
                this.lineTo(new vec2(basis2End.x, basis2End.y + i));
            }
        }

        this.ctx.closePath();
        this.ctx.lineWidth = strokeWidth;
        this.ctx.strokeStyle = strokeColor;
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

    drawVector(startPos, direction, width=2.0, color='#000000')
    {
        let endPos = new vec2(startPos.x + direction.x, startPos.y + direction.y);
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
function init(bDrawXY=true)
{
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    if (bDrawXY)
    {
        drawXY();
    }
}

// const transformBasis = (value) => {
//     const scale = value / 50; // Transform scale based on slider
//     this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//     drawGrid(); // Redraw grid
    
//     // Transform and draw vectors
//     drawVector(canvas.width / 2, canvas.height / 2, canvas.width / 2, (canvas.height / 2) - 100 * scale);
//     drawVector(canvas.width / 2, canvas.height / 2, (canvas.width / 2) + 100 * (1 - scale), canvas.height / 2);
// };

// Initial drawing
// init(bDrawXY=true);
// drawVector(1,1,1,1);
// transformBasis(slider.value);

function linearInterpolation(startPos, endPos, delta)
{
    let a = delta;
    let b = 1 - delta;
    return new vec2(startPos.x * b + endPos.x * a, startPos.y * b + endPos.y * a);
}


let mathCanvas = new MathCanvas('vectorCanvas');

const slider = document.getElementById('Slider');
slider.min = 0;
slider.max = 1000;
// slider.min = -mathCanvas.center[0];
// slider.max = mathCanvas.center[0];

mathCanvas.drawGrid();

// Update transformation on slider change
slider.oninput = () => {
    let theta = parseFloat(slider.value) / 1000 * Math.PI * 2;
    let startPos = new vec2(0, 0);
    let direction = new vec2(1 * Math.cos(theta) - 0 * Math.sin(theta), 1 * Math.sin(theta) + 0 * Math.cos(theta));
    direction.x *= 100;
    direction.y *= 100;

    mathCanvas.clearRect();
    mathCanvas.drawGrid();
    // mathCanvas.drawGrid(linearInterpolation(new vec2(1, 0), new vec2(1, 0.5), parseFloat(slider.value) / 100), linearInterpolation(new vec2(0, 1), new vec2(0.5, 1), parseFloat(slider.value) / 100));
    mathCanvas.drawXY();
    mathCanvas.drawVector(startPos, direction);
};
