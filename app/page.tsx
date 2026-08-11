"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Track = { title: string; artist: string; videoId: string; duration: string };
type Collection = { id: string; gujarati: string; english: string; note: string; mark: string; tracks: Track[] };

const collections: Collection[] = [
  {
    id: "lokgeet", gujarati: "લોકગીત", english: "Lokgeet", note: "માટીની મહેક અને મેળાનો રંગ", mark: "✦",
    tracks: [
      { title: "મોર બની થનગાટ કરે", artist: "ગીતા રબારી", videoId: "6c6szaSe4pE", duration: "4:18" },
      { title: "મણિયારો", artist: "ફાલ્ગુની પાઠક", videoId: "fT9vR4-9YJw", duration: "5:02" },
      { title: "હે રંગલો", artist: "પરંપરાગત લોકગીત", videoId: "mT4TGR7pB3M", duration: "6:11" },
    ],
  },
  {
    id: "bhajan", gujarati: "ભજન", english: "Bhajan", note: "શ્રદ્ધા, સ્મરણ અને સવારનો સૂર", mark: "☀",
    tracks: [
      { title: "વૈષ્ણવ જન તો", artist: "નરસિંહ મહેતા", videoId: "gVn5O9fz10A", duration: "4:56" },
      { title: "મીઠી મારી આંખડીના તારા", artist: "હેમંત ચૌહાણ", videoId: "M8D2sP9jQmA", duration: "7:20" },
      { title: "હરિ તું ગાડું મારું ક્યાં લઈ જાય", artist: "પ્રફુલ દવે", videoId: "W-P6E6WQF6E", duration: "6:48" },
    ],
  },
  {
    id: "santvani", gujarati: "સંતવાણી", english: "Santvani", note: "સંતોના શબ્દોમાં જીવનનું અજવાળું", mark: "❋",
    tracks: [
      { title: "પાનબાઈ", artist: "નારાયણ સ્વામી", videoId: "Kx2VYQk4uZ8", duration: "8:14" },
      { title: "મેરુ તો ડગે", artist: "હેમંત ચૌહાણ", videoId: "T7H4QyYp2eE", duration: "6:39" },
      { title: "જુનો ધરમ", artist: "લખમણ બારોટ", videoId: "zS3x3qkEwYU", duration: "9:05" },
    ],
  },
  {
    id: "hasya", gujarati: "હાસ્ય ડાયરો", english: "Hasya Dayaro", note: "ખડખડાટ હાસ્ય અને ગામઠી મોજ", mark: "☻",
    tracks: [
      { title: "હાસ્યની રમઝટ", artist: "માયાભાઈ આહીર", videoId: "gN8vJw0hV0Q", duration: "12:25" },
      { title: "કાઠિયાવાડી કિસ્સા", artist: "શાહબુદ્દીન રાઠોડ", videoId: "S0H4A8yvzjM", duration: "14:08" },
      { title: "ગામડાની ગમ્મત", artist: "સાંઈરામ દવે", videoId: "iN9j9C0d9xQ", duration: "10:44" },
    ],
  },
  {
    id: "varta", gujarati: "લોકવાર્તા", english: "Traditional Stories", note: "વીરતા, વચન અને વારસાની વાતો", mark: "❧",
    tracks: [
      { title: "સૌરાષ્ટ્રની રસધાર", artist: "લોકવાર્તા", videoId: "jNQXAC9IVRw", duration: "11:32" },
      { title: "વીર માંગડાવાળો", artist: "કાનજી ભુટા બારોટ", videoId: "aqz-KE-bpKQ", duration: "13:19" },
      { title: "ચારણ કન્યાની વાત", artist: "પરંપરાગત કથા", videoId: "dQw4w9WgXcQ", duration: "9:50" },
    ],
  },
];

