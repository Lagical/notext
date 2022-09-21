import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  recording = false;
  storedFileNames = [];

  constructor() {}

  ngOnInit(){
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  async loadFiles(){
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result =>{
      this.storedFileNames = result.files;
    });
  }

  startRecording(){
    if (this.recording){
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording(){
    if (!this.recording){
      return;
    }
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if(result.value && result.value.recordDataBase64){
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + ".wav";
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
        this.recording = false;
      }
    })
  }

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

}
