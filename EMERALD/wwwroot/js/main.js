
//// MAIN PARAM ////
var map;
let emeraldLayers;
let styleСatalog = new Map();
var format = 'image/png';

//// URI ////
var geoserverURL = 'http://localhost:8080/geoserver';
var paramsGeoserverLayers = '/ows?service=wms&version=1.3.0&request=GetCapabilities';

//// MAP PARAM ////
var pureCoverage = false;

//////////// MAPS //////////////
var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.3)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
        }),
    }),
});
var highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#f00',
        width: 1,
    }),
    fill: new ol.style.Fill({
        color: 'rgba(0,255,0,0.3)',
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#ffffff',
        }),
        stroke: new ol.style.Stroke({
            color: '#000',
            width: 3,
        }),
    }),
});

var pointStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
        }),
    }),
    image: new ol.style.Circle({
        radius: 13,
        fill: new ol.style.Fill({ color: 'yellow' }),
        stroke: new ol.style.Stroke({
            color: [255, 0, 0], width: 2
        })
    })
});

function Refresh() {
    let timerId = setInterval(() => map.updateSize(), 1);
    setTimeout(() => { clearInterval(timerId); }, 700);
}

var keyListenerOnClick;
var keyListenerPointerMove;

var displayFeatureInfo;

var view = new ol.View({
    center: ol.proj.fromLonLat([28.5, 53]),
    zoom: 7
});

function initMap() {

    const OpenStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMStandard'
    })

    const BingMapSpace = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'AkPePzQAUoC7qKlVTNT4nw0Ykq2EJ4nLE9Iq8-7NZY4wI2Owxebqqur_4zMiboZh',
            imagerySet: "AerialWithLabels"
        }),
        visible: false,
        title: 'BMSpase'
    })

    const TileArcGis = new ol.layer.Tile({
        source: new ol.source.TileArcGISRest({
            url: 'http://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer'
        }),
        visible: false,
        title: 'ARCGis'
    })

    const MapGroup = new ol.layer.Group({
        layers: [
            OpenStreetMapStandard, BingMapSpace, TileArcGis
        ]
    })

    const LayerElements = document.querySelectorAll('.selector-map');
    for (let LayerElement of LayerElements) {
        LayerElement.onchange = function () {
            let LayerElamentValue = this.value;
            MapGroup.getLayers().forEach(function (element, index, array) {
                let MapTitle = element.get('title');
                element.setVisible(MapTitle === LayerElamentValue);
            })
        }
    }

    var mousePositionControl = new ol.control.MousePosition({
        projection: 'EPSG:4326',
        coordinateFormat: function (coordinate) {
            return ol.coordinate.format(coordinate, '{y} N, {x} E', 5);
        }
    });

    map = new ol.Map({
        interactions: ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]),
        controls: ol.control.defaults().extend([
            new ol.control.ZoomSlider(),
            mousePositionControl,
            new ol.control.ScaleLine(),
            new ol.control.FullScreen()
        ]),
        target: 'map',
        view: view,
        layers: [MapGroup]
    });

    var featureOverlay = new ol.layer.VectorImage({
        source: new ol.source.Vector(),
        map: map,
        style: function (feature) {
            if (feature.get('name') === null) {
                highlightStyle.getText().setText('№ ' + feature.get('num_kv'));
            }
            else {
                highlightStyle.getText().setText(feature.get('name'));
            }
            return highlightStyle;
        },
    });

    var highlight;
    displayFeatureInfo = function (pixel) {
        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
        });

        var info = document.getElementById('info');
        if (feature) {
            info.innerHTML = feature.getId() + ': ' + feature.get('name');
        } else {
            info.innerHTML = '&nbsp;';
        }

        if (feature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.getSource().addFeature(feature);
            }
            highlight = feature;
        }

        return feature;
    };

    keyListenerPointerMove = map.on('pointermove', function (evt) {
        if (evt.dragging) {
            return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
    });

    keyListenerOnClick = map.on('click', function (evt) {
        triggerModal(displayFeatureInfo(evt.pixel));
    });
}

