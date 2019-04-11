//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/cadastro-jogo-api';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//Esquema da collection do Mongo
var gameSchema = mongo.Schema({
	nome : { type: String }, 
	anoLancamento : { type: Number }, 
	plataformas : [ { nomePlataforma: { type: String } } ], 
	descricao : { type: String }, 
	urlImage: { type: String }, 
	updated_at: { type: Date, default: Date.now },
});

//Model da aplicação
var Model = mongo.model('Jogos', gameSchema);

//PUT - Atualiza um registro
app.put("/api/jogo/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  { return next(err); } else { res.json(post); }
  });
});

//GET - Retorna todos os registros existentes no banco
app.get("/api/jogo", function (req, res) {
	Model.find(function(err, todos) {
		if (err) { res.json(err); } else { res.json(todos); }
	})
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/api/jogo/:nome?", function (req, res) {
	var nome = req.params.nome;
	Model.find({'nome': nome}, function(err, regs) {
		if (err) { console.log(err); res.send(err); } else { res.json(regs); }
	});
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/api/jogo/plataforma/:nomePlataforma?", function (req, res) {
	var nomePlataforma = req.params.nomePlataforma;
	Model.find( { "plataformas.nomePlataforma" : nomePlataforma }, function(err, regs) {
		if (err) { console.log(err); res.send(err); } else { res.json(regs); }
	});
});

//POST - Adiciona um registro
app.post("/api/jogo", function (req, res) {
	var register = new Model({
		'nome' : req.body.nome,
		'anoLancamento' : req.body.anoLancamento,
		'descricao' : req.body.descricao,
		'urlImage' : req.body.urlImage,
		'plataformas' : req.body.plataformas 
	});
	register.save(function (err) {
		if (err) { console.log(err); res.send(err); res.end(); }
	});
	res.send(register);
	res.end();
});


//DELETE - Deleta um registro
app.delete("/api/jogo/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//Porta de escuta do servidor
app.listen(8081, function() {
	console.log('Funcionando');
});