import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { EarthWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控件
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入CSS2D
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'

interface IProps {
  children?: ReactNode
}

const Earth: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const clock = new THREE.Clock()

  // 定义月球和地球的半径
  const EARTH_RADIUS = 2.5
  const MOON_RADIUS = 0.27
  const starsNum = 1000

  // 初始化纹理加载器
  const textureLoader = new THREE.TextureLoader()

  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Status,
    controls: OrbitControls,
    labelRenderer: CSS2DRenderer,
    moon: THREE.Mesh,
    earth: THREE.Mesh

  useEffect(() => {
    // 1.初始化three
    init()

    // 关闭loading
    setIsLoading(false)

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
      200
    )
    // 设置相机的位置
    camera.position.set(10, 5, 5)
    // 3.初始化渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true // 允许投射动态阴影
    // 将渲染的画布添加到容器中
    canvasRef.current?.appendChild(renderer.domElement)
    // 4.初始化控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 20
    controls.maxDistance = 100
    controls.autoRotate = true
    // 5.添加光照
    initLight()
    // 设置背景
    initBg()
    // 6.创建月球和月球标签
    createMoon()
    createMoonLabel()
    // 8.创建地球和地球标签
    createEarth()
    createEarthLabel()
    // 9.创建标签渲染器
    initLabelRender()
    // 渲染
    animate()
  }

  // 创建月球
  function createMoon() {
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load('./images/planets/moon_1024.jpg')
    })
    moon = new THREE.Mesh(moonGeometry, moonMaterial)
    // 设置moon接收阴影
    moon.receiveShadow = true
    // 设置moon投射阴影
    moon.castShadow = true
    // 添加至场景中
    scene.add(moon)
  }

  // 创建月球标签
  function createMoonLabel() {
    // 创建标签
    const moonDiv = document.createElement('div')
    moonDiv.className = 'label'
    moonDiv.textContent = 'moon'
    // 创建css2D对象
    const moonLabel = new CSS2DObject(moonDiv)
    // 设置标签的位置
    moonLabel.position.set(0, MOON_RADIUS + 0.5, 0)
    // 将标签添加至moon上
    moon.add(moonLabel)
  }

  // 创建地球标签
  function createEarthLabel() {
    // 创建标签
    const earthDiv = document.createElement('div')
    earthDiv.className = 'label'
    earthDiv.textContent = 'earth'
    // 创建css2D对象
    const earthLabel = new CSS2DObject(earthDiv)
    // 设置标签的位置
    earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0)
    // 将标签添加至earth上
    earth.add(earthLabel)
  }

  // 创建地球
  function createEarth() {
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32)
    const earthMaterial = new THREE.MeshPhongMaterial({
      shininess: 5, // 高亮的程度
      map: textureLoader.load('./images/planets/earth_atmos_2048.jpg'), // 颜色贴图
      specularMap: textureLoader.load(
        './images/planets/earth_specular_2048.jpg'
      ), // 镜面反射贴图
      normalMap: textureLoader.load('./images/planets/earth_normal_2048.jpg') // 法线贴图
    })
    earth = new THREE.Mesh(earthGeometry, earthMaterial)
    // 设置地球是否接受阴影
    earth.receiveShadow = true
    // 设置地球是否被投射阴影
    earth.castShadow = true
    // 添加到场景中
    scene.add(earth)
  }

  function initLight() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(0, 0, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)
  }

  // 通过点精灵材质创建星空的背景
  function initBg() {
    scene.background = new THREE.Color(0x030311)
    // 创建星星的坐标
    const vertices = []
    for (let i = 0; i < starsNum; i++) {
      const vectex = new THREE.Vector3()
      vectex.x = Math.random() * 800 - 400
      vectex.y = Math.random() * 800 - 400
      vectex.z = Math.random() * 800 - 400
      vertices.push(vectex.x, vectex.y, vectex.z)
    }
    // 星空效果
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    )
    const starTexture = textureLoader.load('./images/planets/stars.png')
    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true, // 指定点的大小是否因相机深度而衰减
      map: starTexture,
      color: 0x4d76cf,
      transparent: true,
      opacity: 1
    })
    const star = new THREE.Points(starGeometry, starMaterial)
    scene.add(star)
  }

  // 创建标签渲染器
  function initLabelRender() {
    // 实例化标签渲染器
    labelRenderer = new CSS2DRenderer()
    // 设置标签渲染器渲染大小
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    // 将结果添加到容器中
    canvasRef.current?.appendChild(labelRenderer.domElement)
    // 设置标签渲染器结果的样式
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    // 解决css2d导致相机控件不可操作的问题
    labelRenderer.domElement.style.pointerEvents = 'none'
  }

  let oldTime = 0
  function animate() {
    const elapsed = clock.getElapsedTime()
    // 设置月球绕地球旋转
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)
    // 设置地球自转
    const axis = new THREE.Vector3(0, 1, 0)
    earth.rotateOnAxis(axis, ((elapsed - oldTime) * Math.PI) / 10)

    oldTime = elapsed
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // 标签渲染器渲染
    labelRenderer.render(scene, camera)
    controls.update()
    status.update()
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
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
  }

  return (
    <EarthWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <div ref={canvasRef}></div>
    </EarthWrapper>
  )
}

export default memo(Earth)
