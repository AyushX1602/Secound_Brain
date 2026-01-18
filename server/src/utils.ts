export function random(len: number) {
    let options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let length = options.length;
    let result = "";
    for (let i = 0; i < len; i++) {
        result += options.charAt(Math.floor(Math.random() * options.length));
    }
    return result;
}