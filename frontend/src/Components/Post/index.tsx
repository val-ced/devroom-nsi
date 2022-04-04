import React from 'react'
import "./Post.scss"

const Post:React.FC = () => {
  return (
    <section className="post-section">
      <div id="post-container">
        <div className="top-post-container">
          <div id="post-container-top-left">
            <div id="logo">

            </div>

            <div id="info-user">
              <p>Pseudo</p>
              <p>date of publication</p>
            </div>
          </div>
          <div id="settings-post">
            <button id="more-button"> 
              {/* Pense-bête : Ne pas oublier de faire une modal une fois tout le design fini. Voir kevin powell trop simple ^^ */}
              <span className="material-icons" id="more-post">more_horiz</span>
            </button>
          </div>
        </div>
        {/* End top-post-container */}
        <div id="test">
          <div id="content-post">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et tempora quo nobis quam excepturi minima asperiores sunt eius odit incidunt cumque expedita repellat totam, commodi eaque recusandae laboriosam reiciendis sapiente.
            </p>
          </div>
        </div>
      </div>
      {/* End post-container */}
    </section>

  )
}

export default Post