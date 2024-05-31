import Platform from './platform.js';
import Pole from './pole.js';
import ModelLoading from './3DModelLoading.js';
import Player from './player.js';
import MusicLoader from './Music.js';
import ActionMenu from './actionMenu.js';
import { ActionManager, Color3, ExecuteCodeAction, FreeCamera, KeyboardEventTypes, MeshBuilder, Scene, StandardMaterial, Trajectory, Vector3 } from '@babylonjs/core';

import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import standModel from "../assets/models/seating__bleacher.glb";


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
        this.lvl3BestScore = 0;
        this.lvl4BestScore = 0;
        this.notExist = true;
        this.ModelLoading = new ModelLoading();
        this.MusicLoader = new MusicLoader();
        this.ActionMenu = new ActionMenu(this.MusicLoader,this);
        
    }

    init(scene){
        this.platforms = [];
        this.poles = [];
        this.box = [];
        //this.MusicLoader.stopMenuMusic();

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

        this.ModelLoading.deleteAll(scene);

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
                        case 3:
                            if(this.player.score > this.lvl3BestScore){
                                this.lvl3BestScore = this.player.score;
                            }
                            break;
                        case 4:
                            if(this.player.score > this.lvl4BestScore){
                                this.lvl4BestScore = this.player.score;
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
                            this.MusicLoader.playLevelMusic(1);
                            this.level2(scene);
                            break;
                        case 3:
                            this.init(scene);
                            this.MusicLoader.playLevelMusic(0);
                            this.level3(scene);
                            break;
                        case 4:
                            this.init(scene);
                            this.MusicLoader.playLevelMusic(1);
                            this.level4(scene);
                            break;

                        default:
                            console.log("No more levels");
                            this.menu(scene);
                            
                            break;
                    }
                }
            }
        }, 1000);
    }

    menu(scene){
        console.log("Menu");
        ////Loading all assets
        this.ModelLoading.loadTree(scene);
        this.ModelLoading.loadStand(scene);


        this.MusicLoader.playMenuMusic();
        this.MusicLoader.stopLevelMusic(0);
        this.MusicLoader.stopLevelMusic(1);

        this.init(scene);
        this.switchLevel(scene);
        scene.getEngine().displayLoadingUI();
        this.ModelLoading.loadMountain(scene).then(() => {
            const freeCamera = new FreeCamera("camera1", new Vector3(0, 50,150 ), scene);
            freeCamera.setTarget(new Vector3(0,45,0));
            freeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
            scene.activeCamera = freeCamera;

            this.ActionMenu.menuTutorial(scene);
            this.ActionMenu.menuLevel1(scene);
            this.ActionMenu.menuLevel2(scene);
            this.ActionMenu.menuLevel3(scene);
            this.ActionMenu.menuLevel4(scene);

            this.MusicLoader.playMenuMusic();
        });

        this.ModelLoading.loadFallingSnow(scene).then(() => {
            scene.getMeshByName("snowflake").position = new Vector3(0,0,0);
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

            var box = this.ModelLoading.scenaryCube(x,y,z,true,scene);
            this.box.push(box);

            var boxRight = this.ModelLoading.scenaryCube(x,y,z,false,scene);
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
                this.addPole(x + r,y,z,left,right,scene);
            }
        }
        this.addEndPlatform(scene,maxPlatforms);
        this.addReset(scene);
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

            var box = this.ModelLoading.scenaryCube(x,y,z,true,scene);
            this.box.push(box);

            
            var boxRight = this.ModelLoading.scenaryCube(x,y,z,false,scene);
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
        this.addEndPlatform(scene,maxPlatforms);
        this.addReset(scene);
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

            var box = this.ModelLoading.scenaryCube(x,y,z,true,scene);
            this.box.push(box);

            var boxRight = this.ModelLoading.scenaryCube(x,y,z,false,scene);
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
        this.addReset(scene);
        this.addPlayer(scene);

        

    }

    level3(scene){
        console.log("Level 3");
        this.init(scene);
        this.addStartPlatform(scene);
        var maxPlatforms = 100;
        for(var i = 1; i < maxPlatforms+1; i++){
            var pLeft = false;
            var pRight = false;
            var cantTurn = false;
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;

            if(i >= 10 && i %9==0){
                x = x + width/2;
                pLeft = true;
                cantTurn = true;

            }

            if(i >= 10 && i %3==0 && !cantTurn){
                x = x - width/2;
                pRight = true;
            }

            var box = this.ModelLoading.scenaryCube(x,y,z,true,scene);
            this.box.push(box);

            var boxRight = this.ModelLoading.scenaryCube(x,y,z,false,scene);
            this.boxRight.push(boxRight);

            this.addPlatform(x,y,z,width,depth,angle,scene);

            if(i % 3 == 0){
                var left = "True";
                var right = "False";
                var r = Math.random() * 30 - 15;
                if(pLeft){
                    r = Math.random() * (0 - (-20)) + (-20);
                }
                if(pRight){
                    r = Math.random() * (20 - 0) + 0;
                }
                if(i%6 == 0){
                    left = "False";
                    right = "True";
                }
                this.addPole(x + r,y,z,left,right,scene);
            }
        }
        this.addEndPlatform(scene,maxPlatforms);
        this.addReset(scene);
        this.addPlayer(scene);
    }

    level4(scene){
        console.log("Level 4");
        this.init(scene);
        this.addStartPlatform(scene);
        var maxPlatforms = 100;
        for(var i = 1; i < maxPlatforms+1; i++){
            var pLeft = false;
            var pRight = false;
            var cantTurn = false;
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;

            if(i >= 10 && i %9==0){
                x = x + width/2;
                pLeft = true;
                cantTurn = true;

            }

            if(i >= 10 && i %3==0 && !cantTurn){
                x = x - width/2;
                pRight = true;
            }

            var box = this.ModelLoading.scenaryCube(x,y,z,true,scene);
            this.box.push(box);

            var boxRight = this.ModelLoading.scenaryCube(x,y,z,false,scene);
            this.boxRight.push(boxRight);

            this.addPlatform(x,y,z,width,depth,angle,scene);

            var left = "True";
            var right = "False";
            var r = Math.random() * 30 - 15;
            if(pLeft){
                r = Math.random() * (0 - (-20)) + (-20);
            }
            if(pRight){
                r = Math.random() * (20 - 0) + 0;
            }
            if(i%2 == 0){
                left = "False";
                right = "True";
            }
            this.addPole(x + r,y,z,left,right,scene);
        }
        this.addEndPlatform(scene,maxPlatforms);
        this.addReset(scene);
        this.addPlayer(scene);
    }

    addPlayer(scene){
        this.player = new Player(this.MusicLoader);
        this.player.loadPlayerOnScene(0,2,0,scene);

        if(this.notExist){
            scene.onKeyboardObservable.add((kbInfo) => {
                switch(kbInfo.type){
                    case KeyboardEventTypes.KEYDOWN:
                        this.player.inputMap[kbInfo.event.code] = true;
                        this.rotatePlayer(kbInfo);
                        break;
                    case KeyboardEventTypes.KEYUP:
                        this.player.inputMap[kbInfo.event.code] = false;
                        this.rotatePlayer(kbInfo);
                        break;
                }
            });

            this.notExist = false;
        }
        
        this.rotateLeft = false;
        this.rotateRight = false;


    }

    rotatePlayer(kbInfo){
        if(kbInfo.type == KeyboardEventTypes.KEYDOWN){
            if((kbInfo.event.code == "KeyA" || kbInfo.event.code == "KeyQ") && !this.rotateLeft){
                this.rotateLeft = true;
                this.player.player.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), -Math.PI/8);
            }
            if(kbInfo.event.code == "KeyD" && !this.rotateRight){
                this.rotateRight = true;
                this.player.player.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI/8);
            }
        }

        if(kbInfo.type == KeyboardEventTypes.KEYUP){
            if(kbInfo.event.code == "KeyA" || kbInfo.event.code == "KeyQ"){
                this.rotateLeft = false;
                this.player.player.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI/8);
            }
            if(kbInfo.event.code == "KeyD"){
                this.rotateRight = false;
                this.player.player.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), -Math.PI/8);
            }
        }

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

        var startTrigger = MeshBuilder.CreateBox("starttrigger", {width: 50, height: 25, depth: 0.5}, scene);
        startTrigger.position = new Vector3(0,0,25/2);
        startTrigger.isVisible = false;
        startTrigger.checkCollisions = false;


        this.addPlatform(0,-9.6,35,50,50,Math.PI/8);

    }

    addEndPlatform(scene,maxPlatforms){
        this.addPlatform(this.platforms[this.platforms.length-1].x,
            this.platforms[this.platforms.length-1].y - this.platforms[this.platforms.length-1].depth * Math.sin(this.platforms[this.platforms.length-1].angle) + 10,
            this.platforms[this.platforms.length-1].z + this.platforms[this.platforms.length-1].depth-4,
            50,50,0,scene
        )
        this.platforms[this.platforms.length-1].platform.name = "EndPlatform";

        if(scene.getMeshByName("end") != null){
            scene.getMeshByName("end").position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-25);
            scene.getMeshByName("end2").position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-20);
            scene.getMeshByName("end3").position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-15);
            scene.getMeshByName("end4").position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-10);
        }
        
        else{
            var endTrigger = MeshBuilder.CreateBox("end", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger.position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-25);
            endTrigger.isVisible = false;
            endTrigger.checkCollisions = false;

            var endTrigger2 = MeshBuilder.CreateBox("end2", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger2.position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-20);
            endTrigger2.isVisible = false;
            endTrigger2.checkCollisions = false;

            var endTrigger3 = MeshBuilder.CreateBox("end3", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger3.position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-15);
            endTrigger3.isVisible = false;
            endTrigger3.checkCollisions = false;

            var endTrigger4 = MeshBuilder.CreateBox("end4", {width: 50, height: 25, depth: 0.5}, scene);
            endTrigger4.position = new Vector3(this.platforms[this.platforms.length-1].x,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-10);
            endTrigger4.isVisible = false;
            endTrigger4.checkCollisions = false;
        }
    }

    addReset(scene){
        var reset = MeshBuilder.CreateBox("reset", {width: 1000, height: 5, depth: 1000}, scene);
        reset.position = new Vector3(0,-1000,0);
        reset.isVisible = false;
        reset.checkCollisions = false;
    }

  

}

export default LevelManager;