/**
 * 环境变量
 */
type EnvVar = {
  webURL: string
  baseURL: string
  Bucket: string
  Region: string
  BucketURL: string
}

export const Env: EnvVar = {
  // webURL: "https://mylog.cool",
  webURL: "https://localhost",
  baseURL: "",
  Bucket: "bit-1310383539", /* 存储桶 */
  Region: "ap-chengdu", /* 所在地域 */
  BucketURL: ""
}
Env.baseURL = Env.webURL + ":8081"
Env.BucketURL = "https://" + Env.Bucket + ".cos." + Env.Region + ".myqcloud.com"

export default Env