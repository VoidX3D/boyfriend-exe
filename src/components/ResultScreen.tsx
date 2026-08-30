import type { ResultSummary } from "../game/engine";
import type { ContentData } from "../types";
export default function ResultScreen({result,content,onReset,cheatUsed}:{result:ResultSummary; content:ContentData; onReset:()=>void; cheatUsed:boolean;}){
 const {score,correctAnswers,total,wrongAnswers,bestStreak,rage,hintsUsed,noHintBonus,achievements,distribution,rank,rankColor}=result;
 const sarcasm=["You actually tried to cheat on a boyfriend quiz.","The mascot is disappointed. The boyfriend is mortified.","Achievement unlocked: ROMANCE CRIMINAL","Your girlfriend knowledge is officially null and void.","Somewhere, a boyfriend just felt a disturbance in the force.",][Math.floor(Math.random()*5)];
 return <div className="screen result-screen">
  {cheatUsed && <div style={{padding:"12px 16px",marginBottom:16,background:"rgba(255,56,96,.12)",border:"1px solid #ff3860",borderRadius:12,color:"#ff3860",fontWeight:700}}>⚠️ CHEAT MODE DETECTED — This result is void. The mascot is judging you.</div>}
  <h2 className="result-title"># {cheatUsed?"FRAUD REPORT":"BOYFRIEND KNOWLEDGE REPORT"}</h2>
  <div className="report"><p>Correct: <b>{correctAnswers}</b> / {total}</p><p>Wrong: <b>{wrongAnswers}</b></p><p>Lore XP: <b>{score.toLocaleString()}{cheatUsed?" (NEGATED)":""}</b></p><p>Best streak: <b>{bestStreak}×</b></p><p>Hints used: <b>{hintsUsed}</b></p><p>Maximum rage: <b>{rage}%</b></p><p>A/B/C/D: <b>{distribution.a}/{distribution.b}/{distribution.c}/{distribution.d}</b></p></div>
  <div className="rank-box" style={{borderColor:rankColor}}><h3 className="rank-head" style={{color:rankColor}}>{rank}</h3>{cheatUsed && <p className="rank-body" style={{fontStyle:"italic"}}>{sarcasm}</p>}</div>
  {noHintBonus && !cheatUsed && <p className="subtle">🎉 NO HINT BONUS: You didn't use any hints!</p>}
  {achievements.length>0 && <div style={{marginTop:16}}><h3 className="rank-head">SECRET ACHIEVEMENTS</h3>{achievements.map(a=>{ const ac=(content.achievements||[]).find(x=>x.id===a); return <p key={a}><b>{ac?.name||a}</b> — {ac?.desc||""}</p>;})}</div>}
  <div className="result-actions"><button className="btn btn-primary" onClick={onReset}>PLAY AGAIN</button></div>
 </div>;
}
