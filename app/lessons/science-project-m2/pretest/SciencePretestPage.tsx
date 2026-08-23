"use client";
import {useEffect,useMemo,useState} from "react";
import {scienceHours,scienceMissions} from "../science-data";

const missionStarts=[1,3,5,8,11,14,17,19];
const questionBank=[
 {q:"ข้อใดอธิบายความหมายของโครงงานวิทยาศาสตร์ได้เหมาะสมที่สุด",c:["การศึกษาค้นคว้าอย่างเป็นระบบเพื่อหาคำตอบ","การคัดลอกการทดลองจากหนังสือ","การทำรายงานที่มีภาพจำนวนมาก","การสร้างสิ่งประดิษฐ์โดยไม่ต้องตั้งคำถาม"],a:0},
 {q:"สิ่งใดควรเป็นจุดเริ่มต้นของการทำโครงงานวิทยาศาสตร์",c:["ซื้ออุปกรณ์","ตั้งคำถามจากปัญหาหรือความสงสัย","เขียนผลการทดลอง","เตรียมนำเสนอ"],a:1},
 {q:"คำถามใดสามารถตรวจสอบด้วยกระบวนการทางวิทยาศาสตร์ได้",c:["ดอกไม้ชนิดใดสวยที่สุด","เพลงใดไพเราะที่สุด","ปริมาณแสงมีผลต่อการสูงของต้นถั่วหรือไม่","สีใดเป็นสีที่ดีที่สุด"],a:2},
 {q:"สมมติฐานมีหน้าที่สำคัญอย่างไร",c:["บอกผลที่เกิดขึ้นจริงแล้ว","คาดคะเนคำตอบอย่างมีเหตุผล","กำหนดชื่อสมาชิกกลุ่ม","สรุปค่าใช้จ่ายทั้งหมด"],a:1},
 {q:"ตัวแปรต้นหมายถึงสิ่งใด",c:["สิ่งที่ผู้ทดลองวัดผล","สิ่งที่ต้องควบคุมให้เหมือนกัน","สิ่งที่ผู้ทดลองตั้งใจเปลี่ยน","ข้อสรุปของการทดลอง"],a:2},
 {q:"ตัวแปรตามหมายถึงสิ่งใด",c:["ผลที่สังเกตหรือวัดเมื่อเปลี่ยนตัวแปรต้น","สิ่งที่ทำให้เหมือนกันทุกชุด","หัวข้อของโครงงาน","อุปกรณ์ที่ใช้ทดลอง"],a:0},
 {q:"เหตุใดจึงต้องกำหนดตัวแปรควบคุม",c:["เพื่อให้ผลทุกชุดเท่ากัน","เพื่อเปรียบเทียบผลได้อย่างเป็นธรรม","เพื่อใช้วัสดุให้น้อยที่สุด","เพื่อไม่ต้องบันทึกข้อมูล"],a:1},
 {q:"ข้อมูลแบบใดช่วยให้เปรียบเทียบผลการทดลองได้ชัดเจน",c:["ความรู้สึกของผู้ทดลอง","ตารางบันทึกค่าที่วัดด้วยหน่วยเดียวกัน","คำตอบจากเพียงคนเดียว","ข้อความที่ไม่ระบุเวลา"],a:1},
 {q:"ข้อสรุปที่ดีควรมีลักษณะอย่างไร",c:["ตรงกับสิ่งที่ผู้ทดลองต้องการเสมอ","อ้างอิงข้อมูลและตอบคำถามของโครงงาน","ยาวที่สุดเท่าที่ทำได้","เหมือนกับสมมติฐานทุกประการ"],a:1},
 {q:"เมื่อผลการทดลองไม่ตรงกับสมมติฐาน นักเรียนควรทำอย่างไร",c:["เปลี่ยนข้อมูลให้ตรง","ลบผลการทดลอง","วิเคราะห์สาเหตุและรายงานตามข้อมูลจริง","สรุปว่าโครงงานล้มเหลวทันที"],a:2}
];

export function SciencePretestPage(){
 const[hour,setHour]=useState(1),[answers,setAnswers]=useState<Record<number,number>>({}),[result,setResult]=useState<number|null>(null),[round,setRound]=useState(0),[seed,setSeed]=useState(1);
 useEffect(()=>{const value=Number(new URLSearchParams(window.location.search).get("hour"));setHour(Number.isFinite(value)?Math.min(20,Math.max(1,value)):1);setSeed(Math.floor(Math.random()*2147483646)+1)},[]);
 useEffect(()=>{if(round)setSeed(Math.floor(Math.random()*2147483646)+1)},[round]);
 const questions=useMemo(()=>{let state=seed;const shuffle=<T,>(items:T[])=>{const copy=[...items];for(let i=copy.length-1;i>0;i--){state=state*48271%2147483647;const j=state%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};return shuffle(questionBank.map((x,id)=>({id,q:x.q,choices:shuffle(x.c.map((text,index)=>({text,correct:index===x.a})))})))},[seed]);
 const missionIndex=Math.max(0,scienceMissions.findIndex((_,i)=>hour>=missionStarts[i]&&hour<missionStarts[i]+scienceMissions[i].hourCount));
 const lessonUrl=`/lessons/science-project-m2/lesson?hour=${hour}`;
 async function submit(){const score=questions.reduce((sum,q,i)=>sum+(q.choices[answers[i]]?.correct?1:0),0);localStorage.setItem(`scilab-m2-pretest-hour-${hour}`,"completed");setResult(score);await fetch("/api/learning/results",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"pre",courseCode:"ว20290",unit:missionIndex+1,hour,correct:score,total:10})}).catch(()=>undefined)}
 function retry(){setAnswers({});setResult(null);setRound(v=>v+1);window.scrollTo({top:0,behavior:"smooth"})}
 return <main className="sci-pretest-page"><header><a href={`/lessons/science-project-m2?hour=${hour}`}>← กลับสู่เส้นทางการเรียน</a><small>ชั่วโมงที่ {hour} · Mission {String(missionIndex+1).padStart(2,"0")}</small><h1>แบบทดสอบก่อนเรียน</h1><p>{scienceHours[hour-1]} · สำรวจความรู้เดิม 10 ข้อ และไม่นำมาคิดคะแนน</p></header><article className="sci-hour-stage"><div className="sci-pre-progress"><b>{Object.keys(answers).length}/10 ข้อ</b><span><i style={{width:`${Object.keys(answers).length*10}%`}}/></span></div>{questions.map((q,i)=><fieldset key={q.id}><legend>{i+1}. {q.q}</legend>{q.choices.map((choice,n)=><button className={answers[i]===n?"selected":""} onClick={()=>setAnswers(v=>({...v,[i]:n}))} key={choice.text}><i>{String.fromCharCode(65+n)}</i>{choice.text}</button>)}</fieldset>)}<button className="sci-hour-next" disabled={Object.keys(answers).length<10} onClick={()=>void submit()}>ส่งแบบทดสอบก่อนเรียน</button></article>{result!==null&&<div className="sci-pre-modal" role="dialog" aria-modal="true"><div><small>ผลการทำแบบทดสอบก่อนเรียน</small><b>{result}<span>/10</span></b><p>ตอบถูก {result} ข้อ จากทั้งหมด 10 ข้อ</p><em>ไม่นำมาคิดคะแนน · บันทึกผลเพื่อวางแผนการเรียนรู้</em><footer><button onClick={retry}>ทำใหม่</button><a href={lessonUrl}>เข้าสู่บทเรียน →</a></footer></div></div>}</main>
}
