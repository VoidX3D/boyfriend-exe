import type { View } from "../game/engine";
import type { ContentData } from "../types";
export default function QuestionScreen({view,data,onChoose,onRetry,onGiveUp,onHint}:{view:View; data:ContentData; onChoose:(id:string)=>void; onRetry:()=>void; onGiveUp:()=>void; onHint:()=>void;}){
 const cur=view.current; if(!cur||cur.type!=="real")return null; const q=cur.q; const txt=(q as any).question||(q as any).text||""; const answered=view.reveal!=="none";
 const texts=(()=>{ let m=0; q.options.forEach(o=>{if(o.text.length>m)m=o.text.length;}); return q.options.map(o=> o.text + " ".repeat(m - o.text.length));})();
 const progress=Math.round((q.id / view.hud.total)*100);
 return <div className="screen question-screen">
  <div className="q-progress"><span className="q-progress-fill" style={{width:progress+"%"}}/></div>
  <div className="q-meta"><span className="q-cat">{q.category}</span><span className="q-num">Question {view.hud.realIndex} / {view.hud.total}</span></div>
  <p className="q-kicker">THE SYSTEM IS WATCHING. CHOOSE CAREFULLY.</p>
  <h2 className="q-text">{txt}</h2>
  <div className="answers">{q.options.map((opt,i)=>{ const txt2=texts[i]; let cls="answer shape-"+i; if(answered&&opt.id===view.selectedId&&!opt.correct)cls+=" wrong-pick"; return <button key={opt.id} className={cls} disabled={view.locked} onClick={()=>onChoose(opt.id)}><span className="ans-key">{["A","B","C","D"][i]}</span><span className="ans-text">{txt2}</span></button>;})}</div>
  {!view.hintShown && !answered && <div className="hint-line" style={{cursor:"pointer",opacity:0.6}} onClick={onHint}>Need a hint? (−20 pts) — click here</div>}
  {view.hintShown && q.hint && <p className="hint-show">{q.hint}</p>}
  {view.feedback==="wrong" && <div className="feedback"><div className="fb-box bad"><div className="ans-taunt">Wrong. The boyfriend is taking notes.</div></div><div className="fb-actions"><button className="btn btn-primary" onClick={onRetry}>TRY AGAIN ({3-view.attempts+1} LEFT)</button><button className="btn btn-ghost" onClick={onGiveUp}>GIVE UP</button></div></div>}
  {view.feedback==="giveup" && <div style={{marginTop:16,textAlign:"center",color:"#b9b2d6"}}>Loading...</div>}
 </div>;
}
