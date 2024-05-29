import { ActionManager, Color3, ExecuteCodeAction, Mesh, MeshBuilder, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";
import cubeModel from "../assets/models/ice_cube.glb";


class Pole{
    constructor(x,y,z,left,right,scene){
        this.loadPole(scene).then(() => {
            this.poleModel.position = new Vector3(x,y,z);

            this.poleBox = MeshBuilder.CreateBox("poleBox", {width: 0.5, height: 100, depth: 0.5}, scene);
            this.poleBox.position = new Vector3(x,y,z);
            this.poleBox.checkCollisions = true;
            this.poleBox.isVisible = false;

            if(left =="True"){
                var blueMaterial = new StandardMaterial("blueMaterial", scene);
                blueMaterial.diffuseColor = new Color3(0, 0, 255); // bleu
                this.poleModel.material = blueMaterial;
            }
            else{
                var redMaterial = new StandardMaterial("redMaterial", scene);
                redMaterial.diffuseColor = new Color3(255, 0, 0); // rouge
                this.poleModel.material = redMaterial;
            }



            this.createTrigger(left,right,scene);

        });
    }

    async loadPole(scene){
        this.poleModel = MeshBuilder.CreateCylinder("pole", {diameter: 0.5, height: 25}, scene);
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