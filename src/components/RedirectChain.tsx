import type { RedirectPage } from "../types";
import { useEffect } from "react";
export default function RedirectChain({pages,current,onAdvance}:{pages:RedirectPage[]; current:number; onAdvance:()=>void}){
 const p=pages[current]; if(!p)return null;
 useEffect(()=>{ if(p.type==="loading"){ const t=setTimeout(onAdvance,950); return()=>clearTimeout(t);} },[p,current,onAdvance]);
 const tone=p.tone==="good"?" tone-good":p.tone==="bad"?" tone-bad":""; const url=p.url||"boyfriend.exe/redirect";
 return <div className="redirect-layer"><div className={"redirect-window"+tone}><div className="redirect-bar"><span className="dots"><i/><i/><i/></span><span className="redirect-url">{url}</span><button className="redirect-x" onClick={onAdvance}>✕</button></div><div className="redirect-body">{p.title&&<h2 className="redirect-title">{p.title}</h2>}{p.type==="loading"? <><div className="spinner"/><p className="redirect-text" dangerouslySetInnerHTML={{__html:p.body||"LOADING..."}}/> </> : <p className="redirect-text" dangerouslySetInnerHTML={{__html:p.body||""}}/>}{p.subtext&&<p className="subtle">{p.subtext}</p>}</div>{p.type==="choice"? <div className="redirect-choice"><button className="btn btn-primary" onClick={onAdvance}>YES (WRONG)</button><button className="btn btn-ghost" onClick={onAdvance}>NO (ALSO WRONG)</button></div> : p.type!=="loading" ? <div style={{textAlign:"center",padding:"0 20px 20px"}}><button className="btn btn-primary" onClick={onAdvance}>{p.btn||"CONTINUE"}</button></div> : null}</div></div>;
}
