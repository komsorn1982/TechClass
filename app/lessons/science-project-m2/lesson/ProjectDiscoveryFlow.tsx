"use client";
import {useState} from "react";
import {ScienceDetectiveMission} from "./ScienceDetectiveMission";

const classifyCards=[
 ["ทดลองว่าปริมาณแสงมีผลต่อการงอกของถั่วหรือไม่",true],["สำรวจชนิดขยะที่พบในโรงเรียน",true],["สร้างเครื่องกรองน้ำและเปรียบเทียบความขุ่นก่อน–หลัง",true],
 ["คัดลอกข้อมูลเรื่องพืชจากอินเทอร์เน็ต",false],["เลือกดอกไม้ที่สวยที่สุดตามความชอบ",false],["ทำโปสเตอร์โดยไม่ได้ตั้งคำถามหรือเก็บข้อมูล",false]
] as const;
const compareCards=[
 ["ครูกำหนดคำถาม","ใบงาน"],["มีขั้นตอนให้ทำตาม","ใบงาน"],["นักเรียนเลือกปัญหา","โครงงาน"],["นักเรียนออกแบบวิธีตรวจสอบ","โครงงาน"],["อุปกรณ์ถูกกำหนดไว้","ใบงาน"],["สรุปจากข้อมูลที่ตนเองเก็บ","โครงงาน"]
] as const;
const projectTypes=[
 {icon:"🧪",name:"ทดลอง",example:"ความเค็มมีผลต่อการเติบโตของถั่วหรือไม่"},{icon:"📊",name:"สำรวจ",example:"สำรวจชนิดขยะในโรงเรียน"},{icon:"🛠️",name:"สิ่งประดิษฐ์",example:"สร้างเครื่องกรองน้ำจากวัสดุท้องถิ่น"},{icon:"💡",name:"ทฤษฎี/คำอธิบาย",example:"สร้างแบบจำลองอธิบายปรากฏการณ์"}
];
const processSteps=["สังเกตและพบปัญหา","ตั้งคำถามที่ตรวจสอบได้","ศึกษาข้อมูล","วางแผนและกำหนดตัวแปร","ทดลองหรือเก็บข้อมูล","วิเคราะห์ข้อมูล","สรุปจากหลักฐาน","นำเสนอผลงาน"];

export function ProjectDiscoveryFlow(props:{hour:number;initialStage:number;onFinish:()=>void}){
 if(props.initialStage===0)return <ScienceDetectiveMission hour={props.hour} onComplete={()=>{window.location.href=`/lessons/science-project-m2/lesson/activity/2?hour=${props.hour}`}}/>;
 return <LegacyDiscoveryFlow {...props}/>;
}

