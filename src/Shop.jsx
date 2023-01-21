import React from 'react'

function Shop({purchaseFactory}) {
  return (
    <div style={{ position: "absolute", top: '-5rem', left: '0rem' }}>
        <button className='zoom__text' style={{paddingBlock:0}} onClick={()=>purchaseFactory()}>
            <p>Purchase Factory ($50)</p>
        </button>
    </div>
  )
}

export default Shop