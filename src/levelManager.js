import Platform from './platform.js';
import Pole from './pole.js';
import ModelLoading from './3DModelLoading.js';
import Player from './player.js';
import { ActionManager, ExecuteCodeAction, FreeCamera, KeyboardEventTypes, MeshBuilder, Scene, Trajectory, Vector3 } from '@babylonjs/core';

import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import standModel from "../assets/models/seating__bleacher.glb";
import mountainModel from "../assets/models/mount_timpanogos_early_2017.glb";

class LevelManager{
    constructor(){
        this.platforms = [];
        this.poles = [];
        this.player = null;
        this.box = [];
        this.boxRight = [];
        this.currentLevel = 0;
        this.lvl1BestScore = 0;
        this.lvl2BestScore = 0;

        this.addMenuListener();
        
    }

    addMenuListener(scene){
        document.getElementById('menuButton').addEventListener('click', function() {
            var menuContent = document.getElementById('menuContent');
            if (menuContent.style.display === 'none' || menuContent.style.display === '') {
              menuContent.style.display = 'block';
            } else {
              menuContent.style.display = 'none';
            }
          });
    }

    init(scene){
        this.platforms = [];
        this.poles = [];
        this.box = [];

        document.getElementById("bestScore").innerHTML = "Best Score: 0";
        if(this.currentLevel == 1){
            console.log("Best Score: " + this.lvl1BestScore)
            document.getElementById("bestScore").innerHTML = "Best Score: " + this.lvl1BestScore;
        }

        if(this.currentLevel == 2){
            document.getElementById("bestScore").innerHTML = "Best Score: " + this.lvl2BestScore;
        }

        if(this.player != null){
            scene.getMeshByName("playerBox").dispose();
            scene.getMeshByName("playerModel").dispose();
            this.player = null;
        }

        this.deleteAll(scene);

    }

    deleteAll(scene){


        var mountain = scene.getMeshByName("mountain");
        if(mountain != null){mountain.dispose();}

        var tutoPole = scene.getMeshByName("tutorialPole");
        if(tutoPole != null){
            tutoPole.actionManager.dispose();
            tutoPole.dispose();}

        var level1Pole = scene.getMeshByName("level1Pole");
        if(level1Pole != null){
            level1Pole.actionManager.dispose();
            level1Pole.dispose();}

        var level2Pole = scene.getMeshByName("level2Pole");
        if(level2Pole != null){
            level2Pole.actionManager.dispose();
            level2Pole.dispose();}

        var allPole = scene.meshes.filter((mesh) => mesh.name == "poleBox");
        allPole.forEach((pole) => pole.dispose());

        var allPoleModel = scene.meshes.filter((mesh) => mesh.name == "pole");
        allPoleModel.forEach((poleModel) => poleModel.dispose());

        var allLeftTrigger = scene.meshes.filter((mesh) => mesh.name.includes("leftTrigger"));
        allLeftTrigger.forEach((leftTrigger) => leftTrigger.dispose());

        var allRightTrigger = scene.meshes.filter((mesh) => mesh.name.includes("rightTrigger"));
        allRightTrigger.forEach((rightTrigger) => rightTrigger.dispose());
        
        var allPlatform = scene.meshes.filter((mesh) => mesh.name == "platform");
        allPlatform.forEach((platform) => platform.dispose());

        var allBox = scene.meshes.filter((mesh) => mesh.name == "box");
        allBox.forEach((box) => box.dispose());

        var allBoxRight = scene.meshes.filter((mesh) => mesh.name == "boxRight");
        allBoxRight.forEach((boxRight) => boxRight.dispose());

        var allStand = scene.meshes.filter((mesh) => mesh.name == "stand");
        allStand.forEach((stand) => stand.dispose());

        var startPlatform = scene.meshes.filter((mesh) => mesh.name == "StartPlatform");
        startPlatform.forEach((start) => start.dispose());

        var endPlatform = scene.getMeshByName("EndPlatform");
        if(endPlatform != null){endPlatform.dispose();}

        var startTrigger = scene.meshes.filter((mesh) => mesh.name == "startTrigger");
        startTrigger.forEach((start) => start.dispose());
    }

    async loadMountain(scene){
        var mountain = await SceneLoader.ImportMeshAsync("","",mountainModel,scene);
        mountain.meshes[0].scaling = new Vector3(1,1,1);
        mountain.meshes[0].name = "mountain";

    }

    switchLevelMenu(level,scene){
        console.log("hello")
        switch(level){
            case 0:
                this.tutorial(scene);
                break;
            case 1:
                this.level1(scene);
                break;
            case 2:
                this.level2(scene);
                break;
            default:
                break;
        }
    }

