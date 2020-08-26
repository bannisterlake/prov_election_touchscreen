import React, { useState, useEffect } from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
  } from "react-simple-maps";
  
import { geoCentroid, geoBounds, geoPath, geoArea } from "d3-geo";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import {makeStyles} from '@material-ui/core'

import ReactTooltip from 'react-tooltip'




var prefix = process.env.NODE_ENV === 'development' ? './': "";  

const geoUrl = `${prefix}data/SASK_Union_proj_lakes.json`
// const saskUrl = '../data/'

const styles = makeStyles({
    mapContainer: {
        height: '100%',
        flex: 3,
        backgroundColor: '#42515c'
    }
})

const Map = (props) => {
    
    const classes = styles()
    
    const [zoomCenter, setZoomCenter] = useState({zoom: 12, center: [-105, 54]})


    useEffect(() => {
        // setTimeout(() => {
        //     ReactTooltip.rebuild()
        // }, 1000);        
    }, [props.data])


    const getZoom = (area) => {
        var zoom = 4;

        if (area > 0.001) {
            zoom = 30;
        } else if (area > 0.0003) {
            zoom = 80;
        } else if (area > 0.0001) {
            zoom = 100;
        } else if (area > 0.00005) {
            zoom = 150
        } else if (area > 0.00001) {
            zoom = 250;
        } else if (area < 0.00001) {
            zoom = 350
        }
        return zoom
        
    }

    const handleClick = (el, center, zoom) => {
        if (props.clickable) {
            props.setDefaultState();
        }
        props.handleClick(el, center,zoom)
        // setZoomCenter({zoom: zoom, center: center})
    }

    const getFill = (geo) => {
        var fill = '#24323e'

        if (props.data) { 
            const contest = props.data.data.find(contest=>{
                return contest.name === geo.Constituen
            })
            if (contest) {
                var party = contest.results[0].partyCode
                
                var partyInfo = props.partyList.find(el=>{
                    return el.nameShort === party    
                })
                if (partyInfo) {
                    fill = partyInfo.colour
                }


                else fill = '#24323e'
            }
        }

        console.log(fill)

        return fill;
    }
    

    return (
        <div id="mapContainer" className={classes.mapContainer}>
            <TransformComponent>
                <ComposableMap style={{width: '100%', overflow: 'visible'}} projection="geoMercator" projectionConfig={{scale: 108}}>
                    <ZoomableGroup disablePanning disableZooming center={props.zoomCenter.center} zoom={props.zoomCenter.zoom}>
                        <Geographies geography={geoUrl}>
                            {({geographies}) =>
                                geographies.map(geo=>{
                                    const centroid = geoCentroid(geo);
                                    const area = geoArea(geo); 
                                    const zoom = getZoom(geoArea(geo));
                                    const fill = getFill(geo.properties);
                                    var strokeWidth = 0.01
                                    var ED = geo.properties.Constituen ? geo.properties.Constituen : undefined;

                                    if (props.scale > 5 && strokeWidth <= 10) {
                                        strokeWidth = 0.005
                                    } else if (props.scale > 10) {
                                        strokeWidth = 0.001
                                    }

                                    return <Geography 
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={fill}
                                    stroke="#EAEAEC"
                                    opacity={(props.selected !== geo.properties.Constituen || !geo.properties.ConCode) ? 1 : 0.8}
                                    id={geo.properties.Constituen}
                                    strokeWidth={geo.properties.ConCode ? strokeWidth: 0.01}
                                    onClick={()=>geo.properties.ConCode && handleClick(geo.properties.Constituen, centroid, zoom)}
                                    data-tip={ED}
                                    center={centroid}
                                    zoom={zoom}
                                    style={ geo.properties.ConCode ? {
                                        default: {
                                            outline: 'none'
                                        },
                                        pressed: {
                                            outline: 'none'
                                        },
                                        hover: {
                                            opacity: 0.8,
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }
                                    } : {
                                        default: {
                                            outline: 'none'
                                        },
                                        pressed: {
                                            outline: 'none'
                                        },
                                        hover: {
                                            outline: 'none'


                                    }
                                    }}
                                    />
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </TransformComponent>
            {/* <ReactTooltip /> */}

        </div>
    )
}

export default Map;
