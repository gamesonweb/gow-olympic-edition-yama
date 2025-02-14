import { ActionManager, Color4, ExecuteCodeAction, FollowCamera, MeshBuilder, ParticleSystem, PhysicsImpostor, SceneLoader, Texture, TransformNode, Vector3 } from "@babylonjs/core";
import playerMesh  from "../assets/models/skiier.glb";

var MOVEX = 30;
var MOVEY = 4;
var MOVEZ = 10;
var GRAVITY = -1.0;

const TOPSPEED = 10;

class Player{
    constructor(musicLoader){
        this.name = "player";
        this.inputMap = {};
        this.camera;
        this.currentSpeed = 0;
        this.score = 0;
        this.combo = 0;
        this.updateScore();
        this.finished = false;
        this.multiplicateur = 1;

        this.musicLoader = musicLoader;
    }

    loadPlayerOnScene(x,y,z,scene){
        this.loadPlayer(x,y,z,scene).then(() => {
            this.attachCamera(scene);
        });
        
    }

    async loadPlayer(x,y,z,scene){
        var player = await SceneLoader.ImportMeshAsync("", "", playerMesh, scene);
        player.meshes[0].scaling = new Vector3(0.5,0.5,0.5);
        player.meshes[0].rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI/2);
        //player.meshes[0].rotateAround(new Vector3(0,0,0), new Vector3(1,0,0), Math.PI/8);
        player.meshes[0].name = "playerModel";
        //player.animationGroups[0].stop();
        //player.animationGroups[1].start(true);


        this.player = player.meshes[0];

        this.playerBox = MeshBuilder.CreateCapsule("playerBox", {height: 1.8, radius: 0.5}, scene);
        this.playerBox.position = new Vector3(x,y,z);
        this.playerBox.checkCollisions = true;
        this.playerBox.isVisible = false;

    
        player.meshes[0].position.x = this.playerBox.position.x;
        player.meshes[0].position.y = this.playerBox.position.y - 1.8/2; 
        player.meshes[0].position.z = this.playerBox.position.z;

