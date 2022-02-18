import {StringBuilder} from "./StringBuilder";
import {Formatter} from "./Formatter";
import {Optional} from "./utils";






/*type NumFormatMultiProps = {
    intDelim: (DelimFormat|null)[]
    fracDelim: (DelimFormat|null)[]

    point: string[]

    nan: string[]
    inf: string[]

    prefix: (string|null)[]
    suffix: (string|null)[]
}*/

type NumFormatProps = {
    intDelim: DelimFormat|null
    fracDelim: DelimFormat|null

    point: string

    round: RoundType|null

    minIntChars: number
    minFracChars: number

    nan: string
    inf: string

    prefix: string|null
    suffix: string|null
}
type NumFormatPropsOptional = Optional<NumFormatProps>

type DelimFormat = {
    delim: string,
    step: number
}

type RoundType = {
    scale: number
    mode: "half-up"|"up"|"down" // todo more round modes
}



export class NumFormat implements Formatter {
    /*public static readonly defaultInFormat: NumFormatMultiProps = {
        intDelim: [null, {delim:" ",step:3}],
        fracDelim:  [null, {delim:" ",step:3}],

        point: [".",","],

        nan: ["nan","NaN","NAN"],
        inf: ["inf","infinity","Infinity","∞"],

        prefix: [null],
        suffix: [null]
    } as const*/
    public static readonly defaultOutFormat: NumFormatProps = {
        intDelim: null,
        fracDelim: null,

        point: ".",

        round: { scale: 8, mode: "half-up" },

        minIntChars: 1,
        minFracChars: 0,

        nan: "nan",
        inf: "∞",

        prefix: null,
        suffix: null
    } as const

    private static readonly numberPattern = /^(?<minus>-)?((?<inf>Infinity)|(?<nan>NaN)|((?<int>\d+)(\.(?<frac>\d+))?(e(?<exp>[-+]?\d+))?))$/


    //private inMultiFormat: NumFormatMultiProps = {...NumFormat.defaultInFormat}
    private outFormat: NumFormatProps = {...NumFormat.defaultOutFormat}



    /*public setInFormat(format?: NumFormatMultiProps){

    }*/
    public setFormat(format?: NumFormatPropsOptional){
        if (!format) this.outFormat = {...NumFormat.defaultOutFormat}
        else this.outFormat = {...this.outFormat, ...format}
    }
    public resetFormat(){
        this.outFormat  = {...NumFormat.defaultOutFormat}
    }



    private originalValue: any = undefined
    private type: "number"|"inf"|"nan"|"zero"|null = null
    private isNegative = false
    private digits: string = "" // содержит разряды числа (от левого ненулевого до правого ненулевого, если число 0, то digits = "")
    private ptIdx: number = 0 // точка ставится перед digits[ptIdx]


    // todo make any value
    public setValue(val: number|bigint){
        this.reset()
        this.originalValue = val
        this.analyze()
        return this
    }

    public reset(){
        this.originalValue = undefined
        this.type = null
        this.isNegative = false
        this.digits = ""
        this.ptIdx = 0
    }

    private analyze(){
        let pattern
        if (typeof this.originalValue === 'number' || typeof this.originalValue === 'bigint'){
            pattern = NumFormat.numberPattern
            const val = this.originalValue+""

            const matchResult = val.match(pattern)
            if (matchResult && matchResult.groups){
                this.isNegative = !!matchResult.groups["minus"]

                if (matchResult.groups["inf"]) {
                    this.type = "inf"
                } else if (matchResult.groups["nan"]) {
                    this.type = "nan"
                } else {
                    let int = matchResult.groups["int"]
                    let frac = matchResult.groups["frac"]
                    let exp = +matchResult.groups["exp"]

                    let ptIdx = int.length

                    let digits = int
                    if (frac) digits += frac

                    let s = 0
                    for (let i = 0; i < digits.length; i++) {
                        if (digits.charAt(i)==="0") s=i+1
                        else break
                    }
                    let e = digits.length
                    for (let i = digits.length-1; i >= s; i--) {
                        if (digits.charAt(i)==="0") e=i
                        else break
                    }
                    digits = digits.substring(s,e)
                    ptIdx-=s
                    if (exp) ptIdx+=exp

                    if (digits.length===0){
                        this.type = "zero"
                    } else {
                        this.type = "number"
                        this.digits = digits
                        this.ptIdx = ptIdx
                    }
                }
            }
        } else {
            // todo newRegexp for string representations of numbers
        }
    }



