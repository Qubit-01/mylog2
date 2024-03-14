// 深层次合并对象
export function deepMerge(
  target: { [attrName: string]: any },
  source: { [attrName: string]: any }
) {
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

// 获取链接后的参数(不带#号)
// export function getQueryString() {
//   let href = window.location.href
//   let hash = href.slice(href.lastIndexOf('#') + 1, href.length), i
//   let a = {}
//   for (const s of hash.split('&')) a[s.split('=')[0]] = s.split('=')[1]
//   return a;
// }

// 给一个元素id，滚动条跳转
// export function goAnchor(e: string) {
//   const el = document.querySelector('#' + e)
//   if (el)
//     el.scrollIntoView({
//       behavior: 'smooth',
//       block: 'center',
//       inline: 'nearest',
//     })
// }

// 获取URL参数
// export function getQueryAttr(variable: string) {
//   let vars = window.location.href.substring(window.location.href.indexOf("?") + 1).split("&");
//   for (const value of vars) {
//     if (value.split("=")[0] == variable) return value.split("=")[1];
//   }
//   return undefined
// }

// 将字符串传入剪贴板
export function writeClipboard(str: string) {
  const clipboardObj = navigator.clipboard
  if (!clipboardObj) return Promise.reject('浏览器不支持 navigator.clipboard')
  return clipboardObj.writeText(str)
}

/**
 * Base64 编码
 * @param str
 */
export function Encode64(str: string) {
  // 编码
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        // @ts-ignore
        return String.fromCharCode('0x' + p1)
      }
    )
  )
}

/**
 * Base64 解码
 * @param str
 * @returns
 */
export function Decode64(str: string) {
  // 解码
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}
