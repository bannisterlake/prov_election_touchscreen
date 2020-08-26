import React from 'react'

import {
    makeStyles, 
    IconButton
} from '@material-ui/core';

import ReactModal from 'react-modal'

import CloseIcon from '@material-ui/icons/Close';

const contestTest=  {
    "sysId": 856,
    "name": "Arm River",
    "broadcastName": "",
    "line1": "",
    "line2": "",
    "id": 1,
    "pollsReported": 67,
    "pollsTotal": 67,
    "votes": 8352,
    "isNew": true,
    "modifiedDate": "2020-03-06T03:41:38Z",
    "candidateShowCount": null,
    "pollsClosingTime": null,
    "isPollsClosed": null,
    "pollsClosingTime24": null,
    "results": [
      {
        "name": "Greg Brkich",
        "partyId": 191,
        "votes": 6128,
        "percent": 73.4,
        "isElected": true,
        "isIncumbent": true,
        "modifiedDate": "2020-03-06T03:41:38Z",
        "partyDatafeedChar": "SP",
        "partyCode": "SP",
        "cachedHeadFilename": "BRKICH_Greg_SP_1.png"
      },
      {
        "name": "Denise Leduc",
        "partyId": 188,
        "votes": 1424,
        "percent": 17.0,
        "isElected": false,
        "isIncumbent": false,
        "modifiedDate": "2020-03-06T03:41:38Z",
        "partyDatafeedChar": "NDP",
        "partyCode": "NDP",
        "cachedHeadFilename": "LEDUC_Denise_NDP_1.png"
      },
      {
        "name": "Raymond Carrick",
        "partyId": 190,
        "votes": 339,
        "percent": 4.1,
        "isElected": false,
        "isIncumbent": false,
        "modifiedDate": "2020-03-06T03:41:38Z",
        "partyDatafeedChar": "PC",
        "partyCode": "PC",
        "cachedHeadFilename": "CARRICK_Raymond_PC_1.png"
      },
      {
        "name": "Dale Dewar",
        "partyId": 184,
        "votes": 256,
        "percent": 3.1,
        "isElected": false,
        "isIncumbent": false,
        "modifiedDate": "2020-03-06T03:41:38Z",
        "partyDatafeedChar": "GRN",
        "partyCode": "GRN",
        "cachedHeadFilename": "DEWAR_Dale_GRN_1.png"
      },
      {
        "name": "Russ Collicott",
        "partyId": 186,
        "votes": 205,
        "percent": 2.5,
        "isElected": false,
        "isIncumbent": false,
        "modifiedDate": "2020-03-06T03:41:38Z",
        "partyDatafeedChar": "LIB",
        "partyCode": "LIB",
        "cachedHeadFilename": "COLLICOTT_Russ_LIB_1.png"
      }
    ]
  }

const styles = makeStyles({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '80%',
        minHeight: 'fit-content',
        border: 'none',
        width: '80%',
        maxWidth: '1000px',
        top: '10%',
        left: '10%',
        borderRadius: '15px',
        backgroundColor: '#202b36',
        color: '#FFFFFF',
        fontSize: '20px',
        zIndex: 20,
        outline: 'none',
        boxShadow: '2px 2px #1d1d1d81',
        '& div': {
            maxHeight: '100%'
        }

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
        '&:hover': {
            cursor: 'pointer'
        }
      },
      modalBody: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxHeight: '100%',
      }, 
      modalTitle: {
          padding: 15,
          textAlign: 'center',
          fontSize: 36
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
        height: 90,
      },
      imgDiv: {
        height: '100%',
        position: 'relative',
        backgroundColor: 'red',
        borderRadius: 5,
        minWidth: 80,
        width: 'auto',
        '& img': {
            height: '100%',
            marginLeft: 6,
            borderRadius: 5, 
        }
      },
      candidateDiv: {
        // margin: 10
        display: 'flex', 
        flexDirection: 'row'

      },
      candidateInfo: {
        flex: 3, 
        position: 'relative'
      }, 
      voteInfo: {
        flex: 2,
        display: 'flex',
        fontSize: 24,
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
          fontSize: 18,
          letterSpacing: 0.8
      },
      candidateName: {
        fontSize: 30,
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
})


ReactModal.setAppElement('#root')

const ResultsModal = (props) => {

    const classes = styles();

    const closeModal = () => {
        console.log('close')
        props.handleClose();
    }

    const getPartyInfo = (id) => {
        let party = props.partyList.find(parties=>{
            return parties.id === id
        })
        if (!party) {
            party = props.partyList[props.partyList.length -1]
        }
        console.log(party)
        return party
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
            <IconButton onClick={closeModal} ><CloseIcon className={classes.closeButton}/></IconButton>
            <div className={classes.modalBody}>
                <div className={classes.modalTitle}>{props.data.name}</div>
                <div className={classes.resultsContainer}>
                    {props.data.results.map((contest,i)=>{
                        let partyDetails = getPartyInfo(contest.partyId);
                        return (
                            <div key={i} className={classes.candidateContainer}>
                                <div style={{backgroundColor: partyDetails.colour}} className={classes.imgDiv}><img src={`${prefix}img/headshot.png`}/></div>
                                <div className={classes.resultsDiv}>
                                    <div className={classes.candidateDiv}>
                                        <div id="candidateInfo" className={classes.candidateInfo}>
                                            <div className={classes.partyName}>{partyDetails.name}</div>
                                            <div className={classes.candidateName}>{contest.name}</div>
                                        </div>
                                        <div className={classes.voteInfo}>
                                            <div className={classes.votePercent}>{contest.percent}%</div>
                                            <div className={classes.voteTotal}>{contest.votes.toLocaleString('en')}</div>
                                        </div>
                                    </div>
                                    <div className={classes.barContainer}>
                                        <div style={{backgroundColor: partyDetails.colour, width: `${contest.percent}%`}} className={classes.innerBar} /> 
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
            </div>
        </div>}
        </ReactModal>
     );
}

export default ResultsModal;