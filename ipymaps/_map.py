#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Benoit Bovy.
# Distributed under the terms of the Modified BSD License.

from ipywidgets import DOMWidget
from traitlets import Int, Float, Unicode
from ._frontend import module_name, module_version


class Map(DOMWidget):
    """Interactive map widget."""

    _model_name = Unicode('MapModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('MapView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    zoom = Float(2).tag(sync=True)
    opacity = Float(1.0).tag(sync=True)
    month = Int(1).tag(sync=True)
    band = Unicode("tavg").tag(sync=True)
    colormap_name = Unicode('warm').tag(sync=True)
