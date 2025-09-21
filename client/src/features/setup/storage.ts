const DRAFT_KEY='sd.setup.draft';
const COMPLETED_KEY='sd.setup.completed';

export function readSetupDraft(){
    try{
        const raw=localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw):null
    }catch{
        return null
    }
}
export function writeSetupDraft(draft:unknown){
    try{
        localStorage.setItem(DRAFT_KEY,JSON.stringify(draft))
    }catch{}
}
export function clearSetupDruft(){
    localStorage.removeItem(DRAFT_KEY)
}
export function markSetupCompleted(){
    localStorage.setItem(COMPLETED_KEY,'1')
}
export function isSetupCompleted(){
    return localStorage.getItem(COMPLETED_KEY)=== '1'
}