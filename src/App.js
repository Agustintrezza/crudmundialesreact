import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState,} from 'react';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';
import {FaReact} from 'react-icons/fa';

const baseUrl="http://localhost:3000/consolas/"

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 307,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  icono1: {
    cursor: 'pointer',
    color: '#da4242',
    marginRight: '5px'
  },
  icono2: {
    cursor: 'pointer',
    color: '#023047;'
  },
  inputMaterial: {
    width: '100%',
    color: '#da4242',
    fontFamily: 'Quicksand',
    marginTop: '9px'
  },
  button: {
    backgroundColor: '#ffb703',
    color: 'white',
    fontFamily: 'Quicksand',
    "&:hover": {
      backgroundColor: '#fb8500'
    },
  },
  button1: {
    backgroundColor: '#da4242',
    color: 'white',
    marginLeft: '15px',
    marginTop: '20px',
    fontFamily: 'Quicksand',
    "&:hover": {
      backgroundColor: '#c23c3c',
    },
  },
  button2: {
    backgroundColor: '#eaa804',
    marginLeft: '15px',
    marginTop: '20px',  
    color: 'white',
    fontFamily: 'Quicksand',
    "&:hover": {
      backgroundColor: '#d99c03',
    },
  },

  hoover: {
    "&:hover": {
      backgroundColor: '#219ebc',
      // cursor: 'pointer'
    }
  },
  container: {
    width: '90%',
    margin: 'auto'
  },
  row: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Quicksand'
  },
  row2: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Quicksand'
  },
  center: {
    textAlign: 'center'
  },
  tabheader: {
    backgroundColor: '#ffb703',
    borderBottom: '2px solid #023047'
  }
}));

function App() {

  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    selecciones: '',
    titulos: '',
    años: '',
    ranking_fifa: ''
  })

  const handleChange=e=> {
    const {name, value} = e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  const peticionGet = async()=> {
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data)
    })
  }

  const peticionPost=async()=> {
    await axios.post(baseUrl, consolaSeleccionada)
    .then(response=>
      setData(data.concat(response.data)),
      abrirCerrarModalInsertar()
    )
  }

  const peticionPut=async() => {
    await axios.put(baseUrl+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=> {
        if(consolaSeleccionada.id === consola.id) {
          consola.seleccion=consolaSeleccionada.seleccion;
          consola.titulos=consolaSeleccionada.titulos;
          consola.años=consolaSeleccionada.años;
          consola.ranking_fifa=consolaSeleccionada.ranking_fifa;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

 const peticionDelete=async()=> {
    await axios.delete(baseUrl+consolaSeleccionada.id)
    .then(response=> {
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id))
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=> {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=> {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=> {
    setModalEliminar(!modalEliminar)
  }

  const seleccionarConsola=(consola, caso)=>{
    setConsolaSeleccionada(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(()=> {
   peticionGet();
  }, [])

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar una Nueva Selección</h3>
      <TextField InputProps={{ style: { fontFamily: 'Quicksand' } }} name="seleccion" className={styles.inputMaterial} label="Selección" onChange={handleChange}/>
      <br/>
      <TextField name="titulos" className={styles.inputMaterial} label="Títulos" onChange={handleChange}/>
      <br/>
      <TextField name="años" className={styles.inputMaterial} label="Años" onChange={handleChange}/>
      <br/>
      <TextField name="ranking_fifa" className={styles.inputMaterial} label="Puesto FIFA (hoy)" onChange={handleChange}/>
      <br/><br/>

      <div className="contenedor-botones">
        <Button className={styles.button2} variant="contained"  color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button className={styles.button1} variant="contained" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar Consola</h3>
      <TextField name="seleccion" className={styles.inputMaterial} label="Seleccion" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.seleccion}/>
      <br/>
      <TextField name="titulos" className={styles.inputMaterial} label="Títulos" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.titulos}/>
      <br/>
      <TextField name="años" className={styles.inputMaterial} label="Años" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.años}/>
      <br/>
      <TextField name="ranking_fifa" className={styles.inputMaterial} label="Puesto FIFA (hoy)" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.ranking_fifa}/>
      <br/><br/>

      <div className="contenedor-botones">
        <Button className={styles.button2} variant="contained" color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button className={styles.button1} variant="contained" onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar a la selección <b>{consolaSeleccionada && consolaSeleccionada.seleccion}</b> ? </p>
      <div className="contenedor-botones">
        <Button className={styles.button2} color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button className={styles.button1} onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

  return (
    <div className="App">

      <div className="contenedor-general-header">
        <div className="contenedor-header">
          <div className="logo">
            <h2 className="titulo-logo">MUNDIALES API</h2>
            <FaReact className="logo-react"/>
          </div>
          <div>
            <Button className={styles.button} variant="contained" onClick={()=>abrirCerrarModalInsertar()}>Crear</Button>
          </div>
        </div>
      </div>
      
      
      <br/><br/>
      <TableContainer className={styles.container}>
        <Table>
          <TableHead>
            <TableRow className={styles.tabheader}>
              <TableCell className={styles.row}>Selección</TableCell>
              <TableCell className={styles.row2}>Mundiales Ganados</TableCell> 
              <TableCell className={styles.row2}>Ediciones</TableCell>
              <TableCell className={styles.row2}>Ranking FIFA <span>(hoy)</span></TableCell>
              <TableCell className={styles.row}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(consola=>(
              <TableRow key={consola.id} className={styles.hoover}>
                <TableCell>{consola.seleccion}</TableCell>
                <TableCell className={styles.center}>{consola.titulos}</TableCell>
                <TableCell className={styles.center}>{consola.años}</TableCell>
                <TableCell className={styles.center}>{consola.ranking_fifa}</TableCell>
                <TableCell>
                  <Edit className={styles.icono2} onClick={()=>seleccionarConsola(consola, 'Editar')}/>
                  &nbsp;
                  <Delete className={styles.icono1} onClick={()=>seleccionarConsola(consola, 'Eliminar')} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalInsertar}
        onClose={()=>abrirCerrarModalInsertar()}>
        {bodyInsertar}
      </Modal>
      <Modal
        open={modalEditar}
        onClose={()=>abrirCerrarModalEditar()}>
        {bodyEditar}
      </Modal>
      <Modal
        open={modalEliminar}
        onClose={()=>abrirCerrarModalEliminar()}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default App;
