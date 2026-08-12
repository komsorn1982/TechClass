import { Header } from "./components/Header";

const moments = [
  { icon: "</>", label: "ทดลองเขียนโค้ด", title: "สร้างเกมแรกของเรา", text: "เริ่มจากไอเดียเล็ก ๆ แล้วลงมือเขียนโค้ดจนเล่นได้จริง", color: "violet" },
  { icon: "✦", label: "คิดอย่างสร้างสรรค์", title: "ออกแบบด้วย AI", text: "เรียนรู้การใช้ AI เป็นผู้ช่วยคิด สร้าง และแก้ปัญหา", color: "lime" },
  { icon: "↗", label: "ทำงานเป็นทีม", title: "แชร์ไอเดียให้เพื่อน", text: "ฝึกอธิบายผลงาน รับฟัง และพัฒนาไปด้วยกัน", color: "coral" },
];

export default function Home() {
  return <main><Header />
    <section className="hero wrap" id="top"><div className="hero-copy">
      <div className="eyebrow"><span>●</span> พื้นที่เรียนรู้สำหรับคนรุ่นใหม่</div>
      <h1>เปลี่ยนเรื่อง<br/>คอมพิวเตอร์<br/><em>ให้เป็นเรื่องสนุก</em></h1>
      <p>ห้องเรียนที่ทุกคนได้คิด ได้ลอง และได้สร้างผลงานของตัวเอง ไม่จำเป็นต้องเก่งมาก่อน แค่พร้อมเรียนรู้ไปด้วยกัน</p>
      <div className="hero-actions"><a className="primary" href="#experience">ดูว่าเราเรียนกันอย่างไร <span>→</span></a><a className="textlink" href="/register"><span className="play">▶</span> เข้าร่วมชั้นเรียน</a></div>
      <div className="stats"><div><strong>ลงมือทำ</strong><span>ทุกบทเรียน</span></div><div><strong>สนุก</strong><span>กับการทดลอง</span></div><div><strong>เติบโต</strong><span>ไปพร้อมเพื่อน</span></div></div>
    </div><div className="hero-art" aria-label="บรรยากาศการเรียนเขียนโปรแกรม"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="code-card"><div className="dots">● ● ●</div><code><i>const</i> idea = <q>"ของฉัน"</q>;<br/><b>create</b>(idea);<br/><br/><span>show</span>("ให้โลกเห็น!");</code></div><div className="float-tag tag-one">⌘ &nbsp; ลองทำ</div><div className="float-tag tag-two">✦ &nbsp; สนุก</div><div className="spark s1">✦</div><div className="spark s2">+</div></div></section>

    <section className="experience" id="experience"><div className="wrap">
      <div className="experience-intro"><div><span className="mini">มากกว่าการนั่งฟัง</span><h2>ห้องเรียนที่ไอเดีย<br/>กลายเป็นของจริง</h2></div><p>ทุกคาบคือพื้นที่ทดลอง นักเรียนจะได้สร้างชิ้นงาน แก้โจทย์กับเพื่อน และค้นพบว่าคอมพิวเตอร์ทำอะไรได้มากกว่าที่คิด</p></div>
      <div className="classroom-stage">
        <div className="stage-copy"><span className="live-pill"><i/> วันนี้ในห้องเรียน</span><h3>ภารกิจ: สร้างเกม<br/>ที่เพื่อนอยากเล่น</h3><p>เริ่มจากวาดความคิดบนกระดาษ เปลี่ยนเป็นคำสั่ง แล้วทดลองจนเกมของเราเล่นได้จริง</p><div className="student-stack"><div><b>พ</b><b>น</b><b>อ</b><b>+12</b></div><span>เพื่อน ๆ กำลังสร้างผลงาน</span></div></div>
        <div className="stage-visual" aria-label="ตัวอย่างหน้าจอผลงานเกมของนักเรียน"><div className="screen-top"><span>my-first-game</span><i>▶ เล่นเกม</i></div><div className="game-world"><div className="cloud c-one"/><div className="cloud c-two"/><div className="pixel-star">★</div><div className="pixel-player">☺</div><div className="ground"><i/><i/><i/><i/></div></div><div className="achievement">🏆<span><b>ภารกิจสำเร็จ!</b><small>คุณสร้างเกมแรกได้แล้ว</small></span></div></div>
      </div>
      <div className="moment-grid">{moments.map((m,i)=><article className={`moment-card ${m.color}`} key={m.title}><div className="moment-top"><span>{m.icon}</span><small>0{i+1}</small></div><em>{m.label}</em><h3>{m.title}</h3><p>{m.text}</p></article>)}</div>
      <div className="student-quote"><span className="quote-mark">“</span><blockquote>ตอนแรกคิดว่าเขียนโค้ดยาก แต่พอได้ลองทำเกมกับเพื่อน รู้สึกสนุกจนอยากกลับไปทำต่อที่บ้านเลย</blockquote><div><b>— นักเรียนชั้น ม.1</b><span>หลังเรียนบทแรก</span></div><a href="/register">ฉันก็อยากลองเรียน <span>→</span></a></div>
    </div></section>
    <section className="why wrap" id="about"><div><span className="mini">ทุกคนเริ่มต้นได้</span><h2>ไม่ต้องเก่งก่อน<br/>ก็ค่อย ๆ เก่งขึ้นได้</h2></div><p>ครูจะพาเรียนทีละขั้น พร้อมตัวอย่างและกิจกรรมที่ได้ลงมือทำจริง เพราะเราเชื่อว่าความมั่นใจเกิดขึ้นเมื่อเด็ก ๆ ได้เห็นสิ่งที่ตัวเองสร้าง</p></section>
  </main>;
}
