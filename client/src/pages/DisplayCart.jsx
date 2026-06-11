import React from 'react'
import DisplayCartItem from '../components/DisplayCartItem'

const DisplayCart = ({close}) => {
  return (
    <div>
        <DisplayCartItem close={close} />
    </div>
  )
}

export default DisplayCart