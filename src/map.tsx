import React from 'react';
import { Mapbox, Regl } from '@carbonplan/maps';

interface MapProps {
  style?: any;
  zoom?: any;
  minZoom?: any;
  maxZoom?: any;
  center?: any;
  debug?: boolean;
  extensions?: string[];
  children?: React.ReactNode;
}

export const Map = (props: MapProps) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        ...props.style,
      }}
    >
      <Mapbox
        zoom={props.zoom}
        minZoom={props.minZoom}
        maxZoom={props.maxZoom}
        center={props.center}
        debug={props.debug}
        style={{ position: 'relative', height: '400px', zIndex: 1 }}
      >
        <Regl
          extensions={props.extensions}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {props.children}
        </Regl>
      </Mapbox>
    </div>
);

Map.defaultProps = {
  style: {},
  zoom: 2,
  minZoom: 0,
  maxZoom: 22,
  center: [0, 0],
  debug: false,
  extensions: [],
};
