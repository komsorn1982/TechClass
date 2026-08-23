import {del,get,put} from "@vercel/blob";
export const uploads={
 async put(key:string,data:ArrayBuffer,options?:{httpMetadata?:{contentType?:string}}){await put(key,data,{access:"private",addRandomSuffix:false,contentType:options?.httpMetadata?.contentType});},
 async get(key:string){const result=await get(key,{access:"private"});if(!result)return null;return {body:result.stream,httpMetadata:{contentType:result.blob.contentType}};},
 async delete(key:string){await del(key);}
};