        this.action(scene);

    }

    attachCamera(scene){
        var followCamera = new FollowCamera("FollowCamera", new Vector3(0, -500, 1000), scene);
            followCamera.radius = 20;
            followCamera.heightOffset = 10;
            followCamera.rotationOffset = 180;
            followCamera.cameraAcceleration = 0.1;
            followCamera.maxCameraSpeed = 5;
            //followCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
            followCamera.lockedTarget = this.playerBox;
            scene.activeCamera = followCamera;
        this.camera = followCamera;
    }

    attachPlayerModel(){
        this.player.position.x = this.playerBox.position.x;
        this.player.position.y = this.playerBox.position.y - 1.8/2; 
        this.player.position.z = this.playerBox.position.z;
    }

    action(scene){
        var player = this.playerBox;
        player.actionManager = new ActionManager(scene);

        var allPole = scene.meshes.filter((mesh) => mesh.name == "poleBox");

        allPole.forEach((pole) => {
            player.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: pole
                    }
                ,() => {
                    console.log("Hit a pole!");
                    this.musicLoader.playLoseSound();
                    if(this.score <= 2){
                        this.score = 0;
                    }
                    else{
                        this.score -= 3;
                    }
                    this.combo = 0;
                    this.multiplicateur = 1;
                    this.updateCombo();
                    
                    this.updateScore();
                    console.log("Score: " + this.score);
                }
                )
            )
        });

        var allTriggers = scene.meshes.filter((mesh) => mesh.name.includes("Trigger"));
        allTriggers.forEach((trigger) => {
            player.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: trigger
                    }
                ,() => {
                    console.log("Hit a trigger!");
                    if(trigger.name.includes("True")){
                        this.score += 5 * this.multiplicateur;
                        this.musicLoader.playWinSound();
                        this.combo += 1;
                        this.updateCombo();
                    }
                    else{
                        this.musicLoader.playLoseSound();
                        if(this.score <= 4){
                            this.score = 0;
                        }
                        else{
                            this.score -= 5;
                        }
                        this.combo = 0;
                        this.multiplicateur = 1;
                        this.updateCombo();
                    }
                    this.updateScore();
                    console.log("Score: " + this.score);
                }
                )
            )
        });

        var endPlatform = scene.meshes.filter((mesh) => mesh.name == "end");
        endPlatform.forEach((end) => {
            player.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: end
                    }
                ,() => {
                    this.player.rotateAround(new Vector3(0,0,0), new Vector3(1,0,0), -Math.PI/8);
                    console.log("Finished!");
                    this.finished = true;
                    this.combo = 0;
                    this.multiplicateur = 1;
                    this.updateCombo();
                }
                )
            );
        });

        var startPlatform = scene.getMeshByName("starttrigger");
        player.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: startPlatform
                }
            ,() => {
                console.log("Start!");
                this.player.rotateAround(new Vector3(0,0,0), new Vector3(1,0,0), Math.PI/8);
                this.finished = false;
                this.currentSpeed = 0;
                this.score = 0;
                this.updateScore();
            }
            )
        );

        var reset = scene.getMeshByName("reset");
        player.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: reset
                }
            ,() => {
                if(this.finished == false){
                    console.log("Reset!");
                    this.playerBox.position = new Vector3(0,0,0);
                    //this.player.rotateAround(new Vector3(0,0,0), new Vector3(1,0,0), Math.PI/8);
                    this.finished = false;
                    this.currentSpeed = 0;
                    this.score = 0;
                    this.updateScore();
                }
            }
            )
        );

        player.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter: reset
                }
            ,() => {
                console.log("Reset!");
                if(this.finished == false){
                    this.playerBox.position = new Vector3(0,0,0);
                    //this.player.rotateAround(new Vector3(0,0,0), new Vector3(1,0,0), Math.PI/8);
                    this.finished = false;
                    this.currentSpeed = 0;
                    this.score = 0;
                    this.updateScore();
                }
            }
            )
        );
        
    }

    updateMove(delta){
        if(this.playerBox != undefined){
            if(this.currentSpeed < TOPSPEED && !this.finished){
                this.currentSpeed += 0.02;
            }

            else{
                if(this.currentSpeed > 0 && this.finished){
                    this.currentSpeed -= 0.75;
                }
                if(this.currentSpeed <= 0){
                    this.currentSpeed = 0;
                }
            }
            var x = 0;
            var y = GRAVITY - this.currentSpeed;
            var z = 0;

            if(this.finished){
                y = GRAVITY;
                z = this.currentSpeed;
            }

            if(this.inputMap['KeyQ'] || this.inputMap['KeyA']){
                //this.playerBox.position.x -= MOVEX * delta;
                x = -(MOVEX * delta);
            }
            if(this.inputMap['KeyD']){
                //this.playerBox.position.x += MOVEX * delta;
                x = MOVEX * delta;
            }

            if(this.inputMap['KeyW'] || this.inputMap['KeyZ']){
                //this.playerBox.position.z -= MOVEZ * delta;
                z = +(MOVEZ * delta);
                if(this.currentSpeed < TOPSPEED){
                    this.currentSpeed += 0.2;
                }
            }

            if(this.inputMap['KeyS']){
                //this.playerBox.position.z += MOVEZ * delta;
                //z = -(MOVEZ * delta);
                if(this.currentSpeed > 2){
                    this.currentSpeed -= 0.2;
                }
            }
            this.updatePosition(x,y,z);
        }
        //console.log(this.currentSpeed);
    }

    updatePosition(x,y,z){
        this.playerBox.moveWithCollisions(new Vector3(x,y,z));
        this.attachPlayerModel();
    }

    updateScore(){
        document.getElementById("score").innerHTML = "Score: " + this.score;
    }

    updateCombo(){
        
        if(this.combo >= 10){
            document.getElementById("comboCounter").style.color = "Green";
            document.getElementById("comboCounter").style.fontSize = "40px";
            this.multiplicateur = 1.25;
        }
        if(this.combo >= 20){
            document.getElementById("comboCounter").style.color = "Blue";
            document.getElementById("comboCounter").style.fontSize = "40px";
            this.multiplicateur = 1.5;
        }
        if(this.combo >= 30){
            document.getElementById("comboCounter").style.color = "Purple";
            document.getElementById("comboCounter").style.fontSize = "45px";
            this.multiplicateur = 1.75;
        }
        if(this.combo >= 40){
            document.getElementById("comboCounter").style.color = "Red";
            document.getElementById("comboCounter").style.fontSize = "50px";
            this.multiplicateur = 2;
        }
        if(this.combo >= 80){
            document.getElementById("comboCounter").style.color = "Gold";
            document.getElementById("comboCounter").style.fontSize = "60px";
            this.multiplicateur = 3;
        }
        if(this.combo < 10){
            document.getElementById("comboCounter").style.color = "White";
            document.getElementById("comboCounter").style.fontSize = "35px";
            document.getElementById("comboCounter").style.fontWeight = "bold";
        }

        if(this.combo == 0){
            document.getElementById("comboCounter").innerHTML = "";
        }
        else{
            document.getElementById("comboCounter").innerHTML = "x" + this.combo;
        }
    }


}

export default Player;