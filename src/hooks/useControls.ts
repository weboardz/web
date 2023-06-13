import { useCallback, useState } from "react";

const [MIN_SCALE, MAX_SCALE, SCALE_FACTOR] = [0.6, 2, 1200];

const useControls = () => {
  const [framePosition, setFramePosition] = useState({ x: 0, y: 0 });
  const [frameScale, setFrameScale] = useState(1);

  const updateFramePosition = useCallback(
    (mx: number, my: number) => {
      setFramePosition({ x: framePosition.x + mx, y: framePosition.y + my });
    },
    [framePosition]
  );

  const updateFrameScale = useCallback(
    (deltaY: number) => {
      const amount = deltaY / SCALE_FACTOR;

      const isAtMinLimit = frameScale <= MIN_SCALE && amount < 0;
      const isAtMaxLimit = frameScale >= MAX_SCALE && amount > 0;

      if (isAtMinLimit || isAtMaxLimit) return;
      setFrameScale(frameScale + amount);
    },
    [frameScale]
  );

  const getScaledCoordinates = useCallback(
    (clientCoordinates: { x: number; y: number }) => {
      const [middleWidth, middleHeight] = [
        window.innerWidth / 2,
        window.innerHeight / 2,
      ];

      const [offsetWidth, offsetHeight] = [
        (window.innerWidth * (1 / frameScale - 1)) / 2,
        (window.innerHeight * (1 / frameScale - 1)) / 2,
      ];

      const [positionX, positionY] = [
        clientCoordinates.x - framePosition.x,
        clientCoordinates.y - framePosition.y,
      ];

      const [scaleTransformationX, scaleTransformationY] = [
        offsetWidth * (1 - positionX / middleWidth),
        offsetHeight * (1 - positionY / middleHeight),
      ];

      return {
        x: positionX - scaleTransformationX,
        y: positionY - scaleTransformationY,
      };
    },
    [framePosition, frameScale]
  );

  return {
    framePosition,
    frameScale,
    updateFramePosition,
    updateFrameScale,
    getScaledCoordinates,
  };
};

export { useControls };
