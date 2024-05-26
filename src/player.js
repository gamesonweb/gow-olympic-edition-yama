import { ActionManager, ExecuteCodeAction, FollowCamera, MeshBuilder, PhysicsImpostor, SceneLoader, Vector3 } from "@babylonjs/core";
import playerMesh  from "../assets/models/player.glb";

var MOVEX = 10;
var MOVEY = 4;
var MOVEZ = 10;

class Player{
    constructor(){
        this.name = "player";
        this.inputMap = {};
        this.camera;
    }

    loadPlayerOnScene(x,y,z,scene){
        this.loadPlayer(x,y,z,scene).then(() => {
            this.attachCamera(scene);
        });
        this.score = 0;
    }

    async loadPlayer(x,y,z,scene){
        var player = await SceneLoader.ImportMeshAsync("", "", playerMesh, scene);
        player.meshes[0].scaling = new Vector3(1,1,1);
        player.meshes[0].rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI);
        player.name = "playerModel";
        player.animationGroups[0].stop();
        player.animationGroups[1].start(true);

        this.player = player.meshes[0];

        this.playerBox = MeshBuilder.CreateCapsule("playerBox", {height: 1.8, radius: 0.5}, scene);
        this.playerBox.position = new Vector3(x,y,z);

    
        player.meshes[0].position.x = this.playerBox.position.x;
        player.meshes[0].position.y = this.playerBox.position.y - 1.8/2; 
        player.meshes[0].position.z = this.playerBox.position.z;

        this.action(scene);

    }

    attachCamera(scene){
        var followCamera = new FollowCamera("FollowCamera", new Vector3(0, 10, -10), scene);
            followCamera.radius = 20;
            followCamera.heightOffset = 10;
            followCamera.rotationOffset = 180;
            followCamera.cameraAcceleration = 0.1;
            followCamera.maxCameraSpeed = 5;
            //followCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
            followCamera.lockedTarget = this.player;
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
                    if(this.score <= 0){
                        this.score = 0;
                    }
                    else{
                        this.score -= 3;
                    }
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
                        this.score += 5;
                    }
                    else{
                        if(this.score <= 0){
                            this.score = 0;
                        }
                        else{
                            this.score -= 5;
                        }
                    }
                    console.log("Score: " + this.score);
                }
                )
            )
        });
        
    }

    updateMove(delta){
        //console.log(this.inputMap);
        if(this.inputMap['ShiftLeft'] == true){
            MOVEX = 20;
            MOVEZ = 20;
            MOVEY = 8;
        }
        else{
            MOVEX = 10;
            MOVEZ = 10;
            MOVEY = 4;
        }
        if(this.inputMap['KeyQ'] || this.inputMap['KeyA']){
            this.playerBox.position.x -= MOVEX * delta;
            this.attachPlayerModel();
        }
        if(this.inputMap['KeyD']){
            this.playerBox.position.x += MOVEX * delta;
            this.attachPlayerModel();
        }

        if(this.inputMap['KeyW'] || this.inputMap['KeyZ']){
            this.playerBox.position.z += MOVEZ * delta;
            this.playerBox.position.y -= MOVEY * delta;
            this.attachPlayerModel();
        }

        if(this.inputMap['KeyS']){
            this.playerBox.position.z -= MOVEZ * delta;
            this.playerBox.position.y += MOVEY * delta;
            this.attachPlayerModel();
        }
    }


}

export default Player;