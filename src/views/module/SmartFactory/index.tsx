import React, { memo, useState, useRef, useEffect } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { SmartFactoryWrapper } from './style'
// 导入组件
import { Spin, Button, Flex } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

interface IProps {
  children?: ReactNode
}

const SmartFactory: FC<IProps> = () => {
  // 是否展示loading
  const [isLoading, setIsLoading] = useState(true)
  // 性能监视器ref
  const statusRef = useRef<HTMLDivElement | null>(null)
  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls,
    mixer: THREE.AnimationMixer,
    group: THREE.Group

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.添加光照
    initLights()
    // 3.设置dpr背景图
    initHDR()
    // 4.加载模型
    loadModel()

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
    camera = new THREE.PerspectiveCamera(30, aspect, 50, 3000)
    camera.position.set(202, 123, 125)
    camera.lookAt(0, 0, 0)

    // 3.创建webgl渲染器
    renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement,
      antialias: true // 抗锯齿
    })
    // 设置设备像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置输出画布大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置颜色空间
    renderer.outputEncoding = THREE.sRGBEncoding

    // 4.初始化相机控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    // 开启缓动动画
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = true
    // 内外移动距离
    controls.maxDistance = 400
    controls.minDistance = 100
    // 最大仰角
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI / 2

    // 4.渲染
    animate()
  }

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

  const initLights = () => {
    // 1.环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    // 2.平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(100, 60, 50)
    scene.add(directionalLight)
  }

  const loadModel = () => {
    const loader = new GLTFLoader()
    loader.load('./models/factory.glb', (gltf: any) => {
      // 关闭loading
      setIsLoading(false)
      // 播放关键帧动画
      mixer = new THREE.AnimationMixer(gltf.scene)
      // 获取gltf.animations[0]的第一个clip动画对象
      const clipAction = mixer.clipAction(gltf.animations[0])
      // 播放动画
      clipAction.play()
      // 向场景中添加模型
      scene.add(gltf.scene)
      // 创建精灵模拟下雨过程
      initRain()
    })
  }

  const initRain = () => {
    const texture = new THREE.TextureLoader().load('./images/sprite/rain.png')
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture
    })
    group = new THREE.Group()
    scene.add(group)
    const N = 16000
    for (let i = 0; i < N; i++) {
      const sprite = new THREE.Sprite(spriteMaterial)
      group.add(sprite)
      // 设置精灵模型位置，在长方体空间中随机分布
      const x = 1000 * (Math.random() - 0.5)
      const y = 600 * Math.random()
      const z = 1000 * (Math.random() - 0.5)
      sprite.position.set(x, y, z)
    }
  }

  const clock = new THREE.Clock()
  const animate = () => {
    const delta = clock.getDelta()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // 更新性能监视器
    status && status.update()
    // 更新相机控制器
    controls && controls.update()
    // 更新动画时间
    mixer && mixer.update(delta)
    // 更新雨滴的位置
    if (group) {
      group.children.forEach((sprite) => {
        // 雨滴的y坐标每次减t*60
        sprite.position.y -= 60 * delta
        if (sprite.position.y < 0) {
          sprite.position.y = 600
        }
      })
    }
  }

  // 监听窗口的变化
  const handleResize = () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.aspect = aspect
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
    // 重新设置输出画布大小
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  return (
    <SmartFactoryWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </SmartFactoryWrapper>
  )
}

export default memo(SmartFactory)
