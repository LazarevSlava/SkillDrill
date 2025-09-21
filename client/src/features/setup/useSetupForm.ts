import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { readSetupDraft, writeSetupDraft } from './storage';
import { SetupFormValues } from "./types";

const DEFAULTS: SetupFormValues={
    topics:[],
    duration:30,
    level:'medium',
    position:'middle',
    tone:'ty',
    focus:'frameworks',
    voice:true,
}

export function useSetupForm(){
    const [values,setValues]=useState<SetupFormValues>(()=>{
        const saved=readSetupDraft()
        return saved ? {...DEFAULTS,...saved}:DEFAULTS
    })

    //auto-save draft
    useEffect(()=>{
        writeSetupDraft(values)
    },[values])
    const update=<K extends keyof SetupFormValues>(key:K,val:SetupFormValues[K])=>
    setValues(v=>({...v,[key]:val}))
    return useMemo(()=>({values,setValues,update}),[values])
}