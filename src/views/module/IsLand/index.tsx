import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { IsLandWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入水面
import { Water } from 'three/examples/jsm/objects/Water2'

interface IProps {
  children?: ReactNode
}

const IsLand: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.加载天空图
    initSky()
    // 3.创建水面
    initWater()
    // // 4.加载模型
    initModel()
    // 5.添加光照
    initLight()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    // 销毁
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /**
   * 初始化three
   */
  const initThree = () => {
    // 0.初始化性能监视器
    status = new Status()
    statusRef.current?.appendChild(status.dom)

    // 1.创建场景
    scene = new THREE.Scene()

    // 2.创建相机
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000)
    // 设置相机的位置
    camera.position.set(-50, 50, 150)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // 3.初始化渲染器
    renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement,
      antialias: true,
      // 对数深度缓冲区
      logarithmicDepthBuffer: true
    })
    // 设置设备像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置渲染画布的大小
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 4.初始化控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false

    // 5.渲染
    animate()
  }

  /**
   * 加载天空背景
   */
  const initSky = () => {
    const texture = new THREE.TextureLoader().load('./images/sky/sky.jpg')
    const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: texture
    })
    skyGeometry.scale(1, 1, -1)
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(sky)
  }

  /**
   * 创建水面
   */
  const initWater = () => {
    const waterGeometry = new THREE.CircleGeometry(300, 32)
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(0, 1),
      scale: 1
    })
    water.position.y = 3
    water.rotation.x = -Math.PI / 2
    scene.add(water)
  }

  /**
   * 加载模型
   */
  const initModel = () => {
    const loader = new GLTFLoader()
    loader.load('./models/island.glb', (gltf) => {
      scene.add(gltf.scene)
      setIsLoading(false)
    })
  }

  /**
   * 初始化光照
   */
  const initLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(-100, 100, 10)
    scene.add(light)
    const ambient = new THREE.AmbientLight(0x444444, 1)
    scene.add(ambient)
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

  /**
   * 渲染
   */
  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // 更新性能监视器
    status && status.update()
    // 更新相机控制器
    controls && controls.update()
  }

  return (
    <IsLandWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </IsLandWrapper>
  )
}

export default memo(IsLand)