var idSelectLayer = 0;

function getLayers() {

    var divCheckbox = document.getElementById('styleCheck');

    var parser = new ol.format.WMSCapabilities();
    fetch(geoserverURL + paramsGeoserverLayers)
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {

            var result = parser.read(text);
            var allLayers = result.Capability.Layer.Layer;

            emeraldLayers = allLayers.filter(item => item.Name.includes("emerald"));
            console.log(emeraldLayers);

            const ListLayers = document.querySelector('.list-layers');

            for (let item of emeraldLayers) {
                var layerCoordinates = item.EX_GeographicBoundingBox;
                let x1 = layerCoordinates[0]; let x2 = layerCoordinates[2];
                let y1 = layerCoordinates[1]; let y2 = layerCoordinates[3];

                var Midpoint = [0, 0];
                    Midpoint[0] = (x1 + x2) / 2;
                    Midpoint[1] = (y1 + y2) / 2;

                item.Style.shift(); // Removing the default style
                var layerId = initLayer(item);
                if (item.Style.length != 0) {
                    ListLayers.innerHTML += '<li><a class="clip" href="#"> <div class="layer-block">' + item.Title + '</div> <div class="tool-for-layer"> <button value="' + Midpoint + '" type="button" class="btn btn-primary btn-circle btn-go-to-place"> <i class="bi bi-box-arrow-in-down"></i> </button> <button value="' + layerId + '" type="button" class="btn btn-primary btn-circle-ellipsis btn-style-layer"> <i class="bi bi-brush"></i> </button> <input value="' + layerId + '" type="checkbox" class="switch-layer" data-toggle="switchbutton" checked data-size="sm" data-width="46" data-onlabel=\"<i style=\'font-size: 16px\' class=\'bi bi-eye\'></i>\" data-offlabel=\"<i style=\'font-size: 16px\' class=\'bi bi-eye-slash\'></i>\" data-style="ios"> </div> </a> </li>';
                }
                else {
                    ListLayers.innerHTML += '<li><a class="clip" href="#"> <div class="layer-block">' + item.Title + '</div> <div class="tool-for-layer"> <button value="' + Midpoint + '" type="button" class="btn btn-primary btn-circle btn-go-to-place"> <i class="bi bi-box-arrow-in-down"></i> </button> <button value="' + layerId + '" type="button" class="btn btn-primary btn-circle-ellipsis btn-style-layer" disabled> <i class="bi bi-brush"></i> </button> <input value="' + layerId + '" type="checkbox" class="switch-layer" data-toggle="switchbutton" checked data-size="sm" data-width="46" data-onlabel=\"<i style=\'font-size: 16px\' class=\'bi bi-eye\'></i>\" data-offlabel=\"<i style=\'font-size: 16px\' class=\'bi bi-eye-slash\'></i>\" data-style="ios"> </div> </a> </li>';
                }
            }

            const buttonsPlaceLayers = document.querySelectorAll('.btn-go-to-place');
            for (let item of buttonsPlaceLayers) {
                item.onclick = function () {
                    var buttonValue = this.value;
                    var Midpoint = buttonValue.split(",");
                    var mapMidpoint = ol.proj.fromLonLat([Number(Midpoint[0]), Number(Midpoint[1])]);

                    flyTo(mapMidpoint, function () { });
                }
            }

            const buttonsStyleLayers = document.querySelectorAll('.btn-style-layer');
            for (let item of buttonsStyleLayers) {
                item.onclick = function () {
                    divCheckbox.innerHTML = '<div class="form-check"> <input class="form-check-input" type="radio" name="flexRadioDefault" value="null" checked> <label class="form-check-label" for="flexRadioDefault"> Стандартный </label> </div>';

                    idSelectLayer = this.value;
                    var itemStyleCatalog = styleСatalog.get(idSelectLayer);

                    for (var i = 0; i < itemStyleCatalog.nameStyles.length; i++) {
                        divCheckbox.innerHTML += '<div class="form-check"> <input class="form-check-input" type="radio" name="flexRadioDefault" value="' + itemStyleCatalog.nameStyles[i] + '"> <label class="form-check-label" for="flexRadioDefault1"> ' + itemStyleCatalog.nameStyles[i] + '</label> </div>';
                    }
                    $('#StyleModal').modal('show') 
                }
            }
            document.getElementById('btnSetStyle').onclick = function () {
                var inp = document.getElementsByName('flexRadioDefault');
                for (var i = 0; i < inp.length; i++) {
                    if (inp[i].type == "radio" && inp[i].checked) {
                        styleСatalog.get(idSelectLayer).setStyleLayer(inp[i].value);
                    }
                }
            };

            const SwitchesLayers = document.querySelectorAll('.switch-layer');
            for (let item of SwitchesLayers) {
                item.switchButton();
                item.switchButton('off');

                item.onchange = function () {
                    let LayerSwitcherValue = this.value;

                    map.getLayers().forEach(function (element, index, array) {
                        if (element.ol_uid === LayerSwitcherValue) {
                            var styleLayer = styleСatalog.get(element.ol_uid);
                            if (styleLayer.stylуСomponent !== null) {
                                if (styleLayer.activeStyles !== null) {
                                    styleLayer.activeStyles.setVisible(item.checked);
                                }
                            }
                            element.setVisible(item.checked);
                        }
                    })
                }
            }
        })
}


