// point note that y > 0 stand for downward not upward in geometry
// if x and y of Point2D is relative (or view an absolute value ralatibe to origin),
// Point2D will be treated as a Vector.
class Point2D{
    constructor(x, y){
        if(typeof(x) != "number" || typeof(y) != "number"){
            throw new Error('x, y must be number!');
        }
        this.x = x;
        this.y = y;
    }

    // override
    toString(){
        return `Point2D(${this.x}, ${this.y})`;
    }

    // vector add another vector
    add(point){
        this.x = this.x + point.x;
        this.y = this.y + point.y;
        return this;
    }

    // numerical multiply
    scale(m){
        this.x = this.x * m;
        this.y = this.y * m;
        return this;
    }

    // rotate
    rotate(deg){
        rotate(this, deg);
        return this;
    }

    // norm
    norm(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

}

class Point3D extends Point2D{
    constructor(x, y, z){
        super(x, y);
        this.z = z;
    }

    // override
    toString(){
        return `Point3D(${this.x}, ${this.y}, ${this.z})`;
    }
}

// math tools
function toDeg(rad){
    return rad * 180 / Math.PI;
}
function toRad(deg){
    return deg * Math.PI / 180;
}

// lines to angles (deg), start and end are all Point2Ds
// return deg [-179, 180]
function points2Deg(start /*Point2D*/ , end /*Point2D*/){
    if(start.x == end.x && start.y == end.y){
        throw new Error('two points are in same place!');
    }

    let delta_x = end.x - start.x; 
    let delta_y = end.y - start.y;
    if(delta_x == 0){
        if(delta_y > 0) return 90;
        else return -90;
    }
    let quo = delta_y / delta_x;

    if(quo > 0){
        if(delta_x > 0) return toDeg(Math.atan(quo));
        else return toDeg(Math.atan(quo)) - 180;
    } else {
        if(delta_x > 0) return toDeg(Math.atan(quo));
        else return toDeg(Math.atan(quo)) + 180;
    }
}

// rotate a vector by certain degree, change input vector(Point2D) itself
function rotate(vector /*Point2D*/, deg /*float [-179, 180]*/){
    if(deg > 180 || deg < -179) throw new Error('cannot rotate vector out of [-179, 180] !')
    var norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    var new_deg = points2Deg(new Point2D(0, 0), vector) + deg;
    // if(new_deg > 180) new_deg = -360 + new_deg;
    // if(new_deg <= -180) new_deg = new_deg + 360;
    vector.x = norm * Math.cos(toRad(new_deg));
    vector.y = norm * Math.sin(toRad(new_deg));
    return vector;
}

// vector add, return a new point
function vecAdd(v1 /*Point2D*/, v2 /*Point2D*/){
    return new Point2D(v1.x + v2.x, v1.y + v2.y);
}

// vector scale, return a new point
function vecScale(vector /*Point2D*/, m){
    return new Point2D(vector.x * m, vector.y * m);
}

// middle point of two points
function middlePoint(p1 /*Point2D*/, p2 /*Point2D*/){
    var result = new Point2D(0, 0);
    result.x = (p1.x + p2.x) / 2;
    result.y = (p1.y + p2.y) / 2;
    return result;
}


// shuffle array: Fisher-Yates (or Knuth) Shuffle algorithm
function shuffle(array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
    
    };

    // var point1 = new Point2D('sss', null);
    // point1.add(new Point2D(4, 5)).scale(0.8).rotate(12);
    // console.log(point1);