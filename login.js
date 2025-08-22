// login.js
export function sayHi() {
    const message = 'hi';
    console.log(message);
    return message;
}

if (typeof require !== 'undefined' && require.main === module) {
    sayHi();
}