/** Pick ten unique, randomized heritage detective questions per visit/replay.
 * Keep the original question bank unchanged and retain easy-to-hard progression.
 */
export const DETECTIVE_ROUND_SIZE = 10;
type DetectiveQuestion = {id:string;difficulty?:number};

export const newDetectiveRound = <T extends DetectiveQuestion>(
  bank:readonly T[],
  random:()=>number = Math.random
):T[] => {
  const seen=new Set<string>();
  const selected:T[]=[];
  const shuffle=(items:readonly T[]):T[] => {
    const result=[...items];
    for(let i=result.length-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  };
  // Three introductory, three intermediate, two advanced and two expert tasks.
  // Each group is sampled independently, then shown in increasing difficulty.
  const quotas=[3,3,2,2];
  for(let level=1;level<=4;level++){
    const candidates=shuffle(bank.filter(q=>(q.difficulty||1)===level && !seen.has(q.id)));
    for(const q of candidates.slice(0,quotas[level-1])){
      seen.add(q.id);
      selected.push(q);
    }
  }
  if(selected.length<DETECTIVE_ROUND_SIZE){
    for(const q of shuffle(bank.filter(q=>!seen.has(q.id)))){
      if(selected.length===DETECTIVE_ROUND_SIZE)break;
      seen.add(q.id);
      selected.push(q);
    }
  }
  return selected.sort((a,b)=>(a.difficulty||1)-(b.difficulty||1));
};
