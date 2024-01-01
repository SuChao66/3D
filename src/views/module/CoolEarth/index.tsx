import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { CoolEarthWrapper } from './style'
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
import { gsap } from 'gsap'

interface IProps {
  children?: ReactNode
}

const CoolEarth: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // 定义月球和地球的半径
  // 定义月球和地球的半径
  const EARTH_RADIUS = 10
  const MOON_RADIUS = 1
  // 定义月球的位置
  const moonX = 20
  // 实例化纹理加载器
  const textureLoader = new THREE.TextureLoader()
  // 星空中星星的个数
  const starsNum = 1000

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
    init()
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
    camera.position.set(10, 50, 30)
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
    // 设置自动围绕目标转动
    controls.autoRotate = true
    // 5.添加光照
    initLight()
    // 6.初始化背景
    initBg()
    // 7.创建月球和月球标签
    createMoon()
    createMoonRing()
    createMoonLabel()
    // 8.创建地球和地球标签
    createEarth()
    createLightEarth()
    createEarthSprite()
    createEarthLightPillar()
    createEarthLabel()
    // 9.创建标签渲染器
    initLabelRender()
    // 渲染
    animate()

    setIsLoading(false)
  }

  // 创建月球
  function createMoon() {
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load('./images/planets/moon_1024.jpg')
    })
    moon = new THREE.Mesh(moonGeometry, moonMaterial)
    moon.position.set(moonX, 0, 0)
    // 设置moon接收阴影
    moon.receiveShadow = true
    // 设置moon投射阴影
    moon.castShadow = true
    // 添加至场景中
    scene.add(moon)
  }

  // 创建月球环
  function createMoonRing() {
    const moonRingTexture = textureLoader.load('./images/planets/moon_ring.png')
    // 创建圆环缓冲几何体
    const moonRinggeometry = new THREE.RingGeometry(15, moonX, 32)
    const moonRingMaterial = new THREE.MeshBasicMaterial({
      map: moonRingTexture,
      transparent: true,
      blending: THREE.AdditiveBlending, // 混合方式
      side: THREE.DoubleSide,
      depthWrite: false, // 渲染此材质是否对深度缓冲区有任何影响
      opacity: 0.5
    })
    const moonRing = new THREE.Mesh(moonRinggeometry, moonRingMaterial)
    moonRing.rotation.x = -Math.PI / 2
    scene.add(moonRing)
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
    moonLabel.position.set(0, MOON_RADIUS + 1.5, 0)
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
    earthLabel.position.set(0, EARTH_RADIUS + 5, 0)
    // 将标签添加至earth上
    earth.add(earthLabel)
  }

  // 创建地球
  function createEarth() {
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32)
    const earthMaterial = new THREE.MeshPhongMaterial({
      shininess: 5, // 高亮的程度
      map: textureLoader.load('./images/planets/map.jpg') // 颜色贴图
    })
    earth = new THREE.Mesh(earthGeometry, earthMaterial)
    // 设置地球是否接受阴影
    earth.receiveShadow = true
    // 设置地球是否被投射阴影
    earth.castShadow = true
    // 添加到场景中
    scene.add(earth)
  }

  // 创建发光地球
  function createLightEarth() {
    const lightTexture = textureLoader.load('./images/planets/earth.jpg')
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32)
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: lightTexture, // 颜色贴图
      alphaMap: lightTexture,
      blending: THREE.AdditiveBlending,
      transparent: true
    })
    const lightEarth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(lightEarth)
  }

  // 创建地球内外发光精灵
  function createEarthSprite() {
    const spriteTexture = new THREE.TextureLoader().load(
      './images/planets/glow.png'
    )
    const spriteMaterial = new THREE.SpriteMaterial({
      map: spriteTexture,
      color: 0x4d76cf,
      transparent: true, // 精灵是否透明
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    })
    const sprite = new THREE.Sprite(spriteMaterial) // 外圈精灵
    sprite.scale.set(32, 32, 0)
    scene.add(sprite)

    // 内发光
    const spriteTextureInner = new THREE.TextureLoader().load(
      './images/planets/innerGlow.png'
    )
    const spriteMaterialInner = new THREE.SpriteMaterial({
      map: spriteTextureInner,
      color: 0x4d76cf,
      transparent: true, // 精灵是否透明
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    })
    const spriteInner = new THREE.Sprite(spriteMaterialInner)
    spriteInner.scale.set(25, 25, 0)
    scene.add(spriteInner)
  }

  // 创建地球光柱效果
  function createEarthLightPillar() {
    for (let i = 0; i < 30; i++) {
      // 光柱纹理
      const lightPillarTexture = new THREE.TextureLoader().load(
        './images/planets/light_column.png'
      )
      const lightPillarGeometry = new THREE.PlaneGeometry(3, 10)
      const lightPillarMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: lightPillarTexture,
        alphaMap: lightPillarTexture, // 灰度纹理，用于控制表面的不透明度，黑色完全透明，白色完全不透明
        transparent: true,
        blending: THREE.AdditiveBlending, // 混合模式
        side: THREE.DoubleSide,
        depthWrite: false // 渲染此材质是否对深度缓冲区有任何影响
      })
      const lightPillar = new THREE.Mesh(
        lightPillarGeometry,
        lightPillarMaterial
      )
      // lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2));

      // 创建波纹扩散效果
      const circlePlane = new THREE.PlaneGeometry(6, 6)
      const circleTexture = new THREE.TextureLoader().load(
        './images/planets/label.png'
      )
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: circleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
      const circleMesh = new THREE.Mesh(circlePlane, circleMaterial)
      circleMesh.rotation.x = -Math.PI / 2
      circleMesh.position.set(0, 0, 0)
      circleMesh.scale.set(0.5, 0.5, 0.5)
      lightPillar.add(circleMesh)

      gsap.to(circleMesh.scale, {
        duration: 1 + Math.random() * 0.5,
        x: 0.2,
        y: 0.2,
        z: 0.2,
        repeat: -1,
        delay: Math.random() * 0.5,
        yoyo: true,
        ease: 'power2.inOut'
      })

      // 设置光柱的位置
      const lat = Math.random() * 180 - 90 // -90 - 90 度
      const lon = Math.random() * 360 - 180 // -180 - 180 度
      const position = lon2xyz(10, lon, lat)
      // 设置光柱的坐标
      lightPillar.position.set(position.x, position.y, position.z)
      // setFromUnitVectors:将该四元数设置为从方向向量 vFrom 旋转到方向向量 vTo 所需的旋转
      lightPillar.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize()
      )
      scene.add(lightPillar)
    }
  }

  // 经纬度转球面坐标
  function lon2xyz(R: number, longitude: number, latitude: number) {
    let lon = (longitude * Math.PI) / 180 // 转弧度值——经度
    const lat = (latitude * Math.PI) / 180 // 转弧度值——纬度
    lon = -lon // js坐标系z坐标轴对应经度-90度，而不是90度

    // 经纬度坐标转球面坐标计算公式
    const x = R * Math.cos(lat) * Math.cos(lon)
    const y = R * Math.sin(lat)
    const z = R * Math.cos(lat) * Math.sin(lon)
    // 返回球面坐标
    return new THREE.Vector3(x, y, z)
  }

  function initLight() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const spotLight = new THREE.SpotLight(0xffffff, 2)
    spotLight.position.set(0, 0, 10)
    spotLight.castShadow = true
    scene.add(spotLight)
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

  // 创建月球绕地球运动的动画
  const time = {
    value: 0
  }
  gsap.to(time, {
    value: 1,
    duration: 10,
    repeat: -1,
    ease: 'linear',
    onUpdate: () => {
      if (moon) {
        moon.position.set(
          Math.sin(time.value * Math.PI * 2) * moonX,
          0,
          Math.cos(time.value * Math.PI * 2) * moonX
        )
        // 设置月球自转
        moon.rotation.y = time.value * Math.PI * 8
      }
    }
  })

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // 标签渲染器渲染
    labelRenderer.render(scene, camera)
    controls.update()
    status.update()
  }

  return (
    <CoolEarthWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <div ref={canvasRef}></div>
    </CoolEarthWrapper>
  )
}

export default memo(CoolEarth)