//////////// LAYERS //////////////
var supportsFiltering = true;

let layerIndicator = 0;
const urlGetPointPictures = 'Maps/GetPointPictures';

function initLayer(Layer) {

    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function (extent) {
            return (
                geoserverURL + '/emerald/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + Layer.Name + '&' +
                'outputFormat=application/json&srsname=EPSG:3857&' +
                'bbox=' +
                extent.join(',') +
                ',EPSG:3857'
            );
        },
        strategy: ol.loadingstrategy.bbox,
    });

    var vector = new ol.layer.VectorImage({
        source: vectorSource,
        style: function (feature) {
            if (feature.getGeometry().getType() === 'Point') {
                if (feature.get('name') === null) {
                    pointStyle.getText().setText('№ ' + feature.get('num_kv'));
                }
                else {
                    pointStyle.getText().setText(feature.get('name'));
                }
                return pointStyle;
            }
            else {
                if (feature.get('name') === null) {
                    style.getText().setText('№ ' + feature.get('num_kv'));
                }
                else {
                    style.getText().setText(feature.get('name'));
                }
                return style;
            }
        },
        visible: false,
    });

    var stl = new StylesLayer(Layer, null);
    styleСatalog.set(vector.ol_uid, stl);

    vector.setZIndex(10);
    map.addLayer(vector);
    return vector.ol_uid;
}

function StylesLayer(Layer, activeStyles) {

    if (Layer.Style.length != 0) {

        var untiled = new ol.layer.Image({
            source: new ol.source.ImageWMS({
                ratio: 1,
                url: 'http://localhost:8080/geoserver/emerald/wms',
                params: {
                    'FORMAT': format,
                    'VERSION': '1.1.1',
                    "STYLES": '',
                    "LAYERS": Layer.Name,
                    "exceptions": 'application/vnd.ogc.se_inimage',
                }
            })
        });
        untiled.setZIndex(0);

        var arrName = [];
        for (var i = 0; i < Layer.Style.length; i++) {
            var stringArray = Layer.Style[i].Name.split(":");
            arrName.push(stringArray[stringArray.length - 1]);
        }

        this.nameStyles = arrName;
        this.stylуСomponent = untiled;
        this.activeStyles = activeStyles;
        this.setStyleLayer = function (style) {
            if (style === 'null') {
                map.removeLayer(this.stylуСomponent);
            }
            else {
                if (this.activeStyles === 'null') {
                    this.stylуСomponent.getSource().updateParams({ 'STYLES': style });
                    this.activeStyles = this.stylуСomponent;
                    map.addLayer(this.activeStyles);
                }
                else {
                    map.removeLayer(this.activeStyles);
                    this.stylуСomponent.getSource().updateParams({ 'STYLES': style });
                    this.activeStyles = this.stylуСomponent;
                    map.addLayer(this.activeStyles);
                }
            }
        }
        return this;
    }
    else {
        this.stylуСomponent = null;
        return this;
    }
};

