import { BoundingInfo, Camera, Color3, Color4, CubeTexture, DefaultRenderingPipeline, FollowCamera, FreeCamera, HDRCubeTexture, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, PBRMaterial, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import LevelManager from "./levelManager.js";


class Game {
    engine;
    canvas;
    scene;
    activeCamera;
    particleSystemSnow;


    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.activeCamera = null;
    }

    init() {
        //this.engine.displayLoadingUI();
        console.log("Game is initializing...");
        this.createScene().then(() => {
            
        });
        //this.engine.hideLoadingUI();
        

    }

    start() {
        this.engine.runRenderLoop(() => {
            let delta = this.engine.getDeltaTime()/1000.0;
            if(this.levelM.player != null){
                this.levelM.player.updateMove(delta);
            }
            
            this.scene.render();
        });

    }

    async createScene() {

        this.scene = new Scene(this.engine);

        const freeCamera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10), this.scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(this.canvas, true);
        
        
        this.levelM = new LevelManager();
        this.levelM.menu(this.scene);

        this.addLight();

        // Create a particle system
        this.particleSystemSnow = new ParticleSystem("particles", 2000, this.scene);
        this.particleSystemSnow.gravity = new Vector3(0, -9.81, 0);
        //Texture of each particle
        this.particleSystemSnow.particleTexture = new Texture(flareParticleUrl, this.scene);
        // Where the particles come from
        this.particleSystemSnow.emitter = new TransformNode("spawnsnow", this.scene);
        this.particleSystemSnow.emitter.parent = this.player;
        this.particleSystemSnow.emitter.position.z = -1;
        this.particleSystemSnow.minEmitBox = new Vector3(-.2, -.1, 1.5); // Bottom Left Front
        this.particleSystemSnow.maxEmitBox = new Vector3(.2, 0, -.2); // Top Right Back

        // Colors of all particles
        this.particleSystemSnow.color1 = new Color4(0.8, 0.8, 1.0, 1.0);
        this.particleSystemSnow.color2 = new Color4(0.7, 0.7, 1.0, 1.0);
        this.particleSystemSnow.colorDead = new Color4(0.2, 0.2, 0.4, 0.0);

        // Size of each particle (random between...
        this.particleSystemSnow.minSize = 0.025;
        this.particleSystemSnow.maxSize = 0.35;

        // Life time of each particle (random between...
        this.particleSystemSnow.minLifeTime = 0.1;
        this.particleSystemSnow.maxLifeTime = 0.6;

        // Emission rate
        this.particleSystemSnow.emitRate = 4000;

        // Direction of each particle after it has been emitted
        this.particleSystemSnow.direction1 = new Vector3(-3, 0, -SPEED_Z/2);
        this.particleSystemSnow.direction2 = new Vector3(3, 8, -SPEED_Z);

        // Angular speed, in radians
        this.particleSystemSnow.minAngularSpeed = 0;
        this.particleSystemSnow.maxAngularSpeed = Math.PI/4;

        // Speed
        this.particleSystemSnow.minEmitPower = .1;
        this.particleSystemSnow.maxEmitPower = 2;
        this.particleSystemSnow.updateSpeed = 0.0075;

         // Start particle
        this.particleSystemSnow.start();

        
    }
    
    addLight(){
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.collisionsEnabled = true;
        //this.scene.gravity = new Vector3(0, -0.15, 0);
        var pipeline = new DefaultRenderingPipeline("default", true, this.scene, [this.camera]);

        pipeline.glowLayerEnabled = true;
        pipeline.glowLayer.intensity = 0.35;
        pipeline.glowLayer.blurKernelSize = 16;
        pipeline.glowLayer.ldrMerge = true;
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1;

    }

    addInspector() {
        this.scene.debugLayer.show();
    }
}

export default Game;
