


export type empty = null|undefined
export const isEmpty = <T>(o: empty|T): o is empty => o===null || o===undefined

// сделать каждое свойство переданного типа T не readonly и опциональным
export type Optional<T> = {
    -readonly [Prop in keyof T]?: T[Prop]
}