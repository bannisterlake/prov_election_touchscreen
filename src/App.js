import React, { useState, useEffect } from "react";
import "./App.css";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ReactTooltip from 'react-tooltip'

//Components
import Map from './components/Mapnb';
import Sidebar from './components/Sidebar'
import ResultsModal from './components/ResultsModal'

// const partyList = [
// 	{
// 	  "id": 191,
// 	  "name": "Saskatchewan Party",
// 	  "nameShort": "SP",
// 	  "colour": "#23583f"
// 	},
// 	{
// 	  "id": 188,
// 	  "name": "New Democratic Party",
// 	  "nameShort": "NDP",
// 	  "colour": "#ef7600"
// 	},
// 	{
// 	  "id": 186,
// 	  "name": "Liberal Party",
// 	  "nameShort": "LIB",
// 	  "colour": "#b41d0f"
// 	},
// 	{
// 	  "id": 184,
// 	  "name": "Green Party",
// 	  "nameShort": "GRN",
// 	  "colour": "#3d9156"
// 	},
// 	{
// 	  "id": 190,
// 	  "name": "Progressive Conservative Party",
// 	  "nameShort": "PC",
// 	  "colour": "#2b6abc"
// 	},
// 	{
// 	  "id": 999,
// 	  "name": "Other",
// 	  "nameShort": "OTH",
// 	  "colour": "#595b5b"
// 	}
//   ]

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
    const [zoomCenter, setZoomCenter] = useState({zoom: 47, center: [-66, 45.9]})
	const [showModal, toggleModal] = useState(false)
	const [clickable, toggleClickable] = useState(true)
	const [selectedData, setSelectedData] = useState(null)
	const [partyList, setPartyList] = useState(null)

	const classes = styles();

	useEffect(()=>{
		startTimer();
		getData();
		getStaticData();
	},[])

	const startTimer = () => {
		console.log("updating")
		let remaining = counter
		setInterval(()=>{
			remaining --;
			if (remaining <= 0) {
				getData();
				remaining = counter.counter
			}
		}, 1000);
	}

	const getData = () => {
		var prefix = process.env.NODE_ENV === 'development' ? './': "";

		fetch(`${prefix}data/nb_full_2020.json`)
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
		var prefix = process.env.NODE_ENV === 'development' ? './': "";

		fetch(`${prefix}data/nb_full_2018.json`)
			.then(res=>{
				if (res.ok) {
					return res.json();
				} 
			})
			.then(json=>
				setOldData(json)
			)
			.catch(err=>console.log(err))
		
		fetch(`${prefix}data/nb_overall.json`)
			.then(res=>{
				if (res.ok) {
					return res.json()
				}
			})
			.then(json=>{
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
		toggleModal(true)
		setSelectedData(tempData)
		


	}

	const handleClick = (el, center, zoom) => {
		console.log("click", el, center,zoom)

		// toggleModal(true)

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
				setZoomCenter({zoom: 12, center: [-105, 54]})

		}

	}


	const handlePanningStop = () => {
		setTimeout(() => {
			toggleClickable(true)
		}, 100);
	}




	return (
		<div className={classes.main}>
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
							data={year === '2020' ? data: oldData} 
							partyList={partyList}
							handleClick={handleClick}/>
						<Sidebar 
							setDefaultState={setDefaultState}
							data={year === '2020' ? data: oldData} 
							year={year} 
							valueList={data} 
							value={EDSelected} 
							handleClick={handleClick}
							handleYear={(selectedYear)=>toggleYear(selectedYear)}	/>						
					</>
					)}
				</TransformWrapper>
			</div>

			<ResultsModal 
				open={showModal} 
				handleClose={()=>toggleModal(false)} 
				data={selectedData}
				partyList={partyList} />
		</div>
	);
}

export default App;