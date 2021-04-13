import React from 'react'
import Avatar from '@material-ui/core/Avatar'
export default function Posts({username,imgurl,caption}) {
    return (
        <div className="container post">
            <div className="postcard">
                <div className="post__header">
                <Avatar>B</Avatar>
                <b className="username">{username}</b>
                </div>
                <img className="postimage" src={imgurl} alt="post"/>
                <div className="caption">
                    <div><b>{username}</b> {caption}</div>
                </div>
            </div>
        </div>
    )
}
