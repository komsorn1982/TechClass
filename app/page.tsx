import { Header } from "./components/Header";
import { BANNER_DATA_URL } from "./portfolio-banner";

const quick = [
  ["👤", "PROFILE", "ประวัติ ข้อมูลทั่วไป และเส้นทางการเป็นครู", "#profile"],
  ["📄", "PERFORMANCE AGREEMENT", "ข้อตกลงในการพัฒนางาน (PA) ปีงบประมาณ 2569", "#pa"],
  ["🏆", "THE CHALLENGE", "ประเด็นท้าทายและนวัตกรรมเพื่อผู้เรียน", "#challenge"],
  ["📁", "EVIDENCE", "หลักฐาน ร่องรอย และผลการดำเนินงาน", "#evidence"],
];

const pa = [
  ["01", "🎓", "ด้านที่ 1", "การจัดการเรียนรู้", "ออกแบบและจัดการเรียนรู้ด้วยเทคโนโลยีที่เน้นผู้เรียนเป็นสำคัญ"],
  ["02", "👥", "ด้านที่ 2", "การส่งเสริมและสนับสนุนการจัดการเรียนรู้", "พัฒนาสื่อ นวัตกรรม และสร้างโอกาสการเรียนรู้ให้ผู้เรียน"],
  ["03", "📊", "ด้านที่ 3", "การพัฒนาตนเองและวิชาชีพ", "เรียนรู้ พัฒนาตนเอง สู่การเป็นครูมืออาชีพในยุคดิจิทัล"],
];

const process = [
  ["1", "Problem", "วิเคราะห์ปัญหา\nและความต้องการ"],
  ["2", "Design", "ออกแบบแนวทาง\nการพัฒนา"],
  ["3", "Innovation", "พัฒนานวัตกรรม\nและสื่อการเรียนรู้"],
  ["4", "Implement", "นำไปใช้ในการจัด\nการเรียนรู้"],
  ["5", "Measure", "ประเมินผล\nและสะท้อนผล"],
  ["6", "Impact", "ผู้เรียนเกิดการเปลี่ยนแปลง\nอย่างยั่งยืน"],
];

const ecosystem = [
  ["🧠", "AI for Education", "ใช้ AI เพื่อยกระดับการเรียนรู้"],
  ["</>", "Coding", "ฝึกทักษะการเขียนโค้ดและแก้ปัญหา"],
  ["⚙", "Computational Thinking", "คิดเชิงคำนวณ แก้ปัญหาอย่างเป็นระบบ"],
  ["🎧", "Project-based Learning", "เรียนรู้ผ่านโครงงาน สร้างสรรค์นวัตกรรม"],
  ["▶", "Digital Media", "ผลิตสื่อดิจิทัลอย่างมืออาชีพ"],
  ["▥", "Online Assessment", "ประเมินผลด้วยเทคโนโลยีที่หลากหลาย"],
];

const evidence = [
  ["📄", "แผนการจัดการเรียนรู้", "หน่วยการเรียนรู้ / แผนฯ"],
  ["💡", "สื่อและนวัตกรรม", "สื่อการสอน / นวัตกรรม"],
  ["👥", "ผลงานนักเรียน", "ชิ้นงาน / รางวัล"],
  ["📊", "การวัดและประเมินผล", "แบบทดสอบ / Rubric"],
  ["🖼", "ภาพกิจกรรมการเรียนรู้", "กิจกรรมในห้องเรียน"],
  ["📁", "เอกสารประกอบ PA", "เอกสาร / ไฟล์หลักฐาน"],
];

