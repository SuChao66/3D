import React, { memo, useState, useEffect } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { RoomWrapper } from './style'
// 导入组件
import { Spin } from 'antd'
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GUI控件
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
// 导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

interface IProps {
  children?: ReactNode
}

// 清除场景中的所有对象，避免切换场景时相互影响
function clearScene(scene: THREE.Scene) {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0])
  }
}

const Room: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [method, setMethod] = useState('sphere')
  // 定义全局变量
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    status: Stats,
    controls: OrbitControls,
    cube: THREE.Mesh
  // 客厅材质
  const roomMaterials: THREE.MeshBasicMaterial[] = []
  // 客厅纹理数组
  const roomTextures: string[] = ['4_l', '4_r', '4_u', '4_d', '4_b', '4_f']
  // 定义3D-room的实现方式
  const info = {
    method: method
  }

  useEffect(() => {
    // 1.初始化
    initThree()
    // 2.创建房间
    if (method === 'cube') {
      createRoom()
    } else {
      createSphereRoom()
    }

    // 监听窗口的变化
    window.addEventListener('resize', handleResize)
    // 销毁
    return () => window.removeEventListener('resize', handleResize)
  }, [method])

  const initThree = () => {
    // 0.初始化性能监视器
    status = new Status()
    document.documentElement.appendChild(status.dom)

    // 1.创建场景
    scene = new THREE.Scene()

    // 2.创建相机
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    // 设置相机的Z轴为负方向，则视角处于模型内部
    camera.position.set(0, 0, -1)
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
    controls.enableZoom = false

    // 5.初始化GUI控件
    const gui = new GUI()
    gui
      .add(info, 'method', ['cube', 'sphere'])
      .name('实现方式')
      .onChange((value) => {
        // 清除场景中的所有对象
        clearScene(scene)
        // 设置方式
        setMethod(value)
        // 打开loading
        setIsLoading(true)
      })

    // 6.渲染
    animate()
  }

  /**
   * VR房间，通过立方体 + 贴图的形式来实现
   */
  const createRoom = () => {
    const geometry = new THREE.BoxGeometry(10, 10, 10)

    roomTextures.forEach((item: string) => {
      // 纹理加载
      const texture = new THREE.TextureLoader().load(
        `./images/3d-room/living/${item}.jpg`
      )
      if (item === '4_u' || item === '4_d') {
        texture.rotation = Math.PI
        texture.center = new THREE.Vector2(0.5, 0.5)
      }
      roomMaterials.push(
        new THREE.MeshBasicMaterial({
          map: texture
        })
      )
    })

    cube = new THREE.Mesh(geometry, roomMaterials)
    cube.geometry.scale(1, 1, -1)
    scene.add(cube)

    // 关闭loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  /**
   * 通过球实现3D room
   */
  const createSphereRoom = () => {
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const loader = new RGBELoader()
    loader.load('./textures/living.hdr', (texture) => {
      const materail = new THREE.MeshBasicMaterial({
        map: texture
      })
      const sphere = new THREE.Mesh(geometry, materail)
      sphere.geometry.scale(1, 1, -1)
      scene.add(sphere)
    })
    // 关闭loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
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
    <RoomWrapper>
      {isLoading && (
        <div className="loading">
          <Spin />
          <div className="loading-text">拼命加载中...</div>
        </div>
      )}
      <canvas className="webgl"></canvas>
    </RoomWrapper>
  )
}

export default memo(Room)
