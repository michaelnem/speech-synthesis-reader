export class Interpolation {
    static readonly lerp = (a: number, b: number, alpha: number, clamp = true) => {
        const res = a + alpha * (b - a);
        return clamp ? Interpolation.clamp(a, b, res) : res;
    }

    static readonly normalize = (min: number, max: number, value: number, clamp = true) => {
        let res = (value - min) / (max - min);
        return clamp ? Interpolation.clamp(min, max, res) : res;
    }

    static readonly clamp = (min: number, max: number, value: number) => {
        return Math.min(Math.max(value, min), max);
    }
}