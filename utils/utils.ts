


export type empty = null|undefined
export const isEmpty = <T>(o: empty|T): o is empty => o===null || o===undefined