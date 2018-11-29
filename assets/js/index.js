//declaracao global das variaveis
var collection = [];
var global = 0;
var interacao = [0];
var table = [];
var values = [[]];

$(document).ready(function(){

 //montar tabela inicial
  trimTable();

//validador de palavras, letra por letra
  $('#validate').keyup(function(e){
    if(table.length > 0){
      tokenValidate(e);
    }
  });
});

//funçao de montar a tabela
function trimTable(){

//zera os valores para montar novamente
  values = [[]];
  global = 0;
  interacao = [0];
  table = [];

//monta os estados
  moutEstado();

//gera as linhas
  table = generateLines();

//insere os dados na tabela
  tableInsertDados(table);
}

//adiciona tokens
function addWordTocollection () {
    var value = $("#word").val().toLowerCase();

    if(value === ""){
      $('#word').addClass('error');
      setTimeout(function(){
        $('#word').removeClass('error');
      }, 2000);
    } else {
      var addNext = true;
      //verifica se no token a ser adicionado tem algum caractere que nao seja de 'a' a 'z'
      for (var i = 0; i < value.length; i++) {
        if(!((value[i] >= 'a' && value[i] <= 'z') || value[i] === ' ')){
          alert('Caractere inválido ' + value[i]);
          addNext = false;
          break;
        }
      }
      //somente letras (a-z)
      if (addNext) {
        //quebra a string em dois tokens
        value = value.split(" ");
        var number = collection.length;
        //add varios tokens
        if(value.length > 1){
          for (i = 0; i < value.length; i++) {
            var exists = false;
            number = collection.length;
            if(value[i] !== ""){
              //valida o token se nao é vazio ou se ja existe
              for (j = 0; j < collection.length; j++) {
                if(value[i] === collection[j]){
                  exists = true;
                }
              }
              //se nao existir no dicionario e adicionado
              if(!exists){
                $('#listWords').append($('<div class="list-group-item" id="word' + number + '">' + value[i] + ', ' +
                ' </div>'));
                collection.push(value[i]);
              }
            }
          }
        } else {
          var exists = false;
          //verifica se o proximo token nao existe no dicionario
          for (j = 0; j < collection.length; j++) {
            if(value[0] === collection[j]){
              exists = true;
            }
          }
          //se nao existir no dicionario e adicionado
          if(!exists){
            $('#listWords').append($('<td class="list-group-item" id="word' + number + '">' + value[0] +
            ' </td>'));
            collection.push(value[0]);
          }
        }
        //limpa o campo de tokens
        $("#word").val("");
      }
    }

    $('#table-automaton').empty();

    trimTable();
    alert('Paravra adicionada com sucesso!');
}

function removeWord (e) {
  $('#word').val("");
  $('#validate').val("");
  collection = [];
  var word = collection[e];
  var aux = [];
  collection = [];
  collection = aux;
  aux = [];
  $('#listWords').empty();
  $('#table-automaton').empty();
  for (i = 0; i < collection.length; i++) {
    $('#listWords').append($('<td class="list-group-item" id="word' + i + '">' + collection[i] +
    '</td>'));
  }
  alert('Todo as palavras adicionadas foram removidas!');
  trimTable();
}

//metodo monta estados
function moutEstado(){
  //itera sobre todos os tokens do dicionario
  for (var i = 0; i < collection.length; i++) {
    var actualState = 0;
    var word = collection[i];
    //itera sobre os caracteres do token
    for(var j = 0; j < word.length; j++){
      if(typeof values[actualState][word[j]] === 'undefined'){
        var nextState = global + 1;
        values[actualState][word[j]] = nextState;
        values[nextState] = [];
        global = actualState =+ nextState;
      } else {
        actualState = values[actualState][word[j]];
      }
      if(j == word.length - 1){
        values[actualState]['final'] = true;
      }
    }
  }
}

//metodo gerar linhas da tabela
function generateLines(){
  var vectorvalues = [];
  for (var i = 0; i < values.length; i++) {
    var aux = [];
    aux['estado'] = i;
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      if(typeof values[i][letter] === 'undefined'){
        aux[letter] = '-'
      } else {
        aux[letter] = values[i][letter]
      }
    }
    if(typeof values[i]['final'] !== 'undefined'){
      aux['final'] = true;
    }
    vectorvalues.push(aux);
  };
  return vectorvalues;
}
//metodo gerar a tabela
function tableInsertDados(vectorvalues){
  var tableFront = $('#table-automaton');
  tableFront.html('');
  var tr = $(document.createElement('tr'));
  var th = $(document.createElement('th'));
  th.html('');
  tr.append(th);
  var first = 'a';
  var last = 'z';
  for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
    var th = $( document.createElement('th') );
    th.html(String.fromCharCode(j));
    tr.append(th);
  }
  tableFront.append(tr);

  for(var i = 0; i < vectorvalues.length; i++){
    var tr = $(document.createElement('tr'));
    var td = $(document.createElement('td'));
    if(vectorvalues[i]['final']){
      td.html('q' + vectorvalues[i]['estado'] + '*');
    } else {
      td.html('q' + vectorvalues[i]['estado']);
    }
    tr.append(td);
    tr.addClass('state_'+vectorvalues[i]['estado']);
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      var td = $( document.createElement('td') );
      td.addClass('letter_'+letter);
      if(vectorvalues[i][letter] != '-'){
        td.html('q' + vectorvalues[i][letter]);
      } else {
        td.html('-');
      }
      tr.append(td);
    }
    tableFront.append(tr);
  }
}
