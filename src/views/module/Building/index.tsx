import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { BuildingWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控件
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入DRACOLoader解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入后器效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// three框架本身自带效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
// 添加视频平面
import modifyCityMaterial from './modify/modifyCityMaterial.js'
import VideoPlane from './modify/VideoPlane'

interface IProps {
  children?: ReactNode
}

const Building: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Status,
    controls: OrbitControls,
    buildingMaterail: THREE.MeshBasicMaterial

  let effectComposer: EffectComposer, unrealBloomPass: UnrealBloomPass

  useEffect(() => {
    init()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    // 销毁
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function init() {
    // 0.status
    status = new Status()
    statusRef.current?.appendChild(status.dom)
    // 1.创建场景
    scene = new THREE.Scene()
    // 2.创建相机
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    // 设置相机的位置
    camera.position.set(0, 1, 4)
    // 3.初始化渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true // 允许投射动态阴影
    renderer.outputEncoding = THREE.sRGBEncoding
    // renderer.physicallyCorrectLights = true;
    // 色调映射（很重要）
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 色调映射的曝光级别
    renderer.toneMappingExposure = 1
    // 定义渲染器是否应对对象进行排序。默认是true.
    renderer.sortObjects = true
    // 将渲染的画布添加到容器中
    canvasRef.current?.appendChild(renderer.domElement)
    // 4.初始化控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    // 修改建筑物的材质
    buildingMaterail = new THREE.MeshBasicMaterial({
      color: 0x024144,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      wireframe: true
    })
    modifyCityMaterial(buildingMaterail)
    // 5.加载模型
    initModel()
    // 6.后处理
    initEffect()
    // 7.创建光阵
    initLightPlane()
    // 8.渲染
    animate()
  }

  function initModel() {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/gltf/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load('./models/building-min.glb', (gltf: any) => {
      const model = gltf.scene
      model.scale.set(0.01, 0.01, 0.01)
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.material = buildingMaterail
        }
      })
      scene.add(model)
      setIsLoading(false)
    })
  }

  // 创建后处理效果
  function initEffect() {
    // 合成器
    effectComposer = new EffectComposer(renderer)
    effectComposer.setSize(window.innerWidth, window.innerHeight)

    // 添加渲染通道
    const renderPass = new RenderPass(scene, camera)
    effectComposer.addPass(renderPass)

    // 发光效果
    unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    effectComposer.addPass(unrealBloomPass)
  }

  // 创建光阵
  function initLightPlane() {
    const size = new THREE.Vector2(6.4, 3.6)
    const videoPlane = new VideoPlane('./video/zp2.mp4', size)
    videoPlane.mesh.rotation.x = -Math.PI / 2

    unrealBloomPass.threshold = 0.5
    unrealBloomPass.strength = 0.6
    unrealBloomPass.radius = 0.5
    controls.autoRotate = true

    scene.add(videoPlane.mesh)
  }

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    controls.update()
    effectComposer.render()
  }

  /**
   * 监听窗口的变化
   */
  const handleResize = () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.aspect = aspect
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
    // 重置设置画布大小
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  return (
    <BuildingWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <div ref={canvasRef}></div>
    </BuildingWrapper>
  )
}

export default memo(Building)