///////// MODAL WINDOW ///////////
let id_lc = 0;
let st_trial_plot_id = 0;

function triggerModal(feature) {
    if (typeof feature !== 'undefined') {

        Object.keys(feature.values_).forEach(function (key) {
            layerIndicator += 1;
        });

        if (layerIndicator > 1) {

            var imageGallery = document.getElementById('image-gallery');
            var formUploadImage = document.getElementById('form-upload-image');

            $('#form-upload-image').hide();

            if (feature.getGeometry().getType() === 'Point') {

                $('#form-upload-image').show();

                var id = document.getElementById('hidden-field');
                var stringArray = feature.id_.split(".");
                id.value = stringArray[stringArray.length - 1];

                var url = urlGetPointPictures + '?_point_id=' + id.value;

                fetch(url)
                    .then(function (response) {
                        if (response.ok) {
                            return response.text();
                        } else {
                            alert("Ошибка HTTP: " + response.status);
                        }
                    })
                    .then(function (text) {
                        var respons = JSON.parse(text);
                        var Gallery = ''

                        if (respons.length !== 0) {
                            for (var i = 0; i < respons.length; i++) {
                                Gallery += '<div class="col-md-3 col-sm-4 col-xs-6 thumb"> <a data-fancybox="gallery" href="' + respons[i].photo_path + '"> <img class="img-responsive" src="' + respons[i].photo_path + '"> </a> </div>';
                            }
                            imageGallery.innerHTML = Gallery;
                        }
                        else {
                            imageGallery.innerHTML = '<div style="margin-left: 8em;height: 6em;"><h2>Нет загруженных картинок</h2></div>';
                        }
                    })
            }
            else {
                imageGallery.innerHTML = '';
            }

            if (feature.get('name') === null) {
                document.getElementById('ModalLabel').innerHTML = feature.get('name_code') + ' № ' + feature.get('num_kv');
            }
            else {
                if (typeof feature.get('name') === 'undefined') {
                    document.getElementById('ModalLabel').innerHTML = "Лесосека № " +  feature.get('id_lc');
                }
                else {
                    document.getElementById('ModalLabel').innerHTML = feature.get('name');
                }
            }

            var attributesBox = document.getElementById('AttributesBox');
            attributesBox.innerHTML = '';

            var lessecCheck = false;
            var areasCheck = false;
            var modalTrigger = false;

            modalTrigger = openUniverseBundleWin(feature);

            Object.keys(feature.values_).forEach(function (key) {
                if ({}.toString.call(feature.values_[key]) !== '[object Object]') {
                    if (key === 'id_lc') {
                        id_lc = feature.values_[key];
                        lessecCheck = true;
                    }
                    if (key === 'st_trial_plot_id') {
                        st_trial_plot_id = feature.values_[key];
                        areasCheck = true;
                    }
                    if (feature.values_[key] === null) {
                        attributesBox.innerHTML += '<div class="mb-3"> <label for="recipient-name-' + key + '" class="col-form-label">' + key
                            + '</label> <input type="text" class="form-control" id="recipient-name-' + key + '" placeholder = "' + feature.values_[key] + '"></div>';
                    }
                    else {
                        attributesBox.innerHTML += '<div class="mb-3"> <label for="recipient-name-' + key + '" class="col-form-label">' + key
                            + '</label> <input type="text" class="form-control" value="' + feature.values_[key]
                            + '" id="recipient-name-' + key + '"></div>';
                    }
                }
            });
            
            if (lessecCheck) {
                openNewWin();
            }
            else {
                $('#btn-info').hide();
            }

            if (areasCheck) {
                openBundleWin();
            }
            else {
                $('#btn-bundle').hide();
            }

            if (!lessecCheck && !areasCheck && !modalTrigger) {
                $('#ModalWindow').modal('show')
            }

        }
        layerIndicator = 0;
        modalTrigger = false;
    }
}

