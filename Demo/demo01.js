 import * as THREE from "../lib/three.module.js";
 import { GUI } from "../lib/dat.gui.module.js";
 import { OrbitControls } from "../lib/OrbitControls.js";
 import Stats from "../lib/stats.module.js";
 import { ColladaLoader } from "../lib/ColladaLoader.js";
 import { FBXLoader } from"../lib/FBXLoader.js";
 import { GLTFLoader } from"../lib/GLTFLoader.js";

function createHelpers(){
 const axesHelper = new THREE.AxesHelper( 5 );
 scene.add( axesHelper );
}
 let aspectRatio = (window.innerWidth / window.innerHeight);
 let scene, camera, renderer, controls, cameraControl, billBoard,reflectionCube,
  box1, box2, box3, box4, cube;

 const loadingManager = new THREE.LoadingManager();
 const textLoader = new THREE.TextureLoader(loadingManager);
 const container = document.getElementById( 'container' );
 const stats = Stats();
 stats.showPanel( 0 ); // 0 = fps, 1 = ms, 2 = mb, 3 = custom
 container.appendChild(stats.dom);


 loadingManager.onLoad = function () {console.log('loaded')};
 loadingManager.onProgress = function () {} ;// or undefined
 loadingManager.onError = function () {console.log('ERROR')};
 let mixer, mixer2, mixer3, mixer4, mixer5,mixer6, mixer7 = new THREE.AnimationMixer();
 let modelReady = false;


 var gui = new GUI(loadingManager);


 const listener = new THREE.AudioListener(loadingManager);
 const sound = new THREE.Audio( listener );
 const posSound = new THREE.PositionalAudio ( listener );


 function createRenderer(){
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement );
}

//create camera
function createCamera(){
//create PerspectiveCamera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000);
  camera.position.set( 20, 40, 40);
  camera.lookAt(scene.position);
  cameraControl = new OrbitControls(camera, renderer.domElement);

//create GUI controller to control camera position and rotation
  
 scene.add(camera);
  
}

//create the cube texture of background
function createSky(){
  var path = '../assets/textures/sky/';
  var format = '.png';
  var urls = [
    path+'nightsky_ft'+format,//front side
    path+'nightsky_bk'+format,//back side
    path+'nightsky_up'+format,//up side
    path+'nightsky_dn'+format,//down side
    path+'nightsky_rt'+format,//right side
    path+'nightsky_lf'+format//lef  side
  ];

  reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;
  scene.background = reflectionCube;
}


//load the quad model
function loadModel(){
     //var texture = new THREE.Texture();
     var loader = new ColladaLoader(loadingManager);
     loader.load('../assets/models/UCC_Quad_Model_DAE/quad.dae', function(collada){
       collada.scene.traverse(function(child){
         if(child.isMesh){
           child.castShadow = true;
         }
       })
       var object = collada.scene;
       object.castShadow = true;
       object.rotation.z = Math.PI/3
       scene.add(object);
       });
    }

// load charactor1 function
function loadCharactor1(){
  const loader = new GLTFLoader (loadingManager);
  loader.castShadow = true;
  loader.load('../assets/models/charactor01.glb', function ( gltf ) {

    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
        child.castShadow = true;
                    }
                  })
  var object = gltf.scene;
  object.scale.set(4,4,4);
  object.position.set(12,0,-15);
  scene.add(object);

// add the animation
  const clips = gltf.animations;
  mixer = new THREE.AnimationMixer( object );
  var action = mixer.clipAction( gltf.animations [0]);
  action.play();
});
}


// load charactor2 function

    function loadCharactor2(){
      const loader = new GLTFLoader (loadingManager);
      loader.castShadow = true;
      loader.load('../assets/models/charactor02.glb', function ( gltf ) {

        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
            child.castShadow = true;
                        }
                      })
      var charactor2 = gltf.scene;
      charactor2.scale.set(3,3,3);
      charactor2.name = 'charactor2';
      charactor2.position.set(10,0,5);
      scene.add(charactor2);

      //set the animation
      var rotationTrack = new THREE.KeyframeTrack('charactor2.rotation[y]', [0,20], [0,Math.PI*2]);
      var duration = 20;
      var clip = new THREE.AnimationClip('default', duration, [rotationTrack]);
      mixer2 = new THREE.AnimationMixer(charactor2);
      var action = mixer2.clipAction(clip);
       action.timeScale = 20;
       action.loop =THREE.loopRepeat;
       action.play();
    });

    }

