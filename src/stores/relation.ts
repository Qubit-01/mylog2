import { getRelations } from '@/api/relation'
import type { Relation } from '@/types'
import type { Node, Edge } from 'vis-network/declarations/network/Network'

/**
 * 应该只获取一次数据，然后只计算一次nodes和edges，然后让network渲染
 *
 * 操作数据应该在这里操作，然后通知network操作（回调）
 */
export const useRelationStore = defineStore('relation', () => {
  const loading = ref(true)

  /** 获取的原始全部relations */
  const listAll = ref<Relation[]>([])

  const getListAll = new Promise<Relation[]>((resolve, reject) => {
    console.info('🐤getRelations 全局只执行一次')
    loading.value = true
    getRelations({}).then(data => {
      // data.forEach() // 预处理
      listAll.value = data
      loading.value = false
      resolve(data)
    })
  })

  const getNetworkData = getListAll.then(relations => {
    const groups = ['亲戚']
    const nodes: Node[] = []
    const edges: Edge[] = []
    for (const r of relations) {
      // 归纳组节点
      if (!Number(r.from) && groups.indexOf(r.from) == -1) {
        groups.push(r.from)
        nodes.push({
          id: r.from,
          label: r.from,
          color: '#ddd',
          shape: 'ellipse',
          font: { size: 20 },
        })
        edges.push({ from: 0, to: r.from })
      }
      // 解析人员节点
      nodes.push({
        id: r.id,
        label: r.name,
        group: r.from,
      })
      edges.push({
        from: r.from,
        to: r.id,
        label: r.info.label,
      })
    }
    return { nodes, edges, groups }
  })

  const getNodes = (nodes: Node[] = []) =>
    getNetworkData.then(({ nodes: ns }) => [...nodes, ...ns])
  const getEdges = (edges: Edge[] = []) =>
    getNetworkData.then(({ edges: es }) => [...edges, ...es])

  return { loading, listAll, getListAll, getNetworkData, getNodes, getEdges }
})
