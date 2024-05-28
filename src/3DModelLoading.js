import { SceneLoader, Vector3 } from "@babylonjs/core";
import cubeModel from "../assets/models/ice_cube.glb";

class ModelLoading{
    constructor(){
        this.poleModel = null;
    }

    async loadPole(scene){
        this.poleModel = await SceneLoader.ImportMeshAsync("","",cubeModel,scene);
    }
}

export default ModelLoading;