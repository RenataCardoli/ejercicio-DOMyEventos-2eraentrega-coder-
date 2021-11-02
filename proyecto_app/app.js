let list = [];

function Lista(list){
	let table = '<thead><tr><td>Descripcion</td><td>Cantidad</td><td>Valor</td><td>Accion</td></tr></thead><tbody>';
	for(var key in list){
		table += '<tr><td>'+ formatDesc(list[key].desc) +'</td><td>'+ formatCantidad(list[key].cant) +'</td><td>'+ formatValor(list[key].valor) +'</td><td><button class="btn btn-warning" onclick="updateID('+key+');">Editar</button> <button class="btn btn-dark" onclick="BorrarItem('+key+');">Borrar</button></td></tr>';
	}
	table += '</tbody>';

	document.getElementById('listTable').innerHTML = table;
	Total(list);
	guardarListStorage(list);
}

function formatDesc(desc){
	let nombreDescripcion = desc.toLowerCase();
	nombreDescripcion = nombreDescripcion.charAt(0).toUpperCase() + nombreDescripcion.slice(1); 
	return nombreDescripcion;
}

function formatCantidad(cant){
	return parseInt(cant);
}

function formatValor(valor){
	let NValor = parseFloat(valor).toFixed(2) + "";
	NValor = NValor.replace(".",",");
	NValor = "$ " + NValor;
	return NValor;
}

function agregarData(){
	if(!validacion()){
		return;
	}
	let desc = document.getElementById("desc").value;
	let cant = document.getElementById("cant").value;
	let valor = document.getElementById("valor").value;

	list.unshift({"desc":desc , "cant":cant , "valor":valor });
	Lista(list); 
}

function updateID(id){
	let objeto = list[id];
	document.getElementById("desc").value = objeto.desc;
	document.getElementById("cant").value = objeto.cant;
	document.getElementById("valor").value = objeto.valor;
	document.getElementById("btnUpdate").style.display = "inline-block";
	document.getElementById("btnAdd").style.display = "none";

	document.getElementById("newIDupdate").innerHTML = '<input id="idUpdate" type="hidden" value="'+id+'">';
}

function resetForm(){
	document.getElementById("desc").value = "";
	document.getElementById("cant").value = "";
	document.getElementById("valor").value = "";
	document.getElementById("btnUpdate").style.display = "none";
	document.getElementById("btnAdd").style.display = "inline-block";
	
	document.getElementById("newIDupdate").innerHTML = "";
	document.getElementById("errores").style.display = "none";
}

function Total(lista){
	var total = 0;
	for(var key in lista){
		total += lista[key].valor * lista[key].cant;
	}
	document.getElementById("valorTotal").innerHTML = formatValor(total);
}


function updateData(){
	if(!validacion()){
		return;
	}
	let id = document.getElementById("idUpdate").value; //Atribuyo un nuevo valor al "ID" con nuevo valor, descripción y cantidad.
	let desc = document.getElementById("desc").value;
	let cant = document.getElementById("cant").value;
	let valor = document.getElementById("valor").value;

	list[id] = {"desc":desc, "cant":cant, "valor":valor};
	resetForm();
	Lista(list);
}

function BorrarItem(id){
	if(confirm('Borrar ese item?')) {
		let index = list.findIndex((_item,index) => { //El array findIndex() de donde fue llamado (list). https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex 
		return index == id; 
		});
	
		if (index != -1) {
		list.splice(index, 1);
		}
		Lista(list);
	}
} //De esta manera se buscará el índice y se borrará sólo éste. 

//validacion y errores
function validacion(){
	let desc = document.getElementById("desc").value;
	let cant = document.getElementById("cant").value;
	let valor = document.getElementById("valor").value;
	let errores = "";
	document.getElementById("errores").style.display = "none"; 

	if(desc === ""){
		errores += '<p>¡el campo Descripcion está vacío!</p>';
	}
	if(cant === ""){
		errores += '<p>¡el campo Cantidad está vacío!</p>';
	}else if(cant != parseInt(cant)){
		errores += '<p>Por favor insira un valor númerico válido en el campo cantidad</p>';
	}
	if(valor === ""){
		errores += '<p>¡el campo Valor está vacío!</p>';
	}else if(valor != parseFloat(valor)){
		errores += '<p>Por favor insira un valor $ válido </p>';
	}

	if(errores != ""){
		document.getElementById("errores").style.display = "block"; 
		document.getElementById("errores").innerHTML = "<h3>Oops, creo que nos hemos perdido algo! </h3>" + errores;
		return false;
	}else{
		return true;
	}
}

