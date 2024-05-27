import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, SceneLoader, Vector3 } from "@babylonjs/core";
import cubeModel from "../assets/models/ice_cube.glb";


class Pole{
    constructor(x,y,z,left,right,scene){
        this.loadPole(scene).then(() => {
            this.poleModel.meshes[0].position = new Vector3(x,y,z);

            this.poleBox = MeshBuilder.CreateBox("poleBox", {width: 0.5, height: 100, depth: 0.5}, scene);
            this.poleBox.position = new Vector3(x,y,z);
            this.poleBox.checkCollisions = true;
            this.poleBox.isVisible = false;
            //this.poleBox.name = "poleBox";

            this.createTrigger(left,right,scene);

        });
    }

    async loadPole(scene){
        this.poleModel = await SceneLoader.ImportMeshAsync("","",cubeModel,scene);
        this.poleModel.meshes[0].scaling = new Vector3(0.5,10,0.5);
        this.poleModel.meshes[0].name = "pole";
        this.poleModel.meshes[0].checkCollisions = true;
    }

    createTrigger(left,right,scene){
        var width = 100;
        this.leftTrigger = MeshBuilder.CreateBox("leftTrigger"+left, {width: width, height: 20, depth: 0.5}, scene);
        
        var x = this.poleBox.position.x;
        var y = this.poleBox.position.y;
        var z = this.poleBox.position.z;
        x = x - width/2 - 0.5;
        this.leftTrigger.position = new Vector3(x,y,z);

        this.leftTrigger.isVisible = false;

        this.rightTrigger = MeshBuilder.CreateBox("rightTrigger"+right, {width: width, height: 20, depth: 0.5}, scene);
        x = this.poleBox.position.x;
        this.rightTrigger.position = new Vector3(x + width/2 + 0.5,y,z);
        this.rightTrigger.isVisible = false;

        
    }

}

export default Pole;