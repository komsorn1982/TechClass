"use client";
import { FormEvent, useState } from "react";

export function RegistrationForm() {
  const [state,setState]=useState<"idle"|"saving"|"done"|"error">("idle");
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setState("saving");const data=Object.fromEntries(new FormData(e.currentTarget));const res=await fetch("/api/students",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});setState(res.ok?"done":"error")}
  return <form className="register-form" onSubmit={submit}>
    <div className="field-row"><label>ชื่อ<input name="firstName" required placeholder="ชื่อจริง"/></label><label>นามสกุล<input name="lastName" required placeholder="นามสกุล"/></label></div>
    <div className="field-row"><label>เลขที่<input name="studentCode" required inputMode="numeric" pattern="[0-9]{1,3}" placeholder="เช่น 12"/><small>เลขที่ในชั้นเรียน 1–3 หลัก</small></label><label>ห้องเรียน<input name="classroom" required placeholder="เช่น 1/2"/></label></div>
    <label>ระดับชั้น<select name="gradeLevel" required defaultValue=""><option value="" disabled>เลือกระดับชั้น</option><option value="1">มัธยมศึกษาปีที่ 1</option><option value="2">มัธยมศึกษาปีที่ 2</option><option value="3">มัธยมศึกษาปีที่ 3</option></select></label>
    <button className="auth-submit" disabled={state==="saving"}>{state==="saving"?"กำลังบันทึก...":"ลงทะเบียนนักเรียน →"}</button>
    {state==="done"&&<p className="form-success">✓ ลงทะเบียนเรียบร้อยแล้ว</p>}{state==="error"&&<p className="form-error">กรุณาเข้าสู่ระบบก่อน หรือข้อมูลเลขที่นี้ถูกใช้งานแล้ว</p>}
  </form>;
}