export default function Home() {
  return <main className="portfolio-page">
    <Header />
    <section id="home" className="hero-banner"><img src={BANNER_DATA_URL} alt="Digital PA Portfolio 2569 นายคมศร อุดมเพ็ญ" /></section>

    <section className="pa-section white" id="quick"><div className="pa-container">
      <div className="pa-heading"><h2>QUICK <span>ACCESS</span></h2><p>เลือกเมนูเพื่อเข้าชมเนื้อหาที่คุณสนใจ</p></div>
      <div className="quick-grid">{quick.map(([icon,title,text,href]) => <a className="quick-card" href={href} key={title}><i>{icon}</i><div><b>{title}</b><p>{text}</p></div><span>→</span></a>)}<aside className="script-note">Education<br/>Creates<br/>New Possibilities <em>━</em></aside></div>
    </div></section>

    <section className="teacher-section" id="profile"><div className="pa-container teacher-grid">
      <div className="teacher-copy"><div className="pa-heading"><h2>MEET THE <span>TEACHER</span></h2></div><h3>เทคโนโลยี คือ เครื่องมือ<br/>แต่ “ครู” คือ ผู้ออกแบบการเรียนรู้</h3><p>สวัสดีครับ ผม <strong>นายคมศร อุดมเพ็ญ</strong> ครูผู้สอนรายวิชาคอมพิวเตอร์ มุ่งมั่นในการออกแบบการเรียนรู้ด้วยเทคโนโลยี เพื่อพัฒนาผู้เรียนให้คิดเป็น แก้ปัญหาเป็น และสร้างสรรค์ได้</p><a className="yellow-btn" href="#about">ดูประวัติของฉัน <span>→</span></a></div>
      <div className="video-card" id="video" style={{backgroundImage:`linear-gradient(90deg,rgba(2,20,51,.12),rgba(2,20,51,.28)),url(${BANNER_DATA_URL})`}}><button aria-label="เล่นวิดีโอ">▶</button><div><span>แนะนำตัว</span><b>ครูคมศร อุดมเพ็ญ</b><small>▶ DIGITAL PA PORTFOLIO</small></div><footer><span>▶ &nbsp; 0:30 / 4:12</span><span>⚙ ⛶</span></footer></div>
      <blockquote>“ โรงเรียนที่ดี<br/>ไม่ใช่แค่สอนให้รู้<br/>แต่สอนให้คิด<br/>และสร้างอนาคตได้ ”<small>Komsorn U.</small></blockquote>
    </div></section>

    <section className="pa-section" id="pa"><div className="pa-container"><div className="pa-heading"><h2>PERFORMANCE <span>AGREEMENT</span></h2><p>การพัฒนางานตามข้อตกลง (PA) ปีงบประมาณ 2569</p></div><div className="pa-grid">{pa.map(([num,icon,kicker,title,text]) => <article className="pa-card" key={num}><strong>{num}</strong><i>{icon}</i><div><small>{kicker}</small><h3>{title}</h3><p>{text}</p></div><a href="#evidence">→</a></article>)}</div></div></section>

    <section className="challenge" id="challenge"><div className="pa-container challenge-grid"><div><h2>THE <span>CHALLENGE</span></h2><h3>นวัตกรรมเพื่อการพัฒนาผู้เรียน สู่ผลลัพธ์ที่ยั่งยืน</h3><p>“ จากปัญหา สู่การออกแบบนวัตกรรม เพื่อยกระดับการเรียนรู้ และพัฒนาผู้เรียนให้เป็นสมรรถนะในศตวรรษที่ 21 ”</p></div><div className="process">{process.map(([num,title,text],idx)=><div className={`process-step pstep-${idx+1}`} key={num}><i>{num}</i><b>{title}</b><p>{text}</p>{idx<5&&<span>→</span>}</div>)}</div><aside>“ นวัตกรรมการศึกษา<br/>เพื่อผู้เรียนที่ดีกว่าในอนาคต ”</aside></div></section>

    <section className="pa-section ecosystem" id="development"><div className="pa-container"><div className="pa-heading"><h2>DIGITAL TEACHING <span>ECOSYSTEM</span></h2><p>เครื่องมือ แนวคิด และนวัตกรรมที่ใช้ในการจัดการเรียนรู้</p></div><div className="eco-grid">{ecosystem.map(([icon,title,text])=><article key={title}><i>{icon}</i><div><b>{title}</b><p>{text}</p></div></article>)}</div></div></section>

    <section className="pa-section evidence" id="evidence"><div className="pa-container"><div className="pa-heading"><h2>EVIDENCE OF <span>IMPACT</span></h2><p>หลักฐาน ร่องรอย และผลลัพธ์จากการดำเนินงาน</p></div><div className="evidence-grid">{evidence.map(([icon,title,text])=><a href="#evidence" key={title}><i>{icon}</i><div><b>{title}</b><p>{text}</p></div><span>›</span></a>)}</div></div></section>

    <section className="about-strip" id="about"><div className="pa-container about-grid"><div className="avatar">คศ</div><div><b>ABOUT ME</b><h3>นายคมศร อุดมเพ็ญ</h3><p>ครู วิทยฐานะครูชำนาญการพิเศษ</p><small>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • โรงเรียนธาตุทองอำนวยวิทย์</small></div><blockquote>“ ออกแบบการเรียนรู้ด้วยเทคโนโลยี เพื่อให้ผู้เรียนรู้ที่จะคิดเป็น ทำเป็น แก้ปัญหาเป็น และสร้างสรรค์ได้ ”<small>Komsorn U.</small></blockquote><a className="yellow-btn" href="#profile">ดูประวัติและผลงานเพิ่มเติม →</a></div></section>

    <footer className="pa-footer">
      <div className="pa-container footer-pro">
        <section className="footer-pro-brand" aria-label="Digital PA Portfolio">
          <div className="footer-brand">
            <i aria-hidden="true">▱</i>
            <span>DIGITAL PA PORTFOLIO 2569<small>Technology • Innovation • Learning</small></span>
          </div>
          <p>พื้นที่แห่งการเรียนรู้ แบ่งปัน และพัฒนาวิชาชีพครู<br/>เพื่อผู้เรียนที่ดีกว่าในอนาคต</p>
        </section>

        <section className="footer-pro-links">
          <h3>QUICK LINKS</h3>
          <nav>
            <a href="#home"><span>01</span>HOME</a>
            <a href="#profile"><span>02</span>PROFILE</a>
            <a href="#pa"><span>03</span>PA</a>
            <a href="#challenge"><span>04</span>CHALLENGE</a>
            <a href="#video"><span>05</span>VIDEO</a>
            <a href="#evidence"><span>06</span>EVIDENCE</a>
          </nav>
        </section>

        <section className="footer-pro-contact">
          <h3>CONTACT</h3>
          <div className="contact-row">
            <span className="contact-icon" aria-hidden="true">●</span>
            <div><small>ชื่อ-สกุล</small><strong>นายคมศร อุดมเพ็ญ</strong></div>
          </div>
          <div className="contact-row">
            <span className="contact-icon" aria-hidden="true">◆</span>
            <div><small>ตำแหน่ง</small><strong>ครู วิทยฐานะครูชำนาญการพิเศษ</strong></div>
          </div>
          <div className="contact-row">
            <span className="contact-icon" aria-hidden="true">▲</span>
            <div><small>สถานศึกษา</small><strong>โรงเรียนธาตุทองอำนวยวิทย์<br/>องค์การบริหารส่วนจังหวัดสกลนคร</strong></div>
          </div>
        </section>

        <aside className="footer-pro-quote">“ Technology<br/>Innovation<br/>Learning<br/><b>for Better People</b> ”<em>━</em></aside>
      </div>
      <div className="copyright">© 2026 Komsorn Udomphen • Digital PA Portfolio</div>
    </footer>
  </main>;
}