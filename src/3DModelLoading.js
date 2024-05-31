import { MeshBuilder, SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import cubeModel from "../assets/models/ice_cube.glb";
import mountainModel from "../assets/models/snowy_mountain.glb";
import snowflakeModel from "../assets/models/falling_snow_loop.glb";
import treeModel from "../assets/models/fur_tree.glb";
import standModel from "../assets/models/seating__bleacher.glb";
import snowTexture from "../assets/textures/6_snow_texture-seamless.jpg";

const MAXTREE = 10;
class ModelLoading{
    constructor(){
        this.tree = null;
        this.stand = null;
    }

    async loadMountain(scene){
        var mountain = await SceneLoader.ImportMeshAsync("","",mountainModel,scene);
        mountain.meshes[0].scaling = new Vector3(1,1,1);
        mountain.meshes[0].name = "mountain";
    }

    async loadFallingSnow(scene){
        var snowflake = await SceneLoader.ImportMeshAsync("","",snowflakeModel,scene);
        snowflake.meshes[0].scaling = new Vector3(50,50,50);
        snowflake.meshes[0].name = "snowflake";
        snowflake.animationGroups[0].start(true);

    }

    async loadTree(scene){
        var tree = await SceneLoader.ImportMeshAsync("","",treeModel,scene);
        tree.meshes[0].scaling = new Vector3(1,1,1);
        tree.meshes[0].name = "tree";
        tree.meshes[0].position = new Vector3(1000,1000,1000);
        this.tree = tree;
    }

    async loadStand(scene){
        var stand = await SceneLoader.ImportMeshAsync("","",standModel,scene);
        stand.meshes[0].scaling = new Vector3(1,1,1);
        stand.meshes[0].position = new Vector3(1000,1000,1000);
        stand.meshes[0].name = "stand";
        this.stand = stand;
    }

    scenaryCube(x,y,z,left,scene){
        var box = MeshBuilder.CreateBox("box", {width: 30, height: 20, depth: 50}, scene);
        // Créer un matériau avec une texture de neige
        var snowMaterial = new StandardMaterial("snowMaterial", scene);
        snowMaterial.diffuseTexture = new Texture(snowTexture, scene); // Remplacez par le chemin vers votre texture de neige
        box.material = snowMaterial;

        // Appliquer le matériau au cube
        box.material = snowMaterial;
            box.checkCollisions = true;
            var newX = 0;
            if(left){
                box.position = new Vector3(x - (40),y,z);
                newX = x - (40);
            }
            else{
                box.position = new Vector3(x + (40),y,z);
                newX = x + (40);
            }
            var randomNum = Math.floor(Math.random() * 3);
            this.differentScenaryCube(newX,y,z,left,randomNum,scene);
        return box;
    }

    differentScenaryCube(x,y,z,left,type,scene){
        switch(type){
            case 0:
                this.boxWithTree(x,y,z,left,scene);
                break;
            case 1:
                this.boxWithStand(x,y,z,left,scene);
                break;
            case 2:
                this.boxWithBoth(x,y,z,left,scene);
                break;
            default:
                this.boxWithStand(x,y,z,left,scene);
                break;
        }
    }

    boxWithTree(x,y,z,left,scene){
        for(var i = 0; i < MAXTREE; i++){
            if(this.tree != null){
                var tree = scene.getMeshByName("tree").clone("treeCloned");
                var randomZ = Math.random() * 50 - 25;
                var randomX = Math.random() * 30 - 15;
                tree.position = new Vector3(x + randomX,y+10,z+randomZ);
                var randomNum = Math.floor(Math.random() * 5) + 1;
                tree.scaling = new Vector3(randomNum,randomNum,randomNum);   
            }
        }
    }

    boxWithStand(x,y,z,left,scene){
        if(this.stand != null){
            var stand = scene.getMeshByName("stand").clone("standCloned");
            if(left){
                stand.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI);
                stand.position = new Vector3(x+48,y+9,z-20);
            }
            else{
                stand.position = new Vector3(x-48,y+9,z+33);
            }
            stand.scaling = new Vector3(3,3,3);
        }
    }

    boxWithBoth(x,y,z,left,scene){
        if(this.stand != null){
            var stand = scene.getMeshByName("stand").clone("standCloned");
            if(left){
                stand.rotateAround(new Vector3(0,0,0), new Vector3(0,1,0), Math.PI);
                stand.position = new Vector3(x+48,y+9,z-20);
            }
            else{
                stand.position = new Vector3(x-48,y+9,z+33);
            }
            stand.scaling = new Vector3(3,3,3);
        }
        for(var i = 0; i < MAXTREE; i++){
            if(this.tree != null){
                var tree = scene.getMeshByName("tree").clone("treeCloned");
                var randomZ = Math.random() * ( -25 - (-10) ) + (-10);
                var randomX = Math.random() * 30 - 15;
                tree.position = new Vector3(x + randomX,y+10,z+randomZ);
                var randomNum = Math.floor(Math.random() * 5) + 1;
                tree.scaling = new Vector3(randomNum,randomNum,randomNum);   
            }
        }
    }

    deleteAll(scene){
        var mountain = scene.getMeshByName("mountain");
        if(mountain != null){mountain.dispose();}

        var snowflake = scene.getMeshByName("snowflake");
        if(snowflake != null){snowflake.dispose();}

        var tree = scene.meshes.filter((mesh) => mesh.name == "treeCloned");
        tree.forEach((tree) => tree.dispose());

        var tutoPole = scene.getMeshByName("tutorialPole");
        if(tutoPole != null){
            tutoPole.actionManager.dispose();
            tutoPole.dispose();}

        var levelPole = scene.meshes.filter((mesh) => mesh.name.includes("level"));
        levelPole.forEach((level) => {
            level.actionManager.dispose();
            level.dispose();
        });

        var allPole = scene.meshes.filter((mesh) => mesh.name == "poleBox");
        allPole.forEach((pole) => pole.dispose());

        var allPoleModel = scene.meshes.filter((mesh) => mesh.name == "pole");
        allPoleModel.forEach((poleModel) => poleModel.dispose());

        var allLeftTrigger = scene.meshes.filter((mesh) => mesh.name.includes("leftTrigger"));
        allLeftTrigger.forEach((leftTrigger) => leftTrigger.dispose());

        var allRightTrigger = scene.meshes.filter((mesh) => mesh.name.includes("rightTrigger"));
        allRightTrigger.forEach((rightTrigger) => rightTrigger.dispose());
        
        var allPlatform = scene.meshes.filter((mesh) => mesh.name == "platform");
        allPlatform.forEach((platform) => platform.dispose());

        var allBox = scene.meshes.filter((mesh) => mesh.name == "box");
        allBox.forEach((box) => box.dispose());

        var allBoxRight = scene.meshes.filter((mesh) => mesh.name == "boxRight");
        allBoxRight.forEach((boxRight) => boxRight.dispose());

        var allStand = scene.meshes.filter((mesh) => mesh.name == "standCloned");
        allStand.forEach((stand) => stand.dispose());

        var startPlatform = scene.meshes.filter((mesh) => mesh.name == "StartPlatform");
        startPlatform.forEach((start) => start.dispose());

        var endPlatform = scene.getMeshByName("EndPlatform");
        if(endPlatform != null){endPlatform.dispose();}

        var startTrigger = scene.meshes.filter((mesh) => mesh.name == "starttrigger");
        startTrigger.forEach((start) => start.dispose());
    }
}

export default ModelLoading;