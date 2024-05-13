import { ActionManager, ExecuteCodeAction, HemisphericLight, MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

import groundMesh from "../assets/textures/snow.jpg";
import cubeModel from "../assets/models/ice_cube.glb";

import Scenary from "./Scenary.js";

const MAXPLATFORM = 1000;
var VELOCITY = 0;
const SPEED = 10;
const MAXOBSTACLES = 50;
const MAXTREES = 50;

class FirstLevel{
    constructor(scene, width, height, depth,player){
        this.name = 'FirstLevel';
        this.dimension = {width: width, height: height, depth: depth};
        
        this.listPlatform = [];
        this.listAngle = [];
        this.listObstacle = [];
        this.obstacle;

        this.angle = Math.PI/8;
        this.init(player,scene);
    }

    init(player,scene){
        this.createPlatform(scene);
        this.Scenary = new Scenary();
        
        this.LoadObstacle(scene).then(() => {
            var platformAttached;
            var placementX;

            var platform;
            var previousPlatform = [0, 1, 2, 3, 4, 5];

            for(var i = 0; i < MAXOBSTACLES; i++){

                placementX = Math.random() * 10 - 5;
                platform = Math.floor((Math.random() * this.listPlatform.length));

                while (previousPlatform.includes(platform) || platform%2 == 1){
                    platform = Math.floor(Math.random() * this.listPlatform.length);
                }


                platformAttached = this.listPlatform[platform];
                this.createFlag(platformAttached, placementX);

                previousPlatform.push(platform);
            }
            //this.checkPassage(player, scene);
                
        });
        this.Scenary.LoadTree(scene).then(() => {
            for(var i = 0; i < MAXTREES; i++) {
                var randomSize = Math.random() * 4 + 2;
                var randomIndex = Math.floor(Math.random() * this.listPlatform.length);
                this.Scenary.addTree(this.listPlatform[randomIndex], this.dimension, randomSize );
            }
        });

        this.Scenary.LoadMountain(scene).then(() => {
            this.Scenary.mountains.meshes[0].position.y = -200;
            this.Scenary.mountains.meshes[0].position.z= -100;
            this.Scenary.mountains.checkCollisions = true;
            this.Scenary.mountains.meshes[0].checkCollisions = true;
        });
    }

    async createPlatform(scene){
        let platform = MeshBuilder.CreateBox("platform", {width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth}, scene);
        platform.material = new StandardMaterial("platformMat", scene);
        platform.material.diffuseTexture = new Texture(groundMesh, scene);
        platform.position.y = -platform.scaling.y/2;
        platform.rotation.x =  -(this.angle);
        platform.checkCollisions = true;

        this.listPlatform.push(platform);
        this.listAngle.push(this.angle);

        return this.listPlatform;
    }

    createStraightLine(scene){
        
        for(var i =0; i < MAXPLATFORM; i++){
            this.createPlatform(scene);
        }
        
        for(i =0; i  < this.listPlatform.length -1; i++){
            this.listPlatform[i+1].position.z = this.listPlatform[i].position.z - this.dimension.depth/1.5;
            this.listPlatform[i+1].position.y = this.listPlatform[i].position.y - this.findOtherSideLength(this.dimension.depth, this.angle) / 3.63;
            
        }

        //this.createPlatform(scene);
        //this.createPlatform(scene);
    }

    findOtherSideLength(hypotenuse, angleDegrees) {
        // Convert angle from degrees to radians
        var angleRadians = angleDegrees * (Math.PI / 180);
    
        // Calculate the length of the other side using trigonometry (cosine function)
        var otherSideLength = hypotenuse * Math.cos(angleRadians);
    
        return otherSideLength;
    }

    movePlatform(delta){
        VELOCITY += this.angle * 0.3;
        for(var i = 0; i < this.listPlatform.length; i++){
            this.listPlatform[i].position.z += VELOCITY * delta;
        }
    }

    async LoadObstacle(scene){
        this.obstacle = await SceneLoader.ImportMeshAsync("", "", cubeModel, scene);
        this.obstacle.meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
        this.obstacle.meshes[0].isVisible = false;
    }

    createObstacle(width, height, depth, platformAttached, placementX){
        const obstacle = this.obstacle.meshes[0].clone("obstacle");
        obstacle.scaling = new Vector3(width, height, depth);
        obstacle.position = platformAttached.position.clone();
        obstacle.position.y = platformAttached.position.y;
        obstacle.position.z = platformAttached.position.z;
        obstacle.position.x = platformAttached.position.x + placementX;
        obstacle.isVisible = true;
        obstacle.checkCollisions = true;
        return obstacle;
        
    }

    createFlag(platformAttached, positionX) {
        const width = this.dimension.width

        const factor = 2.9;

        // hitbox a gauche du drapeay
        var obg = this.createObstacle(width / 1.5, 5, .5, platformAttached, (width / 2) + positionX - factor);

        // hitbox a droite du drapeau
        var obd = this.createObstacle(width / 1.5, 5, .5, platformAttached, -((width / 2) - positionX - factor));

        // drapeau
        var obp = this.createObstacle(1, 7, .5, platformAttached, positionX);

        const color = Math.random();

        if (color > 0.5) {
            obp.color = 1;
            obg.pass = true;
            obd.pass = false
        }
        else {
            obp.color = 0;
            obg.pass = false;
            obd.pass = true;
        }

        
        this.listObstacle.push({obg, obp, obd});
    }

    checkPassage(player, scene){
        console.log("//////////")
        console.log(player.playerBox)
        console.log("//////////")
        for(var obstacle = 0; obstacle < this.listObstacle.length; obstacle++){
            var obd = this.listObstacle[obstacle].obd;
            //var obg = this.listObstacle[obstacle].obg;
            //var obp = this.listObstacle[obstacle].obp;

            obd.actionManager = new ActionManager(scene);

            obd.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnIntersectionEnterTrigger, 
                    player.playerBox, () => {
                        console.log("You passed the obstacle");
                }));
        }

    }

}

export default FirstLevel;