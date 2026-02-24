import { useState, useEffect, useCallback, useRef } from "react";
import { useNaverMap } from "react-naver-maps-kit";
import type { SearchParams, Property, PriceRange } from "../types";
import { searchProperties } from "../data/mockData";

export function usePropertySearch(priceRange: PriceRange) {
  const { map, sdkStatus } = useNaverMap();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initialFetchedRef = useRef(false);
  const prevPriceRangeRef = useRef<PriceRange>(priceRange);

  const fetchProperties = useCallback(async () => {
    if (!map) return;

    setIsLoading(true);
    setError(null);

    try {
      const bounds = map.getBounds() as naver.maps.LatLngBounds;
      const sw = bounds.getSW();
      const ne = bounds.getNE();

      const params: SearchParams = {
        bounds: {
          sw: { lat: sw.lat(), lng: sw.lng() },
          ne: { lat: ne.lat(), lng: ne.lng() }
        },
        priceRange,
        propertyTypes: ["apartment", "villa", "officetel", "house"]
      };

      const results = await searchProperties(params);
      setProperties(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("검색 실패"));
    } finally {
      setIsLoading(false);
    }
  }, [map, priceRange]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const priceChanged =
      prevPriceRangeRef.current.min !== priceRange.min ||
      prevPriceRangeRef.current.max !== priceRange.max;

    if (!initialFetchedRef.current || priceChanged) {
      initialFetchedRef.current = true;
      prevPriceRangeRef.current = priceRange;
      fetchProperties();
    }
  }, [sdkStatus, map, priceRange, fetchProperties]);

  return { properties, isLoading, error, refetch: fetchProperties };
}
