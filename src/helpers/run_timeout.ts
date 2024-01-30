/* 
* Runs a callback after a timeout. If no timeout is provided, it will use a default timeout 
*/

const defaultTimeout = 400 //(ms)

export function runTimeout(callback: () => void, timeout?: number) {
    setTimeout(() => callback(), timeout ? timeout : defaultTimeout)
}
