export class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copyFrom(c: Coord) {
        this.x = c.x;
        this.y = c.y;
    }

    sub(c: Coord) {
        return new Coord(this.x - c.x, this.y - c.y);
    }

    add(c: Coord) {
        return new Coord(this.x + c.x, this.y + c.y);
    }

    copy() {
        return new Coord(this.x, this.y);
    }

    getTheta(v: Coord) {
        let angle1 = Math.atan2(this.x, this.y);
        let angle2 = Math.atan2(v.x, v.y);
        return angle2 - angle1;
    }

    norm2() {
        return this.x ** 2 + this.y ** 2;
    }

    getRho(v: Coord) {
        let d1 = this.norm2();
        let d2 = v.norm2();
        return Math.sqrt(d2 / d1);
    }

    normalize(): Coord {
        const norm = Math.sqrt(this.norm2());
        return new Coord(this.x/norm, this.y/norm);
    }

    rotateQuarter(){
        return new Coord(this.y, - this.x);
    }

    scale(r: number){
        return new Coord(this.x*r, this.y*r);
    }

    translate(shift: Vect) {
        this.x += shift.x;
        this.y += shift.y;
    }

    rtranslate(shift: Vect) {
        this.x -= shift.x;
        this.y -= shift.y;
    }

    opposite(): Coord {
        return new Coord(-this.x, -this.y);
    }

    dist2(pos: Coord) {
        return (this.x - pos.x) ** 2 + (this.y - pos.y) ** 2;
    }

    isInRect(c1: Coord, c2: Coord) : boolean {
        return Math.min(c1.x, c2.x) <= this.x && this.x <= Math.max(c1.x, c2.x) &&  Math.min(c1.y, c2.y) <= this.y && this.y <= Math.max(c1.y, c2.y);
    }

    middle(c: Coord) {
        return new Coord((this.x + c.x) / 2, (this.y + c.y) / 2);
    }

    /**
     * Compute the orthogonal projection of this on the line defined
     * by a point 'point' and a non zero direction.
     */
    
    orthogonalProjection(point: Coord, direction: Vect): Coord{
        const norm = direction.norm();
        const u = new Vect(direction.x/norm, direction.y/norm);
        const v = Vect.fromCoords(point, this);
        const ps = u.x*v.x + u.y*v.y;
        return new Coord( point.x + u.x*ps , point.y + u.y*ps);
    }

    vectorTo(other: Coord){
        return Vect.fromCoords(this, other);
    }
}

export function middle(c1: Coord, c2: Coord) {
    return new Coord((c1.x + c2.x) / 2, (c1.y + c2.y) / 2);
}

export class Vect {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     */
    rescale(r: number){
        this.x *= r;
        this.y *= r;
    }

    /**
     * UNTESTED
     * Return the dot product of this vector with another one.
     * `u.dot(v) = u.x*v.x + u.y*v.y`
     */
    dot(other: Vect): number{
        return this.x*other.x + this.y*other.y;
    }

    norm() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * `v = v*s/norm(v)`
     */
    setNorm(s: number){
        const n = this.norm();
        this.x = this.x * s / n;
        this.y = this.y * s / n;
    }

    /**
     * Rotates `this` Vect.
     * @param angle is in radians (3.14 or Math.PI for an half circle)
     */
    rotate(angle: number){
        const a = Math.cos(angle)*this.x - Math.sin(angle)*this.y;
        const b = Math.sin(angle)*this.x + Math.cos(angle)*this.y;
        this.x = a;
        this.y = b;
    }

    set_from(v: Vect){
        this.x = v.x;
        this.y = v.y;
    }

    sub(v: Vect): Vect{
        return new Vect(this.x - v.x, this.y - v.y);
    }

    translate(v: Vect){
        this.x += v.x;
        this.y += v.y;
    }

    opposite(): Vect{
        return new Vect(-this.x, -this.y);
    }

    static fromCoords(src: Coord, dest: Coord): Vect{
        return new Vect(dest.x - src.x, dest.y - src.y);
    }
}
