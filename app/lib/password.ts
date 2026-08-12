const encoder = new TextEncoder();
function toBase64(bytes: Uint8Array) { let binary=""; for(const byte of bytes) binary+=String.fromCharCode(byte); return btoa(binary); }
function fromBase64(value:string) { const binary=atob(value); return Uint8Array.from(binary, char=>char.charCodeAt(0)); }
async function derive(password:string,salt:Uint8Array){const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);return new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:210_000},key,256));}
export async function hashPassword(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));return{passwordHash:toBase64(await derive(password,salt)),passwordSalt:toBase64(salt)}}
export async function verifyPassword(password:string,expectedHash:string,salt:string){const actual=await derive(password,fromBase64(salt));const expected=fromBase64(expectedHash);if(actual.length!==expected.length)return false;let mismatch=0;for(let i=0;i<actual.length;i++)mismatch|=actual[i]^expected[i];return mismatch===0;}
export async function hashSessionToken(token:string){const digest=await crypto.subtle.digest("SHA-256",encoder.encode(token));return toBase64(new Uint8Array(digest));}
