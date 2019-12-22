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

    // pop(){
    //     if(this.isEmpty()){
    //         return;
    //     }
    //     if((this.rear + 1) % N == this.front){
    //         this.head = (this.head + 1) % N;;
    //     }
    // }

}

class BallTrack extends Queue {

    constructor(track_length, ball_size) {
        super(track_length);
        this.max_size = ball_size;
        this.track_width = [];
    }

    push(o) {
        if (this.track_width.length < this._queue.length) {
            if (!this.track_width.length) {
                // console.warn('ss');
                this.track_width.push(this.max_size);
            } else {
                for (var wi in this.track_width) {

                    this.track_width[wi] *= (1 - 1 / this.track_width.length);
                }
                this.track_width.push(this.max_size);
            }
        }
        super.push(o);
    }

    toPath() {
        // only one dot do not draw on canvas
        if (this.len() < 3) return "";

        // left_side means the left hand side path when the track_width is add on the queue with the queue referring the track in the middle
        // the same thing is ture on right_side;
        // both sides contains Point2Ds;
        var left_side = [];
        var right_side = [];

        // for all widths of track_width, calculate the left point(rotate 90 degs) and right point(rotate -90 degs) from the middle point(queue point)
        for (let i = 2; i < this.track_width.length; i++) {
            var p_middle_start = this._queue[(this.head + i - 2) % this._queue.length];
            var p_middle_mid = this._queue[(this.head + i - 1) % this._queue.length];
            var p_middle_end = this._queue[(this.head + i) % this._queue.length];
            // console.log('i=' + i + ': ' + p_middle_mid);

            var vec1 = vecAdd(p_middle_mid, vecScale(p_middle_start, -1));
            var vec2 = vecAdd(p_middle_end, vecScale(p_middle_mid, -1));

            var orth_left = rotate(vecAdd(vec1, vec2), 90);
            var orth_right = rotate(vecAdd(vec1, vec2), -90);

            
            // normalize and scale to track width
            orth_left = vecScale(orth_left, 1 / orth_left.norm() * this.track_width[i] / 2);
            orth_right = vecScale(orth_right, 1 / orth_right.norm() * this.track_width[i] / 2);
            // console.log('i=' + i + ': ' + orth_left + ' ' +orth_right);
            
            // console.log('i=' + i + ': ' + p_middle_mid);
            
            left_side.push(orth_left.add(p_middle_mid));
            right_side.push(orth_right.add(p_middle_mid));
        }

        // draw the ball track
        // var result = `M ${this._queue[this.head].x} ${this._queue[this.head].y} L ${left_side[0].x} ${left_side[0].y} L ${right_side[0].x} ${right_side[0].y}z `;
        var result = `M ${this._queue[this.head].x} ${this._queue[this.head].y}`;

        // for(let i = 1; i < left_side.length; i++){
        //     result += `M ${left_side[i-1].x} ${left_side[i-1].y} L ${right_side[i-1].x} ${right_side[i-1].y} L ${right_side[i].x} ${right_side[i].y} ${left_side[i].x} ${left_side[i].y}z `;
        // }

        // console.log('left: ' + left_side);
        // console.log('right: ' + right_side);

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

class PlayerTrack extends Queue {
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