const courses = [
  { icon: "</>", title: "พื้นฐานการเขียนโปรแกรม", desc: "เรียนรู้แนวคิดสำคัญผ่านโจทย์ที่เข้าใจง่าย", meta: "12 บทเรียน", tone: "purple" },
  { icon: "▦", title: "การออกแบบเว็บไซต์", desc: "สร้างเว็บไซต์สวย ใช้งานได้จริง ตั้งแต่ศูนย์", meta: "10 บทเรียน", tone: "blue" },
  { icon: "⌁", title: "เครือข่ายคอมพิวเตอร์", desc: "เข้าใจการเชื่อมต่อและโลกอินเทอร์เน็ต", meta: "8 บทเรียน", tone: "orange" },
  { icon: "✦", title: "ปัญญาประดิษฐ์เบื้องต้น", desc: "รู้จัก AI และนำไปใช้อย่างสร้างสรรค์", meta: "6 บทเรียน", tone: "green" },
];

export default function Home() {
  return (
    <main>
      <nav className="nav wrap" aria-label="เมนูหลัก">
        <a className="brand" href="#top"><span className="brandmark">TC</span><span>TECH<span>CLASS</span></span></a>
        <div className="navlinks"><a className="active" href="#top">หน้าแรก</a><a href="#courses">รายวิชา</a><a href="#about">เกี่ยวกับเรา</a></div>
        <a className="navbutton" href="#courses">เข้าสู่บทเรียน <span>→</span></a>
      </nav>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>●</span> พื้นที่เรียนรู้สำหรับคนรุ่นใหม่</div>
          <h1>เปลี่ยนเรื่อง<br/>คอมพิวเตอร์<br/><em>ให้เป็นเรื่องสนุก</em></h1>
          <p>เรียนรู้เทคโนโลยีแบบลงมือทำ เข้าใจง่าย และนำไปใช้ได้จริง ไม่ว่าคุณจะเริ่มต้นจากตรงไหน</p>
          <div className="hero-actions"><a className="primary" href="#courses">เริ่มเรียนได้เลย <span>→</span></a><a className="textlink" href="#about"><span className="play">▶</span> รู้จัก TechClass</a></div>
          <div className="stats"><div><strong>4+</strong><span>รายวิชา</span></div><div><strong>36+</strong><span>บทเรียน</span></div><div><strong>100%</strong><span>เรียนฟรี</span></div></div>
        </div>
        <div className="hero-art" aria-label="ภาพประกอบห้องเรียนคอมพิวเตอร์">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="code-card"><div className="dots">● ● ●</div><code><i>const</i> future = <b>await</b><br/> &nbsp;learn(<q>technology</q>);<br/><br/><span>console</span>.log(future);</code></div>
          <div className="float-tag tag-one">⌘ &nbsp; Coding</div><div className="float-tag tag-two">✦ &nbsp; Create</div>
          <div className="spark s1">✦</div><div className="spark s2">+</div><div className="spark s3">●</div>
        </div>
      </section>

      <section className="courses" id="courses"><div className="wrap">
        <div className="section-head"><div><span>สำรวจรายวิชา</span><h2>เลือกสิ่งที่อยากเรียนรู้</h2></div><a href="#courses">ดูรายวิชาทั้งหมด →</a></div>
        <div className="course-grid">{courses.map((course, i) => <article className="course-card" key={course.title}>
          <div className={`course-icon ${course.tone}`}>{course.icon}</div><div className="course-number">0{i+1}</div>
          <h3>{course.title}</h3><p>{course.desc}</p><div className="course-foot"><span>▤ &nbsp;{course.meta}</span><button aria-label={`เปิดวิชา ${course.title}`}>↗</button></div>
        </article>)}</div>
      </div></section>

      <section className="why wrap" id="about"><div><span className="mini">เรียนในแบบของคุณ</span><h2>ค่อย ๆ เก่งขึ้น<br/>ทีละบทเรียน</h2></div><p>เนื้อหาทุกบทออกแบบมาให้กระชับ มีตัวอย่าง และได้ทดลองทำจริง เพื่อให้การเรียนคอมพิวเตอร์ไม่ใช่เรื่องไกลตัวอีกต่อไป</p></section>
    </main>
  );
}
