# Resumo
Para alterar o end point abra o arquivo 
scripts/service.js 

E procure por $http.get e mude o valor entre (), por exemplo:

```
$http.get('data/teste').success(function(data) { 
```

Ira ficar

```
$http.get('v1.0/data/teste2').success(function(data) { 
```




O formato do json esperado é:

```
[
	{
		"senha" : "I039",
		"guiche" : 12
	}
]
```

Para adicionar ao histórico, na proxima requisição a senha tem que ser diferente do que a senha anterior. 


# Armazenamento

As configurações são gravadas no localStorage do navegador, o tempo default é de 10 segundos para a busca de novas senhas e de 5 segundos para alteração de páginas.
