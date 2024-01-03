import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { MerryCardWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入DRACOLoader模型解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入RGBELoader
// RGBE 是一种高动态范围 (HDR) 图像格式，它能够保存比标准图像更广泛的光照范围和颜色信息
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入水面water
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入gsap动画库
import gsap from 'gsap'

interface IProps {
  children?: ReactNode
}

const MerryCard: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const isAnimate = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSceneIndex = useRef(0)

  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls,
    pointLightGroup: THREE.Group,
    starsInstance: THREE.InstancedMesh
  const pointLightArr: THREE.Mesh[] = []
  const radius = 3
  // 星星随机到天上
  const starsArr: THREE.Vector3[] = [] // 星星的起始位置
  const endArr: THREE.Vector3[] = [] // 星星的结束位置

  const scenes = [
    {
      text: '圣诞快乐',
      callback: () => {
        // 执行函数切换相机和控制器的target
        translateCamera(
          new THREE.Vector3(-3.23, 3, 4.06),
          new THREE.Vector3(-8, 2, 0)
        )
      }
    },
    {
      text: '感谢在这么大的世界里遇见了你',
      callback: () => {
        // 执行函数切换相机和控制器的target
        translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0))
      }
    },
    {
      text: '愿与你探寻世界的每一个角落',
      callback: () => {
        // 执行函数切换相机和控制器的target
        translateCamera(new THREE.Vector3(10, 3, 0), new THREE.Vector3(5, 2, 0))
      }
    },
    {
      text: '愿将天上的星星送给你',
      callback: () => {
        // 执行函数切换相机和控制器的target
        translateCamera(new THREE.Vector3(0, 0, 23), new THREE.Vector3(0, 0, 0))
        makeHeart()
      }
    },
    {
      text: '愿疫情结束，大家健康快乐！',
      callback: () => {
        // 执行函数切换相机和控制器的target
        translateCamera(
          new THREE.Vector3(-20, 1.3, 6.6),
          new THREE.Vector3(5, 2, 0)
        )
        restoreHeart()
      }
    }
  ]

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.加载模型
    loadModel()
    // 3.设置背景
    initBg()
    // 4.创建水面
    createWater()
    // 5.添加光照
    initLight()
    // 6.创建繁星的效果
    createStar()
    // 7.创建爱心
    createHeart()
    // // 8.渲染
    animate()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    window.addEventListener('wheel', handleWheel, true)
    // 销毁
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('wheel', handleWheel, true)
    }
  }, [])

  // 初始化three
  const initThree = () => {
    // 0.初始化性能监视器
    status = new Status()
    statusRef && statusRef.current?.appendChild(status.dom)

    // 1.创建场景
    scene = new THREE.Scene()

    // 2.创建相机
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.set(-3.23, 2.98, 4.06)

    // 3.创建webgl渲染器
    renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement,
      antialias: true // 抗锯齿
    })
    // 设置设备像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置渲染画布的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置编码输出方式
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // 设置色调映射
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 设置色调映射的曝光级别
    renderer.toneMappingExposure = 0.5
    // 设置使用阴影贴图
    renderer.shadowMap.enabled = true
    // 定义阴影贴图类型
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 4.初始化相机控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(-8, 2, 0)
    controls.enableDamping = true
  }

  // 加载模型
  const loadModel = () => {
    // 5.初始化模型加载器和模型解压器
    const dracoLoader = new DRACOLoader()
    // 包含JS和WASM解压缩库的文件夹路径
    dracoLoader.setDecoderPath('./draco/')
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load('./models/scene.glb', (gltf: any) => {
      const model = gltf.scene
      model.traverse((child: any) => {
        // 隐藏模型中自带的水面
        if (child.name == 'Plane') {
          child.visible = false
        }
        // 设置物体产生阴影和接收阴影
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      scene.add(model)
      setIsLoading(false)
    })
  }

  // 初始化背景
  const initBg = () => {
    // 加载环境纹理
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('./textures/sky.hdr', (texture) => {
      scene.background = texture
      scene.environment = texture
      // 设置环境贴图为整个360度环绕的效果
      texture.mapping = THREE.EquirectangularReflectionMapping
    })
  }

  // 创建水面
  const createWater = () => {
    // 创建水面
    const waterGeometry = new THREE.CircleGeometry(300, 32)
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100
    })
    water.rotation.x = -Math.PI / 2
    water.position.y = -0.4
    scene.add(water)
  }

  // 添加光照
  const initLight = () => {
    // 6.添加光照
    // 6.1.添加环境光
    const ambient = new THREE.AmbientLight(0x444444, 1)
    scene.add(ambient)
    // 6.2.添加平行光
    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(0, 50, 0)
    scene.add(directionLight)
    // 6.3.添加点光源
    const pointLight = new THREE.PointLight(0xffffff, 10)
    pointLight.position.set(0.1, 2.4, 0)
    pointLight.castShadow = true
    scene.add(pointLight)
    // 6.4.创建点光源组
    pointLightGroup = new THREE.Group()
    pointLightGroup.position.set(-8, 2.5, -1.5)
    for (let i = 0; i < 3; i++) {
      // 创建球体当灯泡
      const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xfffff,
        emissive: 0xfffff,
        emissiveIntensity: 10
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      pointLightArr.push(sphere)
      sphere.position.set(
        radius * Math.cos((i * 2 * Math.PI) / 3),
        Math.cos((i * 2 * Math.PI) / 3),
        radius * Math.sin((i * 2 * Math.PI) / 3)
      )
      const pointLight = new THREE.PointLight(0xffffff, 10)
      sphere.add(pointLight)

      pointLightGroup.add(sphere)
    }
    scene.add(pointLightGroup)

    // 使用补间函数，从0-2PI，是灯泡旋转
    const options = {
      angle: 0
    }
    gsap.to(options, {
      angle: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        if (pointLightGroup) {
          pointLightGroup.rotation.y = options.angle
        }
        pointLightArr.forEach((item, index) => {
          item.position.set(
            radius * Math.cos((index * 2 * Math.PI) / 3),
            Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
            radius * Math.sin((index * 2 * Math.PI) / 3)
          )
        })
      }
    })
  }

  // 创建星星
  const createStar = () => {
    // 一种具有实例化渲染支持的特殊版本的Mesh。
    // 你可以使用 InstancedMesh 来渲染大量具有相同几何体与材质、但具有不同世界变换的物体。
    // 使用 InstancedMesh 将帮助你减少 draw call 的数量，从而提升你应用程序的整体渲染性能
    // InstancedMesh( geometry : BufferGeometry, material : Material, count : Integer )
    starsInstance = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10
      }),
      100
    )
    for (let i = 0; i < 100; i++) {
      // 随机产生星星的位置坐标，并添加到starsArr中
      const x = Math.random() * 200 - 100
      const y = Math.random() * 100 + 10
      const z = Math.random() * 200 - 100
      starsArr.push(new THREE.Vector3(x, y, z))

      const matrix = new THREE.Matrix4()
      matrix.setPosition(x, y, z) // 设置该矩阵的位置分量
      starsInstance.setMatrixAt(i, matrix) // 设置每个星星的本地变化矩阵
    }
    scene.add(starsInstance)
  }

  // 创建爱心
  const createHeart = () => {
    const heartShape = new THREE.Shape()
    heartShape.moveTo(25, 25) // 将当前点移动到(25, 25)
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35)
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95)
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25)

    // 根据爱心路径获取点
    const center = new THREE.Vector3(0, 2, 10)
    for (let i = 0; i < 100; i++) {
      const point = heartShape.getPoint(i / 100)
      endArr.push(
        new THREE.Vector3(point.x * 0.1 + center.x, point.y * 0.1 + center.y, 0)
      )
    }
  }

  // 创建爱心动画
  // 根据随机的星星创建一个爱心
  function makeHeart() {
    const params = { time: 0 }
    gsap.to(params, {
      time: 1,
      duration: 1,
      onUpdate: () => {
        for (let i = 0; i < 100; i++) {
          const x = starsArr[i].x + (endArr[i].x - starsArr[i].x) * params.time
          const y = starsArr[i].y + (endArr[i].y - starsArr[i].y) * params.time
          const z = starsArr[i].z + (endArr[i].z - starsArr[i].z) * params.time
          const matrix = new THREE.Matrix4()
          matrix.setPosition(x, y, z) // 设置该矩阵的位置分量
          starsInstance.setMatrixAt(i, matrix) // 设置每个星星的本地变化矩阵
        }
        // 设置给定的本地变换矩阵到已定义的实例。 需要更新所有矩阵后将 .instanceMatrix.needsUpdate 设置为true。
        starsInstance.instanceMatrix.needsUpdate = true
      }
    })
  }

  // 恢复星星位置
  function restoreHeart() {
    const params = {
      time: 0
    }

    gsap.to(params, {
      time: 1,
      duration: 1,
      onUpdate: () => {
        for (let i = 0; i < 100; i++) {
          const x = endArr[i].x + (starsArr[i].x - endArr[i].x) * params.time
          const y = endArr[i].y + (starsArr[i].y - endArr[i].y) * params.time
          const z = endArr[i].z + (starsArr[i].z - endArr[i].z) * params.time
          const matrix = new THREE.Matrix4()
          matrix.setPosition(x, y, z)
          starsInstance.setMatrixAt(i, matrix)
        }
        starsInstance.instanceMatrix.needsUpdate = true
      }
    })
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
   * 监听鼠标滚轮的变化
   * @param e
   * @returns
   */
  const handleWheel = (e: WheelEvent) => {
    if (isAnimate.current) return
    isAnimate.current = true
    // 鼠标滚轮往下滚动
    if (e.deltaY > 0) {
      currentSceneIndex.current++
      setCurrentIndex((prevState) => prevState + 1)
      if (currentSceneIndex.current > scenes.length - 1) {
        currentSceneIndex.current = 0
        setCurrentIndex(0)
      }
    }
    // 执行回调函数，切换场景效果
    scenes[currentSceneIndex.current].callback()
    setTimeout(() => {
      isAnimate.current = false
    }, 1000)
  }

  // create a timeline
  const timeLine1 = gsap.timeline()
  const timeLine2 = gsap.timeline()
  /**
   * 定义场景切换的补间动画
   * @param position: 相机的配置
   * @param target: 相机控制器的target
   */
  function translateCamera(
    position: THREE.Vector3,
    target: THREE.Vector3
  ): void {
    timeLine1.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 1,
      ease: 'power2.inOut'
    })
    timeLine2.to(controls.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1,
      ease: 'power2.inOut'
    })
  }

  return (
    <MerryCardWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      {/* 引导语展示 */}
      <div className="text">
        {scenes.map((scene, index) => {
          return currentIndex == index && <div key={index}>{scene.text}</div>
        })}
      </div>
      <canvas className="webgl"></canvas>
    </MerryCardWrapper>
  )
}

export default memo(MerryCard)