    switchLevel(scene){
        setInterval(() => {
            if(this.player != null){
                if(this.player.finished){
                    switch(this.currentLevel){
                        case 1:
                            if(this.player.score > this.lvl1BestScore){
                                this.lvl1BestScore = this.player.score;
                            }
                            
                            break;
                        case 2:
                            if(this.player.score > this.lvl2BestScore){
                                this.lvl2BestScore = this.player.score;
                            }
                            break;
                        default:
                            break;
                    }
                    this.currentLevel++;

                    switch (this.currentLevel) {
                        case 0:
                            this.tutorial(scene);
                            break;
                            
                        case 1:
                            this.init(scene);
                            this.level1(scene);
                            break;
                        case 2:
                            this.init(scene);
                            this.level2(scene);
                            break;

                        default:
                            console.log("No more levels");
                            this.currentLevel = 1;
                            this.init(scene);
                            this.level1(scene);
                            
                            break;
                    }
                }
            }
        }, 1000);
    }

    
    menu(scene){
        console.log("Menu")
        this.init(scene);
        this.switchLevel(scene);
        scene.getEngine().displayLoadingUI();
        this.loadMountain(scene).then(() => {
            
            const freeCamera = new FreeCamera("camera1", new Vector3(0, 20, 15), scene);
            freeCamera.setTarget(new Vector3(15,18,0));
            freeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
            scene.activeCamera = freeCamera;

            var tutoPole = MeshBuilder.CreateCapsule("tutorialPole", {width: 1, height: 10, depth: 1}, scene);
            tutoPole.position = new Vector3(20,10,0);
            tutoPole.actionManager = new ActionManager(scene);
            tutoPole.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPickTrigger,
                        parameter: tutoPole
                    }
                ,() => {
                    console.log("Start game!");
                    this.currentLevel = 0;
                    this.tutorial(scene);
                }
            ));