function loadCharactor3(){
      //load the textures
       const colTexture = textLoader.load('../assets/models/BH-2/Textures/BH-2_AlbedoTransparency.png');
       const emissionTexture = textLoader.load('../assets/models/BH-2/Textures/BH-2_Emission.png');
       const normalTexture = textLoader.load('../assets/models/BH-2/Textures/BH-2_Normal.png');
       const ssTexture = textLoader.load('../assets/models/BH-2/Textures/BH-2_SpecularSmoothness.png');
       //create material with textures
       const material = new THREE.MeshPhongMaterial({map: colTexture});
       material.normalMap = normalTexture;
       material.emmissiveMap = emissionTexture;
       material.emissiveIntensity = 0.8;
       material.specularMap = ssTexture;


      //load the object
      var loader = new FBXLoader(loadingManager);
      loader.load( '../assets/models/BH-2/BH-2.fbx', function(object){
           object.traverse(function(child){
             if(child instanceof THREE.Mesh){
               child.material = material;
               child.scale.set(0.03,0.03,0.03);
               child.castShadow = true;
               child.receiveShadow = true;
             }
           });
          scene.add(object);
          //create the animation
          var rotationTrack_x = new THREE.KeyframeTrack('object.rotation[x]', [0,100], [0, Math.PI*2]);
          var rotationTrack_y = new THREE.KeyframeTrack('object.rotation[y]', [0,100], [0, Math.PI*2]);
          var rotationTrack_z = new THREE.KeyframeTrack('object.rotation[z]', [0,100], [0, Math.PI*2]);
          var positionTrack1 = new THREE.KeyframeTrack('object.position', [0,25], [-50,25,50, 50,25,50]);
          var positionTrack2 = new THREE.KeyframeTrack('object.position', [25,50], [50,25,50, 50,25,-50]);
          var positionTrack3 = new THREE.KeyframeTrack('object.position', [50,75], [50,25,-50, -50,25,-50]);
          var positionTrack4 = new THREE.KeyframeTrack('object.position', [75,100], [-50,25,-50, -50,25,50]);
          var duration = 100;
          var clip = new THREE.AnimationClip('default', duration,
          [rotationTrack_x,rotationTrack_y,rotationTrack_z,positionTrack1,positionTrack2,positionTrack3,positionTrack4]);
          mixer4 = new THREE.AnimationMixer(object);
          var action = mixer4.clipAction(clip);
           action.timeScale = 20;
           action.loop =THREE.loopRepeat;
           action.play();
       });
    }



