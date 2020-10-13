import React from 'react'
import SwipeableViews from 'react-swipeable-views';

import {
    makeStyles, 
    IconButton
} from '@material-ui/core';

import ReactModal from 'react-modal'

import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const styles = makeStyles(props=>({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '80%',
        minHeight: 'fit-content',
        border: 'none',
        width: '80%',
        maxWidth: '1200px',
        top: '10%',
        left: '10%',
        borderRadius: '15px',
        backgroundColor: '#202b36',
        color: '#FFFFFF',
        fontSize: '20px',
        zIndex: 30,
        overflowY: 'auto',
        outline: 'none',
        boxShadow: '2px 2px #1d1d1d81',
        '& svg': {
          fontSize: '2rem'
        }

      },
      modalContainer: {
        height: '1800px',
        minHeight: '100%',
        position: 'relative'
      },
      overlay: {
          backgroundColor: 'none',
          opacity: 1
      }, 
      closeButton: {
        position: 'absolute',
        color: 'grey',
        fontSize: '20px',
        padding: '2px',
        borderRadius: '15px',
        backgroundColor: '#131d27',
        left: 5,
        top: 5,
        zIndex: 20,
        '&:hover': {
            cursor: 'pointer'
        }
      },
      chartView: {
        margin: 10,
        display: 'flex',
        justifyContent: 'center'
      },
      modalBody: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxHeight: '100%',
      }, 
      modalTitle: {
          padding: 20,
          textAlign: 'center',
          fontSize: 46
      },
      resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        margin: 10
      },
      resultsDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        margin: 10
      },
      candidateContainer: {
        backgroundColor: '#131d27',
        margin: 15,
        borderRadius: 5,
        display: 'flex',
        height: 120,
      },
      imgDiv: {
        height: '100%',
        position: 'relative',
        backgroundColor: 'red',
        borderRadius: 5,
        // minWidth: props=>props.year === '2020' && 100,
        paddingLeft: props=>props.year !== '2020' && 10,
        // width: 'auto',
        '& img': {
            width: 0,
            transition: 'width 200ms',
            height: '100%',
            marginLeft: 10,
            borderRadius: 5, 
        }
      },
      candidateDiv: {
        // margin: 10
        display: 'flex', 
        flexDirection: 'row'

      },
      candidateInfo: {
        flex: 4, 
        position: 'relative'
      }, 
      voteInfo: {
        flex: 2,
        display: 'flex',
        fontSize: 38,
        alignSelf: 'flex-end', 
        textAlign: 'right',
        paddingRight: 10
    },
      votePercent: {
        flex: 1
      },
      voteTotal: {
        flex: 1
      },
      partyName: {
          fontWeight: 'lighter',
          fontSize: 26,
          letterSpacing: 0.8
      },
      candidateName: {
        fontSize: 46,
        display: 'flex',  
        alignItems: 'baseline', 
        '& #incumbent': {
          fontSize: 24,
          paddingLeft: 10,
          fontStyle: 'italic'
        },
        '& #elected': {
          position: 'absolute', 
          right: 10,
          bottom: -5,

        }
      },

      barContainer: {
          height: 6,
          backgroundColor: 'grey',
        //   margin: 10,
          position: 'relative',
          borderRadius: 6,

      },
      innerBar: {
          width: '50%',
        //   backgroundColor: 'red',
          height: '100%',
          position: "relative",
          borderRadius: '6px 0px 0px 6px',
      }
}))


ReactModal.setAppElement('#root')

const ResultsModal = (props) => {

    const classes = styles(props);

    const closeModal = () => {
        console.log('close')
        props.handleClose();
    }

    const getPartyInfo = (code) => {
      try {
        if (code === 'NDP') {
          let party = {
            "name": 'NDP', 
            "color":"#DD6600"
          }
          return party 
        }
        let party = props.partyList.find(parties=>{
            return parties.nameShort === code
        })
        if (!party) {
            party = {
              "name": code,
              "color": "rgb(192, 192, 192)"
            }
            // party = props.partyList[props.partyList.length -1]
        }
        return party
      } catch (e) {
        console.log(e)
      }
      

    }

    const getHeadshot = (candidate) => {
      const prefix = process.env.NODE_ENV === 'development' ? '../': './';

        if (candidate) {
          let headshotFile = `${prefix}headshots/${candidate.cachedHeadFilename.slice(0,-4)}.jpg`
          return encodeURI(headshotFile);
          
        } else {
          return `${prefix}img/no_headshot.png`
        }
    }


    var prefix = process.env.NODE_ENV === 'development' ? '../': "./";

    return (
        <ReactModal
          isOpen={props.open}
          onRequestClose={closeModal}
          className={classes.modal}
          contentLabel="Example Modal"
        >
        {props.data && <div className={classes.modalContainer}>
            <IconButton className={classes.closeButton} onClick={closeModal} ><CloseIcon /></IconButton>
            <div className={classes.modalBody}>
                <div className={classes.modalTitle}>{props.data.name}</div>
                {/* <SwipeableViews>  */}
                <div className={classes.resultsContainer}>
                  {/* {console.log(props.data.results)} */}
                    {props.data.results.map((contest,i)=>{
                        console.log(contest)
                        let partyDetails = getPartyInfo(contest.partyCode);
                        return (
                            <div key={i} className={classes.candidateContainer}>
                                <div style={{backgroundColor: partyDetails.color}} className={classes.imgDiv}>{props.year === '2020' && <img onLoad={e=>{console.log(e.target.style.width);e.target.style.width = '100px'}} onError={(e) => { e.target.onError = null; e.target.src = `${prefix}img/no_headshot.png` } } src={getHeadshot(contest)}/>}</div>
                                <div className={classes.resultsDiv}>
                                    <div className={classes.candidateDiv}>
                                        <div id="candidateInfo" className={classes.candidateInfo}>
                                            <div className={classes.partyName}>{partyDetails.name}</div>
                                            <div className={classes.candidateName}> 
                                              <div id="candidateName" >{contest.name}</div>
                                              {contest.isIncumbent && <div id="incumbent">incumbent</div>}
                                              {contest.isElected && <div id="elected"><CheckCircleIcon /></div>}
                                            </div>
                                        </div>
                                        <div className={classes.voteInfo}>
                                            <div className={classes.votePercent}>{contest.percent}%</div>
                                            <div className={classes.voteTotal}>{contest.votes.toLocaleString('en')}</div>
                                        </div>
                                    </div>
                                    <div className={classes.barContainer}>
                                        <div style={{backgroundColor: partyDetails.color, width: `${contest.percent}%`}} className={classes.innerBar} /> 
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
                {/* <div className={classes.chartView}>
                  <img src="https://elector.blcloud.net/api/chart/VotePollPercent/?ridingID=856&RidingName=Arm-River&width=1100" />
                // </div>
                </SwipeableViews> */}
            </div>
        </div>}
        </ReactModal>
     );
}

export default ResultsModal;