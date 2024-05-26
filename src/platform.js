import { MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";
import groundMesh from "../assets/textures/snow.jpg";


class Platform{

    constructor(x,y,z,width,depth,angle,scene){
        this.platform = MeshBuilder.CreateBox("platform", {width: width, height: 0.5, depth: depth}, scene);
        this.platform.material = new StandardMaterial("platformMaterial", scene);
        this.platform.material.diffuseTexture = new Texture(groundMesh, scene);
        this.platform.position.y = y;
        this.platform.position.x = x;
        this.platform.position.z = z;
        this.platform.rotation.x = angle;
        this.platform.checkCollisions = true;

        this.angle = angle;
        this.width = width;
        this.depth = depth;
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

export default Platform;