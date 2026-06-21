import React, { useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { getSelectedDefinition } from "../../store/definitionsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearSelectedKey,
  getConfigureKeyboardIsSelectable,
  getLoadProgress,
  updateSelectedKey,
} from "../../store/keymapSlice";
import { useSize } from "../../utils/use-size";
import styled from "styled-components";
import { useLocation } from "wouter";
import { ConfigureKeyboard } from "../n-links/keyboard/configure";
import { Test } from "../n-links/keyboard/test";

const KEYBOARD_SCENE_PATHS = ["/", "/test"];

const KeyboardBG = styled.div<{
  onClick: () => void;
  $visible: boolean;
}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--background_keyboard-stage);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
`;

const KeyboardRouteGroup = styled.div<{
  $position: number;
}>`
  position: absolute;
  left: 0;
  transform: translateX(${(p) => p.$position * 100}vw);
  height: 100%;
  width: 100vw;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const KeyboardSceneFrame = styled.div<{
  $hidden: boolean;
  $hideTerrain: boolean;
  $inactive: boolean;
  $viewportHeight?: number;
}>`
  height: ${(props) => (props.$inactive ? 0 : 500)}px;
  width: 100%;
  top: 0;
  transform: ${(props) => {
    if (props.$inactive) {
      return "";
    }
    if (!props.$hidden) {
      return "";
    }
    if (!props.$hideTerrain) {
      return "translateY(-500px)";
    }
    if (!props.$viewportHeight) {
      return "";
    }
    return `translateY(${-300 + props.$viewportHeight / 2}px)`;
  }};
  position: ${(props) =>
    props.$inactive || (props.$hidden && !props.$hideTerrain) ? "absolute" : "relative"};
  overflow: ${(props) => (props.$inactive ? "hidden" : "visible")};
  pointer-events: ${(props) => (props.$inactive ? "none" : "auto")};
  z-index: 2;
  visibility: ${(props) =>
    props.$inactive || (props.$hidden && !props.$hideTerrain) ? "hidden" : "visible"};
`;

export const CanvasRouter = () => {
  const [path] = useLocation();
  const isKeyboardScenePath = KEYBOARD_SCENE_PATHS.includes(path);
  const body = useRef(document.body);
  const containerRef = useRef(null);
  const loadProgress = useAppSelector(getLoadProgress);
  const dispatch = useAppDispatch();
  const containerDimensions = useSize(containerRef);
  const dimensions = useSize(body);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const showLoader = path === "/" && (!selectedDefinition || loadProgress !== 1);
  const hideConfigureScene = "/" === path && (!selectedDefinition || loadProgress !== 1);
  const terrainOnClick = useCallback(() => {
    dispatch(updateSelectedKey(null));
  }, [dispatch]);
  const hideCanvasScene = !isKeyboardScenePath || hideConfigureScene;
  const configureKeyboardIsSelectable = useAppSelector(getConfigureKeyboardIsSelectable);
  const hideTerrainBG = showLoader;

  return (
    <>
      <KeyboardSceneFrame
        $hidden={hideCanvasScene}
        $hideTerrain={hideTerrainBG}
        $inactive={!isKeyboardScenePath}
        $viewportHeight={dimensions?.height}
        onClick={(evt) => {
          if ((evt.target as any).nodeName !== "CANVAS") dispatch(clearSelectedKey());
        }}
        ref={containerRef}
      >
        {hideCanvasScene ? null : (
          <>
            <KeyboardBG onClick={terrainOnClick} $visible={!hideTerrainBG} />
            <KeyboardGroup
              containerDimensions={containerDimensions}
              configureKeyboardIsSelectable={configureKeyboardIsSelectable}
              loadProgress={loadProgress}
            />
          </>
        )}
      </KeyboardSceneFrame>
    </>
  );
};

const getRouteX = (route: string) => {
  const configurePosition = 0;
  const spaceMultiplier = 100;
  const testPosition = -spaceMultiplier * 1;
  const otherPosition = -spaceMultiplier * 2;
  switch (route) {
    case "/test": {
      return testPosition;
    }
    case "/": {
      return configurePosition;
    }
    default: {
      return otherPosition;
    }
  }
};

const KeyboardGroupContainer = styled.div`
  z-index: 2;
  display: block;
  white-space: nowrap;
  height: 100%;
  background: transparent;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
`;
const KeyboardGroup = React.memo((props: any) => {
  const { loadProgress, configureKeyboardIsSelectable, containerDimensions } = props;
  const [path] = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const routeX = getRouteX(path);
  const animation = {
    transition: "transform 0.25s ease-in-out",
    transform: `translate(${routeX}vw, 0px)`,
  };

  const addTransition = useCallback(() => {
    if (ref.current) {
      ref.current.style.transition = animation.transition;
    }
  }, [ref.current]);

  const removeTransition = useCallback(() => {
    if (ref.current) {
      ref.current.style.transition = "";
    }
  }, [ref.current]);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("transitionend", removeTransition);
      ref.current.style.transform = animation.transform;
    }
    return () => {
      if (ref.current) {
        ref.current?.removeEventListener("transitionend", removeTransition);
      }
    };
  }, []);

  useEffect(() => {
    if (ref.current && ref.current.style.transform !== animation.transform) {
      addTransition();
      ref.current.style.transform = animation.transform;
    }
  }, [routeX]);
  return (
    <KeyboardGroupContainer ref={ref}>
      <Keyboards
        configureKeyboardIsSelectable={configureKeyboardIsSelectable}
        loadProgress={loadProgress}
        dimensions={containerDimensions}
      />
    </KeyboardGroupContainer>
  );
}, shallowEqual);
const Keyboards = React.memo((props: any) => {
  const { dimensions, configureKeyboardIsSelectable } = props;
  return (
    <>
      <KeyboardRouteGroup data-testid="keyboard-route-configure" $position={0}>
        <ConfigureKeyboard
          dimensions={dimensions}
          selectable={configureKeyboardIsSelectable}
          nDimension={"2D"}
        />
      </KeyboardRouteGroup>
      <KeyboardRouteGroup data-testid="keyboard-route-test" $position={1}>
        <Test dimensions={dimensions} nDimension={"2D"} />
      </KeyboardRouteGroup>
    </>
  );
}, shallowEqual);
