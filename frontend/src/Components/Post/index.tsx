import React, { useState } from 'react'
import { useLikeSwitchMutation } from '../../redux/api/user'
import { Post as PostData } from '../../Types/Interfaces/Post'
import MaterialButton from '../MaterialButton'
import "./Post.scss"

const Post: React.FC<PostData & { likeBtn?: boolean, commentBtn?: boolean }> = ({ likeBtn = true, commentBtn = true, ...post }) => {

  const [likeSwitch] = useLikeSwitchMutation()
  const [isLiked, setIsLiked] = useState(post.is_liked)

  const handleOnLike = async () => {
    const res = await likeSwitch({ type: "post", uuid: post.id }).unwrap()
    setIsLiked(res.is_liked)
  }

  return (
    <section className="post-section">
      <div id="post-container">
        <div id="logo-container">
          <img src={post.author_meta.logo} alt={`${post.author_meta.at} logo`} id="logo">
          </img>
        </div>
        <div className="content-post-container">
          <div className="top-post-container">
            <div id="info-user">
              <p>{post.author_meta.username} <span id="at">@{post.author_meta.at}</span></p>
              <p id="date">{post.date}</p>
            </div>
            <div id="settings-post">
              <MaterialButton id="more-button" materialSpan={{ id: "more-post" }}>more_horiz</MaterialButton>
              {/* <button id="more-button"> */}
              {/* Pense-bête : Ne pas oublier de faire une modal une fois tout le design fini. Voir kevin powell trop simple ^^ */}
              {/* <span className="material-icons" id="more-post">more_horiz</span>
              </button> */}
            </div>
          </div>
          {/* End top-post-container */}
          <div id="content-post">
            <div id="text-area-post">
              <p>
                {post.body}
              </p>
            </div>
          </div>

          <div id="reactions-container">
            {likeBtn &&
              <MaterialButton
                materialSpan={{ id: "icons-reactions" }}
                // A changer le style quand c'est like
                label={<p id="text-reaction" style={{ color: `${isLiked ? "red" : ""}` }}>Like</p>}
                onClick={handleOnLike}
              >
                favorite
              </MaterialButton>
            }
            {commentBtn &&
              <MaterialButton
                materialSpan={{ id: "icons-reactions" }}
                label={<p id="text-reaction">Comment</p>}
              >
                chat_bubble
              </MaterialButton>
            }
          </div>
          {/* End reactions-container */}
        </div>
        {/* End content-post-container */}
      </div>
      {/* End post-container */}
    </section>

  )
}

export default Post

