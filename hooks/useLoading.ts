import {useState} from "react";
import {empty, isEmpty} from "../utils/utils";




type LoadsT = {
    set: (tag: string, isLoading?: boolean|empty)=>void
    start: (tag: string)=>void
    finish: (tag: string)=>void
    finishAll: ()=>void
    get: (tag: string)=>boolean
}
const useLoading = (...loading: string[]): LoadsT => {
    const [loadSet, setLoadSet] = useState(new Set<string>(loading))

    const [change, setChange] = useState({}) // to make react rerender because Map reference is not changed
    const makeChange = ()=>setChange({})


    const start = (tag: string)=>{
        if (!loadSet.has(tag)){
            loadSet.add(tag)
            makeChange()
        }
    }
    const finish = (tag: string)=>{
        if (loadSet.has(tag)){
            loadSet.delete(tag)
            makeChange()
        }
    }
    const finishAll = ()=>{
        if (loadSet.size!==0){
            loadSet.clear();
            makeChange()
        }
    }


    const set = (tag: string, isLoading?: boolean|empty)=>{
        if (isLoading || isEmpty(isLoading)) start(tag)
        else finish(tag)
    }
    const get = (tag: string)=>loadSet.has(tag)


    return { set,start,finish,finishAll,get } as LoadsT
}
export default useLoading
