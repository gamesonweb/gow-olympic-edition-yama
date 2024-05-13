import { FollowCamera, MeshBuilder, SceneLoader, Vector3 } from "@babylonjs/core";

import playerMesh  from "../assets/models/player.glb";
import playerSki from "../assets/models/player_ski.glb";

const SPEEDX = 30;
const SPEEDZ = 10;
var GRAVITY = 1.0;
var VELOCITY = 0;
var VELOCITY2 = 0;
var DIRECTION = 0;


class Player {
  constructor(name) {
    this.name = name;
    this.playerBox;
    this.createBox();
    

    this.player;
    this.inputMap = {};
    this.actions = {};

    this.platformsList = [];
    this.angleList = [];
    this.resAnim;

    this.turnright = false;
    this.turnleft = false;
    this.endrightAnimation = false;

  }

  async createbody(scene){
    let res = await SceneLoader.ImportMeshAsync("", "", playerSki, scene);
    this.player = res.meshes[0];
    res.meshes.name = "Player";
    res.meshes[0].scaling = new Vector3(1, 1, 1);
    res.animationGroups[0].stop();

    this.resAnim = res
    //res.animationGroups[1].start(true);

    return res;
  }

  createBox(){
    this.playerBox = MeshBuilder.CreateCapsule("playerCap",{width: 0.4, height:1.8});
    this.playerBox.position.y = 1.8/2;
    this.playerBox.parent = this.player
    this.playerBox.isVisible = true;
    this.playerBox.checkCollisions = true;
    console.log("playerBox created")
  }

  updateMove(delta){
    let numeroPlatform = 0;
    
    for(var i = 0; i < this.platformsList.length; i++){
      if(this.playerBox.intersectsMesh(this.platformsList[i], false)){
        numeroPlatform = i;
        break;
      }
    }
    if (VELOCITY2 < 7){
      VELOCITY2 += 0.02;
    }

    VELOCITY = this.angleList[numeroPlatform] * 1.3 + VELOCITY2;

    DIRECTION = -GRAVITY-VELOCITY2

    let newPosition = new Vector3(0, DIRECTION, 0);

    if(!this.turnright && !this.turnleft) this.resAnim.animationGroups[0].stop();
    this.resAnim.animationGroups[0].start(true,1,55,55)


    if(this.inputMap['KeyD']){
      newPosition = new Vector3(-SPEEDX * delta, DIRECTION, 0);
      this.resAnim.animationGroups[0].stop();
      this.resAnim.animationGroups[0].start(true, 1,82,82 );

    }
    else if(this.inputMap['KeyA']){
      newPosition = new Vector3(SPEEDX * delta, DIRECTION, 0);

      this.resAnim.animationGroups[0].stop();
      this.resAnim.animationGroups[0].start(true, 1,20,20 );
      
    }
    this.playerBox.moveWithCollisions(newPosition);
    this.player.position = new Vector3(this.playerBox.position.x, this.playerBox.position.y-1.8/2, this.playerBox.position.z);


  if(this.inputMap['KeyI']){
       // is inspector is displayed hide it otherwise show it
        if(this.scene.debugLayer.isVisible())
          this.scene.debugLayer.hide();
          else this.scene.debugLayer.show();
  }
 }

 createCamera(scene){
    const camera = new FollowCamera("FollowCam", new Vector3(0, 8.5, 8.5), scene);
    camera.lockedTarget = this.playerBox;
    camera.radius = 15;
    camera.heightOffset = 8;
    camera.rotationOffset = 0;    

    return camera;
 }

}


export default Player;