function LegacyDiscoveryFlow({hour,initialStage,onFinish}:{hour:number;initialStage:number;onFinish:()=>void}){
 const[stage]=useState(initialStage),[classify,setClassify]=useState<Record<number,boolean>>({}),[words,setWords]=useState<string[]>([]),[compare,setCompare]=useState<Record<number,string>>({}),[types,setTypes]=useState<Record<number,string>>({}),[order,setOrder]=useState<string[]>([]),[plan,setPlan]=useState<Record<number,number>>({}),[exit,setExit]=useState<Record<number,number>>({}),[feedback,setFeedback]=useState("");
 const stages=["แยกให้ชัด","ประกอบความหมาย","ลองเปรียบเทียบ","รู้จัก 4 ประเภท","เรียงเส้นทาง","ออกแบบโครงงาน","สรุปความรู้","Exit Ticket"];
 function next(){setFeedback("");if(stage<stages.length-1)window.location.href=`/lessons/science-project-m2/lesson/activity/${stage+2}?hour=${hour}`}
 function checkClassify(){const ok=classifyCards.every((x,i)=>classify[i]===x[1]);setFeedback(ok?"ยอดเยี่ยม! สิ่งที่เป็นโครงงานต้องมีคำถามและใช้ข้อมูลจริง":"ยังมีการ์ดบางใบสลับกลุ่ม ลองดูว่าได้ตั้งคำถามและเก็บข้อมูลจริงหรือไม่");if(ok)setTimeout(next,750)}
 const definitionWords=["ความสงสัยหรือปัญหา","กระบวนการทางวิทยาศาสตร์","เป็นระบบ","ข้อมูลและหลักฐานจริง"];
 function addWord(w:string){if(!words.includes(w))setWords(v=>[...v,w])}
 function checkWords(){const ok=words.join("|")===definitionWords.join("|");setFeedback(ok?"ถูกต้อง! เธอประกอบความหมายของโครงงานได้แล้ว":"ลองเรียงใหม่: เริ่มจากอะไร → ใช้อะไร → ทำอย่างไร → สรุปจากอะไร");if(ok)setTimeout(next,750)}
 function checkCompare(){const ok=compareCards.every((x,i)=>compare[i]===x[1]);setFeedback(ok?"ชัดเจนแล้ว! โครงงานเปิดโอกาสให้นักเรียนออกแบบการศึกษาเอง":"ลองดูว่าใครเป็นผู้กำหนดคำถามและวิธีศึกษา");if(ok)setTimeout(next,750)}
 function checkTypes(){const ok=projectTypes.every((x,i)=>types[i]===x.name);setFeedback(ok?"ครบทั้ง 4 ประเภทแล้ว! ระดับ ม.2 จะพบโครงงานทดลอง สำรวจ และสิ่งประดิษฐ์บ่อยที่สุด":"จับคู่จากลักษณะงาน: เปลี่ยนตัวแปร–เก็บข้อมูล–สร้างของ–สร้างคำอธิบาย");if(ok)setTimeout(next,750)}
 function chooseStep(x:string){if(order.includes(x))return;const expected=processSteps[order.length];if(x===expected){setOrder(v=>[...v,x]);setFeedback("")}else setFeedback("ขั้นนี้ยังไม่ถึง ลองมองหาสิ่งที่ต้องทำก่อน")}
 function checkOrder(){if(order.length===processSteps.length){setFeedback("เส้นทางสมบูรณ์! จากปัญหาไปสู่ข้อสรุปและการนำเสนอ");setTimeout(next,750)}else setFeedback(`ยังเหลืออีก ${processSteps.length-order.length} ขั้น`)}
 const planRows=[
  {label:"คำถาม",choices:["ปริมาณแสงมีผลต่อความสูงของต้นถั่วหรือไม่","ต้นถั่วกระถางใดสวยกว่า","ใครชอบปลูกต้นถั่วมากที่สุด"],answer:0},
  {label:"สิ่งที่เปลี่ยน",choices:["ปริมาณแสง","ความสูงของต้นถั่ว","ตารางบันทึกข้อมูล"],answer:0},
  {label:"สิ่งที่วัด",choices:["ชนิดของดิน","ความสูงของต้นถั่ว","ชื่อผู้ทดลอง"],answer:1},
  {label:"สิ่งที่ต้องเหมือนกัน",choices:["ชนิดพืช ดิน น้ำ และระยะเวลา","ปริมาณแสง","ความสูงที่วัดได้"],answer:0},
  {label:"หลักฐาน",choices:["ความรู้สึกของผู้ทดลอง","คำตอบจากเพื่อน","ตารางความสูงและภาพถ่ายแต่ละวัน"],answer:2}
 ];
 function checkPlan(){const ok=planRows.every((x,i)=>plan[i]===x.answer);setFeedback(ok?"เยี่ยม! ความสงสัยแรกกลายเป็นแผนโครงงานที่ตรวจสอบได้แล้ว":"ทบทวนว่าอะไรถูกเปลี่ยน อะไรถูกวัด และข้อมูลแบบใดใช้เป็นหลักฐาน");if(ok)setTimeout(next,850)}
 const exitQuestions=[
  {q:"หลังเกิดความสงสัยควรทำอะไร",c:["เดาทันที","ตั้งคำถามที่ตรวจสอบได้","เลือกคำตอบที่ชอบ"],a:1},
  {q:"สิ่งใดทำให้ข้อสรุปน่าเชื่อถือ",c:["หลักฐานจริง","ความคิดเห็นส่วนใหญ่","รายงานที่ยาว"],a:0},
  {q:"ข้อใดเป็นโครงงานวิทยาศาสตร์",c:["คัดลอกข้อมูล","ทำโปสเตอร์","สำรวจและวิเคราะห์ขยะในโรงเรียน"],a:2}
 ];
 const score=exitQuestions.reduce((n,q,i)=>n+(exit[i]===q.a?1:0),0);
 return <section id="discovery-flow" className="sci-discovery-flow"><header><div><small>DISCOVERY PATH</small><h2>{stages[stage]}</h2><p>ภารกิจ {stage+2} จาก 9</p></div><b>{stage+1}<span>/{stages.length}</span></b></header><div className="sci-flow-track">{stages.map((x,i)=><i title={x} className={i<stage?"done":i===stage?"active":""} key={x}/>)}</div>
 {stage===0&&<div className="sci-flow-panel"><h3>อะไรคือโครงงานวิทยาศาสตร์?</h3><p>อ่านแต่ละสถานการณ์ แล้วแตะเลือกกลุ่มที่สัมพันธ์กัน</p><div className="sci-classify-cards">{classifyCards.map((x,i)=><article key={x[0]}><b>{x[0]}</b><div><button className={classify[i]===true?"active":""} onClick={()=>setClassify(v=>({...v,[i]:true}))}>เป็นโครงงาน</button><button className={classify[i]===false?"active":""} onClick={()=>setClassify(v=>({...v,[i]:false}))}>ยังไม่เป็น</button></div></article>)}</div><button className="sci-flow-check" disabled={Object.keys(classify).length<6} onClick={checkClassify}>ตรวจการจัดกลุ่ม</button></div>}
 {stage===1&&<div className="sci-flow-panel"><h3>ประกอบความหมายด้วยคำสำคัญ</h3><p>แตะคำตามลำดับเพื่อเติมประโยค</p><div className="sci-definition"><span>โครงงานเริ่มจาก</span><b>{words[0]||"________"}</b><span>ใช้</span><b>{words[1]||"________"}</b><span>ค้นหาคำตอบอย่าง</span><b>{words[2]||"________"}</b><span>และสรุปจาก</span><b>{words[3]||"________"}</b></div><div className="sci-word-bank">{[definitionWords[2],definitionWords[0],definitionWords[3],definitionWords[1]].map(w=><button disabled={words.includes(w)} onClick={()=>addWord(w)} key={w}>{w}</button>)}</div><footer><button onClick={()=>setWords([])}>เริ่มเรียงใหม่</button><button disabled={words.length<4} onClick={checkWords}>ตรวจความหมาย</button></footer></div>}
 {stage===2&&<div className="sci-flow-panel"><h3>การทดลองตามใบงาน หรือโครงงาน?</h3><div className="sci-compare-cards">{compareCards.map((x,i)=><article key={x[0]}><b>{x[0]}</b><div><button className={compare[i]==="ใบงาน"?"active":""} onClick={()=>setCompare(v=>({...v,[i]:"ใบงาน"}))}>การทดลองตามใบงาน</button><button className={compare[i]==="โครงงาน"?"active":""} onClick={()=>setCompare(v=>({...v,[i]:"โครงงาน"}))}>โครงงานวิทยาศาสตร์</button></div></article>)}</div><button className="sci-flow-check" disabled={Object.keys(compare).length<6} onClick={checkCompare}>ตรวจการเปรียบเทียบ</button></div>}
 {stage===3&&<div className="sci-flow-panel"><h3>จับคู่ตัวอย่างกับโครงงาน 4 ประเภท</h3><div className="sci-type-match">{projectTypes.map((x,i)=><article key={x.name}><i>{x.icon}</i><p>{x.example}</p><div>{projectTypes.map(type=><button className={types[i]===type.name?"active":""} onClick={()=>setTypes(v=>({...v,[i]:type.name}))} key={type.name}>{type.name}</button>)}</div></article>)}</div><button className="sci-flow-check" disabled={Object.keys(types).length<4} onClick={checkTypes}>ตรวจการจับคู่</button></div>}
 {stage===4&&<div className="sci-flow-panel"><h3>สร้างเส้นทางการทำโครงงาน</h3><p>แตะขั้นตอนที่ควรเกิดขึ้นเป็นลำดับถัดไป</p><div className="sci-timeline-built">{order.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="sci-step-bank">{[processSteps[3],processSteps[0],processSteps[6],processSteps[2],processSteps[7],processSteps[4],processSteps[1],processSteps[5]].map(x=><button disabled={order.includes(x)} onClick={()=>chooseStep(x)} key={x}>{x}</button>)}</div><button className="sci-flow-check" onClick={checkOrder}>ตรวจเส้นทาง</button></div>}
 {stage===5&&<div className="sci-flow-panel"><h3>ช่วยออกแบบโครงงานต้นถั่ว</h3><p>เลือกการ์ดที่เหมาะสมในแต่ละส่วนของแผน</p><div className="sci-plan-builder">{planRows.map((row,i)=><article key={row.label}><b>{row.label}</b><div>{row.choices.map((x,n)=><button className={plan[i]===n?"active":""} onClick={()=>setPlan(v=>({...v,[i]:n}))} key={x}>{x}</button>)}</div></article>)}</div><button className="sci-flow-check" disabled={Object.keys(plan).length<5} onClick={checkPlan}>ตรวจแผนโครงงาน</button></div>}
 {stage===6&&<div className="sci-flow-panel sci-summary-panel"><span>⭐</span><h3>โครงงานวิทยาศาสตร์คือ...</h3><blockquote>การเปลี่ยนความสงสัยให้เป็นคำถาม แล้วค้นหาคำตอบอย่างเป็นระบบด้วยข้อมูลและหลักฐานจริง</blockquote><div><b>สงสัย</b><i>→</i><b>ตั้งคำถาม</b><i>→</i><b>วางแผน</b><i>→</i><b>เก็บหลักฐาน</b><i>→</i><b>สรุป</b></div><button className="sci-flow-check" onClick={next}>ทำ Exit Ticket →</button></div>}
 {stage===7&&<div className="sci-flow-panel"><h3>Exit Ticket · ตรวจความเข้าใจ 3 ประเด็น</h3><div className="sci-exit-cards">{exitQuestions.map((q,i)=><article key={q.q}><b>{i+1}. {q.q}</b><div>{q.c.map((x,n)=><button className={exit[i]===n?"active":""} onClick={()=>setExit(v=>({...v,[i]:n}))} key={x}>{x}</button>)}</div></article>)}</div>{Object.keys(exit).length===3&&<div className="sci-exit-result"><b>{score}/3</b><span>{score===3?"เข้าใจครบทั้ง 3 ประเด็น พร้อมเข้าสู่กิจกรรมถัดไป":"ลองทบทวนความสงสัย คำถาม และหลักฐานอีกครั้ง"}</span></div>}<button className="sci-flow-check" disabled={score<3} onClick={onFinish}>จบกิจกรรมและเรียนต่อ →</button></div>}
 {feedback&&<p className={feedback.startsWith("ยอด")||feedback.startsWith("ถูก")||feedback.startsWith("ชัด")||feedback.startsWith("ครบ")||feedback.startsWith("เส้น")||feedback.startsWith("เยี่ยม")?"sci-flow-feedback success":"sci-flow-feedback"} role="status">{feedback}</p>}</section>
}
