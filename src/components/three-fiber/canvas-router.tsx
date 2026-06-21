import {faSpinner, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {a, config, useSpring} from '@react-spring/three';
import {
  Html,
  OrbitControls,
  SpotLight,
  useGLTF,
  useProgress,
} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {KeyColorType} from '@the-via/reader';
import cubeySrc from 'assets/models/cubey.glb';
import glbSrc from 'assets/models/keyboard_components.glb';
import React, {Suspense, useCallback, useEffect, useMemo, useRef} from 'react';
import {shallowEqual} from 'react-redux';
import {getSelectedDefinition} from 'src/store/definitionsSlice';
import {reloadConnectedDevices} from 'src/store/devicesThunks';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  getConfigureKeyboardIsSelectable,
  getLoadProgress,
  updateSelectedKey,
} from 'src/store/keymapSlice';
import {getSelectedTheme} from 'src/store/settingsSlice';
import {OVERRIDE_HID_CHECK} from 'src/utils/override';
import {useSize} from 'src/utils/use-size';
import {Object3D, SpotLight as ThreeSpotLight} from 'three';
import {useLocation} from 'wouter';
import {AccentButtonLarge} from '../inputs/accent-button';
import {ConfigureKeyboard} from '../n-links/keyboard/configure';
import {Test} from '../n-links/keyboard/test';
import {Camera} from './camera';
import {LoaderCubey} from './loader-cubey';
import {UpdateUVMaps} from './update-uv-maps';
import styled from 'styled-components';

useGLTF.preload(cubeySrc, true, true);
useGLTF.preload(glbSrc, true, true);