//////////// MEASURE //////////////
var defaultMap;
var draw;

var overlayHelpTooltip;
var overlayMeasureTooltip;

var keyPointerMoveHandler;
var funcHiddenTooltip;

var helpTooltipElement;

function initMeasurement() {

    defaultMap = map;

    ol.Observable.unByKey(keyListenerOnClick);
    ol.Observable.unByKey(keyListenerPointerMove);

    var source = new ol.source.Vector();

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33',
                }),
            }),
        }),
    });

    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
    var sketch;


    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     */
    var helpTooltip;

    /**
     * The measure tooltip element.
     * @type {HTMLElement}
     */
    var measureTooltipElement;

    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */
    var measureTooltip;

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    var continuePolygonMsg = 'Нажмите, чтобы продолжить рисование многоугольника';

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    var continueLineMsg = 'Нажмите, чтобы продолжить рисование линии';

    /**
     * Handle pointer move.
     * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
     */
    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Нажмите, чтобы начать рисовать';

        if (sketch) {
            var geom = sketch.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = continueLineMsg;
            }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');
    };

    map.addLayer(vector);
    keyPointerMoveHandler = map.on('pointermove', pointerMoveHandler);

    funcHiddenTooltip = function hiddenTooltip() {
        helpTooltipElement.classList.add('hidden');
    }
    map.getViewport().addEventListener('mouseout', funcHiddenTooltip);

    var typeSelect = document.getElementById('type');


    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
    var formatLength = function (line) {
        var length = ol.sphere.getLength(line);
        var output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };

    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    var formatArea = function (polygon) {
        var area = ol.sphere.getArea(polygon);
        var output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    function addInteraction() {

        var type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
        draw = new ol.interaction.Draw({
            source: source,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });
        map.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart', function (evt) {
            sketch = evt.feature;

            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', function () {
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
        });
    }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        overlayHelpTooltip = map.addOverlay(helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
        });
        overlayMeasureTooltip = map.addOverlay(measureTooltip);
    }

    /**
     * Let user change the geometry type.
     */
    typeSelect.onchange = function () {
        map.removeInteraction(draw);
        addInteraction();
    };

    addInteraction();
}

function destructMeasurement() {

    map.removeInteraction(draw);

    map.removeOverlay(overlayHelpTooltip);
    map.removeOverlay(overlayMeasureTooltip);

    ol.Observable.unByKey(keyPointerMoveHandler);

    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    helpTooltipElement = undefined;

    map.getViewport().removeEventListener('mouseout', funcHiddenTooltip);

    keyListenerPointerMove = map.on('pointermove', function (evt) {
        if (evt.dragging) {
            return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
    });
    keyListenerOnClick = map.on('click', function (evt) {
        triggerModal(displayFeatureInfo(evt.pixel));
    });
}

////////// GO TO LAYER ////////////
function flyTo(location, done) {

    var duration = 2000;
    var zoom = view.getZoom();
    var parts = 2;
    var called = false;
    
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate(
        {
            center: location,
            duration: duration,
        },
        callback
    );
    view.animate(
        {
            zoom: zoom - 1.3,
            duration: duration / 2,
        },
        {
            zoom: zoom,
            duration: duration / 2,
        },
        callback
    );
}

////////// GEOLOCATION ////////////
function myGeolocation() {

    var geolocation = new ol.Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
    });

    function el(id) {
        return document.getElementById(id);
    }
    el('track').addEventListener('change', function () {
        geolocation.setTracking(this.checked);
    });

    geolocation.on('error', function (error) {
        var info = document.getElementById('info');
        info.innerHTML = error.message;
        info.style.display = '';
    });
    geolocation.on('change:position', function () {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    });

    var accuracyFeature = new ol.Feature();
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });
    var positionFeature = new ol.Feature();
    positionFeature.setStyle(
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: '#cc334d',
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 2,
                }),
            }),
        })
    );

    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature],
        }),
    });
}

