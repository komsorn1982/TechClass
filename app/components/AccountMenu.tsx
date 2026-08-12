"use client";
import { ChangeEvent,useRef,useState } from "react";

export function AccountMenu({name,avatarUrl}:{name:string;avatarUrl:string|null}){
 const input=useRef<HTMLInputElement>(null);const[uploading,setUploading]=useState(false);
 async function upload(event:ChangeEvent<HTMLInputElement>){const file=event.target.files?.[0];if(!file)return;setUploading(true);const form=new FormData();form.set("avatar",file);const response=await fetch("/api/profile/avatar",{method:"POST",body:form});if(response.ok)window.location.reload();else{setUploading(false);alert("ไม่สามารถเปลี่ยนรูปได้ กรุณาใช้ไฟล์ JPG, PNG หรือ WebP ขนาดไม่เกิน 3 MB")}}
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});window.location.href="/"}
 return <div className="account-menu"><button className="avatar-button" onClick={()=>input.current?.click()} aria-label="เปลี่ยนรูปโปรไฟล์">{avatarUrl?<img src={avatarUrl} alt="รูปโปรไฟล์"/>:<span>{name.charAt(0)}</span>}<i>{uploading?"…":"✎"}</i></button><input ref={input} type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} hidden/><div className="account-name"><small>นักเรียน</small><strong>{name}</strong></div><button className="logout-button" onClick={logout}>Logout</button></div>
}
