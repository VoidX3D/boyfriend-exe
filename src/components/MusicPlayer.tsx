import type { MusicManager } from "../audio";
export default function MusicPlayer({musicRef,muted,onToggle}:{musicRef:React.MutableRefObject<MusicManager|null>; muted:boolean; onToggle:()=>void}){
 const m=musicRef.current; if(!m)return null;
 return <><button className="music-btn" onClick={()=>{m.previous(); onToggle();}}>‹</button><select className="music-select" value={m.getPlaylist().find(t=>t.title===m.current())?.id||""} onChange={e=>{m.selectTrack(e.target.value); onToggle();}}>{m.getPlaylist().map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select><button className="music-btn" onClick={()=>{m.next(); onToggle();}}>›</button><button className="music-btn" onClick={()=>{m.toggle(); onToggle();}} title={muted?"Unmute":"Mute"} style={{marginLeft:6}}>{muted?"🔇":"▶"}</button></>;
}
