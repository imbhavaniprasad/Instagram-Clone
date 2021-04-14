import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../firebase'
import firebase from 'firebase'
import './Posts.css'
export default function Posts({ user, username, imgurl, caption, postid }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if (postid) {

            unsubscribe = db
                .collection("posts")
                .doc(postid)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))

                })
        }
        return () => {
            unsubscribe();
        }
    }, [postid]);
    const handlePost = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postid).collection("comments").add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }
    return (
        <div className="container post">
            <div className="postcard">
                <div className="post__header">
                    <Avatar>B</Avatar>
                    <b className="username">{username}</b>
                </div>
                <img className="postimage" src={imgurl} alt="post" />
                <div className="caption">
                    <div><b>{username}</b> {caption}</div>
                </div>
                <div className="post__comments">
                    {
                        comments.map((comment) => (
                            <p>
                                <strong>{comment.username}</strong> {comment.comment}
                            </p>
                        ))
                    }
                </div>
                {user && (
                    <form className="commentform">
                        <input className="comment__input" type="text" value={comment} placeholder="Enter Comment..." onChange={e => setComment(e.target.value)} />
                        <button className="comment__submit" onClick={handlePost} disabled={!comment} type="submit">Post</button>
                    </form>
                )}

            </div>
        </div>
    )
}
