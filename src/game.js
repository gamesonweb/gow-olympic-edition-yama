import { BoundingInfo, Camera, Color3, Color4, CubeTexture, DefaultRenderingPipeline, FollowCamera, FreeCamera, HDRCubeTexture, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, PBRMaterial, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import LevelManager from "./levelManager.js";
import sky from "../assets/models/sky.hdr";


class Game {
    engine;
    canvas;
    scene;
    activeCamera;


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

        this.addSkyBox();
        
        
        this.levelM = new LevelManager();
        this.levelM.menu(this.scene);

        this.addLight();
        
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

    addSkyBox(){
        var hdrTexture = new HDRCubeTexture(sky, this.scene, 1024);
        hdrTexture.coordinatesMode = Texture.SKYBOX_MODE;
        hdrTexture.level = 1;
        this.scene.createDefaultSkybox(hdrTexture, true, 10000);
    }
}

export default Game;
