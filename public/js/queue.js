class Queue {

    constructor(length) {

        this._queue = new Array(length);
        this.head = -1;
        this.rear = -1;
    }

    isEmpty() {
        if (this.head == -1 && this.rear == -1) return true;
        else return false;
    }

    push(o) {
        if ((this.rear + 1) % this._queue.length == this.head) {  /* full */
            this.rear = (this.rear + 1) % this._queue.length;
            this.head = (this.head + 1) % this._queue.length;
        } else if (this.isEmpty()) {
            this.head++;
            this.rear++;
        } else {
            this.rear = (this.rear + 1) % this._queue.length;
        }
        this._queue[this.rear] = o;

    }

    len() {
        if (this.rear >= this.head) return this.rear - this.head + 1;
        else return this.rear + this._queue.length - this.head + 1;
    }

}

class SVGWidthQueue extends Queue {

    constructor(track_length, max_size) {
        super(track_length);
        this.max_size = max_size;
        this.width_array = [];
    }

    push(o) {
        if (this.width_array.length < this._queue.length) {
            if (!this.width_array.length) {
                // console.warn('ss');
                this.width_array.push(this.max_size);
            } else {
                for (var wi in this.width_array) {

                    this.width_array[wi] *= (1 - 1 / this.width_array.length);
                }
                this.width_array.push(this.max_size);
            }
        }
        super.push(o);
    }

    toPath() {
        // only one dot do not draw on canvas
        if (this.len() < 3) return "";

        // left_side means the left hand side path when the width_array is add on the queue with the queue referring the track in the middle
        // the same thing is ture on right_side;
        // both sides contains Point2Ds;
        var left_side = [];
        var right_side = [];

        // for all widths of width_array, calculate the left point(rotate 90 degs) and right point(rotate -90 degs) from the middle point(queue point)
        for (let i = 2; i < this.width_array.length; i++) {
            var p_middle_start = this._queue[(this.head + i - 2) % this._queue.length];
            var p_middle_mid = this._queue[(this.head + i - 1) % this._queue.length];
            var p_middle_end = this._queue[(this.head + i) % this._queue.length];

            var vec1 = vecAdd(p_middle_mid, vecScale(p_middle_start, -1));
            var vec2 = vecAdd(p_middle_end, vecScale(p_middle_mid, -1));

            var orth_left = rotate(vecAdd(vec1, vec2), 90);
            var orth_right = rotate(vecAdd(vec1, vec2), -90);

            // normalize and scale to track width
            orth_left = vecScale(orth_left, 1 / orth_left.norm() * this.width_array[i] / 2);
            orth_right = vecScale(orth_right, 1 / orth_right.norm() * this.width_array[i] / 2);
            
            left_side.push(orth_left.add(p_middle_mid));
            right_side.push(orth_right.add(p_middle_mid));
        }

        // draw 
        var result = `M ${this._queue[this.head].x} ${this._queue[this.head].y}`;


        left_side.forEach(p => {
            result += ` L ${p.x} ${p.y}`;
        });
        right_side.reverse();
        right_side.forEach(p => {
            result += ` L ${p.x} ${p.y}`;
        });

        // close the path
        result += "z";

        return result;
    }

}

class SVGQueue extends Queue {
    toPath() {
        if (this.isEmpty()) return "";
        if (this.len() == 1) return `M ${this._queue[this.head].x} ${this._queue[this.head].y}`;
        var result = `M ${this._queue[this.head].x} ${this._queue[this.head].y}`;
        for (let i = 1; i < Math.min(this._queue.length, this.len()); i++) {
            result += `L ${this._queue[(this.head + i) % this._queue.length].x} ${this._queue[(this.head + i) % this._queue.length].y}`;
        }
        return result;
    }
}