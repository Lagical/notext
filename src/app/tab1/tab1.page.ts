import { Component } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  storedFileNames = [];
  liked = false;

  constructor() {}

  ngOnInit(){
    this.loadFiles();
  }

  //loads files
  async loadFiles(){
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result =>{
      this.storedFileNames = result.files;
    });
  }

  //plays files
  async playFile(fileName){
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data
    });
    const base64Sound = audioFile.data;
    const audioRef = new Audio("data:audio/wav;base64," + base64Sound);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  giveLike(){
    this.liked = true;
  }

}
