export default function SecretScreen({data,onReset}:{data:any; onReset:()=>void;}){
 return <div className="screen result-screen secret"><h2 className="result-title"># FORBIDDEN BOYFRIEND LORE</h2><p>You know him better than the quiz does.</p><p>There is nothing left to test.</p><p className="subtle"><b>Probably.</b></p><div className="result-actions"><button className="btn btn-primary" onClick={onReset}>PLAY AGAIN</button></div></div>;
}
