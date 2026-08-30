import { useState } from "react";
export default function NameGate({onStart}:{onStart:(n:string)=>void}){
 const [name,setName]=useState(""); const [phase,setPhase]=useState<"input"|"verifying">("input"); const [msg,setMsg]=useState("");
 const submit=()=>{ const t=name.trim(); if(!t)return; setPhase("verifying"); setMsg(""); setTimeout(()=>{ if(t.toLowerCase()==="anuradha"){ setMsg("✓ IDENTITY VERIFIED"); setTimeout(()=>onStart(t),600);} else if(t===""){ setMsg("# YOU FORGOT YOUR OWN NAME."); setTimeout(()=>{setPhase("input"); setMsg("");},1200);} else { setMsg("# INVALID GIRLFRIEND DETECTED"); setTimeout(()=>{setPhase("input"); setMsg("");},1200);} },800);};
 return <div className="screen name-screen" style={{maxWidth:760,textAlign:"center"}}>
  <img className="logo" src="/assets/images/logo.svg" alt="BOYFRIEND.EXE" style={{maxWidth:380,width:"90%"}}/>
  <div className="title-wrap"><img className="mascot" src="/assets/images/mascot.svg" alt="" style={{height:140}}/><h1 className="big-title">HOW WELL DO YOU KNOW<br/><span className="accent">YOUR BOYFRIEND?</span></h1></div>
  <p className="subtle">Before we begin...</p>
  <label className="field-label" htmlFor="nameInput">ENTER YOUR NAME</label>
  <input id="nameInput" className="name-input" autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Anuradha"/>
  {phase==="input"? <button className="btn btn-primary" onClick={submit} disabled={!name.trim()} style={{display:"block",margin:"18px auto 0"}}>CONTINUE</button> : <button className="btn btn-primary" disabled style={{display:"block",margin:"18px auto 0"}}>CHECKING DATABASE...</button>}
  {msg&& <p style={{marginTop:16,fontWeight:800, color: msg.includes("VERIFIED")?"#2ecc71":"#ff3860"}}>{msg}</p>}
  <p className="hint-line">tip: it is definitely not "guest".</p>
 </div>;
}