    public format(){
        let t = this.type

        if (t===null) return this.originalValue
        else {
            const f = this.outFormat
            let isNeg = this.isNegative

            const sb = new StringBuilder()

            const ds = this.digits
            let ptIdx = this.ptIdx

            if (t==="number" || t==="zero"){

                sb.append(ds)

                if (f.round){
                    let e
                    switch (f.round.mode){
                        case "half-up":
                            e = ptIdx+f.round.scale
                            if (e<0) sb.clear()
                            else if (e<sb.len()){
                                const de = sb.charAt(e)
                                if (de>="5") for (e--; ;e--) {
                                    if (e!==-1){
                                        const d = sb.charAt(e)
                                        if (d!=="9")  {
                                            sb.replaceLen(e, 1, +d+1+"")
                                            break
                                        }
                                    } else {
                                        sb.first("1")
                                        ptIdx++
                                        e++
                                        break
                                    }
                                } else for (e--; e!==-1 && sb.charAt(e)==="0"; e--){}
                                e++
                                sb.remove(e)
                            }
                            break
                        case "up":
                            e = ptIdx+f.round.scale
                            if (e<0) sb.clear()
                            else if (e<sb.len()){
                                const de = sb.charAt(e)
                                if (de>="1") for (e--; ;e--) {
                                    if (e!==-1){
                                        const d = sb.charAt(e)
                                        if (d!=="9")  {
                                            sb.replaceLen(e, 1, +d+1+"")
                                            break
                                        }
                                    } else {
                                        sb.first("1")
                                        ptIdx++
                                        e++
                                        break
                                    }
                                } else for (e--; e!==-1 && sb.charAt(e)==="0"; e--){}
                                e++
                                sb.remove(e)
                            }
                            break
                        case "down":
                            e = ptIdx+f.round.scale
                            if (e<0) sb.clear()
                            else if (e<sb.len()){
                                for (e--; e!==-1 && sb.charAt(e)==="0"; e--){}
                                e++
                                sb.remove(e)
                            }
                            break
                    }

                    if (sb.isEmpty()){
                        t = 'zero'
                        ptIdx = 0
                    }

                }
            }

            if (t==='number' || t==='zero'){
                const padStartCnt = f.minIntChars-ptIdx, padEndCnt = f.minFracChars-(sb.len()-ptIdx)

                if (padStartCnt>0){
                    sb.first("0".repeat(padStartCnt))
                    ptIdx+=padStartCnt
                }
                if (padEndCnt>0) sb.append("0".repeat(padEndCnt))

                if (ptIdx<sb.len()) sb.insert(ptIdx,f.point)

                if (f.fracDelim) for (let i = ptIdx+f.point.length+f.fracDelim.step; i < sb.len(); i+=f.fracDelim.step+f.fracDelim.delim.length) {
                    sb.insert(i,f.fracDelim.delim)
                }
                if (f.intDelim) for (let i = ptIdx-f.intDelim.step; i > 0; i-=f.intDelim.step) {
                    sb.insert(i,f.intDelim.delim)
                }
            } else if (t==='inf') sb.append(f.inf)
            else if (t==='nan') sb.append(f.nan)


            if (t=="nan" || t==="zero") isNeg = false
            if (isNeg) sb.first("-")

            if (f.prefix) sb.first(f.prefix)
            if (f.suffix) sb.append(f.suffix)

            return sb.toString()
        }
    }


}



/*
    todo
     попробовать хранить значимые разряды как:
     1) number[] - массив цифр
     2) bigint
     3) массив цифр (кроме нулей) + массив их степеней десятки
 */

/*
    todo
     parse format with out format
     Set instead of array in parse format
     разделить свойства, которые приведут к перекомпилированию регулярки от остальных при смене parse format
 */

// todo отображение и символы +/-
// todo если число без разделителей может быть
// todo
// todo отдельная интерпретация нуля как какой-нибудь другой символ
// todo вместо обязательных нулей в начале/конце вкатать какой-нибудь иной символ

// todo умножение на степень десятки (сдвиг точки)
// todo full support exponent format




/*
    tests:

    {
    f.setFormat({
        intDelim: {delim:"\"", step: 3},
        fracDelim: {delim:"'", step: 2},

        point: ".",

        round: {scale: 1, mode: "half-up"},

        minIntChars: 1,
        minFracChars: 0,

        nan: "nan",
        inf: "∞",

        prefix: null,
        suffix: "°C"
    })
    console.log("=======>>>>>>>")
    let v
    console.log((v=0)+": "+ f.setValue(v).format())
    console.log((v=-0)+": "+ f.setValue(v).format())
    console.log((v=1)+": "+ f.setValue(v).format())
    console.log((v=1.1)+": "+ f.setValue(v).format())
    console.log((v=-1.1)+": "+ f.setValue(v).format())
    console.log((v=0.21215)+": "+ f.setValue(v).format())
    console.log((v=0.0002)+": "+ f.setValue(v).format())
    console.log((v=0.03e+30)+": "+ f.setValue(v).format()) //
    console.log((v=1214564.4564654)+": "+ f.setValue(v).format())
    console.log((v=3e30)+": "+ f.setValue(v).format())
    console.log((v=+90000)+": "+ f.setValue(v).format())
    console.log((v=.2154)+": "+ f.setValue(v).format())
    console.log((v=.5655)+": "+ f.setValue(v).format())
    console.log((v=-.08754)+": "+ f.setValue(v).format())
    console.log((v=-1546546500000.087554564540000)+": "+ f.setValue(v).format())
    console.log((v=999999.99)+": "+ f.setValue(v).format())
    // bigint не поддерживается в React Native
    //console.log((v=1234567890123456789012345678901234567890n)+": "+ f.setValue(v).format())
    console.log((v=NaN)+": "+ f.setValue(v).format())
    console.log((v=+Infinity)+": "+ f.setValue(v).format())
    console.log((v=-Infinity)+": "+ f.setValue(v).format())
    console.log("<<<<<<<=======")
}
 */