export default function Home() {
  const [collectionId, setCollectionId] = useState("lokgeet");
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const collection = useMemo(() => collections.find((item) => item.id === collectionId) ?? collections[0], [collectionId]);
  const track = collection.tracks[trackIndex] ?? collection.tracks[0];

  const playerCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  };

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    playerCommand(next ? "playVideo" : "pauseVideo");
  };

  const changeTrack = (index: number) => {
    setTrackIndex((index + collection.tracks.length) % collection.tracks.length);
    setPlaying(true);
  };

  const chooseCollection = (id: string) => {
    setCollectionId(id);
    setTrackIndex(0);
    setPlaying(false);
  };

  const playEffect = (kind: "manjira" | "dholak" | "taali") => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const hit = (frequency: number, delay: number, length: number, type: OscillatorType = "sine") => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.22, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + length);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + length + 0.02);
    };
    if (kind === "manjira") [0, .12, .24].forEach((d) => hit(2100, d, .15, "square"));
    if (kind === "dholak") [0, .18, .36, .52].forEach((d, i) => hit(i % 2 ? 145 : 92, d, .16, "triangle"));
    if (kind === "taali") [0, .08, .19, .31, .44].forEach((d, i) => hit(500 + i * 75, d, .08, "sawtooth"));
    window.setTimeout(() => ctx.close(), 1400);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Space" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        togglePlay();
      }
      if (event.code === "ArrowRight") changeTrack(trackIndex + 1);
      if (event.code === "ArrowLeft") changeTrack(trackIndex - 1);
      if (event.code === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ગુજરાતી ડાયરો રેડિયો મુખ્ય પાનું">
          <span className="brand-sun">દ</span>
          <span><strong>ગુજરાતી ડાયરો</strong><small>રેડિયો • ગુજરાતનો અસલ સૂર</small></span>
        </a>
        <nav aria-label="મુખ્ય નેવિગેશન">
          <a href="#rang">રંગ</a><a href="#mehfil">મહેફિલ</a>
          <button className="queue-button" onClick={() => setDrawer(true)} aria-haspopup="dialog">પ્લેલિસ્ટ <span>{collection.tracks.length}</span></button>
        </nav>
      </header>

      <section className="hero" id="top">
        <Image src="/dayaro-hero.png" alt="રાત્રે ગામના માંડવા નીચે ચાલતી ગુજરાતી ડાયરાની મહેફિલ" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">આકાશ નીચે • માટીની વચ્ચે • સંગીત સાથે</p>
          <h1>આવો, આજની રાત<br /><em>ડાયરો</em> કરીએ.</h1>
          <p>લોકગીત, ભજન, સંતવાણી અને હાસ્યની એવી મહેફિલ—જ્યાં દરેક તાલ સાથે ગુજરાત ધબકે.</p>
          <button onClick={() => { setPlaying(true); document.querySelector("#mehfil")?.scrollIntoView({ behavior: "smooth" }); }} className="hero-cta">▶ &nbsp; મહેફિલ શરૂ કરો</button>
        </div>
        <div className="live-stamp"><span /> હમણાં વાગે છે<br /><strong>{track.title}</strong></div>
      </section>

      <section className="collections section" id="rang">
        <div className="section-heading"><div><p className="eyebrow dark">તમારા મનનો રંગ પસંદ કરો</p><h2>ગુજરાતના પાંચ સૂર</h2></div><p>દરેક પેટીમાં એક નવી મહેફિલ,<br />દરેક ગીતમાં એક જૂની યાદ.</p></div>
        <div className="collection-grid">
          {collections.map((item, index) => (
            <button key={item.id} className={`collection-card c${index + 1} ${collectionId === item.id ? "active" : ""}`} onClick={() => chooseCollection(item.id)} aria-pressed={collectionId === item.id}>
              <span className="card-mark">{item.mark}</span><small>૦{index + 1}</small><h3>{item.gujarati}</h3><b>{item.english}</b><p>{item.note}</p><i>સાંભળો →</i>
            </button>
          ))}
        </div>
      </section>

      <section className="player-section" id="mehfil">
        <div className="player-shell">
          <div className="player-intro"><p className="eyebrow">ચાલુ મહેફિલ</p><h2>{collection.gujarati}</h2><p>{collection.note}</p><span className="ornament">❋ ─────── ❋</span></div>
          <div className="video-wrap">
            <iframe ref={iframeRef} key={track.videoId} src={`https://www.youtube.com/embed/${track.videoId}?enablejsapi=1&playsinline=1&rel=0&autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}`} title={`${track.title} — ${track.artist}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
          <div className="now-playing">
            <div className="disc"><span>{collection.mark}</span></div>
            <div className="track-copy"><small>હમણાં વાગે છે</small><h3>{track.title}</h3><p>{track.artist} · {collection.english}</p></div>
            <div className="controls" aria-label="રેડિયો નિયંત્રણો">
              <button onClick={() => changeTrack(trackIndex - 1)} aria-label="પાછલું ગીત">◀◀</button>
              <button className="play" onClick={togglePlay} aria-label={playing ? "થોભાવો" : "વગાડો"}>{playing ? "Ⅱ" : "▶"}</button>
              <button onClick={() => changeTrack(trackIndex + 1)} aria-label="આગળનું ગીત">▶▶</button>
              <button onClick={() => { const next = !muted; setMuted(next); playerCommand(next ? "mute" : "unMute"); }} aria-label={muted ? "અવાજ ચાલુ કરો" : "અવાજ બંધ કરો"}>{muted ? "♩̸" : "♫"}</button>
              <button onClick={() => setDrawer(true)} aria-label="પ્લેલિસ્ટ ખોલો">☷</button>
            </div>
          </div>
        </div>
      </section>

      <section className="sounds section">
        <div><p className="eyebrow dark">મહેફિલમાં રંગ ભરો</p><h2>તમારો પણ તાલ ઉમેરો</h2></div>
        <div className="sound-buttons">
          <button onClick={() => playEffect("manjira")}><span>◉</span><b>મંજીરા</b><small>રણકાર</small></button>
          <button onClick={() => playEffect("dholak")}><span>◎</span><b>ઢોલક</b><small>ધબકાર</small></button>
          <button onClick={() => playEffect("taali")}><span>✋</span><b>વાહ વાહ!</b><small>તાળીઓ</small></button>
        </div>
      </section>

      <footer><div className="footer-mark">દ</div><h2>સૂર કદી અટકતો નથી.</h2><p>આજની મહેફિલ અહીં પૂરી—પણ ગુજરાતનો સૂર હંમેશાં તમારી સાથે.</p><small>ગુજરાતી ડાયરો રેડિયો · લોકસંગીતને પ્રેમથી સમર્પિત</small></footer>

      {drawer && <div className="drawer-backdrop">
        <aside className="drawer" role="dialog" aria-modal="true" aria-label="ગીતોની યાદી">
          <div className="drawer-head"><div><small>આજની મહેફિલ</small><h2>{collection.gujarati}</h2></div><button onClick={() => setDrawer(false)} aria-label="પ્લેલિસ્ટ બંધ કરો">×</button></div>
          <div className="drawer-tabs">{collections.map((item) => <button key={item.id} className={collectionId === item.id ? "active" : ""} onClick={() => chooseCollection(item.id)}>{item.gujarati}</button>)}</div>
          <ol>{collection.tracks.map((item, index) => <li key={item.videoId} className={trackIndex === index ? "active" : ""}><button onClick={() => { changeTrack(index); setDrawer(false); }}><span>{String(index + 1).padStart(2, "0")}</span><span><b>{item.title}</b><small>{item.artist}</small></span><time>{item.duration}</time></button></li>)}</ol>
          <p className="key-hint">Space: વગાડો / થોભાવો &nbsp; • &nbsp; ← →: ગીત બદલો</p>
        </aside>
      </div>}
    </main>
  );
}
