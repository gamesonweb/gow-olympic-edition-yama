import Platform from './platform.js';
import Pole from './pole.js';
import ModelLoading from './3DModelLoading.js';
import Player from './player.js';
import { KeyboardEventTypes } from '@babylonjs/core';

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
        this.addPlatform(0,0,0,50,50,Math.PI/8);
        var maxPlatforms = 10;
        for(var i = 0; i < maxPlatforms; i++){
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
        //this.player.action(scene);
    }



}

export default LevelManager;