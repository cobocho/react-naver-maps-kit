declare namespace naver.maps {
  interface Map {
    isReady: boolean;
  }

  namespace visualization {
    interface HeatMap {
      addData(data: LatLng | PointArrayLiteral | visualization.WeightedLocation): void;
      setData(data: LatLng[] | PointArrayLiteral[] | visualization.WeightedLocation[]): void;
      setOptions(options: Partial<HeatMapOptions>): void;
    }

    interface HeatMapOptions {
      data?: LatLng[] | PointArrayLiteral[] | visualization.WeightedLocation[];
      colorMapReverse?: boolean;
    }

    interface DotMap {
      addData(data: LatLng | PointArrayLiteral): void;
      setOptions(options: Partial<DotMapOptions>): void;
    }
  }

  namespace drawing {
    interface DrawingManager {
      removeDrawing(overlayOrId: DrawingOverlay | string): void;
    }

    interface DrawingControlOptions {
      position?: Position;
      style?: DrawingStyle;
    }

    interface ControlPointOptions {
      position?: Position;
      anchorPointOptions?: CircleOptions;
      midPointOptions?: CircleOptions;
    }

    interface DrawingOptions {
      rectangleOptions?: Partial<RectangleOptions>;
      ellipseOptions?: Partial<EllipseOptions>;
      polylineOptions?: Partial<PolylineOptions>;
      arrowlineOptions?: Partial<PolylineOptions>;
      polygonOptions?: Partial<PolygonOptions>;
      markerOptions?: Partial<MarkerOptions>;
    }
  }
}
