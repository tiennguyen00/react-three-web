import React from 'react'
import Ecctrl from 'ecctrl'
import { KeyboardControls } from '@react-three/drei'

const Character = () => {
  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
    { name: 'action1', keys: ['1'] },
    { name: 'action2', keys: ['2'] },
    { name: 'action3', keys: ['3'] },
    { name: 'action4', keys: ['KeyF'] },
  ]

  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl
        // debug
        // animated
        // followLight
        // springK={2}
        // dampingC={0.2}
        // autoBalanceSpringK={1.2}
        // autoBalanceDampingC={0.04}
        // autoBalanceSpringOnY={0.7}
        // autoBalanceDampingOnY={0.05}
        disableFollowCam={true}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.7]} />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
      </Ecctrl>
    </KeyboardControls>
  )
}

export default Character