//create the disco ball and its animations
  function loadDiscoBall(){
    //load the model
    const loader = new GLTFLoader (loadingManager);
    loader.castShadow = true;
      loader.load('../assets/models/disco_ball/scene.gltf', function ( gltf ) {
      gltf.scene.traverse( function ( child ) {
          if ( child.isMesh ) {
          child.castShadow = true;
          child.material.envMap = reflectionCube;
          child.material.metalness = 1.0;
          child.material.roughness = 0.0;
          child.material.refractionRatio = 1.0;
            }
            })
      var ball = gltf.scene
      ball.scale.set(0.02,0.02,0.02);
      ball.position.set(6, 20, -8);
      scene.add(ball);

      //create the rotation animation with key frames
      var rotationTrack = new THREE.KeyframeTrack('ball.rotation[y]', [0,20], [0,Math.PI*2]);
      var duration = 20;
    	var clip = new THREE.AnimationClip('default', duration, [rotationTrack]);
      mixer3 = new THREE.AnimationMixer(ball);
    	var action = mixer3.clipAction(clip);
      action.timeScale = 20;
    	action.loop =THREE.loopRepeat;
    	action.play();
    });
  }

  //create two amplifiers to create stereo sound
  function loadAmplifier(){
      const texture = textLoader.load('../assets/models/amplifier/speakerF.jpg');
      const material = new THREE.MeshPhongMaterial({map: texture});
      const loader = new FBXLoader(loadingManager);
      loader.load('../assets/models/amplifier/bigspeaker.fbx',function(fbx){

      fbx.traverse(function(child){
          if(child.isMesh){
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
     fbx.scale.set(0.006,0.006,0.006);
     fbx.position.set(-3,0,9);
    soundFolder.add(fbx.position, "x", -10, 10, .001).name("panner");
    scene.add(fbx);
    fbx.add(posSound);
      });
  }



//create tv
function loadTV(){
  //load texture images
   const mainAO = textLoader.load('../assets/models/tv/textures/retrotv0319_Main_AO.png');
   const mainBase = textLoader.load('../assets/models/tv/textures/retrotv0319_Main_BaseColor.png');
   const mainMetal = textLoader.load('../assets/models/tv/textures/retrotv0319_Main_Metallic.png');
   const mainNorm = textLoader.load('../assets/models/tv/textures/retrotv0319_Main_NormalDX.png');
   const mainRough = textLoader.load('../assets/models/tv/textures/retrotv0319_Main_Roughness.png');
   const screenAO = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_AO.png');
   const screenNoise = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_BaseColor_noise.png');
   const screenBase = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_BaseColor.png');
   const screenMetal = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_Metallic.png');
   const screenNorm = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_NormalDX.png');
   const screenRough = textLoader.load('../assets/models/tv/textures/retrotv0319_Screen_Roughness.png');

  //create main material
  const mainMaterial = new THREE.MeshPhongMaterial({map: mainBase, side: THREE.DoubleSide});
  mainMaterial.aoMap = mainAO;
  mainMaterial.metalnessMap = mainMetal;
  mainMaterial.normalMap = mainNorm;
  mainMaterial.roughnessMap = mainRough;
 
  //create screen material
  const screenMaterial = new THREE.MeshPhongMaterial({map: screenBase, side: THREE.DoubleSide});
  screenMaterial.aoMap = screenAO;
  screenMaterial.metalnessMap = screenMetal;
  screenMaterial.normalMap =screenNorm;
  screenMaterial.roughnessMap = screenRough;
  screenMaterial.noiseMap =  screenNoise;

  //create the materials array, add the main material and screen material
  const materials = [mainMaterial,screenMaterial];
  var loader = new FBXLoader(loadingManager);
  loader.load('../assets/models/tv/tv.fbx',function(fbx){
      fbx.traverse(function(child){
       if(child.isMesh){
       child.castShadow = true;
       child.receiveShadow = true;
       child.material = materials;//add materials to the mesh
       }
    });
    fbx.scale.set(0.05,0.05,0.05);
    fbx.position.set(-8,0,-32);
    fbx.rotation.y = Math.PI/4;
    scene.add(fbx);
  });
}


//create boxes with ShaderMaterial
function createBox1(){
    var geometry = new THREE.BoxGeometry(2,2,2);
    var uniforms = {
      delta:{value:0}
          };
      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader1').textContent,
        fragmentShader: document.getElementById('fragmentShader1').textContent
          });
          material.metalness = 1.0;

          box1 = new THREE.Mesh(geometry, material);
          box1.position.set(20,20,20);
          box1.castShadow = true;
          box1.name = "box1";
          scene.add(box1);

          var vertexDisplacement = new Float32Array(geometry.attributes.position.count);
          for (var i = 0; i< vertexDisplacement.length; i +=1){
            vertexDisplacement[i] = Math.sin(i);
          }
          geometry.setAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement,1));

          var rotationTrack1 = new THREE.KeyframeTrack('box1.rotation[x]', [0,80], [0,Math.PI]);
          var rotationTrack2 = new THREE.KeyframeTrack('box1.rotation[y]', [0,80], [0,Math.PI]);
          var rotationTrack3 = new THREE.KeyframeTrack('box1.rotation[z]', [0,80], [0,Math.PI]);

          var duration = 80;
          var clip = new THREE.AnimationClip('default', duration, [rotationTrack1,rotationTrack2,rotationTrack3]);
          mixer5 = new THREE.AnimationMixer(box1);
          var action = mixer5.clipAction(clip);
          action.timeScale = 20;
          action.loop =THREE.loopRepeat;
          action.play();
        }
  function createBox2(){
      var geometry = new THREE.BoxGeometry(2,2,2);
      var uniforms = {
        delta:{value:0}
            };
        var material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: document.getElementById('vertexShader2').textContent,
          fragmentShader: document.getElementById('fragmentShader2').textContent
          });
        material.metalness = 1.0;

        box2 = new THREE.Mesh(geometry, material);
        box2.position.set(20,20,-20);
        box2.castShadow = true;
        box2.name = "box2";
        scene.add(box2);

        var vertexDisplacement = new Float32Array(geometry.attributes.position.count);
        for (var i = 0; i< vertexDisplacement.length; i +=1){
          vertexDisplacement[i] = Math.sin(i);
          }
          geometry.setAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement,1));

          var rotationTrack1 = new THREE.KeyframeTrack('box2.rotation[x]', [0,80], [0,Math.PI]);
          var rotationTrack2 = new THREE.KeyframeTrack('box2.rotation[y]', [0,80], [0,Math.PI]);
          var rotationTrack3 = new THREE.KeyframeTrack('box2.rotation[z]', [0,80], [0,Math.PI]);
          var duration = 80;
          var clip = new THREE.AnimationClip('default', duration, [rotationTrack1,rotationTrack2,rotationTrack3]);
          var mixer6 = new THREE.AnimationMixer(box2);
          var action = mixer6.clipAction(clip);
          action.timeScale = 20;
          action.loop =THREE.loopRepeat;
          action.play();
                }


    function createBox3(){
        var geometry = new THREE.BoxGeometry(2,2,2);
        var uniforms = {
        delta:{value:0}
            };
        var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader3').textContent,
        fragmentShader: document.getElementById('fragmentShader3').textContent
          });
        box3 = new THREE.Mesh(geometry, material);
        box3.position.set(-20,20,-20);
        box3.castShadow = true;
        box3.name = "box3";
        scene.add(box3);

      var vertexDisplacement = new Float32Array(geometry.attributes.position.count);

      for (var i = 0; i< vertexDisplacement.length; i +=1){
        vertexDisplacement[i] = Math.sin(i);
          }
        geometry.setAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement,1));

        var rotationTrack1 = new THREE.KeyframeTrack('box3.rotation[x]', [0,80], [0,Math.PI]);
        var rotationTrack2 = new THREE.KeyframeTrack('box3.rotation[y]', [0,80], [0,Math.PI]);
        var rotationTrack3 = new THREE.KeyframeTrack('box3.rotation[z]', [0,80], [0,Math.PI]);

        var duration = 80;
        var clip = new THREE.AnimationClip('default', duration, [rotationTrack1,rotationTrack2,rotationTrack3]);
        mixer7 = new THREE.AnimationMixer(box3);
        var action = mixer7.clipAction(clip);
        action.timeScale = 20;
        action.loop =THREE.loopRepeat;
        action.play();
      }


      function createBox4(){
          var geometry = new THREE.BoxGeometry(2,2,2);
          var material = new THREE.MeshPhongMaterial({color: 0x9bd4e4})
          box4 = new THREE.Mesh(geometry, material);
          box4.position.set(24,3,-24);
          box4.rotation.x = Math.PI/4;
          box4.rotation.Z = Math.PI/4;
          box4.castShadow = true;
          box4.name = "box4";
          scene.add(box4);
        }

    //create animation function
    var clock = new THREE.Clock();
    function animate() {
      window.requestAnimationFrame(animate);
      var time = clock.getDelta();
      var noise = new Noise();
      box4.rotation.y += noise.simplex2(0.05,0.05);
      if (mixer){ mixer.update(time);}
      if (mixer2){ mixer2.update(time);}
      if (mixer3){ mixer3.update(time);}
      if (mixer4){mixer4.update(time);}
      if (mixer5){mixer5.update(time);}
      if (mixer6){mixer6.update(time);}
      if (mixer7){mixer7.update(time);}
    }


