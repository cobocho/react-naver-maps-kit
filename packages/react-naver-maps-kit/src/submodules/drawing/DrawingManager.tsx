import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useMap } from "../../react/context/MapInstanceContext";

export interface DrawingControlPointOptions {
  anchorPointOptions?: naver.maps.CircleOptions;
  midPointOptions?: naver.maps.CircleOptions;
}

export interface DrawingControlOptions {
  position?: naver.maps.Position;
  style?: naver.maps.drawing.DrawingStyle;
}

export interface DrawingManagerOptionProps {
  drawingControl?: naver.maps.drawing.DrawingMode[] | null;
  drawingControlOptions?: DrawingControlOptions;
  drawingMode?: naver.maps.drawing.DrawingMode;
  controlPointOptions?: DrawingControlPointOptions;
  rectangleOptions?: Partial<naver.maps.RectangleOptions>;
  ellipseOptions?: Partial<naver.maps.EllipseOptions>;
  polylineOptions?: Partial<naver.maps.PolylineOptions>;
  arrowlineOptions?: Partial<naver.maps.PolylineOptions>;
  polygonOptions?: Partial<naver.maps.PolygonOptions>;
  markerOptions?: Partial<naver.maps.MarkerOptions>;
}

export interface DrawingManagerEventProps {
  onDrawingAdded?: (overlay: naver.maps.drawing.DrawingOverlay) => void;
  onDrawingRemoved?: (overlay: naver.maps.drawing.DrawingOverlay) => void;
  onDrawingSelect?: (overlay: naver.maps.drawing.DrawingOverlay) => void;
  onDrawingStart?: (overlay: naver.maps.drawing.DrawingOverlay) => void;
  onDrawingCanceled?: (overlay: naver.maps.drawing.DrawingOverlay) => void;
}

export interface DrawingManagerProps extends DrawingManagerOptionProps, DrawingManagerEventProps {
  onDrawingManagerReady?: (manager: naver.maps.drawing.DrawingManager) => void;
}

export interface DrawingManagerRef {
  getInstance: () => naver.maps.drawing.DrawingManager | null;
  getMap: () => naver.maps.Map | null;
  getDrawings: () => Record<string, naver.maps.drawing.DrawingOverlay>;
  getDrawing: (id: string) => naver.maps.drawing.DrawingOverlay | undefined;
  addDrawing: (
    overlay: naver.maps.drawing.DrawingOverlay,
    drawingMode: naver.maps.drawing.DrawingMode,
    id?: string
  ) => void;
  removeDrawing: (overlayOrId: naver.maps.drawing.DrawingOverlay | string) => void;
  toGeoJson: () => object;
  setDrawingMode: (mode: naver.maps.drawing.DrawingMode) => void;
  getDrawingMode: () => naver.maps.drawing.DrawingMode | undefined;
}

