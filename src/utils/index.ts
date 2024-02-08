// 深层次合并对象
export function deepMerge(target: {[attrName: string]: any}, source: {[attrName: string]: any}) {
  for (const key in source) {
    if (source[key] instanceof Object) {
      if (!target[key]) Object.assign(target, { [key]: {} })
      deepMerge(target[key], source[key])
    } else {
      Object.assign(target, { [key]: source[key] })
    }
  }
  return target
}