            var level1Pole = MeshBuilder.CreateCapsule("level1Pole", {width: 1, height: 10, depth: 1}, scene);
            level1Pole.position = new Vector3(15,12,0);
            level1Pole.actionManager = new ActionManager(scene);
            level1Pole.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPickTrigger,
                        parameter: level1Pole
                    }
                ,() => {
                    console.log("Start game!");
                    this.currentLevel = 1;
                    this.level1(scene);
                }
            ));

            var level2Pole = MeshBuilder.CreateCapsule("level2Pole", {width: 1, height: 10, depth: 1}, scene);
            level2Pole.position = new Vector3(10,14,0);
            level2Pole.actionManager = new ActionManager(scene);
            level2Pole.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPickTrigger,
                        parameter: level2Pole
                    }
                ,() => {
                    console.log("Start game!");
                    this.currentLevel = 2;
                    this.level2(scene);
                }
            ));

            

        });
        scene.getEngine().hideLoadingUI();
    }

    tutorial(scene){
        console.log("Tutorial level");
        this.init(scene);
        

        this.addStartPlatform(scene);
        var maxPlatforms = 10;
        for(var i = 1; i < maxPlatforms+1; i++){
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;

            var box = MeshBuilder.CreateBox("box", {width: 30, height: 15, depth: 30}, scene);
            box.position = new Vector3(x - (25+15),y,z);
            this.box.push(box);

            this.addPlatform(x,y,z,width,depth,angle,scene);

            if(i % 3 == 0){
                var left = "True";
                var right = "False";
                var r = Math.random() * 20 - 10;
                if(i%6 == 0){
                    left = "False";
                    right = "True";
                }
                this.addPole(x + r,y,z,left,right,scene);
            }
        }
        this.addEndPlatform(scene,maxPlatforms);
        
        this.addAllPlatform(scene);
        this.addPlayer(scene);
    }

    level1(scene){
        console.log("Level 1");
        this.init(scene);
        this.addStartPlatform(scene);
        var maxPlatforms = 50;
        
        for(var i = 1; i < maxPlatforms+1; i++){
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;

            var box = MeshBuilder.CreateBox("box", {width: 30, height: 20, depth: 50}, scene);
            box.checkCollisions = true;
            box.position = new Vector3(x - (25+15),y,z);
            this.box.push(box);

            
            var boxRight = MeshBuilder.CreateBox("boxRight", {width: 30, height: 20, depth: 50}, scene);
            boxRight.position = new Vector3(x + (25+15),y,z);
            boxRight.checkCollisions = true;
            this.boxRight.push(boxRight);

            this.addPlatform(x,y,z,width,depth,angle,scene);

            if(i % 3 == 0){
                var left = "True";
                var right = "False";
                var r = Math.random() * 20 - 10;
                if(i%6 == 0){
                    left = "False";
                    right = "True";
                }
                this.addPole(x + r,y+5,z-10,left,right,scene);
            }
        }

        console.log(this.poles.length)
        this.addEndPlatform(scene,maxPlatforms);
        this.addAllPlatform(scene);

        this.addPlayer(scene);

    }

    level2(scene){
        console.log("Level 2");
        this.init(scene);
        this.addStartPlatform(scene);
        var maxPlatforms = 50;
        for(var i = 1; i < maxPlatforms+1; i++){
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;

            var box = MeshBuilder.CreateBox("box", {width: 30, height: 20, depth: 50}, scene);
            box.position = new Vector3(x - (25+15),y,z);
            this.box.push(box);

            var boxRight = MeshBuilder.CreateBox("boxRight", {width: 30, height: 20, depth: 50}, scene);
            boxRight.position = new Vector3(x + (25+15),y,z);
            this.boxRight.push(boxRight);

            this.addPlatform(x,y,z,width,depth,angle,scene);

            
            var left = "True";
            var right = "False";
            var r = Math.random() * 20 - 10;
            if(i%2 == 0){
                left = "False";
                right = "True";
            }
            this.addPole(x + r,y,z,left,right,scene);
        }

        this.addEndPlatform(scene,maxPlatforms);
        this.addAllPlatform(scene);
        this.addPlayer(scene);

        

    }

    addPlayer(scene){
        this.player = new Player();
        this.player.loadPlayerOnScene(0,2,0,scene);

        scene.onKeyboardObservable.add((kbInfo) => {
            switch(kbInfo.type){
                case KeyboardEventTypes.KEYDOWN:
                    this.player.inputMap[kbInfo.event.code] = true;
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.player.inputMap[kbInfo.event.code] = false;
                    break;
            }
        });
    }

    addPlatform(x,y,z,width,depth,angle,scene){
        this.platforms.push(new Platform(x,y,z,width,depth,angle,scene));
    }

    addPole(x,y,z,left,right,scene){
        this.poles.push(new Pole(x,y,z,left,right,scene));
    }

    addStartPlatform(scene){
        this.addPlatform(0,0,0,50,25,0,scene);
        this.platforms[0].platform.name = "StartPlatform";

        var startTrigger = MeshBuilder.CreateBox("startTrigger", {width: 50, height: 25, depth: 0.5}, scene);
        startTrigger.position = new Vector3(0,0,25/2);
        startTrigger.isVisible = false;
        startTrigger.checkCollisions = false;


        this.addPlatform(0,-9.6,35,50,50,Math.PI/8);

    }

    addEndPlatform(scene,maxPlatforms){
        this.addPlatform(0,
            this.platforms[maxPlatforms+1].y - this.platforms[maxPlatforms+1].depth * Math.sin(this.platforms[maxPlatforms+1].angle) + 10,
            this.platforms[maxPlatforms+1].z + this.platforms[maxPlatforms+1].depth-4,
            50,50,0,scene
        )
        this.platforms[this.platforms.length-1].platform.name = "EndPlatform";

        if(scene.getMeshByName("end") != null){
            scene.getMeshByName("end").position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-25);
            scene.getMeshByName("end2").position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-20);
            scene.getMeshByName("end3").position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-15);
            scene.getMeshByName("end4").position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-10);
        }
        
        else{
            var endTrigger = MeshBuilder.CreateBox("end", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger.position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-25);
            endTrigger.isVisible = false;
            endTrigger.checkCollisions = false;

            var endTrigger2 = MeshBuilder.CreateBox("end2", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger2.position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-20);
            endTrigger2.isVisible = false;
            endTrigger2.checkCollisions = false;

            var endTrigger3 = MeshBuilder.CreateBox("end3", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger3.position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-15);
            endTrigger3.isVisible = false;
            endTrigger3.checkCollisions = false;

            var endTrigger4 = MeshBuilder.CreateBox("end4", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger4.position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-10);
            endTrigger4.isVisible = false;
            endTrigger4.checkCollisions = false;
        }
    }

    addAllPlatform(scene){
        for(var i =0; i < this.box.length; i++){
            this.addStand(this.box[i].position.x +45,this.box[i].position.y+7,this.box[i].position.z - 30,scene);
        }
    }

    async addStand(x,y,z,scene){
        this.stand = await SceneLoader.ImportMeshAsync("","",standModel,scene);
        this.stand.meshes[0].scaling = new Vector3(3,3,3);
        this.stand.meshes[0].name = "stand";
        //this.stand.meshes[0].checkCollisions = true;
        this.stand.meshes[0].isVisible = false;
        this.stand.meshes[0].rotateAround(new Vector3(0,0,0), new Vector3(0,0,0), Math.PI);
        this.stand.meshes[0].position = new Vector3(x,y,z);
    }





}

export default LevelManager;