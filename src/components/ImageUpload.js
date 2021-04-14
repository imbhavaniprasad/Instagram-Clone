import { Button } from '@material-ui/core'
import React,{useState} from 'react'
import {db,storage} from '../firebase'
import firebase from 'firebase'
import './ImageUpload.css'
export default function ImageUpload({username}) {
    const[image,setImage] = useState(null);
    const[progress,setProgress] = useState(0);
    const[caption,setCaption] = useState("");
    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = ()=>{
       if(image!=null){
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = Math.round(
                        snapshot.bytesTransferred/snapshot.totalBytes
                    )*100;
                    setProgress(progress);
                    console.log(progress);
                },
                (error)=>{
                    console.log(error);
                },
                ()=>{
                    storage.ref("images").child(image.name).getDownloadURL().then(url=>{
                        db.collection('posts').add({
                        caption : caption,
                        imgurl :url,
                        username:username,
                        timestamp :firebase.firestore.FieldValue.serverTimestamp()
                        })
                    });
                    setImage(null);
            setCaption("");
            setProgress(0);
                }
            )
            }
            else{
                alert("Enter caption and upload image");
            }
    }
    return (
        <div className="imageupload">
           
                <progress value={progress} max="100"/>
    
            <input type="text" onChange={e=>setCaption(e.target.value)} value={caption} placeholder="Enter Caption" name="name"/>
           <label value="Upload Image">Upload Image
            <input type="file" onChange={handleChange} /></label>
            <button className={`${image? "btn btn-primary" : "btn disabled"}`} onClick={handleUpload}>Upload</button>
        </div>
    )
}
