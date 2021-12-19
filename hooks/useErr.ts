import {empty} from "../utils/utils";
import {useState} from "react";


type Errs = {
    get: (errCode: string)=>string|empty
    set: (errCode: string, msg?: string|empty)=>void
    clear: (errCode: string)=>void
    clearMulti: (errCodes: string[])=>void
    clearAll: ()=>void
    last: ()=>string|empty
    lastS: ()=>string
}
const useErr = (): Errs => {
    const [errMap, setErrMap] = useState(new Map<string,string|empty>())

    const [change, setChange] = useState({}) // to make react rerender because Map is not changed
    const makeChange = ()=>setChange({})

    let lastErr: string|empty


    const set = (errCode: string, msg?: empty|string) => {
        lastErr = msg
        if (errMap.get(errCode)!==msg){
            errMap.set(errCode, msg)
            makeChange()
        }
    }
    const clear = (errCode: string): void => {
        if (errMap.size!==0){
            errMap.clear()
            lastErr=undefined
            makeChange()
        }
    }
    const clearAll = (): void => {
        lastErr=undefined;
        if (errMap.size!==0){
            errMap.clear();
            makeChange()
        }
    }


    const clearMulti = (errCodes: string[]) => errCodes.forEach(clear)
    const get = (errCode: string) => lastErr=errMap.get(errCode)
    const last = () => lastErr
    const lastS = () => lastErr ?? ""

    return { get,set,clear,clearMulti,clearAll,last,lastS }
}
export default useErr