//create light
function createLight(){


 var pointLight = new THREE.PointLight(0xffffff, 1);
 pointLight.position.set(50,30,20);
 pointLight.shadow.camera.near = 1;
 pointLight.shadow.camera.far = 300;
 pointLight.castShadow = true;

 var pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(-50,30,-10);
  pointLight2.shadow.camera.near = 1;
  pointLight2.shadow.camera.far = 300;
  pointLight2.castShadow = true;

  var directionalLight = new THREE.DirectionalLight(0xffffff,0.1);
  directionalLight.position.set(10,40,-20);
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 300;
  directionalLight.castShadow = true;


  var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  ambientLight.position.set(0,100,20);
  scene.add(pointLight);
  scene.add(pointLight2);
  scene.add(directionalLight);
  scene.add(ambientLight);

}

// create the ground
function createPlane(){
  const geometry = new THREE.PlaneGeometry(300,300);
  const aoTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_AO_4k.png');
  aoTexture.wrapS = THREE.RepeatWrapping;
  aoTexture.wrapT = THREE.RepeatWrapping;
  aoTexture.repeat.set(20.0, 20.0);
  const bumpTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_bump_4k.png');
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(20.0, 20.0);
  const diffTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_diff_4k.png');
  diffTexture.wrapS = THREE.RepeatWrapping;
  diffTexture.wrapT = THREE.RepeatWrapping;
  diffTexture.repeat.set(20.0, 20.0);
  const dispTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_disp_4k.png');
  dispTexture.wrapS = THREE.RepeatWrapping;
  dispTexture.wrapT = THREE.RepeatWrapping;
  dispTexture.repeat.set(20.0, 20.0);
  const normalTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_nor_4k.png');
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(20.0, 20.0);
  const roughTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_rough_4k.png');
  roughTexture.wrapS = THREE.RepeatWrapping;
  roughTexture.wrapT = THREE.RepeatWrapping;
  roughTexture.repeat.set(20.0, 20.0);
  const ssTexture = textLoader.load('../assets/textures/floor_pebbles_4k_png/floor_pebbles_01_spec_4k.png');
  ssTexture.wrapS = THREE.RepeatWrapping;
  ssTexture.wrapT = THREE.RepeatWrapping;
  ssTexture.repeat.set(20.0, 20.0);

  const material = new THREE.MeshPhongMaterial({ color: 0xaeb1b5, map: diffTexture, side: THREE.DoubleSide});
  material.aoMap = aoTexture;
  material.aoMapIntensity = 1.0;
  material.bumpMap = bumpTexture;
  material.bumpScale = 1.0;
  material.normalMap = normalTexture;
  material.displacementMap = dispTexture;
  material.displacementScale = 0.005;
  material.roughnessMap = roughTexture;
  material.specularMap = ssTexture;

  var plane = new THREE.Mesh(geometry,  material);
  plane.position.set(0,0,0);
  plane.rotation.x = Math.PI/2;
  plane.receiveShadow = true;
  scene.add(plane);
}

