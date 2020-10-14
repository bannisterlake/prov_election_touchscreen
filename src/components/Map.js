import React, { useState, useEffect } from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Annotation
  } from "react-simple-maps";
  
import { geoCentroid, geoBounds, geoPath, geoArea } from "d3-geo";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import {makeStyles} from '@material-ui/core'

import ReactTooltip from 'react-tooltip'




var prefix = process.env.NODE_ENV === 'development' ? './': "";  

const geoUrl = `${prefix}data/${process.env.PROV}_geo.json`
// const saskUrl = '../data/'

const styles = makeStyles({
    mapContainer: {
        height: '100%',
        flex: 4,
        backgroundColor: '#42515c',
        '& #yearLabel': {
			// position: 'absolute',
			
		}
    }
})

const Map = (props) => {
    
    const geoUrl = `${prefix}data/${props.prov}_geo.json`

    
    const classes = styles()
    
    // const [zoomCenter, setZoomCenter] = useState({zoom: 12, center: [-90, 54]})

    useEffect(()=>{
        setTimeout(() => {
        ReactTooltip.rebuild()
            
        }, 1000);
    },[])

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

        // console.log(el)

        if (props.clickable) {
            props.setDefaultState();
        }
        props.handleClick(el, center,zoom)
        // setZoomCenter/({zoom: zoom, center: center})
    }

    const getFill = (geo) => {
        // console.log('fill', geo)
        var fill = '#24323e'
        var opacity = 1
        try {
            if (props.data && props.partyList) { 
                const contest = props.data.data.find(contest=>{
                    return contest.name === geo.Name
                })
                // console.log(contest)
                if (contest) {
                    if (contest.results.length > 0) {
                        if (contest.pollsReported/contest.pollsTotal < 0.15) {
                            console.log('opacity')
                            opacity = 0.5
                        }
                        if (contest.results[0].votes > 0 ) {
                            if (contest.results[0].partyCode === "NDP") {
                                return  {fill: 'rgb(221, 102, 0)', opacity: opacity};
                            }
                            if (contest.results[0].partyCode === "PC") {
                                return  {fill: '#003399', opacity: opacity};
                            }
                            var party = contest.results[0].partyCode
                            var partyInfo = props.partyList.find(el=>{
                                return el.nameShort === party    
                            })
                            if (partyInfo) {

                                fill = partyInfo.color
                            }
                            else fill = 'rgb(89, 91, 91)'
                        }
                        else fill = 'rgb(36, 50, 62)'
                    }
                }
            } else {
                console.log("no data")
            }

            return {fill: fill, opacity: opacity};

        } catch(e) {
            console.log("error getting fill", geo)
            fill = 'rgb(89, 91, 91)'
            return {fill: fill, opacity: opacity};
        }
        
    }
    

    return (
        <div id="mapContainer" className={classes.mapContainer}>
            
            <TransformComponent>
                
            {/* <div id="yearLabel">{props.year}</div> */}

                {props.zoomCenter && <ComposableMap style={{width: '100%', overflow: 'visible'}} projection="geoMercator" projectionConfig={{scale: 108}}>

                    <ZoomableGroup disablePanning disableZooming center={props.zoomCenter.center} zoom={props.zoomCenter.zoom}>
                        <Geographies geography={geoUrl}>
                            {({geographies}) =>
                                geographies.map(geo=>{
                                    const centroid = geoCentroid(geo);
                                    const zoom = getZoom(geoArea(geo));
                                    const fillData = getFill(geo.properties);
                                    const fill = fillData.fill
                                    var strokeWidth = props.zoomCenter.zoom > 200 ? 0.005 : 0.01;
                                    var ED = geo.properties.Name ? geo.properties.Name : undefined;
                                    return <Geography 
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={fill}
                                    stroke="#EAEAEC"
                                    strokeWidth={0.001}
                                    opacity={(props.selected !== geo.properties.Name || !geo.properties.Name) ? fillData.opacity : 0.8}
                                    id={geo.properties.Name}
                                    strokeWidth={strokeWidth}
                                    onClick={()=>geo.properties.Name && handleClick(geo.properties.Name, centroid, zoom)}
                                    data-tip={geo.properties.Name}
                                    center={centroid}
                                    zoom={zoom}
                                    style={ geo.properties.Name ? {
                                        default: {
                                            outline: 'none',
                                        },
                                        pressed: {
                                            outline: 'none',

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
                        {props.config && <Annotation 
                            connectorProps={{
                                strokeWidth: 0
                            }}
                            subject={props.config.marker}>
                            <text style={{fontSize: props.config.markerFont, backgroundColor: "rgb(161, 169, 170)"}} fill="white">
                                {props.year}
                            </text>
                        </Annotation>}
                    </ZoomableGroup>
                </ComposableMap>}
            </TransformComponent>
            {/* <ReactTooltip /> */}
        </div>
    )
}

export default Map;
