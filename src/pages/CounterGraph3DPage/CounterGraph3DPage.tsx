import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import * as THREE from 'three'

interface GraphNode {
  id: string
  name: string
  imageUrl: string
  x?: number
  y?: number
  z?: number
  fx?: number | undefined
  fy?: number | undefined
  fz?: number | undefined
}

interface GraphLink {
  source: string
  target: string
}

export default function CounterGraph3DPage() {
  const { ninjas, counters } = useData()
  const fgRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false) // 是否加载3D图

  const lastClickTimeRef = useRef<number>(0)
  const lastClickNodeRef = useRef<string | null>(null)

  // 全量节点和连线
  const { allNodes, allLinks } = useMemo(() => {
    const relevantIds = new Set<string>()
    counters.forEach(c => {
      relevantIds.add(c.ninjaId)
      c.counterNinjaIds.forEach(id => relevantIds.add(id))
    })

    const nodes: GraphNode[] = []
    const nodeMap = new Map<string, GraphNode>()
    ninjas.forEach(ninja => {
      if (relevantIds.has(ninja.id)) {
        const node = { id: ninja.id, name: ninja.name, imageUrl: ninja.imageUrl }
        nodes.push(node)
        nodeMap.set(ninja.id, node)
      }
    })

    const links: GraphLink[] = []
    counters.forEach(c => {
      const target = nodeMap.get(c.ninjaId)
      if (!target) return
      c.counterNinjaIds.forEach(sourceId => {
        const source = nodeMap.get(sourceId)
        if (source) links.push({ source: sourceId, target: c.ninjaId })
      })
    })

    return { allNodes: nodes, allLinks: links }
  }, [ninjas, counters])

  // 相关节点集合
  const relatedNodeIds = useMemo(() => {
    if (!focusNodeId) return new Set<string>()
    const ids = new Set<string>()
    ids.add(focusNodeId)
    counters.forEach(c => {
      if (c.ninjaId === focusNodeId) {
        c.counterNinjaIds.forEach(id => ids.add(id))
      }
      if (c.counterNinjaIds.includes(focusNodeId)) {
        ids.add(c.ninjaId)
      }
    })
    return ids
  }, [focusNodeId, counters])

  // 区分克制方（counter）和被克制方（countered）
  const { counterPartIds, counteredPartIds } = useMemo(() => {
    if (!focusNodeId) return { counterPartIds: [], counteredPartIds: [] }
    const cpart: string[] = []
    const cparted: string[] = []
    counters.forEach(c => {
      if (c.ninjaId === focusNodeId) {
        cpart.push(...c.counterNinjaIds)
      }
      if (c.counterNinjaIds.includes(focusNodeId)) {
        cparted.push(c.ninjaId)
      }
    })
    return { counterPartIds: Array.from(new Set(cpart)), counteredPartIds: Array.from(new Set(cparted)) }
  }, [focusNodeId, counters])

  // 聚焦时过滤连线
  const links = useMemo(() => {
    if (!focusNodeId) return allLinks
    return allLinks.filter(l => {
      const srcId = typeof l.source === 'string' ? l.source : (l.source as any).id
      const tgtId = typeof l.target === 'string' ? l.target : (l.target as any).id
      return (srcId === focusNodeId && relatedNodeIds.has(tgtId)) ||
             (tgtId === focusNodeId && relatedNodeIds.has(srcId))
    })
  }, [focusNodeId, allLinks, relatedNodeIds])

  // 聚焦/取消聚焦时的节点位置安排、摄像机移动与力配置
  useEffect(() => {
    if (!fgRef.current || !enabled) return
    const fg = fgRef.current

    if (focusNodeId) {
      const targetNode = allNodes.find(n => n.id === focusNodeId)
      if (!targetNode || targetNode.x === undefined) return

      const centerX = targetNode.x
      const centerY = targetNode.y || 0
      const centerZ = targetNode.z || 0

      const topNodes = counterPartIds.map(id => allNodes.find(n => n.id === id)!).filter(Boolean)
      const bottomNodes = counteredPartIds.map(id => allNodes.find(n => n.id === id)!).filter(Boolean)

      const spacing = 35
      const verticalOffset = 60
      const camDistance = 250

      topNodes.forEach((node, i) => {
        const offsetX = (i - (topNodes.length - 1) / 2) * spacing
        node.fx = centerX + offsetX
        node.fy = centerY + verticalOffset
        node.fz = centerZ
      })

      bottomNodes.forEach((node, i) => {
        const offsetX = (i - (bottomNodes.length - 1) / 2) * spacing
        node.fx = centerX + offsetX
        node.fy = centerY - verticalOffset
        node.fz = centerZ
      })

      targetNode.fx = centerX
      targetNode.fy = centerY
      targetNode.fz = centerZ

      fg.cameraPosition(
        { x: centerX, y: centerY, z: centerZ + camDistance },
        { x: centerX, y: centerY, z: centerZ }
      )

      const sim = fg.d3Force?.()
      if (sim) {
        const charge = sim.force('charge')
        const link = sim.force('link')
        if (charge) charge.strength(-200)
        if (link) link.strength(0)
        sim.force('collision', null)
        sim.alpha(1).restart()
      }
    } else {
      allNodes.forEach(node => {
        node.fx = undefined
        node.fy = undefined
        node.fz = undefined
      })
      fg.cameraPosition({ x: 0, y: 0, z: 400 })
      const sim = fg.d3Force?.()
      if (sim) {
        const charge = sim.force('charge')
        const link = sim.force('link')
        if (charge) charge.strength(-200)
        if (link) link.strength(0.3)
        sim.force('collision', null)
        sim.alpha(1).restart()
      }
    }
  }, [focusNodeId, allNodes, counterPartIds, counteredPartIds, enabled])

  // 窗口大小调整
  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - 80 })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 节点精灵
  const getNodeSprite = useCallback(
    (node: GraphNode) => {
      const isFocused = !!focusNodeId
      const isRelated = isFocused && relatedNodeIds.has(node.id)
      const scale = isRelated ? 20 : 7

      const img = new Image()
      img.src = node.imageUrl
      const texture = new THREE.Texture(img)
      img.onload = () => texture.needsUpdate = true
      img.onerror = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#e74c3c'
        ctx.fillRect(0, 0, 64, 64)
        ctx.font = 'bold 14px Arial'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.fillText(node.name.slice(0, 2), 32, 32)
        texture.image = canvas
        texture.needsUpdate = true
      }

      const material = new THREE.SpriteMaterial({
        map: texture,
        opacity: isFocused ? (isRelated ? 1 : 0.35) : 1,
        transparent: true,
      })

      if (isFocused && !isRelated) {
        material.color.set('#888888')
      }

      const sprite = new THREE.Sprite(material)
      sprite.scale.set(scale, scale, 1)
      return sprite
    },
    [focusNodeId, relatedNodeIds]
  )

  const handleNodeClick = useCallback((node: GraphNode) => {
    const now = Date.now()
    const lastTime = lastClickTimeRef.current
    const lastNode = lastClickNodeRef.current
    if (lastNode === node.id && now - lastTime < 300) {
      setFocusNodeId(prev => (prev === node.id ? null : node.id))
      lastClickTimeRef.current = 0
      lastClickNodeRef.current = null
    } else {
      lastClickTimeRef.current = now
      lastClickNodeRef.current = node.id
    }
  }, [])

  const resetFocus = useCallback(() => {
    setFocusNodeId(null)
  }, [])

  if (allNodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#1a1a2e]">
        <p>暂无克制关系数据，请先到数据管理页面配置</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div className="p-4 text-white text-center">
        <h1 className="text-3xl font-bold text-primary">3D 克制关系图</h1>
        <p className="text-sm text-gray-300">
          {focusNodeId
            ? `聚焦于：${allNodes.find(n => n.id === focusNodeId)?.name || ''}`
            : '红色箭头从克制方指向被克制方 | 拖拽旋转/缩放 | 双击忍者聚焦'}
        </p>
      </div>

      {/* 如果未启用，显示加载按钮 */}
      {!enabled ? (
        <div className="flex-1 flex items-center justify-center">
          <Button size="lg" onClick={() => setEnabled(true)} className="gap-2">
            加载 3D 克制关系图
          </Button>
        </div>
      ) : (
        <>
          {focusNodeId && (
            <div className="absolute bottom-6 left-6 z-10">
              <Button variant="secondary" size="sm" onClick={resetFocus}>
                返回全局视图
              </Button>
            </div>
          )}

          <div className="flex-1">
            {dimensions.width > 0 && (
              <ForceGraph3D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={{ nodes: allNodes, links }}
                nodeLabel="name"
                nodeRelSize={0}
                nodeThreeObjectExtend={true}
                nodeThreeObject={(node: any) => getNodeSprite(node as GraphNode)}
                onNodeClick={handleNodeClick}
                linkWidth={focusNodeId ? 1.5 : 0.6}
                linkColor={focusNodeId ? 'rgba(255, 80, 80, 0.9)' : 'rgba(255,255,255,0.4)'}
                linkOpacity={0.8}
                linkDirectionalArrowLength={focusNodeId ? 12 : 3.5}
                linkDirectionalArrowRelPos={0.95}
                linkDirectionalArrowColor={() => focusNodeId ? 'rgba(255, 30, 30, 1)' : 'rgba(255, 60, 60, 0.9)'}
                linkDirectionalParticles={focusNodeId ? 3 : 2}
                linkDirectionalParticleWidth={1.5}
                linkDirectionalParticleSpeed={0.008}
                linkDirectionalParticleColor={() => focusNodeId ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 100, 100, 0.9)'}
                backgroundColor="#1a1a2e"
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}