//create the grass
function createGrass(){
  const group = new THREE.Group();

  //load and scale textures
  const colorTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_COLOR.jpg');
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;
  colorTexture.repeat.set = (50,50);
  const bumpTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_COLOR.jpg');
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set = (50,50);
  const dispTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_DISP.png');
  const normalTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_NORM.jpg');
  const occTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_OCC.jpg');
  const roughTexture = textLoader.load('../assets/textures/Grass_001_SD/Grass_001_ROUGH.jpg');
  const material = new THREE.MeshPhongMaterial({map: colorTexture, side: THREE.DoubleSide});
  material.bumpMap = bumpTexture;
  material.displacementMap = dispTexture;
  material.normalMap = normalTexture;
  material.roughnessMap = roughTexture;

  //create 4 pieces of grass
  var grass1 = new THREE.Mesh(new THREE.BoxGeometry(18, 24, 0.1),  material);
  grass1.position.set(-10, -13, 0);
  grass1.castShadow = true;
  grass1.receiveShadow = true;
  var grass2 = new THREE.Mesh(new THREE.BoxGeometry(18, 24, 0.1),  material);
  grass2.position.set(-10, 13, 0);
  grass2.castShadow = true;
  grass2.receiveShadow = true;

  var grass3 = new THREE.Mesh(new THREE.BoxGeometry(18, 24, 0.1),  material);
  grass3.position.set(10, -13, 0);
  grass3.castShadow = true;
  grass3.receiveShadow = true;

  var grass4 = new THREE.Mesh(new THREE.BoxGeometry(18, 24, 0.1),  material);
  grass4.position.set(10, 13, 0);
  grass4.castShadow = true;
  grass4.receiveShadow = true;

  //add the grass to the group, set the position and rotation
  group.add(grass1, grass2, grass3, grass4);
  group.position.set(6, 0.05, -8);
  group.rotation.x = Math.PI/2;

  //add to the scene
  scene.add(group);
}


