import React, {useState} from 'react';
import {
    makeStyles,
    styled,
    Button

} from '@material-ui/core'

import {CSSTransition} from 'react-transition-group'

const styles = makeStyles({
    sidebarContainer: {
        flex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',         
        backgroundColor: '#202b36',
        position: 'relative',
        overflow: 'hidden',
    },
    imgContainer: {
        height: '150px',
        padding: 30,
        borderBottom: '3px solid #131d27',
        display: 'flex', 
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 20,
        '& img': {
            height: '150px',
            width: 'auto'
        }
    },
    buttonContainer: {
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        width: '100%', 
        // overflow: 'hidden',
        zIndex: 10,
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
        height: '100px',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: '0',
        width: '100%', 
        backgroundColor: '#202b36',
        zIndex: 21
    }
   
});

const LocButton = styled(({ color, ...other }) => <Button {...other} />)({
    background: (props) =>
      props.clicked === 'true'
        ? '#20303f'
        : 'transparent',
    border:'none',
    // borderBottom: '2px solid white',
    width:'100%',
    position: 'relative',
    color: 'white',
    fontSize: 20,
    letterSpacing: '1px',
    fontWeight: 'lighter',
    height: 75,
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
    fontSize: 20,
    
    margin: '0 10px 10px 10px',    
    '&:hover':  {
        backgroundColor: '#a1a9aa',
        color: '#1d2732'
    }
  });
  
  
const Sidebar = (props) => {

    const [menu, setMenu] = useState('region')

    const classes = styles();

    const handleClick = (e) => {
        // props.setDefaultState();
        const geo = document.getElementById(e.currentTarget.value)
        // console.log(geo)

        const center = geo.getAttribute('center').split(',')
        const centerFloat = [parseFloat(center[0]),parseFloat(center[1])]
        props.handleClick(geo.getAttribute('id'), centerFloat, geo.getAttribute('zoom'))
    }

    const handleReset = () => {
        props.setDefaultState();

        props.handleClick('', [-66, 45.9], 47)
    }


    const LocationButton = (props) => {
        return (
            <div key={props.i} id={`button-${props.value}`}  className={`test`}>
                    <LocButton
                    value={props.value}
                // className={`${classes.LocationButton} menu-item`}
                // onMouseEnter={()=>toggleArrow(props.resultId)}
                // onMouseLeave={()=>toggleArrow(0)}
                onClick={props.handleClick}
            >
                {props.children}
                </LocButton>
            </div>
            
        )
    }

    const handleRegionSelect = (props) => {
        setMenu('locations')
    }


    var prefix = process.env.NODE_ENV === 'development' ? '../': "./"; 

    return (
        <div className={classes.sidebarContainer}>
            <div className={classes.imgContainer} onClick={handleReset}><img src={`${prefix}/img/banner.png`} /></div>
            <div className={`${classes.buttonContainer}`}>
                <CSSTransition
                    in={menu==="region"} 
                    timeout={600}
                    unmountOnExit
                    classNames="menu-primary"
                >
                    <div className={"menu"}>
                        <LocationButton handleClick={handleRegionSelect}>All</LocationButton>
                        <LocationButton handleClick={handleRegionSelect}>Fredericton</LocationButton>
                        <LocationButton handleClick={handleRegionSelect}>Moncton</LocationButton>
                        <LocationButton handleClick={handleRegionSelect}>Saint John</LocationButton>
                        {/* <LocationButton onClick={handleClick} value={el.name} >{el.name}</LocationButton> */}
                        </div>
                </CSSTransition>
                <CSSTransition
                    in={menu==="locations"} 
                    timeout={600}
                    unmountOnExit
                    classNames="menu-secondary"
                >
                    <div className={"menu"}>

                    <LocationButton handleClick={()=>setMenu('region')}>Back</LocationButton>
                    {props.data && props.data.data.sort((a,b)=>{
                        if (a.name > b.name) {
                            return 1
                        } else return -1
                    })
                    .map((el,i)=>{
                        return (
                                <LocationButton i={i} handleClick={handleClick} value={el.name} >{el.name}</LocationButton>
                        )
                    })
                    }
                        </div>

                </CSSTransition>
            </div>

            <div className={classes.yearContainer}>
                <YearButton year="2020" onClick={()=>props.handleYear('2020')} clicked={props.year==='2020' ? 'true' : 'false'}>2020</YearButton>
                <YearButton year="2018" onClick={()=>props.handleYear('2018')} clicked={props.year==='2018' ? 'true' : 'false'}>2018</YearButton>
            </div>
        </div>
    );
}

export default Sidebar;