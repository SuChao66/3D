import React, { memo, useState, useEffect, useRef } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { FontWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入FontLoader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
// 导入TextGeometry
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// 导入GUI
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

interface IProps {
  children?: ReactNode
}

const Font: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [message] = useState('星辰大海')
  const statusRef = useRef<HTMLDivElement | null>(null)

  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls,
    geometry: TextGeometry,
    material: THREE.MeshPhysicalMaterial

  const params = {
    scene: {
      backgroundBlurriness: 0.6
    },
    font: {
      material: {
        color: 0xeeeeff,
        roughness: 0, // 粗糙度
        reflectivity: 1, // 反射率
        thickness: 80, // 材质的厚度
        ior: 1.5, // 折射率
        transmission: 1, // 透光率
        side: THREE.DoubleSide, // 双面渲染
        emissive: 0xffeeff, // 材质的放射（光）颜色
        emissiveIntensity: 0.1 // 放射光强度
      }
    }
  }

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.设置背景
    initBg()
    // 3.初始化字体
    loadFont()

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    // 销毁
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const initThree = () => {
    // 0.初始化性能监视器
    status = new Status()
    statusRef.current?.appendChild(status.dom)

    // 1.创建场景
    scene = new THREE.Scene()

    // 2.创建相机
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    // 设置相机的位置
    camera.position.set(0, 0, 800)
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

    // 5.实例化GUI
    const gui = new GUI()
    const sceneFolder = gui.addFolder('scene')
    sceneFolder
      .add(params.scene, 'backgroundBlurriness', 0, 1)
      .name('backgroundBlurriness')
      .onChange((value) => {
        scene.backgroundBlurriness = value
      })

    const materailFolder = gui.addFolder('materail')
    Object.keys(params.font.material).forEach((item) => {
      if (item === 'color' || item === 'emissive') {
        materailFolder
          .addColor(params.font.material, item)
          .onChange((value) => {
            material.color.set(value)
          })
      } else if (
        item === 'roughness' ||
        item === 'reflectivity' ||
        item === 'transmission' ||
        item === 'emissiveIntensity'
      ) {
        materailFolder
          .add(params.font.material, item, 0, 1)
          .onChange((value) => {
            material[item] = value
          })
      } else if (item === 'ior') {
        materailFolder
          .add(params.font.material, item, 1, 2.333)
          .onChange((value) => {
            material[item] = value
          })
      } else if (item === 'thickness') {
        materailFolder
          .add(params.font.material, item, 10, 100)
          .onChange((value) => {
            material[item] = value
          })
      }
    })

    // 5.渲染
    animate()
  }

  /**
   * 加载背景
   */
  const initBg = () => {
    const texture = new THREE.TextureLoader().load('./images/sky/sky.jpg')
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
    scene.backgroundBlurriness = params.scene.backgroundBlurriness
  }

  /**
   * 加载字体
   */
  const loadFont = () => {
    const loader = new FontLoader()
    loader.load('./font/FangSong_Regular.json', (font) => {
      geometry = new TextGeometry(message, {
        font: font, // 字体
        size: 80, // 字体大小
        height: 20, // 字体厚度
        curveSegments: 12, // 曲线分段数
        bevelEnabled: true, // 是否启用斜角
        bevelThickness: 10, // 斜角厚度
        bevelSize: 8, // 斜角大小
        bevelSegments: 5 // 斜角分段数
      })
      geometry.center()
      material = new THREE.MeshPhysicalMaterial({
        color: params.font.material.color,
        roughness: params.font.material.roughness, // 粗糙度
        reflectivity: params.font.material.reflectivity, // 反射率
        thickness: params.font.material.thickness, // 材质的厚度
        ior: params.font.material.ior, // 折射率
        transmission: params.font.material.transmission, // 透光率
        side: params.font.material.side,
        emissive: params.font.material.emissive, // 材质的放射（光）颜色
        emissiveIntensity: params.font.material.emissiveIntensity // 放射光强度
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      // 取消loading
      setIsLoading(false)
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

  return (
    <FontWrapper>
      <div ref={statusRef}></div>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </FontWrapper>
  )
}

export default memo(Font)
