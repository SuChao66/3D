import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { RobotWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入DRACOLoader解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入镜像工具
// Reflector 是 three.js 中的一个类，用于创建反射效果的对象。它继承自 Mesh，
// 可以添加到场景中作为一个可渲染的物体。
// constructor(geometry?: BufferGeometry, options?: ReflectorOptions)
import { Reflector } from 'three/examples/jsm/objects/Reflector'

interface IProps {
  children?: ReactNode
}

const Metahuman: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls,
    robot: THREE.Object3D

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.设置dpr背景图
    initHDR()
    // 3.加载模型
    loadModel()
    // 4.初始化光照
    initLights()
    // 5.初始化光阵
    initGuangZhen()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    // 销毁
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const initThree = () => {
    // 0.初始化性能监视器
    status = new Status()
    statusRef && statusRef.current?.appendChild(status.dom)

    // 1.创建场景
    scene = new THREE.Scene()

    // 2.创建相机
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.set(0, 1.5, 6)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // 3.创建webgl渲染器
    renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement,
      antialias: true // 抗锯齿
    })
    // 设置设备像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置渲染画布的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置色调映射
    renderer.toneMapping = THREE.LinearToneMapping
    // 设置色调映射的曝光级别
    renderer.toneMappingExposure = 2
    // 设置使用阴影贴图
    renderer.shadowMap.enabled = true
    // 定义阴影贴图类型
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 4.初始化相机控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    // 开启缓动动画
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = true
    // 最大仰角
    controls.minPolarAngle = 1.36
    controls.maxPolarAngle = 1.5
    // 内外移动距离
    controls.maxDistance = 8
    controls.minDistance = 4

    // 4.渲染
    animate()
  }

  /**
   * 加载hdr背景图
   */
  const initHDR = () => {
    // 初始化hdr加载器
    const hdrLoader = new RGBELoader()
    hdrLoader.load('./textures/sky12.hdr', (texture) => {
      // 设置图像将如何应用到物体（对象）上，像圆一样四周环绕整个场景
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.background = texture
      scene.environment = texture
    })
  }

  /**
   * 加载模型
   */
  const loadModel = () => {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    // 设置DRACOLoader的解压路基
    dracoLoader.setDecoderPath('./draco/gltf/')
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load('./models/robot.glb', (gltf) => {
      robot = gltf.scene
      scene.add(robot)
      // 关闭loading
      setIsLoading(false)
    })
  }

  /**
   * 初始化光照
   */
  function initLights() {
    // 添加直线光
    const light1 = new THREE.DirectionalLight(0xffffff, 0.3)
    light1.position.set(0, 10, 10)
    const light2 = new THREE.DirectionalLight(0xffffff, 0.3)
    light1.position.set(0, 10, -10)
    const light3 = new THREE.DirectionalLight(0xffffff, 0.8)
    light1.position.set(10, 10, 10)
    scene.add(light1, light2, light3)
  }

  /**
   * 初始化光阵
   * 使用视频纹理
   */
  function initGuangZhen() {
    // 创建视频
    const video = document.createElement('video')
    video.src = './video/zp2.mp4'
    video.loop = true
    video.muted = true
    video.play()
    const videoTexture = new THREE.VideoTexture(video)
    const videoGeoPlane = new THREE.PlaneGeometry(8, 4.5)
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture, // 颜色纹理
      transparent: true, // 透明
      side: THREE.DoubleSide, // 双面渲染
      alphaMap: videoTexture // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
    })
    const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial)
    videoMesh.rotation.x = -Math.PI / 2
    videoMesh.position.y = 0.2
    scene.add(videoMesh)

    // 添加镜面反射
    const reflectorGeometry = new THREE.PlaneGeometry(100, 100)
    const refletorPlane = new Reflector(reflectorGeometry, {
      textureWidth: window.innerWidth, // 反射纹理的宽度，单位是像素，默认值是 512
      textureHeight: window.innerHeight, // 反射纹理的高度，单位是像素，默认值是 512
      color: 0x7f7f7f // 反射面的颜色，可以是一个 CSS 颜色字符串或是一个 three.js 的 Color 对象，默认值是 0x7F7F7F
    })
    refletorPlane.rotation.x = -Math.PI / 2
    scene.add(refletorPlane)
  }

  /**
   * 渲染动画
   */
  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // 更新性能监视器
    status && status.update()
    // 更新相机控制器
    controls && controls.update()
    // 旋转robot
    robot && robot.rotateY(-Math.PI / 360)
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
    <RobotWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </RobotWrapper>
  )
}

export default memo(Metahuman)
