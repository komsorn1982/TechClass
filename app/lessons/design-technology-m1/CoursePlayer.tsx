"use client";
import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "./course-data";
import { unitNames } from "./course-data";
type Answers = Record<string, number>;
type View = "path" | "pre" | "lesson" | "task" | "post";
const COURSE_CODE = "ว21103";
async function saveLearningResult(payload: Record<string, unknown>) { try {
    await fetch("/api/learning/results", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ courseCode: COURSE_CODE, ...payload }) });
}
catch { /* ผู้ใช้ที่ยังไม่เข้าสู่ระบบยังทดลองเรียนต่อได้ */ } }
export function CoursePlayer({ lessons }: {
    lessons: Lesson[];
}) {
    const [active, setActive] = useState(1), [view, setView] = useState<View>("path"), [answers, setAnswers] = useState<Answers>({});
    const [lessonDone, setLessonDone] = useState<Record<number, boolean>>({}), [taskDone, setTaskDone] = useState<Record<number, boolean>>({}), [gameDone, setGameDone] = useState<Record<number, boolean>>({});
    const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
    const lesson = lessons[active - 1];
    const answered = (kind: "pre" | "post") => lesson[kind].filter((_, i) => answers[`${active}-${kind}-${i}`] !== undefined).length;
    const correct = (kind: "pre" | "post") => lesson[kind].reduce((n, q, i) => n + (answers[`${active}-${kind}-${i}`] === q.answer ? 1 : 0), 0);
    const preDone = answered("pre") === 10 && !!quizSubmitted[`${active}-pre`], postDone = answered("post") === 10 && !!quizSubmitted[`${active}-post`];
    const raw = Math.round((correct("post") * .4 + (taskDone[active] ? 2 : 0)) * 10) / 10;
    const completed = useMemo(() => lessons.filter(l => taskDone[l.hour] && lessonDone[l.hour] && quizSubmitted[`${l.hour}-post`]).length, [lessons, taskDone, lessonDone, quizSubmitted]);
    const openHour = (n: number) => { setActive(n); setView("path"); };
    const resetQuiz = (kind: "pre" | "post") => { setAnswers(a => Object.fromEntries(Object.entries(a).filter(([key]) => !key.startsWith(`${active}-${kind}-`)))); setQuizSubmitted(s => ({ ...s, [`${active}-${kind}`]: false })); };
    return <div className="dt-layout wrap"><aside className="dt-sidebar"><div className="dt-progress"><div><b>{completed}/20</b><span>ชั่วโมงที่เรียนครบ</span></div><progress value={completed} max={20}/></div><nav>{lessons.map(l => <button key={l.hour} className={active === l.hour ? "active" : ""} onClick={() => openHour(l.hour)}><i>{String(l.hour).padStart(2, "0")}</i><span><small>หน่วย {l.unit}</small>{l.title}</span><em>{taskDone[l.hour] && lessonDone[l.hour] ? "✓" : ""}</em></button>)}</nav></aside><main className="dt-stage">{view === "path" && <LearningPath lesson={lesson} raw={raw} preDone={preDone} lessonDone={!!lessonDone[active]} taskDone={!!taskDone[active]} postDone={postDone} open={setView}/>} {view === "pre" && <QuizPage kind="pre" lesson={lesson} active={active} answers={answers} setAnswers={setAnswers} submitted={!!quizSubmitted[`${active}-pre`]} submit={() => setQuizSubmitted(s => ({ ...s, [`${active}-pre`]: true }))} reset={() => resetQuiz("pre")} back={() => setView("path")} next={() => setView("lesson")}/>} {view === "lesson" && <LessonPage lesson={lesson} gameDone={!!gameDone[active]} setGameDone={v => setGameDone(s => ({ ...s, [active]: v }))} finish={() => { setLessonDone(s => ({ ...s, [active]: true })); setView("path"); }} back={() => setView("path")}/>} {view === "task" && <TaskPage lesson={lesson} done={!!taskDone[active]} finish={() => { setTaskDone(s => ({ ...s, [active]: true })); setView("path"); }} back={() => setView("path")}/>} {view === "post" && <QuizPage kind="post" lesson={lesson} active={active} answers={answers} setAnswers={setAnswers} submitted={!!quizSubmitted[`${active}-post`]} submit={() => setQuizSubmitted(s => ({ ...s, [`${active}-post`]: true }))} reset={() => resetQuiz("post")} back={() => setView("path")} next={() => setView("path")}/>}</main></div>;
}
function LearningPath({ lesson, raw, preDone, lessonDone, taskDone, postDone, open }: {
    lesson: Lesson;
    raw: number;
    preDone: boolean;
    lessonDone: boolean;
    taskDone: boolean;
    postDone: boolean;
    open: (v: View) => void;
}) {
    const steps = [
        { view: "pre" as View, title: "แบบทดสอบก่อนเรียน", sub: preDone ? "ทำครบ 10 ข้อแล้ว" : "พร้อมเริ่มเรียน", ready: true, done: preDone },
        { view: "lesson" as View, title: "บทเรียนและเกม", sub: lessonDone ? "เรียนเนื้อหาแล้ว" : "ทำขั้นก่อนหน้าให้เสร็จ", ready: preDone, done: lessonDone },
        { view: "task" as View, title: "ใบงานออนไลน์", sub: taskDone ? "ส่งภาระงานแล้ว" : "ทำขั้นก่อนหน้าให้เสร็จ", ready: preDone && lessonDone, done: taskDone },
        { view: "post" as View, title: "แบบทดสอบหลังเรียน", sub: postDone ? "ทำครบ 10 ข้อแล้ว" : "ทำขั้นก่อนหน้าให้เสร็จ", ready: preDone && lessonDone && taskDone, done: postDone }
    ];
    return <section className="dt-path-card"><header><div><span>ชั่วโมงที่ {lesson.hour} · หน่วย {lesson.unit}</span><h2>{lesson.title}</h2><p>{unitNames[lesson.unit]}</p></div><div className="dt-points"><b>{raw}</b><span>/ 10 คะแนน</span></div></header><div className="dt-path-intro"><h3>เส้นทางการเรียนของฉัน</h3><p>ทำกิจกรรมตามลำดับเพื่อปลดล็อกขั้นถัดไป</p></div><div className="dt-path-list">{steps.map((s, i) => <button key={s.view} disabled={!s.ready} onClick={() => open(s.view)}><i>{s.done ? "✓" : s.ready ? i + 1 : "▣"}</i><span><b>{s.title}</b><small>{s.sub}</small></span><em>›</em></button>)}</div></section>;
}
function PageHeader({ lesson, label, back }: {
    lesson: Lesson;
    label: string;
    back: () => void;
}) { return <header className="dt-page-head"><button onClick={back}>← กลับสู่เส้นทาง</button><span>ชั่วโมงที่ {lesson.hour}</span><h2>{label}</h2><p>{lesson.title}</p></header>; }
function QuizPage({ kind, lesson, active, answers, setAnswers, submitted, submit, reset, back, next }: {
    kind: "pre" | "post";
    lesson: Lesson;
    active: number;
    answers: Answers;
    setAnswers: (v: (a: Answers) => Answers) => void;
    submitted: boolean;
    submit: () => void;
    reset: () => void;
    back: () => void;
    next: () => void;
}) {
    const [items, setItems] = useState<{
        q: string;
        original: number;
        choices: {
            text: string;
            original: number;
        }[];
    }[]>([]), [attempt, setAttempt] = useState(0);
    useEffect(() => { setItems(lesson[kind].map((q, original) => ({ q: q.q, original, choices: q.choices.map((text, i) => ({ text, original: i })).sort(() => Math.random() - .5) })).sort(() => Math.random() - .5)); }, [active, kind, lesson, attempt]);
    const count = lesson[kind].filter((_, i) => answers[`${active}-${kind}-${i}`] !== undefined).length;
    const correctCount = lesson[kind].reduce((n, q, i) => n + (answers[`${active}-${kind}-${i}`] === q.answer ? 1 : 0), 0), weighted = Math.round(correctCount * (kind === "pre" ? .2 : .4) * 10) / 10;
    const abilityGroup = correctCount <= 4 ? "อ่อน" : correctCount <= 7 ? "กลาง" : "เก่ง";
    const handleSubmit = () => { submit(); void saveLearningResult(kind === "pre" ? { kind: "pre", unit: lesson.unit, hour: active, correct: correctCount, total: 10 } : { kind: "post", unit: lesson.unit, hour: active, score: weighted, maxScore: 4 }); };
    return <section className="dt-page">
  <PageHeader lesson={lesson} label={kind === "pre" ? "แบบทดสอบก่อนเรียน" : "แบบทดสอบหลังเรียน"} back={back}/>
  <div className="dt-quiz-progress"><b>{count}/10 ข้อ</b><progress value={count} max={10}/><span>{kind === "pre" ? "ไม่คิดคะแนน · ใช้จัดกลุ่มผู้เรียน" : "4 คะแนน · นำไปรวมเป็นคะแนนเก็บของหน่วย"} · คำถามและตัวเลือกสุ่มใหม่ทุกครั้ง</span></div>
  {submitted && <div className="dt-quiz-result-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-result-title"><section className="dt-quiz-result"><small id="quiz-result-title">ผลการทำแบบทดสอบ{kind === "pre" ? "ก่อนเรียน" : "หลังเรียน"}</small><div><b>{correctCount}<i>/10</i></b><span>ตอบถูก {correctCount} ข้อ จากทั้งหมด 10 ข้อ</span></div>{kind === "pre" ? <p><strong>ไม่นำมาคิดคะแนน</strong> · ระบบบันทึกผลเพื่อวางแผนการเรียนรู้แล้ว</p> : <p>คะแนนเก็บจากแบบทดสอบ <strong>{weighted}/4 คะแนน</strong></p>}{kind === "post" && <em>{correctCount >= 8 ? "ยอดเยี่ยม! นักเรียนเข้าใจเนื้อหาเป็นอย่างดี" : correctCount >= 5 ? "ทำได้ดี ลองทบทวนข้อที่ยังไม่ถูกต้อง" : "ควรทบทวนสไลด์และบทเรียนอีกครั้ง"}</em>}<footer><button onClick={() => { reset(); setAttempt(a => a + 1); }}>ทำแบบทดสอบใหม่</button><button className="primary" onClick={next}>{kind === "pre" ? "เข้าสู่บทเรียน" : "กลับสู่เส้นทางการเรียน"} →</button></footer></section></div>}
  <div className="dt-quiz">{items.map((q, n) => <fieldset disabled={submitted} key={q.original}><legend>{n + 1}. {q.q}</legend>{q.choices.map((c, ci) => { const key = `${active}-${kind}-${q.original}`, picked = answers[key] === c.original, correct = c.original === lesson[kind][q.original].answer, reveal = submitted && kind === "post"; return <button type="button" className={reveal && correct ? "correct" : reveal && picked ? "wrong" : picked && !submitted ? "selected" : ""} onClick={() => setAnswers(a => ({ ...a, [key]: c.original }))} key={c.original}><i>{String.fromCharCode(65 + ci)}</i>{c.text}{reveal && correct && <em>คำตอบที่ถูกต้อง</em>}{reveal && picked && !correct && <em>คำตอบที่เลือก</em>}</button>; })}</fieldset>)}</div>
  <div className="dt-page-actions"><button onClick={back}>{submitted ? "กลับสู่เส้นทาง" : "บันทึกและกลับ"}</button>{!submitted ? <button className="primary" disabled={count < 10} onClick={handleSubmit}>ส่งคำตอบและดูผลประเมิน →</button> : <button className="primary" onClick={next}>{kind === "pre" ? "ไปเรียนเนื้อหา" : "เสร็จสิ้นแบบทดสอบ"} →</button>}</div>
 </section>;
}
function LessonPage({ lesson, gameDone, setGameDone, finish, back }: {
    lesson: Lesson;
    gameDone: boolean;
    setGameDone: (v: boolean) => void;
    finish: () => void;
    back: () => void;
}) { return <section className="dt-page"><PageHeader lesson={lesson} label="บทเรียนและเกม" back={back}/><section className="dt-goal"><b>จุดประสงค์การเรียนรู้</b><p>{lesson.objective}</p></section><section className="dt-lesson-intro"><small>เริ่มต้นเรียนรู้</small><h3>{lesson.title} สำคัญอย่างไร</h3><p>เทคโนโลยีเกี่ยวข้องกับการแก้ปัญหาและการดำเนินชีวิตของมนุษย์ การเรียนเรื่องนี้จะช่วยให้นักเรียนเข้าใจหลักการ มองเห็นความสัมพันธ์ขององค์ประกอบ และเลือกนำความรู้ไปใช้กับสถานการณ์จริงได้อย่างเหมาะสม ปลอดภัย และรับผิดชอบ</p></section><LessonConcepts lesson={lesson}/><InteractiveScenario lesson={lesson}/><section className="dt-summary"><small>สรุปจำง่าย</small><h3>ก่อนเล่นเกม นักเรียนควรรู้ว่า…</h3><ul><li>{lesson.objective}</li><li>การตัดสินใจควรมีข้อมูลและเหตุผลสนับสนุน</li><li>การใช้เทคโนโลยีต้องคำนึงถึงผู้ใช้ ความปลอดภัย และผลกระทบ</li></ul></section><GameChallenge lesson={lesson} done={gameDone} setDone={setGameDone}/><div className="dt-page-actions"><button onClick={back}>กลับ</button><button className="primary" disabled={!gameDone} onClick={finish}>เรียนเนื้อหาและผ่านเกมแล้ว →</button></div></section>; }
function InteractiveScenario({ lesson }: {
    lesson: Lesson;
}) {
    if (lesson.hour === 1)
        return <SequentialDiscoveryMission/>;
    const [answers, setAnswers] = useState<Record<number, number>>({}), [submitted, setSubmitted] = useState(false);
    const questions = [
        { q: "ปัญหาหรือความต้องการสำคัญของสถานการณ์นี้คืออะไร", choices: [`ต้องจำชื่อเรื่อง “${lesson.title}” ให้ได้`, `ต้องใช้ความรู้เพื่อทำภารกิจ “${lesson.task}” อย่างมีเหตุผล`, `ต้องเลือกคำตอบที่เพื่อนส่วนใหญ่เลือก`, `ต้องทำงานให้เสร็จเร็วที่สุดโดยไม่ตรวจสอบ`], answer: 1, explain: "ควรเริ่มจากทำความเข้าใจภารกิจและใช้เหตุผล ไม่ใช่เน้นความเร็วหรือทำตามผู้อื่น" },
        { q: "ความรู้จากบทเรียนข้อใดเหมาะกับการนำมาใช้มากที่สุด", choices: [lesson.objective, "การคัดลอกคำตอบโดยไม่วิเคราะห์", "การตัดสินใจจากความชอบเพียงอย่างเดียว", "การหลีกเลี่ยงข้อมูลที่แตกต่าง"], answer: 0, explain: `เป้าหมายของบทเรียนคือ “${lesson.objective}” จึงเป็นความรู้ที่ตรงกับภารกิจมากที่สุด` },
        { q: "วิธีใดเหมาะสมที่สุดสำหรับตรวจสอบแนวทางที่เลือก", choices: ["ดูว่าสวยงามเพียงอย่างเดียว", "ถามเพื่อนเพียงคนเดียวแล้วสรุปทันที", "กำหนดเกณฑ์ ทดลองหรือสังเกตผล และตรวจความปลอดภัย", "เลือกวิธีเดิมโดยไม่พิจารณาผลกระทบ"], answer: 2, explain: "การตรวจสอบที่ดีต้องมีเกณฑ์และหลักฐาน รวมถึงพิจารณาความปลอดภัยกับผลกระทบ" }
    ];
    const complete = Object.keys(answers).length, score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
    const choose = (qi: number, ci: number) => { if (submitted)
        return; setAnswers(a => ({ ...a, [qi]: ci })); };
    return <section className="dt-interactive-scenario"><header><div><small>สถานการณ์ชวนคิด · เลือกคำตอบ</small><h3>นำความรู้ไปใช้จริง</h3></div><span>{submitted ? `${score}/3 คะแนน` : `${complete}/3 ข้อ`}</span></header><div className="dt-situation-box"><b>โจทย์สถานการณ์</b><p>โรงเรียนต้องการให้นักเรียนช่วยเสนอแนวทางในหัวข้อ “{lesson.task}” โดยเลือกใช้ข้อมูลและความรู้จากบทเรียนอย่างเหมาะสม พร้อมคำนึงถึงความปลอดภัยและผลกระทบ</p></div><div className="dt-scenario-questions">{questions.map((q, qi) => <fieldset key={q.q}><legend><i>{qi + 1}</i><span>{q.q}</span></legend><div>{q.choices.map((choice, ci) => { const picked = answers[qi] === ci, correct = ci === q.answer; return <button type="button" disabled={submitted} className={submitted && picked ? (correct ? "correct" : "wrong") : submitted && correct ? "correct-answer" : picked ? "selected" : ""} onClick={() => choose(qi, ci)} key={choice}><b>{String.fromCharCode(65 + ci)}</b><span>{choice}</span>{submitted && correct && <em>ถูกต้อง</em>}{submitted && picked && !correct && <em>คำตอบที่เลือก</em>}</button>; })}</div>{submitted && <p className={answers[qi] === q.answer ? "explain correct" : "explain"}>{answers[qi] === q.answer ? "✓" : "✕"} {q.explain}</p>}</fieldset>)}</div>{!submitted ? <div className="dt-scenario-submit"><span>เลือกคำตอบให้ครบทั้ง 3 ข้อ</span><button disabled={complete < 3} onClick={() => setSubmitted(true)}>ส่งคำตอบและดูคะแนน</button></div> : <div className={`dt-scenario-score ${score === 3 ? "perfect" : score >= 2 ? "good" : "review"}`}><div><small>คะแนนกิจกรรม</small><b>{score}<i>/3</i></b></div><div><h4>{score === 3 ? "ยอดเยี่ยม! ตอบถูกทุกข้อ" : score >= 2 ? "ทำได้ดี ลองทบทวนอีกเล็กน้อย" : "ควรย้อนกลับไปทบทวนบทเรียน"}</h4><p>ตอบถูก {score} ข้อ จากทั้งหมด 3 ข้อ</p><button onClick={() => { setAnswers({}); setSubmitted(false); }}>ทำกิจกรรมอีกครั้ง</button></div></div>}</section>;
}
function SlideReviewActivity() {
    const [opened, setOpened] = useState<number[]>([]), [sorted, setSorted] = useState<Record<string, string>>({}), [pairs, setPairs] = useState<Record<string, string>>({}), [principles, setPrinciples] = useState<string[]>([]);
    const concepts = ["มนุษย์สร้างขึ้น", "ช่วยแก้ปัญหา", "ตอบสนองความต้องการ", "อำนวยความสะดวก"], sortItems = [{ id: "phone", name: "โทรศัพท์", group: "product" }, { id: "bike", name: "จักรยาน", group: "product" }, { id: "filter", name: "การกรองน้ำ", group: "method" }, { id: "preserve", name: "การถนอมอาหาร", group: "method" }], goodPrinciples = ["เกิดประโยชน์", "ปลอดภัย", "พอดี", "รับผิดชอบ", "คำนึงถึงผู้อื่น", "คำนึงถึงสิ่งแวดล้อม"];
    const complete = opened.length === 4 && sortItems.every(x => sorted[x.id] === x.group) && pairs.sun === "solar" && pairs.wind === "turbine" && pairs.water === "filter" && principles.length === goodPrinciples.length;
    return <section className="dt-discovery"><header><small>ชวนคิดหลังดูสไลด์</small><h3>ลองเล่นกับแนวคิดเทคโนโลยี</h3><p>แตะ เปิด จัดกลุ่ม และเชื่อมโยง โดยไม่ต้องทำข้อสอบหรือเขียนคำตอบ</p></header><div className="dt-discovery-grid"><article><span>สไลด์ 1</span><h4>เปิดภาพความหมาย</h4><p>แตะการ์ดทีละใบ เพื่อประกอบความหมายของเทคโนโลยี</p><div className="dt-concept-tiles">{concepts.map((x, i) => <button className={opened.includes(i) ? "open" : ""} onClick={() => setOpened(s => s.includes(i) ? s : [...s, i])} key={x}>{opened.includes(i) ? x : "แตะเพื่อเปิด"}</button>)}</div>{opened.length === 4 && <b className="dt-discovery-message">เทคโนโลยีคือสิ่งที่มนุษย์สร้าง เพื่อช่วยแก้ปัญหาและตอบสนองความต้องการ</b>}</article><article><span>สไลด์ 2</span><h4>วางของให้ถูกชั้น</h4><p>แตะป้าย “ชิ้นงาน” หรือ “วิธีการ” ให้แต่ละรายการ</p><div className="dt-shelf-items">{sortItems.map(x => <div key={x.id}><b>{x.name}</b><button className={sorted[x.id] === "product" ? "active" : ""} onClick={() => setSorted(s => ({ ...s, [x.id]: "product" }))}>ชิ้นงาน</button><button className={sorted[x.id] === "method" ? "active" : ""} onClick={() => setSorted(s => ({ ...s, [x.id]: "method" }))}>วิธีการ</button>{sorted[x.id] && sorted[x.id] !== x.group && <small>ลองสลับชั้นดูอีกครั้ง</small>}</div>)}</div></article><article><span>สไลด์ 3</span><h4>เชื่อมพลังจากธรรมชาติ</h4><p>เลือกเทคโนโลยีที่พัฒนาจากทรัพยากรแต่ละชนิด</p><div className="dt-nature-links">{[["sun", "แสงอาทิตย์"], ["wind", "ลม"], ["water", "น้ำ"]].map(([id, name]) => <label key={id}><b>{name}</b><i>→</i><select value={pairs[id] ?? ""} onChange={e => setPairs(s => ({ ...s, [id]: e.target.value }))}><option value="">เชื่อมไปยัง...</option><option value="solar">โซลาร์เซลล์</option><option value="turbine">กังหันลมผลิตไฟฟ้า</option><option value="filter">เครื่องกรองน้ำ</option></select></label>)}</div>{pairs.sun === "solar" && pairs.wind === "turbine" && pairs.water === "filter" && <b className="dt-discovery-message">ธรรมชาติไม่ใช่เทคโนโลยี แต่เป็นทรัพยากรในการพัฒนาเทคโนโลยีได้</b>}</article><article><span>สไลด์ 4</span><h4>จัดกระเป๋าหลักการใช้</h4><p>แตะเก็บหลักการสำคัญที่ควรนึกถึงเมื่อใช้เทคโนโลยี</p><div className="dt-principle-bag">{goodPrinciples.map(x => <button className={principles.includes(x) ? "packed" : ""} onClick={() => setPrinciples(s => s.includes(x) ? s.filter(v => v !== x) : [...s, x])} key={x}>{principles.includes(x) ? "✓ " : "+ "}{x}</button>)}</div></article></div>{complete && <div className="dt-discovery-complete"><i>✓</i><div><b>สำรวจครบทั้ง 4 มุมแล้ว</b><p>นักเรียนเชื่อมโยงความรู้จากสไลด์ได้ครบ โดยไม่ต้องทำแบบทดสอบ</p></div></div>}</section>;
}
type SortGroup = "nature" | "made";
const missionItems = [
    { id: "sun", label: "แสงอาทิตย์", group: "nature" as SortGroup, icon: "☀️" }, { id: "wind", label: "ลม", group: "nature" as SortGroup, icon: "〰️" }, { id: "water", label: "น้ำ", group: "nature" as SortGroup, icon: "💧" }, { id: "soil", label: "ดิน", group: "nature" as SortGroup, icon: "🟤" }, { id: "tree", label: "ต้นไม้", group: "nature" as SortGroup, icon: "🌳" },
    { id: "phone", label: "โทรศัพท์", group: "made" as SortGroup, icon: "📱" }, { id: "bike", label: "จักรยาน", group: "made" as SortGroup, icon: "🚲" }, { id: "filter", label: "เครื่องกรองน้ำ", group: "made" as SortGroup, icon: "▤" }, { id: "fan", label: "พัดลม", group: "made" as SortGroup, icon: "✥" }, { id: "book", label: "หนังสือ", group: "made" as SortGroup, icon: "📘" }
];
function FirstSortingMission() {
    const [sorted, setSorted] = useState<Record<string, SortGroup>>({}), [selected, setSelected] = useState<string | null>(null), [message, setMessage] = useState("");
    const place = (group: SortGroup) => {
        if (!selected)
            return;
        const item = missionItems.find(x => x.id === selected);
        if (!item)
            return;
        if (item.group === group) {
            setSorted(s => ({ ...s, [item.id]: group }));
            setMessage(`วาง ${item.label} ถูกกลุ่มแล้ว`);
        }
        else
            setMessage(`ลองคิดอีกครั้งว่า ${item.label} เกิดขึ้นเองหรือมนุษย์สร้าง`);
        setSelected(null);
    };
    const done = Object.keys(sorted).length === missionItems.length;
    return <section className="dt-first-mission"><header><span>กิจกรรม 1 · จากสไลด์ 1 และ 3</span><h3>ธรรมชาติ หรือมนุษย์สร้าง?</h3><p>แตะการ์ดหนึ่งใบ แล้วแตะกลุ่มปลายทาง ไม่ต้องเขียนหรือทำข้อสอบ</p></header><div className="dt-first-items">{missionItems.filter(x => !sorted[x.id]).map(x => <button className={selected === x.id ? "selected" : ""} onClick={() => setSelected(x.id)} key={x.id}><i>{x.icon}</i>{x.label}</button>)}</div><div className="dt-first-zones"><button onClick={() => place("nature")}><b>เกิดเองตามธรรมชาติ</b><span>{missionItems.filter(x => sorted[x.id] === "nature").map(x => <em key={x.id}>{x.label}</em>)}</span></button><button onClick={() => place("made")}><b>มนุษย์สร้างขึ้น</b><span>{missionItems.filter(x => sorted[x.id] === "made").map(x => <em key={x.id}>{x.label}</em>)}</span></button></div>{message && <p className="dt-first-feedback" role="status">{message}</p>}{done && <strong className="dt-first-done">✓ จัดกลุ่มครบแล้ว ไปสำรวจอีก 4 กิจกรรมต่อได้เลย</strong>}</section>;
}
function SequentialDiscoveryMission() {
    const [stage, setStage] = useState(1), [sorted, setSorted] = useState<Record<string, SortGroup>>({}), [selected, setSelected] = useState<string | null>(null), [opened, setOpened] = useState<number[]>([]), [types, setTypes] = useState<Record<string, string>>({}), [pairs, setPairs] = useState<Record<string, string>>({}), [principles, setPrinciples] = useState<string[]>([]), [flow, setFlow] = useState<string[]>([]), [finished, setFinished] = useState(false), [message, setMessage] = useState("");
    const concepts = ["ช่วยแก้ปัญหาและตอบสนองความต้องการ", "มนุษย์สร้างหรือพัฒนาขึ้น", "เกิดขึ้นเองตามธรรมชาติทุกชนิด", "ต้องเป็นเครื่องใช้ไฟฟ้าเท่านั้น"], correctConcepts = [0, 1], typeItems = [{ id: "phone", name: "โทรศัพท์", answer: "product" }, { id: "bike", name: "จักรยาน", answer: "product" }, { id: "filtering", name: "การกรองน้ำ", answer: "method" }, { id: "preserve", name: "การถนอมอาหาร", answer: "method" }], principleCards = [{ text: "ช่วยประหยัดเวลาและลดแรงงาน", correct: true }, { text: "ช่วยเพิ่มความปลอดภัย", correct: true }, { text: "ช่วยยกระดับคุณภาพชีวิต", correct: true }, { text: "ใช้เทคโนโลยีอย่างเหมาะสมและรับผิดชอบ", correct: true }, { text: "ทำให้เสียเวลาและเพิ่มแรงงานเสมอ", correct: false }, { text: "ใช้งานโดยไม่ต้องคำนึงถึงความปลอดภัย", correct: false }, { text: "เทคโนโลยีไม่เกี่ยวข้องกับคุณภาพชีวิต", correct: false }, { text: "ใช้เทคโนโลยีอย่างไรก็ได้โดยไม่ต้องรับผิดชอบ", correct: false }], flowCards = [{ id: "nature", text: "แสงอาทิตย์", sub: "ทรัพยากรธรรมชาติ" }, { id: "idea", text: "มนุษย์ใช้ความรู้และออกแบบ", sub: "ความคิดสร้างสรรค์" }, { id: "technology", text: "โซลาร์เซลล์ผลิตไฟฟ้า", sub: "เทคโนโลยี" }];
    const goodPrinciples = principleCards.map(card => card.text);
    const stageDone = [Object.keys(sorted).length === missionItems.length, opened.length === 2 && opened.every(i => correctConcepts.includes(i)), typeItems.every(x => types[x.id] === x.answer), pairs.sun === "solar" && pairs.wind === "turbine" && pairs.water === "filter", principles.length === 4 && principles.every(x => principleCards.find(card => card.text === x)?.correct), flow.join(",") === "nature,idea,technology"];
    const place = (group: SortGroup) => { if (!selected)
        return; const item = missionItems.find(x => x.id === selected); if (!item)
        return; if (item.group === group) {
        setSorted(s => ({ ...s, [item.id]: group }));
        setMessage(`${item.label} อยู่ในกลุ่ม${group === "nature" ? "ธรรมชาติ" : "มนุษย์สร้าง"}`);
    }
    else
        setMessage(`ลองคิดอีกครั้งว่า ${item.label} เกิดขึ้นเองหรือมนุษย์สร้าง`); setSelected(null); };
    useEffect(() => {
        if (stage !== 1)
            return;
        const root = document.querySelector(".dt-seq-mission .dt-seq-stage");
        const cards = Array.from(root?.querySelectorAll<HTMLButtonElement>(".dt-first-items button") ?? []);
        [...cards].sort(() => Math.random() - .5).forEach((card, order) => card.style.order = String(order));
        const zones = Array.from(root?.querySelectorAll<HTMLButtonElement>(".dt-first-zones > button") ?? []);
        const instruction = root?.querySelector<HTMLParagraphElement>(":scope > p:first-child");
        if (instruction)
            instruction.textContent = "แตะค้างที่การ์ด แล้วลากไปวางในช่องที่มีลักษณะตรงกัน";
        const starts = cards.map(card => {
            card.draggable = true;
            const handler = (event: DragEvent) => {
                const label = card.textContent?.trim() ?? "";
                const item = missionItems.filter(x => label.includes(x.label)).sort((a, b) => b.label.length - a.label.length)[0];
                if (item && event.dataTransfer) {
                    event.dataTransfer.setData("text/plain", item.id);
                    event.dataTransfer.effectAllowed = "move";
                    card.classList.add("dragging");
                }
            };
            const end = () => card.classList.remove("dragging");
            let ghost: HTMLElement | null = null, draggedItemId = "";
            const pointerDown = (event: PointerEvent) => {
                if (event.pointerType === "mouse")
                    return;
                event.preventDefault();
                const label = card.textContent?.trim() ?? "", item = missionItems.filter(x => label.includes(x.label)).sort((a, b) => b.label.length - a.label.length)[0];
                if (!item)
                    return;
                draggedItemId = item.id;
                card.setPointerCapture(event.pointerId);
                ghost = card.cloneNode(true) as HTMLElement;
                ghost.className = "dt-touch-drag-ghost";
                document.body.appendChild(ghost);
                ghost.style.left = `${event.clientX}px`;
                ghost.style.top = `${event.clientY}px`;
                card.classList.add("dragging");
            };
            const pointerMove = (event: PointerEvent) => {
                if (!ghost)
                    return;
                event.preventDefault();
                ghost.style.left = `${event.clientX}px`;
                ghost.style.top = `${event.clientY}px`;
                zones.forEach(zone => { const box = zone.getBoundingClientRect(); zone.classList.toggle("drag-over", event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom); });
            };
            const pointerUp = (event: PointerEvent) => {
                if (!ghost)
                    return;
                event.preventDefault();
                const zoneIndex = zones.findIndex(zone => { const box = zone.getBoundingClientRect(); return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom; }), item = missionItems.find(x => x.id === draggedItemId);
                if (zoneIndex >= 0 && item) {
                    const group: SortGroup = zoneIndex === 0 ? "nature" : "made";
                    if (item.group === group) {
                        setSorted(s => ({ ...s, [item.id]: group }));
                        setMessage(`${item.label} อยู่ในกลุ่ม${group === "nature" ? "ธรรมชาติ" : "มนุษย์สร้าง"}`);
                    }
                    else
                        setMessage(`ลองคิดอีกครั้งว่า ${item.label} เกิดขึ้นเองหรือมนุษย์สร้าง`);
                }
                zones.forEach(zone => zone.classList.remove("drag-over"));
                ghost.remove();
                ghost = null;
                draggedItemId = "";
                card.classList.remove("dragging");
            };
            card.addEventListener("dragstart", handler);
            card.addEventListener("dragend", end);
            card.addEventListener("pointerdown", pointerDown);
            card.addEventListener("pointermove", pointerMove);
            card.addEventListener("pointerup", pointerUp);
            card.addEventListener("pointercancel", pointerUp);
            return { card, handler, end, pointerDown, pointerMove, pointerUp };
        });
        const drops = zones.map((zone, index) => {
            const over = (event: DragEvent) => { event.preventDefault(); if (event.dataTransfer)
                event.dataTransfer.dropEffect = "move"; zone.classList.add("drag-over"); };
            const leave = () => zone.classList.remove("drag-over");
            const drop = (event: DragEvent) => {
                event.preventDefault();
                zone.classList.remove("drag-over");
                const id = event.dataTransfer?.getData("text/plain"), item = missionItems.find(x => x.id === id), group: SortGroup = index === 0 ? "nature" : "made";
                if (!item)
                    return;
                if (item.group === group) {
                    setSorted(s => ({ ...s, [item.id]: group }));
                    setMessage(`${item.label} อยู่ในกลุ่ม${group === "nature" ? "ธรรมชาติ" : "มนุษย์สร้าง"}`);
                }
                else
                    setMessage(`ลองคิดอีกครั้งว่า ${item.label} เกิดขึ้นเองหรือมนุษย์สร้าง`);
            };
            zone.addEventListener("dragover", over);
            zone.addEventListener("dragleave", leave);
            zone.addEventListener("drop", drop);
            return { zone, over, leave, drop };
        });
        return () => {
            starts.forEach(({ card, handler, end, pointerDown, pointerMove, pointerUp }) => { card.removeEventListener("dragstart", handler); card.removeEventListener("dragend", end); card.removeEventListener("pointerdown", pointerDown); card.removeEventListener("pointermove", pointerMove); card.removeEventListener("pointerup", pointerUp); card.removeEventListener("pointercancel", pointerUp); });
            drops.forEach(({ zone, over, leave, drop }) => { zone.removeEventListener("dragover", over); zone.removeEventListener("dragleave", leave); zone.removeEventListener("drop", drop); });
        };
    }, [stage, sorted]);
    useEffect(() => {
        if (stage !== 2)
            return;
        const root = document.querySelector(".dt-seq-mission .dt-seq-stage"), cards = Array.from(root?.querySelectorAll<HTMLButtonElement>(".dt-concept-tiles button") ?? []);
        const instruction = root?.querySelector<HTMLParagraphElement>(":scope > p:first-child");
        if (instruction)
            instruction.textContent = "เลือกข้อความที่อธิบายเทคโนโลยีได้ถูกต้อง 2 ใบ แตะใบเดิมอีกครั้งเพื่อยกเลิก";
        const listeners = cards.map((card, index) => {
            card.textContent = concepts[index];
            card.classList.toggle("open", opened.includes(index));
            card.classList.toggle("concept-wrong", opened.includes(index) && !correctConcepts.includes(index));
            const click = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                setOpened(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
            };
            card.addEventListener("click", click, true);
            return { card, click };
        });
        return () => listeners.forEach(({ card, click }) => card.removeEventListener("click", click, true));
    }, [stage, opened]);
    useEffect(() => {
        if (stage !== 5)
            return;
        const mission = document.querySelector(".dt-seq-mission"), title = mission?.querySelector<HTMLHeadingElement>("header h3"), instruction = mission?.querySelector<HTMLParagraphElement>(".dt-seq-stage > p:first-child");
        if (title)
            title.textContent = "หลักการใช้เทคโนโลยีอย่างเหมาะสม";
        if (instruction)
            instruction.textContent = "เลือกหลักการใช้เทคโนโลยีอย่างเหมาะสมให้ถูกต้องจำนวน 4 ข้อ จากการ์ดทั้งหมด 8 ใบ แตะการ์ดเดิมอีกครั้งเพื่อยกเลิก";
        const buttons = Array.from(mission?.querySelectorAll<HTMLButtonElement>(".dt-principle-bag button") ?? []);
        const listeners = buttons.map((button, index) => {
            const card = principleCards[index], picked = principles.includes(card.text);
            button.classList.toggle("principle-wrong", picked && !card.correct);
            const click = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                setPrinciples(current => current.includes(card.text) ? current.filter(value => value !== card.text) : current.length < 4 ? [...current, card.text] : current);
            };
            button.addEventListener("click", click, true);
            return { button, click };
        });
        return () => listeners.forEach(({ button, click }) => button.removeEventListener("click", click, true));
    }, [stage, principles]);
    const next = () => { if (!stageDone[stage - 1])
        return; if (stage < 6) {
        setStage(s => s + 1);
        setMessage("");
    }
    else
        setFinished(true); };
    const reset = () => { setStage(1); setSorted({}); setSelected(null); setOpened([]); setTypes({}); setPairs({}); setPrinciples([]); setFlow([]); setFinished(false); setMessage(""); };
    if (finished)
        return <section className="dt-seq-mission"><div className="dt-seq-finish"><i>✓</i><small>สำรวจครบ 6 ภารกิจ</small><h3>เชื่อมโยงความรู้จากสไลด์ได้สำเร็จ!</h3><p>นักเรียนรู้จักความหมาย ประเภท ที่มา และหลักการใช้เทคโนโลยีอย่างเหมาะสมแล้ว</p><button onClick={reset}>เล่นภารกิจอีกครั้ง</button></div></section>;
    return <section className="dt-seq-mission"><header><div><small>กิจกรรมหลังดูสไลด์ · เล่นทีละภารกิจ</small><h3>{["ธรรมชาติหรือมนุษย์สร้าง?", "เปิดภาพความหมาย", "ชิ้นงานหรือวิธีการ?", "เชื่อมพลังจากธรรมชาติ", "จัดกระเป๋าหลักการใช้", "ต่อเส้นทางกำเนิดเทคโนโลยี"][stage - 1]}</h3></div><b>{stage}/6</b></header><div className="dt-seq-progress"><i style={{ width: `${stage / 6 * 100}%` }}/></div><nav aria-label="ความคืบหน้าภารกิจ">{Array.from({ length: 6 }, (_, i) => <span className={i + 1 < stage ? "done" : i + 1 === stage ? "active" : ""} key={i}>{i + 1 < stage ? "✓" : i + 1}</span>)}</nav><div className="dt-seq-stage">{stage === 1 && <><p>แตะการ์ดหนึ่งใบ แล้วแตะกลุ่มปลายทาง</p><div className="dt-first-items">{missionItems.filter(x => !sorted[x.id]).map(x => <button className={selected === x.id ? "selected" : ""} onClick={() => setSelected(x.id)} key={x.id}><i>{x.icon}</i>{x.label}</button>)}</div><div className="dt-first-zones"><button onClick={() => place("nature")}><b>เกิดเองตามธรรมชาติ</b><span>{missionItems.filter(x => sorted[x.id] === "nature").map(x => <em key={x.id}>{x.label}</em>)}</span></button><button onClick={() => place("made")}><b>มนุษย์สร้างขึ้น</b><span>{missionItems.filter(x => sorted[x.id] === "made").map(x => <em key={x.id}>{x.label}</em>)}</span></button></div>{message && <p className="dt-first-feedback">{message}</p>}</>}{stage === 2 && <><p>แตะเปิดการ์ดทั้ง 4 ใบ เพื่อประกอบความหมายของเทคโนโลยี</p><div className="dt-concept-tiles">{concepts.map((x, i) => <button className={opened.includes(i) ? "open" : ""} onClick={() => setOpened(s => s.includes(i) ? s : [...s, i])} key={x}>{opened.includes(i) ? x : "แตะเพื่อเปิด"}</button>)}</div>{stageDone[1] && <b className="dt-discovery-message">เทคโนโลยีคือสิ่งที่มนุษย์สร้าง เพื่อช่วยแก้ปัญหาและตอบสนองความต้องการ</b>}</>}{stage === 3 && <><p>แตะประเภทให้แต่ละรายการ เพื่อจัดลงชั้นที่เหมาะสม</p><div className="dt-shelf-items">{typeItems.map(x => <div key={x.id}><b>{x.name}</b><button className={types[x.id] === "product" ? "active" : ""} onClick={() => setTypes(s => ({ ...s, [x.id]: "product" }))}>ชิ้นงาน</button><button className={types[x.id] === "method" ? "active" : ""} onClick={() => setTypes(s => ({ ...s, [x.id]: "method" }))}>วิธีการ</button>{types[x.id] && types[x.id] !== x.answer && <small>ลองสลับชั้นดูอีกครั้ง</small>}</div>)}</div></>}{stage === 4 && <><p>เชื่อมทรัพยากรธรรมชาติกับเทคโนโลยีที่มนุษย์พัฒนาขึ้น</p><div className="dt-nature-links">{[["sun", "แสงอาทิตย์"], ["wind", "ลม"], ["water", "น้ำ"]].map(([id, name]) => <label key={id}><b>{name}</b><i>→</i><select value={pairs[id] ?? ""} onChange={e => setPairs(s => ({ ...s, [id]: e.target.value }))}><option value="">เชื่อมไปยัง...</option><option value="solar">โซลาร์เซลล์</option><option value="turbine">กังหันลมผลิตไฟฟ้า</option><option value="filter">เครื่องกรองน้ำ</option></select></label>)}</div></>}{stage === 5 && <><p>แตะเก็บหลักการสำคัญลงกระเป๋าให้ครบ</p><div className="dt-principle-bag">{goodPrinciples.map(x => <button className={principles.includes(x) ? "packed" : ""} onClick={() => setPrinciples(s => s.includes(x) ? s.filter(v => v !== x) : [...s, x])} key={x}>{principles.includes(x) ? "✓ " : "+ "}{x}</button>)}</div></>}{stage === 6 && <><p>แตะการ์ดตามลำดับการเกิดเทคโนโลยี หากต้องการแก้ให้แตะการ์ดด้านบนเพื่อนำออก</p><div className="dt-flow-built">{flow.length ? flow.map(id => { const card = flowCards.find(x => x.id === id)!; return <button onClick={() => setFlow(s => s.filter(x => x !== id))} key={id}><small>{card.sub}</small><b>{card.text}</b></button>; }) : <span>เริ่มจากสิ่งใดก่อน?</span>}</div><div className="dt-flow-cards">{flowCards.map(card => <button disabled={flow.includes(card.id)} onClick={() => setFlow(s => [...s, card.id])} key={card.id}><small>{card.sub}</small><b>{card.text}</b></button>)}</div>{flow.length === 3 && !stageDone[5] && <p className="dt-first-feedback">ลองเรียงใหม่: ธรรมชาติ → ความคิดของมนุษย์ → เทคโนโลยี</p>}</>}</div><footer><button disabled={stage === 1} onClick={() => setStage(s => s - 1)}>← ภารกิจก่อนหน้า</button><span>{stageDone[stage - 1] ? "ผ่านแล้ว ไปต่อได้เลย" : "ทำกิจกรรมนี้ให้ครบเพื่อไปต่อ"}</span><button className="primary" disabled={!stageDone[stage - 1]} onClick={next}>{stage === 6 ? "จบภารกิจ" : "ภารกิจถัดไป →"}</button></footer></section>;
}
function TechnologyExplorerMission() {
    const [stage, setStage] = useState(1), [sorted, setSorted] = useState<Record<string, SortGroup>>({}), [selected, setSelected] = useState<string | null>(null), [dragged, setDragged] = useState<string | null>(null);
    const [decision, setDecision] = useState<number | null>(null), [knowledge, setKnowledge] = useState<number[]>([]), [reason, setReason] = useState<number | null>(null), [evidence, setEvidence] = useState<number[]>([]), [checks, setChecks] = useState<boolean[]>(Array(6).fill(false)), [sentence, setSentence] = useState<number[]>([]), [finished, setFinished] = useState(false), [hint, setHint] = useState(false), [feedback, setFeedback] = useState("");
    const stagePoints = [10, 10, 10, 10, 5, 5], stageXp = [20, 15, 15, 15, 15, 20];
    const passed = [Object.keys(sorted).length === missionItems.length, decision === 1, knowledge.length === 4 && reason === 1, evidence.join(",") === "1,0,1", checks.every(Boolean), sentence.length === 4];
    const cleared = passed.filter(Boolean).length, score = passed.reduce((n, v, i) => n + (v ? stagePoints[i] : 0), 0), xp = passed.reduce((n, v, i) => n + (v ? stageXp[i] : 0), 0);
    const place = (group: SortGroup, id = selected || dragged) => { if (!id)
        return; const item = missionItems.find(x => x.id === id); if (!item)
        return; if (item.group === group) {
        setSorted(s => ({ ...s, [id]: group }));
        setFeedback(`ถูกต้อง! ${item.label} อยู่ในกลุ่ม${group === "nature" ? "เกิดเองตามธรรมชาติ" : "มนุษย์สร้าง"}`);
    }
    else
        setFeedback(`ลองอีกครั้ง: ${item.label} เกิดขึ้นเองหรือมนุษย์เป็นผู้สร้าง?`); setSelected(null); setDragged(null); };
    const next = () => { if (!passed[stage - 1])
        return; if (stage < 6) {
        setStage(s => s + 1);
        setHint(false);
        setFeedback("");
    }
    else
        setFinished(true); };
    const reset = () => { setStage(1); setSorted({}); setSelected(null); setDecision(null); setKnowledge([]); setReason(null); setEvidence([]); setChecks(Array(6).fill(false)); setSentence([]); setFinished(false); setHint(false); setFeedback(""); };
    const titles = ["สไลด์ 1 และ 3 · จัดหมวดหมู่สิ่งรอบตัว", "สไลด์ 1 · ค้นหาความต้องการสำคัญ", "สไลด์ 1–4 · เลือกความรู้ที่ต้องใช้", "สไลด์ 3 · ตรวจสอบระบบด้วยหลักฐาน", "สไลด์ 4 · ประเมินการใช้อย่างเหมาะสม", "สรุปสไลด์ 1–4 · สร้างข้อเสนอ"];
    const knowledgeCards = ["สไลด์ 1: ความหมายและหลักการของเทคโนโลยี", "สไลด์ 3: สิ่งที่เกิดเองตามธรรมชาติ", "สไลด์ 2: ชิ้นงานและวิธีการที่มนุษย์สร้าง", "สไลด์ 4: ประโยชน์ ความปลอดภัย และผลกระทบ"];
    const sentenceParts = ["สำรวจสิ่งของรอบตัวตามโจทย์", "จำแนกธรรมชาติกับสิ่งที่มนุษย์สร้าง", "ตรวจสอบทรัพยากร กระบวนการ และผลลัพธ์", "ประเมินประโยชน์ ความปลอดภัย และผลกระทบ"];
    return <section className="dt-mission" aria-labelledby="mission-title"><header className="dt-mission-top"><div><small>สถานการณ์ชวนคิด · ภารกิจโต้ตอบ</small><h3 id="mission-title">นักสำรวจเทคโนโลยี</h3><p>ช่วยโรงเรียนสำรวจและจำแนกสิ่งรอบตัวด้วยข้อมูล เหตุผล และความรับผิดชอบ</p></div><div className="dt-mission-stats"><span><b>{stage}/6</b> ด่าน</span><span><b>{score}/50</b> คะแนน</span><span><b>{xp}/100</b> XP</span></div></header><div className="dt-mission-progress"><div style={{ width: `${finished ? 100 : ((stage - 1) / 6) * 100}%` }}/><ol>{titles.map((t, i) => <li key={t} className={i + 1 < stage || finished ? "done" : i + 1 === stage ? "active" : ""}><button disabled={i + 1 > stage} onClick={() => i + 1 <= stage && setStage(i + 1)} aria-label={`ด่าน ${i + 1} ${t}`}>{i + 1 < stage || finished ? "✓" : i + 1}</button><span>{t}</span></li>)}</ol></div>{finished ? <div className="dt-mission-finish"><div className="dt-confetti" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i}/>)}</div><div className="dt-mission-badge">★</div><small>MISSION COMPLETE</small><h4>เยี่ยมมาก นักสำรวจเทคโนโลยี!</h4><p>นักเรียนจำแนกสิ่งรอบตัว เลือกข้อมูล ตรวจสอบหลักฐาน และสร้างข้อเสนอที่มีเหตุผลได้สำเร็จ</p><div><b>+50 คะแนนเกม</b><b>+100 XP</b><b>ตรานักสำรวจเทคโนโลยี</b></div><button onClick={reset}>เล่นภารกิจอีกครั้ง</button></div> : <div className="dt-mission-panel"><div className="dt-mission-stage-head"><span>ด่านที่ {stage}</span><div><small>ภารกิจ</small><h4>{titles[stage - 1]}</h4></div><button onClick={() => setHint(v => !v)} aria-expanded={hint}>คำใบ้ ?</button></div>{hint && <p className="dt-mission-hint">{["ถามตัวเองว่า สิ่งนี้เกิดขึ้นได้เองโดยไม่มีมนุษย์สร้างหรือไม่", "มองหาสิ่งที่โรงเรียนต้องการให้นักเรียนช่วยทำ", "เลือกความรู้ที่ช่วยทั้งจำแนก อธิบาย และประเมินผล", "เรียงจากการรับทรัพยากร ผ่านกระบวนการ ไปสู่ผลลัพธ์", "แนวทางที่ดีต้องตรวจสอบได้ ปลอดภัย และคำนึงถึงผลกระทบ", "เรียงจากสิ่งที่จะทำ วิธีจำแนก วิธีตรวจสอบ และสิ่งที่ต้องคำนึงถึง"][stage - 1]}</p>}{stage === 1 && <div className="dt-sort-game"><p>ลากการ์ดลงกล่อง หรือแตะการ์ดแล้วแตะกล่องปลายทาง</p><div className="dt-sort-items">{missionItems.filter(x => !sorted[x.id]).map(x => <button draggable onDragStart={() => setDragged(x.id)} onClick={() => setSelected(x.id)} className={selected === x.id ? "selected" : ""} key={x.id}><i>{x.icon}</i><span>{x.label}</span></button>)}</div><div className="dt-drop-zones"><button onDragOver={e => e.preventDefault()} onDrop={() => place("nature")} onClick={() => place("nature")}><b>เกิดเองตามธรรมชาติ</b><span>{missionItems.filter(x => sorted[x.id] === "nature").map(x => <em key={x.id}>{x.label}</em>)}</span></button><button onDragOver={e => e.preventDefault()} onDrop={() => place("made")} onClick={() => place("made")}><b>มนุษย์สร้างขึ้น</b><span>{missionItems.filter(x => sorted[x.id] === "made").map(x => <em key={x.id}>{x.label}</em>)}</span></button></div>{feedback && <p className={feedback.startsWith("ถูก") ? "dt-feedback good" : "dt-feedback"} role="status">{feedback}</p>}</div>}{stage === 2 && <ChoiceCards question="ปัญหาหรือความต้องการสำคัญคืออะไร" choices={["หาสิ่งของที่มีราคาแพงที่สุด", "สำรวจสิ่งรอบตัวและจำแนกตามที่มาอย่างมีเหตุผล", "เลือกเฉพาะสิ่งที่นักเรียนชอบ", "จำชื่อสิ่งของให้ได้มากที่สุด"]} value={decision} setValue={setDecision} correct={1}/>} {stage === 3 && <div className="dt-knowledge"><p>เลือกความรู้ที่เกี่ยวข้องให้ครบ แล้วเลือกเหตุผลที่เหมาะสม</p><div>{knowledgeCards.map((x, i) => <button className={knowledge.includes(i) ? "selected" : ""} onClick={() => setKnowledge(s => s.includes(i) ? s.filter(n => n !== i) : [...s, i])} key={x}><i>{knowledge.includes(i) ? "✓" : "+"}</i>{x}</button>)}</div><ChoiceCards question="เหตุใดจึงต้องใช้ความรู้หลายด้านร่วมกัน" choices={["เพื่อให้คำตอบยาวขึ้น", "เพื่อจำแนกได้ถูกต้องและประเมินการใช้ได้รอบด้าน", "เพื่อไม่ต้องตรวจสอบข้อมูล"]} value={reason} setValue={setReason} correct={1}/></div>}{stage === 4 && <div className="dt-evidence"><div className="dt-solar-flow"><span>แสงอาทิตย์</span><i>→</i><span>แผงโซลาร์เซลล์</span><i>→</i><span>พลังงานไฟฟ้า</span></div>{[{ q: "สิ่งใดเป็นทรัพยากรที่เกิดเองตามธรรมชาติ", c: ["แผงโซลาร์เซลล์", "แสงอาทิตย์", "สายไฟ"], a: 1 }, { q: "สิ่งใดเป็นเทคโนโลยีที่มนุษย์สร้าง", c: ["แผงโซลาร์เซลล์", "แสงอาทิตย์", "ลม"], a: 0 }, { q: "หลักฐานใดแสดงว่าแนวทางนี้ทำงานได้", c: ["สีของแผงสวยงาม", "ระบบผลิตไฟฟ้าได้ตามค่าที่วัด", "เพื่อนบอกว่าดี"], a: 1 }].map((q, i) => <fieldset key={q.q} disabled={i > evidence.length}><legend>{i + 1}. {q.q}</legend>{q.c.map((c, ci) => <button className={evidence[i] === ci ? (ci === q.a ? "correct" : "wrong") : ""} onClick={() => { if (ci === q.a)
        setEvidence(s => [...s.slice(0, i), ci]);
    else
        setFeedback("ยังไม่ใช่หลักฐานที่เหมาะสม ลองพิจารณาข้อมูลที่ตรวจวัดได้"); }} key={c}>{c}</button>)}</fieldset>)}{feedback && <p className="dt-feedback" role="status">{feedback}</p>}</div>}{stage === 5 && <div className="dt-checklist"><div className="dt-meter"><span style={{ width: `${checks.filter(Boolean).length / 6 * 100}%` }}/><b>ความเหมาะสม {Math.round(checks.filter(Boolean).length / 6 * 100)}%</b></div>{["ตอบโจทย์การสำรวจของโรงเรียน", "ใช้เกณฑ์จำแนกที่ชัดเจน", "ข้อมูลตรวจสอบย้อนกลับได้", "ปลอดภัยต่อผู้ทำกิจกรรม", "คำนึงถึงผลกระทบต่อผู้อื่น", "คำนึงถึงสิ่งแวดล้อม"].map((x, i) => <label key={x}><input type="checkbox" checked={checks[i]} onChange={() => setChecks(s => s.map((v, n) => n === i ? !v : v))}/><span><i />{x}</span></label>)}</div>}{stage === 6 && <div className="dt-sentence-builder"><p>แตะส่วนข้อความตามลำดับเพื่อสร้างข้อเสนอ โดยไม่ต้องพิมพ์</p><div className="dt-built-sentence">{sentence.length ? sentence.map((n, i) => <button key={`${n}-${i}`} onClick={() => setSentence(s => s.filter((_, j) => j !== i))}>{sentenceParts[n]}</button>) : <span>ข้อเสนอของฉันจะแสดงที่นี่…</span>}</div><div className="dt-sentence-parts">{sentenceParts.map((x, i) => <button disabled={sentence.includes(i)} onClick={() => setSentence(s => [...s, i])} key={x}>{x}</button>)}</div>{sentence.length === 4 && <p className="dt-proposal-preview">“นักเรียนจะ{sentence.map(n => sentenceParts[n]).join(" แล้ว")}”</p>}</div>}<footer className="dt-mission-actions"><span>{passed[stage - 1] ? `ผ่านด่านแล้ว · +${stagePoints[stage - 1]} คะแนน +${stageXp[stage - 1]} XP` : "ทำภารกิจให้สำเร็จเพื่อปลดล็อกด่านถัดไป"}</span><button disabled={!passed[stage - 1]} onClick={next}>{stage === 6 ? "ส่งข้อเสนอและรับรางวัล" : "ผ่านด่าน ไปต่อ →"}</button></footer></div>}</section>;
}
function ChoiceCards({ question, choices, value, setValue, correct }: {
    question: string;
    choices: string[];
    value: number | null;
    setValue: (v: number) => void;
    correct: number;
}) { return <fieldset className="dt-choice-cards"><legend>{question}</legend>{choices.map((x, i) => <button type="button" className={value === i ? (i === correct ? "correct" : "wrong") : ""} onClick={() => setValue(i)} key={x}><i>{String.fromCharCode(65 + i)}</i><span>{x}</span>{value === i && <em>{i === correct ? "เหมาะสม" : "ลองพิจารณาใหม่"}</em>}</button>)}</fieldset>; }
function LessonConcepts({ lesson }: {
    lesson: Lesson;
}) {
    const [index, setIndex] = useState(0), [full, setFull] = useState(false), [touchStart, setTouchStart] = useState<number | null>(null);
    const slides = lesson.hour === 1 ? Array.from({ length: 14 }, (_, i) => `/lesson-1-slide-${i + 1}.png`) : [];
    const move = (delta: number) => setIndex(i => (i + delta + slides.length) % slides.length);
    const openFullscreen = async () => { setFull(true); try {
        const root = document.documentElement as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void> | void;
        };
        const request = root.requestFullscreen?.bind(root) || root.webkitRequestFullscreen?.bind(root);
        if (request)
            await request();
        const orientation = screen.orientation as ScreenOrientation & {
            lock?: (value: string) => Promise<void>;
        };
        await orientation.lock?.("landscape");
    }
    catch { /* เบราว์เซอร์มือถือบางรุ่นจะใช้ overlay ขนาด 100dvh แทน */ } };
    const closeFullscreen = async () => { setFull(false); try {
        const doc = document as Document & {
            webkitExitFullscreen?: () => Promise<void> | void;
        };
        const exit = doc.exitFullscreen?.bind(doc) || doc.webkitExitFullscreen?.bind(doc);
        if (exit)
            await exit();
        screen.orientation.unlock?.();
    }
    catch { /* ปิด overlay ต่อได้แม้ browser ปฏิเสธ */ } };
    useEffect(() => { const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
    }; const sync = () => { if (!document.fullscreenElement && !doc.webkitFullscreenElement)
        setFull(false); }; document.addEventListener("fullscreenchange", sync); document.addEventListener("webkitfullscreenchange", sync as EventListener); return () => { document.removeEventListener("fullscreenchange", sync); document.removeEventListener("webkitfullscreenchange", sync as EventListener); }; }, []);
    useEffect(() => { if (!full)
        return; const key = (e: KeyboardEvent) => { if (e.key === "ArrowRight")
        move(1); if (e.key === "ArrowLeft")
        move(-1); if (e.key === "Escape")
        void closeFullscreen(); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [full, slides.length]);
    if (!slides.length)
        return <section className="dt-content"><div className="dt-content-heading"><small>สาระการเรียนรู้</small><h3>เรียนรู้ทีละประเด็น</h3><p>อ่านคำอธิบายแต่ละส่วน แล้วลองเชื่อมโยงกับสิ่งของหรือเหตุการณ์ที่พบในชีวิตประจำวัน</p></div>{lesson.content.map((c, i) => <div className="dt-concept-card" key={c}><b>{String(i + 1).padStart(2, "0")}</b><div><h4>{["ความหมายและหลักการ", "องค์ประกอบสำคัญ", "ตัวอย่างและการทำงาน", "การนำไปใช้อย่างเหมาะสม"][i] || `ประเด็นที่ ${i + 1}`}</h4><p>{c}</p><span>ลองคิด: นักเรียนพบตัวอย่างของแนวคิดนี้ที่บ้านหรือโรงเรียนอย่างไร</span></div></div>)}</section>;
    const viewer = <div className="dt-slide-viewer" onTouchStart={e => setTouchStart(e.touches[0].clientX)} onTouchEnd={e => { if (touchStart === null)
        return; const d = e.changedTouches[0].clientX - touchStart; if (Math.abs(d) > 45)
        move(d < 0 ? 1 : -1); setTouchStart(null); }}><img src={slides[index]} alt={`สไลด์บทเรียนรู้จักเทคโนโลยี หน้า ${index + 1} จาก ${slides.length}`}/><button className="dt-slide-prev" onClick={() => move(-1)} aria-label="สไลด์ก่อนหน้า">‹</button><button className="dt-slide-next" onClick={() => move(1)} aria-label="สไลด์ถัดไป">›</button><div className="dt-slide-count">{index + 1} / {slides.length}</div></div>;
    return <section className="dt-slide-section"><header><div><small>สาระการเรียนรู้</small><h3>เรียนรู้ทีละประเด็น</h3><p>เลื่อนดูสไลด์ หรือเปิดเต็มจอจริงเพื่อซ่อนแถบเบราว์เซอร์และใช้พื้นที่หน้าจอทั้งหมด</p></div><button onClick={() => void openFullscreen()} aria-label="เปิดสไลด์เต็มหน้าจอจริง">เปิดเต็มหน้าจอ ⛶</button></header>{viewer}<div className="dt-slide-dots" role="tablist" aria-label="เลือกหน้าสไลด์">{slides.map((_, i) => <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`ไปสไลด์ที่ ${i + 1}`}/>)}</div>{full && <div className="dt-slide-fullscreen" role="dialog" aria-modal="true" aria-label="สไลด์บทเรียนแบบเต็มหน้าจอ"><button className="dt-slide-close" onClick={() => void closeFullscreen()} aria-label="ออกจากโหมดเต็มหน้าจอ">×</button>{viewer}<div className="dt-slide-full-dots">{slides.map((_, i) => <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)}>{i + 1}</button>)}</div></div>}</section>;
}
function GameChallenge({ lesson, done, setDone }: {
    lesson: Lesson;
    done: boolean;
    setDone: (v: boolean) => void;
}) {
    const [selected, setSelected] = useState<Record<number, number>>({});
    const questions = lesson.post.slice(0, 3);
    const score = questions.reduce((n, q, i) => n + (selected[i] === q.answer ? 1 : 0), 0);
    useEffect(() => { if (score === 3 && !done)
        setDone(true); }, [score, done, setDone]);
    return <section className="dt-game-challenge"><header><div><small>MINI GAME · 2 คะแนน</small><h3>{lesson.game}</h3><p>ตอบให้ถูกทั้ง 3 ด่านเพื่อผ่านเกมและปลดล็อกใบงาน</p></div><b>{done ? "ผ่านแล้ว ✓" : `${score}/3`}</b></header><div className="dt-game-levels">{questions.map((q, qi) => <fieldset key={q.q}><legend><i>{qi + 1}</i><span>ด่านที่ {qi + 1}<b>{q.q}</b></span></legend>{q.choices.map((choice, ci) => { const picked = selected[qi] === ci, correct = ci === q.answer; return <button type="button" className={picked ? (correct ? "correct" : "wrong") : ""} onClick={() => setSelected(s => ({ ...s, [qi]: ci }))} key={choice}>{choice}{picked && <em>{correct ? " +1" : " ลองใหม่"}</em>}</button>; })}</fieldset>)}</div>{done && <p className="dt-game-success">เยี่ยมมาก! นักเรียนใช้ความรู้จากบทเรียนผ่านครบทุกด่านแล้ว</p>}</section>;
}
function TaskPage({ lesson, done, finish, back }: {
    lesson: Lesson;
    done: boolean;
    finish: () => void;
    back: () => void;
}) {
    if (lesson.hour === 1)
        return <TechnologyWorksheetMission lesson={lesson} done={done} finish={finish} back={back}/>;
    const submitTask = () => { if (!done)
        void saveLearningResult({ kind: "task", unit: lesson.unit, hour: lesson.hour, score: 2, maxScore: 2 }); finish(); };
    return <section className="dt-page"><PageHeader lesson={lesson} label="ใบงานออนไลน์" back={back}/><section className="dt-worksheet"><div className="dt-section-title"><div><small>ภาระงาน · 2 คะแนน</small><h3>{lesson.task}</h3></div></div><p>ทำกิจกรรมโต้ตอบ อ่าน–เลือก–จัดกลุ่ม–อธิบาย และส่งหลักฐานผลงาน คะแนนภาระงานจะนำไปรวมเป็นคะแนนเก็บของหน่วยนี้</p><ol>{lesson.worksheet.map(x => <li key={x}>{x}</li>)}</ol><label className="dt-check"><input type="checkbox" checked={done} readOnly/><span><b>สถานะภาระงาน</b><small>{done ? "ส่งงานและบันทึกคะแนนเรียบร้อยแล้ว" : "ตรวจทานคำตอบและหลักฐานก่อนส่ง"}</small></span></label></section><div className="dt-page-actions"><button onClick={back}>กลับ</button><button className="primary" onClick={submitTask}>{done ? "กลับสู่เส้นทาง" : "ส่งใบงานและบันทึกคะแนน"} →</button></div></section>;
}
const exploreObjects = [{ id: "tree", name: "ต้นไม้", kind: "nature" }, { id: "sun", name: "แสงแดด", kind: "nature" }, { id: "water", name: "น้ำ", kind: "nature" }, { id: "rock", name: "ก้อนหิน", kind: "nature" }, { id: "desk", name: "โต๊ะ", kind: "made" }, { id: "fan", name: "พัดลม", kind: "made" }, { id: "phone", name: "โทรศัพท์", kind: "made" }, { id: "bike", name: "จักรยาน", kind: "made" }, { id: "filter", name: "เครื่องกรองน้ำ", kind: "made" }, { id: "projector", name: "โปรเจกเตอร์", kind: "made" }, { id: "computer", name: "คอมพิวเตอร์", kind: "made" }, { id: "bin", name: "ถังขยะ", kind: "made" }] as const;
function TechnologyWorksheetMission({ lesson, done, finish, back }: {
    lesson: Lesson;
    done: boolean;
    finish: () => void;
    back: () => void;
}) {
    const [stage, setStage] = useState(1), [quick, setQuick] = useState<Record<string, string>>({}), [bag, setBag] = useState<string[]>([]), [groups, setGroups] = useState<Record<string, string>>({}), [reasons, setReasons] = useState(["", ""]), [matches, setMatches] = useState<Record<string, string>>({}), [evidence, setEvidence] = useState<File | null>(null), [preview, setPreview] = useState(""), [tag, setTag] = useState(""), [foundName, setFoundName] = useState(""), [reflection, setReflection] = useState(""), [starter, setStarter] = useState("วันนี้ฉันได้เรียนรู้ว่า... "), [hint, setHint] = useState(false), [confirming, setConfirming] = useState(false), [submitted, setSubmitted] = useState(done);
    const quickItems = [{ name: "ต้นไม้", answer: "nature" }, { name: "โทรศัพท์", answer: "product" }, { name: "การกรองน้ำ", answer: "process" }, { name: "แสงแดด", answer: "nature" }, { name: "จักรยาน", answer: "product" }], quickPassed = quickItems.every(x => quick[x.name] === x.answer), sortedPassed = bag.length >= 8 && bag.every(id => groups[id] === exploreObjects.find(x => x.id === id)?.kind), reasonPassed = reasons.every(x => x.trim().length >= 12), matchPassed = matches.sun === "solar" && matches.water === "filter" && matches.wind === "turbine", evidencePassed = !!evidence && !!tag && foundName.trim().length > 1 && reflection.trim().length >= 15;
    const passed = [quickPassed, bag.length >= 8, sortedPassed, reasonPassed, matchPassed, evidencePassed], percent = Math.round((stage - 1) / 6 * 100), canSubmit = sortedPassed && reasonPassed && evidencePassed;
    const goNext = () => { if (passed[stage - 1]) {
        setStage(Math.min(6, stage + 1));
        setHint(false);
    } };
    const submitMission = () => { setConfirming(false); setSubmitted(true); void saveLearningResult({ kind: "task", unit: lesson.unit, hour: lesson.hour, score: 2, maxScore: 2 }); };
    if (submitted)
        return <section className="dt-task-mission dt-task-success"><PageHeader lesson={lesson} label="ใบงานออนไลน์" back={back}/><div className="dt-task-celebrate"><i>★</i><small>MISSION COMPLETE</small><h3>ภารกิจสำเร็จ!</h3><p>เยี่ยมมาก คุณสามารถแยกสิ่งที่เกิดตามธรรมชาติและสิ่งที่มนุษย์สร้างได้แล้ว</p><b>ตรานักสำรวจเทคโนโลยี</b><h4>คะแนนภาระงาน 2 คะแนน</h4></div><section className="dt-task-answer"><h4>เฉลยและสรุปหลังส่งงาน</h4><div><b>เกิดเองตามธรรมชาติ</b><p>ต้นไม้ · แสงแดด · น้ำ · ก้อนหิน</p></div><div><b>มนุษย์สร้างขึ้น</b><p>โต๊ะ · พัดลม · โทรศัพท์ · จักรยาน · เครื่องกรองน้ำ · โปรเจกเตอร์ · คอมพิวเตอร์ · ถังขยะ</p></div><div><b>ธรรมชาติพัฒนาเป็นเทคโนโลยี</b><p>แสงแดด → โซลาร์เซลล์ · น้ำ → เครื่องกรองน้ำ · ลม → กังหันลมผลิตไฟฟ้า</p></div></section><button className="dt-task-finish" onClick={finish}>บันทึกแล้ว กลับสู่เส้นทาง →</button></section>;
    return <section className="dt-page dt-task-mission"><PageHeader lesson={lesson} label="ใบงานออนไลน์" back={back}/><header className="dt-task-head"><div><small>ภาระงาน · 2 คะแนน</small><h3>ภารกิจนักสำรวจเทคโนโลยี</h3><p>“ธรรมชาติ หรือ มนุษย์สร้าง?”</p></div><div><b>ด่าน {stage}/6</b><span>กำลังทำภารกิจ</span></div></header><div className="dt-task-progress"><i style={{ width: `${percent}%` }}/><span>{percent}%</span></div><div className="dt-task-tools"><button disabled={stage === 1} onClick={() => setStage(s => Math.max(1, s - 1))}>← ก่อนหน้า</button><button onClick={() => setHint(v => !v)}>คำใบ้ ?</button></div>{hint && <p className="dt-task-hint">{["พิจารณาว่าสิ่งนั้นเกิดขึ้นเอง เป็นชิ้นงาน หรือเป็นวิธีการ", "แตะเก็บวัตถุเข้ากระเป๋าสำรวจอย่างน้อย 8 ชิ้น", "ถามว่า มนุษย์ต้องออกแบบหรือสร้างสิ่งนี้ขึ้นหรือไม่", "ใช้คำว่า เกิดขึ้นเอง มนุษย์สร้าง ออกแบบ หรือแก้ปัญหา", "จับคู่ทรัพยากรธรรมชาติกับเทคโนโลยีที่มนุษย์พัฒนาขึ้น", "หลักฐานต้องมีภาพ ชื่อ ประเภท และ Reflection"][stage - 1]}</p>}<section className="dt-task-stage">{stage === 1 && <><h4>จำได้ไหม?</h4><p>เลือกประเภทให้ถูกต้อง ด่านทบทวนนี้ไม่หักคะแนน</p><div className="dt-quick-grid">{quickItems.map(item => <article key={item.name}><b>{item.name}</b><div>{[["nature", "ธรรมชาติ"], ["product", "ชิ้นงาน"], ["process", "วิธีการ"]].map(([value, label]) => <button className={quick[item.name] === value ? (value === item.answer ? "correct" : "wrong") : ""} onClick={() => setQuick(s => ({ ...s, [item.name]: value }))} key={value}>{label}</button>)}</div>{quick[item.name] && <small>{quick[item.name] === item.answer ? "ถูกต้อง!" : "ลองคิดอีกครั้งว่าสิ่งนี้เกิดเองหรือมนุษย์สร้าง"}</small>}</article>)}</div></>}{stage === 2 && <><h4>สำรวจห้องเรียนและโรงเรียน</h4><p>แตะวัตถุแล้วเก็บเข้ากระเป๋าสำรวจอย่างน้อย 8 ชิ้น</p><div className="dt-explore-scene">{exploreObjects.map((x, i) => <button disabled={bag.includes(x.id)} onClick={() => setBag(s => [...s, x.id])} style={{ "--spot": i } as React.CSSProperties} key={x.id}><b>{x.name}</b><span>{bag.includes(x.id) ? "เก็บแล้ว ✓" : "เก็บเข้ากระเป๋า"}</span></button>)}</div><strong className="dt-bag">กระเป๋าสำรวจ {bag.length}/8 ชิ้น</strong></>}{stage === 3 && <><h4>ธรรมชาติ หรือ มนุษย์สร้าง?</h4><p>แตะเลือกประเภทของสิ่งที่เก็บมา คำตอบผิดจะยังไม่เฉลย</p><div className="dt-group-cards">{bag.map(id => { const x = exploreObjects.find(o => o.id === id)!; return <article key={id}><b>{x.name}</b><button className={groups[id] === "nature" ? "selected" : ""} onClick={() => setGroups(s => ({ ...s, [id]: "nature" }))}>ธรรมชาติ</button><button className={groups[id] === "made" ? "selected" : ""} onClick={() => setGroups(s => ({ ...s, [id]: "made" }))}>มนุษย์สร้าง</button>{groups[id] && groups[id] !== x.kind && <small>ลองคิดอีกครั้ง มนุษย์ต้องสร้างสิ่งนี้หรือไม่?</small>}</article>; })}</div></>}{stage === 4 && <><h4>ทำไมถึงจัดแบบนี้?</h4><p>อธิบายเหตุผลอย่างน้อย 2 ข้อ โดยพิมพ์ต่อจากข้อความช่วยเริ่มต้น</p>{[bag.find(id => exploreObjects.find(x => x.id === id)?.kind === "nature"), bag.find(id => exploreObjects.find(x => x.id === id)?.kind === "made")].map((id, i) => { const x = exploreObjects.find(o => o.id === id); return <label className="dt-reason" key={i}><b>{x?.name}</b><span>ฉันจัด “{x?.name}” ไว้ในกลุ่ม{x?.kind === "nature" ? "ธรรมชาติ" : "มนุษย์สร้าง"} เพราะ</span><input value={reasons[i]} onChange={e => setReasons(s => s.map((v, n) => n === i ? e.target.value : v))} placeholder={i === 0 ? "สิ่งนี้เกิดขึ้นเอง..." : "มนุษย์เป็นผู้ออกแบบ..."}/></label>; })}</>}{stage === 5 && <><h4>ธรรมชาติ → ความคิด → เทคโนโลยี</h4><p>จับคู่ทรัพยากรกับเทคโนโลยีที่มนุษย์พัฒนาขึ้น</p><div className="dt-match-grid">{[["sun", "แสงแดด"], ["water", "น้ำ"], ["wind", "ลม"]].map(([id, label]) => <label key={id}><b>{label}</b><span>→</span><select value={matches[id] ?? ""} onChange={e => setMatches(s => ({ ...s, [id]: e.target.value }))}><option value="">เลือกเทคโนโลยี</option><option value="solar">โซลาร์เซลล์</option><option value="filter">เครื่องกรองน้ำ</option><option value="turbine">กังหันลมผลิตไฟฟ้า</option></select></label>)}</div>{matchPassed && <p className="dt-concept-note">จำไว้: สิ่งที่เกิดเองตามธรรมชาติไม่ใช่เทคโนโลยี แต่เป็นทรัพยากรสำหรับพัฒนาเทคโนโลยีได้</p>}</>}{stage === 6 && <><h4>หลักฐานจากโลกจริง</h4><p>แนบภาพ ระบุประเภท และเขียนสิ่งที่ได้เรียนรู้อย่างน้อย 1 ประโยค</p><label className="dt-evidence-upload"><input type="file" accept="image/*" capture="environment" onChange={e => { const file = e.target.files?.[0] ?? null; setEvidence(file); if (file)
        setPreview(URL.createObjectURL(file)); }}/>{preview ? <img src={preview} alt="ภาพหลักฐานที่เลือก"/> : <span>ถ่ายภาพหรือเลือกภาพจากอุปกรณ์</span>}</label><label className="dt-field">ชื่อสิ่งที่พบ<input value={foundName} onChange={e => setFoundName(e.target.value)}/></label><div className="dt-tag-choice"><button className={tag === "nature" ? "selected" : ""} onClick={() => setTag("nature")}>ธรรมชาติ</button><button className={tag === "made" ? "selected" : ""} onClick={() => setTag("made")}>มนุษย์สร้าง</button></div><label className="dt-field">ฉันได้เรียนรู้อะไร?<select value={starter} onChange={e => { setStarter(e.target.value); setReflection(e.target.value); }}><option>วันนี้ฉันได้เรียนรู้ว่า... </option><option>สิ่งที่ฉันเคยเข้าใจผิดคือ... </option><option>เทคโนโลยีที่ฉันใช้ทุกวันคือ... เพราะ... </option><option>ฉันแยกธรรมชาติกับสิ่งที่มนุษย์สร้างได้โดยดูจาก... </option></select><textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="เลือกข้อความเริ่มต้นแล้วเขียนต่อด้วยตนเอง"/></label><div className="dt-submit-check"><h5>ตรวจงานก่อนส่ง</h5>{[[sortedPassed, "จัดกลุ่มครบ"], [reasonPassed, "อธิบายเหตุผลอย่างน้อย 2 ข้อ"], [!!evidence, "แนบหลักฐาน"], [reflection.trim().length >= 15, "เขียน Reflection"]].map(([ok, label]) => <p className={ok ? "done" : ""} key={String(label)}>{ok ? "✓" : "○"} {label}</p>)}</div><button className="dt-submit-task" disabled={!canSubmit} onClick={() => setConfirming(true)}>ส่งใบงาน 2 คะแนน</button></>}</section>{stage < 6 && <button className="dt-task-next" disabled={!passed[stage - 1]} onClick={goNext}>ถัดไป →</button>}{confirming && <div className="dt-task-modal" role="dialog" aria-modal="true"><div><h4>พร้อมส่งภารกิจแล้วหรือยัง?</h4><p>หลังส่งแล้ว ระบบจะบันทึกคำตอบและหลักฐานของคุณ และจะแสดงเฉลย</p><button onClick={() => setConfirming(false)}>กลับไปตรวจงาน</button><button onClick={submitMission}>ยืนยันการส่ง</button></div></div>}</section>;
}
