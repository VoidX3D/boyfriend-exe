import type { Hud as HudType } from "../game/engine";
import MusicPlayer from "./MusicPlayer";
import type { MusicManager } from "../audio";
export default function Hud({hud,musicMuted,sfxMuted,onToggleMusic,onToggleSfx,musicRef}:{hud:HudType; musicMuted:boolean; sfxMuted:boolean; onToggleMusic:()=>void; onToggleSfx:()=>void; musicRef:React.MutableRefObject<MusicManager|null>}){
 const pct=Math.min(100,hud.rage);
 return <div id="hud" style={{display:"flex"}}>
  <div className="hud-block"><span className="hud-label">SCORE</span><span className="hud-val">{hud.score}</span></div>
  <div className="hud-block"><span className="hud-label">STREAK</span><span className="hud-val">{hud.streak}×</span></div>
  <div className="hud-block"><span className="hud-label">RAGE</span><span className="hud-val" style={{fontSize:12}}>{hud.mood}</span><div className="rage-bar"><div className="rage-fill" style={{width:pct+"%"}}/></div></div>
  <div className="hud-block"><span className="hud-label">PROGRESS</span><span className="hud-val">{hud.realIndex} / {hud.total}</span></div>
  <div className="music-control" id="musicControl"><span className="hud-label">VIBE</span><div className="music-row"><MusicPlayer musicRef={musicRef} muted={musicMuted} onToggle={onToggleMusic}/></div></div>
  <button className="mute-btn" onClick={onToggleSfx} title={sfxMuted?"unmute":"mute"}>{sfxMuted?"🔇":"🔊"}</button>
 </div>;
}
