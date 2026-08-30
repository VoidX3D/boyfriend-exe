import type { FlowItem } from "../types";
export default function PhantomScreen({item,picked,timeLeft,onSelect,onNext}:{item:FlowItem & {type:"phantom"}; picked:number; timeLeft:number; onSelect:(id:string)=>void; onNext:()=>void;}){
 const q=item.q; const need=q.options.length; const all=picked>=need;
 const texts=(()=>{ let m=0; q.options.forEach(o=>{if(o.text.length>m)m=o.text.length;}); return q.options.map(o=> o.text + " ".repeat(m - o.text.length));})();
 return <div className="screen question-screen phantom">
  <div className="q-meta"><span className="q-cat">{q.category}</span><span className="q-num">?? / ?</span><span className="q-timer">{timeLeft}s</span></div>
  <h2 className="q-text glitch-text">{(q as any).question||(q as any).text}</h2>
  <div className="answers">{q.options.map((o,i)=><button key={o.id} className={"answer shape-"+i} disabled={o.id!=="__all__" && false} onClick={()=>onSelect(o.id)}><span className="ans-key">{["A","B","C","D"][i]}</span><span className="ans-text">{texts[i]}</span></button>)}</div>
  <p className="pick-status">SELECT ALL {need} OPTIONS FIRST — {picked}/{need}</p>
  <div className="feedback">{all && <button className="btn btn-primary" onClick={onNext}>NEXT QUESTION</button>}</div>
 </div>;
}