const KeyboardBG: React.FC<{
  color: string;
  onClick: () => void;
  visible: boolean;
}> = React.memo((props) => {
  const {onClick, visible, color} = props;
  return (
    <mesh
      receiveShadow
      position={[0, -5.75, 0]}
      rotation={[-Math.PI / 2 + Math.PI / 14, 0, 0]}
      onClick={onClick}
      visible={visible}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}, shallowEqual);

const ThreeSceneFrame = styled.div<{
  $hidden: boolean;
  $hideTerrain: boolean;
  $viewportHeight?: number;
}>`
  height: 500px;
  width: 100%;
  top: 0;
  transform: ${(props) => {
    if (!props.$hidden) {
      return '';
    }
    if (!props.$hideTerrain) {
      return 'translateY(-500px)';
    }
    if (!props.$viewportHeight) {
      return '';
    }
    return `translateY(${-300 + props.$viewportHeight / 2}px)`;
  }};
  position: ${(props) =>
    props.$hidden && !props.$hideTerrain ? 'absolute' : 'relative'};
  overflow: visible;
  z-index: 0;
  visibility: ${(props) =>
    props.$hidden && !props.$hideTerrain ? 'hidden' : 'visible'};
`;

const VisibleCanvas = styled(Canvas)`
  overflow: visible;
`;

const AuthorizeButton = styled(AccentButtonLarge)`
  width: max-content;
`;

const AuthorizeIcon = styled(FontAwesomeIcon)`
  margin-left: 10px;
`;

const LoadingIcon = styled.div`
  text-align: center;
  color: var(--color_accent);
  font-size: 60px;
`;

export const CanvasRouter = () => {
  return (
    <Suspense fallback={null}>
      <LazyRouter />
    </Suspense>
  );
};

const LazyRouter = React.lazy(async () => {
  await document.fonts.load('bold 16px Fira Sans').finally();
  return {default: NonSuspenseCanvasRouter};
});

export const NonSuspenseCanvasRouter = () => {
  const [path] = useLocation();
  const body = useRef(document.body);
  const containerRef = useRef(null);
  const loadProgress = useAppSelector(getLoadProgress);
  const {progress} = useProgress();
  const dispatch = useAppDispatch();
  const dimensions = useSize(body);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const theme = useAppSelector(getSelectedTheme);
  const accentColor = useMemo(() => theme[KeyColorType.Accent].c, [theme]);
  const showLoader =
    path === '/' && (!selectedDefinition || loadProgress !== 1);
  useGLTF(glbSrc, true, true);
  const hideConfigureScene =
    '/' === path &&
    (!selectedDefinition || (loadProgress + progress / 100) / 2 !== 1);
  const terrainOnClick = useCallback(() => {
    if (true) {
      dispatch(updateSelectedKey(null));
    }
  }, [dispatch]);
  const showAuthorizeButton = true;
  const hideCanvasScene =
    !showAuthorizeButton || ['/errors'].includes(path) || hideConfigureScene;
  const configureKeyboardIsSelectable = useAppSelector(
    getConfigureKeyboardIsSelectable,
  );

  const hideTerrainBG = showLoader;
  return (
    <>
      <ThreeSceneFrame
        $hidden={hideCanvasScene}
        $hideTerrain={hideTerrainBG}
        $viewportHeight={dimensions?.height}
        ref={containerRef}
      >
        <VisibleCanvas flat={true} shadows>
          <UpdateUVMaps />
          <Lights />
          <KeyboardBG
            onClick={terrainOnClick}
            color={accentColor}
            visible={!hideTerrainBG}
          />
          <OrbitControls enabled={false} />
          <Camera />
          <LoaderCubey
            theme={theme}
            visible={hideTerrainBG && !selectedDefinition}
          />
          <Html
            center
            position={[
              0,
              hideTerrainBG ? (!selectedDefinition ? -1 : 0) : 10,
              -19,
            ]}
          >
            {showAuthorizeButton ? (
              !selectedDefinition ? (
                <AuthorizeButton
                  onClick={() => dispatch(reloadConnectedDevices())}
                >
                  Authorize device
                  <AuthorizeIcon icon={faUnlock} />
                </AuthorizeButton>
              ) : (
                <>
                  <LoadingIcon>
                    <FontAwesomeIcon spinPulse icon={faSpinner} />
                  </LoadingIcon>
                </>
              )
            ) : null}
          </Html>
          <KeyboardGroup
            containerRef={containerRef}
            configureKeyboardIsSelectable={configureKeyboardIsSelectable}
            loadProgress={loadProgress}
          />
        </VisibleCanvas>
      </ThreeSceneFrame>
    </>
  );
};

const Lights = React.memo(() => {
  const x = 2;
  const y = 0.25;
  const z = -16;
  const spotlightY = 12;
  const spotlightZ = -19;
  const ref = useRef<ThreeSpotLight>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.shadow.mapSize.width = 2048;
      ref.current.shadow.mapSize.height = 2048;
    }
  }, [ref.current]);
  const targetObj = React.useMemo(() => {
    const obj = new Object3D();
    obj.position.set(0, 0, spotlightZ);
    obj.updateMatrixWorld();
    return obj;
  }, []);
  // Setting for better perf on slower machines
  return (
    <>
      <ambientLight intensity={0.8} />
      <SpotLight
        ref={ref}
        distance={spotlightY + 3}
        position={[0, spotlightY, spotlightZ + 2]}
        angle={Math.PI / 5}
        attenuation={5}
        target={targetObj}
        intensity={10}
        castShadow={true}
        anglePower={5} // Diffuse-cone anglePower (default: 5)
      ></SpotLight>
      <pointLight position={[x, y, z]} intensity={20} />
      <pointLight position={[-x, y, z]} intensity={20} />
    </>
  );
}, shallowEqual);

const getRouteX = (route: string) => {
  const configurePosition = 0;
  const spaceMultiplier = 20;
  const testPosition = -spaceMultiplier * 1;
  const otherPosition = -spaceMultiplier * 2;
  switch (route) {
    case '/test': {
      return testPosition;
    }
    case '/': {
      return configurePosition;
    }
    default: {
      return otherPosition;
    }
  }
};

const KeyboardGroup = React.memo((props: any) => {
  const {loadProgress, configureKeyboardIsSelectable} = props;
  const [path] = useLocation();
  const routeX = getRouteX(path);
  const slide = useSpring({
    config: config.stiff,
    x: routeX,
  });
  const dimensions = useSize(props.containerRef);
  return (
    <a.group position-x={slide.x}>
      <Keyboards
        configureKeyboardIsSelectable={configureKeyboardIsSelectable}
        loadProgress={loadProgress}
        dimensions={dimensions}
      />
    </a.group>
  );
}, shallowEqual);

const Keyboards = React.memo((props: any) => {
  const {loadProgress, dimensions, configureKeyboardIsSelectable} = props;
  const testPosition = -getRouteX('/test');

  return (
    <>
      <group visible={loadProgress === 1}>
        <ConfigureKeyboard
          dimensions={dimensions}
          selectable={configureKeyboardIsSelectable}
          nDimension={'3D'}
        />
      </group>
      <group position-x={testPosition}>
        <Test dimensions={dimensions} nDimension={'3D'} />
      </group>
    </>
  );
}, shallowEqual);