function borrarLista(){
	if (confirm("¿Desea eliminar todos los elementos de esta lista?")){
		list = [];
		Lista(list);
	}
}

function guardarListStorage(list){
	let jsonStr = JSON.stringify(list);
	localStorage.setItem("list",jsonStr);
}

function iniciarListStorage(){
	let obtenerLista = localStorage.getItem("list");
	if(obtenerLista){
		list = JSON.parse(obtenerLista);
	}
	Lista(list);
}

iniciarListStorage();

//Registrar gastos y Consultar Gastos

class Gasto {
	constructor(ano, mes, dia, tipo, descripcion, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descripcion = descripcion
		this.valor = valor
	}

	validarDatos() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	registro(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosLosRegistros() {

		let gastos = Array()

		let id = localStorage.getItem('id')

		//recuperar todos los gastos registrados en localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar el gasto
			let gastosOld = JSON.parse(localStorage.getItem(i))

			//existe la posibilidad de que haya índices que se hayan saltado/eliminado
			//en estos casos omitiré estos índices
			if(gastosOld === null) {
				continue
			}
			gastosOld.id = i
			gastos.push(gastosOld)
		}

		return gastos
	}

	buscar(gastoN){

		let gastosFiltro = Array()
		gastosFiltro = this.recuperarTodosLosRegistros()
		console.log(gastosFiltro);
		console.log(gastoN)
		if(gastoN.ano != ''){
		console.log("filtro del año");
		gastosFiltro = gastosFiltro.filter(d => d.ano == gastoN.ano)
		}
		if(gastoN.mes != ''){
		console.log("filtro del mes");
		gastosFiltro = gastosFiltro.filter(d => d.mes == gastoN.mes)
		}
		if(gastoN.dia != ''){
		console.log("filtro del dia");
		gastosFiltro = gastosFiltro.filter(d => d.dia == gastoN.dia)
		}
		if(gastoN.tipo != ''){
		console.log("filtro del tipo");
		gastosFiltro = gastosFiltro.filter(d => d.tipo == gastoN.tipo)
		}
		if(gastoN.descricao != ''){
			console.log("filtro de descripcion");
			gastosFiltro = gastosFiltro.filter(d => d.descricao == gastoN.descricao)
		}
		if(gastoN.valor != ''){
			console.log("filtro del valor");
			gastosFiltro = gastosFiltro.filter(d => d.valor == gastoN.valor)
		}
		return gastosFiltro
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function registroGastos() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descripcion = document.getElementById('descripcion')
	let valor = document.getElementById('valor')

	let gastos = new Gasto(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descripcion.value,
		valor.value
	)


	if(gastos.validarDatos()) {
		bd.registro(gastos)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido con éxito'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'El nuevo gasto fue registrado com éxito!'
		document.getElementById('modal_btn').innerHTML = 'Ok'
		document.getElementById('modal_btn').className = 'btn btn-success'
		
		//sucess
		$('#modalRegistroGasto').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descripcion.value = ''
		valor.value = ''
		
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Error en la inclusion del nuevo registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Error de registro, por favor compruebe que todos los campos han sido rellenados correctamente.!'
		document.getElementById('modal_btn').innerHTML = 'Volver y corregir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		
		//error
		$('#modalRegistroGasto').modal('show') 
	}
}

function cargaListaGastos(gastos = Array(), filtro = false) {

    if(gastos.length == 0 && filtro == false){
		gastos = bd.recuperarTodosLosRegistros() 
	}
	
	let listaGastos = document.getElementById("listaGastos")
    listaGastos.innerHTML = ''
	gastos.forEach(function(d){
		//Creación de la fila (tr)
		var linha = listaGastos.insertRow();

		//Creación de las columnas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar el tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentacion'
				break
			case '2': d.tipo = 'Educacion'
				break
			case '3': d.tipo = 'Bienestar'
				break
			case '4': d.tipo = 'Salud'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descripcion
		linha.insertCell(3).innerHTML = d.valor

		//Crear el botón de exclusion
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(d)
	})

}

function buscarGastos(){

	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descripcion = document.getElementById("descripcion").value
	let valor = document.getElementById("valor").value

	let gasto = new Gasto(ano, mes, dia, tipo, descripcion, valor)

	let gastos = bd.buscar(gasto)
	this.cargaListaGastos(gastos, true)


}

