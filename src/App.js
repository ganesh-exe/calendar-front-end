import Calendar from '../node_modules/react-calendar';
import { TextField } from '@material-ui/core';
import "../node_modules/react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { TextareaAutosize } from '@material-ui/core';
import axios from 'axios';
import TimezoneSelect from 'react-timezone-select';  

var timezone=""

function App() {
  const [dateState, setDateState] = useState(new Date())
  const[appointmentTime,setAppointmentTime]=useState("");
  const[appointmentDate,setAppointmentDate]=useState("");
  const[appointmentContent,setAppointmentContent]=useState("");
  const[appointmentTimeZome,setAppointmentTimeZone]=useState("");
  const[listOfAppointments,setListOfAppointments]=useState([]);

 
  const [selectedTimezone, setSelectedTimezone] = useState({})

  const [time,setTime]=useState([]);
  const useStyles = makeStyles((theme) => ({
    
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      
    },
    textField: {
      paddingRight:35,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 190,
    },
    button: {
      paddingTop:20,
      paddingLeft:42,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    desc:{
    paddingTop:20,
    paddingLeft:20,
    maxHeight:35,
    width:100
    },
    list:{
      paddingBottom:30,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxHeight:120
    },
    appointment:{
      paddingTop:10,
      paddingBottom:40,
      paddingLeft:35,
      width:70,
      maxHeight:70
      },
    timezone:{
      paddingLeft:5,
      paddingTop:15,
      width:190
    },
  }));
  const classes = useStyles();
  //eslint-disable-next-line
  React.useEffect(()=>{
    setTime(new Date().toLocaleTimeString());
  });  
//eslint-disable-next-line
  const [dt, setDt] = useState(new Date().toLocaleString());

  React.useEffect(() => {
      let secTimer = setInterval( () => {
        setDt(new Date().toLocaleString())
        },1000)
  
      return () => clearInterval(secTimer);
  }, []);

  const changeDate = (e) => {
    setDateState(e)
var localdate={
  date:(`${e.getDate()} / ${e.getMonth()+1} / ${e.getFullYear()}`)
}
    axios.post('https://ganesh-calendar-back-end.herokuapp.com/getEvents',localdate).then(res=>{setListOfAppointments(res.data)
  console.log(res.data)})
  }
  return (
    <div className="App">
      <Box display="flex" justifyContent="center" paddingTop={15}
      alignItems="center">
      <b>Current Time : {time}</b></Box>
      <Box display="flex" justifyContent="center" 
      alignItems="center">
      
      </Box>
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={5}
      paddingLeft={2}
      >
      <div style={{paddingRight:70, paddingBottom:200 }} className={classes.list} >
        <b><p>‎ㅤㅤ List of Appointments  </p></b>
        <div className={classes.appointment}>
        <TextareaAutosize aria-label="empty textarea" placeholder="Appointments Lists" value={
          listOfAppointments.map((appointment) => (
            `${appointment.description} @ ${appointment.time}  ${appointment.timeZone}`
          ))
        } />
        </div>
      </div>
        <b>
        <Calendar
        value={dateState}
        onChange={changeDate}
        >
        </Calendar> 
        </b>

        <div style={{paddingLeft:80, paddingBottom:110 }} >
        <b><p>‎ㅤㅤ Add appointment  </p></b>
        
        <form className={classes.container} noValidate>
        <TextField
       id="datetime-local"
       label="Select date & time"
       type="datetime-local"
       defaultValue="datetime-local"
       className={classes.textField}
       onChange={((e)=>{
        const a= new Date(e.target.value)
        setAppointmentTime(`${a.getHours()} : ${a.getMinutes()}`)
        setAppointmentDate(`${a.getDate()} / ${a.getMonth()+1} / ${a.getFullYear()}`)
       setAppointmentTimeZone(a.getTimezoneOffset())
        })}
       InputLabelProps={{
       shrink: true,
        }}
        />
        </form>
        <form className={classes.container} noValidate>
        <TimezoneSelect
        className={classes.timezone}
          value={timezone}
          onChange={((e)=>{
           setSelectedTimezone(e.label)
           timezone=(e.label).toString
           console.log(timezone)
          })}
        />
        </form>
        
        <div className={classes.desc}>
        <TextareaAutosize aria-label="empty textarea" placeholder="Appointment Description" onChange={((e)=>{
          setAppointmentContent(e.target.value)
        })}/>
        </div>
    <div className={classes.button}>
    <Button variant="contained" onClick={(()=>{
      alert(selectedTimezone)
      var localAppointement={
          time:appointmentTime,
          date:appointmentDate,
          timeZone:selectedTimezone,
          description:appointmentContent,
      }
       axios.post('https://ganesh-calendar-back-end.herokuapp.com/addEvent',localAppointement).then(res=>{
         if(res.data)
         alert("Added successfully")
       })
    })}><b>Submit</b></Button></div>
    </div>
      </Box>
      <Box display="flex" justifyContent="center"
      alignItems="center"><p>Date you have selected is <b>{moment(dateState).format('MMMM Do YYYY')}</b></p></Box>
      
      
    </div>
  );
}
App.propTypes = {
  name: PropTypes.string,
};

export default App;
