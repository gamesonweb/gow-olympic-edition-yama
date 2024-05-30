import MenuMusic from "../assets/musics/Menu.mp3";
import Music1 from "../assets/musics/Music1.mp3";
import Music2 from "../assets/musics/Music2.mp3";

class MusicLoader{
    constructor(){
        this.menuMusic = new Audio(MenuMusic);
        
        this.levelMusic1 = new Audio(Music1);
        this.levelMusic2 = new Audio(Music2);

        this.levelMusic = [this.levelMusic1, this.levelMusic2]
    }

    playMenuMusic(){
        this.menuMusic.play();
        this.menuMusic.loop = true;
    }

    stopMenuMusic(){
        this.menuMusic.pause();
    }

    playLevelMusic(level){
        console.log("Playing level music")
        this.menuMusic.pause();
        this.levelMusic[level].play();
        this.levelMusic[level].loop = true;
        this.stopLevelMusic(level);
    }

    stopLevelMusic(level){
        for(let i = 0; i < this.levelMusic.length; i++){
            if(i != level){this.levelMusic[i].pause();}
        }
    }
}

export default MusicLoader;