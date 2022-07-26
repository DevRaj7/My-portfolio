import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui'
import gsap from "gsap";

// Debug
///// include spotlight in react!@drei

const loader=new THREE.TextureLoader()
const cross1=loader.load('/textures/cross123.png')
const text=loader.load('/textures/NormalMap.png')
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
//const gui = new dat.GUI()
const world = {
  plane: {
    width: 1350,
    height: 1350,
    widthSegments: 200,
    heightSegments: 200,
  }
}
// gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)

// gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
// gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
// gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() - 0.5) * 3
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  65,
  innerWidth / innerHeight,
  0.01,
  1000
)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//new OrbitControls(camera, renderer.domElement)

camera.position.z =50
const particlesGeometry=new THREE.BufferGeometry;
const particlesCnt=60000;
const posArray=new Float32Array(particlesCnt*3);
for(let i=0;i<particlesCnt*3;i++)
{
    posArray[i]=(Math.random()-0.5)*(Math.random()*5)
}
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(posArray,3));
const geometry2=new THREE.TorusGeometry(20.6,6.2,16,100);
const material2=new THREE.MeshNormalMaterial();
material2.normalMap=text;
const torr=new THREE.Mesh(geometry2,material2);
const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const particlesMaterial=new THREE.PointsMaterial({
    size: 0.01,
    map: cross1,
    transparent:true,
    color:'red'
    
   

  })
  const particleMesh=new THREE.Points(particlesGeometry,particlesMaterial)

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
generatePlane()

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
  x: undefined,
  y: undefined
}
const t1=gsap.timeline()
const btn=document.getElementById('travel');
var audio = new Audio("/music/laser.mp3");

btn.addEventListener('click',()=>{
      
    //document.getElementsByClassName('app').style.display= "none";
    const div = document.getElementById("app");
	div.addEventListener("click", function() {
		// hide element: element.hidden = true;
		// show element: element.hidden = false;
		div.hidden = true;
        audio.play();
    })
    const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, 0)
scene.add(light)
   planeMesh.rotation.x=-1.34
  
  
    t1.to(camera.position,{
        y:100,
         z:200,
        duration:0.0000001,
        onUpdate: function (){
            camera.lookAt(0,50,-1400);
        }
    })
    .to(camera.position,{
        z:-400,
        x:200,
    
        duration:5,
        onUpdate: function (){
            camera.lookAt(0,100,-500);
        }
    })
//   torr.position.x=0;
.to(camera.position,{
    z:-1000,
    x:-2000,
    y:300,

    duration:12,
    onUpdate: function (){
        camera.lookAt(0,100,-500);
    }
})
setTimeout(myURL, 8600);
function myURL(){
    location.replace("https://glowing-caramel-c05824.netlify.app/");
}

  torr.position.y=170;
  torr.position.x=-680;
  torr.position.z=-650;
  torr.rotation.y=+1
  scene.add(torr)

  scene.add(particleMesh)

 

});



let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01


  const {
    array,
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.006
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

    // vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    // vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    // vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    particleMesh.rotation.y=-0.01*(elapsedTime)
    
    // if(mouseX>0)
    // {
    // particleMesh.rotation.x=-mouseY*(elapsedTime*0.00008)
    // particleMesh.rotation.y=-mouseX*(elapsedTime*0.00008)
    // }

  
    // Render
    // renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



