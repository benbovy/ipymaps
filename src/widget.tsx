// Copyright (c) Benoit Bovy
// Distributed under the terms of the Modified BSD License.
import { DOMWidgetModel, DOMWidgetView, WidgetModel } from '@jupyter-widgets/base';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, useThemeUI, Theme } from 'theme-ui';
import { Raster, Line } from '@carbonplan/maps';
import { useColormap } from '@carbonplan/colormaps';
import { Map } from './map';

import { MODULE_NAME, MODULE_VERSION } from './version';

import '@carbonplan/maps/mapbox.css';

export class MapModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: MapModel.model_name,
      _model_module: MapModel.model_module,
      _model_module_version: MapModel.model_module_version,
      _view_name: MapModel.view_name,
      _view_module: MapModel.view_module,
      _view_module_version: MapModel.view_module_version,
      zoom: 2,
      opacity: 1.0,
      month: 1,
      band: 'tavg',
      colormap_name: 'warm',
    };
  }

  static model_name = 'MapModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'MapView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

// taken from https://github.com/oculus42/react-backbone-hooks (MIT License)
const useModelKey = (model: WidgetModel, key: string) => {
  const [data, setState] = useState(model.get(key));

  model.on(`change:${key} reset sync`, () => {
    const newValue = model.get(key);
    console.log(newValue);
    if (newValue === data) {
      return;
    }
    setState(newValue);
  });

  return [data, setState];
};

interface ModelProps {
  model: WidgetModel
};

const CarbonMap = ({ model }: ModelProps) => {
  const bucket = 'https://storage.googleapis.com/carbonplan-share/';

  const { theme } = useThemeUI();

  const [zoom] = useModelKey(model, 'zoom');
  const [display,] = useState(true);
  const [opacity,] = useModelKey(model, 'opacity');
  const [clim,] = useState([-20, 30]);
  const [month,] = useModelKey(model, 'month');
  const [band,] = useModelKey(model, 'band');
  const [colormapName,] = useModelKey(model, 'colormap_name');
  const colormap = useColormap(colormapName);


  /* const update = (): void => {
* };

* useEffect(() => {
*   model.changed.connect(update);
*   return (): void => {
*     model.changed.disconnect(update);
*   };
* }, [model]);
*/

  return (
    <Map zoom={zoom} center={[0, 0]} debug={false} style={{ height: '400px' }}>
      <Line
        color={theme.rawColors!.primary}
        source={bucket + 'maps-demo/land'}
        variable={'land'}
      />
      <Raster
        colormap={colormap}
        clim={clim}
        display={display}
        opacity={opacity}
        mode={'texture'}
        source={bucket + 'maps-demo/4d/tavg-prec-month'}
        variable={'climate'}
        selector={{ month, band }}
      />
    </Map>
  );
};

// TODO: bridge theme-ui with jupyterlab themes
const theme: Theme = {
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#33e',
  },
};

const CarbonApp = ({ model }: ModelProps) => (
  <div className="MapWidget" style={{ height: '400px' }}>
    <ThemeProvider theme={theme}>
      <CarbonMap model={model} />
    </ThemeProvider>
  </div>
);

export class MapView extends DOMWidgetView {
  render() {
    ReactDOM.render(<CarbonApp model={this.model} />, this.el);
  }
}