//////////// GEOMETRY /////////////
var geometrySource = new ol.source.Vector();
var drawVector = new ol.layer.Vector({
    source: geometrySource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0, 255, 0, 0.5)',
        }),
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.5)',
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 2,
            }),
        }),
    }),
});

var geometryModify = new ol.interaction.Modify({ source: geometrySource });
var geometryDraw, geometrySnap;

document.getElementById('undo').addEventListener('click', function () {
    geometryDraw.removeLastPoint();
});

function initGeometry() {

    ol.Observable.unByKey(keyListenerOnClick);
    ol.Observable.unByKey(keyListenerPointerMove);

    map.addInteraction(geometryModify);

    var typeSelect = document.getElementById('geom-type');

    function addInteractions() {
        geometryDraw = new ol.interaction.Draw({
            source: geometrySource,
            type: typeSelect.value,
        });
        map.addInteraction(geometryDraw);
        geometrySnap = new ol.interaction.Snap({ source: geometrySource });
        map.addInteraction(geometrySnap);
    }

    typeSelect.onchange = function () {
        map.removeInteraction(geometryDraw);
        map.removeInteraction(geometrySnap);
        addInteractions();
    };

    addInteractions();
}

function destructGeometry() {

    map.removeInteraction(geometryModify);
    map.removeInteraction(geometryDraw);
    map.removeInteraction(geometrySnap);

    keyListenerPointerMove = map.on('pointermove', function (evt) {
        if (evt.dragging) {
            return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
    });
    keyListenerOnClick = map.on('click', function (evt) {
        triggerModal(displayFeatureInfo(evt.pixel));
    });
}

///////////// MAIN ////////////////
document.addEventListener('DOMContentLoaded', function () {
    geoserverURL = document.getElementById('connect').value;

    document.getElementById('sidebarCollapse').onclick = function () {
        Refresh();
    };
    document.getElementById('switch-measure').onchange = function () {
        if (this.checked) {
            initMeasurement();
            $('#measurement-type').show();
        }
        else {
            destructMeasurement();
            $('#measurement-type').hide();
        }
    }
    document.getElementById('switch-painter').onchange = function () {
        if (this.checked) {
            initGeometry();
            $('#geometry-type').show();
        }
        else {
            destructGeometry();
            $('#geometry-type').hide();
        }
    } 

    getLayers();
    initMap();
    myGeolocation();
    map.addLayer(drawVector);

    document.getElementById('btn-info').onclick = function () {
        openNewWin();
    }

    document.getElementById('btn-bundle').onclick = function () {
        openBundleWin();
    }
}
)

function openBundleWin() {
    var url = '/Maps/GetUriBundle' + '?id=' + st_trial_plot_id;

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        })
        .then(function (text) {
            if (text == null) {
                alert("С запрашиваемой пробной площадью нет связанных данных");
            }
            else {
                open(text);
            }
        })
}

function openUniverseBundleWin(feature) {
    var url = '/Maps/GetUniversalBundle';
    var universeUrl = '';
    var modal = false;

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        })
        .then(function (text) {
            var respons = JSON.parse(text);

            if (respons.length !== 0) {
                Object.keys(feature.values_).forEach(function (key) {
                    if ({}.toString.call(feature.values_[key]) !== '[object Object]') {
                        for (var i = 0; i < respons.length; i++) {
                            if (key === respons[i].field) {
                                universeUrl = respons[i].url + "/"  + feature.values_[key];
                                open(universeUrl);
                                modal = true;
                                $('#ModalWindow').modal('hide')
                            }
                        }
                    }
                });
            }
            else {
                modal = false;
            }
        })

    return modal;
}

function openNewWin() {
    var url = '/Area' + '?id=' + id_lc;
    open(url);
}