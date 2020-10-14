import React, {useState} from 'react';
import {
    makeStyles,
    styled,
    Button

} from '@material-ui/core'

import {CSSTransition} from 'react-transition-group'

const styles = makeStyles({
    sidebarContainer: {
        maxWidth: 500,
        flex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',         
        backgroundColor: '#202b36',
        position: 'relative',
        overflow: 'hidden',
    },
    imgContainer: {
        flex: 1,
        borderBottom: '3px solid #131d27',
        display: 'flex', 
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 20,
        '& img': {
            height: 'auto',
            margin: 30,
            maxWidth: '95%',
        }
    },
    buttonContainer: {
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        width: '100%', 
        overflowX: 'hidden',
        zIndex: 10,
        flex: 5,
        paddingBottom: 10,
        // height: '2500px';
        // // flex: 4, 
        // // position: 'relative',
        // overflowY: "scroll",
        // // maxHeight: '100%'
        '& hr': {
            width: '90%'
        }
    },
    yearContainer: {
        display: 'flex',
        maxHeight: '100px',
        justifyContent: 'space-around',
        // position: 'absolute',
        bottom: '0',
        flex: 1,
        width: '100%', 
        backgroundColor: '#202b36',
        zIndex: 21
    }
   
});

const LocButton = styled(({ color, ...other }) => <Button {...other} />)({
    background: (props) =>
      props.selected 
        ? '#131e29'
        : 'transparent',
    border:'none',
    // borderBottom: '2px solid white',
    width:'100%',
    position: 'relative',
    color: 'white',
    fontSize: 28,
    letterSpacing: '1px',
    fontWeight: 'lighter',
    minHeight: 100,
    padding: '0 30px',

    
  });


const YearButton = styled(({ color, ...other }) => <Button {...other} />)({
    background: (props) =>
      props.clicked === 'true'
        ? '#a1a9aa'
        : 'transparent',
    // borderBottom: '2px solid white',
    width:'80%',
    color: (props)=>
        props.clicked === 'true' ?
        '#1d2732'
        : '#a1a9aa', 
    border: '1px solid #a1a9aa',      
    fontSize: 32,
    
    margin: '0 10px 10px 10px',    
    '&:hover':  {
        backgroundColor: '#a1a9aa',
        color: '#1d2732'
    }
  });
  
  
const Sidebar = (props) => {

    const [menu, setMenu] = useState('region')

    const classes = styles(props);

    const handleClick = (e) => {
        // props.setDefaultState();
        const geo = document.getElementById(e.currentTarget.value)
        // console.log(geo)

        const center = geo.getAttribute('center').split(',')
        const centerFloat = [parseFloat(center[0]),parseFloat(center[1])]
        props.setDefaultState();
        props.handleClick(geo.getAttribute('id'), centerFloat, geo.getAttribute('zoom'))
    }

    const handleReset = () => {
        props.setDefaultState();

        props.handleClick('', props.config.center, props.config.zoom)
    }


    const LocationButton = (props) => {

        // console.log(props.selected)
        return (
            <div key={props.i} id={`button-${props.value}`} value={props.value} className={`test`}>
                <LocButton
                    selected={props.selected}
                    value={props.value}
                    onClick={props.handleClick}
                >
                {props.children}
                </LocButton>
            </div>
            
        )
    }

    const handleRegionSelect = (e) => {
        let region = e.currentTarget.value
        console.log('handleRegion', e)
        setMenu('locations');
        props.setDefaultState();
        props.handleZoomRegion(region)

    }

    var prefix = process.env.NODE_ENV === 'development' ? '../': "./"; 

    return (
        <div className={classes.sidebarContainer}>
            <div className={classes.imgContainer} onClick={handleReset}><img src={`${prefix}img/${props.prov}_banner.png`} /></div>
            <div className={`${classes.buttonContainer}`}>
                <CSSTransition
                    in={menu==="region"} 
                    timeout={600}
                    unmountOnExit
                    classNames="menu-primary"
                >
                    <div className={"menu"}>
                        <LocationButton key="all" value="" handleClick={handleRegionSelect}>All</LocationButton>
                        {Object.keys(props.regionList).map((region,i)=>{
                            return <LocationButton key={`region-${i}`} value={region} handleClick={handleRegionSelect}>{region}</LocationButton>
                        })}
                        
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={menu==="locations"} 
                    timeout={600}
                    unmountOnExit
                    classNames="menu-secondary"
                >
                    <div className={"menu"}>

                    <LocationButton key="back" handleClick={()=>setMenu('region')}>Back</LocationButton>
                    {props.data && props.data.data.filter((ed)=>{
                        if (props.selectedRegion) {
                            let index = props.regionList[props.selectedRegion].EDList.findIndex(el=>el === ed.name)
                            if (index > -1) {
                                return ed
                            }
                        } else return ed
                    })
                    .sort((a,b)=>{
                        if (a.name > b.name) {
                            return 1
                        } else return -1
                    })
                    .map((el,i)=>{
                        return (
                                <LocationButton key={`riding-${i}`} handleClick={handleClick} selected={props.value === el.name} value={el.name} >{el.name}</LocationButton>
                        )
                    })
                    }
                        </div>

                </CSSTransition>
            </div>

            {props.config && <div className={classes.yearContainer}>
                <YearButton year="2020" onClick={()=>props.handleYear('2020')} clicked={props.year==='2020' ? 'true' : 'false'}>2020</YearButton>
                <YearButton year={props.config.prevElectionYear} onClick={()=>props.handleYear(props.config.prevElectionYear)} clicked={props.year===props.config.prevElectionYear ? 'true' : 'false'}>{props.config.prevElectionYear}</YearButton>
            </div>}
        </div>
    );
}

export default Sidebar;