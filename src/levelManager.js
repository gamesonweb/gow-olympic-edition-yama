import Platform from './platform.js';
import Pole from './pole.js';
import ModelLoading from './3DModelLoading.js';
import Player from './player.js';
import { KeyboardEventTypes, MeshBuilder, Vector3 } from '@babylonjs/core';

class LevelManager{
    constructor(){
        this.platforms = [];
        this.poles = [];
        this.player = null;
    }

    addPlatform(x,y,z,width,depth,angle,scene){
        this.platforms.push(new Platform(x,y,z,width,depth,angle,scene));
    }

    addPole(x,y,z,scene){
        this.poles.push(new Pole(x,y,z,scene));
    }

    tutorial(scene){
        console.log("Tutorial level");
       
        this.addStartPlatform(scene);
        var maxPlatforms = 10;
        for(var i = 1; i < maxPlatforms+1; i++){
            var x = this.platforms[i].x;
            var y = this.platforms[i].y - this.platforms[i].depth * Math.sin(this.platforms[i].angle);
            var z = this.platforms[i].z + this.platforms[i].depth-4;
            var width = this.platforms[i].width;
            var depth = this.platforms[i].depth;
            var angle = this.platforms[i].angle;
            this.addPlatform(x,y,z,width,depth,angle,scene);

            if(i % 3 == 0){
                var r = Math.random() * 20 - 10;
                this.addPole(x + r,y,z,scene);
            }
        }
        this.addEndPlatform(scene,maxPlatforms);
        

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
        var endTrigger = MeshBuilder.CreateBox("endTrigger", {width: 50, height: 25, depth: 0.5}, scene);
        endTrigger.position = new Vector3(0,this.platforms[this.platforms.length-1].y,this.platforms[this.platforms.length-1].z-25);
        endTrigger.isVisible = false;
        endTrigger.checkCollisions = false;
    }



}

export default LevelManager;