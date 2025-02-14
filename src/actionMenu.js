import { ActionManager, Color3, ExecuteCodeAction, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

class ActionMenu{
    constructor(musicLoader, levelManager){
        this.levelManager = levelManager;
        this.MusicLoader = musicLoader;
    }

    menuTutorial(scene){
        var tutoPole = MeshBuilder.CreateCapsule("tutorialPole", {height: 50, radius:0.5}, scene);
        tutoPole.position = new Vector3(80,20,40);
        var tutoPoleMat = new StandardMaterial("tutoPoleMat", scene);
        tutoPoleMat.diffuseColor = new Color3(255, 255, 0);
        tutoPole.material = tutoPoleMat;
        tutoPole.actionManager = new ActionManager(scene);
        tutoPole.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickTrigger,
                    parameter: tutoPole
                }
            ,() => {
                console.log("Start game!");
                this.MusicLoader.stopMenuMusic();
                this.MusicLoader.playLevelMusic(0);
                this.levelManager.currentLevel = 0;
                this.levelManager.tutorial(scene);
            }
        ));
    }

    menuLevel1(scene){
        var level1Pole = MeshBuilder.CreateCapsule("level1Pole", {height: 50,radius:0.5}, scene);
            level1Pole.position = new Vector3(60,25,20);
            var tutoPoleMat = new StandardMaterial("tutoPoleMat", scene);
            tutoPoleMat.diffuseColor = new Color3(0, 255, 0);
            level1Pole.material = tutoPoleMat;
            level1Pole.actionManager = new ActionManager(scene);
            level1Pole.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPickTrigger,
                        parameter: level1Pole
                    }
                ,() => {
                    console.log("Start game!");
                    this.MusicLoader.stopMenuMusic();
                    this.MusicLoader.playLevelMusic(0);
                    this.levelManager.currentLevel = 1;
                    this.levelManager.level1(scene);
                }
            ));

    }

    menuLevel2(scene){
        
        var level2Pole = MeshBuilder.CreateCapsule("level2Pole", {height: 50, radius:0.5}, scene);
        level2Pole.position = new Vector3(50,30,5);
        var level2PoleMat = new StandardMaterial("level2PoleMat", scene);
        level2PoleMat.diffuseColor = new Color3(0, 0, 255);
        level2Pole.material = level2PoleMat;
        level2Pole.actionManager = new ActionManager(scene);
        level2Pole.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickTrigger,
                    parameter: level2Pole
                }
            ,() => {
                console.log("Start game!");
                this.MusicLoader.stopMenuMusic();
                this.MusicLoader.playLevelMusic(1);
                this.levelManager.currentLevel = 2;
                this.levelManager.level2(scene);
            }
        ));
    }

    menuLevel3(scene){
        var level3Pole = MeshBuilder.CreateCapsule("level3Pole", {height: 50, radius:0.5}, scene);
        level3Pole.position = new Vector3(0,35,-10);
        var level3PoleMat = new StandardMaterial("level3PoleMat", scene);
        level3PoleMat.diffuseColor = new Color3(255, 0, 0);
        level3Pole.material = level3PoleMat;
        level3Pole.actionManager = new ActionManager(scene);
        level3Pole.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickTrigger,
                    parameter: level3Pole
                }
            ,() => {
                console.log("Start game!");
                this.MusicLoader.stopMenuMusic();
                this.MusicLoader.playLevelMusic(1);
                this.levelManager.currentLevel = 3;
                this.levelManager.level3(scene);
            }
        ));
    }

    menuLevel4(scene){
        var level4Pole = MeshBuilder.CreateCapsule("level4Pole", {height: 50, radius:0.5}, scene);
        level4Pole.position = new Vector3(-15,50,-25);
        var level4PoleMat = new StandardMaterial("level4PoleMat", scene);
        level4PoleMat.diffuseColor = new Color3(0, 0, 0);
        level4Pole.material = level4PoleMat;
        level4Pole.actionManager = new ActionManager(scene);
        level4Pole.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickTrigger,
                    parameter: level4Pole
                }
            ,() => {
                console.log("Start game!");
                this.MusicLoader.stopMenuMusic();
                this.MusicLoader.playLevelMusic(1);
                this.levelManager.currentLevel = 4;
                this.levelManager.level4(scene);
            }
        ));
    }
}

export default ActionMenu;