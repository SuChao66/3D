import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HappyNewYearWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入FontLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入DRACOLoader解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入shader
import vertexShader from './shader/vertexShader'
import fragmentShader from './shader/fragmentShader'

interface IProps {
  children?: ReactNode
}

const HappyNewYear: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  // 使用useRef缓存数据
  const showTextRef = useRef<boolean>(false)
  const clock = new THREE.Clock()
  let value = 0

  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Status,
    controls: OrbitControls,
    material: THREE.ShaderMaterial

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.设置背景
    initBg()
    // 3.加载模型
    initModel()
    // 4.添加光照
    initLight()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)
    // 销毁
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    // 6.渲染
    animate()
  }, [showTextRef])

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
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.set(0, 0, 3)
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

    // 4.初始化相机控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = true
  }

  /**
   * 设置背景
   */
  const initBg = () => {
    const texture = new THREE.TextureLoader().load('./images/sky/sky3.jpg')
    scene.background = texture
    scene.environment = texture
  }

  /**
   * 加载模型
   */
  const initModel = () => {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    // 设置DRACOLoader的解压路径
    dracoLoader.setDecoderPath('./draco/gltf/')
    // 设置gltfLoader的DRACOLoader
    gltfLoader.setDRACOLoader(dracoLoader)
    // 加载模型
    gltfLoader.load('./models/newyear.glb', (gltf) => {
      const model = gltf.scene.children[0] as THREE.Mesh
      scene.add(model)

      // 获取模型参数
      const geometry = model.geometry
      const position = geometry.attributes.position
      const vertexCount = position.count // 模型顶点的数量
      const triangleCount = vertexCount / 3 // 三角面的数量

      // 定义一个随机的强度数组
      const randomStrengths: number[] = []
      for (let i = 0; i < triangleCount; i++) {
        const str = Math.random()
        randomStrengths.push(str, str, str)
      }
      const randomStrengthsAttribute = new THREE.Float32BufferAttribute(
        new Float32Array(randomStrengths),
        1
      )
      geometry.setAttribute('randomStrength', randomStrengthsAttribute)

      // 定义着色器材质
      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: true
      })
      model.material = material
    })
    // 关闭loading
    setIsLoading(false)
  }

  /**
   * 添加光照
   */
  const initLight = () => {
    const ambient = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambient)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight2.position.set(-10, -1, -10)
    directionalLight2.castShadow = true
    scene.add(directionalLight2)
  }

  /**
   * 渲染动画
   */
  const animate = () => {
    const delta = clock.getDelta()
    if (material) {
      if (showTextRef.current) {
        value -= delta
        value = Math.max(value, 0)
        material.uniforms.time.value = value
      } else {
        value += delta
        value = Math.min(value, 1)
        material.uniforms.time.value = value
      }
    }
    requestAnimationFrame(animate)
    renderer && renderer.render(scene, camera)
    // 更新性能监视器
    status && status.update()
    // 更新相机控制器
    controls && controls.update()
  }

  /**
   * 监听页面的点击
   */
  const handleClick = () => {
    showTextRef.current = !showTextRef.current
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
    <HappyNewYearWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </HappyNewYearWrapper>
  )
}

export default memo(HappyNewYear)
