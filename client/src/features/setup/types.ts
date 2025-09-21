export type Topic = 'javascript'|'react'|'python'|'node';
export type Level = 'easy'|'medium'|'hard';
export type Position = 'junior'|'middle'|'senior';
export type Tone = 'ty'|'vy';
export type Focus = 'algorithms'|'system'|'frameworks';

export interface SetupFormValues{
    topics: Topic [],
    duration: 15|30|60;
    level:Level,
    position:Position,
    tone:Tone,
    focus:Focus,
    voice:boolean  //voice+text
}
