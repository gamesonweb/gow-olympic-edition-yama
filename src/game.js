import { BoundingInfo, Camera, Color3, Color4, CubeTexture, DefaultRenderingPipeline, FollowCamera, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import LevelManager from "./levelManager.js";


class Game {
    engine;
    canvas;
    scene;
    activeCamera;


    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.activeCamera = null;

        // Set the target frame rate to 60 fps
        this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));
        this.targetFPS = 144;
        this.frameDuration = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
    }

    init() {
        this.engine.displayLoadingUI();
        console.log("Game is initializing...");
        this.createScene().then(() => {
            this.engine.hideLoadingUI();
        });
        
        

    }

    start() {
        this.engine.runRenderLoop(() => {
            const now = performance.now();
            const delta = (now - this.lastFrameTime) / 1000;

            if (delta >= 1 / this.targetFPS) {
                if (this.levelM.player != null) {
                    this.levelM.player.updateMove(delta);
                }
                this.scene.render();
                this.lastFrameTime = now;
            }
        });

    }

    async createScene() {

        this.scene = new Scene(this.engine);

        const freeCamera = new FreeCamera("FreeCamera", new Vector3(0, 5, -10), this.scene);
        freeCamera.setTarget(Vector3.Zero());
        freeCamera.attachControl(this.canvas, true);
        
        
        this.levelM = new LevelManager();
        this.levelM.tutorial(this.scene);

        this.addLight();

        
    }
    
    addLight(){
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new Vector3(0, -0.15, 0);
        var pipeline = new DefaultRenderingPipeline("default", true, this.scene, [this.camera]);

        pipeline.glowLayerEnabled = true;
        pipeline.glowLayer.intensity = 0.35;
        pipeline.glowLayer.blurKernelSize = 16;
        pipeline.glowLayer.ldrMerge = true;
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

    }

    addInspector() {
        this.scene.debugLayer.show();
    }
}

export default Game;