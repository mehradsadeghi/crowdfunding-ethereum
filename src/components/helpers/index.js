export function encode(data) {
    return window.btoa(data);
}

export function decode(data) {
    return window.atob(data);
}