//create the billBoard
function createBillBoard(){
  //Create screen geometry
  const geometry = new THREE.PlaneGeometry(16, 9);
  const video = document.getElementById('video');  //get the video from Id
  //Create video texture:
  const videoTexture = new THREE.VideoTexture(video);
  const videoMaterial =  new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false
  });
  var bbScreen = new THREE.Mesh(geometry,  videoMaterial);
  bbScreen.position.set(0,0,0.2);

  //create the main billBoard
  var box = new THREE.BoxGeometry(16,9,0.2);
  var boxMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc});
  billBoard = new THREE.Mesh(box, boxMaterial);

  //add the screen to the billBoard
  billBoard.add(bbScreen);
  billBoard.rotation.y = Math.PI/2;
  billBoard.position.set(-15, 4.5, -10);
  billBoard.castShadow = true;
  //add the billBoard to the scene
  scene.add(billBoard);
}

//create ambient sound
function createAmbientSound(){
   const audioLoader = new THREE.AudioLoader();
   audioLoader.load('../assets/audio/ambient.mp3', function (buffer) {
   sound.setBuffer(buffer);
   sound.setLoop(true);
   sound.setVolume(0.1);
   sound.play();
});
}



//create position sound
function createPositionSound(){
   const audioLoader2 = new THREE.AudioLoader();
   audioLoader2.load ('../assets/audio/position.mp3', function (buffer) {
     posSound.setBuffer( buffer)
     posSound.setRefDistance( 10 )
     posSound.play();
     posSound.setLoop(true);
   });

}

//create sound GUI
const soundFolder = gui.addFolder("Positional Audio");
function createSoundGUI(){
// const soundFolder = gui.addFolder("Positional Audio");
const playObj = { play:function(){ posSound.play() }};
const stopObj = { stop:function(){ posSound.stop() }};

soundFolder.add(stopObj,'stop');
soundFolder.add(playObj,'play');
// soundFolder.add(cube.position, "x", -10, 10, .001).name("panner");
soundFolder.open()
const allAudioFolder = gui.addFolder("All Audio");
const muteObj = {stop:function(){
  posSound.isPlaying || sound.isPlaying ? listener.setMasterVolume(0) : listener.setMasterVolume(1) }};
const allPlayObj = {play:function(){
   listener.setMasterVolume(0.25);
}};

allAudioFolder.add(muteObj,'stop').name("Mute All");
allAudioFolder.add(allPlayObj,'play').name("Play All");
allAudioFolder.open()
}


function init(){
    scene = new THREE.Scene();

   

    createHelpers(loadingManager);
    createRenderer();
    createCamera(loadingManager);
    camera.add(listener);
    createLight(loadingManager);
    createPlane(loadingManager);
    createGrass(loadingManager);
    createSky(loadingManager);
    createAmbientSound(loadingManager);
    createPositionSound(loadingManager);
    loadModel(loadingManager);

    loadCharactor1(loadingManager);
    loadCharactor2(loadingManager);
    loadCharactor3(loadingManager);
    loadDiscoBall(loadingManager);
    loadAmplifier(loadingManager);

    loadTV(loadingManager);
    createBillBoard(loadingManager);
    createBox1(loadingManager);
    createBox2(loadingManager);
    createBox3(loadingManager);
    createBox4();
    createSoundGUI(loadingManager);
    animate();
    render();
  }

  var delta = 0;
  function render(){
    cameraControl.update();
    delta += 0.1;
    var noise = new Noise();
    box1.material.uniforms.delta.value = 0.5+ Math.sin(delta)*0.5;
    box2.material.uniforms.delta.value = 0.5+ Math.cos(delta)*0.5;
    box3.material.uniforms.delta.value = 0.5+ Math.sin(delta)*0.5;
    
    requestAnimationFrame(render);
    renderer.render(scene,camera);
  }
  init();
