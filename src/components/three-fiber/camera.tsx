import {useSpring} from '@react-spring/three';
import {PerspectiveCamera, useProgress} from '@react-three/drei';
import {useFrame, useThree} from '@react-three/fiber';
import React from 'react';

const ZOOM = 5.5 * 0.8;

export const Camera = () => {
  const {progress} = useProgress();
  const camera = useThree((state) => state.camera);
  const [startX, endX] = [7, 7];
  const glow = useSpring({
    config: {duration: 800},
    from: {x: startX},
  });

  React.useEffect(() => {
    if (progress === 100) {
      glow.x.start(endX);
    }
  }, [progress]);

  useFrame(() => {
    if (glow.x.isAnimating) {
      camera.position.setZ(glow.x.get());
      camera.position.setY(0.4 * Math.pow(glow.x.get() - endX, 1));
      camera.updateProjectionMatrix();
    }
    if (camera.zoom !== ZOOM) {
      camera.zoom = ZOOM;
      camera.updateProjectionMatrix();
    }
  });
  return <PerspectiveCamera position-z={startX} makeDefault fov={25} />;
};
