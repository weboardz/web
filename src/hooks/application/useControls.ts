import { useCallback, useMemo, useState } from "react";

const [MIN_SCALE, MAX_SCALE, SCALE_FACTOR] = [0.6, 2, 1200];

const useControls = () => {
  const [frame, setFrame] = useState({ position: { x: 0, y: 0 }, scale: 1 });

  const updateFrame = useMemo(() => {
    return {
      position: (mx: number, my: number) => {
        setFrame({
          ...frame,
          position: { x: frame.position.x + mx, y: frame.position.y + my },
        });
      },

      scale: (deltaY: number) => {
        const amount = deltaY / SCALE_FACTOR;

        const isAtMinLimit = frame.scale <= MIN_SCALE && amount < 0;
        const isAtMaxLimit = frame.scale >= MAX_SCALE && amount > 0;

        if (isAtMinLimit || isAtMaxLimit) return;
        setFrame({ ...frame, scale: frame.scale + amount });
      },
    };
  }, [frame]);

  const getScaledCoordinates = useCallback(
    (clientCoordinates: { x: number; y: number }) => {
      const [middleWidth, middleHeight] = [
        window.innerWidth / 2,
        window.innerHeight / 2,
      ];

      const [offsetWidth, offsetHeight] = [
        (window.innerWidth * (1 / frame.scale - 1)) / 2,
        (window.innerHeight * (1 / frame.scale - 1)) / 2,
      ];

      const [positionX, positionY] = [
        clientCoordinates.x - frame.position.x,
        clientCoordinates.y - frame.position.y,
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
    [frame]
  );

  return {
    frame,
    updateFrame,
    getScaledCoordinates,
  };
};

export { useControls };