export const DrawingManager = forwardRef<DrawingManagerRef, DrawingManagerProps>(
  function DrawingManager(
    {
      drawingControl,
      drawingControlOptions,
      drawingMode,
      controlPointOptions,
      rectangleOptions,
      ellipseOptions,
      polylineOptions,
      arrowlineOptions,
      polygonOptions,
      markerOptions,
      onDrawingAdded,
      onDrawingRemoved,
      onDrawingSelect,
      onDrawingStart,
      onDrawingCanceled,
      onDrawingManagerReady
    },
    ref
  ) {
    const map = useMap();
    const managerRef = useRef<naver.maps.drawing.DrawingManager | null>(null);
    const listenersRef = useRef<naver.maps.MapEventListener[]>([]);

    const onDrawingManagerReadyRef = useRef(onDrawingManagerReady);
    onDrawingManagerReadyRef.current = onDrawingManagerReady;

    const eventPropsRef = useRef({
      onDrawingAdded,
      onDrawingRemoved,
      onDrawingSelect,
      onDrawingStart,
      onDrawingCanceled
    });
    eventPropsRef.current = {
      onDrawingAdded,
      onDrawingRemoved,
      onDrawingSelect,
      onDrawingStart,
      onDrawingCanceled
    };

    useImperativeHandle(
      ref,
      () => ({
        getInstance: () => managerRef.current,
        getMap: () => managerRef.current?.getMap() ?? null,
        getDrawings: () => managerRef.current?.getDrawings() ?? {},
        getDrawing: (id: string) => managerRef.current?.getDrawing(id),
        addDrawing: (
          overlay: naver.maps.drawing.DrawingOverlay,
          mode: naver.maps.drawing.DrawingMode,
          id?: string
        ) => {
          managerRef.current?.addDrawing(overlay, mode, id);
        },
        removeDrawing: (overlayOrId: naver.maps.drawing.DrawingOverlay | string) => {
          managerRef.current?.removeDrawing(overlayOrId);
        },
        toGeoJson: () => managerRef.current?.toGeoJson() ?? {},
        setDrawingMode: (mode: naver.maps.drawing.DrawingMode) => {
          managerRef.current?.setOptions({ drawingMode: mode });
        },
        getDrawingMode: () => {
          const options = managerRef.current?.getOptions("drawingMode");
          return options as naver.maps.drawing.DrawingMode | undefined;
        }
      }),
      []
    );

    useEffect(() => {
      if (!map) return;
      if (typeof naver.maps.drawing?.DrawingManager !== "function") {
        console.warn(
          "[DrawingManager] drawing 서브모듈이 로드되지 않았습니다. " +
            "NaverMapProvider에 submodules={['drawing']}을 추가하세요."
        );
        return;
      }

      let manager: naver.maps.drawing.DrawingManager | null = null;

      const createManager = () => {
        if (managerRef.current) return;

        const options: naver.maps.drawing.DrawingOptions = {
          map
        };

        if (drawingControl !== undefined) {
          options.drawingControl = drawingControl;
        }
        if (drawingControlOptions) {
          options.drawingControlOptions = drawingControlOptions;
        }
        if (drawingMode) {
          options.drawingMode = drawingMode;
        }
        if (controlPointOptions) {
          options.controlPointOptions = controlPointOptions;
        }
        if (rectangleOptions) {
          options.rectangleOptions = rectangleOptions;
        }
        if (ellipseOptions) {
          options.ellipseOptions = ellipseOptions;
        }
        if (polylineOptions) {
          options.polylineOptions = polylineOptions;
        }
        if (arrowlineOptions) {
          options.arrowlineOptions = arrowlineOptions;
        }
        if (polygonOptions) {
          options.polygonOptions = polygonOptions;
        }
        if (markerOptions) {
          options.markerOptions = markerOptions;
        }

        manager = new naver.maps.drawing.DrawingManager(options);
        managerRef.current = manager;

        const listeners: naver.maps.MapEventListener[] = [];

        const addedListener = manager.addListener(
          naver.maps.drawing.DrawingEvents.ADD,
          (overlay: naver.maps.drawing.DrawingOverlay) => {
            eventPropsRef.current.onDrawingAdded?.(overlay);
          }
        );
        listeners.push(addedListener);

        const removedListener = manager.addListener(
          naver.maps.drawing.DrawingEvents.REMOVE,
          (overlay: naver.maps.drawing.DrawingOverlay) => {
            eventPropsRef.current.onDrawingRemoved?.(overlay);
          }
        );
        listeners.push(removedListener);

        const selectListener = manager.addListener(
          naver.maps.drawing.DrawingEvents.SELECT,
          (overlay: naver.maps.drawing.DrawingOverlay) => {
            eventPropsRef.current.onDrawingSelect?.(overlay);
          }
        );
        listeners.push(selectListener);

        const startListener = manager.addListener(
          naver.maps.drawing.DrawingEvents.START,
          (overlay: naver.maps.drawing.DrawingOverlay) => {
            eventPropsRef.current.onDrawingStart?.(overlay);
          }
        );
        listeners.push(startListener);

        const canceledListener = manager.addListener(
          naver.maps.drawing.DrawingEvents.CANCLE,
          (overlay: naver.maps.drawing.DrawingOverlay) => {
            eventPropsRef.current.onDrawingCanceled?.(overlay);
          }
        );
        listeners.push(canceledListener);

        listenersRef.current = listeners;
        onDrawingManagerReadyRef.current?.(manager);
      };

      if (map.isReady) {
        createManager();
      } else {
        const listener = naver.maps.Event.addListener(map, "init", createManager);
        return () => {
          naver.maps.Event.removeListener(listener);
          listenersRef.current.forEach((l) => naver.maps.Event.removeListener(l));
          if (manager) {
            manager.destroy();
          }
          managerRef.current = null;
        };
      }

      return () => {
        listenersRef.current.forEach((l) => naver.maps.Event.removeListener(l));
        if (manager) {
          manager.destroy();
        }
        managerRef.current = null;
      };
    }, [map]);

    useEffect(() => {
      if (!managerRef.current || drawingMode === undefined) return;
      managerRef.current.setOptions({ drawingMode });
    }, [drawingMode]);

    return null;
  }
);
