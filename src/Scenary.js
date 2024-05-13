import {MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

import tree1 from "../assets/models/fur_tree.glb";
import mountain from "../assets/models/snowy_mountain.glb";

class Scenary{
    constructor(){
        this.tree;
        this.scaling = 3;
        this.mountains;
    }

    async LoadTree(scene){
        this.tree = await SceneLoader.ImportMeshAsync("", "", tree1, scene);
        this.tree.meshes[0].scaling = new Vector3(this.scaling, this.scaling, this.scaling);
        this.tree.meshes[0].isVisible = false;
        this.tree.meshes[0].position.z = 10;
    }

    addTree(platform, dimension,scaling){
        this.scaling = scaling;
        const tree = this.tree.meshes[0].clone("tree");
        tree.position = platform.position.clone();
        tree.scaling = new Vector3(this.scaling, this.scaling, this.scaling);
        tree.position.y = platform.position.y;
        tree.position.z = platform.position.z;
        if(Math.floor(Math.random() * 2 - 1 ) >=0)
            tree.position.x = platform.position.x + (dimension.width/2 );
        else
            tree.position.x = platform.position.x - (dimension.width/2);
        tree.isVisible = true;
        tree.checkCollisions = false;
    }

    async LoadMountain(scene){
        this.mountains = await SceneLoader.ImportMeshAsync("", "", mountain, scene);
        this.mountains.meshes[0].scaling = new Vector3(5,5,5);
        this.mountains.meshes[0].isVisible = true;
        this.mountains.meshes[0].position.z = 10;



    }


}

export default Scenary;