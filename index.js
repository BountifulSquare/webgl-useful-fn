import * as THREE from './vendors/three.module.js'
import { OrbitControls } from './vendors/orbitControls.js'

function setup(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 100)
    camera.position.set(0, 10, 10)
    camera.lookAt(0, 0, 0)
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    const scene = new THREE.Scene()

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1)
    dirLight.position.set(0, 20, 10)
    scene.add(dirLight)

    const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
    scene.add(ambLight)

    // const grid = new THREE.GridHelper()
    // scene.add(grid)

    return { renderer, camera, scene }
}

function main() {
    const canvas = document.getElementById('canvas')
    const { renderer, camera, scene } = setup(canvas)

    const geo = new THREE.SphereGeometry(2, 20, 20)
    const mat = new THREE.MeshPhongMaterial({ color: 0xFF0000 })
    const u_time = { value: 0.0 }
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.u_time = u_time

        shader.vertexShader = ` uniform float u_time;\n ` + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
            `
                vec3 transformed = position;
                float x = sin(position.x + u_time);
                // x = mod(x, 0.5);
                // x = fract(x);
                // x = ceil(x);
                // x = floor(x);
                // x = sign(x);
                // x  = abs(x);
                // x = clamp(x, 0.0, 1.0);
                // x = min(0.0, x);
                x = max(0.0, x);
                transformed.x = position.x + x;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            `
        )
    }

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    function animate(dt) {
        renderer.render(scene, camera)
        requestAnimationFrame(animate)

        u_time.value = dt / 500
    }
    animate(0)
}

main()