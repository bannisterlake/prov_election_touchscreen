import React, { useState, useEffect } from "react";
import "./App.css";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ReactTooltip from 'react-tooltip'
import fetchJsonp from 'fetch-jsonp'

//Components
import Map from './components/Map';
import Sidebar from './components/Sidebar'
import ResultsModal from './components/ResultsModal'

const styles = makeStyles({
	main: {
		fontFamily: 'Roboto',
		height: '100%',
		display: 'flex',
		position: 'relative',
		
	}
})

const App = () => {

	const [EDSelected, setSelected] = useState('')
	const [data, setData] = useState(null)
	const [oldData, setOldData] = useState(null)
	const [scale, setScale] = useState(1)
	const [counter, setCounter] = useState(30)
	const [year, toggleYear] = useState('2020')
    const [zoomCenter, setZoomCenter] = useState(null)
	const [showModal, toggleModal] = useState(false)
	const [clickable, toggleClickable] = useState(true)
	const [selectedData, setSelectedData] = useState(null)
	const [selectedRegion, setSelectedRegion] = useState(null)
	const [partyList, setPartyList] = useState(null)
	const [config, setConfig] = useState(null)
	const [prov, setProv] = useState('nb')

	const classes = styles();


	const regionList = {
		'sk': {
			"Regina": {
				"zoomCenter": {zoom: 350, center: [-104.6, 50.5]},
				"EDList": [
					'Regina Coronation Park',
					"Regina Douglas Park",
					"Regina Elphinstone-Centre",
					"Regina Gardiner Park",
					"Regina Lakeview",
					"Regina Northeast",
					"Regina Pasqua",
					"Regina Rochdale",
					"Regina Rosemont",
					"Regina University",
					"Regina Walsh Acres",
					"Regina Wascana Plains"
				]
			},
			"Saskatoon": {
				"zoomCenter": {zoom: 350, center: [-106.7, 52.1]},
				"EDList": [
					"Saskatoon Centre",
					"Saskatoon Churchill-Wildwood",
					"Saskatoon Eastview",
					"Saskatoon Fairview",
					"Saskatoon Meewasin",
					"Saskatoon Northwest",
					"Saskatoon Nutana",
					"Saskatoon Riversdale",
					"Saskatoon Silverspring-Sutherland",
					"Saskatoon Southeast",
					"Saskatoon Stonebridge-Dakota",
					"Saskatoon University",
					"Saskatoon Westview",
					"Saskatoon Willowgrove"
				]
			}
		},
		"nb": {
			"Fredericton": {
				"zoomCenter": {zoom: 180, center: [-66.5, 45.95]},
				"EDList": [
					'Oromocto-Lincoln-Fredericton',
					'Fredericton-Grand Lake',
					"New Maryland-Sunbury",
					"Fredericton South",
					"Fredericton North",
					"Fredericton-York",
					"Fredericton West-Hanwell"
			]},
			"Moncton": {
				"zoomCenter": {zoom: 250, center: [-64.8, 46]},
				"EDList": [
					"Dieppe",
					"Moncton East",
					"Moncton Centre",
					"Moncton South", 
					"Moncton Northwest",
					"Moncton Southwest",
					"Riverview",
					"Albert"
			]},
			"Saint John": {
				"zoomCenter": {zoom: 200, center: [-66, 45.3]},
				"EDList": [
					"Hampton",
					"Saint John East",
					"Saint John Harbour", 
					"Saint John Lancaster",
					"Portland-Simonds",
					"Fundy-The Isles-Saint John West",
			]}
		},
		"bc": {
			"Metro Vancouver": {
				"zoomCenter": {zoom: 400, center: [-123.0, 49.25]},
				"EDList": [
					"Burnaby-Deer Lake",
					"Burnaby-Edmonds",
					"Burnaby-Lougheed",
					"Burnaby North",
					"Coquitlam-Burke Mountain",
					"Coquitlam-Maillardville",
					"Delta North",
					"Delta South",
					"Maple Ridge-Mission",
					"Maple Ridge-Pitt Meadows",
					"New Westminster",
					"North Vancouver-Lonsdale",
					"North Vancouver-Seymour",
					"Port Coquitlam",
					"Port Moody-Coquitlam",
					"Richmond North Centre",
					"Richmond-Queensborough",
					"Richmond South Centre",
					"Richmond-Steveston",
					"Surrey-Cloverdale",
					"Surrey-Fleetwood",
					"Surrey-Green Timbers",
					"Surrey-Guildford",
					"Surrey-Newton",
					"Surrey-Panorama",
					"Surrey South",
					"Surrey-Whalley",
					"Surrey-White Rock",
					"Vancouver-Fairview",
					"Vancouver-False Creek",
					"Vancouver-Fraserview",
					"Vancouver-Hastings",
					"Vancouver-Kensington",
					"Vancouver-Kingsway",
					"Vancouver-Langara",
					"Vancouver-Mount Pleasant",
					"Vancouver-Point Grey",
					"Vancouver-Quilchena",
					"Vancouver-West End",
					"West Vancouver-Capilano",
					"West Vancouver-Sea to Sky"
				]
			},
			"Vancouver": {
				"zoomCenter": {zoom: 950, center: [-123.13, 49.28]},
				"EDList": [
					"North Vancouver-Lonsdale",
					"North Vancouver-Seymour",
					"Vancouver-Fairview",
					"Vancouver-False Creek",
					"Vancouver-Fraserview",
					"Vancouver-Hastings",
					"Vancouver-Kensington",
					"Vancouver-Kingsway",
					"Vancouver-Langara",
					"Vancouver-Mount Pleasant",
					"Vancouver-Point Grey",
					"Vancouver-Quilchena",
					"Vancouver-West End",
					"West Vancouver-Capilano",
					"West Vancouver-Sea to Sky"
				]
			},
			"Burnaby & Tri-Cities": {
				"zoomCenter": {zoom: 500, center: [-122.8, 49.25]},
				"EDList": [
					"Burnaby-Deer Lake",
					"Burnaby-Edmonds",
					"Burnaby-Lougheed",
					"Burnaby North",
					"Coquitlam-Burke Mountain",
					"Coquitlam-Maillardville",
					"Maple Ridge-Mission",
					"Maple Ridge-Pitt Meadows",
					"New Westminster",
					"Port Coquitlam",
					"Port Moody-Coquitlam"
				]
			},
			"Richmond": {
				"zoomCenter": {zoom: 650, center: [-123.05, 49.2]},
				"EDList": [
					"Richmond North Centre",
					"Richmond-Queensborough",
					"Richmond South Centre",
					"Richmond-Steveston"
				]
			},
			"Surrey & Delta": {
				"zoomCenter": {zoom: 500, center: [-122.9, 49.1]},
				"EDList": [
					"Delta North",
					"Delta South",
					"Surrey-Cloverdale",
					"Surrey-Fleetwood",
					"Surrey-Green Timbers",
					"Surrey-Guildford",
					"Surrey-Newton",
					"Surrey-Panorama",
					"Surrey South",
					"Surrey-Whalley",
					"Surrey-White Rock"
				]
			},
			"Fraser Valley": {
				"zoomCenter": {zoom: 300, center: [-122.3, 49.3]},
				"EDList": [
 					"Abbotsford-Mission",
					"Abbotsford South",
					"Abbotsford West",
					"Chilliwack",
					"Chilliwack-Kent",
					"Langley",
				 	"Langley East"
				]
			},
			"Kootenays & Okanagan": {
				"zoomCenter": {zoom: 50, center: [-118.5, 50.8]},
				"EDList": [
					"Boundary-Similkameen",
					"Columbia River-Revelstoke",
					"Kelowna-Lake Country",
					"Kelowna-Mission",
					"Kelowna West",
					"Kootenay East",
					"Kootenay West",
					"Nelson-Creston",
					"Penticton",
					"Shuswap",
					"Vernon-Monashee"
				]
			},
			"The North & Cariboo-Thompson": {
				"zoomCenter": {zoom: 16, center: [-128, 56]},
				"EDList": [
					"Cariboo-Chilcotin",
					"Cariboo North",
					"Fraser-Nicola",
					"Kamloops-North Thompson",
					"Kamloops-South Thompson",
					"Nechako Lakes",
					"North Coast",
					"Peace River North",
					"Peace River South",
					"Prince George-Mackenzie",
					"Prince George-Valemount",
					"Skeena",
					"Stikine"
				]
			},
			"Vancouver Island/Sunshine Coast": {
				"zoomCenter": {zoom: 40, center: [-126, 50]},
				"EDList": [
					"Courtenay-Comox",
					"Cowichan Valley",
					"Esquimalt-Metchosin",
					"Langford-Juan de Fuca",
					"Mid Island-Pacific Rim",
					"Nanaimo",
					"Nanaimo-North Cowichan",
					"North Island",
					"Oak Bay-Gordon Head",
					"Parksville-Qualicum",
					"Powell River-Sunshine Coast",
					"Saanich North and the Islands",
					"Saanich South",
					"Victoria-Beacon Hill",
					"Victoria-Swan Lake"
				]
			},
			"Victoria": {
				"zoomCenter": {zoom: 300, center: [-123.5, 48.5]},
				"EDList": [
					"Esquimalt-Metchosin", 
					"Victoria-Beacon Hill", 
					"Oak Bay-Gordon Head",
					"Victoria-Swan Lake",
					"Saanich South", 
					"Saanich North and the Islands"
				]
			}
		}

	}

	useEffect(()=>{
		// regionList.skregions
		var prefix = process.env.NODE_ENV === 'development' ? './': "";
		let province = 'nb'
		try{
			// console.log(window.location.search.split('/').find(el=>el.includes('?prov=')))
			province = window.location.search.split('/').find(el=>el.includes('?prov=')).split('=')[1];
			setProv(province)
			fetch(`${prefix}${province}election.config.json`)
			.then(res=>{
				console.log(res)
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json=>{
				setConfig(json)
				setZoomCenter({zoom: json.zoom, center: json.center})
			})
			.catch(err=>console.log("config error",err))
		} catch(e) {
			console.log('error getting province')
		}

	},[])

	useEffect(()=>{

		if (config && prov) {
			if (process.env.NODE_ENV === 'development' && config.database) {
				console.log('get data from elector')
				getDevData();
				setInterval(()=>{
					getDevData();
				}, config.timer);
			} else {
				console.log('get data from local')
				getProdData();
				setInterval(()=>{
					getProdData();
				}, config.timer);
			}
			getStaticData();
		}

	},[config])

	const getDevData = () => {
		console.log('fetching')
	
		//full results
		fetchJsonp(`${config.database}api/CandidateByRiding/?json=true`)
			.then(res=>{
				if (res.ok) {
					return res.json();
				}
			})
			.then(json=>{
				setData(json)
			})
			.catch(err=>console.log(err))
		
	}

	const getProdData = () => {
		var prefix = process.env.NODE_ENV === 'development' ? './': "";
	
		console.log('fetching')

		fetch(`${prefix}data/${prov}_full_2020.json`, {'cache': 'no-cache'})
			.then(res=>{
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json=>
				setData(json)
			)
			.catch(err=>console.log(err))
		
	}

	const getStaticData = () => {
		console.log('static')
		var prefix = process.env.NODE_ENV === 'development' ? './': "";
		// var prov = process.env
		fetch(`${prefix}data/${prov}_full_prev.json`)
			.then(res=>{
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json=>
				setOldData(json)
			)
			.catch(err=>console.log(err))
		
		fetch(`${prefix}data/${prov}_overall.json`)
			.then(res=>{
				if (res.ok) {
					return res.json()
				}
			})
			.then(json=>{
				console.log('party',json)
				setPartyList(json.partyResults)
			})
			.catch(err=>console.log(err))
		
	}

	const getSelectedData = (el) => {
		console.log('setData', el)
		if (year === '2020') {
			var tempData = data.data.find(contest=>{
				return contest.name === el
			})
	
		} else {
			var tempData = oldData.data.find(contest=>{
				return contest.name === el
			})
		} 
		if (el) {
			toggleModal(true)
		}
		setSelectedData(tempData)
		


	}

	const handleClick = (el, center, zoom) => {
		console.log("click", el)

		setSelected(el)
		setZoomCenter({zoom: zoom, center: center})
		getSelectedData(el)

	}

	const handleZoom = (e) => {
		if (e.scale === 1 && e.previousScale === 1) {
			var initZoom = zoomCenter.zoom
			var newZoom = (initZoom - (initZoom/5))

			if (newZoom >= 12 ) {
				setZoomCenter({...zoomCenter, zoom: newZoom})
			} else 
				setZoomCenter({zoom: 12, center: config.center})
		}
	}

	const handleZoomRegion = (region) => {
		if (region !== '') {
			console.log(regionList[prov][region])
			setSelectedRegion(region)
			setZoomCenter(regionList[prov][region].zoomCenter)
		} else {
			setSelectedRegion(null)
			setZoomCenter( {zoom: config.zoom, center: config.center} )
		}
	}


	const handlePanningStop = () => {
		setTimeout(() => {
			toggleClickable(true)
		}, 100);
	}




	return (
		<div className={classes.main}>
			{/* {console.log(regionList[prov])} */}
			<div className="left">
				<TransformWrapper 
					wheel={{
						step: 40
					}}
					options={{
						limitToBounds: false,
						maxScale: 1000,
					}}
					onPinching={handleZoom}
					onWheel={handleZoom}
					onPanning={()=>toggleClickable(false)}
					onPanningStop={handlePanningStop}

					>
					{({zoomIn, zoomOut, setDefaultState, resetTransform})=>(
						<>
						<Map 
							setDefaultState={setDefaultState}
							handleClick={handleClick} 
							clickable={clickable}
							zoomCenter={zoomCenter} 
							selected={EDSelected}
							scale={scale} 
							year={year}
							data={year === '2020' ? data: oldData} 
							partyList={partyList}
							prov={prov}
							config={config}
							handleClick={handleClick}/>
						<Sidebar 
							setDefaultState={setDefaultState}
							regionList={regionList[prov]}
							selectedRegion={selectedRegion}
							handleZoomRegion={handleZoomRegion}
							data={year === '2020' ? data: oldData} 
							year={year} 
							valueList={data} 
							config={config}
							value={EDSelected} 
							handleClick={handleClick}
							prov={prov}
							handleYear={(selectedYear)=>toggleYear(selectedYear)}	/>						
					</>
					)}
				</TransformWrapper>
			</div>

			<ResultsModal 
				open={showModal}
				config={config} 
				year={year}
				handleClose={()=>toggleModal(false)} 
				data={selectedData}
				partyList={partyList} />
		</div>
	);
}

export default App;