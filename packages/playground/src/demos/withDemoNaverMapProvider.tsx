import { type ComponentType } from "react";
import { NaverMapProvider } from "react-naver-maps-kit";
import type { Submodule } from "react-naver-maps-kit";

type DemoProviderProps = {
  ncpKeyId: string;
};

const DEMO_SUBMODULES: Submodule[] = ["panorama", "visualization", "drawing"];

type WithDemoProviderOptions = {
  submodules?: Submodule[];
};

export function withDemoNaverMapProvider<TProps extends object>(
  Component: ComponentType<TProps>,
  options?: WithDemoProviderOptions
) {
  function DemoWithNaverMapProvider(props: TProps & DemoProviderProps) {
    const { ncpKeyId, ...restProps } = props;
    const submodules = options?.submodules ?? DEMO_SUBMODULES;

    return (
      <NaverMapProvider ncpKeyId={ncpKeyId} submodules={submodules}>
        <Component {...(restProps as TProps)} />
      </NaverMapProvider>
    );
  }

  DemoWithNaverMapProvider.displayName = `WithDemoNaverMapProvider(${Component.displayName ?? Component.name ?? "Component"})`;

  return DemoWithNaverMapProvider;
}
