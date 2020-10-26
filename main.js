//importando blibliotecas
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

//servidor
const app = express();
const server = http.createServer(app);

app.use(express.static('public'));//add arquivos staticos

app.get('/',(req,res,next) => {
    res.sendFile(__dirname + '/public/index.html')// pegando o enderenço da web

});

server.listen(9999, () => {
     console.log('Porta 192.168.0.101:%d',server.address().port);//numero do IP dp PC
});

const io = socketIO.listen(server);

//importando blibliotecas
const SerialPort = require('serialport');

//configurando a serialport
const Readline = SerialPort.parsers.Readline;
const parser = new Readline({delimiter: '\r\n'});
const mySerial = new SerialPort("COM3",{
    baudRate: 9600,
});
mySerial.pipe(parser);


mySerial.on('open', function(){
    console.log('Conexão com a serial iniciada')
    parser.on('data', function(data){
        console.log(data);
        var dado = parserInt(((data*100/1023)));
        console.log(dado);
        io.emit("Serial:data",{
            Value:dado.toString()
        });
    });
});

//Recebendo dados da serial e passando para web
io.sockets.on('connection',function(socket){
    console.log("Iniciando uma nova conexão");

    socket.on('btnAction',function(btn){
        var dado_web = btn.value;
        console.log(dado_web);
        mySerial.write(dado_web);
        console.log('Enviando ' + dado_web + ' Para Serial')
    });

});



