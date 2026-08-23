"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
type Student = {
    id: number;
    number: string;
    firstName: string;
    lastName: string;
    grade: number;
    classroom: string;
    avatarKey: string | null;
    currentUnit: number | null;
    totalUnits: number | null;
};
type Score = {
    studentId: number;
    courseCode: string;
    unit: number;
    score: number;
    maxScore: number;
};
type PreGroup = {
    studentId: number;
    courseCode: string;
    unit: number;
    hour: number;
    correct: number | null;
    group: string | null;
};
type Course = {
    code: string;
    name: string;
    grade: number;
    semester: number;
    units: number;
};
const classLabel = (grade: number, classroom: string) => classroom.startsWith(`${grade}/`) ? `ม.${classroom}` : `ม.${grade}/${classroom}`;
export function RosterManager({ initialStudents, scores, preGroups, courses }: {
    initialStudents: Student[];
    scores: Score[];
    preGroups: PreGroup[];
    courses: Course[];
}) { const [students, setStudents] = useState(initialStudents), [grade, setGrade] = useState(initialStudents[0]?.grade ?? 1), [room, setRoom] = useState(initialStudents[0]?.classroom ?? "1"), [courseCode, setCourseCode] = useState(courses.find(c => c.grade === (initialStudents[0]?.grade ?? 1))?.code ?? courses[0].code), [busy, setBusy] = useState(false); const rooms = useMemo(() => [...new Set(students.filter(s => s.grade === grade).map(s => s.classroom))].sort((a, b) => a.localeCompare(b, "th", { numeric: true })), [students, grade]), available = courses.filter(c => c.grade === grade), selected = available.find(c => c.code === courseCode) ?? available[0], shown = students.filter(s => s.grade === grade && s.classroom === room).sort((a, b) => Number(a.number) - Number(b.number)); function changeGrade(value: number) { setGrade(value); const next = [...new Set(students.filter(s => s.grade === value).map(s => s.classroom))].sort((a, b) => a.localeCompare(b, "th", { numeric: true }))[0] ?? "1"; setRoom(next); setCourseCode(courses.find(c => c.grade === value)?.code ?? courses[0].code); } async function removeOne(student: Student) { if (!confirm(`ยืนยันลบ ${student.firstName} ${student.lastName} ออกจากระบบ? ข้อมูลคะแนนและความคืบหน้าจะถูกลบด้วย`))
    return; setBusy(true); const r = await fetch(`/api/teacher/students/${student.id}`, { method: "DELETE" }); setBusy(false); if (r.ok)
    setStudents(list => list.filter(item => item.id !== student.id));
else
    alert("ลบนักเรียนไม่สำเร็จ"); } async function removeRoom() { if (!shown.length || !confirm(`ยืนยันลบนักเรียนชั้น ม.${grade}/${room} ทั้งหมด ${shown.length} คน?`))
    return; if (prompt("พิมพ์ “ลบทั้งห้อง” เพื่อยืนยัน") !== "ลบทั้งห้อง")
    return; setBusy(true); const r = await fetch("/api/teacher/students/bulk-delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ grade, classroom: room }) }); setBusy(false); if (r.ok)
    setStudents(list => list.filter(item => !(item.grade === grade && item.classroom === room)));
else
    alert("ลบนักเรียนทั้งห้องไม่สำเร็จ"); } function downloadExcel() { if (!selected || !shown.length)
    return; const esc = (v: string | number) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), headers = ["เลขที่", "ชื่อ-สกุลนักเรียน", ...Array.from({ length: selected.units }, (_, i) => `หน่วยที่ ${i + 1}`), "คะแนนรวม", "คะแนนเต็มรวม"], rows = shown.map(student => { const items = Array.from({ length: selected.units }, (_, i) => scores.find(s => s.studentId === student.id && s.courseCode === selected.code && s.unit === i + 1)), values = items.map(item => item?.score ?? 0), maximums = items.map(item => item?.maxScore ?? 10); return [student.number, `${student.firstName} ${student.lastName}`, ...values, values.reduce((a, b) => a + b, 0), maximums.reduce((a, b) => a + b, 0)]; }), html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><style>table{border-collapse:collapse;font-family:Tahoma}th{background:#6947e8;color:white}th,td{border:1px solid #999;padding:8px}caption{font-size:18px;font-weight:bold;margin:10px}</style></head><body><table><caption>${esc(selected.code)} ${esc(selected.name)} ชั้น ม.${grade}/${esc(room)}</caption><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`, blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" }), url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = `คะแนน_${selected.code}_ม${grade}-${room}.xls`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); } return <main className="roster-shell wrap"><div className="roster-heading"><div><span>TEACHER DASHBOARD · เฉพาะครู</span><h1>ข้อมูลนักเรียนที่ลงทะเบียน</h1><p>ดูคะแนนรายหน่วย ความคืบหน้า และจัดการข้อมูลแยกตามห้องเรียน</p></div><b>{shown.length} คน</b></div><section className="roster-toolbar"><label>ระดับชั้น<select value={grade} onChange={e => changeGrade(Number(e.target.value))}>{[1, 2, 3].map(n => <option value={n} key={n}>มัธยมศึกษาปีที่ {n}</option>)}</select></label><label>ห้องเรียน<select value={room} onChange={e => setRoom(e.target.value)}>{rooms.length ? rooms.map(r => <option value={r} key={r}>ม.{grade}/{r}</option>) : <option value="1">ยังไม่มีห้องเรียน</option>}</select></label><label>รายวิชา<select value={selected?.code ?? ""} onChange={e => setCourseCode(e.target.value)}>{available.map(c => <option value={c.code} key={c.code}>{c.code} · {c.name}</option>)}</select></label><div className="roster-tools"><button className="excel-download" disabled={!shown.length} onClick={downloadExcel}>↓ ดาวน์โหลด Excel</button><button className="delete-room" disabled={busy || !shown.length} onClick={removeRoom}>ลบนักเรียนทั้งห้อง</button></div></section>{selected && <div className="subject-summary"><div><small>รายวิชาที่กำลังแสดง</small><strong>{selected.name}</strong><span>{selected.code} · ภาคเรียนที่ {selected.semester}</span></div><b>{selected.units} หน่วย</b></div>}<section className="roster-table score-roster"><div className="roster-header"><span>ลำดับ</span><span>เลขที่</span><span>นักเรียน</span><span>คะแนนรายหน่วย</span><span>จัดการ</span></div>{shown.length ? shown.map((student, index) => { const ss = scores.filter(s => s.studentId === student.id && s.courseCode === selected?.code); return <article className="student-row" key={student.id}><b className="row-order">{index + 1}</b><b className="row-number">{student.number}</b><div className="student-identity">{student.avatarKey ? <img src={`/api/teacher/students/${student.id}/avatar`} alt=""/> : <span>{student.firstName.charAt(0)}</span>}<div><strong>{student.firstName} {student.lastName}</strong><small>ม.{student.grade}/{student.classroom}</small></div></div><div className="unit-scores">{Array.from({ length: selected?.units ?? 0 }, (_, i) => { const unit = i + 1, item = ss.find(s => s.unit === unit); return <span key={unit}><small>หน่วย {unit}</small><b>{item?.score ?? 0}/{item?.maxScore ?? 10}</b></span>; })}</div><div className="row-actions"><Link href={`/teacher/students/${student.id}/edit`}>แก้ไข</Link><Link href={`/teacher/students/${student.id}/latest`}>หน้าล่าสุด</Link><button disabled={busy} onClick={() => removeOne(student)}>ลบ</button></div></article>; }) : <div className="roster-empty">ยังไม่มีนักเรียนในห้องนี้</div>}</section></main>; }
